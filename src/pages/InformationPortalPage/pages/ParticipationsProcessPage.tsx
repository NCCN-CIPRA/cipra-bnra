import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
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

const SprintStep = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const SprintNumber = styled(Box)(({ theme }) => ({
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
// Data
// ---------------------------------------------------------------------------

const SPRINT_STEPS = [
  {
    n: 1,
    icon: "📋",
    bg: "#EAF3FB",
    titleKey: "learning.participation.sprint.1.title",
    titleDefault: "Risk and cascade selection",
    bodyKey: "learning.participation.sprint.1.body",
    bodyDefault:
      "CIPRA analysts select a subset of risks or cascade links to be reviewed during the sprint. Selection is based on factors such as new evidence, significant disagreement from the previous iteration, or risks due for a scheduled review.",
  },
  {
    n: 2,
    icon: "📬",
    bg: "#EEF7E8",
    titleKey: "learning.participation.sprint.2.title",
    titleDefault: "Expert confirmation",
    bodyKey: "learning.participation.sprint.2.body",
    bodyDefault:
      "Experts in the network whose registered expertise covers the selected risks are contacted in advance to confirm their availability and willingness to participate. If the available pool is insufficient, additional experts may be actively recruited.",
  },
  {
    n: 3,
    icon: "📝",
    bg: "#FEFAE6",
    titleKey: "learning.participation.sprint.3.title",
    titleDefault: "Individual online survey",
    bodyKey: "learning.participation.sprint.3.body",
    bodyDefault:
      "Participating experts complete an anonymous, individual online survey through the BNRA portal. The survey collects both qualitative reasoning and quantitative estimates. The questions are dynamically adapted to the specific type of input required — you will only be asked what is relevant to your expertise. This step does not always occur, depending on the risk type and the nature of the review.",
  },
  {
    n: 4,
    icon: "📊",
    bg: "#F3EDFB",
    titleKey: "learning.participation.sprint.4.title",
    titleDefault: "Aggregation and change document",
    bodyKey: "learning.participation.sprint.4.body",
    bodyDefault:
      "CIPRA analysts aggregate the survey responses — or, if no new survey was conducted, work from existing data — and produce a structured change document. This document summarises the proposed new values and the reasoning behind them, and is shared with all participating experts before the consensus meeting.",
  },
  {
    n: 5,
    icon: "💬",
    bg: "#FDEAEA",
    titleKey: "learning.participation.sprint.5.title",
    titleDefault: "Consensus meeting",
    bodyKey: "learning.participation.sprint.5.body",
    bodyDefault:
      "Experts and CIPRA analysts meet to discuss the proposed values. Experts may challenge, refine, or confirm any estimate. CIPRA analysts document the discussion and adapt values accordingly. The meeting concludes with agreed consensus values for each parameter.",
  },
  {
    n: 6,
    icon: "🔇",
    bg: "#EAF3FB",
    titleKey: "learning.participation.sprint.6.title",
    titleDefault: "Silence procedure",
    bodyKey: "learning.participation.sprint.6.body",
    bodyDefault:
      "A final consensus change document is shared with all meeting participants. Experts have a fixed window to raise any objections. If no objections are received, the values are considered approved and the raw data in the platform is updated accordingly.",
  },
  {
    n: 7,
    icon: "⚙️",
    bg: "#EEF7E8",
    titleKey: "learning.participation.sprint.7.title",
    titleDefault: "Simulation and publication",
    bodyKey: "learning.participation.sprint.7.body",
    bodyDefault:
      "In a subsequent sprint, the BNRA simulation is rerun with the updated raw data. CIPRA analysts then update the public risk file pages to reflect the new results, and an updated risk file is published and made visible to all BNRA platform users.",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ParticipationProcessPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.participation.title", "The participation process"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.participation.title", "The participation process"),
      url: "/learning/participation-process",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.participation.title">
            The participation process
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7, maxWidth: 700 }}
        >
          <Trans i18nKey="learning.participation.intro">
            Participating in the BNRA means contributing specialist knowledge
            that no single organisation could hold on its own. This page
            explains who can participate, how experts are onboarded, and how the
            sprint-based review process works in practice.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Who can participate                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.participation.who.title">
            Who can participate?
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.participation.who.body">
            The BNRA draws on a broad network of experts from across government,
            academia, research institutions, and the private sector. If you have
            specialised knowledge on one or more risks in the catalogue, your
            expertise is relevant — whether you are a civil servant, a
            researcher, a professional practitioner, or a subject-matter
            enthusiast.
          </Trans>
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {[
            {
              icon: "🏛️",
              titleKey: "learning.participation.who.government.title",
              titleDefault: "Government and public institutions",
              bodyKey: "learning.participation.who.government.body",
              bodyDefault:
                "Federal, regional, and local authorities with responsibilities in risk management, civil protection, public health, infrastructure, environment, or any other domain covered by the catalogue.",
            },
            {
              icon: "🔬",
              titleKey: "learning.participation.who.research.title",
              titleDefault: "Research and academia",
              bodyKey: "learning.participation.who.research.body",
              bodyDefault:
                "Universities, research institutes, and scientific agencies with expertise in the hazards covered by the BNRA, including natural sciences, engineering, health, social sciences, and economics.",
            },
            {
              icon: "🏭",
              titleKey: "learning.participation.who.private.title",
              titleDefault: "Professional practitioners",
              bodyKey: "learning.participation.who.private.body",
              bodyDefault:
                "Industry professionals, operators of critical infrastructure, and specialists in fields such as cybersecurity, energy, logistics, or emergency management.",
            },
          ].map((card) => (
            <Grid key={card.titleKey} size={{ xs: 12, sm: 4 }}>
              <SplitCard>
                <Typography sx={{ fontSize: 24, mb: 1 }}>
                  {card.icon}
                </Typography>
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

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.participation.who.principles.title">
              Principles of participation
            </Trans>
          </Typography>
          <Box>
            {[
              {
                labelKey: "learning.participation.who.principles.voluntary",
                labelDefault: "Voluntary",
                descKey: "learning.participation.who.principles.voluntary.desc",
                descDefault:
                  "Participation is voluntary and ideally altruistic. There are no financial incentives and no institutional obligations.",
              },
              {
                labelKey: "learning.participation.who.principles.equal",
                labelDefault: "Equal roles",
                descKey: "learning.participation.who.principles.equal.desc",
                descDefault:
                  "There are no different expert roles or tiers. All experts contribute equally to the estimation and consensus process.",
              },
              {
                labelKey: "learning.participation.who.principles.anonymous",
                labelDefault: "Anonymised input",
                descKey: "learning.participation.who.principles.anonymous.desc",
                descDefault:
                  "All individual estimates are anonymised. No names or organisations are ever publicly linked to specific inputs. CIPRA analysts can see which expert provided which input internally, but this is never disclosed externally.",
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
      {/* Registration                                                        */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.participation.registration.title">
            Joining the expert network
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.participation.registration.body">
            Registration is done through the BNRA expert portal. During
            registration you indicate your areas of expertise — this is how
            CIPRA knows which risks you should be invited to contribute to. You
            do not need to be an expert in all catalogue risks; most
            participants contribute to a small number of risks within their
            specific domain.
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
                <Trans i18nKey="learning.participation.registration.active.title">
                  Active recruitment
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.participation.registration.active.body">
                  Experts can register independently through the portal. CIPRA
                  also actively recruits experts when a sprint covers risks for
                  which the existing network does not have sufficient coverage.
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
                <Trans i18nKey="learning.participation.registration.flexible.title">
                  Flexible commitment
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.participation.registration.flexible.body">
                  Joining the network does not commit you to every sprint.
                  Before each sprint, you are asked whether you are available
                  and willing to participate. You can say no at any time without
                  affecting your membership in the network.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          {/* TODO: replace href with the actual registration portal URL */}
          <Button
            href="https://bnra.powerappsportals.com/register"
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon sx={{ fontSize: "14px !important" }} />}
            variant="contained"
            color="primary"
            size="small"
          >
            <Trans i18nKey="learning.participation.registration.cta">
              Register as an expert
            </Trans>
          </Button>
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Sprint process                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.participation.sprint.title">
            How a sprint works
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.participation.sprint.intro">
            Risk files are not all updated simultaneously. Instead, the BNRA
            works in sprints — focused periods of one to four months during
            which a selected subset of risks or cascade links is reviewed and
            updated. This approach keeps the workload manageable and ensures
            that each review receives focused attention. A typical sprint
            proceeds through the following steps:
          </Trans>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {SPRINT_STEPS.map((step) => (
            <SprintStep key={step.n}>
              <SprintNumber>{step.n}</SprintNumber>
              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: 1,
                      backgroundColor: step.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    {t(step.titleKey, step.titleDefault)}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6, mt: 0.5 }}
                >
                  {t(step.bodyKey, step.bodyDefault)}
                </Typography>
              </Box>
            </SprintStep>
          ))}
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Scenario and definition reviews                                     */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.participation.scenarios.title">
            Scenario and definition reviews
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.participation.scenarios.body">
            Beyond probability and impact estimates, the foundational content of
            each risk file is also subject to periodic review. This includes two
            closely related elements:
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
                <Trans i18nKey="learning.participation.scenarios.definition.title">
                  Risk definitions
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.participation.scenarios.definition.body">
                  The definition of a risk establishes precisely what is and is
                  not included in its scope, and how it is distinguished from
                  related risks. Definitions may be updated to reflect new
                  scientific understanding, changes in the risk landscape, or
                  feedback from previous iterations that revealed ambiguity.
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
                <Trans i18nKey="learning.participation.scenarios.scenarios.title">
                  Intensity scenarios
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.participation.scenarios.scenarios.body">
                  The intensity parameters and their values for each of the
                  considerable, major, and extreme scenarios may also be revised
                  — for example, to better differentiate between severity levels
                  or to incorporate new measurement approaches.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.participation.scenarios.process">
            For the next iteration of the BNRA, both definition and scenario
            reviews will take place as a separate, dedicated effort before any
            estimation reviews begin. This sequencing ensures that all
            subsequent probability and impact estimates are anchored to the most
            accurate and up-to-date descriptions of each risk.
          </Trans>
        </Typography>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.participation.scenarios.note.title">
              Why definitions and scenarios must come first
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.participation.scenarios.note.body">
              If the definition or scenario description of a risk changes, all
              existing probability and impact estimates for that risk may no
              longer be valid — experts were estimating something subtly
              different from what is now defined. By completing definition and
              scenario reviews before estimation reviews, the BNRA avoids the
              need to re-elicit estimates that have been made against outdated
              content.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Publication and consistency                                         */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.participation.publication.title">
            How updates are published
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.participation.publication.body">
            Updating a risk file can affect many others. A change in the
            probability of one risk may shift the cascade contributions to
            dozens of connected risks. Reflecting these knock-on effects across
            the entire catalogue simultaneously would impose an unmanageable
            workload on CIPRA analysts.
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
                <Trans i18nKey="learning.participation.publication.internal.title">
                  Internal consistency standard
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.participation.publication.internal.body">
                  A risk file is published when it is internally consistent: the
                  qualitative explanations, summaries, and quantitative results
                  on the page accurately reflect each other and the underlying
                  raw data. A file does not need to be consistent with every
                  linked risk file in order to be published.
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
                <Trans i18nKey="learning.participation.publication.dates.title">
                  Publication and data update dates
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.participation.publication.dates.body">
                  Each risk file displays the date of its last published update.
                  If the underlying raw data has been updated since the last
                  publication — because a linked risk was changed — this is also
                  indicated, so readers can see whether the published version
                  reflects the very latest data.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Next page                                                           */}
      {/* ------------------------------------------------------------------ */}
      <Box
        sx={{
          mt: 2,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          component={RouterLink}
          to="/learning/how-input-is-used"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.participation.next">
            Next: How your input shapes the results
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
