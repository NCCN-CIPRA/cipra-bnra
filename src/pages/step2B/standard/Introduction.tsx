import { Trans } from "react-i18next";
import { Box, Typography, Stack, Button, Container } from "@mui/material";

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
            <Trans i18nKey="2B.introduction.info.3">
              If you would like a tutorial on how to use the application, press the button below. Otherwise press the{" "}
              <b>Next</b> button on the bottom-right to continue to part 2
            </Trans>
          </Typography>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button variant="contained" onClick={onRunTutorial}>
              <Trans i18nKey="2B.introduction.button.tutorial">Show Application Tutorial</Trans>
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
