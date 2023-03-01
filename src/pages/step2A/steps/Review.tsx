import { Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import ScenarioTable from "../information/ScenarioTable";
import { ScenarioInputs } from "../fields";

export default function Review({ inputs }: { inputs: ScenarioInputs }) {
  return (
    <Stack sx={{ ml: 1 }}>
      <Typography variant="h6">
        <Trans i18nkey="2A.review.dp.title">Direct Probability</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_dp_quali", "cr4de_dp_quanti"]} />

      <Typography variant="h6">
        <Trans i18nkey="2A.review.di.h.title">Direct Human Impact</Trans>
      </Typography>

      <ScenarioTable
        inputs={inputs}
        fields={["cr4de_di_quali_h", "cr4de_di_quanti_ha", "cr4de_di_quanti_hb", "cr4de_di_quanti_hc"]}
      />

      <Typography variant="h6">
        <Trans i18nkey="2A.review.di.s.title">Direct Societal Impact</Trans>
      </Typography>

      <ScenarioTable
        inputs={inputs}
        fields={[
          "cr4de_di_quali_s",
          "cr4de_di_quanti_sa",
          "cr4de_di_quanti_sb",
          "cr4de_di_quanti_sc",
          "cr4de_di_quanti_sd",
        ]}
      />

      <Typography variant="h6">
        <Trans i18nkey="2A.review.di.e.title">Direct Environmental Impact</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_di_quali_e", "cr4de_di_quanti_ea"]} />

      <Typography variant="h6">
        <Trans i18nkey="2A.review.di.f.title">Direct Financial Impact</Trans>
      </Typography>

      <ScenarioTable inputs={inputs} fields={["cr4de_di_quali_f", "cr4de_di_quanti_fa", "cr4de_di_quanti_fb"]} />

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
