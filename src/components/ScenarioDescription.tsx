import { Box, Stack, Typography } from "@mui/material";
import { IntensityParameter } from "../functions/intensityParameters";
import { SCENARIO_PARAMS, SCENARIOS } from "../functions/scenarios";
import { capFirst } from "../functions/capFirst";

export default function ScenarioDescription({
  parameters,
}: {
  parameters: IntensityParameter<string>[];
}) {
  return (
    <Stack direction="column" sx={{ bgcolor: "white" }}>
      {parameters.map((p) => (
        <>
          {p.name && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              <b>{p.name}:</b>
            </Typography>
          )}
          <Box dangerouslySetInnerHTML={{ __html: p.value || "" }} />
        </>
      ))}
    </Stack>
  );
}

export function ScenarioDescriptionBox({
  scenario,
  parameters,
}: {
  scenario: SCENARIOS;
  parameters: IntensityParameter<string>[];
}) {
  return (
    <Box
      sx={{
        borderLeft: `6px solid ${SCENARIO_PARAMS[scenario].color}`,
        pl: 1,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: "bold",
          color: SCENARIO_PARAMS[scenario].color,
        }}
      >
        {capFirst(scenario)} Scenario
      </Typography>
      <ScenarioDescription parameters={parameters} />
    </Box>
  );
}
