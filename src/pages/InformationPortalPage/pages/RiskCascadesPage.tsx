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

const ExampleBox = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: 4,
  padding: theme.spacing(2.5, 3),
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: 24,
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

const CascadeBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}));

const CascadeNode = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.75, 1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  fontSize: "0.8rem",
  fontWeight: 500,
  color: theme.palette.text.primary,
  whiteSpace: "nowrap",
}));

const CascadeArrow = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: "1.1rem",
  lineHeight: 1,
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
}));

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function RiskCascadesPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.cascades.title", "Risk cascades"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.cascades.title", "Risk cascades"),
      url: "/learning/risk-cascades",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.cascades.title">Risk cascades</Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.cascades.intro">
            Risks rarely occur in isolation. A major flood may damage electrical
            infrastructure, triggering a power outage. That outage may then
            disrupt telecommunications, which in turn affects emergency
            coordination. The BNRA explicitly models these chains of
            consequences, known as risk cascades, to give a more realistic
            picture of how risks unfold and interact in practice.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* What is a cascade                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.cascades.what.title">
            What is a risk cascade?
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2.5 }}
        >
          <Trans i18nKey="learning.cascades.what.body">
            A risk cascade is a directed link between two risks in the
            catalogue: if risk A occurs, it has some probability of causing or
            triggering risk B. This link is characterised by a conditional
            probability: the likelihood that B occurs given that A has already
            happened. A single risk can be both a cause and an effect, meaning
            cascades can form long chains or even loops.
          </Trans>
        </Typography>

        <ExampleBox>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
              display: "block",
              mb: 1.5,
            }}
          >
            {t("learning.cascades.what.example", "Example cascade chain")}
          </Typography>
          <CascadeBox>
            <CascadeNode
              sx={{ borderColor: "#9DC3E6", backgroundColor: "#EAF3FB" }}
            >
              Flood
            </CascadeNode>
            <CascadeArrow>›</CascadeArrow>
            <CascadeNode
              sx={{ borderColor: "#FFE699", backgroundColor: "#FEFAE6" }}
            >
              Failure of electricity supply
            </CascadeNode>
            <CascadeArrow>›</CascadeArrow>
            <CascadeNode
              sx={{ borderColor: "#F47C7C", backgroundColor: "#FDEAEA" }}
            >
              Telecom disruption
            </CascadeNode>
            <CascadeArrow>›</CascadeArrow>
            <CascadeNode
              sx={{ borderColor: "#A9D18E", backgroundColor: "#EEF7E8" }}
            >
              Supply shortfalls
            </CascadeNode>
          </CascadeBox>
          <Typography
            variant="caption"
            sx={{ color: "text.disabled", display: "block", mt: 1.5 }}
          >
            {t(
              "learning.cascades.what.exampleCaption",
              "Each arrow represents a conditional probability. The chain can extend further, and loops are possible.",
            )}
          </Typography>
        </ExampleBox>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.cascades.what.scenarios.title">
              Cascades apply across all scenario combinations
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.cascades.what.scenarios.body">
              Because every risk is assessed in three scenarios, a cascade link
              between two risks actually represents nine possible combinations:
              a considerable cause can trigger a considerable, major, or extreme
              effect, and the same applies for major and extreme causes. Each
              combination has its own conditional probability, estimated by
              experts. A major earthquake, for instance, is far more likely to
              cause an extreme power outage than a considerable one.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Direct vs indirect probability                                      */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.cascades.probability.title">
            Direct and indirect probability
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.cascades.probability.intro">
            Because some risks can be triggered both spontaneously and by other
            risks, the BNRA splits the total probability of a risk scenario into
            two components. This also ensures that each expert is only asked to
            estimate what falls within their own domain of knowledge.
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
                <Trans i18nKey="learning.cascades.probability.direct.title">
                  Direct probability
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1.5 }}
              >
                <Trans i18nKey="learning.cascades.probability.direct.body">
                  The likelihood that a risk scenario occurs due to its own
                  internal causes, independently of any other risk in the
                  catalogue. For example, the direct probability of a dam
                  failure covers causes such as structural degradation or
                  operator error, but not the possibility that an earthquake
                  causes the failure. That is captured separately as a cascade.
                </Trans>
              </Typography>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                {t(
                  "learning.cascades.probability.direct.note",
                  "Expressed using the P0-P7 probability scale.",
                )}
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
                <Trans i18nKey="learning.cascades.probability.indirect.title">
                  Indirect probability
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1.5 }}
              >
                <Trans i18nKey="learning.cascades.probability.indirect.body">
                  The likelihood that a risk scenario occurs because another
                  risk in the catalogue caused it. This is calculated as the
                  probability of the causing risk multiplied by the conditional
                  probability that it triggers this scenario. For example, the
                  indirect probability of a power outage includes the
                  contribution from earthquakes, floods, storms, and any other
                  risks that could cause one.
                </Trans>
              </Typography>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                {t(
                  "learning.cascades.probability.indirect.note",
                  "Expressed using the CP0-CP7 conditional probability scale.",
                )}
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>

        <Box sx={{ p: 2, backgroundColor: "grey.100", borderRadius: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
              display: "block",
              mb: 0.5,
            }}
          >
            {t(
              "learning.cascades.probability.formula.label",
              "Total probability",
            )}
          </Typography>
          <FormulaBox>
            P(E) = DirectProbability(E) + P(C1 → E) + P(C2 → E) + ... + P(Cn →
            E)
          </FormulaBox>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {t(
              "learning.cascades.probability.formula.caption",
              "The total probability of a scenario E is the sum of its direct probability and all indirect contributions from causing risks C1 through Cn.",
            )}
          </Typography>
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Direct vs indirect impact                                           */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.cascades.impact.title">
            Direct and indirect impact
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.cascades.impact.intro">
            The same logic applies to impact. When a risk occurs, its
            consequences include both the harm it causes directly and the harm
            caused by the risks it subsequently triggers. These are also
            separated to ensure that the right experts assess the right
            consequences.
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
                <Trans i18nKey="learning.cascades.impact.direct.title">
                  Direct impact
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.cascades.impact.direct.body">
                  The harm caused by a risk scenario itself, not counting any
                  downstream cascades. For a flood, this includes property
                  damage, displacement of people, and direct injuries, but not
                  the subsequent disruption to electricity or telecommunications
                  that a flood might also cause. Direct impact is estimated
                  across all ten indicators for each scenario.
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
                <Trans i18nKey="learning.cascades.impact.indirect.title">
                  Indirect impact
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.cascades.impact.indirect.body">
                  The expected harm from risks that are triggered as a
                  consequence. If a flood has a 60% chance of causing a major
                  power outage, the indirect impact of that cascade is 60% of
                  the full impact of a major power outage. This expected-value
                  approach means that rare but severe cascades still contribute
                  proportionally to the total picture.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>

        <Box sx={{ p: 2, backgroundColor: "grey.100", borderRadius: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
              display: "block",
              mb: 0.5,
            }}
          >
            {t("learning.cascades.impact.formula.label", "Total impact")}
          </Typography>
          <FormulaBox>
            I(C) = DirectImpact(C) + P(C → E1) × I(E1) + P(C → E2) × I(E2) + ...
          </FormulaBox>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {t(
              "learning.cascades.impact.formula.caption",
              "The total impact of a scenario C is its direct impact plus the expected impacts of all cascading effects E1, E2, etc., each weighted by their conditional probability.",
            )}
          </Typography>
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Cross-border effects                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.cascades.crossborder.title">
            Cross-border effects
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.cascades.crossborder.body">
            Some risks do not stop at the Belgian border. A flood originating in
            Belgium may disrupt power infrastructure in the Netherlands. A
            pandemic in a neighbouring country may spill over into Belgium. The
            BNRA recognises three forms of cross-border impact, as defined by
            the EU Civil Protection Mechanism: impacts originating in a
            neighbouring country, impacts that spill over into a neighbouring
            country, and impacts affecting multiple countries simultaneously.
          </Trans>
        </Typography>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.cascades.crossborder.approach.title">
              A qualitative approach
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.cascades.crossborder.approach.body">
              Cross-border impacts are currently assessed qualitatively rather
              than quantitatively. This is because the data needed to estimate
              them precisely, such as detailed risk profiles for neighbouring
              countries, is not yet available in a comparable form. Risk files
              note potential cross-border cascades and describe them in
              qualitative terms, including hypothesised downstream effects in
              affected countries.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Link to technical page                                              */}
      {/* ------------------------------------------------------------------ */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "grey.100",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 5,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.25 }}>
            <Trans i18nKey="learning.cascades.technicalLink.title">
              Want to understand how cascades are calculated?
            </Trans>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Trans i18nKey="learning.cascades.technicalLink.body">
              The Monte Carlo simulation method used to compute cascade
              probabilities and aggregate impacts is explained in the technical
              methodology section.
            </Trans>
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/learning/monte-carlo-simulation"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          size="small"
          sx={{ flexShrink: 0 }}
        >
          <Trans i18nKey="learning.cascades.technicalLink.button">
            Monte Carlo simulation
          </Trans>
        </Button>
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
          to="/learning/intensity-scenarios"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.cascades.prev">
            Previous: Intensity scenarios
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/malicious-actors"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.cascades.next">Next: Malicious actors</Trans>
        </Button>
      </Box>
    </Container>
  );
}
