import { Trans } from "react-i18next";
import { Box, Typography, Stack, Button } from "@mui/material";
import openInNewTab from "../../../functions/openInNewTab";

export default function Introduction({ onRunTutorial }: { onRunTutorial: () => void }) {
  return (
    <Box style={{ position: "relative" }}>
      <Box sx={{ mb: 2, ml: 1 }}>
        <Typography variant="h5">
          <Trans i18nKey="2A.introduction.title">Introduction</Trans>
        </Typography>
      </Box>
      <Stack sx={{ mb: 4, ml: 1 }} rowGap={2}>
        <Typography variant="body2">
          <Trans i18nKey="2A.introduction.info.1">
            Welcome to the second step in the risk analysis process, <b>Risk Analysis A</b>!
          </Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.introduction.info.2">
            In this step we will analyze the direct probability and direct impact of the risks, as well as potential
            cross-border effects. Risk cascades and catalyzing effects will be left until the next step (Analysis B).
          </Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.introduction.info.portal.1">
            For a better understanding of the hows and whys of this step, please view the corresponding explanation
            videos in the information portal by clicking the button below
          </Trans>
        </Typography>
        <Box sx={{ textAlign: "center", mt: 4, mb: 8 }}>
          <Button variant="contained" onClick={() => openInNewTab("/learning/tools-validation", "_blank")}>
            <Trans i18nKey="2A.introduction.button.infoportal">Open Information Portal</Trans>
          </Button>
        </Box>
        <Typography variant="body2">
          <Trans i18nKey="2A.introduction.info.3">
            The application is divided into 3 main parts; 1 for each scenario (Considerable, Major, Extreme), visible
            below. For each scenario, you will be asked to estimate each parameter mentioned above according to your
            personal expertise. Afterwards, you will be able to check and compare your input for each scenario in the
            last part (Review)
          </Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.introduction.info.31">
            Binnen de 3 hooddelen zal u gevraagd worden om de directe waarschijnlijkheid en de directe impacten van de
            intensiteitsscenario’s van het bestudeerde risico kwantitatief in te schatten en deze vervolgens kwalitatief
            te onderbouwen. U kunt de kwantitatieve schalen oproepen via de “informatie” knop die u terugvindt links
            onderaan uw scherm. Hierop vindt u naast de waarden gekoppeld aan de verschillende klassen (0 – 5) ook een
            beschrijving terug van de verschillende in te schatten parameters en verklarende concrete voorbeelden.
          </Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2A.introduction.info.4">
            If you would like a tutorial on how to use the application, press the button below. Otherwise press the{" "}
            <b>Next</b> button on the bottom-right to continue to part 2
          </Trans>
        </Typography>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="contained" onClick={onRunTutorial}>
            <Trans i18nKey="2A.introduction.button.tutorial">Show Application Tutorial</Trans>
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
