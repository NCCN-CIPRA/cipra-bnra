import { Box } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";

export default function Scenario({
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
        py: 2,
        mt: 2,
        minHeight: 250,
        background: "white",
      }}
    >
      <Box
        className="htmleditor"
        dangerouslySetInnerHTML={{ __html: riskFile.cr4de_mrs_scenario || "" }}
      />
    </Box>
  );
}
