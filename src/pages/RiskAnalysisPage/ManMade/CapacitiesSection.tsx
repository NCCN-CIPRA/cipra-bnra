import { Box } from "@mui/material";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";

export default function CapacitiesSection({
  riskFile,
  scenario,
}: {
  riskFile: DVRiskSnapshot;
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
      {riskFile.cr4de_quali_scenario_mrs && (
        <Box
          className="htmleditor"
          dangerouslySetInnerHTML={{
            __html: riskFile.cr4de_quali_scenario_mrs,
          }}
        />
      )}
    </Box>
  );
}
