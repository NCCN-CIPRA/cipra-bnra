import { Box } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";

export default function CapacitiesSection({
  riskFile,
  scenario,
}: {
  riskFile: DVRiskFile;
  scenario: SCENARIOS;
}) {
  return (
    <Box
      sx={{
        borderLeft: "solid 8px " + SCENARIO_PARAMS[scenario].color,
        pl: 2,
        py: 1,
        mt: 2,
        background: "white",
      }}
    >
      {riskFile.cr4de_mrs_scenario && (
        <Box
          className="htmleditor"
          dangerouslySetInnerHTML={{ __html: riskFile.cr4de_mrs_scenario }}
        />
      )}
    </Box>
  );
}
