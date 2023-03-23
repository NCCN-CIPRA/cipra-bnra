import { Alert, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import ScenarioTable from "../information/ScenarioTable";
import { ScenarioInputs } from "../fields";
import { ScenarioErrors } from "../information/Progress";

export default function Review({ inputs, inputErrors }: { inputs: ScenarioInputs; inputErrors: ScenarioErrors }) {
  return (
    <Stack sx={{ ml: 1 }}>
      {Object.values(inputErrors).some((e) => e.length > 0) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography>
            <Trans i18nKey="2A.review.errors">
              Some scenarios are missing your input. Please check the progress bar at the bottom of the page.
            </Trans>
          </Typography>
        </Alert>
      )}

      <Typography variant="h6">
        <Trans i18nkey="2A.review.dp.title">Motivation</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_dp_quali", "cr4de_dp_quanti"]} />
    </Stack>
  );
}
