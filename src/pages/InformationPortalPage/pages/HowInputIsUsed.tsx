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

const SplitCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
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

const FlowStep = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const FlowNumber = styled(Box)(({ theme }) => ({
  width: 28,
  height: 28,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  fontSize: "0.8rem",
  flexShrink: 0,
}));

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function HowInputIsUsedPage() {
  const { t } = useTranslation();

  usePageTitle(
    t("learning.inputused.title", "How your input shapes the results"),
  );
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.inputused.title", "How your input shapes the results"),
      url: "/learning/how-input-is-used",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.inputused.title">
            How your input shapes the results
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.inputused.intro">
            Your estimates do not sit in isolation. Every value you provide is
            combined with those of other experts, aggregated, validated, and
            ultimately fed into a set of calculations that determine the final
            probability and impact figures for each risk. This page explains
            exactly how that process works, from your individual estimate to the
            published result.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* What you are asked to estimate                                      */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.inputused.estimates.title">
            What you are asked to estimate
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.inputused.estimates.body">
            Expert input in the BNRA is structured to match your domain of
            knowledge. You are never asked to estimate things that fall outside
            your expertise. The key principle is a separation between direct and
            indirect effects:
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
                <Trans i18nKey="learning.inputused.estimates.direct.title">
                  Direct probability and impact
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.inputused.estimates.direct.body">
                  You estimate how likely your risk scenario is to occur due to
                  its own internal causes, independent of any other risk in the
                  catalogue. You also estimate the direct consequences across
                  all ten damage indicators — assuming the scenario has already
                  occurred, without counting the additional harm caused by
                  downstream cascades.
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
                <Trans i18nKey="learning.inputused.estimates.cascade.title">
                  Cascade probabilities
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.inputused.estimates.cascade.body">
                  For each cascade link that involves your risk — whether as a
                  cause or an effect — you estimate the conditional probability
                  that one scenario triggers another. You are only asked about
                  cascades where your expertise is directly relevant.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.inputused.estimates.scope.title">
              Why this separation matters
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.inputused.estimates.scope.body">
              An expert in flood hydrology can accurately estimate the direct
              probability of a major flood. They may have less knowledge about
              the probability of a power outage caused by that flood — that
              estimate belongs to the electricity network experts. By separating
              direct from indirect effects, the BNRA ensures that each estimate
              comes from the most relevant source, and that no expert is asked
              to speculate beyond their knowledge.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* From individual estimate to aggregated value                        */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.inputused.aggregation.title">
            From individual estimate to aggregated value
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.inputused.aggregation.intro">
            Multiple experts contribute estimates for the same risk scenario. No
            single expert's view determines the outcome. The process of
            combining individual estimates into a single value used in
            calculations proceeds as follows:
          </Trans>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {[
            {
              n: 1,
              titleKey: "learning.inputused.aggregation.step1.title",
              titleDefault: "Individual estimates on scale classes",
              bodyKey: "learning.inputused.aggregation.step1.body",
              bodyDefault:
                "Each expert provides a scale class estimate (e.g. P3, Ha4) for each parameter they are asked about. Scale classes are chosen rather than free numeric values because they impose a shared structure, reduce anchoring bias, and make cross-expert comparison straightforward.",
            },
            {
              n: 2,
              titleKey: "learning.inputused.aggregation.step2.title",
              titleDefault: "Conversion to numeric centers",
              bodyKey: "learning.inputused.aggregation.step2.body",
              bodyDefault:
                "Each scale class is converted to a single representative numeric value — the geometric center of the class interval. For probability classes this gives a return period in months; for impact classes it gives a monetary equivalent in euros. These numeric values are what get averaged across experts.",
            },
            {
              n: 3,
              titleKey: "learning.inputused.aggregation.step3.title",
              titleDefault: "Averaging on the numeric scale",
              bodyKey: "learning.inputused.aggregation.step3.body",
              bodyDefault:
                "The numeric center values from all contributing experts are averaged. Because the underlying scale is exponential, averaging happens on the numeric (exponential) scale rather than on the integer class index — this prevents a small number of extreme estimates from distorting the result disproportionately.",
            },
            {
              n: 4,
              titleKey: "learning.inputused.aggregation.step4.title",
              titleDefault: "Consensus validation",
              bodyKey: "learning.inputused.aggregation.step4.body",
              bodyDefault:
                "The averaged value is not automatically the final value. It is reviewed in a consensus meeting where experts discuss the estimates, their reasoning, and any significant disagreements. The final consensus value — which may differ from the raw average — is what enters the BNRA calculations.",
            },
          ].map((step) => (
            <FlowStep key={step.n}>
              <FlowNumber>{step.n}</FlowNumber>
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
            </FlowStep>
          ))}
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Uncertainty                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.inputused.uncertainty.title">
            How uncertainty in your estimate is handled
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.inputused.uncertainty.body">
            Expert estimates are inherently uncertain, and the BNRA makes no
            pretense otherwise. Rather than treating the final consensus value
            as exact, the simulation explicitly models the uncertainty around
            it. Each scale class covers a range of values — P3, for example,
            covers return periods from 50 to 500 years — and the simulation
            samples randomly within that range in every run.
          </Trans>
        </Typography>

        <AccentCard sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.inputused.uncertainty.sampling.title">
              Uncertainty sampling in the simulation
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1 }}
          >
            <Trans i18nKey="learning.inputused.uncertainty.sampling.body">
              For each simulation run, the numeric value associated with your
              consensus estimate is drawn from a normal distribution centered on
              the scale class center, with the width of the class interval as
              the 95% confidence interval (sigma = 2.55 on the linear scale
              class). This means:
            </Trans>
          </Typography>
          <FormulaBox sx={{ margin: 0 }}>
            sampled_value ~ Normal( mean = class_center, sigma = 2.55 )
          </FormulaBox>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7, mt: 1 }}
          >
            <Trans i18nKey="learning.inputused.uncertainty.sampling.effect">
              Across 20,000 simulation runs, this produces a distribution of
              outcomes that reflects the inherent imprecision of expert
              estimation. Risks where the true value is well within the center
              of a class produce tighter output distributions; risks near a
              class boundary produce wider ones.
            </Trans>
          </Typography>
        </AccentCard>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.inputused.uncertainty.spread">
            The spread of estimates across experts also matters informally: a
            risk where all experts converge on P3 is treated with more
            confidence than one where estimates range from P1 to P5. This spread
            is visible to analysts during consensus meetings and informs the
            discussion, even though it is not currently propagated formally into
            the uncertainty bands of the published results.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* From estimates to final outputs                                     */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.inputused.outputs.title">
            From your estimates to the final published results
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.inputused.outputs.body">
            The journey from your individual scale class estimate to a published
            probability or impact figure involves several computational steps,
            each of which your estimate contributes to:
          </Trans>
        </Typography>

        <Grid container spacing={2}>
          {[
            {
              titleKey: "learning.inputused.outputs.prob.title",
              titleDefault: "Total probability",
              bodyKey: "learning.inputused.outputs.prob.body",
              bodyDefault:
                "Your direct probability estimate contributes to the total probability of your risk scenario alongside all cascade contributions from other risks that may cause it. The total probability is calculated across 10,000 simulated years and expressed as a return period and three-year likelihood.",
            },
            {
              titleKey: "learning.inputused.outputs.impact.title",
              titleDefault: "Total impact",
              bodyKey: "learning.inputused.outputs.impact.body",
              bodyDefault:
                "Your damage indicator estimates determine the direct impact of your scenario. These are combined with the expected indirect impacts from cascades your scenario may trigger, to give a total impact across all ten indicators and an aggregated Total Impact score.",
            },
            {
              titleKey: "learning.inputused.outputs.cascade.title",
              titleDefault: "Cascade contributions",
              bodyKey: "learning.inputused.outputs.cascade.body",
              bodyDefault:
                "Your conditional probability estimates for cascade links shape how much of other risks' probability and impact flows through your risk. A higher CP estimate means your risk is a more significant driver of the downstream risks you are connected to.",
            },
            {
              titleKey: "learning.inputused.outputs.comparison.title",
              titleDefault: "Cross-risk comparison",
              bodyKey: "learning.inputused.outputs.comparison.body",
              bodyDefault:
                "All risks are ultimately placed on the same probability-impact grid and ranked by total risk (probability x impact). Your estimates therefore influence not just how your own risk appears, but where it sits relative to all other risks in the catalogue.",
            },
          ].map((card) => (
            <Grid key={card.titleKey} size={{ xs: 12, sm: 6 }}>
              <SplitCard>
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
      {/* Objectivity note                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.inputused.objectivity.title">
            Safeguards for objectivity
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.inputused.objectivity.body">
            The BNRA is aware that experts may have institutional interests in
            the risks they assess. Several safeguards are built into the process
            to protect the objectivity of the results:
          </Trans>
        </Typography>

        <Grid container spacing={1.5}>
          {[
            {
              titleKey: "learning.inputused.objectivity.multiple.title",
              titleDefault: "Multiple experts per risk",
              bodyKey: "learning.inputused.objectivity.multiple.body",
              bodyDefault:
                "At least several experts contribute to every risk assessment. No single expert's estimate can determine the outcome, and averaging naturally moderates outliers.",
            },
            {
              titleKey: "learning.inputused.objectivity.voluntary.title",
              titleDefault: "Voluntary participation",
              bodyKey: "learning.inputused.objectivity.voluntary.body",
              bodyDefault:
                "Participation in the BNRA is voluntary and ideally altruistic. Experts are selected for their knowledge rather than their institutional affiliation.",
            },
            {
              titleKey: "learning.inputused.objectivity.structured.title",
              titleDefault: "Structured estimation",
              bodyKey: "learning.inputused.objectivity.structured.body",
              bodyDefault:
                "The use of standardized scales and defined scenarios anchors estimates to concrete, observable quantities rather than abstract judgments — reducing the scope for motivated reasoning.",
            },
            {
              titleKey: "learning.inputused.objectivity.consensus.title",
              titleDefault: "Transparent consensus process",
              bodyKey: "learning.inputused.objectivity.consensus.body",
              bodyDefault:
                "Final values are reached through open discussion among all contributing experts. Disagreements are surfaced and reasoned through rather than silently averaged away.",
            },
          ].map((card) => (
            <Grid key={card.titleKey} size={{ xs: 12, sm: 6 }}>
              <SplitCard>
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
          to="/learning/participation-process"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.inputused.prev">
            Previous: The participation process
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/consensus-validation"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.inputused.next">
            Next: Consensus and validation
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
