import { Paper, Stack, Box, Typography } from "@mui/material";
import {
  Tooltip,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { TEAL } from "./Colors";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { RiskCalculation } from "../../../types/RiskCalculation";
import { getImpactScale, getImpactScaleNumber } from "../../../functions/Impact";
import { getProbabilityScale } from "../../../functions/Probability";

export default function ResultCard({ riskFile }: { riskFile: DVRiskFile }) {
  const calculation: RiskCalculation = JSON.parse(riskFile.cr4de_calculated || "{}");

  const data = [
    {
      subject: "Probability",
      A: getProbabilityScale(calculation.tp, "DP").slice(-1),
    },
    {
      subject: "Human Impact",
      A: getImpactScaleNumber(calculation.ti_Ha + calculation.ti_Hb + calculation.ti_Hc),
    },
    {
      subject: "Societal Impact",
      A: getImpactScaleNumber(calculation.ti_Sa + calculation.ti_Sb + calculation.ti_Sc + calculation.ti_Sd),
    },
    {
      subject: "Environmental Impact",
      A: getImpactScaleNumber(calculation.ti_Ea),
    },
    {
      subject: "Financial Impact",
      A: getImpactScaleNumber(calculation.ti_Fa + calculation.ti_Fb),
    },
  ];

  return (
    <Stack component={Paper} sx={{ width: "100%", height: "100%", p: 2 }}>
      <Box sx={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tickFormatter={(t) => t[0]} />
            <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={false} />
            <Radar name="Analysis Results" dataKey="A" stroke={TEAL} fill={TEAL} fillOpacity={0.6} />
            <Tooltip formatter={(value, name, props) => [`${value}/5`]} />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Typography variant="subtitle1">Quantitative Results</Typography>
      </Box>
    </Stack>
  );
}
