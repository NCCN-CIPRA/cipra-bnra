import { TooltipProps } from "recharts";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { Box, Stack, Typography } from "@mui/material";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS } from "../../functions/scenarios";
import round from "../../functions/roundNumberString";
import { capFirst } from "../../functions/capFirst";
import ScenarioMatrixChart from "./svg/ScenarioMatrixChart";

const CustomTooltip = ({ active, payload }: TooltipProps<number, NameType>) => {
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
        <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
          {capFirst(payload[0].payload.name)} scenario
        </Typography>

        <Stack direction="row" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ width: 100 }}>
            Probability :
          </Typography>
          <Typography variant="body2" sx={{ width: 50, textAlign: "right" }}>
            {round(payload[1]?.value)} / 5
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ width: 100 }}>
            Impact :
          </Typography>
          <Typography variant="body2" sx={{ width: 50, textAlign: "right" }}>
            {round(payload[0].value)} / 5
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ width: 100, fontWeight: "bold" }}>
            Total Risk :
          </Typography>
          <Typography
            variant="body2"
            sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}
          >
            {round((payload[0].value || 0) * (payload[1].value || 0))}
          </Typography>
        </Stack>
      </Box>
    );
  }

  return null;
};

export default function ScenarioMatrix({
  riskFile,
  mrs,
  fontSize = 12,
  radius = 150,
  width = 300,
  height = 270,
}: {
  riskFile: DVRiskFile;
  mrs: SCENARIOS;
  fontSize?: number;
  radius?: number;
  width?: number;
  height?: number;
}) {
  return ScenarioMatrixChart({
    riskFile,
    mrs,
    fontSize,
    radius,
    width,
    height,
    // @ts-expect-error any
    CustomTooltip,
  });
}
