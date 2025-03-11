import { Trans } from "react-i18next";
import { Box, Typography, Stack, Button, Container } from "@mui/material";
import openInNewTab from "../../../functions/openInNewTab";
import InformationButton from "../information/InformationButton";

export default function Introduction({}: {}) {
  return (
    <Container sx={{ pb: 12 }}>
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
            <Button variant="contained" onClick={() => openInNewTab("/learning/tools-analysisB-standard", "_blank")}>
              <Trans i18nKey="2A.introduction.button.infoportal">Open Information Portal</Trans>
            </Button>
          </Box>
          <Stack direction="column">
            <Typography variant="body2">
              <Trans i18nKey="2B.introduction.info.4">The application is divided into 3 main parts;</Trans>
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  <Trans i18nKey="2B.introduction.info.5">
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
                  <Trans i18nKey="2B.introduction.info.6">
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
                  <Trans i18nKey="2B.introduction.info.7">
                    Dans la troisième section intitulée{" "}
                    <b>
                      <i>effets catalyseurs</i>
                    </b>
                    , il vous sera demandé de décrire qualitativement comment le risque standard étudié peut être
                    affecté par un risque émergent.
                  </Trans>
                </Typography>
              </li>
            </ul>
          </Stack>
          <Stack direction="column">
            <Typography variant="body2">
              <Trans i18nKey="2B.introduction.info.9.1">
                Opgelet ! We herinneren u er graag aan dat u tijdens stap 1 van deze BNRA:
              </Trans>
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  <Trans i18nKey="2B.introduction.info.9.2">
                    oorzaak- en gevolgrelaties hebt geïdentificeerd tussen het standaard risico dat wordt bestudeerd en
                    de andere risico’s aanwezig in de BNRA-catalogus, evenals
                  </Trans>
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <Trans i18nKey="2B.introduction.info.9.3">
                    opkomende risico’s hebt geïdentificeerd die een katalyserend effect kunnen hebben op het standaard
                    risico dat wordt bestudeerd.
                  </Trans>
                </Typography>
              </li>
            </ul>
          </Stack>
          <Typography variant="body2">
            <Trans i18nKey="2B.introduction.info.9.4">
              De velden die in deze Risico Analyse B moeten worden ingevuld, hangen af van bovenvermelde linken die
              tijdens stap 1 werden geïdentificeerd en gevalideerd. Als er bijvoorbeeld geen opkomende risico's werden
              geïdentificeerd die een katalyserend effect hebben op het bestudeerde standaard risico, zal u de delen
              “Climate Change” en “Katalyserende effecten” niet zien in deze toepassing.
            </Trans>
          </Typography>
        </Stack>
      </Box>

      <InformationButton showTutorial={false} />
    </Container>
  );
}
