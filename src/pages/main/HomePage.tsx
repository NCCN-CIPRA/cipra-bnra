import { Box, Container, Button, Stack, Typography } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { Link as RouterLink } from "react-router-dom";
import { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Trans, useTranslation } from "react-i18next";
import usePageTitle from "../../hooks/usePageTitle";

export default function HomePage() {
  const { t } = useTranslation();

  usePageTitle(t("homepage.bnraLong", "Belgian National Risk Assessment"));

  useBreadcrumbs(null);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(128, 180, 180, 0.33)",
          backgroundImage: "url('https://bnra.powerappsportals.com/banner.png')",
          backgroundSize: "auto 800px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: -10,
          opacity: 0.6,
        }}
      />
      <Box
        sx={{
          mt: -2,
          width: "100%",
          height: 300,
          backgroundColor: "transparent",
        }}
      >
        <Container sx={{ display: "flex", alignItems: "flex-end", height: "100%", pb: 4 }}>
          <Stack direction="column">
            <img
              alt="text logo"
              src="https://bnra.powerappsportals.com/logo_text.png"
              style={{ width: 300, marginBottom: 20 }}
            />
            <Typography variant="subtitle1" paragraph>
              <Trans i18nKey="homepage.bnraLong">Belgian National Risk Assessment</Trans>
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Box sx={{ bgcolor: "white", width: "100%", pt: 4 }}>
        <Container>
          <Box sx={{ mt: 4, textAlign: "justify" }}>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="homepage.introtext1">
                Met de <b>Belgian National Risk Assessment</b> (Belgische Nationale Risicobeoordeling) wil het Nationaal
                Crisiscentrum, samen met zijn belangrijkste partners, relevante risico{"’"}s waaraan België blootgesteld
                kan worden <b>identificeren</b> en <b>evalueren</b>, op een gestructureerde en wetenschappelijk correcte
                manier.
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="homepage.introtext2">
                De BNRA zal verlopen in verschillende stappen. De deelnemers krijgen telkens de nodige informatie en
                tools ter beschikking gesteld om deze stappen succesvol te doorlopen.
              </Trans>
            </Typography>
          </Box>

          <Box sx={{ mt: 8, pb: 4 }}>
            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: {
                  flex: 0.2,
                },
              }}
            >
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  <Trans i18nKey="homepage.step1.timing">Begin oktober - eind november 2022</Trans>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 6 }}>
                  <Typography variant="subtitle2" paragraph sx={{ mt: "2px" }}>
                    <Trans i18nKey="homepage.step1.title">Onboarding en introductie</Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="homepage.step1.description">
                      Je krijgt toegang tot het leerplatform van de BNRA 2023 - 2026. Hier vind je op een
                      overzichtelijke en makkelijk doorzoekbare manier alle informatie met betrekking tot de
                      methodologie en gebruikte tools van de BNRA.
                    </Trans>
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  <Trans i18nKey="homepage.step2.timing">Najaar 2022 - najaar 2023</Trans>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 6 }}>
                  <Typography variant="subtitle2" paragraph sx={{ mt: "2px" }}>
                    <Trans i18nKey="homepage.step2.title">Individuele risico-identificatie en analyse</Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="homepage.step2.description.part1">
                      Op basis van jouw expertise vul jij de risico-identificatie & analyse in. Dit gebeurt{" "}
                      <b>individueel</b> via een <b>online tool</b>.
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="homepage.step2.description.part2">
                      De risico-identificatie en analyse bestaat uit 3 onderdelen:
                    </Trans>
                  </Typography>
                  <Typography variant="caption" paragraph component="div">
                    <Trans i18nKey="homepage.step2.description.part3">
                      <ol>
                        <li style={{ marginBottom: 10 }}>
                          De risico-identificatie behandelt o.a. de definitie van 3 intensiteitsscenario's op basis van
                          parameters en de relaties tussen risico's (oorzaak - gevolg), die in een latere fase
                          geanalyseerd worden.
                        </li>
                        <li style={{ marginBottom: 10 }}>
                          De risico-analyse deel 1 behandelt o.a. de direct waarschijnlijkheid & impact van het risico
                          volgens 4 categorieën (menselijke, maatschappelijke, milieu en financiële impact), het effect
                          van klimaatverandering (indien van toepassing) en de grensoverschrijdende effecten.
                        </li>
                        <li>De risico-analyse deel 2 behandelt de cascade-effecten van het risico.</li>
                      </ol>
                    </Trans>
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  <Trans i18nKey="homepage.step3.timing">Voorjaar 2023 - najaar 2023</Trans>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 6 }}>
                  <Typography variant="subtitle2" paragraph sx={{ mt: "2px" }}>
                    <Trans i18nKey="homepage.step3.title">Consensus en feedback</Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="homepage.step3.description.part1">
                      Per risico organiseren we een consensusmeeting met <b>alle experts</b>. Zo krijg je inzicht in hoe
                      andere experten hetzelfde risico beoordeeld hebben en kan je met hen in overleg gaan. Op basis van
                      deze discussie komen we tot <b>één geconsolideerd resultaat</b>.
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="homepage.step3.description.part2">
                      Tijdens deze meeting krijg je ook de kans om feedback te geven over het proces die wij kunnen
                      gebruiken om de volgende iteratie van de BNRA te verbeteren.
                    </Trans>
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  <Trans i18nKey="homepage.step4.timing">2024</Trans>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 6 }}>
                  <Typography variant="subtitle2" paragraph sx={{ mt: "2px" }}>
                    <Trans i18nKey="homepage.step4.title">Resultaten en rapportage</Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="homepage.step4.description">We stellen de resultaten graag aan je voor.</Trans>
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </Box>
          <Stack direction="column" sx={{ pb: 8, textAlign: "justify" }}>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="homepage.information">
                Een diepgaande uitleg over de methodologie en tools die tijdens BNRA gehanteerde zullen worden, alsook
                praktijkvoorbeelden, zijn terug te vinden in het leerplatform.
              </Trans>
            </Typography>
            <Button variant="contained" sx={{ alignSelf: "center", mt: 4 }} to="/learning" component={RouterLink}>
              <Trans i18nKey="homepage.button.information">Naar het leerplatform</Trans>
            </Button>
          </Stack>
        </Container>
      </Box>
      <Box
        sx={{
          width: "100%",
          py: 8,
        }}
      >
        <Container>
          <Typography variant="subtitle2" paragraph sx={{ textAlign: "center" }}>
            <Trans i18nKey="homepage.experts">
              Aan de BNRA zullen experten uit overheidsorganisaties, kenniscentra en andere deelnemen. We mikken op
              minstens 360 experten, verdeeld over ongeveer 120 risico’s.
            </Trans>
          </Typography>
          <Stack direction="row" spacing={8} sx={{ mt: 8 }}>
            <Stack direction="column">
              <Typography variant="h5" sx={{ mb: 4 }}>
                <Trans i18nKey="homepage.expectations.title">Wat wordt er verwacht van de deelnemers?</Trans>
              </Typography>
              <Typography variant="body1" paragraph>
                <Trans i18nKey="homepage.expectations.part1">
                  Tijdens de analyse willen wij beroep doen op{" "}
                  <b>jouw professionele kennis ter zake, ervaring, achtergrond, knowhow,...</b> Specifieke opzoekingen,
                  teamoverleg of bijkomend statistisch materiaal is niet noodzakelijk. Jouw{" "}
                  <b>persoonlijke inschatting is voldoende</b> en zal bovendien nooit rechtstreeks aan jou of jouw
                  organisatie verbonden worden zonder expliciete toestemming.
                </Trans>
              </Typography>
              <Typography variant="body1" paragraph>
                <Trans i18nKey="homepage.expectations.part2">
                  De totale werklast werd tijdens een interne testcase bestudeerd en wordt momenteel geschat op ongeveer{" "}
                  <b>3 à 5 werkdagen per expert per risico</b>. Deze werklast is gespreid over de hierboven beschreven
                  deelstappen <b>gedurende 6-9 maanden</b>.
                </Trans>
              </Typography>
              <Typography variant="body1" paragraph>
                <Trans i18nKey="homepage.expectations.part3">
                  Als deelnemende expert houden we je op de hoogte van de resultaten van het onderzoek. Mits jouw
                  toestemming, vermelden we jou of je dienst in het dankwoord of gelijkaardige secties van alle
                  publicaties door het NCCN met betrekking tot de BNRA.
                </Trans>
              </Typography>
              {/* <Button
                variant="contained"
                sx={{ alignSelf: "center", mt: 4 }}
                href="https://crisiscentrum.be/nl/bnra/neem-deel"
                target="_blank"
              >
                <Trans i18nKey="homepage.button.participate">Neem deel aan de BNRA 2023 - 2026</Trans>
              </Button> */}
            </Stack>
            <Box>
              <img alt="Time estimation" src="https://bnra.powerappsportals.com/time.png" style={{ width: 400 }}></img>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "white",
          pt: 8,
          pb: 16,
        }}
      >
        <Container>
          <Typography variant="subtitle2" paragraph sx={{ textAlign: "center" }}>
            <Trans i18nKey="homepage.coordination">
              Sinds 2018 coördineert het Nationaal Crisiscentrum (NCCN) deze risicobeoordeling. Dit is ook een
              verplichting in het kader van het EU-besluit van december 2013 (1313/2013/EU).
            </Trans>
          </Typography>
          <Stack direction="row" spacing={8} sx={{ mt: 8 }}>
            <Box>
              <img
                alt="risicocyclus"
                src="https://crisiscentrum.be/sites/default/files/documents/images/Risicoanalyse.png"
                style={{ width: 400 }}
              ></img>
            </Box>
            <Box sx={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
              <Typography variant="h5" sx={{ mb: 4 }}>
                <Trans i18nKey="homepage.goals.title">Wat zijn de doelstellingen?</Trans>
              </Typography>
              <Typography variant="body1" paragraph>
                <Trans i18nKey="homepage.goals.part1">
                  De BNRA vult de <b>eerste stap in van de risicocyclus</b>, met name de identificatie en evaluatie van
                  risico’s. De resultaten van deze risicobeoordeling zijn een belangrijke bron van informatie om de
                  volgende stappen van de risicocyclus invulling te geven, waaronder de noodplanning en het
                  crisisbeheer.
                </Trans>
              </Typography>
              <Typography variant="body1" paragraph>
                <Trans i18nKey="homepage.goals.part2">
                  Het uiteindelijke doel van de BNRA is om op een gestructureerde en wetenschappelijke correcte manier{" "}
                  <b>de impact, waarschijnlijkheid en cascade-effecten</b> in kaart te brengen voor de nationale
                  risico’s. Deze risicobeoordeling vormt één van de elementen die kan bijdragen aan het nationale
                  noodplanningsbeleid en crisisbeheer.
                </Trans>
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 4 }}>
              <Trans i18nKey="homepage.nccn.title">Wat doet het Nationaal Crisiscentrum?</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="homepage.nccn.description">
                Het Nationaal Crisiscentrum is verantwoordelijk voor de nationale noodplanning en het crisisbeheer
                tijdens federale fases in België. De directie CIPRA (Kritieke Infrastructuur en Risicoanalyse) binnen
                het NCCN houdt zich bezig met het eerste aspect van de risicocyclus, nl. risico-identificatie en
                -evaluatie. <a href="https://crisiscentrum.be/nl">Lees hier meer</a>.
              </Trans>
            </Typography>
          </Box>
        </Container>
      </Box>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-evenly",
          py: 2,
          backgroundColor: "white",
          borderTop: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <img
          alt="Nationaal Crisiscentrum"
          src="https://bnra.powerappsportals.com/logo_nccn.svg"
          style={{ height: 40 }}
        />
        <img alt="BNRA" src="https://bnra.powerappsportals.com/logo_text.png" style={{ height: 40 }} />
      </Stack>
    </>
  );
}
