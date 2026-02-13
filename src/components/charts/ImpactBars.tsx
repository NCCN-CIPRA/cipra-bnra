import { TooltipContentProps } from "recharts";
import { Box, Stack, Typography } from "@mui/material";
import { SCENARIOS } from "../../functions/scenarios";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import ImpactBarChart from "./svg/ImpactBarChart";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../types/dataverse/DVRiskSnapshot";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../../pages/BasePage";
import { Indicators } from "../../types/global";
import { RiskFileQuantiResults } from "../../types/dataverse/DVRiskFile";
import { DAMAGE_INDICATOR, IMPACT_CATEGORY } from "../../functions/Impact";
import {
  getIntervalStringQuantiScale7,
  Impacts,
  Indicator,
} from "../../functions/indicators/impact";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    if (payload && payload[0].payload.name === "") return null;

    return (
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: 1,
          bgcolor: "rgba(255,255,255,0.8)",
          mb: 1,
          width: 600,
        }}
      >
        <Stack direction="row" rowGap={0.5}>
          <Typography
            variant="subtitle2"
            sx={{ textDecoration: "underline", mr: 1 }}
          >
            {Impacts[(label as string).toLowerCase() as Indicator].category}{" "}
            Impact:
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {Impacts[(label as string).toLowerCase() as Indicator].title[1]}
          </Typography>
        </Stack>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          If an incident comparable to this scenario occurs, the expected impact
          for this indicator is:
        </Typography>
        {payload.map((p) => (
          <Stack key={p.name} direction="row" rowGap={0.5}>
            <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
              {p.payload.name}
              {Math.round(10 * p.value) / 10}:{" "}
            </Typography>
            <Typography variant="body2" sx={{}}>
              {getIntervalStringQuantiScale7(
                p.value as number,
                p.payload.name.toLowerCase() as Indicator,
              )}
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

export default function ImpactBars({
  riskFile,
  scenario,
  results,
  width,
  height,
  focusedImpact = null,
  onClickBar,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults> | null;
  scenario: SCENARIOS;
  results: RiskFileQuantiResults | null;
  width?: number;
  height?: number;
  focusedImpact?: IMPACT_CATEGORY | DAMAGE_INDICATOR | null;
  onClickBar?: (impact: IMPACT_CATEGORY | DAMAGE_INDICATOR) => void;
}) {
  const { indicators } = useOutletContext<BasePageContext>();

  const maxScales = indicators === Indicators.V1 ? 5 : 7;

  return ImpactBarChart({
    riskFile,
    scenario,
    results,
    width,
    height,
    maxScales,
    CustomTooltip,
    focusedImpact,
    onClickBar,
  });
}
