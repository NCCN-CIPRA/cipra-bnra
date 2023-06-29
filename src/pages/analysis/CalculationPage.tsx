import { useState } from "react";
import { Container, Typography, Card, CardActions, CardContent, Button, Stack } from "@mui/material";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRecords from "../../hooks/useRecords";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import prepareRiskFiles from "../../functions/analysis/prepareRiskFiles";
import convergeProbabilities from "../../functions/analysis/convergeProbabilities";
import convergeImpacts from "../../functions/analysis/convergeImpacts";
import { RiskCalculation } from "../../types/RiskCalculation";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { CASCADE_ANALYSIS_QUANTI_FIELDS, DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";

interface OtherHazard {
  cr4de_title: string;
}

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

  const {
    data: riskFiles,
    isFetching: loadingRiskFiles,
    reloadData: reloadRiskFiles,
  } = useRecords<DVRiskFile>({
    table: DataTable.RISK_FILE,
    query: `$filter=cr4de_risk_category ne 'test'&$select=cr4de_risk_type,cr4de_calculated,${DIRECT_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}`,
  });
  const {
    data: cascades,
    isFetching: loadingCascades,
    reloadData: reloadCascades,
  } = useRecords<DVRiskCascade<OtherHazard, OtherHazard>>({
    table: DataTable.RISK_CASCADE,
    query: `$select=_cr4de_cause_hazard_value,_cr4de_effect_hazard_value,${CASCADE_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_cause_hazard($select=cr4de_title),cr4de_effect_hazard($select=cr4de_title)`,
  });
  const {
    data: directAnalyses,
    isFetching: loadingDAs,
    reloadData: reloadDAs,
  } = useRecords<DVDirectAnalysis>({
    table: DataTable.DIRECT_ANALYSIS,
    query: `$select=_cr4de_risk_file_value,cr4de_expert,${DIRECT_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_risk_file($select=cr4de_riskfilesid),cr4de_expert($select=emailaddress1)`,
  });
  const {
    data: cascadeAnalyses,
    isFetching: loadingCAs,
    reloadData: reloadCAs,
  } = useRecords<DVCascadeAnalysis>({
    table: DataTable.CASCADE_ANALYSIS,
    query: `$select=_cr4de_cascade_value,cr4de_expert,${CASCADE_ANALYSIS_QUANTI_FIELDS.join(
      ","
    )}&$expand=cr4de_cascade($select=cr4de_bnrariskcascadeid),cr4de_expert($select=emailaddress1)`,
  });

  const [log, setLog] = useState<string[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const [results, setResults] = useState<RiskCalculation[] | null>(null);

  usePageTitle("BNRA 2023 - 2026 Result Calculator");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Analysis", url: "/analysis" },
    { name: "Calculator", url: "" },
  ]);

  const isLoading = loadingRiskFiles || loadingCascades || loadingDAs || loadingCAs;

  const reloadData = () => {
    reloadCascades();
    reloadRiskFiles();
    reloadDAs();
    reloadCAs();
  };

  const saveResults = async () => {
    if (!riskFiles || !results || isCalculating) return;

    const innerLog = log;

    setLog([...innerLog, `Saving calculations (0/${results.length})`]);

    for (let i = 0; i < results.length; i++) {
      const calculation = results[i];

      const rf = riskFiles.find((r) => r.cr4de_riskfilesid === calculation.riskId);

      if (!rf) continue;

      const previousCalculations = rf.cr4de_calculated ? JSON.parse(rf.cr4de_calculated) : [];

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

      const riskId = calculatedFields.riskId;
      delete calculatedFields.riskId;

      previousCalculations.unshift(calculatedFields);
      let calculationsString = JSON.stringify(previousCalculations);
      while (calculationsString.length > 1048576) {
        delete previousCalculations[previousCalculations.length - 1];
        calculationsString = JSON.stringify(previousCalculations);
      }

      await api.updateRiskFile(riskId, {
        cr4de_calculated: calculationsString,
      });

      setLog([...innerLog.slice(0, innerLog.length - 1), `Saving calculations (${i + 1}/${results.length})`]);
    }

    setLog([...innerLog, "Done"]);
  };

  const runCalculations = async () => {
    if (!riskFiles || !cascades || !directAnalyses || !cascadeAnalyses) return;

    const logLines: string[] = [];

    setIsCalculating(true);

    const [calculations, daMetrics, caMetrics] = await prepareRiskFiles(
      riskFiles,
      cascades,
      directAnalyses,
      cascadeAnalyses
    );

    logLines.push(
      "Direct Analysis Metrics:",
      `\t${roundPerc(daMetrics.consensus / daMetrics.total)} consensus values`,
      `\t${roundPerc(daMetrics.average / daMetrics.total)} averages values`,
      `\t${roundPerc(daMetrics.missing / daMetrics.total)} missing values`
    );
    logLines.push(
      "Cascade Analysis Metrics:",
      `\t${roundPerc(caMetrics.consensus / caMetrics.total)} consensus values`,
      `\t${roundPerc(caMetrics.average / caMetrics.total)} averages values`,
      `\t${roundPerc(caMetrics.missing / caMetrics.total)} missing values`,
      " "
    );

    const log = (line: string) => {
      logLines.push(line);
      setLog([...logLines]);
    };

    await convergeProbabilities(calculations, log);
    log(" ");
    await convergeImpacts(calculations, log);
    log(" ");

    calculations.forEach((c) => {
      c.r = c.ti * c.tp;
    });
    setResults(calculations);

    setLog([...logLines, "Done"]);

    setIsCalculating(false);
  };

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Card>
          <CardContent sx={{ maxHeight: 500, overflowY: "scroll" }}>
            <Typography variant="overline">Loading Risk Files...</Typography>

            {riskFiles && cascades && directAnalyses && cascadeAnalyses && (
              <pre>
                <Typography variant="overline" sx={{ mt: 0, display: "block" }}>
                  Loaded {riskFiles.length} Risk Files
                </Typography>
                <Typography variant="overline" sx={{ mb: 0, display: "block" }}>
                  Loaded {cascades.length} Cascades
                </Typography>
                <Typography variant="overline" sx={{ mb: 0, display: "block" }}>
                  Loaded {directAnalyses.length} Direct Analyses
                </Typography>
                <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
                  Loaded {cascadeAnalyses.length} Cascade Analyses
                </Typography>

                {log.map((l, i) => (
                  <Typography key={i} variant="overline" sx={{ mt: 0, display: "block" }}>
                    {l}
                  </Typography>
                ))}
              </pre>
            )}
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
          </CardActions>
        </Card>
      </Container>
    </>
  );
}
