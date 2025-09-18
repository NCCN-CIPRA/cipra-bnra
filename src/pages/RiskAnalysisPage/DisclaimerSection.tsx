import { Box, Stack, Typography } from "@mui/material";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../types/dataverse/DVRiskSnapshot";

export default function DisclaimerSection({
  riskFile,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults>;
}) {
  if (!riskFile.cr4de_quali_disclaimer_mrs) return null;

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5">Disclaimer</Typography>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          borderLeft: `solid 8px ${SCENARIO_PARAMS[SCENARIOS.EXTREME].color}`,
          px: 2,
          py: 1,
          mt: 2,
          backgroundColor: "white",
        }}
      >
        <WarningAmberIcon
          sx={{ color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color }}
        />
        <Box sx={{ flex: 1, ml: 2 }}>
          <Box
            className="htmleditor"
            sx={{
              mb: 4,
              fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            }}
            dangerouslySetInnerHTML={{
              __html: riskFile.cr4de_quali_disclaimer_mrs || "",
            }}
          />
        </Box>
      </Stack>
    </Box>
  );
}
