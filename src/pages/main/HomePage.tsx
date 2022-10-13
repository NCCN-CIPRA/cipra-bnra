import { Box, Container, Button, Link, Stack, Typography } from "@mui/material";
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

export default function HomePage() {
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
            <img src="https://bnra.powerappsportals.com/logo_text.png" style={{ width: 300, marginBottom: 20 }} />
            <Typography variant="subtitle1" paragraph>
              Belgian National Risk Assessment 2023 - 2026
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Box sx={{ bgcolor: "white", width: "100%", pt: 4 }}>
        <Container>
          <Box sx={{ mt: 4, textAlign: "justify" }}>
            <Typography variant="body1" paragraph>
              Met de <b>Belgian National Risk Assessment</b> (Belgische Nationale Risicobeoordeling) wil het Nationaal
              Crisiscentrum, samen met zijn belangrijkste partners, relevante risico{"’"}s waaraan België blootgesteld
              kan worden <b>identificeren</b> en <b>evalueren</b>, op een gestructureerde en wetenschappelijk correcte
              manier.
            </Typography>
            <Typography variant="body1" paragraph>
              De BNRA zal verlopen in verschillende stappen. De deelnemers krijgen telkens de nodige informatie en tools
              ter beschikking gesteld om deze stappen succesvol te doorlopen.
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
                  Begin oktober - eind november 2022
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 6 }}>
                  <Typography variant="subtitle2" paragraph sx={{ mt: "2px" }}>
                    Onboarding en introductie
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Je krijgt toegang tot het leerplatform van de BNRA 2023 - 2026. Hier vind je op een overzichtelijke
                    en makkelijk doorzoekbare manier alle informatie met betrekking tot de methodologie en gebruikte
                    tools van de BNRA.
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">Najaar 2022 - najaar 2023</TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 6 }}>
                  <Typography variant="subtitle2" paragraph sx={{ mt: "2px" }}>
                    Individuele risico-identificatie en analyse
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Op basis van jouw expertise vul jij de risico-identificatie & analyse in. Dit gebeurt{" "}
                    <b>individueel</b> via een <b>online tool</b>.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    De risico-identificatie en analyse bestaat uit 3 onderdelen:
                  </Typography>
                  <Typography variant="caption" paragraph>
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
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">Voorjaar 2023 - najaar 2023</TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 6 }}>
                  <Typography variant="subtitle2" paragraph sx={{ mt: "2px" }}>
                    Consensus en feedback
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Per risico organiseren we een consensusmeeting met <b>alle experts</b>. Zo krijg je inzicht in hoe
                    andere experten hetzelfde risico beoordeeld hebben en kan je met hen in overleg gaan. Op basis van
                    deze discussie komen we tot <b>één geconsolideerd resultaat</b>.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Tijdens deze meeting krijg je ook de kans om feedback te geven over het proces die wij kunnen
                    gebruiken om de volgende iteratie van de BNRA te verbeteren.
                  </Typography>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">2024</TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ pb: 6 }}>
                  <Typography variant="subtitle2" paragraph sx={{ mt: "2px" }}>
                    Resultaten en rapportage
                  </Typography>
                  <Typography variant="body1" paragraph>
                    We stellen de resultaten graag aan je voor.
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </Box>
          <Stack direction="column" sx={{ pb: 8, textAlign: "justify" }}>
            <Typography variant="body1" paragraph>
              Een diepgaande uitleg over de methodologie en tools die tijdens BNRA gehanteerde zullen worden, alsook
              praktijkvoorbeelden, zijn terug te vinden in het leerplatform.
            </Typography>
            <Button variant="contained" sx={{ alignSelf: "center", mt: 4 }} to="/learning" component={RouterLink}>
              Naar het leerplatform
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
            Aan de BNRA zullen experten uit overheidsorganisaties, kenniscentra en andere deelnemen. We mikken op
            minstens 360 experten, verdeeld over ongeveer 120 risico’s.
          </Typography>
          <Stack direction="row" spacing={8} sx={{ mt: 8 }}>
            <Stack direction="column">
              <Typography variant="h5" sx={{ mb: 4 }}>
                Wat wordt er verwacht van de deelnemers?
              </Typography>
              <Typography variant="body1" paragraph>
                Tijdens de analyse willen wij beroep doen op{" "}
                <b>jouw professionele kennis ter zake, ervaring, achtergrond, knowhow,...</b> Specifieke opzoekingen,
                teamoverleg of bijkomend statistisch materiaal is niet noodzakelijk. Jouw{" "}
                <b>persoonlijke inschatting is voldoende</b> en zal bovendien nooit rechtstreeks aan jou of jouw
                organisatie verbonden worden zonder expliciete toestemming.
              </Typography>
              <Typography variant="body1" paragraph>
                De totale werklast werd tijdens een interne testcase bestudeerd en wordt momenteel geschat op ongeveer{" "}
                <b>3 à 5 werkdagen per expert per risico</b>. Deze werklast is gespreid over de hierboven beschreven
                deelstappen <b>gedurende 6-9 maanden</b>.
              </Typography>
              <Typography variant="body1" paragraph>
                Als deelnemende expert houden we je op de hoogte van de resultaten van het onderzoek. Mits jouw
                toestemming, vermelden we jou of je dienst in het dankwoord of gelijkaardige secties van alle
                publicaties door het NCCN met betrekking tot de BNRA.
              </Typography>
              <Button
                variant="contained"
                sx={{ alignSelf: "center", mt: 4 }}
                href="https://crisiscentrum.be/nl/bnra/neem-deel"
                target="_blank"
              >
                Neem deel aan de BNRA 2023 - 2026
              </Button>
            </Stack>
            <Box>
              <img src="https://bnra.powerappsportals.com/time.png" style={{ width: 400 }}></img>
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
            Sinds 2018 coördineert het Nationaal Crisiscentrum (NCCN) deze risicobeoordeling. Dit is ook een
            verplichting in het kader van het EU-besluit van december 2013 (1313/2013/EU).
          </Typography>
          <Stack direction="row" spacing={8} sx={{ mt: 8 }}>
            <Box>
              <img
                src="https://crisiscentrum.be/sites/default/files/documents/images/Risicoanalyse.png"
                style={{ width: 400 }}
              ></img>
            </Box>
            <Box sx={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center" }}>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Wat zijn de doelstellingen?
              </Typography>
              <Typography variant="body1" paragraph>
                De BNRA vult de <b>eerste stap in van de risicocyclus</b>, met name de identificatie en evaluatie van
                risico’s. De resultaten van deze risicobeoordeling zijn een belangrijke bron van informatie om de
                volgende stappen van de risicocyclus invulling te geven, waaronder de noodplanning en het crisisbeheer.
              </Typography>
              <Typography variant="body1" paragraph>
                Het uiteindelijke doel van de BNRA is om op een gestructureerde en wetenschappelijke correcte manier{" "}
                <b>de impact, waarschijnlijkheid en cascade-effecten</b> in kaart te brengen voor de nationale risico’s.
                Deze risicobeoordeling vormt één van de elementen die kan bijdragen aan het nationale
                noodplanningsbeleid en crisisbeheer.
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Wat doet het Nationaal Crisiscentrum?
            </Typography>
            <Typography variant="body1" paragraph>
              Het Nationaal Crisiscentrum is verantwoordelijk voor de nationale noodplanning en het crisisbeheer tijdens
              federale fases in België. De directie CIPRA (Kritieke Infrastructuur en Risicoanalyse) binnen het NCCN
              houdt zich bezig met het eerste aspect van de risicocyclus, nl. risico-identificatie en -evaluatie. Lees
              hier meer.
            </Typography>
          </Box>
        </Container>
      </Box>
      <Stack direction="row" sx={{ justifyContent: "space-evenly", my: 4 }}>
        <img
          src="https://crisiscentrum.be/sites/default/files/2021-07/Logo_liggend_NL_kleur.svg"
          style={{ height: 50 }}
        />
        <img src="https://bnra.powerappsportals.com/logo_text.png" style={{ height: 50 }} />
      </Stack>
    </>
  );
}
