import { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Card,
  CardActions,
  CardContent,
  Button,
  Box,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stack,
  Accordion,
} from "@mui/material";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRecords from "../../hooks/useRecords";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { DVRiskFile, RISK_FILE_QUANTI_FIELDS } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import prepareRiskFiles from "../../functions/analysis/prepareRiskFiles";
import convergeProbabilities from "../../functions/analysis/convergeProbabilities";
import convergeImpacts from "../../functions/analysis/convergeImpacts";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { CASCADE_ANALYSIS_QUANTI_FIELDS, DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { v4 as uuid } from "uuid";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVContact } from "../../types/dataverse/DVContact";
import calculateMetrics from "../../functions/analysis/calculateMetrics";
import runAnalysis from "../../functions/analysis/runAnalysis";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import CalculationsDataGrid from "./CalculationsDataGrid";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import CalculationsRiskMatrix from "./CalculationsRiskMatrix";
import RiskNetworkGraph from "./RiskNetworkGraph";
import CalculationsCascadeDataGrid from "./CalculationsCascadeDataGrid";
import CalculationsSankeyGraph from "./CalculationsSankeyGraph";

const roundNumberField = (n: number) => {
  if (n > 10) return Math.round(n);

  return Math.round(1000 * n) / 1000;
};

const roundNumberFields = (obj: object) => {
  return (Object.keys(obj) as Array<keyof typeof obj>).reduce(
    (rounded, key) => ({
      ...rounded,
      [key]: typeof obj[key] === "number" ? roundNumberField(obj[key] as number) : obj[key],
    }),
    {}
  );
};

const roundPerc = (v: number) => Math.round(v * 10000) / 100 + "%";

export default function CalculationPage() {
  const api = useAPI();
  const logLines = useRef<string[]>(["Loading data..."]);
  const [updateLog, setUpdateLog] = useState(Date.now());

  const [useableDAs, setUseableDAs] = useState<DVDirectAnalysis<unknown, DVContact>[] | null>(null);
  const [useableCAs, setUseableCAs] = useState<DVCascadeAnalysis<unknown, unknown, DVContact>[] | null>(null);
  const [calculations, setCalculations] = useState<RiskCalculation[] | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [simRuns, setSimRuns] = useState<number>(30);
  const [damping, setDamping] = useState<string>("0.35");

  const logger = (line: string, slice: number = 0) => {
    logLines.current = [...logLines.current.slice(slice), line];
    setUpdateLog(Date.now());
  };

  const {
    data: participations,
    isFetching: loadingParticipations,
    reloadData: reloadParticipations,
  } = useRecords<DVParticipation>({
    table: DataTable.PARTICIPATION,
    onComplete: async (data) => {
      logger(`    Finished loading ${data.length} participations`);
    },
  });
  const {
    data: riskFiles,
    isFetching: loadingRiskFiles,
    reloadData: reloadRiskFiles,
  } = useRecords<DVRiskFile>({
    table: DataTable.RISK_FILE,
    query: `$filter=cr4de_risk_category ne 'test'&$select=cr4de_title,cr4de_risk_type,cr4de_subjective_importance,cr4de_consensus_date,${RISK_FILE_QUANTI_FIELDS.join(
      ","
    )}`,
    onComplete: async (data) => logger(`    Finished loading ${data.length} risk files`),
  });
  const {
    data: cascades,
    isFetching: loadingCascades,
    reloadData: reloadCascades,
  } = useRecords<DVRiskCascade<SmallRisk, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    query: `$select=_cr4de_cause_hazard_value,_cr4de_effect_hazard_value,cr4de_damp,${CASCADE_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_cause_hazard($select=cr4de_title),cr4de_effect_hazard($select=cr4de_title)`,
    onComplete: async (data) => logger(`    Finished loading ${data.length} cascades`),
  });
  const {
    data: directAnalyses,
    isFetching: loadingDAs,
    reloadData: reloadDAs,
  } = useRecords<DVDirectAnalysis<unknown, DVContact>>({
    table: DataTable.DIRECT_ANALYSIS,
    query: `$select=_cr4de_risk_file_value,cr4de_expert,cr4de_quality,${DIRECT_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_expert($select=emailaddress1)&$filter=_cr4de_expert_value ne null`,
    onComplete: async (data) => logger(`    Finished loading ${data.length} direct analyses`),
  });
  const {
    data: cascadeAnalyses,
    isFetching: loadingCAs,
    reloadData: reloadCAs,
  } = useRecords<DVCascadeAnalysis<unknown, unknown, DVContact>>({
    table: DataTable.CASCADE_ANALYSIS,
    query: `$select=_cr4de_risk_file_value,_cr4de_cascade_value,cr4de_expert,cr4de_quality,${CASCADE_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_expert($select=emailaddress1)&$filter=_cr4de_expert_value ne null`,
    onComplete: async (data) => logger(`    Finished loading ${data.length} cascade analyses`),
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const [results, setResults] = useState<RiskCalculation[] | null>(null);

  usePageTitle("BNRA 2023 - 2026 Result Calculator");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Analysis", url: "/analysis" },
    { name: "Calculator", url: "" },
  ]);

  const isLoading = loadingRiskFiles || loadingCascades || loadingDAs || loadingCAs || loadingParticipations;

  useEffect(() => {
    if (!participations || !participations[0] || !directAnalyses || !cascadeAnalyses) return;

    setUseableDAs(
      directAnalyses.filter((da) => {
        const p = participations.find(
          (p) =>
            p._cr4de_contact_value === da.cr4de_expert.contactid &&
            p._cr4de_risk_file_value === da._cr4de_risk_file_value
        );

        if (!p) return false;

        return p.cr4de_direct_analysis_finished;
      })
    );
    setUseableCAs(
      cascadeAnalyses.filter((ca) => {
        const p = participations.find(
          (p) =>
            p._cr4de_contact_value === ca.cr4de_expert.contactid &&
            p._cr4de_risk_file_value === ca._cr4de_risk_file_value
        );

        if (!p) return false;

        return p.cr4de_cascade_analysis_finished;
      })
    );
  }, [participations, directAnalyses, cascadeAnalyses]);

  const reloadData = () => {
    logger("Loading data...");
    reloadParticipations();
    reloadCascades();
    reloadRiskFiles();
    reloadDAs();
    reloadCAs();
  };

  const saveResults = async () => {
    if (!riskFiles || !results || isCalculating || !participations) return;

    logger(`Saving calculations (0/${results.length})`);

    const analysisId = uuid();

    for (let i = 0; i < results.length; i++) {
      const calculation = results[i];

      const calculatedFields: any = {
        ...roundNumberFields(calculation),
        causes: calculation.causes.map((c) => {
          const cleanCause: any = roundNumberFields(c);
          delete cleanCause.risk;
          return cleanCause;
        }),
        effects: calculation.effects.map((e) => {
          const cleanEffect: any = roundNumberFields(e);
          delete cleanEffect.risk;
          return cleanEffect;
        }),
      };

      const metrics = calculateMetrics(calculatedFields, results, riskFiles, participations);

      const riskId = calculatedFields.riskId;
      delete calculatedFields.riskId;

      const result = await api.createAnalysisRun({
        cr4de_analysis_id: analysisId,
        "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskId})`,
        cr4de_results: JSON.stringify(calculatedFields),
        cr4de_risk_file_metrics: JSON.stringify(metrics),
      });
      await api.updateRiskFile(riskId, {
        "cr4de_latest_calculation@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnraanalysisruns(${result.id})`,
      });

      logger(`Saving calculations (${i + 1}/${results.length})`, 1);
    }

    logger("Done");
  };

  const runCalculations = async () => {
    if (!riskFiles || !cascades || !useableDAs || !useableCAs || !participations) return;

    setIsCalculating(true);
    setSelectedNode(null);

    const calcs = await runAnalysis({
      riskFiles,
      cascades,
      participations,
      directAnalyses: useableDAs,
      cascadeAnalyses: useableCAs,
      log: logger,
      runs: simRuns,
      damping: parseFloat(damping),
    });
    console.log(calcs);
    setCalculations(calcs);
    // const [calculations, daMetrics, caMetrics] = await prepareRiskFiles(riskFiles, cascades, useableDAs, useableCAs);

    // logLines.push(
    //   "Direct Analysis Metrics:",
    //   `\t${roundPerc(daMetrics.consensus / daMetrics.total)} consensus values`,
    //   `\t${roundPerc(daMetrics.average / daMetrics.total)} averages values`,
    //   `\t${roundPerc(daMetrics.missing / daMetrics.total)} missing values`
    // );
    // logLines.push(
    //   "Cascade Analysis Metrics:",
    //   `\t${roundPerc(caMetrics.consensus / caMetrics.total)} consensus values`,
    //   `\t${roundPerc(caMetrics.average / caMetrics.total)} averages values`,
    //   `\t${roundPerc(caMetrics.missing / caMetrics.total)} missing values`,
    //   " "
    // );

    // const log = (line: string) => {
    //   logLines.push(line);
    //   setLog([...logLines]);
    // };

    // await convergeProbabilities(calculations, log, 30);
    // log(" ");
    // await convergeImpacts(calculations, log, 30);
    // log(" ");

    // calculations.forEach((c) => {
    //   c.r = c.ti * c.tp;

    //   const metrics = calculateMetrics(c, calculations, riskFiles, participations);
    // });
    // setResults(calculations);

    // setLog([...logLines, "Done"]);

    setIsCalculating(false);
  };

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{}}>
            <Typography variant="subtitle2">Simulation log:</Typography>
            <Box
              sx={{
                height: 200,
                overflowY: "scroll",
                border: "1px solid #eee",
                backgroundColor: "#00000005",
                mt: 1,
                mb: 4,
              }}
            >
              <pre style={{ paddingLeft: 12, paddingRight: 12 }}>{logLines.current.map((l, i) => `${l}\n`)}</pre>
            </Box>
          </CardContent>
          <CardActions>
            <Button disabled={isLoading} onClick={reloadData}>
              Reload data
            </Button>
            <Button disabled={riskFiles === null || cascades === null} onClick={runCalculations}>
              Start calculation
            </Button>
            <Button disabled={results === null || isCalculating} onClick={saveResults}>
              Save results
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button
              color="warning"
              onClick={() => {
                logLines.current = [];
                setUpdateLog(Date.now());
              }}
            >
              Clear log
            </Button>
          </CardActions>
        </Card>

        <Box>
          <RiskNetworkGraph
            calculations={calculations}
            selectedNodeId={selectedNode}
            setSelectedNodeId={setSelectedNode}
          />

          <CalculationsRiskMatrix
            calculations={calculations}
            selectedNodeId={selectedNode}
            setSelectedNodeId={setSelectedNode}
          />

          <CalculationsDataGrid data={calculations} setSelectedRiskId={setSelectedNode} />

          <CalculationsCascadeDataGrid data={calculations} />

          <CalculationsSankeyGraph
            calculations={calculations}
            selectedNodeId={selectedNode}
            setSelectedNodeId={setSelectedNode}
          />
        </Box>
      </Container>
    </>
  );
}
