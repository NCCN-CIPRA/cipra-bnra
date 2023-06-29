import { Stack, Box, Typography, Paper } from "@mui/material";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TEAL } from "./Colors";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { RiskCalculation } from "../../../types/RiskCalculation";
import { getImpactScaleNumber } from "../../../functions/Impact";

export default function ImportanceCard({ riskFile }: { riskFile: DVRiskFile }) {
  const calculations: RiskCalculation[] = JSON.parse(riskFile.cr4de_calculated || "[]");

  const data = [
    {
      name: "Subjective Importance",
      score: (4 - riskFile.cr4de_subjective_importance) / 3.0,
    },
    {
      name: "Direct Impact",
      score: calculations.length <= 0 ? 0 : parseFloat(getImpactScaleNumber(calculations[0].ti)) / 5,
    },
    {
      name: "Weighted Causes",
      score: calculations.length <= 0 ? 0 : calculations[0].causes.length / 50.0,
    },
    {
      name: "Weighted Effects",
      score: calculations.length <= 0 ? 0 : calculations[0].effects.length / 50.0,
    },
    {
      name: "Total",
      score:
        ((4 - riskFile.cr4de_subjective_importance) / 3.0 + calculations.length <= 0
          ? 0
          : parseFloat(getImpactScaleNumber(calculations[0].ti)) / 5 +
            calculations[0].effects.length / 50.0 +
            calculations[0].effects.length / 50.0) / 4,
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
