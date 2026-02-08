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
import round from "../../functions/roundNumberString";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../../pages/BasePage";
import { Indicators } from "../../types/global";
import { RiskFileQuantiResults } from "../../types/dataverse/DVRiskFile";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: 1,
          bgcolor: "rgba(255,255,255,0.8)",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ textDecoration: "underline", mb: 1 }}
        >
          {label} Impact
        </Typography>
        {payload.map((p) => (
          <Stack key={p.name} direction="row" rowGap={0.5}>
            <Typography variant="body2" sx={{ width: 50, fontWeight: "bold" }}>
              {p.name}
              {round(p.payload[p.name || ""], 1, ".")}
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
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults> | null;
  scenario: SCENARIOS;
  results: RiskFileQuantiResults | null;
  width?: number;
  height?: number;
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
  });
}
