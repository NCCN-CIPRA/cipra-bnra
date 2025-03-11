import { Trans } from "react-i18next";
import { Box, Typography, Stack, Button, Container } from "@mui/material";
import openInNewTab from "../../../functions/openInNewTab";

export default function Introduction({}: {}) {
  return (
    <Container>
      <Box style={{ position: "relative" }}>
        <Box sx={{ mb: 2, ml: 1 }}>
          <Typography variant="h5">
            <Trans i18nKey="2B.EM.introduction.title">Introduction</Trans>
          </Typography>
        </Box>
        <Stack sx={{ mb: 4, ml: 1 }} rowGap={2}>
          <Typography variant="body2">
            <Trans i18nKey="2B.EM.introduction.info.1">
              Welcome to the third step in the risk analysis process, <b>Risk Analysis B</b>!
            </Trans>
          </Typography>
          <Typography variant="body2">
            <Trans i18nKey="2B.EM.introduction.info.2">
              In this step we will analyze the indirect probability and indirect impact of the risks, as well as
              catalyzing effects.
            </Trans>
          </Typography>
          <Typography variant="body2">
            <Trans i18nKey="2B.EM.introduction.info.portal.1">
              For a better understanding of the hows and whys of this step, please view the corresponding explanation
              videos in the information portal by clicking the button below
            </Trans>
          </Typography>
          <Box sx={{ textAlign: "center", mt: 4, mb: 8 }}>
            <Button variant="contained" onClick={() => openInNewTab("/learning/tools-analysisB-emerging", "_blank")}>
              <Trans i18nKey="2A.introduction.button.infoportal">Open Information Portal</Trans>
            </Button>
          </Box>
          <Typography variant="body2">
            <Trans i18nKey="2B.EM.introduction.info.4">The application is divided into 3 main parts;</Trans>
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
