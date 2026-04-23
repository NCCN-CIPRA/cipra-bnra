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
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
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

const DimensionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const ScenarioCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: "none",
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  height: "100%",
}));

const RiskTypeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const CascadeCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: 4,
  padding: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SCENARIOS = [
  {
    level: "considerable",
    labelKey: "learning.risk.scenarios.considerable.label",
    labelDefault: "Considerable",
    descKey: "learning.risk.scenarios.considerable.desc",
    descDefault:
      "A significant but manageable event. Impacts are real and require a coordinated response, but remain within the capacity of existing services.",
    color: "#9DC3E620",
  },
  {
    level: "major",
    labelKey: "learning.risk.scenarios.major.label",
    labelDefault: "Major",
    descKey: "learning.risk.scenarios.major.desc",
    descDefault:
      "A serious event that stretches response capacity and causes substantial harm across multiple sectors or regions.",
    color: "#FFE69920",
  },
  {
    level: "extreme",
    labelKey: "learning.risk.scenarios.extreme.label",
    labelDefault: "Extreme",
    descKey: "learning.risk.scenarios.extreme.desc",
    descDefault:
      "A catastrophic event with severe, potentially long-lasting consequences that overwhelm normal response capacity and may affect the functioning of the state.",
    color: "#F47C7C20",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function WhatIsARiskPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.risk.title", "What is a risk?"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.risk.title", "What is a risk?"),
      url: "/learning/what-is-a-risk",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.whatisarisk.title">What is a risk?</Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.risk.intro">
            At its core, a risk is the possibility that something harmful
            happens. In the context of the BNRA, risks are national-scale events
            or phenomena that could cause significant harm to people, society,
            the environment, or the economy in Belgium. Understanding a risk
            means understanding both how likely it is to occur and how severe
            its consequences could be.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Two dimensions                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.risk.definition.title">
            The two dimensions of a risk
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.risk.definition.intro">
            Every risk in the BNRA is characterised by two fundamental
            dimensions. Neither alone tells the full story: a very likely event
            with negligible consequences is not the same concern as a rare but
            catastrophic one.
          </Trans>
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <DimensionCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.risk.definition.probability.title">
                  Probability
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.7 }}
              >
                <Trans i18nKey="learning.risk.definition.probability.body">
                  How likely is this event to occur? In the BNRA, probability is
                  expressed as a return period, the average time between
                  occurrences, or equivalently as the likelihood of at least one
                  occurrence within a three-year window. Estimates are provided
                  by domain experts and, where available, grounded in historical
                  data.
                </Trans>
              </Typography>
            </DimensionCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <DimensionCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.risk.definition.impact.title">
                  Impact
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.7 }}
              >
                <Trans i18nKey="learning.risk.definition.impact.body">
                  How severe would the consequences be? Impact is measured
                  across ten indicators covering harm to people, disruption to
                  society, damage to the environment, and financial losses.
                  Together, these indicators give a comprehensive picture of
                  what a risk scenario would actually mean for Belgium.
                </Trans>
              </Typography>
            </DimensionCard>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.risk.definition.totalrisk.body">
              Combining these two dimensions gives the <b>total risk</b>,
              expressed as probability multiplied by impact. What this actually
              represents is an expected annualised impact: the average harm that
              can be attributed to a given risk per year, accounting for both
              how severe it would be and how often it is likely to occur. This
              single value allows different risks to be compared on a common,
              objective basis, regardless of whether one risk is frequent but
              mild and another is rare but catastrophic.
            </Trans>
          </Typography>
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Scenarios                                                           */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.risk.scenarios.title">
            Every risk is assessed in three scenarios
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.risk.scenarios.intro">
            Rather than describing a risk as a single vague event, the BNRA
            defines three concrete scenarios for each risk, ordered by severity.
            Each scenario is described using risk-specific parameters. For
            example, a flood scenario is defined by water height, duration, and
            spatial extent. This makes the assessment precise, comparable, and
            directly useful for planning.
          </Trans>
        </Typography>

        <Grid container spacing={1.5}>
          {SCENARIOS.map((scenario) => (
            <Grid key={scenario.level} size={{ xs: 12, sm: 4 }}>
              <ScenarioCard sx={{ backgroundColor: scenario.color }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 500, mb: 1, color: "rgba(0,0,0,0.75)" }}
                >
                  {t(scenario.labelKey, scenario.labelDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(0,0,0,0.65)", lineHeight: 1.6 }}
                >
                  {t(scenario.descKey, scenario.descDefault)}
                </Typography>
              </ScenarioCard>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="caption"
          sx={{ color: "text.disabled", display: "block", mt: 1.5 }}
        >
          <Trans i18nKey="learning.risk.scenarios.note">
            Scenarios are ordered strictly by impact severity. Considerable
            scenarios correspond to significant but manageable national events,
            while extreme scenarios represent catastrophic events with
            potentially irreversible consequences.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Three types of risk                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.risk.types.title">Three types of risk</Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.risk.types.intro">
            The BNRA distinguishes between three types of risk, each assessed
            differently based on the nature of the event and the information
            available.
          </Trans>
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <RiskTypeCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.risk.types.standard.title">
                  Standard risks
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
              >
                <Trans i18nKey="learning.risk.types.standard.body">
                  Natural hazards, health risks, technological incidents, and
                  societal or economic disruptions. These risks are assessed
                  fully quantitatively: both their probability and their impact
                  are estimated numerically by domain experts.
                </Trans>
              </Typography>
              <Chip
                size="small"
                label={t("learning.risk.types.standard.count", "106 risks")}
                sx={{
                  backgroundColor: "#E1F5EE",
                  color: "#0F6E56",
                  fontWeight: 500,
                }}
              />
            </RiskTypeCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <RiskTypeCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.risk.types.malicious.title">
                  Malicious actor risks
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
              >
                <Trans i18nKey="learning.risk.types.malicious.body">
                  Deliberate attacks carried out by organised groups such as
                  state actors, organised crime, or extremist groups. Their
                  likelihood is expressed as the probability that an actor
                  successfully carries out an attack within the three-year
                  window, based on intent and capability.
                </Trans>
              </Typography>
              <Chip
                size="small"
                label={t(
                  "learning.risk.types.malicious.count",
                  "5 actor groups",
                )}
                sx={{
                  backgroundColor: "#FAEEDA",
                  color: "#854F0B",
                  fontWeight: 500,
                }}
              />
            </RiskTypeCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <RiskTypeCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.risk.types.emerging.title">
                  Emerging risks
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
              >
                <Trans i18nKey="learning.risk.types.emerging.body">
                  Risks arising from new or rapidly evolving developments where
                  limited data makes full quantitative assessment impractical.
                  These are assessed qualitatively, focusing on how they may
                  evolve and how they could affect other risks in the future.
                  Climate change is a notable exception: its effect on the
                  probability of other risks is estimated quantitatively over a
                  50-year horizon.
                </Trans>
              </Typography>
              <Chip
                size="small"
                label={t("learning.risk.types.emerging.count", "12 risks")}
                sx={{
                  backgroundColor: "#F1EFE8",
                  color: "#5F5E5A",
                  fontWeight: 500,
                }}
              />
            </RiskTypeCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Risk cascades teaser                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.risk.cascades.title">
            Risks do not happen in isolation
          </Trans>
        </SectionTitle>

        <CascadeCard>
          <Box sx={{ fontSize: 24, lineHeight: 1, flexShrink: 0, mt: 0.25 }}>
            ⛓
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1 }}
            >
              <Trans i18nKey="learning.risk.cascades.body">
                One event can trigger another. A prolonged drought can lead to
                wildfires, which in turn may disrupt electricity infrastructure,
                which can cascade further into supply shortages or public health
                impacts. The BNRA explicitly models these
                <strong> risk cascades</strong>, estimating the conditional
                probability that one scenario causes another and giving a more
                realistic picture of how risks unfold in practice.
              </Trans>
            </Typography>
            <Button
              component={RouterLink}
              to="/learning/risk-cascades"
              endIcon={<ChevronRightIcon />}
              size="small"
              variant="outlined"
            >
              <Trans i18nKey="learning.risk.cascades.link">
                Learn more about risk cascades
              </Trans>
            </Button>
          </Box>
        </CascadeCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Prev / Next navigation                                              */}
      {/* ------------------------------------------------------------------ */}
      <Box
        sx={{
          mt: 6,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          component={RouterLink}
          to="/learning/what-is-the-bnra"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.risk.prev">
            Previous: What is the BNRA?
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/how-do-we-measure-impact"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.risk.next">
            Next: How do we measure impact?
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
