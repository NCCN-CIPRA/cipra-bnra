import {
  Box,
  Container,
  Button,
  Stack,
  Typography,
  Link,
  Unstable_TrapFocus as TrapFocus,
  Fade,
  Paper,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { Link as RouterLink, useNavigate, useOutletContext } from "react-router-dom";
import { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Trans, useTranslation } from "react-i18next";
import usePageTitle from "../../hooks/usePageTitle";
import { RISK_CATEGORY } from "../../types/dataverse/DVRiskFile";
import { CategoryIcon } from "../../functions/getCategoryColor";
import { useState } from "react";
import { BasePageContext } from "../BasePage";
import { getLanguage } from "../../functions/translations";

const getCleanLanguage = (language: string) => {
  if (language.indexOf("en") >= 0) return "en";
  if (language.indexOf("nl") >= 0) return "nl";
  if (language.indexOf("fr") >= 0) return "fr";
  if (language.indexOf("de") >= 0) return "de";
};

const onDownload = (filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = `https://raw.githubusercontent.com/NCCN-CIPRA/cipra-bnra/refs/heads/main/src/assets/pdf/${filename}`;
  link.click();
};

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [bannerOpen, setBannerOpen] = useState(true);
  const { user } = useOutletContext<BasePageContext>();

  usePageTitle(t("homepage.bnraLong", "Belgian National Risk Assessment"));

  useBreadcrumbs(null);

  const closeBanner = () => {
    setBannerOpen(false);
  };

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

      <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 4 }}>
        <Container>
          <Box sx={{ mt: 4, textAlign: "justify" }}>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="landingpage.introtext1">
                Avec la Belgian National Risk Assessment (BNRA), le Centre de crise National (NCCN), en collaboration
                avec plus de 160 experts, a identifié et évalué les risques pertinents auxquels la Belgique pourrait
                être exposée.
              </Trans>
            </Typography>
            <Stack direction="row" sx={{ mt: 4, alignItems: "center" }}>
              <Box sx={{ mr: 8 }}>
                <Box>
                  <img
                    alt="risicocyclus"
                    src={`https://bnra.powerappsportals.com/risicoCyclus${i18n.language.toUpperCase()}.png`}
                    style={{ width: 400, padding: 20 }}
                  ></img>
                </Box>
              </Box>
              <Box>
                <Typography variant="body1" paragraph>
                  <Trans i18nKey="landingpage.introtext2">
                    La BNRA est un élément important de la première étape du cycle du risque, à savoir l'identification
                    et l'évaluation des risques. Le but ultime de la BNRA est d'identifier la probabilité, l'impact et
                    les effets en cascade des risques nationaux d'une manière structurée et scientifiquement correcte.
                    Les résultats de cette évaluation des risques constituent une source d'information importante pour
                    façonner les étapes suivantes du cycle du risque, y compris la planification d'urgence et la gestion
                    de crise.
                  </Trans>
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Typography variant="body1" paragraph sx={{ mt: 4 }}>
            <Trans i18nKey="landingpage.introtext3">
              Vous voulez en savoir plus sur la BNRA, sa méthodologie et ses résultats ? Regardez la vidéo ci-dessous:
            </Trans>
          </Typography>
          <Box sx={{ my: 8, height: 0, pb: "56.25%", position: "relative" }}>
            {getLanguage(i18n.language) === "nl" && (
              <iframe
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                src="https://www.youtube.com/embed/3kk2eXEpwrI?si=qLuOkQ36GA5o6O0T"
                title="Video BNRA NL"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
            {(getLanguage(i18n.language) === "en" || getLanguage(i18n.language) === "de") && (
              <iframe
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                src="https://www.youtube.com/embed/mS86tmjG1zQ?si=_cVkQZpMtdHhMGXY"
                title="Video BNRA EN"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
            {getLanguage(i18n.language) === "fr" && (
              <iframe
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                src="https://www.youtube.com/embed/TNzBmCwdU44?si=ghm1HfwwZwbk9Wgc"
                title="Video BNRA FR"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
          </Box>
          {/* <Box sx={{ mt: 12, display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" paragraph sx={{ textAlign: "justify" }}>
              <Trans i18nKey="landingpage.categorytext1">Dans la BNRA, sept catégories de risques sont définies:</Trans>
            </Typography>
          </Box> */}
        </Container>
      </Box>

      <Box>
        <Container>
          <Box sx={{ my: 8, height: 0, pb: "40%", position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                left: "calc(20% - 80px)",
                top: "10%",
                p: 2,
                display: "inline",
                borderRadius: "50%",
                bgcolor: "white",
                border: "2px solid #ddd",
                cursor: "pointer",
                transition: "all .3s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                  opacity: 0.8,
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/risks")}
            >
              <CategoryIcon category={RISK_CATEGORY.MANMADE} size={80} tooltip={false} />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 120,
                  // whiteSpace: "nowrap",
                  left: "calc(50% - 80px)",
                  width: 160,
                  textAlign: "center",
                }}
              >
                {t(`landingpage.risks.${RISK_CATEGORY.MANMADE}`, `23 Risques Man-made`)}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                left: "calc(40% - 80px)",
                top: "10%",
                p: 2,
                display: "inline",
                borderRadius: "50%",
                bgcolor: "white",
                border: "2px solid #ddd",
                cursor: "pointer",
                transition: "all .3s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                  opacity: 0.8,
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/risks")}
            >
              <CategoryIcon category={RISK_CATEGORY.TRANSVERSAL} size={80} tooltip={false} />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 120,
                  // whiteSpace: "nowrap",
                  left: "calc(50% - 80px)",
                  width: 160,
                  textAlign: "center",
                }}
              >
                {t(`landingpage.risks.${RISK_CATEGORY.TRANSVERSAL}`, `22 Risques Sociétaux`)}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                left: "calc(60% - 80px)",
                top: "10%",
                p: 2,
                display: "inline",
                borderRadius: "50%",
                bgcolor: "white",
                border: "2px solid #ddd",
                cursor: "pointer",
                transition: "all .3s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                  opacity: 0.8,
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/risks")}
            >
              <CategoryIcon category={RISK_CATEGORY.ECOTECH} size={80} tooltip={false} />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 120,
                  // whiteSpace: "nowrap",
                  left: "calc(50% - 85px)",
                  width: 170,
                  textAlign: "center",
                }}
              >
                {t(`landingpage.risks.${RISK_CATEGORY.ECOTECH}`, `23 Risques Économiques et Technologiques`)}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                left: "calc(80% - 80px)",
                top: "10%",
                p: 2,
                display: "inline",
                borderRadius: "50%",
                bgcolor: "white",
                border: "2px solid #ddd",
                cursor: "pointer",
                transition: "all .3s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                  opacity: 0.8,
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/risks")}
            >
              <CategoryIcon category={RISK_CATEGORY.CYBER} size={80} tooltip={false} />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 120,
                  // whiteSpace: "nowrap",
                  left: "calc(50% - 80px)",
                  width: 160,
                  textAlign: "center",
                }}
              >
                {t(`landingpage.risks.${RISK_CATEGORY.CYBER}`, `5 Risques Cyber`)}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                left: "calc(25% - 80px)",
                bottom: "10%",
                p: 2,
                display: "inline",
                borderRadius: "50%",
                bgcolor: "white",
                border: "2px solid #ddd",
                cursor: "pointer",
                transition: "all .3s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                  opacity: 0.8,
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/risks")}
            >
              <CategoryIcon category={RISK_CATEGORY.HEALTH} size={80} tooltip={false} />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 120,
                  // whiteSpace: "nowrap",
                  left: "calc(50% - 80px)",
                  width: 160,
                  textAlign: "center",
                }}
              >
                {t(`landingpage.risks.${RISK_CATEGORY.HEALTH}`, `10 Risques liés à la Santé`)}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                left: "calc(50% - 80px)",
                bottom: "10%",
                p: 2,
                display: "inline",
                borderRadius: "50%",
                bgcolor: "white",
                border: "2px solid #ddd",
                cursor: "pointer",
                transition: "all .3s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                  opacity: 0.8,
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/risks")}
            >
              <CategoryIcon category={RISK_CATEGORY.NATURE} size={80} tooltip={false} />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 120,
                  // whiteSpace: "nowrap",
                  left: "calc(50% - 80px)",
                  width: 170,
                  textAlign: "center",
                }}
              >
                {t(`landingpage.risks.${RISK_CATEGORY.NATURE}`, `23 Risques Naturels`)}
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                left: "calc(75% - 80px)",
                bottom: "10%",
                p: 2,
                display: "inline",
                borderRadius: "50%",
                bgcolor: "white",
                border: "2px solid #ddd",
                cursor: "pointer",
                transition: "all .3s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                  opacity: 0.8,
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/risks")}
            >
              <CategoryIcon category={RISK_CATEGORY.EMERGING} size={80} tooltip={false} />
              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 120,
                  // whiteSpace: "nowrap",
                  left: "calc(50% - 80px)",
                  width: 160,
                  textAlign: "center",
                }}
              >
                {t(`landingpage.risks.${RISK_CATEGORY.EMERGING}`, `12 Risques Émergents`)}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
        <Container>
          <Box sx={{ mt: 4, display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" paragraph sx={{ textAlign: "justify" }}>
              <Trans i18nKey="landingpage.infotext1">
                Vous trouverez ci-dessous le Guide des Risques et le Fact Sheet. Ce Guide reprend les principaux risques
                par catégorie (valeurs de probabilité et/ou d'impact élevées), complétés par certains risques qui ont
                été récemment portés à l'attention du public.
              </Trans>
            </Typography>
            <Typography variant="body1" color="error" paragraph sx={{ textAlign: "justify" }}>
              <Trans i18nKey="landingpage.restricted">
                Please consider the reports below as "Limited Distribution" until 25/10/2024.
              </Trans>
            </Typography>

            <Stack direction="row" justifyContent="center" gap={10} sx={{ my: 6 }}>
              <Button
                variant="contained"
                sx={{ mt: 4 }}
                onClick={() => onDownload(`BNRA-risk-guide-${getCleanLanguage(i18n.language)}.pdf`)}
              >
                <Trans i18nKey="landingpage.button.riskguide">Télécharge le Guide des Risques</Trans>
              </Button>

              {/* <Button
                variant="contained"
                sx={{ mt: 4 }}
                onClick={() => onDownload(`BNRA-fact-sheet-${i18n.language}.pdf`)}
              >
                <Trans i18nKey="landingpage.button.factsheet">Télécharge le Fact Sheet</Trans>
              </Button> */}
            </Stack>
          </Box>
          <Box sx={{ mt: 12, display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" paragraph sx={{ textAlign: "justify" }}>
              <Trans i18nKey="landingpage.infotext2">Des informations sur les 118 risques sont disponibles sur </Trans>
              <Link href={`https://crisiscenter.be/${getCleanLanguage(i18n.language)}/risks-belgium`} target="_blank">
                <Trans i18nKey="landingpage.infotext3">le site web du NCCN</Trans>
              </Link>
            </Typography>
          </Box>
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
                Questions, suggestions or other? Please don't hesitate to contact us!
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph sx={{ textAlign: "center" }}>
              <Link href={`mailto:dist.nccn.cipra@nccn.fgov.be`}>dist.nccn.cipra@nccn.fgov.be</Link>
            </Typography>
          </Box>
        </Container>
      </Box>

      {user && user.roles.verified && (
        <TrapFocus open disableAutoFocus disableEnforceFocus>
          <Fade appear={false} in={bannerOpen}>
            <Paper
              role="dialog"
              aria-modal="false"
              aria-label="Cookie banner"
              square
              variant="outlined"
              tabIndex={-1}
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                m: 0,
                p: 2,
                borderWidth: 0,
                borderTopWidth: 1,
              }}
            >
              <Stack direction={{ xs: "column", sm: "column" }} sx={{ justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ flexShrink: 1, alignSelf: { xs: "flex-start", sm: "center" } }}>
                  <Typography variant="h6" paragraph>
                    <Trans i18nKey="disclaimer.title">Disclaimer</Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="disclaimer.1">
                      De methodologie en resultaten van de BNRA zijn het intellectuele eigendom van het NCCN. De BNRA
                      als geheel wordt ondersteund door de geïnformeerde input van de experten die voor elk van de
                      risico’s werden ingeschakeld. Noch CIPRA, noch het NCCN kan bijgevolg rechtstreeks
                      verantwoordelijk gehouden voor de eindresultaten.
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="disclaimer.2">
                      Gebruikers van BNRA-gegevens moeten zich ervan bewust zijn dat de resultaten in principe slechts 3
                      jaar geldig zijn, in overeenstemming met de regelgeving van de Europese Commissie. Bovendien
                      moeten alle risico’s en resultaten in hun volledige context en met voldoende nuance
                      geïnterpreteerd en gebruikt worden.
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="disclaimer.3">
                      Tot slot is het essentieel om erop te wijzen wat de BNRA niet doet:
                    </Trans>
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="body1">
                        <Trans i18nKey="disclaimer.4">
                          Er wordt niet getracht toekomstige gebeurtenissen of zogenaamde <i>Black Swan Events</i> te
                          voorspellen
                        </Trans>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1">
                        <Trans i18nKey="disclaimer.5">
                          Er wordt geen absolute ranking gemaakt van risico’s (de cijfers moeten als grootteordes
                          geïnterpreteerd worden en niet als exact vergelijkbaar)
                        </Trans>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1">
                        <Trans i18nKey="disclaimer.6">
                          Er wordt volledige abstractie gemaakt van alle geospatiale element van risico’s (bv. we kijken
                          niet specifiek naar de kernreactoren van Doel, maar naar een abstracte gemiddelde kernreactor
                          in België)
                        </Trans>
                      </Typography>
                    </li>
                  </ul>
                  <Typography variant="body1" paragraph color="error">
                    <Trans i18nKey="disclaimer.7">
                      Indien u een deel van de BNRA wilt delen met externe partners, wordt het ten zeerste op prijs
                      gesteld indien CIPRA hiervan op de hoogte wordt gebracht en de BNRA als bron vermeld wordt.
                    </Trans>
                  </Typography>
                </Box>
                <Stack
                  direction={{
                    xs: "row-reverse",
                    sm: "row",
                  }}
                  sx={{
                    gap: 2,
                    flexShrink: 0,
                    alignSelf: "flex-end",
                  }}
                >
                  <Button size="small" onClick={closeBanner} variant="contained">
                    OK
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Fade>
        </TrapFocus>
      )}

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
        <img alt="BNRA" src="https://bnra.powerappsportals.com/logo_text.png" style={{ height: 40 }} />
      </Stack>
    </>
  );
}
