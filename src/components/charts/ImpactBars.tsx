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
  width,
  height,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults> | null;
  scenario: SCENARIOS;
  width?: number;
  height?: number;
}) {
  return ImpactBarChart({ riskFile, scenario, width, height, CustomTooltip });
}
