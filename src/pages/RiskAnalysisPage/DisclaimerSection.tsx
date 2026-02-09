import { Box, Stack, Typography } from "@mui/material";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../types/dataverse/DVRiskSnapshot";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import HTMLEditor from "../../components/HTMLEditor";
import useAPI from "../../hooks/useAPI";

export default function DisclaimerSection({
  riskFile,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults>;
}) {
  const { user } = useOutletContext<BasePageContext>();
  const api = useAPI();

  if (!riskFile.cr4de_quali_disclaimer_mrs && !user?.admin) return null;

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
          <HTMLEditor
            initialHTML={riskFile.cr4de_quali_disclaimer_mrs || ""}
            onSave={(newHTML) =>
              api.updateRiskFile(riskFile._cr4de_risk_file_value, {
                cr4de_mrs_disclaimer: newHTML || undefined,
              })
            }
          />
        </Box>
      </Stack>
    </Box>
  );
}
