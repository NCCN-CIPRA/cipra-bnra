import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AodIcon from "@mui/icons-material/Aod";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import AssessmentIcon from "@mui/icons-material/Assessment";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { Trans, useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import usePageTitle from "../../../hooks/usePageTitle";

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const AccentCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: 4,
  padding: theme.spacing(2.5, 3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const SplitCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const TabCard = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const TabIconBox = styled(Box)(() => ({
  width: 36,
  height: 36,
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SCENARIO_COLORS = {
  considerable: "#9DC3E6",
  major: "#FFE699",
  extreme: "#F47C7C",
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function BNRAApplicationPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.application.title", "Using the BNRA application"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.application.title", "Using the BNRA application"),
      url: "/learning/bnra-application",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.application.title">
            Using the BNRA application
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.application.intro">
            The BNRA portal is the central tool for accessing risk files,
            reviewing results, and contributing expert input. This page provides
            a guided overview of the main sections of the platform that are
            accessible to participating experts.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Built-in tutorials                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.application.tutorials.title">
              Built-in tutorials
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.application.tutorials.body">
              Most pages in the BNRA portal include a built-in interactive
              tutorial that walks you through the page step by step. Look for
              the help button on each page to launch the tutorial. The tutorials
              are the most up-to-date guide to each specific page and are
              updated alongside the application itself. This page provides a
              higher-level orientation — the tutorials provide the detail.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Navigation overview                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.application.navigation.title">
            Finding your way around a risk file
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.application.navigation.body">
            Each risk in the catalogue has a dedicated risk file page,
            accessible from the risk catalogue. Once inside a risk file, a
            bottom navigation bar at the bottom of the screen lets you move
            between the different sections. The tabs available to you depend on
            your access level — participating experts with verified access can
            see the following tabs:
          </Trans>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {[
            {
              icon: <AodIcon fontSize="small" />,
              bg: "#EAF3FB",
              labelKey: "learning.application.navigation.summary.label",
              labelDefault: "Summary",
              bodyKey: "learning.application.navigation.summary.body",
              bodyDefault:
                "A concise, high-level overview of the risk file. Shows a summary of the risk description and analysis, alongside a visual of the quantitative results for the most relevant scenario.",
            },
            {
              icon: <FingerprintIcon fontSize="small" />,
              bg: "#EEF7E8",
              labelKey: "learning.application.navigation.description.label",
              labelDefault: "Risk Identification",
              bodyKey: "learning.application.navigation.description.body",
              bodyDefault:
                "The full risk definition, intensity parameters, scenario descriptions, and historical events. The content and structure of this page varies depending on whether the risk is a standard risk, a malicious actor risk, or an emerging risk.",
            },
            {
              icon: <AssessmentIcon fontSize="small" />,
              bg: "#FEFAE6",
              labelKey: "learning.application.navigation.analysis.label",
              labelDefault: "Risk Analysis",
              bodyKey: "learning.application.navigation.analysis.body",
              bodyDefault:
                "The full quantitative and qualitative results of the risk analysis, including the butterfly (Sankey) diagram, the most relevant scenario description, and the probability and impact assessments. This is the richest section of the risk file.",
            },
            {
              icon: <QueryStatsIcon fontSize="small" />,
              bg: "#F3EDFB",
              labelKey: "learning.application.navigation.evolution.label",
              labelDefault: "Risk Evolution",
              bodyKey: "learning.application.navigation.evolution.body",
              bodyDefault:
                "Shows how the risk may evolve under the influence of climate change and other emerging risks. Includes a chart comparing probabilities in 2023 versus 2050, and a list of catalysing effects from other emerging risks. Not available for emerging risk types.",
            },
            {
              icon: <PsychologyIcon fontSize="small" />,
              bg: "#FDEAEA",
              labelKey: "learning.application.navigation.data.label",
              labelDefault: "Raw Data",
              bodyKey: "learning.application.navigation.data.body",
              bodyDefault:
                "The underlying quantitative data for all three scenarios and all cascade links. Shows the full cause and effect cascade network as either a matrix or a Sankey diagram, with the expert estimates that produced the results.",
            },
          ].map((tab) => (
            <TabCard key={tab.labelKey}>
              <TabIconBox sx={{ backgroundColor: tab.bg }}>
                {tab.icon}
              </TabIconBox>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 500, mb: 0.5 }}
                >
                  {t(tab.labelKey, tab.labelDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {t(tab.bodyKey, tab.bodyDefault)}
                </Typography>
              </Box>
            </TabCard>
          ))}
        </Box>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.application.analysis.scenarios.title">
              Scenario colour coding
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
          >
            <Trans i18nKey="learning.application.analysis.scenarios.body">
              Throughout the platform, the three scenarios are consistently
              colour-coded:
            </Trans>
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {Object.entries(SCENARIO_COLORS).map(([scenario, color]) => (
              <Chip
                key={scenario}
                label={scenario.charAt(0).toUpperCase() + scenario.slice(1)}
                size="small"
                sx={{
                  backgroundColor: color,
                  color: "rgba(0,0,0,0.7)",
                  fontWeight: 500,
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              />
            ))}
          </Box>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Summary page                                                        */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.application.summary.title">
            The Summary page
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.application.summary.body">
            The Summary page is the entry point for each risk file. On the left
            it shows processed and summarised versions of the Risk
            Identification and Risk Analysis content. On the right it shows the
            quantitative results for the most relevant scenario in a compact
            visual format: a single probability bar and four impact gauges, one
            per impact domain, each on a logarithmic scale from 0 to 5.
          </Trans>
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.application.summary.charts.title">
                  Reading the summary charts
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.application.summary.charts.body">
                  All values are on a logarithmic scale from 1 to 5, where each
                  number corresponds to a qualitative level: Very Low, Low,
                  Medium, High, and Very High. A probability of 3 represents a
                  return period of roughly 50 to 500 years; an impact of 3
                  represents moderate national-scale harm.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.application.summary.mrs.title">
                  Most relevant scenario
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.application.summary.mrs.body">
                  The summary always shows the most relevant scenario (MRS): the
                  scenario with the highest total risk, calculated as
                  probability multiplied by impact. You can explore the other
                  scenarios in more detail on the Risk Analysis tab.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Risk analysis page                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.application.analysis.title">
            The Risk Analysis page
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.application.analysis.body">
            The Risk Analysis page contains the full results of the quantitative
            and qualitative assessment. It is the most detailed section of any
            risk file, and the one most relevant to understanding what the BNRA
            actually found.
          </Trans>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {[
            {
              titleKey: "learning.application.analysis.sankey.title",
              titleDefault: "Butterfly (Sankey) diagram",
              bodyKey: "learning.application.analysis.sankey.body",
              bodyDefault:
                "A two-sided Sankey diagram showing probability causes on the left and impact effects on the right. The scenario can be changed using the buttons between the two sides of the diagram — this updates the quantitative data shown in the Sankey. Note that the qualitative analysis below the diagram always refers to the most relevant scenario only and does not update when you switch scenarios.",
            },
            {
              titleKey: "learning.application.analysis.mrs.title",
              titleDefault: "Most relevant scenario",
              bodyKey: "learning.application.analysis.mrs.body",
              bodyDefault:
                "A structured description of the most relevant scenario in terms of its intensity parameters. This is the scenario against which the qualitative analysis below was written.",
            },
            {
              titleKey: "learning.application.analysis.probability.title",
              titleDefault: "Probability assessment",
              bodyKey: "learning.application.analysis.probability.body",
              bodyDefault:
                "A qualitative explanation of the probability estimate, including the key causes identified by experts. The probability score on a 0 to 7 scale, the estimated annual likelihood, and the equivalent return period are shown at the top of this section.",
            },
            {
              titleKey: "learning.application.analysis.impact.title",
              titleDefault: "Impact assessment",
              bodyKey: "learning.application.analysis.impact.body",
              bodyDefault:
                "Qualitative explanations for each of the four impact domains — human, societal, environmental, and financial. Each section describes both the direct impact and the most significant cascade contributions to that domain.",
            },
          ].map((item) => (
            <TabCard key={item.titleKey}>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 500, mb: 0.5 }}
                >
                  {t(item.titleKey, item.titleDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {t(item.bodyKey, item.bodyDefault)}
                </Typography>
              </Box>
            </TabCard>
          ))}
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Risk evolution page                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.application.evolution.title">
            The Risk Evolution page
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.application.evolution.body">
            The Risk Evolution page shows how a risk may change in the future
            under the influence of climate change and other emerging risks. It
            is only available for standard risks, not for emerging or malicious
            actor risk types.
          </Trans>
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.application.evolution.chart.title">
                  Climate change chart
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.application.evolution.chart.body">
                  Shows total, direct, and indirect probability for all three
                  scenarios in 2023 and 2050. Increases are shown in red,
                  decreases in green. Hovering over any element shows the exact
                  values and the percentage change. The chart uses the SSP5-8.5
                  or RCP5-8.5 climate pathway as its basis.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.application.evolution.direct.title">
                  Direct vs. indirect influence
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.application.evolution.direct.body">
                  Some risks are directly influenced by climate change — their
                  own probability changes. Others are only indirectly
                  influenced, for example because a risk that often causes them
                  becomes more frequent. The chart and qualitative section both
                  distinguish between these two mechanisms.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.application.evolution.catalyzing">
            Below the climate change chart, a list of other emerging risks that
            may have a catalysing effect on this risk is provided. Clicking on
            any of these links to the corresponding emerging risk file for more
            information on how and when that effect may materialise.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Raw data page                                                       */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.application.data.title">
            The Raw Data page
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.application.data.body">
            The Raw Data page shows the full set of expert estimates underlying
            the results — the direct probability and impact estimates for each
            scenario, and the conditional probability estimates for every
            cascade link involving this risk. This is the most technical section
            of the risk file, designed for readers who want to understand not
            just the results but the inputs that produced them.
          </Trans>
        </Typography>

        <AccentCard sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.application.data.access.title">
              Access requirement
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.application.data.access.body">
              The Raw Data page is only accessible to experts who have actively
              contributed input to one or more risk files. If you have
              participated in a sprint and submitted estimates through the
              portal, this tab will be visible to you on the risk files you
              contributed to.
            </Trans>
          </Typography>
        </AccentCard>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.application.data.cascades.title">
                  Causes and effects
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.application.data.cascades.body">
                  The cascade links are shown in two groups: risks that may
                  cause this one (upstream causes), and risks that this one may
                  trigger (downstream effects). Each link shows the conditional
                  probability estimates for all nine scenario combinations.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.application.data.view.title">
                  Matrix and Sankey views
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.application.data.view.body">
                  Cascade data can be displayed either as a matrix — showing the
                  3x3 conditional probability grid for each link — or as a
                  Sankey diagram showing the relative weight of each cause or
                  effect. Switch between views using the toggle on the page.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Navigation                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Box
        sx={{
          mt: 2,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          component={RouterLink}
          to="/learning/consensus-validation"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.application.prev">
            Previous: Consensus and validation
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning"
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.application.portal">
            Back to information portal
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
