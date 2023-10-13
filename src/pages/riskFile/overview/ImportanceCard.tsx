import { Stack, Box, Typography, Paper } from "@mui/material";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TEAL } from "./Colors";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { getImpactScaleNumber } from "../../../functions/Impact";
import { DVAnalysisRun, RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";

export default function ImportanceCard({
  riskFile,
  calculation,
}: {
  riskFile: DVRiskFile;
  calculation: RiskCalculation | null;
}) {
  const data = [
    {
      name: "Subjective Importance",
      score: (4 - riskFile.cr4de_subjective_importance) / 3.0,
    },
    {
      name: "Direct Impact",
      score: calculation === null ? 0 : parseFloat(getImpactScaleNumber(calculation.ti)) / 5,
    },
    {
      name: "Weighted Causes",
      score: calculation === null ? 0 : calculation.causes.length / 50.0,
    },
    {
      name: "Weighted Effects",
      score: calculation === null ? 0 : calculation.effects.length / 50.0,
    },
    {
      name: "Total",
      score:
        (4 - riskFile.cr4de_subjective_importance) / 3.0 +
        (calculation === null
          ? 0
          : parseFloat(getImpactScaleNumber(calculation.ti)) / 5 +
            calculation.effects.length / 50.0 +
            calculation.effects.length / 50.0) /
          4,
    },
  ];
  return (
    <Stack component={Paper} sx={{ width: "100%", height: "100%", p: 2 }}>
      <Box sx={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={150} height={40} data={data}>
            <Bar dataKey="score" fill={TEAL} />
            <Tooltip
              labelFormatter={(l, p) => (p && p[0] ? `${p[0].payload.name}` : "")}
              formatter={(v, n, p) => [`${Math.round(100 * (v as number))}%`, "Score"]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ width: "100%", flexShrink: 0, textAlign: "center" }}>
        <Typography variant="subtitle1">Importance Estimation</Typography>
      </Box>
    </Stack>
  );
}
