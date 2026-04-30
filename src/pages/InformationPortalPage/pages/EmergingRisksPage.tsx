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

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const EXAMPLES = [
  {
    emerging: "Quantum computing",
    risk: "Cyber attack against critical infrastructure",
    effectKey: "learning.emerging.examples.quantum.effect",
    effectDefault:
      "Current encryption standards could be broken by sufficiently powerful quantum computers, making cyber attacks far more feasible and effective.",
  },
  {
    emerging: "Artificial intelligence",
    risk: "Disinformation campaigns",
    effectKey: "learning.emerging.examples.ai.effect",
    effectDefault:
      "AI-generated content could dramatically lower the cost and increase the scale of disinformation, amplifying societal impact.",
  },
  {
    emerging: "Climate change",
    risk: "Coastal and river flooding",
    effectKey: "learning.emerging.examples.climate.effect",
    effectDefault:
      "Rising sea levels and more intense precipitation events are expected to increase the frequency and severity of flooding scenarios.",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function EmergingRisksPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.emerging.title", "Emerging risks"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.emerging.title", "Emerging risks"),
      url: "/learning/emerging-risks",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.emerging.title">Emerging risks</Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.emerging.intro">
            Some of the most significant threats facing Belgium over the coming
            decades are not yet fully formed. New technologies, shifting
            geopolitical dynamics, and environmental change are creating
            conditions that may fundamentally alter the risk landscape — but in
            ways that are too uncertain to quantify with the same precision as
            an earthquake or a pandemic. The BNRA addresses these through a
            dedicated category: emerging risks.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* What is an emerging risk                                            */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.emerging.what.title">
            What is an emerging risk?
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.emerging.what.body">
            An emerging risk is any process that may create new combinations of
            risks or modify existing ones. Crucially, emerging risks do not pose
            a direct threat to Belgium in themselves. Instead, they act as
            catalysts that may amplify, accelerate, or transform other risks
            already in the catalogue.
          </Trans>
        </Typography>

        <AccentCard sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.emerging.what.example.title">
              Example
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.emerging.what.example.body">
              The emergence of quantum computing does not in itself threaten
              Belgium. But if sufficiently powerful quantum computers become
              widely accessible, they could break the encryption standards that
              currently protect critical digital infrastructure — dramatically
              increasing the probability and potential severity of cyber
              attacks. Quantum computing is therefore an emerging risk in the
              BNRA catalogue: not a threat itself, but a force that reshapes
              other threats.
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
                <Trans i18nKey="learning.emerging.what.horizon.title">
                  Long-time horizon
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.emerging.what.horizon.body">
                  Emerging risks are typically relevant over a longer timescale
                  than the standard three-year BNRA window. They may become
                  significant in 5 to 10 years, or in some cases 30 to 50 years.
                  The BNRA assesses where each emerging risk sits on this
                  horizon and how quickly it may develop.
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
                <Trans i18nKey="learning.emerging.what.uncertainty.title">
                  High uncertainty
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.emerging.what.uncertainty.body">
                  By definition, emerging risks are those for which relatively
                  little is currently known, little or no international
                  legislation exists, and the trajectory of development is
                  uncertain. This high degree of uncertainty is why they cannot
                  be assessed with the same quantitative tools as standard
                  risks.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Qualitative assessment                                              */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.emerging.assessment.title">
            How emerging risks are assessed
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.emerging.assessment.body">
            Because the future trajectory of emerging risks is genuinely
            uncertain, they are assessed qualitatively rather than
            quantitatively. Rather than assigning probability or impact scale
            values, the analysis for each emerging risk consists of two parts:
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
                <Trans i18nKey="learning.emerging.assessment.horizon.title">
                  Horizon analysis
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.emerging.assessment.horizon.body">
                  A qualitative description of one or more possible development
                  pathways for the emerging risk — how it might evolve, on what
                  timescale, and what factors could accelerate or slow its
                  emergence. Multiple scenarios may be discussed where the
                  trajectory is particularly uncertain.
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
                <Trans i18nKey="learning.emerging.assessment.catalyzing.title">
                  Catalysing effects
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.emerging.assessment.catalyzing.body">
                  A structured overview of how the emerging risk may affect
                  other risks in the catalogue. For each standard risk that
                  could be influenced, experts describe qualitatively how and to
                  what degree the emerging risk might change its probability or
                  impact.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.emerging.assessment.where">
            The catalysing effects of each emerging risk are visible on the Risk
            Evolution page of every standard risk file that is affected.
            Conversely, the emerging risk's own risk file lists all the risks it
            may catalyse in one place.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Catalyzing effects explained                                        */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.emerging.catalyzing.title">
            Catalysing effects: how they work
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.emerging.catalyzing.body">
            A catalysing effect is a qualitative link between an emerging risk
            and a standard risk in the catalogue. It describes how the emergence
            or development of the former may change the probability or impact of
            the latter. Unlike standard cascade links, catalysing effects are
            not quantified with conditional probabilities — the uncertainty is
            too great. Instead, they are documented as qualitative assessments:
            what might change, in what direction, and under what conditions.
          </Trans>
        </Typography>

        <Box
          sx={{
            p: 2.5,
            backgroundColor: "grey.100",
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: "text.secondary",
              display: "block",
              mb: 2,
            }}
          >
            {t(
              "learning.emerging.catalyzing.examples",
              "Examples of catalysing effects",
            )}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {EXAMPLES.map((ex) => (
              <Box key={ex.emerging}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    mb: 0.75,
                  }}
                >
                  <CascadeNode
                    sx={{ backgroundColor: "#EEF7E8", borderColor: "#A9D18E" }}
                  >
                    {ex.emerging}
                  </CascadeNode>
                  <Typography
                    sx={{ color: "text.disabled", fontSize: "1.1rem" }}
                  >
                    →
                  </Typography>
                  <CascadeNode
                    sx={{ backgroundColor: "#EAF3FB", borderColor: "#9DC3E6" }}
                  >
                    {ex.risk}
                  </CascadeNode>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6, pl: 0.5 }}
                >
                  {t(ex.effectKey, ex.effectDefault)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.emerging.catalyzing.climate.title">
              Climate change: the exception
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.emerging.catalyzing.climate.body">
              Climate change is the one emerging risk whose catalysing effects
              are assessed quantitatively rather than qualitatively. Because
              climate projections are based on extensive scientific modelling,
              it is possible to estimate how the direct probability of certain
              standard risks changes by 2050. This makes climate change unique
              in the BNRA catalogue.
            </Trans>
          </Typography>
          <Button
            component={RouterLink}
            to="/learning/climate-change"
            endIcon={<ChevronRightIcon />}
            size="small"
            variant="outlined"
            sx={{ mt: 1.5 }}
          >
            <Trans i18nKey="learning.emerging.catalyzing.climate.link">
              Climate change in the BNRA
            </Trans>
          </Button>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* In the platform                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.emerging.platform.title">
            Where to find emerging risk information
          </Trans>
        </SectionTitle>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.emerging.platform.file.title">
                  Emerging risk files
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.emerging.platform.file.body">
                  Each of the twelve emerging risks has its own risk file in the
                  catalogue. These contain the horizon analysis and the full
                  list of catalysing effects across all affected standard risks.
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
                <Trans i18nKey="learning.emerging.platform.evolution.title">
                  Risk Evolution tab
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.emerging.platform.evolution.body">
                  On every standard risk file, the Risk Evolution tab shows
                  which emerging risks may catalyse that specific risk, with the
                  qualitative reasoning provided by experts. Click any emerging
                  risk listed there to navigate to its full risk file.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
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
          to="/learning/how-do-we-measure-probability"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.emerging.prev">
            Previous: How do we measure probability?
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/risk-catalogue"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.emerging.next">
            Next: The risk catalogue
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
