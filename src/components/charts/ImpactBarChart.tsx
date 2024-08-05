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
import { getScenarioParameter, SCENARIO_SUFFIX, SCENARIOS } from "../../functions/scenarios";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import round from "../../functions/roundNumberString";
import { useTranslation } from "react-i18next";

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ border: "1px solid #ccc", padding: 1, bgcolor: "rgba(255,255,255,0.8)", mb: 1 }}>
        <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
          {label}
        </Typography>
        {payload.map((p) => (
          <Stack key={p.name} direction="row">
            <Typography variant="body2" sx={{ width: 50 }}>
              {p.name} :
            </Typography>
            <Typography variant="body2" sx={{ width: 50, textAlign: "right" }}>{`${round(
              p.value as number,
              1
            )} / 5`}</Typography>
          </Stack>
        ))}
        <Stack direction="row" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ width: 50, fontWeight: "bold" }}>
            Total :
          </Typography>
          <Typography variant="body2" sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}>{`${round(
            payload.reduce((sum, p) => sum + (p.value as number), 0),
            1
          )} / 5`}</Typography>
        </Stack>
      </Box>
    );
  }

  return null;
};

export default function ImpactBarChart({ riskFile, scenario }: { riskFile: DVRiskFile | null; scenario: SCENARIOS }) {
  const { t } = useTranslation();
  if (!riskFile) return null;

  const data = [
    {
      name: t("Human"),
      H: getScenarioParameter(riskFile, "TI_H", scenario),
      Ha: getScenarioParameter(riskFile, "TI_Ha", scenario),
      Hb: getScenarioParameter(riskFile, "TI_Hb", scenario),
      Hc: getScenarioParameter(riskFile, "TI_Hc", scenario),
    },
    {
      name: t("Societal"),
      S: getScenarioParameter(riskFile, "TI_S", scenario),
      Sa: getScenarioParameter(riskFile, "TI_Sa", scenario),
      Sb: getScenarioParameter(riskFile, "TI_Sb", scenario),
      Sc: getScenarioParameter(riskFile, "TI_Sc", scenario),
      Sd: getScenarioParameter(riskFile, "TI_Sd", scenario),
    },
    {
      name: t("Environmental"),
      E: getScenarioParameter(riskFile, "TI_E", scenario),
      Ea: getScenarioParameter(riskFile, "TI_Ea", scenario),
    },
    {
      name: t("Financial"),
      F: getScenarioParameter(riskFile, "TI_F", scenario),
      Fa: getScenarioParameter(riskFile, "TI_Fa", scenario),
      Fb: getScenarioParameter(riskFile, "TI_Fb", scenario),
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
