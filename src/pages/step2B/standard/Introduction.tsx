import { Trans } from "react-i18next";
import { Box, Typography, Stack, Button, Container } from "@mui/material";
import openInNewTab from "../../../functions/openInNewTab";

export default function Introduction({ onRunTutorial }: { onRunTutorial: () => void }) {
  return (
    <Container>
      <Box style={{ position: "relative" }}>
        <Box sx={{ mb: 2, ml: 1 }}>
          <Typography variant="h5">
            <Trans i18nKey="2B.introduction.title">Introduction</Trans>
          </Typography>
        </Box>
        <Stack sx={{ mb: 4, ml: 1 }} rowGap={2}>
          <Typography variant="body2">
            <Trans i18nKey="2B.introduction.info.1">
              Welcome to the third step in the risk analysis process, <b>Risk Analysis B</b>!
            </Trans>
          </Typography>
          <Typography variant="body2">
            <Trans i18nKey="2B.introduction.info.2">
              In this step we will analyze the indirect probability and indirect impact of the risks, as well as
              catalyzing effects.
            </Trans>
          </Typography>
          <Typography variant="body2">
            <Trans i18nKey="2B.introduction.info.portal.1">
              For a better understanding of the hows and whys of this step, please view the corresponding explanation
              videos in the information portal by clicking the button below
            </Trans>
          </Typography>
          <Box sx={{ textAlign: "center", mt: 4, mb: 8 }}>
            <Button variant="contained" onClick={() => openInNewTab("/learning/tools-analysisB", "_blank")}>
              <Trans i18nKey="2A.introduction.button.infoportal">Open Information Portal</Trans>
            </Button>
          </Box>
          <Typography variant="body2">
            <Trans i18nKey="2B.introduction.info.4">
              The application is divided into 3 main parts; causes, climate change and catalysing effects, visible
              below. If any of these is not applicable for your risk (e.g. because your risk is not affected by climate
              change), the corresponding step may not be visible.
            </Trans>
          </Typography>
          <Typography variant="body2">
            <Trans i18nKey="2B.introduction.info.5.1">
              Each part will ask you to analyze the connection between your risk and other risks within the BNRA risk
              catalogue:
            </Trans>
          </Typography>
          <ul>
            <li>
              <Typography variant="body2">
                <Trans i18nKey="2B.introduction.info.5.2">
                  <b>Causes:</b> You will be asked to estimate the conditional probability of another risk causing this
                  risk
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <Trans i18nKey="2B.introduction.info.5.3">
                  <b>Climate change:</b> You will be asked to estimate the effect of climate change on your risk in the
                  next 50 years
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <Trans i18nKey="2B.introduction.info.5.4">
                  <b>Catalyzing effects:</b> You will be asked to qualitatively describe the potential catalyzing
                  effects of an emerging risk on your risk in the future
                </Trans>
              </Typography>
            </li>
          </ul>
          <Typography variant="body2">
            <Trans i18nKey="2B.introduction.info.6">
              Each part will provide a tutorial specific to that page to guide you through the process.
            </Trans>
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
