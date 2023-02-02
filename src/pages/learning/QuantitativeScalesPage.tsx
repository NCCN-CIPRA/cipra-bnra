import {
  Box,
  Container,
  ListItemIcon,
  Stack,
  Typography,
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Paper,
  Grid,
  TableFooter,
} from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Trans, useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import usePageTitle from "../../hooks/usePageTitle";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import LearningSideBar from "../../components/LearningSideBar";

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

export default function QuantitativeScalesPage({}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(true);

  usePageTitle(t("learning.impact.title", "BNRA 2023 - 2026 Kwantitatieve Schalen"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    { name: t("learning.general.hazardCatalogue.breadcrumb", "Risicocatalogus"), url: "/learning/risk-catalogue" },
  ]);

  return (
    <>
      <LearningSideBar
        open={open}
        width={320}
        pageName="quantitative-categories"
        handleDrawerToggle={() => setOpen(!open)}
      />
      <Main open={open}>
        <Container>
          <Box sx={{ py: 4, textAlign: "justify" }}>
            <Typography variant="h4" paragraph>
              <Trans i18nKey="learning.probability.text.title">Waarschijnlijkheid</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.probability.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Trans i18nKey="learning.scales.classCode">Class Code</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.returnPeriod">Return Period</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.3yearLikelihood">3 Year Likelihood</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.10yearLikelihood">10 Year Likelihood</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.qualitative">Qualitative Description</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>DP5</TableCell>
                    <TableCell>{t("learning.probability.rp.5", "< 3 years")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.3yl.5">{"> 63%"}</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.10yl.5">{"> 96%"}</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.q.5">
                        Almost certain; Multiple events in Belgium during a human lifespan
                      </Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>DP4</TableCell>
                    <TableCell>{t("learning.probability.rp.4", "3 – 30 years")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.3yl.4">{"63% – 9.5%"}</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.10yl.4">{"96% - 28%"}</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.q.4">
                        Very likely; Few events in Belgium during a human lifespan
                      </Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>DP3</TableCell>
                    <TableCell>{t("learning.probability.rp.3", "31 – 300 years")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.3yl.3">{"9.5% - 1%"}</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.10yl.3">{"28% - 3.3%"}</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.q.3">
                        Likely; On average one event in Belgium during a human lifespan
                      </Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>DP2</TableCell>
                    <TableCell>{t("learning.probability.rp.2", "301 – 3000 years")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.3yl.2">{"1% - 0.1%"}</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.10yl.2">{"3.3% - 0.3%"}</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.q.2">
                        Unlikely; May have occurred in Belgium, but possibly some generations ago
                      </Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>DP1</TableCell>
                    <TableCell>{t("learning.probability.rp.1", "> 3000 years")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.3yl.1">{"< 0.1%"}</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.10yl.1">{"< 0.3%"}</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.probability.q.1">
                        Very unlikely; Few, if any, known events worldwide
                      </Trans>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ py: 4, textAlign: "justify" }}>
            <Typography variant="h4" paragraph>
              <Trans i18nKey="learning.impact.text.title">Impact Indicatoren</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <Typography variant="h5" paragraph>
              <Trans i18nKey="learning.impact.h.title">Human Impact</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.h.introduction">
                The indicators for the human impact scale record the effects of a hazard on the lives (Ha), physical
                integrity and mental health (Hb) of the general public. Hc captures those individuals requiring
                assistance as a result of the event.
              </Trans>
            </Typography>

            <Typography variant="h6" paragraph>
              <Trans i18nKey="learning.impact.ha.title">Ha - Fatalities</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.ha.introduction">
                The damage indicator Ha relates to all people whose deaths can be directly attributed to the event.
              </Trans>
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ha.0.title">Ha0</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ha.1.title">Ha1</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ha.2.title">Ha2</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ha.3.title">Ha3</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ha.4.title">Ha4</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ha.5.title">Ha5</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("learning.impact.ha.0", "No impact")}</TableCell>
                    <TableCell>{t("learning.impact.ha.1", "< 10")}</TableCell>
                    <TableCell>{t("learning.impact.ha.2", "11 – 100")}</TableCell>
                    <TableCell>{t("learning.impact.ha.3", "101 – 1 000")}</TableCell>
                    <TableCell>{t("learning.impact.ha.4", "1 001 – 10 000")}</TableCell>
                    <TableCell>{t("learning.impact.ha.5", "> 10 000")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" paragraph>
              <Trans i18nKey="learning.impact.hb.title">Hb - Injured / sick people</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.hb.introduction.1">
                The Hb indicator includes the number of people affected by injuries or diseases that can be directly
                attributed to the event. The indicator takes into account physical and mental illnesses or injuries
                connected to the hazard.
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.hb.introduction.2">
                The basic units for this indicator are all people who suffer an injury, illness (incl. due to endocrine
                disruption) as a result of the event. The three levels of severity outlined below should be assessed
                accordingly. Differing degrees of injury severity are aggregated using weighting factors.
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.hb.introduction.3">
                Individuals who succumb to their injuries or illness are counted not under this indicator, but under Ha
                – Fatalities. Individuals requiring one-time emergency psychological care but who do not suffer from an
                underlying psychological illness are covered by indicator Hc – People in need of assistance. Individuals
                suffering from psychological trauma (e.g. post-traumatic stress disorder) resulting in impingement upon
                or unduly restricting their daily life are covered by indicator Sb - Diminished public order and
                domestic security.
              </Trans>
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.0.title">Hb0</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.1.title">Hb1</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.2.title">Hb2</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.3.title">Hb3</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.4.title">Hb4</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.5.title">Hb5</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("learning.impact.hb.0", "No impact")}</TableCell>
                    <TableCell>{t("learning.impact.hb.1", "< 100")}</TableCell>
                    <TableCell>{t("learning.impact.hb.2", "100 – 1 000")}</TableCell>
                    <TableCell>{t("learning.impact.hb.3", "1 001 – 10 000")}</TableCell>
                    <TableCell>{t("learning.impact.hb.4", "10 001 – 100 000")}</TableCell>
                    <TableCell>{t("learning.impact.hb.5", "> 100 000")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.level">Level</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.injury">Injury</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.illness">Illness</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.factor">Weighting factor</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.level.1">Severe</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.injury.1">Hospital stay of at least 7 days</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.illness.1">Chronic illness requiring medical treatment</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.factor.1">1</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.level.2">Moderate</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.injury.2">Hospital stay of 1–6 days</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.illness.2">
                        Severe, persistent illness requiring medical treatment; full recovery
                      </Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.factor.2">0.1</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.level.3">Minor</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.injury.3">
                        No permanent physical harm; medical attention, but no hospital stay
                      </Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.illness.3">
                        Minor illness requiring medical treatment; full recovery
                      </Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hb.factor.3">0.003</Trans>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" paragraph>
              <Trans i18nKey="learning.impact.hc.title">Hc - People in need of assistance</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.hc.introduction.1">
                Indicator Hc covers people who must be evacuated, temporarily housed, and/or otherwise cared for before,
                during, and after an event. This may involve, for instance, housing in emergency shelters; supplying
                food to people in locations cut off from the outside world; or giving emergency psychological assistance
                to people who are not, however, affected by actual mental illnesses. The duration of assistance required
                by the directly affected persons is registered. Effects such as supply shortfalls and disruptions for
                large parts of the population are counted not under Hc, but under the indicator Sa – Supply shortfalls
                and service disruptions.
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.hc.introduction.2">
                The unit to quantify the need for assistance is the person day. This is determined by multiplying the
                number of people requiring assistance with the duration of impairment in days . The effective duration
                of assistance required by all individuals is added up. The minimum unit per person is one day. The
                duration of the requirement for assistance is counted, rather than the period in which assistance
                services are provided. For instance, one would count the number of days during which the total number of
                traumatised individuals require emergency psychological assistance, rather than the duration for which
                the members of care-providing organisations have been deployed.
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.hc.introduction.3">
                The cost of providing support services is accounted for in the indicator Fa – Financial asset damages.
              </Trans>
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hc.0.title">Hc0</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hc.1.title">Hc1</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hc.2.title">Hc2</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hc.3.title">Hc3</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hc.4.title">Hc4</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.hc.5.title">Hc5</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("learning.impact.hc.0", "No impact")}</TableCell>
                    <TableCell>{t("learning.impact.hc.1", "< 200 000")}</TableCell>
                    <TableCell>{t("learning.impact.hc.2", "200 001 – 2 000 000")}</TableCell>
                    <TableCell>{t("learning.impact.hc.3", "2 000 001 – 20 000 000")}</TableCell>
                    <TableCell>{t("learning.impact.hc.4", "20 000 001 – 200 000 000")}</TableCell>
                    <TableCell>{t("learning.impact.hc.5", "> 200 000 000")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h5" paragraph>
              <Trans i18nKey="learning.impact.s.title">2 Societal Impact</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.s.introduction">
                The damage area relating to society measures significant disruptions caused by the hazard under
                investigation. On the one hand, these may include the effects on the Belgian population, e.g. through
                supply shortfalls and disruptions (Sa) or diminished public order and domestic security (Sb). On the
                other hand, it captures the effects on the state: damage to the reputation of Belgium abroad (Sc) and a
                loss of confidence in or functioning of the state and/or its values (Sd).
              </Trans>
            </Typography>

            <Typography variant="h6" paragraph>
              <Trans i18nKey="learning.impact.sa.title">Sa - Supply shortfalls and unmet human needs</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.sa.introduction.1">
                This indicator measures breakdowns or severe disruptions to the supply of critical goods and services to
                the entire population or parts of it. They are grouped into three sets according to their importance.
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.sa.introduction.2">
                Supply shortfalls are calculated by multiplying the number of persons affected with the duration (in
                days) for which their needs are not met. The effective duration of the disruption for those affected is
                added together. Additionally, a distinction should be made between needs of varying importance. The
                human need for water and food is obviously more immediately important than the need for postal and
                courier services. Physical needs are to be fulfilled if the individual is to survive, whereas the next
                categories rather ensure the security and comfort needs. To model this fact, a weighting factor is given
                to each need which should be applied in the final calculations. Notice that there may exist some
                cascading effects between unmet needs, i.e. if the need for electricity is not met, usually the need for
                telecommunication will also not be met. This effect is not taken into account in the weighting factor
                and should thus be separately included in the final calculations . The weighting factors are loosely
                based on Maslow’s hierarchy of needs and similar theories.
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.sa.introduction.3">
                Economic consequences are covered by the indicators Fa – Asset losses and cost of coping and Fb –
                Reduction of economic performance.
              </Trans>
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.0.title">Sa0</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.1.title">Sa1</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.2.title">Sa2</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.3.title">Sa3</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.4.title">Sa4</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.5.title">Sa5</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("learning.impact.sa.0", "No impact")}</TableCell>
                    <TableCell>{t("learning.impact.sa.1", "< 10 000")}</TableCell>
                    <TableCell>{t("learning.impact.sa.2", "10 001 – 100 000")}</TableCell>
                    <TableCell>{t("learning.impact.sa.3", "100 001 – 1 000 000")}</TableCell>
                    <TableCell>{t("learning.impact.sa.4", "1 000 001 – 10 000 000")}</TableCell>
                    <TableCell>{t("learning.impact.sa.5", "> 10 000 000")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.importance">Importance</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.needs">Needs</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.factor">Weighting factor</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.importance.1">Physical needs</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.needs.1">
                        Potable water, basic foodstuffs, medicine, medical emergency services, first responders
                        communication
                      </Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.factor.1">1</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.importance.2">Security needs</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.needs.2">
                        Electricity, heating, non-emergency medical care, telecommunications, transport, financial
                        services
                      </Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.factor.2">0.5</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.importance.3">Comfort needs</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.needs.3">
                        Fuel, media, waste management, government, postal and courier services
                      </Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sa.factor.3">0.1</Trans>
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableCell colSpan={3}>
                    <Trans i18nKey="learning.impact.sa.importance.footer">
                      Needs weighted by degree of importance for a sustained and comfortable human life
                    </Trans>
                  </TableCell>
                </TableFooter>
              </Table>
            </TableContainer>

            <Typography variant="h6" paragraph>
              <Trans i18nKey="learning.impact.text.title">Sb - Fatalities</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sb.0.title">Sb0</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sb.1.title">Sb1</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sb.2.title">Sb2</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sb.3.title">Sb3</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sb.4.title">Sb4</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sb.5.title">Sb5</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("learning.impact.sb.0", "No impact")}</TableCell>
                    <TableCell>{t("learning.impact.sb.1", "< 10")}</TableCell>
                    <TableCell>{t("learning.impact.sb.2", "11 – 100")}</TableCell>
                    <TableCell>{t("learning.impact.sb.3", "101 – 1 000")}</TableCell>
                    <TableCell>{t("learning.impact.sb.4", "1 001 – 10 000")}</TableCell>
                    <TableCell>{t("learning.impact.sb.5", "> 10 000")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" paragraph>
              <Trans i18nKey="learning.impact.text.title">Sc - Fatalities</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sc.0.title">Sc0</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sc.1.title">Sc1</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sc.2.title">Sc2</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sc.3.title">Sc3</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sc.4.title">Sc4</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sc.5.title">Sc5</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("learning.impact.sc.0", "No impact")}</TableCell>
                    <TableCell>{t("learning.impact.sc.1", "< 10")}</TableCell>
                    <TableCell>{t("learning.impact.sc.2", "11 – 100")}</TableCell>
                    <TableCell>{t("learning.impact.sc.3", "101 – 1 000")}</TableCell>
                    <TableCell>{t("learning.impact.sc.4", "1 001 – 10 000")}</TableCell>
                    <TableCell>{t("learning.impact.sc.5", "> 10 000")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" paragraph>
              <Trans i18nKey="learning.impact.text.title">Sd - Fatalities</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sd.0.title">Sd0</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sd.1.title">Sd1</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sd.2.title">Sd2</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sd.3.title">Sd3</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sd.4.title">Sd4</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.sd.5.title">Sd5</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("learning.impact.sd.0", "No impact")}</TableCell>
                    <TableCell>{t("learning.impact.sd.1", "< 10")}</TableCell>
                    <TableCell>{t("learning.impact.sd.2", "11 – 100")}</TableCell>
                    <TableCell>{t("learning.impact.sd.3", "101 – 1 000")}</TableCell>
                    <TableCell>{t("learning.impact.sd.4", "1 001 – 10 000")}</TableCell>
                    <TableCell>{t("learning.impact.sd.5", "> 10 000")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h5" paragraph>
              <Trans i18nKey="learning.impact.text.title">Human Impact</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <Typography variant="h6" paragraph>
              <Trans i18nKey="learning.impact.text.title">Ea - Fatalities</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ea.0.title">Ea0</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ea.1.title">Ea1</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ea.2.title">Ea2</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ea.3.title">Ea3</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ea.4.title">Ea4</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.ea.5.title">Ea5</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("learning.impact.ea.0", "No impact")}</TableCell>
                    <TableCell>{t("learning.impact.ea.1", "< 10")}</TableCell>
                    <TableCell>{t("learning.impact.ea.2", "11 – 100")}</TableCell>
                    <TableCell>{t("learning.impact.ea.3", "101 – 1 000")}</TableCell>
                    <TableCell>{t("learning.impact.ea.4", "1 001 – 10 000")}</TableCell>
                    <TableCell>{t("learning.impact.ea.5", "> 10 000")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h5" paragraph>
              <Trans i18nKey="learning.impact.text.title">Human Impact</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <Typography variant="h6" paragraph>
              <Trans i18nKey="learning.impact.text.title">Fa - Fatalities</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 6 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fa.0.title">Fa0</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fa.1.title">Fa1</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fa.2.title">Fa2</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fa.3.title">Fa3</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fa.4.title">Fa4</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fa.5.title">Fa5</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("learning.impact.fa.0", "No impact")}</TableCell>
                    <TableCell>{t("learning.impact.fa.1", "< 10")}</TableCell>
                    <TableCell>{t("learning.impact.fa.2", "11 – 100")}</TableCell>
                    <TableCell>{t("learning.impact.fa.3", "101 – 1 000")}</TableCell>
                    <TableCell>{t("learning.impact.fa.4", "1 001 – 10 000")}</TableCell>
                    <TableCell>{t("learning.impact.fa.5", "> 10 000")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" paragraph>
              <Trans i18nKey="learning.impact.text.title">Fb - Fatalities</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.impact.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fb.0.title">Fb0</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fb.1.title">Fb1</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fb.2.title">Fb2</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fb.3.title">Fb3</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fb.4.title">Fb4</Trans>
                    </TableCell>
                    <TableCell sx={{ width: "16.6%" }}>
                      <Trans i18nKey="learning.impact.fb.5.title">Fb5</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t("learning.impact.fb.0", "No impact")}</TableCell>
                    <TableCell>{t("learning.impact.fb.1", "< 10")}</TableCell>
                    <TableCell>{t("learning.impact.fb.2", "11 – 100")}</TableCell>
                    <TableCell>{t("learning.impact.fb.3", "101 – 1 000")}</TableCell>
                    <TableCell>{t("learning.impact.fb.4", "1 001 – 10 000")}</TableCell>
                    <TableCell>{t("learning.impact.fb.5", "> 10 000")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ py: 4, textAlign: "justify" }}>
            <Typography variant="h4" paragraph>
              <Trans i18nKey="learning.cp.text.title">Voorwaardelijke Kans</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.cp.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Trans i18nKey="learning.scales.classCode">Class Code</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.cp.3yearLikelihood">Conditional Likelihood</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.cp.qualitative">Qualitative Description</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>CP5</TableCell>
                    <TableCell>{t("learning.cp.rp.5", "90% - 100%")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.cp.q.5">Always</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CP4</TableCell>
                    <TableCell>{t("learning.cp.rp.4", "50% - 90%")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.cp.q.4">Often</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CP3</TableCell>
                    <TableCell>{t("learning.cp.rp.3", "10% - 50%")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.cp.q.3">Occasionally</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CP2</TableCell>
                    <TableCell>{t("learning.cp.rp.2", "1% - 10%")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.cp.q.2">Rarely</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CP1</TableCell>
                    <TableCell>{t("learning.cp.rp.1", "< 1%")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.cp.q.1">Very rarely</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CP0</TableCell>
                    <TableCell>{t("learning.cp.rp.1", "0%")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.cp.q.1">Never</Trans>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ py: 4, textAlign: "justify" }}>
            <Typography variant="h4" paragraph>
              <Trans i18nKey="learning.motivation.text.title">Motivatie</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.motivation.text.introduction">
                What follows is a description of each of the 10 damage indicators used in the BNRA 2023 - 2026. For each
                damage indicator, there are five damage extent classes, along with the ranges of their respective
                measurement units. These damage classes are logarithmically cumulative .
              </Trans>
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Trans i18nKey="learning.scales.classCode">Class Code</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.motivation.3yearLikelihood">Likelihood</Trans>
                    </TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.motivation.qualitative">Qualitative Description</Trans>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>M3</TableCell>
                    <TableCell>{t("learning.motivation.rp.4", "90% – 100%")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.motivation.q.4">Proven motivation</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M2</TableCell>
                    <TableCell>{t("learning.motivation.rp.3", "50% – 90%")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.motivation.q.3">Some motivation</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M1</TableCell>
                    <TableCell>{t("learning.motivation.rp.2", "1% – 50%")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.motivation.q.2">Low motivation</Trans>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>M0</TableCell>
                    <TableCell>{t("learning.motivation.rp.1", "0%")}</TableCell>
                    <TableCell>
                      <Trans i18nKey="learning.motivation.q.1">No motivation</Trans>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </Main>
    </>
  );
}
