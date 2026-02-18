import { Box, Stack } from "@mui/material";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { useMutation } from "@tanstack/react-query";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import { RiskFileQuantiResults } from "../../../types/dataverse/DVRiskFile";

export default function CapacitiesSection({
  riskFile,
  scenario,
  results,
}: {
  riskFile: DVRiskSnapshot;
  scenario: SCENARIOS;
  results?: RiskFileQuantiResults | null;
}) {
  const api = useAPI();

  const updateRiskFile = useMutation({
    mutationFn: (newHTML: string) =>
      api.updateRiskFile(riskFile._cr4de_risk_file_value, {
        cr4de_mrs_scenario: newHTML || undefined,
      }),
  });

  return (
    <Stack
      sx={{
        borderLeft: "solid 8px " + SCENARIO_PARAMS[scenario].color,
        pl: 2,
        py: 1,
        mt: 2,
        background: "white",
      }}
      direction="row"
    >
      {riskFile.cr4de_quali_scenario_mrs && (
        <>
          <HTMLEditor
            initialHTML={riskFile.cr4de_quali_scenario_mrs || ""}
            onSave={updateRiskFile}
            queryKeyToInvalidate={[
              DataTable.RISK_FILE,
              riskFile._cr4de_risk_file_value,
            ]}
          />

          <Box sx={{ width: 300 }}>
            <ScenarioMatrix
              riskFile={riskFile}
              mrs={scenario}
              results={results}
            />
          </Box>
        </>
      )}
    </Stack>
  );
}
