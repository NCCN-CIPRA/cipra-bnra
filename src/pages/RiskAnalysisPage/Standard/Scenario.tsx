import { Box } from "@mui/material";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";

export default function Scenario({
  riskFile,
  scenario,
}: {
  riskFile: DVRiskSnapshot<unknown, unknown>;
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
        dangerouslySetInnerHTML={{
          __html: riskFile.cr4de_quali_scenario_mrs || "",
        }}
      />
    </Box>
  );
}
