import { Box } from "@mui/material";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI from "../../../hooks/useAPI";

export default function Scenario({
  riskFile,
  scenario,
}: {
  riskFile: DVRiskSnapshot<unknown, unknown>;
  scenario: SCENARIOS;
}) {
  const api = useAPI();

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
      <HTMLEditor
        initialHTML={riskFile.cr4de_quali_scenario_mrs || ""}
        onSave={(newHTML) =>
          api.updateRiskFile(riskFile._cr4de_risk_file_value, {
            cr4de_mrs_scenario: newHTML || undefined,
          })
        }
      />
    </Box>
  );
}
