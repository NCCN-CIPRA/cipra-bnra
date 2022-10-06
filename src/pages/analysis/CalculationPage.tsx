import { useState } from "react";
import { Container, Typography, Paper, Button, Stack } from "@mui/material";
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

interface OtherHazard {
  cr4de_title: string;
}

const roundNumberFields = (obj: object) => {
  return (Object.keys(obj) as Array<keyof typeof obj>).reduce(
    (rounded, key) => ({
      ...rounded,
      [key]: typeof obj[key] === "number" ? Math.round(1000 * (obj[key] as number)) / 1000 : obj[key],
    }),
    {}
  );
};

export default function CalculationPage() {
  const api = useAPI();

  const { data: riskFiles } = useRecords<DVRiskFile>({ table: DataTable.RISK_FILE });
  const { data: cascades } = useRecords<DVRiskCascade<OtherHazard, OtherHazard>>({
    table: DataTable.RISK_CASCADE,
    query: "$expand=cr4de_cause_hazard($select=cr4de_title),cr4de_effect_hazard($select=cr4de_title)",
  });

  const [log, setLog] = useState(["Idle..."]);
  const [isCalculating, setIsCalculating] = useState(false);

  const [results, setResults] = useState<RiskCalculation[] | null>(null);

  usePageTitle("BNRA 2023 - 2026 Result Calculator");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Analysis", url: "/analysis" },
    { name: "Calculator", url: "" },
  ]);

  const saveResults = async () => {
    if (!results || isCalculating) return;

    const innerLog = log;

    setLog([...innerLog, `Saving calculations (0/${results.length})`]);

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

      const riskId = calculatedFields.riskId;
      delete calculatedFields.riskId;

      await api.updateRiskFile(riskId, {
        cr4de_calculated: JSON.stringify(calculatedFields),
      });

      setLog([...innerLog.slice(0, innerLog.length - 1), `Saving calculations (${i + 1}/${results.length})`]);
    }

    setLog([...innerLog, "Done"]);
  };

  const runCalculations = async () => {
    if (!riskFiles || !cascades) return;

    const logLines: string[] = [];

    setIsCalculating(true);

    const calculations = await prepareRiskFiles(riskFiles, cascades);

    const log = (line: string) => {
      logLines.push(line);
      setLog([...logLines]);
    };

    await convergeProbabilities(calculations, log);
    await convergeImpacts(calculations, log);

    setResults(calculations);

    setLog([...logLines, "Done"]);

    setIsCalculating(false);
  };

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Paper sx={{ p: 2 }}>
          {(!riskFiles || !cascades) && <Typography variant="body1">Loading Risk Files...</Typography>}

          {riskFiles && cascades && (
            <>
              <Typography variant="overline" sx={{ mt: 0, display: "block" }}>
                Loaded {riskFiles.length} Risk Files
              </Typography>
              <Typography variant="overline" sx={{ mb: 2, display: "block" }}>
                Loaded {cascades.length} Cascades
              </Typography>

              {log.map((l, i) => (
                <Typography key={i} variant="overline" sx={{ mt: 0, display: "block" }}>
                  {l}
                </Typography>
              ))}

              <Stack direction="row">
                <Button sx={{ mt: 2 }} onClick={runCalculations}>
                  Start calculation
                </Button>
                {results && !isCalculating && (
                  <Button sx={{ mt: 2 }} onClick={saveResults}>
                    Save results
                  </Button>
                )}
              </Stack>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}
