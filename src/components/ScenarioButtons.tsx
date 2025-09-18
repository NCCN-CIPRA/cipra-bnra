import { Button, Stack } from "@mui/material";
import { SCENARIO_PARAMS, SCENARIOS } from "../functions/scenarios";

export function ScenarioButtons({
  scenario,
  setScenario,
}: {
  scenario: SCENARIOS;
  setScenario: (s: SCENARIOS) => void;
}) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Button
        variant="outlined"
        sx={{
          color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
          fontWeight: scenario === SCENARIOS.CONSIDERABLE ? "bold" : "normal",
          opacity: scenario === SCENARIOS.CONSIDERABLE ? 1 : 0.15,
          borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
          borderRadius: "50%",
          backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color}20`,
          width: 48,
          minWidth: 48,
          height: 48,
          "&:hover": {
            opacity: 1,
            backgroundColor: `${
              SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
            }20`,
            borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
          },
        }}
        onClick={() => setScenario(SCENARIOS.CONSIDERABLE)}
      >
        C
      </Button>
      <Button
        variant="outlined"
        sx={{
          color: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
          fontWeight: scenario === SCENARIOS.MAJOR ? "bold" : "normal",
          opacity: scenario === SCENARIOS.MAJOR ? 1 : 0.3,
          borderColor: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
          borderRadius: "50%",
          backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}20`,
          width: 48,
          minWidth: 48,
          height: 48,
          "&:hover": {
            opacity: 1,
            backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}20`,
            borderColor: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
          },
        }}
        onClick={() => setScenario(SCENARIOS.MAJOR)}
      >
        M
      </Button>
      <Button
        variant="outlined"
        sx={{
          color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
          fontWeight: scenario === SCENARIOS.EXTREME ? "bold" : "normal",
          opacity: scenario === SCENARIOS.EXTREME ? 1 : 0.15,
          borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
          borderRadius: "50%",
          backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.EXTREME].color}20`,
          width: 48,
          minWidth: 48,
          height: 48,
          "&:hover": {
            opacity: 1,
            backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.EXTREME].color}20`,
            borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
          },
        }}
        onClick={() => setScenario(SCENARIOS.EXTREME)}
      >
        E
      </Button>
    </Stack>
  );
}
