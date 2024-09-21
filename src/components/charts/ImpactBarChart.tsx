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
import { getScenarioParameter, SCENARIO_SUFFIX, SCENARIOS } from "../../functions/scenarios";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import round from "../../functions/roundNumberString";
import { useTranslation } from "react-i18next";
import { getCategoryImpactRescaled, getDamageIndicatorToCategoryImpactRatio } from "../../functions/CategoryImpact";

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
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

              {p.payload[`${p.name}`]}
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

  const H = getCategoryImpactRescaled(riskFile, "H", scenario);
  const S = getCategoryImpactRescaled(riskFile, "S", scenario);
  const E = getCategoryImpactRescaled(riskFile, "E", scenario);
  const F = getCategoryImpactRescaled(riskFile, "F", scenario);

  const data = [
    {
      name: t("Human"),
      H: H,
      Ha: getDamageIndicatorToCategoryImpactRatio(riskFile, "Ha", scenario) * H,
      Hb: getDamageIndicatorToCategoryImpactRatio(riskFile, "Hb", scenario) * H,
      Hc: getDamageIndicatorToCategoryImpactRatio(riskFile, "Hc", scenario) * H,
      Ha_abs: getScenarioParameter(riskFile, "TI_Ha_abs", scenario),
      Hb_abs: getScenarioParameter(riskFile, "TI_Hb_abs", scenario),
      Hc_abs: getScenarioParameter(riskFile, "TI_Hc_abs", scenario),
    },
    {
      name: t("Societal"),
      S: S,
      Sa: getDamageIndicatorToCategoryImpactRatio(riskFile, "Sa", scenario) * S,
      Sb: getDamageIndicatorToCategoryImpactRatio(riskFile, "Sb", scenario) * S,
      Sc: getDamageIndicatorToCategoryImpactRatio(riskFile, "Sc", scenario) * S,
      Sd: getDamageIndicatorToCategoryImpactRatio(riskFile, "Sd", scenario) * S,
      Sa_abs: getScenarioParameter(riskFile, "TI_Sa_abs", scenario),
      Sb_abs: getScenarioParameter(riskFile, "TI_Sb_abs", scenario),
      Sc_abs: getScenarioParameter(riskFile, "TI_Sc_abs", scenario),
      Sd_abs: getScenarioParameter(riskFile, "TI_Sd_abs", scenario),
    },
    {
      name: t("Environmental"),
      E: E,
      Ea: getDamageIndicatorToCategoryImpactRatio(riskFile, "Ea", scenario) * E,
      Ea_abs: getScenarioParameter(riskFile, "TI_Ea_abs", scenario),
    },
    {
      name: t("Financial"),
      F: F,
      Fa: getDamageIndicatorToCategoryImpactRatio(riskFile, "Fa", scenario) * F,
      Fb: getDamageIndicatorToCategoryImpactRatio(riskFile, "Fb", scenario) * F,
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
