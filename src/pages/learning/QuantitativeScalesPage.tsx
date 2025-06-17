import {
  Box,
  Container,
  Typography,
  Paper,
  TableFooter,
  IconButton,
  Grow,
  Tab,
  Card,
} from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { Trans, useTranslation } from "react-i18next";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import usePageTitle from "../../hooks/usePageTitle";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import LearningSideBar from "../../components/LearningSideBar";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { DP1, DP2, DP3, DP4, DP5 } from "../../components/indicators/P";
import * as DP50 from "../../components/indicators/P2050";
import CCExampleChart from "../../components/charts/CCExampleChart";
import CCTempChart from "../../components/charts/CCTempChart";

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

export default function QuantitativeScalesPage() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState("p");

  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({
    p: false,
    i: false,
    h: false,
    ha: false,
    hb: false,
    hc: false,
    s: false,
    sa: false,
    sb: false,
    sc: false,
    sd: false,
    e: false,
    ea: false,
    f: false,
    fa: false,
    fb: false,
    cp: false,
    m: false,
  });

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  usePageTitle(
    t("learning.impact.title", "BNRA 2023 - 2026 Kwantitatieve Schalen")
  );
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.general.scales.breadcrumb", "Quantitative Scales"),
      url: "/learning/quantitative-categories",
    },
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
        <Container sx={{ mt: 8 }}>
          <Box>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.general.scales.introduction.1">
                Tijdens de BNRA 2023 - 2026 geven experten enerzijds{" "}
                <i>kwalitatieve</i> beschrijvingen van de waarschijnlijkheid en
                impact van de verschillende risicoscenario&s. Anderzijds wordt
                gevraagd een
                <i>kwantitatieve</i> inschatting te geven die het mogelijk zal
                maken de verschillende risico&#39;s aan het einde van de
                beoordeling onderling te vergelijken.
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.general.scales.introduction.2">
                Om deze kwantitatieve inschatting te vergemakkelijken, werden
                voor elke parameter 5 (+ 1) schalen opgesteld. De extra schaal
                is steeds de 0-schaal. Deze komt overeen met een kans of impact
                van 0. De standaard schalen gaan van 1 tot 5 waarbij 1 de
                laagste waarschijnlijkheid of impact aangeeft, en 5 de hoogste.
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.general.scales.introduction.3">
                In onderstaande tabs worden de schalen en hun bijhorende
                drempelwaarden weergegeven. Merk op dat de impact opgedeeld is
                in 10 subschalen die <i>schade-indicatoren</i> genoemd worden.
              </Trans>
            </Typography>
          </Box>

          <TabContext value={currentTab}>
            <TabList
              onChange={handleChangeTab}
              textColor="primary"
              indicatorColor="primary"
              aria-label="primary tabs example"
              sx={{ mt: 8 }}
            >
              <Tab
                value="p"
                label={t(
                  "learning.probability.text.title",
                  "Waarschijnlijkheid"
                )}
              />
              <Tab
                value="p2050"
                label={t(
                  "learning.probability2050.text.title",
                  "Waarschijnlijkheid in 2050"
                )}
              />
              <Tab
                value="m"
                label={t("learning.motivation.text.title", "Motivatie")}
              />
              <Tab
                value="cp"
                label={t("learning.cp.text.title", "Voorwaardelijke Kans")}
              />
              <Tab
                value="i"
                label={t("learning.impact.text.title", "Impact")}
              />
            </TabList>

            <TabPanel value="p">
              <Box sx={{ mb: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.probability.text.introduction.1">
                      For estimating the probability of a risk scenario, the
                      following 3 measures are proposed:
                    </Trans>
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="body2">
                        <Trans i18nKey="learning.probability.text.introduction.2">
                          The return period, i.e. the timespan expressed in
                          years during which statistical computations or
                          estimates expect a given event to occur at least once
                          on average. It is expressed as occurring once every x
                          years.
                        </Trans>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <Trans i18nKey="learning.probability.text.introduction.3">
                          The 3 year likelihood, i.e. the probability of a given
                          event occurring at least once during the next 3 years.
                          Always takes a value between 0 and 100%.
                        </Trans>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <Trans i18nKey="learning.probability.text.introduction.4">
                          The 10 year likelihood, i.e. the probability of a
                          given event occurring at least once during the next 10
                          years. Always takes a value between 0 and 100%.
                        </Trans>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <Trans i18nKey="learning.probability.text.introduction.5">
                          A qualitative description
                        </Trans>
                      </Typography>
                    </li>
                  </ul>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.probability.text.introduction.6">
                      All these measures are essentially equivalent; they just
                      use different scales. The assessment is based on five
                      probability classes shown in the table below.
                    </Trans>
                  </Typography>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Trans i18nKey="learning.scales.classCode">
                            Class Code
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.probability.returnPeriod">
                            Return Period
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.probability.3yearLikelihood">
                            3 Year Likelihood
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.probability.10yearLikelihood">
                            10 Year Likelihood
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.probability.qualitative">
                            Qualitative Description
                          </Trans>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>DP5</TableCell>
                        {DP5.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>DP4</TableCell>
                        {DP4.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>DP3</TableCell>
                        {DP3.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>DP2</TableCell>
                        {DP2.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>DP1</TableCell>
                        {DP1.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>

            <TabPanel value="p2050">
              <Box sx={{ mb: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.probability2050.text.introduction.1">
                      For estimating the probability of a risk scenario, the
                      following 3 measures are proposed:
                    </Trans>
                  </Typography>
                  <ul>
                    <li>
                      <Typography variant="body2">
                        <Trans i18nKey="learning.probability2050.text.introduction.2">
                          The return period, i.e. the timespan expressed in
                          years during which statistical computations or
                          estimates expect a given event to occur at least once
                          on average. It is expressed as occurring once every x
                          years.
                        </Trans>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <Trans i18nKey="learning.probability2050.text.introduction.3">
                          The 3 year likelihood, i.e. the probability of a given
                          event occurring at least once during the next 3 years.
                          Always takes a value between 0 and 100%.
                        </Trans>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <Trans i18nKey="learning.probability2050.text.introduction.4">
                          The 10 year likelihood, i.e. the probability of a
                          given event occurring at least once during the next 10
                          years. Always takes a value between 0 and 100%.
                        </Trans>
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        <Trans i18nKey="learning.probability2050.text.introduction.5">
                          A qualitative description
                        </Trans>
                      </Typography>
                    </li>
                  </ul>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.probability2050.text.introduction.6">
                      All these measures are essentially equivalent; they just
                      use different scales. The assessment is based on five
                      probability classes shown in the table below.
                    </Trans>
                  </Typography>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Trans i18nKey="learning.scales.classCode">
                            Class Code
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.probability.returnPeriod">
                            Return Period
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.probability.3yearLikelihood">
                            3 Year Likelihood
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.probability.10yearLikelihood">
                            10 Year Likelihood
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.probability.qualitative">
                            Qualitative Description
                          </Trans>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>DP2050-5</TableCell>
                        {DP50.DP5.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>DP2050-4</TableCell>
                        {DP50.DP4.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>DP2050-3</TableCell>
                        {DP50.DP3.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>DP2050-2</TableCell>
                        {DP50.DP2.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>DP2050-1</TableCell>
                        {DP50.DP1.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell>DP2050-0</TableCell>
                        {DP50.DP0.map((c, i) => (
                          <TableCell key={i}>{t(c)}</TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                <CCTempChart />
                <Card sx={{ width: "100%", height: 500, my: 8, p: 2 }}>
                  <CCExampleChart />
                </Card>
              </Box>
            </TabPanel>

            <TabPanel value="m">
              <Box sx={{ pb: 4, textAlign: "justify" }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.motivation.text.introduction.1">
                      There are several factors which make it impossible to
                      reach a definitive conclusion on the likelihood of
                      occurrence (frequency) of maliciously induced events (e.g.
                      terrorist attacks, political events and armed conflicts).
                      They include the unpredictability of the actors; the
                      fluctuating willingness to act and react to evolving
                      security situations and the resulting fast-changing threat
                      landscapes, as well as the lack of statistically useful
                      case numbers.
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.motivation.text.introduction.2">
                      An alternative methodology is proposed that makes use of
                      well-known parameters in the intelligence service
                      community, such as ability and motivation, as well as some
                      assumptions about the behaviour of intelligent and
                      malicious actors.
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.motivation.text.introduction.3">
                      The probability should be read as the chance that the
                      actor would execute any attack within their capabilities
                      between now and 3 years.
                    </Trans>
                  </Typography>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Trans i18nKey="learning.scales.classCode">
                            Class Code
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.motivation.3yearLikelihood">
                            Likelihood
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.motivation.qualitative">
                            Qualitative Description
                          </Trans>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>M3</TableCell>
                        <TableCell>
                          {t("learning.motivation.rp.4", "90% – 100%")}
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.motivation.q.4">
                            Proven motivation
                          </Trans>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>M2</TableCell>
                        <TableCell>
                          {t("learning.motivation.rp.3", "50% – 90%")}
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.motivation.q.3">
                            Some motivation
                          </Trans>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>M1</TableCell>
                        <TableCell>
                          {t("learning.motivation.rp.2", "1% – 50%")}
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.motivation.q.2">
                            Low motivation
                          </Trans>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>M0</TableCell>
                        <TableCell>
                          {t("learning.motivation.rp.1", "0%")}
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.motivation.q.1">
                            No motivation
                          </Trans>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>

            <TabPanel value="cp">
              <Box sx={{ mb: 4, textAlign: "justify" }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.cp.text.introduction.1">
                      For each cause-effect relation identified in the BNRA,
                      conditional probabilities should be established between
                      the different intensity scenarios of the cause and the
                      effect. This is the estimated probability that an incident
                      of the (effect) risk in question will occur, given the
                      fact that an incident of the causing risk has already
                      occurred.
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.cp.text.introduction.2">
                      For example, an earthquake of an extreme intensity has
                      about 95% chance of causing a major ‘failure of
                      electricity supply’, which corresponds to CP5. Note that
                      each cause-effect relationship with 3 intensity scenarios
                      (considerable, major, extreme) requires 9 estimations of
                      conditional likelihood.
                    </Trans>
                  </Typography>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Trans i18nKey="learning.scales.classCode">
                            Class Code
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.cp.3yearLikelihood">
                            Conditional Likelihood
                          </Trans>
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.cp.qualitative">
                            Qualitative Description
                          </Trans>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>CP5</TableCell>
                        <TableCell>
                          {t("learning.cp.rp.5", "90% - 100%")}
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.cp.q.5">Always</Trans>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>CP4</TableCell>
                        <TableCell>
                          {t("learning.cp.rp.4", "50% - 90%")}
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.cp.q.4">Often</Trans>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>CP3</TableCell>
                        <TableCell>
                          {t("learning.cp.rp.3", "10% - 50%")}
                        </TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.cp.q.3">Occasionally</Trans>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>CP2</TableCell>
                        <TableCell>
                          {t("learning.cp.rp.2", "1% - 10%")}
                        </TableCell>
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
                        <TableCell>{t("learning.cp.rp.0", "0%")}</TableCell>
                        <TableCell>
                          <Trans i18nKey="learning.cp.q.0">Never</Trans>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>

            <TabPanel value="i">
              <Box sx={{ py: 1, textAlign: "justify" }}>
                <Box sx={{ mb: 8 }}>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.impact.text.introduction">
                      What follows is a description of each of the 10 damage
                      indicators used in the BNRA 2023 - 2026. For each damage
                      indicator, there are five damage extent classes, along
                      with the ranges of their respective measurement units.
                      These damage classes are logarithmically cumulative .
                    </Trans>
                  </Typography>

                  <Typography variant="h5" paragraph>
                    <Trans i18nKey="learning.impact.h.title">
                      Human Impact
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.impact.h.introduction">
                      The indicators for the human impact scale record the
                      effects of a hazard on the lives (Ha), physical integrity
                      and mental health (Hb) of the general public. Hc captures
                      those individuals requiring assistance as a result of the
                      event.
                    </Trans>
                  </Typography>

                  <Typography
                    variant="h6"
                    paragraph
                    onClick={() =>
                      setCollapsed({ ...collapsed, ha: !collapsed.ha })
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "opacity .3s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <IconButton
                      sx={{ ml: -2 }}
                      onClick={() =>
                        setCollapsed({ ...collapsed, ha: !collapsed.ha })
                      }
                    >
                      {collapsed.ha ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Trans i18nKey="learning.impact.ha.title">
                      Ha - Fatalities
                    </Trans>
                  </Typography>
                  <Box sx={{ height: collapsed.ha ? "auto" : 0 }}>
                    <Grow
                      in={collapsed.ha}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <Box sx={{ mb: 8, ml: 3 }}>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.ha.introduction">
                            The damage indicator Ha relates to all people whose
                            deaths can be directly attributed to the event.
                          </Trans>
                        </Typography>

                        <TableContainer component={Paper} sx={{ mb: 6 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ha.0.title">
                                    Ha0
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ha.1.title">
                                    Ha1
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ha.2.title">
                                    Ha2
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ha.3.title">
                                    Ha3
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ha.4.title">
                                    Ha4
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ha.5.title">
                                    Ha5
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  {t("learning.impact.ha.0", "No impact")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.ha.1", "< 10")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.ha.2", "11 – 100")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.ha.3", "101 – 1 000")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.ha.4", "1 001 – 10 000")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.ha.5", "> 10 000")}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell colSpan={10}>
                                  <Trans i18nKey="learning.impact.ha.footer">
                                    Units: number of people deceased
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grow>
                  </Box>

                  <Typography
                    variant="h6"
                    paragraph
                    onClick={() =>
                      setCollapsed({ ...collapsed, hb: !collapsed.hb })
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "opacity .3s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <IconButton
                      sx={{ ml: -2 }}
                      onClick={() =>
                        setCollapsed({ ...collapsed, hb: !collapsed.hb })
                      }
                    >
                      {collapsed.hb ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Trans i18nKey="learning.impact.hb.title">
                      Hb - Injured / sick people
                    </Trans>
                  </Typography>
                  <Box sx={{ height: collapsed.hb ? "auto" : 0 }}>
                    <Grow
                      in={collapsed.hb}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <Box sx={{ mb: 8, ml: 3 }}>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.hb.introduction.1">
                            The Hb indicator includes the number of people
                            affected by injuries or diseases that can be
                            directly attributed to the event. The indicator
                            takes into account physical and mental illnesses or
                            injuries connected to the hazard.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.hb.introduction.2">
                            The basic units for this indicator are all people
                            who suffer an injury, illness (incl. due to
                            endocrine disruption) as a result of the event. The
                            three levels of severity outlined below should be
                            assessed accordingly. Differing degrees of injury
                            severity are aggregated using weighting factors.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.hb.introduction.3">
                            Individuals who succumb to their injuries or illness
                            are counted not under this indicator, but under Ha –
                            Fatalities. Individuals requiring one-time emergency
                            psychological care but who do not suffer from an
                            underlying psychological illness are covered by
                            indicator Hc – People in need of assistance.
                            Individuals suffering from psychological trauma
                            (e.g. post-traumatic stress disorder) resulting in
                            impingement upon or unduly restricting their daily
                            life are covered by indicator Sb - Diminished public
                            order and domestic security.
                          </Trans>
                        </Typography>

                        <TableContainer component={Paper} sx={{ mb: 6 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.0.title">
                                    Hb0
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.1.title">
                                    Hb1
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.2.title">
                                    Hb2
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.3.title">
                                    Hb3
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.4.title">
                                    Hb4
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.5.title">
                                    Hb5
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  {t("learning.impact.hb.0", "No impact")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.hb.1", "< 100")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.hb.2", "100 – 1 000")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.hb.3", "1 001 – 10 000")}
                                </TableCell>
                                <TableCell>
                                  {t(
                                    "learning.impact.hb.4",
                                    "10 001 – 100 000"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.hb.5", "> 100 000")}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell colSpan={10}>
                                  <Trans i18nKey="learning.impact.hb.footer">
                                    Unit: number of sick/injured people
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
                                  <Trans i18nKey="learning.impact.hb.level">
                                    Level
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.injury">
                                    Injury
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.illness">
                                    Illness
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.factor">
                                    Weighting factor
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.level.1">
                                    Severe
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.injury.1">
                                    Hospital stay of at least 7 days
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.illness.1">
                                    Chronic illness requiring medical treatment
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.factor.1">
                                    1
                                  </Trans>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.level.2">
                                    Moderate
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.injury.2">
                                    Hospital stay of 1–6 days
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.illness.2">
                                    Severe, persistent illness requiring medical
                                    treatment; full recovery
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.factor.2">
                                    0.1
                                  </Trans>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.level.3">
                                    Minor
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.injury.3">
                                    No permanent physical harm; medical
                                    attention, but no hospital stay
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.illness.3">
                                    Minor illness requiring medical treatment;
                                    full recovery
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hb.factor.3">
                                    0.003
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell colSpan={10}>
                                  <Trans i18nKey="learning.impact.hb.level.footer">
                                    Injury and illness weighted according to
                                    their degree of severity
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grow>
                  </Box>

                  <Typography
                    variant="h6"
                    paragraph
                    onClick={() =>
                      setCollapsed({ ...collapsed, hc: !collapsed.hc })
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "opacity .3s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <IconButton
                      sx={{ ml: -2 }}
                      onClick={() =>
                        setCollapsed({ ...collapsed, hc: !collapsed.hc })
                      }
                    >
                      {collapsed.hc ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Trans i18nKey="learning.impact.hc.title">
                      Hc - People in need of assistance
                    </Trans>
                  </Typography>
                  <Box sx={{ height: collapsed.hc ? "auto" : 0 }}>
                    <Grow
                      in={collapsed.hc}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <Box sx={{ mb: 8, ml: 3 }}>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.hc.introduction.1">
                            Indicator Hc covers people who must be evacuated,
                            temporarily housed, and/or otherwise cared for
                            before, during, and after an event. This may
                            involve, for instance, housing in emergency
                            shelters; supplying food to people in locations cut
                            off from the outside world; or giving emergency
                            psychological assistance to people who are not,
                            however, affected by actual mental illnesses. The
                            duration of assistance required by the directly
                            affected persons is registered. Effects such as
                            supply shortfalls and disruptions for large parts of
                            the population are counted not under Hc, but under
                            the indicator Sa – Supply shortfalls and service
                            disruptions.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.hc.introduction.2">
                            The unit to quantify the need for assistance is the
                            person day. This is determined by multiplying the
                            number of people requiring assistance with the
                            duration of impairment in days . The effective
                            duration of assistance required by all individuals
                            is added up. The minimum unit per person is one day.
                            The duration of the requirement for assistance is
                            counted, rather than the period in which assistance
                            services are provided. For instance, one would count
                            the number of days during which the total number of
                            traumatised individuals require emergency
                            psychological assistance, rather than the duration
                            for which the members of care-providing
                            organisations have been deployed.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.hc.introduction.3">
                            The cost of providing support services is accounted
                            for in the indicator Fa – Financial asset damages.
                          </Trans>
                        </Typography>

                        <TableContainer component={Paper} sx={{ mb: 6 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hc.0.title">
                                    Hc0
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hc.1.title">
                                    Hc1
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hc.2.title">
                                    Hc2
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hc.3.title">
                                    Hc3
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hc.4.title">
                                    Hc4
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.hc.5.title">
                                    Hc5
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  {t("learning.impact.hc.0", "No impact")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.hc.1", "< 200 000")}
                                </TableCell>
                                <TableCell>
                                  {t(
                                    "learning.impact.hc.2",
                                    "200 001 – 2 000 000"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t(
                                    "learning.impact.hc.3",
                                    "2 000 001 – 20 000 000"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t(
                                    "learning.impact.hc.4",
                                    "20 000 001 – 200 000 000"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.hc.5", "> 200 000 000")}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell colSpan={10}>
                                  <Trans i18nKey="learning.impact.hc.footer">
                                    Unit: person days (number of people
                                    multiplied by days in need of assistance)
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grow>
                  </Box>

                  <Typography variant="h5" paragraph sx={{ mt: 4 }}>
                    <Trans i18nKey="learning.impact.s.title">
                      Societal Impact
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.impact.s.introduction">
                      The damage area relating to society measures significant
                      disruptions caused by the hazard under investigation. On
                      the one hand, these may include the effects on the Belgian
                      population, e.g. through supply shortfalls and disruptions
                      (Sa) or diminished public order and domestic security
                      (Sb). On the other hand, it captures the effects on the
                      state: damage to the reputation of Belgium abroad (Sc) and
                      a loss of confidence in or functioning of the state and/or
                      its values (Sd).
                    </Trans>
                  </Typography>

                  <Typography
                    variant="h6"
                    paragraph
                    onClick={() =>
                      setCollapsed({ ...collapsed, sa: !collapsed.sa })
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "opacity .3s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <IconButton
                      sx={{ ml: -2 }}
                      onClick={() =>
                        setCollapsed({ ...collapsed, sa: !collapsed.sa })
                      }
                    >
                      {collapsed.sa ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Trans i18nKey="learning.impact.sa.title">
                      Sa - Supply shortfalls and unmet human needs
                    </Trans>
                  </Typography>
                  <Box sx={{ height: collapsed.sa ? "auto" : 0 }}>
                    <Grow
                      in={collapsed.sa}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <Box sx={{ mb: 8, ml: 3 }}>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sa.introduction.1">
                            This indicator measures breakdowns or severe
                            disruptions to the supply of critical goods and
                            services to the entire population or parts of it.
                            They are grouped into three sets according to their
                            importance.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sa.introduction.2">
                            Supply shortfalls are calculated by multiplying the
                            number of persons affected with the duration (in
                            days) for which their needs are not met. The
                            effective duration of the disruption for those
                            affected is added together. Additionally, a
                            distinction should be made between needs of varying
                            importance. The human need for water and food is
                            obviously more immediately important than the need
                            for postal and courier services. Physical needs are
                            to be fulfilled if the individual is to survive,
                            whereas the next categories rather ensure the
                            security and comfort needs. To model this fact, a
                            weighting factor is given to each need which should
                            be applied in the final calculations. Notice that
                            there may exist some cascading effects between unmet
                            needs, i.e. if the need for electricity is not met,
                            usually the need for telecommunication will also not
                            be met. This effect is not taken into account in the
                            weighting factor and should thus be separately
                            included in the final calculations . The weighting
                            factors are loosely based on Maslow’s hierarchy of
                            needs and similar theories.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sa.introduction.3">
                            Economic consequences are covered by the indicators
                            Fa – Asset losses and cost of coping and Fb –
                            Reduction of economic performance.
                          </Trans>
                        </Typography>

                        <TableContainer component={Paper} sx={{ mb: 6 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sa.0.title">
                                    Sa0
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sa.1.title">
                                    Sa1
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sa.2.title">
                                    Sa2
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sa.3.title">
                                    Sa3
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sa.4.title">
                                    Sa4
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sa.5.title">
                                    Sa5
                                  </Trans>
                                </TableCell>
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
                                  {t(
                                    "learning.impact.sa.2",
                                    "10 001 – 100 000"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t(
                                    "learning.impact.sa.3",
                                    "100 001 – 1 000 000"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t(
                                    "learning.impact.sa.4",
                                    "1 000 001 – 10 000 000"
                                  )}
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
                                    Unit: person days (number of people
                                    multiplied by days of unmet needs)
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
                                  <Trans i18nKey="learning.impact.sa.needs">
                                    Needs
                                  </Trans>
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
                                    Potable water, basic foodstuffs, medicine,
                                    medical emergency services, first responders
                                    communication
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sa.factor.1">
                                    1
                                  </Trans>
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
                                    Electricity, heating, non-emergency medical
                                    care, telecommunications, transport,
                                    financial services
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sa.factor.2">
                                    0.5
                                  </Trans>
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
                                    Fuel, media, waste management, government,
                                    postal and courier services
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sa.factor.3">
                                    0.1
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell colSpan={3}>
                                  <Trans i18nKey="learning.impact.sa.importance.footer">
                                    Needs weighted by degree of importance for a
                                    sustained and comfortable human life
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grow>
                  </Box>

                  <Typography
                    variant="h6"
                    paragraph
                    onClick={() =>
                      setCollapsed({ ...collapsed, sb: !collapsed.sb })
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "opacity .3s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <IconButton
                      sx={{ ml: -2 }}
                      onClick={() =>
                        setCollapsed({ ...collapsed, sb: !collapsed.sb })
                      }
                    >
                      {collapsed.sb ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Trans i18nKey="learning.impact.sb.title">
                      Sb - Diminished public order and domestic security
                    </Trans>
                  </Typography>
                  <Box sx={{ height: collapsed.sb ? "auto" : 0 }}>
                    <Grow
                      in={collapsed.sb}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <Box sx={{ mb: 8, ml: 3 }}>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sb.introduction.1">
                            This indicator measures how many people living in
                            Belgium have experienced diminished public order and
                            domestic security, and for how long. This refers to
                            adverse effects from domestic disturbances, such as
                            unrest, impinging upon or unduly restricting the
                            daily life of the general public. Such adverse
                            effects are measured in person days. The minimum
                            duration per person is one day.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sb.introduction.2">
                            Thus when a large demonstration with riots happen,
                            the calculations should not include the amount of
                            people present at the demonstration or riots (the
                            underlying reasons for the demonstrations are
                            captured by indicator Sd – Loss of confidence in or
                            functioning of the state and/or its values) but the
                            amount of people that are afraid to go outside.
                            Similarly in the aftermath of a terrorist attack on
                            a soft target it would capture the amount of people
                            with some form of PTSD (post-traumatic stress
                            disorder) who are afraid of venturing into open
                            public spaces.
                          </Trans>
                        </Typography>

                        <TableContainer component={Paper} sx={{ mb: 6 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sb.0.title">
                                    Sb0
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sb.1.title">
                                    Sb1
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sb.2.title">
                                    Sb2
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sb.3.title">
                                    Sb3
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sb.4.title">
                                    Sb4
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sb.5.title">
                                    Sb5
                                  </Trans>
                                </TableCell>
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
                                  {t(
                                    "learning.impact.sb.2",
                                    "100 001 – 1 000 000"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t(
                                    "learning.impact.sb.3",
                                    "1 000 001 – 1 000 000"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t(
                                    "learning.impact.sb.4",
                                    "10 000 001 – 100 000 000"
                                  )}
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
                                    Unit: person days (number of people
                                    multiplied by days of impact)
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grow>
                  </Box>

                  <Typography
                    variant="h6"
                    paragraph
                    onClick={() =>
                      setCollapsed({ ...collapsed, sc: !collapsed.sc })
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "opacity .3s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <IconButton
                      sx={{ ml: -2 }}
                      onClick={() =>
                        setCollapsed({ ...collapsed, sc: !collapsed.sc })
                      }
                    >
                      {collapsed.sc ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Trans i18nKey="learning.impact.sc.title">
                      Sc - Damage to the reputation of Belgium
                    </Trans>
                  </Typography>
                  <Box sx={{ height: collapsed.sc ? "auto" : 0 }}>
                    <Grow
                      in={collapsed.sc}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <Box sx={{ mb: 8, ml: 3 }}>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sc.introduction.1">
                            This indicator comprises the significance and
                            duration of a reputational loss for Belgium abroad.
                            Damage to Belgium’s reputation could, for example,
                            lead to a situation where other countries refuse to
                            enter into bilateral, multilateral and international
                            agreements with it, or where its status as a
                            business/tourism destination is severely
                            compromised.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sc.introduction.2">
                            This indicator qualitatively takes into account the
                            significance of the reputational loss and its
                            duration.
                          </Trans>
                        </Typography>

                        <TableContainer component={Paper} sx={{ mb: 6 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sc.0.title">
                                    Sc0
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sc.1.title">
                                    Sc1
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sc.2.title">
                                    Sc2
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sc.3.title">
                                    Sc3
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sc.4.title">
                                    Sc4
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sc.5.title">
                                    Sc5
                                  </Trans>
                                </TableCell>
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
                                    Unit: qualitative according to significance
                                    and duration
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>

                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sd.introduction.3">
                            The descriptions and timeframes represented in the
                            qualitative descriptions of indicator Sc and Sd
                            should not be interpreted as strong limits, but
                            rather as peak values of a distribution in time.
                            E.g. for damage class Sd2 it may be possible that
                            some critical media coverage still occurs months
                            later, but the extent and frequency should be much
                            lower than during the first few weeks. This is
                            illustrated in Figure 1.
                          </Trans>
                        </Typography>

                        <Box sx={{ textAlign: "center", sb: 2 }}>
                          <img
                            alt="Societal impact"
                            src="https://bnra.powerappsportals.com/sd.png"
                            style={{ width: 600 }}
                          />

                          <Typography variant="caption" paragraph>
                            <i>
                              <Trans i18nKey="learning.impact.sd.image">
                                Graphs showing the distribution in time of the
                                different damages classes of indicator Sd
                              </Trans>
                            </i>
                          </Typography>
                        </Box>
                      </Box>
                    </Grow>
                  </Box>

                  <Typography
                    variant="h6"
                    paragraph
                    onClick={() =>
                      setCollapsed({ ...collapsed, sd: !collapsed.sd })
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "opacity .3s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <IconButton
                      sx={{ ml: -2 }}
                      onClick={() =>
                        setCollapsed({ ...collapsed, sd: !collapsed.sd })
                      }
                    >
                      {collapsed.sd ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Trans i18nKey="learning.impact.sd.title">
                      Sd - Loss of confidence in or functioning of the state
                      and/or its values
                    </Trans>
                  </Typography>
                  <Box sx={{ height: collapsed.sd ? "auto" : 0 }}>
                    <Grow
                      in={collapsed.sd}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <Box sx={{ mb: 8, ml: 3 }}>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sd.introduction.1">
                            Indicator Sd measures the significance of a loss of
                            confidence in the state in general and its
                            institutions and the share of the population that is
                            losing confidence, as well as a loss of functioning
                            of the state. Such institutions may include the
                            executive, legislative, or legal branches of
                            government as well as state and regional
                            organisations such as public administrations, the
                            armed forces, the police as well as state and
                            semi-state bodies.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sd.introduction.2">
                            The significance of a loss of confidence is
                            described qualitatively and includes, for instance,
                            the question of whether the loss of confidence
                            extends to individual regional administrative units
                            or to the federal administration in general. It is
                            assumed that a loss of confidence is measurable by
                            the amount of public backlash.
                          </Trans>
                        </Typography>

                        <TableContainer component={Paper} sx={{ mb: 6 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sd.0.title">
                                    Sd0
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sd.1.title">
                                    Sd1
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sd.2.title">
                                    Sd2
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sd.3.title">
                                    Sd3
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sd.4.title">
                                    Sd4
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.sd.5.title">
                                    Sd5
                                  </Trans>
                                </TableCell>
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
                                    Unit: qualitative according to significance
                                    and duration
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>

                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.sd.introduction.3">
                            The descriptions and timeframes represented in the
                            qualitative descriptions of indicator Sc and Sd
                            should not be interpreted as strong limits, but
                            rather as peak values of a distribution in time.
                            E.g. for damage class Sd2 it may be possible that
                            some critical media coverage still occurs months
                            later, but the extent and frequency should be much
                            lower than during the first few weeks. This is
                            illustrated in Figure 1.
                          </Trans>
                        </Typography>

                        <Box sx={{ textAlign: "center", sb: 2 }}>
                          <img
                            alt="Societal impact"
                            src="https://bnra.powerappsportals.com/sd.png"
                            style={{ width: 600 }}
                          />

                          <Typography variant="caption" paragraph>
                            <i>
                              <Trans i18nKey="learning.impact.sd.image">
                                Graphs showing the distribution in time of the
                                different damages classes of indicator Sd
                              </Trans>
                            </i>
                          </Typography>
                        </Box>
                      </Box>
                    </Grow>
                  </Box>

                  <Typography variant="h5" paragraph sx={{ mt: 4 }}>
                    <Trans i18nKey="learning.impact.e.title">
                      Environmental Impact
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.impact.e.introduction">
                      The indicator for the damage area ‘environment’ express
                      the effects of a hazard on the environment. The main
                      effects include water pollution, ground pollution, and
                      changes to the genetic material of organisms or biological
                      diversity.
                    </Trans>
                  </Typography>

                  <Typography
                    variant="h6"
                    paragraph
                    onClick={() =>
                      setCollapsed({ ...collapsed, ea: !collapsed.ea })
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "opacity .3s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <IconButton
                      sx={{ ml: -2 }}
                      onClick={() =>
                        setCollapsed({ ...collapsed, ea: !collapsed.ea })
                      }
                    >
                      {collapsed.ea ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Trans i18nKey="learning.impact.ea.title">
                      Ea - Damaged ecosystems
                    </Trans>
                  </Typography>
                  <Box sx={{ height: collapsed.ea ? "auto" : 0 }}>
                    <Grow
                      in={collapsed.ea}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <Box sx={{ mb: 8, ml: 3 }}>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.ea.introduction.1">
                            Indicator Ea measures the size and the duration of
                            an adverse event on ecosystems (woodlands, agro
                            ecosystems, watercourses, lakes, wetlands etc.),
                            which are seriously damaged as a result and which
                            will recover very slowly, if ever. Effects may be
                            caused, for instance, through chemical or
                            radiological pollution, through biological or
                            non-biological contamination, e.g. due to alien
                            invasive species, or through physical damage, such
                            as erosion.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.ea.introduction.2">
                            Impacts are understood as damage to ecosystems
                            and/or adverse effects on ecosystem services.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.ea.introduction.3">
                            An ecosystem is damaged if, for example, the natural
                            balance is upset considerably or the soil fertility
                            is significantly compromised. For example, heavy
                            chemical pollution of surface waters is measured
                            with the indicator Ea. If the water level of a lake
                            significantly drops as a result of drought, but
                            without damaging the flora and the fauna in the
                            medium to long term, this is not considered as an
                            adverse impact on the ecosystem.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.ea.introduction.4">
                            The impairment of ecosystem services should be only
                            considered if the restriction is not covered by
                            other indicators (e.g. their use for leisure and
                            recreation). If drought leads to restrictions on the
                            supply of drinking water from surface water among
                            sections of the population, this is recorded by the
                            indicator Sa – Supply shortfalls and disruptions.
                            The economic impact of ecosystem damage is not
                            covered by the indicator Ea but by the economic
                            indicators Fa (Financial assest damages) and Fb
                            (Reduction of economic performance).
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.ea.introduction.5">
                            The unit for measuring adverse effects is the area x
                            year (km2 x year). It is calculated by multiplying
                            the affected area with the number of years that the
                            adverse effect lasts. If an area is under the
                            influence of multiple effects, it is only counted
                            once.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.ea.introduction.6">
                            The duration of the impairment is the length of time
                            during which the ecosystem persists or the
                            restrictions on its use (e.g. restrictions of
                            cultivation on agricultural land) remain in place.
                            The cycle of different stages of an ecosystem, e.g.
                            succession stages in managed forests, should be
                            taken into account. An ecosystem is regarded as
                            damaged until its condition returns to ‘normal’. For
                            instance, in the case of a forest damaged by an
                            extensive fire, the duration is the time until the
                            re-establishment of the early succession stages.
                          </Trans>
                        </Typography>

                        <TableContainer component={Paper} sx={{ mb: 6 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ea.0.title">
                                    Ea0
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ea.1.title">
                                    Ea1
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ea.2.title">
                                    Ea2
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ea.3.title">
                                    Ea3
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ea.4.title">
                                    Ea4
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.ea.5.title">
                                    Ea5
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  {t("learning.impact.ea.0", "No impact")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.ea.1", "< 10")}
                                </TableCell>
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
                                    Unit: affected area multiplied by number of
                                    years of adverse effects (km² x years)
                                  </Trans>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Grow>
                  </Box>

                  <Typography variant="h5" paragraph sx={{ mt: 4 }}>
                    <Trans i18nKey="learning.impact.f.title">
                      Financial Impact
                    </Trans>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    <Trans i18nKey="learning.impact.f.introduction">
                      Economic effects and damages are counted as financial
                      asset damages (Fa), and the reduction of economic
                      performance (Fb).
                    </Trans>
                  </Typography>

                  <Typography
                    variant="h6"
                    paragraph
                    onClick={() =>
                      setCollapsed({ ...collapsed, fa: !collapsed.fa })
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "opacity .3s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <IconButton
                      sx={{ ml: -2 }}
                      onClick={() =>
                        setCollapsed({ ...collapsed, fa: !collapsed.fa })
                      }
                    >
                      {collapsed.fa ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Trans i18nKey="learning.impact.fa.title">
                      Fa - Financial asset damages
                    </Trans>
                  </Typography>
                  <Box sx={{ height: collapsed.fa ? "auto" : 0 }}>
                    <Grow
                      in={collapsed.fa}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <Box sx={{ mb: 8, ml: 3 }}>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.fa.introduction.1">
                            Damage indicator Fa measures losses to existing
                            assets and the cost of coping.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.fa.introduction.2">
                            Assets include both tangible assets and financial
                            assets. This indicator counts all damage to assets
                            even if, for example, insurance companies or the
                            State settle the costs.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.fa.introduction.3">
                            Cost of coping includes the cost of emergency
                            services, emergency shelters, and provision of care
                            for people in need of assistance.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.fa.introduction.4">
                            The example used to illustrate this indicator is
                            flooding. Such an event causes damage to multiple
                            buildings and a factory. This runs up costs for
                            pumping out basements and removing rubble and
                            driftwood (cost of coping). The physical damage
                            leads to financial losses as the value of the
                            buildings and equipment is now diminished.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.fa.introduction.5">
                            Depending on the effects of the hazard, various
                            perspectives can be adopted regarding the financial
                            losses:
                          </Trans>
                        </Typography>
                        <ul>
                          <li>
                            <Typography variant="body1" paragraph>
                              <Trans i18nKey="learning.impact.fa.introduction.6">
                                macroeconomic: nationwide cost of coping and
                                damage to national wealth.
                              </Trans>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body1" paragraph>
                              <Trans i18nKey="learning.impact.fa.introduction.7">
                                individual or small-scale: cost of coping and
                                financial losses for individuals or within a
                                spatially limited unit.
                              </Trans>
                            </Typography>
                          </li>
                        </ul>

                        <TableContainer component={Paper} sx={{ mb: 6 }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.fa.0.title">
                                    Fa0
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.fa.1.title">
                                    Fa1
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.fa.2.title">
                                    Fa2
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.fa.3.title">
                                    Fa3
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.fa.4.title">
                                    Fa4
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "16.6%" }}>
                                  <Trans i18nKey="learning.impact.fa.5.title">
                                    Fa5
                                  </Trans>
                                </TableCell>
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
                                  {t(
                                    "learning.impact.fa.2",
                                    "50 – 500 million"
                                  )}
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
                    </Grow>
                  </Box>

                  <Typography
                    variant="h6"
                    paragraph
                    onClick={() =>
                      setCollapsed({ ...collapsed, fb: !collapsed.fb })
                    }
                    sx={{
                      cursor: "pointer",
                      transition: "opacity .3s ease",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <IconButton
                      sx={{ ml: -2 }}
                      onClick={() =>
                        setCollapsed({ ...collapsed, fb: !collapsed.fb })
                      }
                    >
                      {collapsed.fb ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </IconButton>
                    <Trans i18nKey="learning.impact.fb.title">
                      Fb - Reduction of economic performance
                    </Trans>
                  </Typography>
                  <Box sx={{ height: collapsed.fb ? "auto" : 0 }}>
                    <Grow
                      in={collapsed.fb}
                      style={{ transformOrigin: "0 0 0" }}
                    >
                      <Box sx={{ mb: 8, ml: 3 }}>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.fb.introduction.1">
                            Damage indicator Fb includes indirect economic
                            effects that reduce value creation in Belgium. While
                            Fa – Financial losses and cost of coping relates to
                            the cost of coping and damage to existing assets, Fb
                            takes into account the consequences for future value
                            creation.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.fb.introduction.2">
                            The example used to illustrate this indicator is
                            flooding (cf. example in Fa). Due to the damage
                            caused by such an event, the affected company has
                            zero output for several weeks and therefore suffers
                            a loss of income.
                          </Trans>
                        </Typography>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.fb.introduction.3">
                            Depending on the effects of the hazard, various
                            perspectives can be adopted regarding financial
                            losses:
                          </Trans>
                        </Typography>
                        <ul>
                          <li>
                            <Typography variant="body1" paragraph>
                              <Trans i18nKey="learning.impact.fb.introduction.4">
                                macroeconomic: the sum of domestic value
                                creation is used as an indicator of total
                                economic performance. It is quantified in terms
                                of Gross Domestic Product (GDP). Thus, a
                                reduction of economic performance corresponds to
                                a decline in GDP.
                              </Trans>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body1" paragraph>
                              <Trans i18nKey="learning.impact.fb.introduction.5">
                                individual or small-scale: reduction of economic
                                performance for individuals or within a
                                spatially limited unit.
                              </Trans>
                            </Typography>
                          </li>
                        </ul>
                        <Typography variant="body1" paragraph>
                          <Trans i18nKey="learning.impact.fb.introduction.6">
                            For this reason and for ease of evaluation for
                            experts without a financial background, multiple
                            equivalent interpretations of the damage classes are
                            provided.
                          </Trans>
                        </Typography>

                        <TableContainer component={Paper}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ width: "40%" }}></TableCell>
                                <TableCell sx={{ width: "10%" }}>
                                  <Trans i18nKey="learning.impact.fb.0.title">
                                    Fb0
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "10%" }}>
                                  <Trans i18nKey="learning.impact.fb.1.title">
                                    Fb1
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "10%" }}>
                                  <Trans i18nKey="learning.impact.fb.2.title">
                                    Fb2
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "10%" }}>
                                  <Trans i18nKey="learning.impact.fb.3.title">
                                    Fb3
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "10%" }}>
                                  <Trans i18nKey="learning.impact.fb.4.title">
                                    Fb4
                                  </Trans>
                                </TableCell>
                                <TableCell sx={{ width: "10%" }}>
                                  <Trans i18nKey="learning.impact.fb.5.title">
                                    Fb5
                                  </Trans>
                                </TableCell>
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
                                  {t(
                                    "learning.impact.fb.a.2",
                                    "50 - 500 million"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t(
                                    "learning.impact.fb.a.3",
                                    "0.5 - 5 billion"
                                  )}
                                </TableCell>
                                <TableCell>
                                  {t(
                                    "learning.impact.fb.a.4",
                                    "5 - 50 billion"
                                  )}
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
                                <TableCell>
                                  {t("learning.impact.fb.d.1", "2%")}
                                </TableCell>
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
                                <TableCell>
                                  {t("learning.impact.fb.f.1", "-1")}
                                </TableCell>
                                <TableCell>
                                  {t("learning.impact.fb.f.2", "-5")}
                                </TableCell>
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
                    </Grow>
                  </Box>
                </Box>
              </Box>
            </TabPanel>
          </TabContext>
        </Container>
      </Main>
    </>
  );
}
