import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
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

const AccentCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: 4,
  padding: theme.spacing(2.5, 3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const FormulaBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 2),
  fontFamily: "monospace",
  fontSize: "0.85rem",
  color: theme.palette.text.primary,
  margin: theme.spacing(1.5, 0),
  overflowX: "auto",
}));

const SplitCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const SimCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const StepCard = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const StepNumber = styled(Box)(() => ({
  width: 28,
  height: 28,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  fontSize: "0.8rem",
  flexShrink: 0,
  color: "#fff",
}));

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function MonteCarloSimulationPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.montecarlo.title", "Monte Carlo simulation"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.montecarlo.title", "Monte Carlo simulation"),
      url: "/learning/monte-carlo-simulation",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.montecarlo.title">
            Monte Carlo simulation
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.montecarlo.intro">
            The previous page established why cascade probabilities cannot be
            solved analytically: total probabilities are mutually dependent
            across the entire catalogue, and cycles are possible. The BNRA
            resolves this using Monte Carlo simulation: rather than computing
            exact answers, it runs large numbers of randomised trials and
            derives statistics from the aggregate results. Two separate
            simulations are used, each designed to answer a different question.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Two simulations overview                                            */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.montecarlo.two.title">
            Two simulations, two purposes
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.montecarlo.two.body">
            Impact and probability are computed by separate simulations. This
            separation exists because the two quantities require fundamentally
            different sampling strategies: estimating impact benefits from
            conditioning on a specific root scenario occurring, while estimating
            probability requires modelling all risks competing to occur
            naturally over time.
          </Trans>
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SimCard>
              <Box
                sx={{
                  display: "inline-block",
                  px: 1,
                  py: 0.25,
                  mb: 1.5,
                  backgroundColor: "#EAF3FB",
                  border: "1px solid #9DC3E6",
                  borderRadius: 1,
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "#185FA5",
                }}
              >
                {t("learning.montecarlo.two.sim1.tag", "Simulation 1")}
              </Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.montecarlo.two.sim1.title">
                  Impact simulation
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1 }}
              >
                <Trans i18nKey="learning.montecarlo.two.sim1.body">
                  Each run assumes the root scenario has already occurred, then
                  propagates cascades randomly through the network. Across
                  approximately 20,000 runs, this produces a distribution of
                  total impact outcomes from which mean values and relative
                  contributions are derived.
                </Trans>
              </Typography>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                {t(
                  "learning.montecarlo.two.sim1.scale",
                  "~20,000 runs per root scenario",
                )}
              </Typography>
            </SimCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <SimCard>
              <Box
                sx={{
                  display: "inline-block",
                  px: 1,
                  py: 0.25,
                  mb: 1.5,
                  backgroundColor: "#EEF7E8",
                  border: "1px solid #A9D18E",
                  borderRadius: 1,
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  color: "#3B6D11",
                }}
              >
                {t("learning.montecarlo.two.sim2.tag", "Simulation 2")}
              </Box>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.montecarlo.two.sim2.title">
                  Probability simulation
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1 }}
              >
                <Trans i18nKey="learning.montecarlo.two.sim2.body">
                  A long-running timeline simulation spanning approximately
                  10,000 simulated years. Each day in the simulation, risks
                  compete to occur naturally based on their direct
                  probabilities. When a risk fires, its cascades are propagated.
                  The frequency with which each scenario appears across all
                  years is used to estimate total probabilities.
                </Trans>
              </Typography>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                {t(
                  "learning.montecarlo.two.sim2.scale",
                  "~10,000 simulated years",
                )}
              </Typography>
            </SimCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Impact simulation                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.montecarlo.impact.title">
            Impact simulation: what happens in a single run
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.montecarlo.impact.intro">
            Each run of the impact simulation starts from a fixed root scenario
            and proceeds as follows:
          </Trans>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {[
            {
              n: 1,
              color: "#9DC3E6",
              titleKey: "learning.montecarlo.impact.step1.title",
              titleDefault: "Fire the root scenario",
              bodyKey: "learning.montecarlo.impact.step1.body",
              bodyDefault:
                "The root scenario is marked as having occurred. For each of its ten damage indicators, the expert's scale class estimate x is used to draw an observed impact value from a normal distribution: y ~ N(x, 2.55). This sampled scale value is then converted to a monetary Fa-equivalent using the exponential formula, giving the direct impact of the root for this run.",
            },
            {
              n: 2,
              color: "#9DC3E6",
              titleKey: "learning.montecarlo.impact.step2.title",
              titleDefault: "Propagate cascades",
              bodyKey: "learning.montecarlo.impact.step2.body",
              bodyDefault:
                "For each outgoing cascade link from the fired scenario, the two-step activation process is applied: P_any is computed from the relevant CP row, a random draw decides whether the cascade activates, and if so, one effect scenario is selected by weighted random draw. Each newly fired scenario records its own sampled direct impact values.",
            },
            {
              n: 3,
              color: "#9DC3E6",
              titleKey: "learning.montecarlo.impact.step3.title",
              titleDefault: "Recurse until termination",
              bodyKey: "learning.montecarlo.impact.step3.body",
              bodyDefault:
                "Step 2 is repeated for each newly fired scenario, following the cascade tree outward. Scenarios that have already fired in this run are skipped to prevent loops. The run ends when no further cascades activate.",
            },
            {
              n: 4,
              color: "#9DC3E6",
              titleKey: "learning.montecarlo.impact.step4.title",
              titleDefault: "Sum impacts",
              bodyKey: "learning.montecarlo.impact.step4.body",
              bodyDefault:
                "The direct impact values of all fired scenarios are summed per indicator, producing a total impact vector for the run. This vector represents one possible realisation of the total harm caused by the root scenario.",
            },
          ].map((step) => (
            <StepCard key={step.n}>
              <StepNumber sx={{ backgroundColor: step.color }}>
                {step.n}
              </StepNumber>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 500, mb: 0.5 }}
                >
                  {t(step.titleKey, step.titleDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {t(step.bodyKey, step.bodyDefault)}
                </Typography>
              </Box>
            </StepCard>
          ))}
        </Box>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.montecarlo.impact.aggregation.title">
              Aggregating across runs
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.montecarlo.impact.aggregation.body">
              After all runs are complete, the mean total impact per indicator
              is computed across all runs. Mean values are used rather than
              medians because median aggregation leads to inconsistencies when
              computing the relative contributions of cascading effects. The
              spread of results across runs also gives a standard deviation per
              indicator, reflecting the combined uncertainty from expert
              estimates and cascade activation variability.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Probability simulation                                              */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.montecarlo.prob.title">
            Probability simulation: a timeline of 10,000 years
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.montecarlo.prob.intro">
            The probability simulation models a long synthetic timeline, year by
            year and day by day, allowing every risk in the catalogue to occur
            naturally according to its direct probability. Each simulated year
            proceeds as follows:
          </Trans>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {[
            {
              n: 1,
              color: "#A9D18E",
              titleKey: "learning.montecarlo.prob.step1.title",
              titleDefault: "Simulate 365 days",
              bodyKey: "learning.montecarlo.prob.step1.body",
              bodyDefault:
                "For each day of the simulated year, and for each risk in the catalogue, a uniform random draw is compared against the daily probability of any scenario occurring (derived from the Poisson formula). If the threshold is crossed, a scenario is selected from the risk's three options, weighted by their normalised direct probabilities.",
            },
            {
              n: 2,
              color: "#A9D18E",
              titleKey: "learning.montecarlo.prob.step2.title",
              titleDefault: "Propagate cascades from each occurrence",
              bodyKey: "learning.montecarlo.prob.step2.body",
              bodyDefault:
                "Each scenario that fires during the day triggers the same cascade propagation logic as the impact simulation: cascades activate probabilistically and recurse until the chain terminates. All scenarios that appear — whether as direct occurrences or cascade effects — are recorded in an event graph for that day.",
            },
            {
              n: 3,
              color: "#A9D18E",
              titleKey: "learning.montecarlo.prob.step3.title",
              titleDefault: "Record yearly occurrence counts",
              bodyKey: "learning.montecarlo.prob.step3.body",
              bodyDefault:
                "At the end of each simulated year, the number of times each scenario appeared — across all days and all cascade chains — is recorded. This count is the raw material for estimating event rates and probabilities.",
            },
          ].map((step) => (
            <StepCard key={step.n}>
              <StepNumber sx={{ backgroundColor: step.color }}>
                {step.n}
              </StepNumber>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 500, mb: 0.5 }}
                >
                  {t(step.titleKey, step.titleDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {t(step.bodyKey, step.bodyDefault)}
                </Typography>
              </Box>
            </StepCard>
          ))}
        </Box>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.montecarlo.prob.aggregation.title">
              From event counts to probabilities
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1 }}
          >
            <Trans i18nKey="learning.montecarlo.prob.aggregation.body">
              The mean yearly occurrence count for each scenario across all
              10,000 simulated years gives an estimate of the expected event
              rate. Under a Poisson assumption, this rate can be converted to a
              yearly probability of exceedance — the probability of at least one
              occurrence in a given year — and from there to a return period and
              a three-year likelihood:
            </Trans>
          </Typography>
          <FormulaBox>
            P(at least one event per year) = 1 - exp(-expected yearly rate)
          </FormulaBox>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.montecarlo.prob.aggregation.causes">
              The simulation also tracks the causal structure of each event:
              which scenarios were triggered directly versus as cascade effects,
              and which root scenario initiated each cascade chain. This allows
              the relative contributions of direct probability and each root
              cause to the total probability of a scenario to be estimated from
              the same simulation data.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* What the simulations produce                                        */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.montecarlo.output.title">
            What the simulations produce
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.montecarlo.output.body">
            Each simulation produces a large collection of sampled cascade
            networks — thousands of possible realisations of how risks unfold,
            each slightly different due to random cascade activation and random
            impact sampling. These raw samples are the foundation for all
            statistical outputs. From them, the following quantities can be
            derived:
          </Trans>
        </Typography>

        <Grid container spacing={2}>
          {[
            {
              titleKey: "learning.montecarlo.output.prob.title",
              titleDefault: "Total probability and return period",
              bodyKey: "learning.montecarlo.output.prob.body",
              bodyDefault:
                "The overall likelihood of each scenario occurring, expressed as a return period or three-year likelihood, incorporating both direct occurrence and all cascade contributions.",
              sim: "Simulation 2",
              simColor: "#EEF7E8",
              simBorder: "#A9D18E",
              simText: "#3B6D11",
            },
            {
              titleKey: "learning.montecarlo.output.impact.title",
              titleDefault: "Mean total impact per indicator",
              bodyKey: "learning.montecarlo.output.impact.body",
              bodyDefault:
                "The average total harm per damage indicator across all runs, combining direct impact and the expected impact of cascades triggered by the root scenario.",
              sim: "Simulation 1",
              simColor: "#EAF3FB",
              simBorder: "#9DC3E6",
              simText: "#185FA5",
            },
            {
              titleKey: "learning.montecarlo.output.causes.title",
              titleDefault: "Relative contribution of causes",
              bodyKey: "learning.montecarlo.output.causes.body",
              bodyDefault:
                "For each scenario, the share of its total probability attributable to its direct probability versus each cascade cause, showing which risks drive its occurrence most strongly.",
              sim: "Simulation 2",
              simColor: "#EEF7E8",
              simBorder: "#A9D18E",
              simText: "#3B6D11",
            },
            {
              titleKey: "learning.montecarlo.output.effects.title",
              titleDefault: "Relative contribution of effects",
              bodyKey: "learning.montecarlo.output.effects.body",
              bodyDefault:
                "For each scenario, the share of its total mean impact attributable to its own direct impact versus each downstream cascade, showing how much of the harm flows through other risks.",
              sim: "Simulation 1",
              simColor: "#EAF3FB",
              simBorder: "#9DC3E6",
              simText: "#185FA5",
            },
          ].map((card) => (
            <Grid key={card.titleKey} size={{ xs: 12, sm: 6 }}>
              <SplitCard>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1,
                    py: 0.25,
                    mb: 1,
                    backgroundColor: card.simColor,
                    border: `1px solid ${card.simBorder}`,
                    borderRadius: 1,
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    color: card.simText,
                  }}
                >
                  {card.sim}
                </Box>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 500 }}
                >
                  {t(card.titleKey, card.titleDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {t(card.bodyKey, card.bodyDefault)}
                </Typography>
              </SplitCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Limitations                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.montecarlo.limitations.title">
            Limitations and modelling choices
          </Trans>
        </SectionTitle>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {[
            {
              titleKey: "learning.montecarlo.limitations.independence.title",
              titleDefault: "Independent root scenarios",
              bodyKey: "learning.montecarlo.limitations.independence.body",
              bodyDefault:
                "In the probability simulation, all risks are treated as independent sources. Cases where two root events co-occur and jointly amplify a cascade are not explicitly modelled — each event graph is constructed independently.",
            },
            {
              titleKey: "learning.montecarlo.limitations.correlations.title",
              titleDefault: "No common-cause correlations",
              bodyKey: "learning.montecarlo.limitations.correlations.body",
              bodyDefault:
                "Only dependencies explicitly represented as cascade links are modelled. Correlations between non-linked risks that tend to co-occur — for example, multiple risks aggravated simultaneously by extreme weather — are not captured.",
            },
            {
              titleKey: "learning.montecarlo.limitations.ci.title",
              titleDefault: "No confidence intervals currently reported",
              bodyKey: "learning.montecarlo.limitations.ci.body",
              bodyDefault:
                "The simulations produce full distributions of outcomes, including standard deviations per indicator. Current reporting focuses on mean values for impact and point estimates for probability. Formal confidence intervals are a planned future addition.",
            },
            {
              titleKey: "learning.montecarlo.limitations.directimpact.title",
              titleDefault: "Direct impacts assumed mutually exclusive",
              bodyKey: "learning.montecarlo.limitations.directimpact.body",
              bodyDefault:
                "When multiple scenarios fire in the same run, their direct impacts are summed without any overlap correction. Experts are instructed to make their direct impact estimates mutually exclusive to avoid double-counting, but no additional cap or diminishing-return rule is applied in the calculation.",
            },
          ].map((item) => (
            <AccentCard key={item.titleKey}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                {t(item.titleKey, item.titleDefault)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                {t(item.bodyKey, item.bodyDefault)}
              </Typography>
            </AccentCard>
          ))}
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Prev / Next navigation                                              */}
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
          to="/learning/cascade-probabilities"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.montecarlo.prev">
            Previous: Cascade probabilities
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/aggregation-reporting"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.montecarlo.next">
            Next: Aggregation and reporting
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
