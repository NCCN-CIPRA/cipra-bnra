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

const PhaseCard = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const PhaseIcon = styled(Box)(() => ({
  width: 36,
  height: 36,
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
  flexShrink: 0,
}));

const BulletRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "flex-start",
  marginBottom: theme.spacing(0.75),
  "&:last-child": { marginBottom: 0 },
}));

const Bullet = styled(Box)(({ theme }) => ({
  width: 5,
  height: 5,
  borderRadius: "50%",
  backgroundColor: theme.palette.text.disabled,
  marginTop: 7,
  flexShrink: 0,
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const MEETING_PHASES = [
  {
    icon: "📋",
    bg: "#EAF3FB",
    titleKey: "learning.consensus.meeting.phases.1.title",
    titleDefault: "Presentation of aggregated estimates",
    bodyKey: "learning.consensus.meeting.phases.1.body",
    bodyDefault:
      "The NCCN presents the averaged estimates from all contributing experts for each parameter, alongside the individual responses (anonymised). Areas of strong agreement and significant divergence are highlighted.",
  },
  {
    icon: "💬",
    bg: "#EEF7E8",
    titleKey: "learning.consensus.meeting.phases.2.title",
    titleDefault: "Open discussion",
    bodyKey: "learning.consensus.meeting.phases.2.body",
    bodyDefault:
      "Experts discuss their reasoning, particularly where estimates differ significantly. Each expert is encouraged to explain what evidence or logic underpins their estimate, and to challenge or refine their view in light of arguments from others.",
  },
  {
    icon: "✓",
    bg: "#FEFAE6",
    titleKey: "learning.consensus.meeting.phases.3.title",
    titleDefault: "Reaching consensus",
    bodyKey: "learning.consensus.meeting.phases.3.body",
    bodyDefault:
      "A consensus value is agreed upon by the group. This may match the average, shift toward a better-evidenced view, or in some cases remain as a range where genuine uncertainty cannot be resolved. The consensus value — not the raw average — is what enters the BNRA calculations.",
  },
  {
    icon: "📝",
    bg: "#FDEAEA",
    titleKey: "learning.consensus.meeting.phases.4.title",
    titleDefault: "Documentation of reasoning",
    bodyKey: "learning.consensus.meeting.phases.4.body",
    bodyDefault:
      "The agreed values and the key arguments behind them are documented in the risk file. This qualitative narrative accompanies every quantitative estimate and is published alongside the results, so that anyone reviewing the BNRA can understand not just what was estimated but why.",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ConsensusValidationPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.consensus.title", "Consensus and validation"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.consensus.title", "Consensus and validation"),
      url: "/learning/consensus-validation",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.consensus.title">
            Consensus and validation
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.consensus.intro">
            The BNRA does not simply average expert estimates and publish the
            result. Every quantitative value in the BNRA is subject to a
            structured consensus and validation process designed to surface
            disagreements, correct errors, and produce estimates that are
            collectively owned rather than imposed. This page explains how that
            process works and what your role in it is.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Why consensus                                                       */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.consensus.why.title">
            Why consensus rather than just averaging
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.consensus.why.body">
            A raw average of expert estimates can obscure important information.
            If three experts estimate P2 and one estimates P5, the average may
            land near P3 — but the P5 estimate might reflect genuine knowledge
            of a recent event the others were unaware of, or it might reflect a
            misunderstanding of the scenario definition. Averaging makes no
            distinction between the two.
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
                <Trans i18nKey="learning.consensus.why.surfaces.title">
                  Surfaces hidden knowledge
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.consensus.why.surfaces.body">
                  Discussion reveals the reasoning behind each estimate. An
                  outlier may know something the others do not. Bringing this
                  into the open allows the group to make an informed collective
                  judgment rather than letting it be silently averaged away.
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
                <Trans i18nKey="learning.consensus.why.corrects.title">
                  Corrects misunderstandings
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.consensus.why.corrects.body">
                  Divergent estimates often reveal ambiguity in the scenario
                  definition or the question itself. Discussion resolves these
                  ambiguities and ensures all experts are estimating the same
                  thing, producing more reliable and consistent results.
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
                <Trans i18nKey="learning.consensus.why.ownership.title">
                  Creates shared ownership
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.consensus.why.ownership.body">
                  When experts agree on a value through reasoned discussion,
                  they are more likely to stand behind it and flag concerns if
                  new evidence emerges. The consensus process builds confidence
                  in the results among the expert community itself.
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
                <Trans i18nKey="learning.consensus.why.documented.title">
                  Produces documented reasoning
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.consensus.why.documented.body">
                  The qualitative narratives produced during consensus meetings
                  explain why each estimate was reached. These become part of
                  the published risk file, giving context that numbers alone
                  cannot provide.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* The Delphi method                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.consensus.delphi.title">
            The Delphi approach
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.consensus.delphi.body">
            The BNRA uses a structured expert consultation approach inspired by
            the Delphi method. The core idea is that expert judgment is most
            reliable when it is elicited independently first, and then refined
            through structured discussion. This two-stage design — individual
            estimation followed by facilitated consensus — is specifically
            intended to reduce the most common sources of bias in group
            decision-making.
          </Trans>
        </Typography>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.consensus.delphi.bias.title">
              Biases this approach is designed to reduce
            </Trans>
          </Typography>
          <Box>
            {[
              {
                labelKey: "learning.consensus.delphi.bias.anchoring",
                labelDefault: "Anchoring bias",
                descKey: "learning.consensus.delphi.bias.anchoring.desc",
                descDefault:
                  "By submitting estimates independently before seeing others, experts are not anchored to the first number they hear.",
              },
              {
                labelKey: "learning.consensus.delphi.bias.authority",
                labelDefault: "Authority bias",
                descKey: "learning.consensus.delphi.bias.authority.desc",
                descDefault:
                  "Individual estimates are anonymised when presented to the group, preventing seniority or institutional affiliation from unduly influencing others.",
              },
              {
                labelKey: "learning.consensus.delphi.bias.groupthink",
                labelDefault: "Groupthink",
                descKey: "learning.consensus.delphi.bias.groupthink.desc",
                descDefault:
                  "The facilitator actively encourages experts who hold minority views to explain their reasoning before a consensus is reached.",
              },
            ].map((item) => (
              <BulletRow key={item.labelKey}>
                <Bullet />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  <strong>{t(item.labelKey, item.labelDefault)}:</strong>{" "}
                  {t(item.descKey, item.descDefault)}
                </Typography>
              </BulletRow>
            ))}
          </Box>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* How a consensus meeting works                                       */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.consensus.meeting.title">
            How a consensus meeting works
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.consensus.meeting.intro">
            Consensus meetings bring together the experts who contributed
            estimates for a given risk file, facilitated by the NCCN. The
            meeting proceeds through four phases for each parameter that
            requires discussion:
          </Trans>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {MEETING_PHASES.map((phase, i) => (
            <PhaseCard key={i}>
              <PhaseIcon sx={{ backgroundColor: phase.bg }}>
                {phase.icon}
              </PhaseIcon>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 500, mb: 0.5 }}
                >
                  {t(phase.titleKey, phase.titleDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {t(phase.bodyKey, phase.bodyDefault)}
                </Typography>
              </Box>
            </PhaseCard>
          ))}
        </Box>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.consensus.meeting.notall">
            Not every parameter requires a full discussion. Where estimates
            converge strongly, the average is simply confirmed and the meeting
            moves on. Discussion time is focused on the parameters where
            disagreement is greatest or the stakes are highest.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* When consensus cannot be reached                                    */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.consensus.disagreement.title">
            When consensus cannot be reached
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.consensus.disagreement.body">
            Sometimes genuine, irresolvable disagreement exists among experts.
            This is not a failure of the process — it is informative in itself.
            When a clear consensus cannot be reached, the following options are
            available:
          </Trans>
        </Typography>

        <Grid container spacing={1.5}>
          {[
            {
              titleKey: "learning.consensus.disagreement.range.title",
              titleDefault: "Document the range",
              bodyKey: "learning.consensus.disagreement.range.body",
              bodyDefault:
                "The spread of expert views is documented in the qualitative narrative, making the uncertainty explicit for anyone reading the risk file.",
            },
            {
              titleKey: "learning.consensus.disagreement.additional.title",
              titleDefault: "Seek additional expertise",
              bodyKey: "learning.consensus.disagreement.additional.body",
              bodyDefault:
                "Where disagreement stems from genuinely missing information, additional experts or data sources may be consulted before a value is finalised.",
            },
            {
              titleKey: "learning.consensus.disagreement.conservative.title",
              titleDefault: "Apply a conservative estimate",
              bodyKey: "learning.consensus.disagreement.conservative.body",
              bodyDefault:
                "In cases where the disagreement cannot be resolved, a conservative value is used — typically erring on the side of higher impact or higher probability, consistent with a precautionary approach to risk management.",
            },
          ].map((card) => (
            <Grid key={card.titleKey} size={{ xs: 12, sm: 4 }}>
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
      {/* Validation after the meeting                                        */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.consensus.validation.title">
            Validation after the meeting
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.consensus.validation.body">
            Once consensus values have been entered into the system, a
            validation phase follows before publication. This serves as a final
            check for internal consistency — for example, ensuring that the
            considerable scenario impact is not accidentally higher than the
            extreme scenario, or that cascade probability estimates are
            logically compatible with the direct probability of the linked
            risks.
          </Trans>
        </Typography>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.consensus.validation.silent.title">
              Silent procedure
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.consensus.validation.silent.body">
              Minor corrections identified during validation — for example, a
              typographical error in a scale class or a logical inconsistency
              spotted by the NCCN analyst — are handled through a silent
              procedure. Experts are notified of the proposed correction and
              given a window to object. If no objection is raised, the
              correction is applied without requiring a further meeting.
              Substantive changes always require renewed expert consultation.
            </Trans>
          </Typography>
        </AccentCard>
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
          to="/learning/how-input-is-used"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.consensus.prev">
            Previous: How your input shapes the results
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/bnra-application"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.consensus.next">
            Next: Using the BNRA application
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
