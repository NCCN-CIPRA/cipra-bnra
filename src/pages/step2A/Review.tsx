import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { Stack, Typography, Box, Paper } from "@mui/material";
import { Trans } from "react-i18next";

export default function Review({ input }: { input: Partial<DVDirectAnalysis> }) {
  return (
    <Stack sx={{ ml: 1 }}>
      <Typography variant="subtitle1">
        <Trans i18nkey="2A.qualiP.title">Direct Probability</Trans>
      </Typography>
      <Box
        dangerouslySetInnerHTML={{
          __html: input.cr4de_dp_quali || "",
        }}
        component={Paper}
        sx={{ mt: 2, mb: 4, px: 2 }}
      />
      <Typography variant="subtitle1">
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
      />
    </Stack>
  );
}
