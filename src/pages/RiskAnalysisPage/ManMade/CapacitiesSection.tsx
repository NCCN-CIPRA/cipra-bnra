import { Box } from "@mui/material";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI from "../../../hooks/useAPI";

export default function CapacitiesSection({
  riskFile,
  scenario,
}: {
  riskFile: DVRiskSnapshot;
  scenario: SCENARIOS;
}) {
  const api = useAPI();

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
        <HTMLEditor
          initialHTML={riskFile.cr4de_quali_scenario_mrs || ""}
          onSave={(newHTML) =>
            api.updateRiskFile(riskFile._cr4de_risk_file_value, {
              cr4de_mrs_scenario: newHTML || undefined,
            })
          }
        />
      )}
    </Box>
  );
}
