import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Box, Stack, Typography } from "@mui/material";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import {
  getCategoryImpactRelativeScale,
  getDamageIndicatorRelativeScale,
  getMoneyString,
} from "../../functions/Impact";
import { SCENARIO_SUFFIX } from "../../functions/scenarios";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ border: "1px solid #ccc", padding: 1, bgcolor: "rgba(255,255,255,0.8)", mb: 1 }}>
        <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
          {label}
        </Typography>
        {payload.map((p) => (
          <Stack direction="row">
            <Typography variant="body2" sx={{ width: 50 }}>
              {p.name} :
            </Typography>
            <Typography variant="body2" sx={{ width: 50, textAlign: "right" }}>{`${p.value} / 5`}</Typography>
          </Stack>
        ))}
        <Stack direction="row" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ width: 50, fontWeight: "bold" }}>
            Total :
          </Typography>
          <Typography variant="body2" sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}>{`${payload.reduce(
            (sum, p) => sum + (p.value as number),
            0
          )} / 5`}</Typography>
        </Stack>
      </Box>
    );
  }

  return null;
};

export default function ImpactBarChart({
  calculation,
  scenarioSuffix,
}: {
  calculation: RiskCalculation | null;
  scenarioSuffix: SCENARIO_SUFFIX;
}) {
  if (!calculation) return null;

  const data = [
    {
      name: "Human",
      H: getCategoryImpactRelativeScale(calculation, "H", scenarioSuffix),
      Ha: getDamageIndicatorRelativeScale(calculation, "Ha", scenarioSuffix),
      Hb: getDamageIndicatorRelativeScale(calculation, "Hb", scenarioSuffix),
      Hc: getDamageIndicatorRelativeScale(calculation, "Hc", scenarioSuffix),
    },
    {
      name: "Societal",
      S: getCategoryImpactRelativeScale(calculation, "S", scenarioSuffix),
      Sa: getDamageIndicatorRelativeScale(calculation, "Sa", scenarioSuffix),
      Sb: getDamageIndicatorRelativeScale(calculation, "Sb", scenarioSuffix),
      Sc: getDamageIndicatorRelativeScale(calculation, "Sc", scenarioSuffix),
      Sd: getDamageIndicatorRelativeScale(calculation, "Sd", scenarioSuffix),
    },
    {
      name: "Environmental",
      E: getCategoryImpactRelativeScale(calculation, "E", scenarioSuffix),
      Ea: getDamageIndicatorRelativeScale(calculation, "Ea", scenarioSuffix),
    },
    {
      name: "Financial",
      F: getCategoryImpactRelativeScale(calculation, "F", scenarioSuffix),
      Fa: getDamageIndicatorRelativeScale(calculation, "Fa", scenarioSuffix),
      Fb: getDamageIndicatorRelativeScale(calculation, "Fb", scenarioSuffix),
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          bottom: 85,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-90} dx={-5} dy={5} interval={0} textAnchor="end" />
        <YAxis domain={[0, 5.5]} ticks={[1, 2, 3, 4, 5]} width={10} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="Ha" stackId="a" fill="#de6148" />
        <Bar dataKey="Hb" stackId="a" fill="#f39d87" />
        <Bar dataKey="Hc" stackId="a" fill="#ffd7cc" />
        {/* <Bar dataKey="H" stackId="b" style={{ display: "none" }} /> */}
        <Bar dataKey="Sa" stackId="a" fill="#bca632" />
        <Bar dataKey="Sb" stackId="a" fill="#d2ba37" />
        <Bar dataKey="Sc" stackId="a" fill="#e8ce3d" />
        <Bar dataKey="Sd" stackId="a" fill="#ffe342" />
        {/* <Bar dataKey="S" stackId="a" style={{ display: "none" }} label /> */}
        <Bar dataKey="Ea" stackId="a" fill="#83af70" />
        {/* <Bar dataKey="E" stackId="a" style={{ display: "none" }} label /> */}
        <Bar dataKey="Fa" stackId="a" fill="#6996b3" />
        <Bar dataKey="Fb" stackId="a" fill="#c1e7ff" />
        {/* <Bar dataKey="F" stackId="a" style={{ display: "none" }} label /> */}
      </BarChart>
    </ResponsiveContainer>
  );
}
