import { useState, useEffect, useRef, useMemo } from "react";
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
  LinearProgress,
  Accordion,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRecords from "../../hooks/useRecords";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { DVRiskFile, RISK_FILE_QUANTI_FIELDS } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { CASCADE_ANALYSIS_QUANTI_FIELDS, DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { CascadeCalculation, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
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
import RiskProfileGraph from "./RiskProfileGraph";
// import { MessageParams } from "../../functions/analysis/calculator.worker";

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

  const [calculationProgress, setCalculationProgress] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [results, setResults] = useState<RiskCalculation[] | null>(null);

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
    query: `$filter=cr4de_risk_category ne 'test'&$select=cr4de_title,cr4de_risk_type,cr4de_key_risk,cr4de_hazard_id,cr4de_risk_category,cr4de_subjective_importance,cr4de_consensus_date,${RISK_FILE_QUANTI_FIELDS.join(
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

  usePageTitle("BNRA 2023 - 2026 Result Calculator");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Analysis", url: "/analysis" },
    { name: "Calculator", url: "" },
  ]);

  const isLoading = loadingRiskFiles || loadingCascades || loadingDAs || loadingCAs || loadingParticipations;

  const calculator: Worker = useMemo(() => {
    // Returns a blob:// URL which points
    // to a javascript file which will call
    // importScripts with the given URL
    function getWorkerURL(url: string) {
      const content = `importScripts( "${url}" );`;
      return URL.createObjectURL(new Blob([content], { type: "text/javascript" }));
    }

    const testUrl = new URL("../../functions/analysis/calculator.worker.ts", import.meta.url);

    if (testUrl.href.indexOf("githack") >= 0) {
      return new Worker(new URL("https://bnra.powerappsportals.com/calculator.worker.js"));
    }

    return new Worker(new URL("../../functions/analysis/calculator.worker.ts", import.meta.url), { type: "module" });
  }, [riskFiles]);

  useEffect(() => {
    if (window.Worker) {
      // calculator.onmessage = (e: MessageEvent<MessageParams>) => {
      calculator.onmessage = (e: MessageEvent<any>) => {
        if (e.data.type === "progress") {
          setCalculationProgress(e.data.value);
        }
        if (e.data.type === "result") {
          setCalculations(
            e.data.value.map((c: RiskCalculation) => {
              const risk = riskFiles?.find((r) => r.cr4de_riskfilesid === c.riskId);

              if (!risk) return c;

              return {
                ...c,
                keyRisk: risk.cr4de_key_risk,
                code: risk.cr4de_hazard_id,
                category: risk.cr4de_risk_category,
              };
            })
          );
          setIsCalculating(false);
        }
      };
    }
  }, [calculator]);

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
    if (!calculations) return;

    setCalculationProgress(0);

    function flattenCause(c: CascadeCalculation): CascadeCalculation {
      return {
        ...c,
        effect: { riskId: c.effect.riskId } as unknown as RiskCalculation,
        cause: {
          ...c.cause,
          effects: [],
          causes: [],
        },
      };
    }

    function flattenEffect(e: CascadeCalculation): CascadeCalculation {
      return {
        ...e,
        cause: { riskId: e.cause.riskId } as unknown as RiskCalculation,
        effect: {
          ...e.effect,
          causes: [],
          effects: [],
        },
      };
    }

    console.log("test");
    // console.log(
    //   JSON.stringify(
    //     calculations.map((calc) => ({
    //       ...calc,
    //       causes: calc.causes.map((cause) => flattenCause(cause)),
    //       effects: calc.effects.map((effect) => flattenEffect(effect)),
    //     }))
    //   ).length
    // );

    // logger(`Saving calculations (0/${results.length})`);

    const analysisId = uuid();

    for (let i = 0; i < calculations.length; i++) {
      const calculation = calculations[i];

      const flatCalculation: RiskCalculation = {
        ...calculation,
        causes: calculation.causes.map((cause) => flattenCause(cause)),
        effects: calculation.effects.map((effect) => flattenEffect(effect)),
      };
      console.log(JSON.stringify(flatCalculation));

      //   const metrics = calculateMetrics(calculatedFields, results, riskFiles, participations);

      const riskId = flatCalculation.riskId;
      //   delete calculatedFields.riskId;

      const result = await api.createAnalysisRun({
        cr4de_analysis_id: analysisId,
        "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskId})`,
        cr4de_results: JSON.stringify(flatCalculation),
        // cr4de_risk_file_metrics: JSON.stringify(metrics),
      });
      await api.updateRiskFile(riskId, {
        "cr4de_latest_calculation@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnraanalysisruns(${result.id})`,
      });

      //   logger(`Saving calculations (${i + 1}/${results.length})`, 1);
      setCalculationProgress(i + 1 / calculations.length);
    }

    // logger("Done");
  };

  console.log(calculations);

  const runCalculations = async () => {
    if (!riskFiles || !cascades || !useableDAs || !useableCAs || !participations) return;

    setIsCalculating(true);
    setSelectedNode(null);

    setCalculationProgress(0);

    calculator.postMessage({
      riskFiles,
      cascades,
      participations,
      directAnalyses: useableDAs,
      cascadeAnalyses: useableCAs,
    });

    // setCalculations(calcs);
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
  };

  useEffect(() => {
    if (calculations && selectedNode) {
      const c = calculations.find((c) => c.riskId === selectedNode);

      if (!c) return;

      const r = (a: number) => Math.round(a / 100000000);

      // console.log("TP: ", r(c.tp), r(c.tp_c), r(c.tp_m), r(c.tp_e));
      // console.log(
      //   "TP sum: ",
      //   r(c.dp + c.causes.reduce((t, c) => t + c.ip, 0)),
      //   r(c.dp_c + c.causes.reduce((t, c) => t + c.ip_c, 0)),
      //   r(c.dp_m + c.causes.reduce((t, c) => t + c.ip_m, 0)),
      //   r(c.dp_e + c.causes.reduce((t, c) => t + c.ip_e, 0))
      // );

      // console.log("TI: ", r(c.ti), r(c.ti_c), r(c.ti_m), r(c.ti_e));
      // console.log(
      //   "TI sum: ",
      //   r(c.di + c.effects.reduce((t, c) => t + c.ii, 0)),
      //   r(c.di_c + c.effects.reduce((t, c) => t + c.ii_c, 0)),
      //   r(c.di_m + c.effects.reduce((t, c) => t + c.ii_m, 0)),
      //   r(c.di_e + c.effects.reduce((t, c) => t + c.ii_e, 0))
      // );

      // console.log(
      //   "TI sum",
      //   r(c.ti_Ha + c.ti_Hb + c.ti_Hc + c.ti_Sa + c.ti_Sb + c.ti_Sc + c.ti_Sd + c.ti_Ea + c.ti_Fa + c.ti_Fb),
      //   r(
      //     c.ti_Ha_c +
      //       c.ti_Hb_c +
      //       c.ti_Hc_c +
      //       c.ti_Sa_c +
      //       c.ti_Sb_c +
      //       c.ti_Sc_c +
      //       c.ti_Sd_c +
      //       c.ti_Ea_c +
      //       c.ti_Fa_c +
      //       c.ti_Fb_c
      //   ),
      //   r(
      //     c.ti_Ha_m +
      //       c.ti_Hb_m +
      //       c.ti_Hc_m +
      //       c.ti_Sa_m +
      //       c.ti_Sb_m +
      //       c.ti_Sc_m +
      //       c.ti_Sd_m +
      //       c.ti_Ea_m +
      //       c.ti_Fa_m +
      //       c.ti_Fb_m
      //   ),
      //   r(
      //     c.ti_Ha_e +
      //       c.ti_Hb_e +
      //       c.ti_Hc_e +
      //       c.ti_Sa_e +
      //       c.ti_Sb_e +
      //       c.ti_Sc_e +
      //       c.ti_Sd_e +
      //       c.ti_Ea_e +
      //       c.ti_Fa_e +
      //       c.ti_Fb_e
      //   )
      // );
      // console.log(
      //   "TI S: ",
      //   r(c.ti_Sa + c.ti_Sb + c.ti_Sc + c.ti_Sd),
      //   r(c.ti_Sa_c + c.ti_Sb_c + c.ti_Sc_c + c.ti_Sd_c),
      //   r(c.ti_Sa_m + c.ti_Sb_m + c.ti_Sc_m + c.ti_Sd_m),
      //   r(c.ti_Sa_e + c.ti_Sb_e + c.ti_Sc_e + c.ti_Sd_e)
      // );
    }
  }, [selectedNode]);

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{}}>
            <Typography variant="subtitle2">Simulation log:</Typography>
            <Box
              sx={{
                mt: 1,
              }}
            >
              <Stack direction="row">
                <Stack direction="column" sx={{ flex: 1 }}>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {riskFiles && !loadingRiskFiles && <CheckIcon color="success" />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Risk Files
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {cascades && !loadingCascades && <CheckIcon color="success" />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Risk Cascades
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction="column" sx={{ flex: 1 }}>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {participations && !loadingParticipations && <CheckIcon color="success" />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Participations
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {directAnalyses && !loadingDAs && <CheckIcon color="success" />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Direct Analyses
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
                <Stack direction="column" sx={{ flex: 1 }}>
                  <Stack direction="row">
                    <Box sx={{ width: 24, height: 32, mx: 1 }}>
                      {cascadeAnalyses && !loadingCAs && <CheckIcon color="success" />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ mt: "2px" }}>
                        Cascade Analyses
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
              <Box sx={{ height: 8, mt: 2, mx: 1 }}>
                {calculationProgress !== null && <LinearProgress variant="determinate" value={calculationProgress} />}
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            <Button disabled={isLoading || isCalculating} onClick={reloadData}>
              Reload data
            </Button>
            <Button disabled={isLoading || isCalculating} onClick={runCalculations}>
              {calculations ? "Res" : "S"}tart calculation
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button color="warning" disabled={calculations === null || isCalculating} onClick={saveResults}>
              Save results
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
          <RiskProfileGraph
            calculations={calculations}
            selectedNodeId={selectedNode}
            setSelectedNodeId={setSelectedNode}
          />
        </Box>
      </Container>
    </>
  );
}
