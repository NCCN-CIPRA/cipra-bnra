import {
  Box,
  Container,
  Button,
  Stack,
  Typography,
  Link,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Trans, useTranslation } from "react-i18next";
import usePageTitle from "../../hooks/usePageTitle";

import scalesImage from "../../assets/images/scales.png";
import cascadesImage from "../../assets/images/cascades.png";
import scenariosImage from "../../assets/images/scenarios.png";
import catalogueImage from "../../assets/images/catalogue.png";

// const getCleanLanguage = (language: string) => {
//   if (language.indexOf("en") >= 0) return "en";
//   if (language.indexOf("nl") >= 0) return "nl";
//   if (language.indexOf("fr") >= 0) return "fr";
//   if (language.indexOf("de") >= 0) return "de";
// };

// const onDownload = (filename: string) => {
//   const link = document.createElement("a");
//   link.download = filename;
//   link.href = `https://raw.githubusercontent.com/NCCN-CIPRA/cipra-bnra/refs/heads/main/src/assets/pdf/${filename}`;
//   link.click();
// };

export default function MethodologyPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  usePageTitle(
    t("methodology.framework.title", "National Risk Assessment Framework")
  );

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
          backgroundImage:
            "url('https://bnra.powerappsportals.com/banner.png')",
          backgroundSize: "auto 1000px",
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
          height: 200,
          backgroundColor: "transparent",
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            height: "100%",
            pb: 4,
          }}
        >
          <Stack direction="column">
            <img
              alt="text logo"
              src="https://bnra.powerappsportals.com/logo_text.png"
              style={{ width: 100, marginBottom: 20 }}
            />
            <Typography variant="h3" paragraph>
              <Trans i18nKey="methodology.framework.title">
                National Risk Assessment Framework
              </Trans>
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 4 }}>
        <Container>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            To support a more resilient and well-informed society, the National
            Crisis Centre (NCCN) has developed a novel{" "}
            <b>national risk assessment methodology</b> tailored specifically
            for the Belgian National Risk Assessment (BNRA). This methodology
            was designed to better capture the complex and entangled nature of
            risks facing the country, and to enable consistent, relevant, and
            evidence-based prevention and prepardness planning.
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            At the core of this approach are <b>four foundational elements</b>,
            each of which contributes to a comprehensive and structured risk
            analysis process. These pillars reflect{" "}
            <b>international best practices</b> and are intended to serve as a{" "}
            <b>
              framework for risk analyses across governmental and societal
              domains
            </b>
            .
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: 2 }}>
            Whether used by federal institutions, local authorities, or vital
            sector stakeholders, the information provided on these pages should
            offer a solid foundation and clear guidelines for describing,
            assessing and prioritizing risks in a consistent manner.
          </Typography>
        </Container>
      </Box>

      <Box>
        <Container>
          <Box sx={{ my: 8, position: "relative" }}>
            <Stack direction="row" gap={2}>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <CardMedia
                  sx={{ aspectRatio: 1.4 }}
                  image={scalesImage}
                  title="Standardized scales of probability and impact"
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ height: 50 }}
                  >
                    <Trans i18nKey="methodology.framework.scale.title">
                      Standardized scales of probability and impact
                    </Trans>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    Risks should be assessed using common scales for both
                    likelihood and impact, ensuring consistent evaluations
                    across different domains. This standardized approach allows
                    for meaningful comparison between diverse types of risks.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => navigate("/methodology/scales")}
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <CardMedia
                  sx={{ aspectRatio: 1.4 }}
                  image={scenariosImage}
                  title="Multi-scenario approach"
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ height: 50 }}
                  >
                    <Trans i18nKey="methodology.framework.scenarios.title">
                      Multi-scenario approach
                    </Trans>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Risks should be broken down into multiple, clearly defined
                    scenarios that span a range of magnitudes. These scenarios
                    should be described concretely using risk-specific
                    parameters.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <CardMedia
                  sx={{ aspectRatio: 1.4 }}
                  image={cascadesImage}
                  title="Causes and consequenses"
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ height: 50 }}
                  >
                    <Trans i18nKey="methodology.framework.cascades.title">
                      Investigating causes and consequences
                    </Trans>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Mapping out both the potential causes and consequences of
                    each risk leads to a deeper understanding. This holistic
                    view supports more relevant insights and informed
                    decision-making.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
              <Card sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <CardMedia
                  sx={{ aspectRatio: 1.4 }}
                  image={catalogueImage}
                  title="Standardized catalogue of risks"
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    sx={{ height: 50 }}
                  >
                    <Trans i18nKey="methodology.framework.catalogue.title">
                      Standardized catalogue of national risks
                    </Trans>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Assessments should be based on a validated and coherent
                    catalogue of national risks, which can be further elaborated
                    if necessary. This common reference point improves clarity,
                    fosters alignment and facilitates communication.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
        <Container>
          <Box sx={{ mt: 4, display: "flex", flexDirection: "column" }}></Box>
        </Container>
      </Box>

      <Box>
        <Container>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.7)",
              border: "1px solid #fff",
              mx: "auto",
              my: 8,
              width: 500,
              px: 10,
              py: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>
              <Trans i18nKey="landingpage.questions1">
                Questions, suggestions or other? Please don&#quot;t hesitate to
                contact us!
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>
              <Link href={`mailto:cipra.bnra@nccn.fgov.be`}>
                cipra.bnra@nccn.fgov.be
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* <Box sx={{ mt: 8, pb: 4 }}>
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
            <Button
                variant="contained"
                sx={{ alignSelf: "center", mt: 4 }}
                href="https://crisiscentrum.be/nl/bnra/neem-deel"
                target="_blank"
              >
                <Trans i18nKey="homepage.button.participate">Neem deel aan de BNRA 2023 - 2026</Trans>
              </Button>
            </Stack>
            <Box>
              <img alt="Time estimation" src="https://bnra.powerappsportals.com/time.png" style={{ width: 400 }}></img>
            </Box>
          </Stack>
        </Container>
      </Box> */}

      {/* <Box
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
      </Box> */}
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
        <img
          alt="BNRA"
          src="https://bnra.powerappsportals.com/logo_text.png"
          style={{ height: 40 }}
        />
      </Stack>
    </>
  );
}
