import { Alert, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import ScenarioTable from "../information/ScenarioTable";
import { ScenarioInputs } from "../fields";
import { ScenarioErrors } from "../information/Progress";
import { Sa, Sb, Sc, Sd } from "../../learning/QuantitativeScales/S";
import { Ea } from "../../learning/QuantitativeScales/E";
import { Ha, Hb, Hc } from "../../learning/QuantitativeScales/H";
import { Fa, Fb } from "../../learning/QuantitativeScales/F";

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
        <Trans i18nKey="2A.review.info.1">
          Sur cette page, vous trouverez un aperçu de l’ensemble de vos évaluations et de vos commentaires. Cet aperçu
          vous permet de vérifier la cohérence de vos inputs avant de clôturer l’étape 2A.
        </Trans>
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 6 }}>
        <Trans i18nKey="2A.review.info.2">
          Quand vous estimez que vous avez terminé cette étape, nous vous invitons à cliquer sur le bouton “sauvegarder
          et quitter” puis “oui, j’ai fini”. Nous recevrons alors une notification automatique et vous pourrez alors
          débuter la deuxième partie de l’étape 2.
        </Trans>
      </Typography>

      <Typography variant="h6">
        <Trans i18nkey="2A.review.dp.title">Direct Probability</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_dp_quali", "cr4de_dp_quanti"]} />

      <Typography variant="h6">
        <Trans i18nkey="2A.review.di.h.title">Direct Human Impact</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_di_quali_h", Ha, Hb, Hc]} />

      <Typography variant="h6">
        <Trans i18nkey="2A.review.di.s.title">Direct Societal Impact</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_di_quali_s", Sa, Sb, Sc, Sd]} />

      <Typography variant="h6">
        <Trans i18nkey="2A.review.di.e.title">Direct Environmental Impact</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_di_quali_e", Ea]} />

      <Typography variant="h6">
        <Trans i18nkey="2A.review.di.f.title">Direct Financial Impact</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_di_quali_f", Fa, Fb]} />

      <Typography variant="h6">
        <Trans i18nkey="2A.review.cb.title">Cross-border Impact</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_cross_border_impact_quali"]} />
      {/* <Typography variant="subtitle1">
        <Trans i18nkey="2A.qualiH.title">Direct Impact - Human Impact</Trans>
      </Typography>
      <Box
        dangerouslySetInnerHTML={{
          __html: input.cr4de_di_quali_h || "<p>/</p>",
        }}
        component={Paper}
        sx={{ mt: 2, mb: 4, px: 2 }}
      />
      <Typography variant="subtitle1">
        <Trans i18nkey="2A.qualiP.title">Direct Impact - Societal Impact</Trans>
      </Typography>
      <Box
        dangerouslySetInnerHTML={{
          __html: input.cr4de_di_quali_s || "<p>/</p>",
        }}
        component={Paper}
        sx={{ mt: 2, mb: 4, px: 2 }}
      />
      <Typography variant="subtitle1">
        <Trans i18nkey="2A.qualiP.title">Direct Impact - Environmental Impact</Trans>
      </Typography>
      <Box
        dangerouslySetInnerHTML={{
          __html: input.cr4de_di_quali_e || "<p>/</p>",
        }}
        component={Paper}
        sx={{ mt: 2, mb: 4, px: 2 }}
      />
      <Typography variant="subtitle1">
        <Trans i18nkey="2A.qualiP.title">Direct Impact - Financial Impact</Trans>
      </Typography>
      <Box
        dangerouslySetInnerHTML={{
          __html: input.cr4de_di_quali_f || "<p>/</p>",
        }}
        component={Paper}
        sx={{ mt: 2, mb: 4, px: 2 }}
      />
      <Typography variant="subtitle1">
        <Trans i18nkey="2A.qualiCB.title">Cross-border Impact</Trans>
      </Typography>
      <Box
        dangerouslySetInnerHTML={{
          __html: input.cr4de_di_quali_f || "<p>/</p>",
        }}
        component={Paper}
        sx={{ mt: 2, mb: 4, px: 2 }}
      /> */}
    </Stack>
  );
}
