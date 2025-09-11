import {
  Box,
  Container,
  Button,
  Stack,
  Typography,
  Link,
  Paper,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  styled,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Trans, useTranslation } from "react-i18next";
import usePageTitle from "../../hooks/usePageTitle";
import { ReactElement, useState } from "react";

import probabilitySVG from "../../assets/icons/impact/probability.svg";
import humanImpactSVG from "../../assets/icons/impact/human.svg";
import societalImpactSVG from "../../assets/icons/impact/societal.svg";
import environmentalImpactSVG from "../../assets/icons/impact/environmental.svg";
import financialImpactSVG from "../../assets/icons/impact/financial.svg";
import SideBar, { sections } from "./SideBar";
import { PTable } from "../../components/indicators/P";
import { HaTable } from "../../components/indicators/Ha";
import { HbTable } from "../../components/indicators/Hb";
import { HcTable } from "../../components/indicators/Hc";
import TTypography from "../../components/TransEdit";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const drawerWidth = 320;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: `calc(${theme.spacing(7)} + 1px)`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: `${drawerWidth}px`,
  }),
}));

const ImpactTitleSection = ({
  anchor,
  children,
}: {
  anchor?: string;
  children: ReactElement | ReactElement[];
}) => {
  return (
    <Box
      sx={{
        py: 4,
        width: "100%",
        backgroundColor: "transparent",
      }}
    >
      <a id={anchor}>
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <Stack direction="column" rowGap={2}>
            {children}
          </Stack>
        </Container>
      </a>
    </Box>
  );
};

const IndicatorSection = ({
  anchor,
  children,
}: {
  anchor: string;
  children: ReactElement | ReactElement[];
}) => {
  return (
    <Box sx={{ bgcolor: "#fafafa", width: "100%", pt: 2, pb: 4 }}>
      <a id={anchor}>
        <Container>
          <Stack direction="column" rowGap={1}>
            {children}
          </Stack>
        </Container>
      </a>
    </Box>
  );
};

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

export default function MethodologyScalesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { activeSection } = useIntersectionObserver(Object.values(sections));

  usePageTitle(
    t("methodology.framework.title", "National Risk Assessment Framework")
  );
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    {
      name: t("sideDrawer.methodology", "Methodology"),
      url: "/methodology",
    },
    {
      name: t("methodology.framework.scales.breadcrumb", "Standard Scales"),
      url: "/methodology/scales",
    },
  ]);

  return (
    <>
      <SideBar
        open={open}
        width={320}
        pageName="quantitative-categories"
        activeSection={activeSection}
        handleDrawerToggle={() => setOpen(!open)}
      />
      <Main open={open}>
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
              <TTypography
                i18nKey="methodology.framework.title"
                variant="h3"
              ></TTypography>
              <TTypography
                i18nKey="methodology.framework.scales.subtitle"
                variant="subtitle1"
              ></TTypography>
            </Stack>
          </Container>
        </Box>

        <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 4 }}>
          <Container>
            <Box>
              <TTypography
                i18nKey="methodology.scales.introduction.1"
                variant="body1"
              >
                Tijdens de BNRA 2023 - 2026 geven experten enerzijds{" "}
                <i>kwalitatieve</i> beschrijvingen van de waarschijnlijkheid en
                impact van de verschillende risicoscenario&s. Anderzijds wordt
                gevraagd een
                <i>kwantitatieve</i> inschatting te geven die het mogelijk zal
                maken de verschillende risico&#39;s aan het einde van de
                beoordeling onderling te vergelijken.
              </TTypography>
            </Box>
          </Container>
        </Box>

        <Box>
          <Container>
            <Box sx={{ my: 8, position: "relative" }}>
              <Stack direction="row" gap={2}>
                <Card
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <CardMedia
                    component="img"
                    sx={{ aspectRatio: 1.2, objectFit: "contain", p: 3 }}
                    image={probabilitySVG}
                    title="Probability Scales"
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <TTypography
                      i18nKey="methodology.scales.probability.title"
                      gutterBottom
                      variant="subtitle2"
                      component="div"
                      sx={{ height: 30 }}
                    >
                      Probability
                    </TTypography>
                    <TTypography
                      i18nKey="methodology.scales.probability.description.1"
                      variant="body2"
                      sx={{ color: "text.secondary", mb: 1 }}
                    >
                      The probability scales determine the likelihood that an
                      event comparable to a given risk scenario will take place.
                    </TTypography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate("/methodology/scales")}
                    >
                      <Trans i18nKey="methodology.learnMore">Learn More</Trans>
                    </Button>
                  </CardActions>
                </Card>
                <Card
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <CardMedia
                    component="img"
                    sx={{ aspectRatio: 1.2, objectFit: "contain", p: 3 }}
                    image={humanImpactSVG}
                    title="Human Impact Scales"
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <TTypography
                      i18nKey="methodology.scales.impact.human.title"
                      gutterBottom
                      variant="subtitle2"
                      component="div"
                      sx={{ height: 30 }}
                    >
                      Human Impact
                    </TTypography>
                    <TTypography
                      i18nKey="methodology.scales.impact.human.introduction"
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      The indicators for the human impact scale determine the
                      loss of human lives (Ha), physical integrity and mental
                      health effects (Hb) and the amount of individuals
                      requiring assistance (Hc) as a result of the event.
                    </TTypography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate("/methodology/scales")}
                    >
                      <Trans i18nKey="methodology.learnMore">Learn More</Trans>
                    </Button>
                  </CardActions>
                </Card>
                <Card
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <CardMedia
                    component="img"
                    sx={{ aspectRatio: 1.2, objectFit: "contain", p: 3 }}
                    image={societalImpactSVG}
                    title="Societal Impact Scales"
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <TTypography
                      i18nKey="methodology.scales.impact.societal.title"
                      gutterBottom
                      variant="subtitle2"
                      component="div"
                      sx={{ height: 30 }}
                    >
                      Societal Impact
                    </TTypography>
                    <TTypography
                      i18nKey="methodology.scales.impact.societal.introduction"
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      The indicators for the societal impact determine the the
                      magnitude of supply shortfalls and unmet human needs (Sa),
                      diminished public order and domestic security (Sb), damage
                      to the reputation of Belgium abroad (Sc) and a loss of
                      confidence in or functioning of the state and/or its
                      values (Sd) as a result of the event.
                    </TTypography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate("/methodology/scales")}
                    >
                      <Trans i18nKey="methodology.learnMore">Learn More</Trans>
                    </Button>
                  </CardActions>
                </Card>
                <Card
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <CardMedia
                    component="img"
                    sx={{ aspectRatio: 1.2, objectFit: "contain", p: 3 }}
                    image={environmentalImpactSVG}
                    title="Environmental Impact Scales"
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <TTypography
                      i18nKey="methodology.scales.impact.environmental.title"
                      gutterBottom
                      variant="subtitle2"
                      component="div"
                      sx={{ height: 30 }}
                    >
                      Environmental
                    </TTypography>
                    <TTypography
                      i18nKey="methodology.scales.impact.environmental.introduction"
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      The indicators for the environmental impact determine the
                      damage to ecosystems (Ea).
                    </TTypography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate("/methodology/scales")}
                    >
                      <Trans i18nKey="methodology.learnMore">Learn More</Trans>
                    </Button>
                  </CardActions>
                </Card>
                <Card
                  sx={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                  <CardMedia
                    component="img"
                    sx={{ aspectRatio: 1.2, objectFit: "contain", p: 0 }}
                    image={financialImpactSVG}
                    title="Financial Impact Scales"
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <TTypography
                      i18nKey="methodology.scales.impact.financial.title"
                      gutterBottom
                      variant="subtitle2"
                      component="div"
                      sx={{ height: 30 }}
                    >
                      Financial Impact
                    </TTypography>
                    <TTypography
                      i18nKey="methodology.scales.impact.financial.introduction"
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      The indicators for the financial impact determine
                      financial asset damages (Fa), and the reduction of
                      economic performance (Fb).
                    </TTypography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => navigate("/methodology/scales")}
                    >
                      <Trans i18nKey="methodology.learnMore">Learn More</Trans>
                    </Button>
                  </CardActions>
                </Card>
              </Stack>
            </Box>
          </Container>
        </Box>

        <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
          <Container>
            <Box sx={{ mt: 4, display: "flex", flexDirection: "column" }}>
              <TTypography
                i18nKey="methodology.scales.probability.title"
                variant="h4"
              >
                Probability
              </TTypography>
              <Box sx={{ mt: 2, mb: 4 }}>
                <PTable />
              </Box>
            </Box>
          </Container>
        </Box>

        <ImpactTitleSection anchor={sections.human}>
          <TTypography
            i18nKey="learning.impact.h.title"
            variant="h4"
            id="impact-human"
          >
            Human Impact
          </TTypography>
          <TTypography
            i18nKey="methodology.scales.impact.human.introduction"
            variant="subtitle1"
          >
            The indicators for the human impact scale determine the loss of
            human lives (Ha), physical integrity and mental health effects (Hb)
            and the amount of individuals requiring assistance (Hc) as a result
            of the event.
          </TTypography>
        </ImpactTitleSection>

        <IndicatorSection anchor={sections.ha}>
          <TTypography i18nKey="learning.impact.ha.title" variant="h6">
            Ha - Fatalities
          </TTypography>
          <HaTable />
        </IndicatorSection>

        <IndicatorSection anchor={sections.hb}>
          <TTypography i18nKey="learning.impact.hb.title" variant="h6">
            Hb - Injured / sick people
          </TTypography>
          <HbTable />
        </IndicatorSection>

        <IndicatorSection anchor={sections.hc}>
          <TTypography i18nKey="learning.impact.hc.title" variant="h6">
            Hc - People in need of assistance
          </TTypography>
          <HcTable />
        </IndicatorSection>

        <ImpactTitleSection anchor={sections.human}>
          <TTypography i18nKey="learning.impact.s.title" variant="h4">
            Societal Impact
          </TTypography>
          <TTypography i18nKey="learning.impact.s.introduction" variant="body1">
            The damage area relating to society measures significant disruptions
            caused by the hazard under investigation. On the one hand, these may
            include the effects on the Belgian population, e.g. through supply
            shortfalls and disruptions (Sa) or diminished public order and
            domestic security (Sb). On the other hand, it captures the effects
            on the state: damage to the reputation of Belgium abroad (Sc) and a
            loss of confidence in or functioning of the state and/or its values
            (Sd).
          </TTypography>
        </ImpactTitleSection>

        <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
          <Container>
            <Box
              sx={{ mt: 4, mb: 1, display: "flex", flexDirection: "column" }}
            >
              <TTypography i18nKey="learning.impact.sa.title" variant="h6">
                Sa - Supply shortfalls and unmet human needs
              </TTypography>
            </Box>
            <Box sx={{ mb: 8, ml: 0 }}>
              <TTypography
                i18nKey="learning.impact.sa.introduction.1"
                variant="body1"
                paragraph
              >
                This indicator measures breakdowns or severe disruptions to the
                supply of critical goods and services to the entire population
                or parts of it. They are grouped into three sets according to
                their importance.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.sa.introduction.2"
                variant="body1"
                paragraph
              >
                Supply shortfalls are calculated by multiplying the number of
                persons affected with the duration (in days) for which their
                needs are not met. The effective duration of the disruption for
                those affected is added together. Additionally, a distinction
                should be made between needs of varying importance. The human
                need for water and food is obviously more immediately important
                than the need for postal and courier services. Physical needs
                are to be fulfilled if the individual is to survive, whereas the
                next categories rather ensure the security and comfort needs. To
                model this fact, a weighting factor is given to each need which
                should be applied in the final calculations. Notice that there
                may exist some cascading effects between unmet needs, i.e. if
                the need for electricity is not met, usually the need for
                telecommunication will also not be met. This effect is not taken
                into account in the weighting factor and should thus be
                separately included in the final calculations . The weighting
                factors are loosely based on Maslow’s hierarchy of needs and
                similar theories.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.sa.introduction.3"
                variant="body1"
                paragraph
              >
                Economic consequences are covered by the indicators Fa – Asset
                losses and cost of coping and Fb – Reduction of economic
                performance.
              </TTypography>

              <TableContainer component={Paper} sx={{ mb: 6 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "16.6%" }}>Sa0</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sa1</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sa2</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sa3</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sa4</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sa5</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {t("learning.impact.sa.0", "No impact")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.sa.1", "< 10 000")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.sa.2", "10 001 – 100 000")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.sa.3", "100 001 – 1 000 000")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.sa.4", "1 000 001 – 10 000 000")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.sa.5", "> 10 000 000")}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Trans i18nKey="learning.impact.sa.footer">
                          Unit: person days (number of people multiplied by days
                          of unmet needs)
                        </Trans>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>

              <TableContainer component={Paper} sx={{ mb: 6 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.importance">
                          Importance
                        </Trans>
                      </TableCell>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.needs">Needs</Trans>
                      </TableCell>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.factor">
                          Weighting factor
                        </Trans>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.importance.1">
                          Physical needs
                        </Trans>
                      </TableCell>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.needs.1">
                          Potable water, basic foodstuffs, medicine, medical
                          emergency services, first responders communication
                        </Trans>
                      </TableCell>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.factor.1">1</Trans>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.importance.2">
                          Security needs
                        </Trans>
                      </TableCell>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.needs.2">
                          Electricity, heating, non-emergency medical care,
                          telecommunications, transport, financial services
                        </Trans>
                      </TableCell>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.factor.2">0.5</Trans>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.importance.3">
                          Comfort needs
                        </Trans>
                      </TableCell>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.needs.3">
                          Fuel, media, waste management, government, postal and
                          courier services
                        </Trans>
                      </TableCell>
                      <TableCell sx={{ width: "16.6%" }}>
                        <Trans i18nKey="learning.impact.sa.factor.3">0.1</Trans>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Trans i18nKey="learning.impact.sa.importance.footer">
                          Needs weighted by degree of importance for a sustained
                          and comfortable human life
                        </Trans>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </Box>

        <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
          <Container>
            <Box
              sx={{ mt: 4, mb: 1, display: "flex", flexDirection: "column" }}
            >
              <TTypography i18nKey="learning.impact.sb.title" variant="h6">
                Sb - Diminished public order and domestic security
              </TTypography>
            </Box>
            <Box sx={{ mb: 8, ml: 0 }}>
              <TTypography
                i18nKey="learning.impact.sb.introduction.1"
                variant="body1"
                paragraph
              >
                This indicator measures how many people living in Belgium have
                experienced diminished public order and domestic security, and
                for how long. This refers to adverse effects from domestic
                disturbances, such as unrest, impinging upon or unduly
                restricting the daily life of the general public. Such adverse
                effects are measured in person days. The minimum duration per
                person is one day.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.sb.introduction.2"
                variant="body1"
                paragraph
              >
                Thus when a large demonstration with riots happen, the
                calculations should not include the amount of people present at
                the demonstration or riots (the underlying reasons for the
                demonstrations are captured by indicator Sd – Loss of confidence
                in or functioning of the state and/or its values) but the amount
                of people that are afraid to go outside. Similarly in the
                aftermath of a terrorist attack on a soft target it would
                capture the amount of people with some form of PTSD
                (post-traumatic stress disorder) who are afraid of venturing
                into open public spaces.
              </TTypography>

              <TableContainer component={Paper} sx={{ mb: 6 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "16.6%" }}>Sb0</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sb1</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sb2</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sb3</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sb4</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sb5</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {t("learning.impact.sb.0", "No impact")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.sb.1", "< 100 000")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.sb.2", "100 001 – 1 000 000")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.sb.3", "1 000 001 – 1 000 000")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.sb.4", "10 000 001 – 100 000 000")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.sb.5", "> 100 000 000")}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Trans i18nKey="learning.impact.sb.footer">
                          Unit: person days (number of people multiplied by days
                          of impact)
                        </Trans>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </Box>

        <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
          <Container>
            <Box
              sx={{ mt: 4, mb: 1, display: "flex", flexDirection: "column" }}
            >
              <TTypography i18nKey="learning.impact.sc.title" variant="h6">
                Sc - Damage to the reputation of Belgium
              </TTypography>
            </Box>
            <Box sx={{ mb: 8, ml: 0 }}>
              <TTypography
                i18nKey="learning.impact.sc.introduction.1"
                variant="body1"
                paragraph
              >
                This indicator comprises the significance and duration of a
                reputational loss for Belgium abroad. Damage to Belgium’s
                reputation could, for example, lead to a situation where other
                countries refuse to enter into bilateral, multilateral and
                international agreements with it, or where its status as a
                business/tourism destination is severely compromised.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.sc.introduction.2"
                variant="body1"
                paragraph
              >
                This indicator qualitatively takes into account the significance
                of the reputational loss and its duration.
              </TTypography>

              <TableContainer component={Paper} sx={{ mb: 6 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "16.6%" }}>Sc0</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sc1</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sc2</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sc3</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sc4</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sc5</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {t("learning.impact.sc.0", "No impact")}
                      </TableCell>
                      <TableCell>
                        {t(
                          "learning.impact.sc.1",
                          "Damage to reputation lasting only a few days and related to issues of medium importance (e.g. negative coverage in foreign media)"
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "learning.impact.sc.2",
                          "Damage to reputation lasting from one up to a few weeks and related to important issues (e.g. negative coverage in foreign media)"
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "learning.impact.sc.3",
                          "Damage to reputation lasting several weeks and related to important issues, but with minor impact on Belgium’s standing and international cooperation"
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "learning.impact.sc.4",
                          "Considerable damage to reputation lasting several weeks, with impact on Belgium’s standing and international cooperation (e.g. termination of significant agreements with Belgium, expulsion of Belgian ambassador)"
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "learning.impact.sc.5",
                          "Lasting, severe and even irreversible loss of reputation with far reaching impact on Belgium’s standing and international cooperation (e.g. political isolation, boycotts)"
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Trans i18nKey="learning.impact.sc.footer">
                          Unit: qualitative according to significance and
                          duration
                        </Trans>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>

              <TTypography
                i18nKey="learning.impact.sd.introduction.3"
                variant="body1"
                paragraph
              >
                The descriptions and timeframes represented in the qualitative
                descriptions of indicator Sc and Sd should not be interpreted as
                strong limits, but rather as peak values of a distribution in
                time. E.g. for damage class Sd2 it may be possible that some
                critical media coverage still occurs months later, but the
                extent and frequency should be much lower than during the first
                few weeks. This is illustrated in Figure 1.
              </TTypography>

              <Box sx={{ textAlign: "center", sb: 2 }}>
                <img
                  alt="Societal impact"
                  src="https://bnra.powerappsportals.com/sd.png"
                  style={{ width: 600 }}
                />

                <TTypography
                  i18nKey="learning.impact.sd.image"
                  variant="caption"
                  sx={{ textDecoration: "italic" }}
                >
                  Graphs showing the distribution in time of the different
                  damages classes of indicator Sd
                </TTypography>
              </Box>
            </Box>
          </Container>
        </Box>

        <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
          <Container>
            <Box
              sx={{ mt: 4, mb: 1, display: "flex", flexDirection: "column" }}
            >
              <TTypography i18nKey="learning.impact.sd.title" variant="h6">
                Sd - Loss of confidence in or functioning of the state and/or
                its values
              </TTypography>
            </Box>
            <Box sx={{ mb: 8, ml: 0 }}>
              <TTypography
                i18nKey="learning.impact.sd.introduction.1"
                variant="body1"
                paragraph
              >
                Indicator Sd measures the significance of a loss of confidence
                in the state in general and its institutions and the share of
                the population that is losing confidence, as well as a loss of
                functioning of the state. Such institutions may include the
                executive, legislative, or legal branches of government as well
                as state and regional organisations such as public
                administrations, the armed forces, the police as well as state
                and semi-state bodies.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.sd.introduction.2"
                variant="body1"
                paragraph
              >
                The significance of a loss of confidence is described
                qualitatively and includes, for instance, the question of
                whether the loss of confidence extends to individual regional
                administrative units or to the federal administration in
                general. It is assumed that a loss of confidence is measurable
                by the amount of public backlash.
              </TTypography>

              <TableContainer component={Paper} sx={{ mb: 6 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "16.6%" }}>Sd0</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sd1</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sd2</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sd3</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sd4</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Sd5</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {t("learning.impact.sd.0", "No impact")}
                      </TableCell>
                      <TableCell>
                        {t(
                          "learning.impact.sd.1",
                          "Impairment of confidence related to issues of medium significance (e.g. very critical coverage in Belgian media), possible threat of impairment of a state function lasting only a few days."
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "learning.impact.sd.2",
                          "Damage to confidence related to significant issues (e.g. extremely critical coverage in Belgian media; occasional demonstrations), partial impairment of a state function or marginal infringement of citizens' freedoms and rights  lasting for one up to a few weeks."
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "learning.impact.sd.3",
                          "Damage to confidence related to significant issues (e.g. strikes, larger demonstrations), impairment of a state function or infringements of some citizens' freedoms and rights lasting for several weeks up to a few months."
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "learning.impact.sd.4",
                          "Considerable damage to general confidence (e.g. extended strikes in many areas, mass demonstrations across Belgium), impairment of some state functions or partial infringements of citizens' freedoms and rights lasting several months up to a year."
                        )}
                      </TableCell>
                      <TableCell>
                        {t(
                          "learning.impact.sd.5",
                          "Lasting, severe or even irreversible loss of general confidence (formation of local or regional groups for self-organisation of public life, up to the point of vigilante group formation), total impairment of state functions or massive and widespread infringement of citizens' freedoms and rights."
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Trans i18nKey="learning.impact.sd.footer">
                          Unit: qualitative according to significance and
                          duration
                        </Trans>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>

              <TTypography
                i18nKey="learning.impact.sd.introduction.3"
                variant="body1"
                paragraph
              >
                The descriptions and timeframes represented in the qualitative
                descriptions of indicator Sc and Sd should not be interpreted as
                strong limits, but rather as peak values of a distribution in
                time. E.g. for damage class Sd2 it may be possible that some
                critical media coverage still occurs months later, but the
                extent and frequency should be much lower than during the first
                few weeks. This is illustrated in Figure 1.
              </TTypography>

              <Box sx={{ textAlign: "center", sb: 2 }}>
                <img
                  alt="Societal impact"
                  src="https://bnra.powerappsportals.com/sd.png"
                  style={{ width: 600 }}
                />

                <TTypography
                  i18nKey="learning.impact.sd.image"
                  variant="caption"
                >
                  Graphs showing the distribution in time of the different
                  damages classes of indicator Sd
                </TTypography>
              </Box>
            </Box>
          </Container>
        </Box>

        <ImpactTitleSection>
          <TTypography i18nKey="learning.impact.e.title" variant="h4">
            Environmental Impact
          </TTypography>
          <TTypography i18nKey="learning.impact.e.introduction" variant="body1">
            The indicator for the damage area ‘environment’ express the effects
            of a hazard on the environment. The main effects include water
            pollution, ground pollution, and changes to the genetic material of
            organisms or biological diversity.
          </TTypography>
        </ImpactTitleSection>

        <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
          <Container>
            <Box
              sx={{ mt: 4, mb: 1, display: "flex", flexDirection: "column" }}
            >
              <TTypography i18nKey="learning.impact.ea.title" variant="h6">
                Ea - Damaged ecosystems
              </TTypography>
            </Box>
            <Box sx={{ mb: 8, ml: 0 }}>
              <TTypography
                i18nKey="learning.impact.ea.introduction.1"
                variant="body1"
                paragraph
              >
                Indicator Ea measures the size and the duration of an adverse
                event on ecosystems (woodlands, agro ecosystems, watercourses,
                lakes, wetlands etc.), which are seriously damaged as a result
                and which will recover very slowly, if ever. Effects may be
                caused, for instance, through chemical or radiological
                pollution, through biological or non-biological contamination,
                e.g. due to alien invasive species, or through physical damage,
                such as erosion.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.ea.introduction.2"
                variant="body1"
                paragraph
              >
                Impacts are understood as damage to ecosystems and/or adverse
                effects on ecosystem services.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.ea.introduction.3"
                variant="body1"
                paragraph
              >
                An ecosystem is damaged if, for example, the natural balance is
                upset considerably or the soil fertility is significantly
                compromised. For example, heavy chemical pollution of surface
                waters is measured with the indicator Ea. If the water level of
                a lake significantly drops as a result of drought, but without
                damaging the flora and the fauna in the medium to long term,
                this is not considered as an adverse impact on the ecosystem.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.ea.introduction.4"
                variant="body1"
                paragraph
              >
                The impairment of ecosystem services should be only considered
                if the restriction is not covered by other indicators (e.g.
                their use for leisure and recreation). If drought leads to
                restrictions on the supply of drinking water from surface water
                among sections of the population, this is recorded by the
                indicator Sa – Supply shortfalls and disruptions. The economic
                impact of ecosystem damage is not covered by the indicator Ea
                but by the economic indicators Fa (Financial assest damages) and
                Fb (Reduction of economic performance).
              </TTypography>
              <TTypography
                i18nKey="learning.impact.ea.introduction.5"
                variant="body1"
                paragraph
              >
                The unit for measuring adverse effects is the area x year (km2 x
                year). It is calculated by multiplying the affected area with
                the number of years that the adverse effect lasts. If an area is
                under the influence of multiple effects, it is only counted
                once.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.ea.introduction.6"
                variant="body1"
                paragraph
              >
                The duration of the impairment is the length of time during
                which the ecosystem persists or the restrictions on its use
                (e.g. restrictions of cultivation on agricultural land) remain
                in place. The cycle of different stages of an ecosystem, e.g.
                succession stages in managed forests, should be taken into
                account. An ecosystem is regarded as damaged until its condition
                returns to ‘normal’. For instance, in the case of a forest
                damaged by an extensive fire, the duration is the time until the
                re-establishment of the early succession stages.
              </TTypography>

              <TableContainer component={Paper} sx={{ mb: 6 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "16.6%" }}>Ea0</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Ea1</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Ea2</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Ea3</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Ea4</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Ea5</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {t("learning.impact.ea.0", "No impact")}
                      </TableCell>
                      <TableCell>{t("learning.impact.ea.1", "< 10")}</TableCell>
                      <TableCell>
                        {t("learning.impact.ea.2", "11 – 100")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.ea.3", "101 – 1 000")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.ea.4", "1 001 – 10 000")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.ea.5", "> 10 000")}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Trans i18nKey="learning.impact.ea.footer">
                          Unit: affected area multiplied by number of years of
                          adverse effects (km² x years)
                        </Trans>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </Box>

        <ImpactTitleSection>
          <TTypography i18nKey="learning.impact.f.title" variant="h4">
            Financial Impact
          </TTypography>
          <TTypography i18nKey="learning.impact.f.introduction" variant="body1">
            Economic effects and damages are counted as financial asset damages
            (Fa), and the reduction of economic performance (Fb).
          </TTypography>
        </ImpactTitleSection>

        <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
          <Container>
            <Box
              sx={{ mt: 4, mb: 1, display: "flex", flexDirection: "column" }}
            >
              <TTypography i18nKey="learning.impact.fa.title" variant="h6">
                Fa - Financial asset damages
              </TTypography>
            </Box>
            <Box sx={{ mb: 8, ml: 0 }}>
              <TTypography
                i18nKey="learning.impact.fa.introduction.1"
                variant="body1"
                paragraph
              >
                Damage indicator Fa measures losses to existing assets and the
                cost of coping.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.fa.introduction.2"
                variant="body1"
                paragraph
              >
                Assets include both tangible assets and financial assets. This
                indicator counts all damage to assets even if, for example,
                insurance companies or the State settle the costs.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.fa.introduction.3"
                variant="body1"
                paragraph
              >
                Cost of coping includes the cost of emergency services,
                emergency shelters, and provision of care for people in need of
                assistance.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.fa.introduction.4"
                variant="body1"
                paragraph
              >
                The example used to illustrate this indicator is flooding. Such
                an event causes damage to multiple buildings and a factory. This
                runs up costs for pumping out basements and removing rubble and
                driftwood (cost of coping). The physical damage leads to
                financial losses as the value of the buildings and equipment is
                now diminished.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.fa.introduction.5"
                variant="body1"
                paragraph
              >
                Depending on the effects of the hazard, various perspectives can
                be adopted regarding the financial losses:
              </TTypography>
              <ul>
                <li>
                  <TTypography
                    i18nKey="learning.impact.fa.introduction.6"
                    variant="body1"
                    paragraph
                  >
                    macroeconomic: nationwide cost of coping and damage to
                    national wealth.
                  </TTypography>
                </li>
                <li>
                  <TTypography
                    i18nKey="learning.impact.fa.introduction.7"
                    variant="body1"
                    paragraph
                  >
                    individual or small-scale: cost of coping and financial
                    losses for individuals or within a spatially limited unit.
                  </TTypography>
                </li>
              </ul>

              <TableContainer component={Paper} sx={{ mb: 6 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "16.6%" }}>Fa0</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Fa1</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Fa2</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Fa3</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Fa4</TableCell>
                      <TableCell sx={{ width: "16.6%" }}>Fa5</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {t("learning.impact.fa.0", "No impact")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fa.1", "≤ 50 million")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fa.2", "50 – 500 million")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fa.3", "0.5 – 5 billion")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fa.4", "5 – 50 billion")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fa.5", "> 50 billion")}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={10}>
                        <Trans i18nKey="learning.impact.fa.footer">
                          Unit: EURO
                        </Trans>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </Box>

        <Box sx={{ bgcolor: "white", width: "100%", pt: 4, pb: 12 }}>
          <Container>
            <Box
              sx={{ mt: 4, mb: 1, display: "flex", flexDirection: "column" }}
            >
              <TTypography i18nKey="learning.impact.fb.title" variant="h6">
                Fb - Reduction of economic performance
              </TTypography>
            </Box>
            <Box sx={{ mb: 8, ml: 0 }}>
              <TTypography
                i18nKey="learning.impact.fb.introduction.1"
                variant="body1"
                paragraph
              >
                Damage indicator Fb includes indirect economic effects that
                reduce value creation in Belgium. While Fa – Financial losses
                and cost of coping relates to the cost of coping and damage to
                existing assets, Fb takes into account the consequences for
                future value creation.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.fb.introduction.2"
                variant="body1"
                paragraph
              >
                The example used to illustrate this indicator is flooding (cf.
                example in Fa). Due to the damage caused by such an event, the
                affected company has zero output for several weeks and therefore
                suffers a loss of income.
              </TTypography>
              <TTypography
                i18nKey="learning.impact.fb.introduction.3"
                variant="body1"
                paragraph
              >
                Depending on the effects of the hazard, various perspectives can
                be adopted regarding financial losses:
              </TTypography>
              <ul>
                <li>
                  <TTypography
                    i18nKey="learning.impact.fb.introduction.4"
                    variant="body1"
                    paragraph
                  >
                    macroeconomic: the sum of domestic value creation is used as
                    an indicator of total economic performance. It is quantified
                    in terms of Gross Domestic Product (GDP). Thus, a reduction
                    of economic performance corresponds to a decline in GDP.
                  </TTypography>
                </li>
                <li>
                  <TTypography
                    i18nKey="learning.impact.fb.introduction.5"
                    variant="body1"
                    paragraph
                  >
                    individual or small-scale: reduction of economic performance
                    for individuals or within a spatially limited unit.
                  </TTypography>
                </li>
              </ul>
              <TTypography
                i18nKey="learning.impact.fb.introduction.6"
                variant="body1"
                paragraph
              >
                For this reason and for ease of evaluation for experts without a
                financial background, multiple equivalent interpretations of the
                damage classes are provided.
              </TTypography>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ width: "40%" }}></TableCell>
                      <TableCell sx={{ width: "10%" }}>Fb0</TableCell>
                      <TableCell sx={{ width: "10%" }}>Fb1</TableCell>
                      <TableCell sx={{ width: "10%" }}>Fb2</TableCell>
                      <TableCell sx={{ width: "10%" }}>Fb3</TableCell>
                      <TableCell sx={{ width: "10%" }}>Fb4</TableCell>
                      <TableCell sx={{ width: "10%" }}>Fb5</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {t("learning.impact.fb.a.name", "Euro")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.a.0", "No Impact")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.a.1", "≤ 50 million")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.a.2", "50 - 500 million")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.a.3", "0.5 - 5 billion")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.a.4", "5 - 50 billion")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.a.5", "> 50 billion")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {t(
                          "learning.impact.fb.b.name",
                          "Governmental debt (% of GDP, basis of 115%)"
                        )}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.b.0", "No Impact")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.b.1", "+ <1%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.b.2", "+ 1-3%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.b.3", "+ 3-7%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.b.4", "+ 7-10%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.b.5", "+ >10%")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {t(
                          "learning.impact.fb.c.name",
                          "Growth of unemployment"
                        )}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.c.0", "No Impact")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.c.1", "<5%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.c.2", "5-10%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.c.3", "10-30%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.c.4", "30-70%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.c.5", "> 70%")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {t("learning.impact.fb.d.name", "GDP Growth")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.d.0", "No Impact")}
                      </TableCell>
                      <TableCell>{t("learning.impact.fb.d.1", "2%")}</TableCell>
                      <TableCell>
                        {t("learning.impact.fb.d.2", "0-2%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.d.3", "(-2) – 0%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.d.4", "(-10) – (-2)%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.d.5", "< (-10)%")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {t(
                          "learning.impact.fb.e.name",
                          "Inflation (basis of 2%)"
                        )}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.e.0", "No Impact")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.e.1", "Δ 1%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.e.2", "Δ 3%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.e.3", "Δ 5%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.e.4", "Δ 10%")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.e.5", "Δ >10%")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        {t(
                          "learning.impact.fb.f.name",
                          "Consumer confidence (basis of -5)"
                        )}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.f.0", "No Impact")}
                      </TableCell>
                      <TableCell>{t("learning.impact.fb.f.1", "-1")}</TableCell>
                      <TableCell>{t("learning.impact.fb.f.2", "-5")}</TableCell>
                      <TableCell>
                        {t("learning.impact.fb.f.3", "-10")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.f.4", "-25")}
                      </TableCell>
                      <TableCell>
                        {t("learning.impact.fb.f.5", ">-25")}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
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
              <TTypography
                i18nKey="landingpage.questions1"
                variant="body1"
                sx={{ textAlign: "center" }}
              >
                Questions, suggestions or other? Please don&#quot;t hesitate to
                contact us!
              </TTypography>
              <Typography
                variant="body1"
                paragraph
                sx={{ textAlign: "center" }}
              >
                <Link href={`mailto:dist.nccn.cipra@nccn.fgov.be`}>
                  dist.nccn.cipra@nccn.fgov.be
                </Link>
              </Typography>
            </Box>
          </Container>
        </Box>
      </Main>
    </>
  );
}
