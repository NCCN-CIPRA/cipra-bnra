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
    console.log(active, payload);
    return (
      <Box sx={{ border: "1px solid #ccc", padding: 1, bgcolor: "rgba(255,255,255,0.8)", mb: 1 }}>
        <Typography variant="subtitle2" sx={{ textDecoration: "underline", mb: 1 }}>
          {label} Impact
        </Typography>
        {payload.map((p) => (
          <Stack key={p.name} direction="row" rowGap={0.5}>
            <Typography variant="body2" sx={{ width: 50, fontWeight: "bold" }}>
              {p.name}
              {p.payload[`${p.name}_abs`]}
            </Typography>
          </Stack>
        ))}
        {/* <Stack direction="row" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ width: 50, fontWeight: "bold" }}>
            Total :
          </Typography>
          <Typography variant="body2" sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}>{`${round(
            payload.reduce((sum, p) => sum + (p.value as number), 0),
            1
          )} / 5`}</Typography>
        </Stack> */}
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
      Ha_abs: getScenarioParameter(riskFile, "TI_Ha_abs", scenario),
      Hb_abs: getScenarioParameter(riskFile, "TI_Hb_abs", scenario),
      Hc_abs: getScenarioParameter(riskFile, "TI_Hc_abs", scenario),
    },
    {
      name: t("Societal"),
      S: getScenarioParameter(riskFile, "TI_S", scenario),
      Sa: getScenarioParameter(riskFile, "TI_Sa", scenario),
      Sb: getScenarioParameter(riskFile, "TI_Sb", scenario),
      Sc: getScenarioParameter(riskFile, "TI_Sc", scenario),
      Sd: getScenarioParameter(riskFile, "TI_Sd", scenario),
      Sa_abs: getScenarioParameter(riskFile, "TI_Sa_abs", scenario),
      Sb_abs: getScenarioParameter(riskFile, "TI_Sb_abs", scenario),
      Sc_abs: getScenarioParameter(riskFile, "TI_Sc_abs", scenario),
      Sd_abs: getScenarioParameter(riskFile, "TI_Sd_abs", scenario),
    },
    {
      name: t("Environmental"),
      E: getScenarioParameter(riskFile, "TI_E", scenario),
      Ea: getScenarioParameter(riskFile, "TI_Ea", scenario),
      Ea_abs: getScenarioParameter(riskFile, "TI_Ea_abs", scenario),
    },
    {
      name: t("Financial"),
      F: getScenarioParameter(riskFile, "TI_F", scenario),
      Fa: getScenarioParameter(riskFile, "TI_Fa", scenario),
      Fb: getScenarioParameter(riskFile, "TI_Fb", scenario),
      Fa_abs: getScenarioParameter(riskFile, "TI_Fa_abs", scenario),
      Fb_abs: getScenarioParameter(riskFile, "TI_Fb_abs", scenario),
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
