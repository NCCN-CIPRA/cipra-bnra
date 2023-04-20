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

      <Typography variant="body1" paragraph>
        <Trans i18nKey="2A.m.review.info.1">
          Sur cette page, vous trouverez un aperçu de l’ensemble de vos évaluations et de vos commentaires. Cet aperçu
          vous permet de vérifier la cohérence de vos inputs avant de clôturer l’étape 2A.
        </Trans>
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 6 }}>
        <Trans i18nKey="2A.m.review.info.2">
          Quand vous estimez que vous avez terminé cette étape, nous vous invitons à cliquer sur le bouton{" "}
          <i>sauvegarder et quitter</i> puis <i>oui, j’ai fini</i>. Nous recevrons alors une notification automatique et
          vous pourrez alors débuter la deuxième partie de l’étape 2.
        </Trans>
      </Typography>

      <Typography variant="h6">
        <Trans i18nkey="2A.review.m.title">Motivation</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_dp_quali", "cr4de_dp_quanti"]} />
    </Stack>
  );
}
