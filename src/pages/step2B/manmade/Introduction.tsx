import { Trans } from "react-i18next";
import { Box, Typography, Stack, Button, Container } from "@mui/material";
import openInNewTab from "../../../functions/openInNewTab";

export default function Introduction({}: {}) {
  return (
    <Container>
      <Box sx={{ position: "relative", pb: 12 }}>
        <Box sx={{ mb: 2, ml: 1 }}>
          <Typography variant="h5">
            <Trans i18nKey="2B.MM.introduction.title">Introduction</Trans>
          </Typography>
        </Box>
        <Stack sx={{ mb: 4, ml: 1 }} rowGap={2}>
          <Typography variant="body2">
            <Trans i18nKey="2B.MM.introduction.info.1">
              Welcome to the third step in the risk analysis process, <b>Risk Analysis B</b>!
            </Trans>
          </Typography>
          <Typography variant="body2">
            <Trans i18nKey="2B.MM.introduction.info.2">
              In this step we will analyze the indirect probability and indirect impact of the risks, as well as
              catalyzing effects.
            </Trans>
          </Typography>
          <Typography variant="body2">
            <Trans i18nKey="2B.MM.introduction.info.portal.1">
              For a better understanding of the hows and whys of this step, please view the corresponding explanation
              videos in the information portal by clicking the button below
            </Trans>
          </Typography>
          <Box sx={{ textAlign: "center", mt: 4, mb: 8 }}>
            <Button variant="contained" onClick={() => openInNewTab("/learning/tools-analysisB-manmade", "_blank")}>
              <Trans i18nKey="2A.introduction.button.infoportal">Open Information Portal</Trans>
            </Button>
          </Box>
          <Typography variant="body2">
            <Trans i18nKey="2B.MM.introduction.info.4">The application is divided into 3 main parts;</Trans>
          </Typography>
          <ul>
            <li>
              <Typography variant="body2">
                <Trans i18nKey="2B.MM.introduction.info.5">
                  Dans la première section, intitulée{" "}
                  <b>
                    <i>causes</i>
                  </b>
                  , il vous sera demandé d'estimer quantitativement les probabilités conditionnelles des scénarios
                  d'intensité du risque standard étudié, puis de les justifier qualitativement.
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <Trans i18nKey="2B.MM.introduction.info.6">
                  Dans la deuxième section, intitulée{" "}
                  <b>
                    <i>changement climatique</i>
                  </b>
                  , il vous sera demandé d'estimer quantitativement les effets du changement climatique sur la
                  probabilité directe des scénarios d'intensité du risque standard étudié, puis de les justifier
                  qualitativement.
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body2">
                <Trans i18nKey="2B.MM.introduction.info.7">
                  Dans la troisième section intitulée{" "}
                  <b>
                    <i>effets catalyseurs</i>
                  </b>
                  , il vous sera demandé de décrire qualitativement comment le risque standard étudié peut être affecté
                  par un risque émergent.
                </Trans>
              </Typography>
            </li>
          </ul>
          <Typography variant="body2">
            <Trans i18nKey="2B.MM.introduction.info.8">
              Attention, pour rappel, lors de l'étape 1 de la BNRA vous avez identifié les relations de cause à effet
              entre le risque standard étudié et les autres risques du catalogue de la BNRA ainsi que les risques
              émergents qui peuvent avoir un effet catalyseur sur le risque standard étudié. Les champs à remplir lors
              de cette étape dépendent des liens qui ont été identifiés lors de l'étape 1. Par exemple, si aucun risque
              émergent n'a été identifié comme ayant un effet catalyseur sur le risque standard étudié, vous ne verrez
              pas apparaitre cette section dans l'application.
            </Trans>
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
