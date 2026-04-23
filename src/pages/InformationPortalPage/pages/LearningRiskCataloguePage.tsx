import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
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

const RiskTypeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const FieldRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1.5),
  paddingTop: theme.spacing(1.25),
  paddingBottom: theme.spacing(1.25),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
    paddingBottom: 0,
  },
  "&:first-of-type": {
    paddingTop: 0,
  },
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  flexShrink: 0,
  width: 140,
  fontSize: "0.8rem",
  fontWeight: 500,
  color: theme.palette.text.primary,
  paddingTop: 1,
}));

const AccentCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: 4,
  padding: theme.spacing(2.5, 3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SELECTION_STEPS = [
  {
    labelKey: "learning.catalogue.selection.step1.label",
    labelDefault: "Build a longlist",
    bodyKey: "learning.catalogue.selection.step1.body",
    bodyDefault:
      "A longlist of around 400 potential hazards was compiled through a systematic literature study of national and international sources.",
  },
  {
    labelKey: "learning.catalogue.selection.step2.label",
    labelDefault: "Filter for Belgian relevance",
    bodyKey: "learning.catalogue.selection.step2.body",
    bodyDefault:
      "Hazards with no conceivable chance of occurring in Belgium were excluded. For example, a glacial lake outburst flood has no relevance for the Belgian context.",
  },
  {
    labelKey: "learning.catalogue.selection.step3.label",
    labelDefault: "Ensure mutual exclusivity",
    bodyKey: "learning.catalogue.selection.step3.body",
    bodyDefault:
      "Hazards that were subcases of a broader risk were removed. For example, measles was excluded as a standalone entry because it is already covered under the broader infectious disease category.",
  },
  {
    labelKey: "learning.catalogue.selection.step4.label",
    labelDefault: "Aggregate where appropriate",
    bodyKey: "learning.catalogue.selection.step4.body",
    bodyDefault:
      "Hazards with indistinguishable impacts and response measures were merged into a single entry. For example, several toxic gases were combined into a single release of chemical agents risk.",
  },
];

const RISK_FILE_TYPES = [
  {
    key: "standard",
    color: "#9DC3E6",
    bgColor: "#EAF3FB",
    countKey: "learning.catalogue.types.standard.count",
    countDefault: "101 risks",
    titleKey: "learning.catalogue.types.standard.title",
    titleDefault: "Standard risks",
    descKey: "learning.catalogue.types.standard.desc",
    descDefault:
      "Natural hazards, health risks, technological incidents, and societal or economic disruptions. Assessed fully quantitatively through probability and impact estimation.",
    fields: {
      description: [
        {
          label: "Definition",
          desc: "Precise definition of the hazard, including distinctions from related risks.",
        },
        {
          label: "Historical events",
          desc: "Optional examples of past events in Belgium or elsewhere, used to guide scenario construction.",
        },
        {
          label: "Intensity parameters",
          desc: "The physical or contextual factors that characterise how an event of this type develops and causes harm.",
        },
        {
          label: "Scenarios",
          desc: "Three concrete scenarios (considerable, major, extreme) described in terms of the intensity parameters.",
        },
      ],
      analysis: [
        {
          label: "Most relevant scenario",
          desc: "The scenario with the highest estimated total risk (probability x impact).",
        },
        {
          label: "Probability analysis",
          desc: "Estimated direct probability and conditional probabilities from cascading causes.",
        },
        {
          label: "Impact analysis",
          desc: "Direct impacts across all four domains, cascade triggers, and any cross-border effects.",
        },
      ],
      evolution: [
        {
          label: "Climate change",
          desc: "How climate change may influence the probability or impact of this hazard.",
        },
        {
          label: "Catalysing effects",
          desc: "How any emerging risk may influence this hazard in the future.",
        },
      ],
    },
  },
  {
    key: "malicious",
    color: "#F47C7C",
    bgColor: "#FDEAEA",
    countKey: "learning.catalogue.types.malicious.count",
    countDefault: "5 actor groups",
    titleKey: "learning.catalogue.types.malicious.title",
    titleDefault: "Malicious actor risks",
    descKey: "learning.catalogue.types.malicious.desc",
    descDefault:
      "Groups of actors employing similar methods, selecting similar targets, or sharing similar motivations. Each entry represents a class of actor rather than a specific individual or organisation.",
    fields: {
      description: [
        {
          label: "Definition",
          desc: "Description of the actor group, including their typical methods, targets, and motivations.",
        },
        {
          label: "Actor groups",
          desc: "Three actor groups with increasing capability levels (considerable, major, extreme) outlining the scale of attack the group could plausibly carry out.",
        },
        {
          label: "Intelligence analysis",
          desc: "Assessment of the motivation and intent of known actors within each group, drawing on intelligence inputs.",
        },
      ],
      analysis: [
        {
          label: "Potential attacks",
          desc: "Analysis of the types of attacks the actor group may carry out and the probability of each.",
        },
      ],
    },
  },
  {
    key: "emerging",
    color: "#A9D18E",
    bgColor: "#EEF7E8",
    countKey: "learning.catalogue.types.emerging.count",
    countDefault: "12 risks",
    titleKey: "learning.catalogue.types.emerging.title",
    titleDefault: "Emerging risks",
    descKey: "learning.catalogue.types.emerging.desc",
    descDefault:
      "Processes that may create new combinations of risks or modify existing ones. Emerging risks do not pose a direct threat themselves, but may amplify or transform other risks in the catalogue.",
    fields: {
      description: [
        {
          label: "Definition",
          desc: "Description of the emerging development and why it is considered relevant to the Belgian risk landscape.",
        },
        {
          label: "Horizon analysis",
          desc: "Qualitative review of evidence for the emergence of this risk and factors that may accelerate or slow its development.",
        },
      ],
      analysis: [
        {
          label: "Catalysing effects",
          desc: "An overview of how this emerging risk may affect the probability or impact of other hazards. Quantitative for climate change; qualitative for all others.",
        },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function LearningRiskCataloguePage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.catalogue.title", "The risk catalogue"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.catalogue.title", "The risk catalogue"),
      url: "/learning/risk-catalogue",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.catalogue.title">The risk catalogue</Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.catalogue.intro">
            The risk catalogue is the foundation of the BNRA. It defines the 118
            hazards that are assessed in the current edition, ensuring that
            every relevant risk facing Belgium is covered in a consistent and
            structured way. Each hazard in the catalogue has its own dedicated
            risk file, which bundles all information consolidated and validated
            by domain experts.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Selection process                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.catalogue.selection.title">
            How are risks selected for the catalogue?
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 3 }}
        >
          <Trans i18nKey="learning.catalogue.selection.intro">
            The catalogue aims to be as comprehensive as possible while
            remaining manageable in scope. To achieve this balance, a structured
            four-step selection process was used, applied by multiple risk
            analysts with different domain specialisations and validated through
            consensus. Starting from a longlist of around 400 potential hazards,
            the process reduced this to the final 118 through the following
            steps.
          </Trans>
        </Typography>

        <Stepper orientation="vertical" sx={{ ml: 1 }}>
          {SELECTION_STEPS.map((step, index) => (
            <Step key={step.labelKey} active>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: "primary.main",
                    "&.Mui-active": { color: "primary.main" },
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  {t(step.labelKey, step.labelDefault)}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                    pb: index < SELECTION_STEPS.length - 1 ? 1 : 0,
                  }}
                >
                  {t(step.bodyKey, step.bodyDefault)}
                </Typography>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Risk files                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.catalogue.riskfiles.title">Risk files</Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.catalogue.riskfiles.intro">
            Every hazard in the catalogue has a dedicated risk file. Because the
            nature of risks varies considerably, three different risk file types
            exist, each with its own template and methodology. The type of risk
            file determines how the hazard is assessed and what information is
            gathered from experts.
          </Trans>
        </Typography>

        <Grid container spacing={2}>
          {RISK_FILE_TYPES.map((type) => (
            <Grid key={type.key} size={{ xs: 12 }}>
              <RiskTypeCard>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: type.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 500, flex: 1 }}
                  >
                    {t(type.titleKey, type.titleDefault)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      backgroundColor: type.bgColor,
                      color: "rgba(0,0,0,0.6)",
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      fontWeight: 500,
                    }}
                  >
                    {t(type.countKey, type.countDefault)}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6, mb: 2 }}
                >
                  {t(type.descKey, type.descDefault)}
                </Typography>

                <Box
                  sx={{
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "block",
                      mb: 1,
                      mt: 1.5,
                      pb: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {t(
                      "learning.catalogue.riskfiles.description",
                      "Risk description",
                    )}
                  </Typography>
                  {type.fields.description.map((field) => (
                    <FieldRow key={field.label}>
                      <FieldLabel>{field.label}</FieldLabel>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", lineHeight: 1.6 }}
                      >
                        {field.desc}
                      </Typography>
                    </FieldRow>
                  ))}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      display: "block",
                      mb: 1,
                      mt: 3,
                      pb: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {t(
                      "learning.catalogue.riskfiles.analysis",
                      "Risk analysis",
                    )}
                  </Typography>
                  {type.fields.analysis.map((field) => (
                    <FieldRow key={field.label}>
                      <FieldLabel>{field.label}</FieldLabel>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", lineHeight: 1.6 }}
                      >
                        {field.desc}
                      </Typography>
                    </FieldRow>
                  ))}
                  {type.fields.evolution && (
                    <>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          display: "block",
                          mb: 1,
                          mt: 3,
                          pb: 1,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {t(
                          "learning.catalogue.riskfiles.evolution",
                          "Risk evolution",
                        )}
                      </Typography>
                      {type.fields.evolution.map((field) => (
                        <FieldRow key={field.label}>
                          <FieldLabel>{field.label}</FieldLabel>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", lineHeight: 1.6 }}
                          >
                            {field.desc}
                          </Typography>
                        </FieldRow>
                      ))}
                    </>
                  )}
                </Box>
              </RiskTypeCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Catalogue link                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.catalogue.link.title">
              View the full risk catalogue
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
          >
            <Trans i18nKey="learning.catalogue.link.body">
              The complete list of 118 hazards assessed in the BNRA 2023 - 2026,
              including their definitions and category classifications, is
              publicly available on the NCCN website.
            </Trans>
          </Typography>
          <Button
            href="https://crisiscentrum.be/nl/risicos-belgie"
            target="_blank"
            rel="noopener noreferrer"
            endIcon={<OpenInNewIcon sx={{ fontSize: "14px !important" }} />}
            variant="outlined"
            size="small"
          >
            <Trans i18nKey="learning.catalogue.link.button">
              Open risk catalogue on NCCN website
            </Trans>
          </Button>
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
          to="/learning/how-do-we-measure-probability"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.catalogue.prev">
            Previous: How do we measure probability?
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/intensity-scenarios"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.catalogue.next">
            Next: Intensity scenarios
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
