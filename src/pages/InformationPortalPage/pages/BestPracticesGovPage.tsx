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
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Trans, useTranslation } from "react-i18next";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import usePageTitle from "../../../hooks/usePageTitle";
import { Link as RouterLink } from "react-router-dom";

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const CornerstoneCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const StepChip = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  fontWeight: 500,
  fontSize: "0.8rem",
  flexShrink: 0,
}));

const ExampleBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 2),
  marginTop: theme.spacing(1.5),
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

const CORNERSTONES = [
  {
    number: 1,
    color: "#9DC3E6",
    titleKey: "learning.bestpractices.cornerstones.1.title",
    titleDefault: "Standardized scales and indicators",
    bodyKey: "learning.bestpractices.cornerstones.1.body",
    bodyDefault:
      "Using common probability and impact scales across all levels of government ensures that risk analyses are comparable, can be aggregated, and form a shared language for risk communication.",
  },
  {
    number: 2,
    color: "#FFE699",
    titleKey: "learning.bestpractices.cornerstones.2.title",
    titleDefault: "Multi-scenario approach",
    bodyKey: "learning.bestpractices.cornerstones.2.body",
    bodyDefault:
      "Decomposing each risk into multiple precisely described scenarios gives a far richer picture than a single vague estimate and makes expert assessment more concrete and reliable.",
  },
  {
    number: 3,
    color: "#F47C7C",
    titleKey: "learning.bestpractices.cornerstones.3.title",
    titleDefault: "Causes and consequences mapping",
    bodyKey: "learning.bestpractices.cornerstones.3.body",
    bodyDefault:
      "Systematically identifying what causes each risk and what it may trigger in turn reveals interdependencies, cascade effects, and intervention points that would otherwise be overlooked.",
  },
  {
    number: 4,
    color: "#A9D18E",
    titleKey: "learning.bestpractices.cornerstones.4.title",
    titleDefault: "Standardized risk catalogue",
    bodyKey: "learning.bestpractices.cornerstones.4.body",
    bodyDefault:
      "Maintaining consistent risk definitions validated by domain experts ensures clear communication across government levels and enables meaningful comparison and aggregation of results.",
  },
  {
    number: 5,
    color: "#C5B4E3",
    titleKey: "learning.bestpractices.cornerstones.5.title",
    titleDefault: "Delphi method",
    bodyKey: "learning.bestpractices.cornerstones.5.body",
    bodyDefault:
      "Structured expert panels reaching consensus through iterative consultation harness collective expertise while minimizing bias, producing more robust and credible assessments.",
  },
];

const STEPS = [
  {
    n: 1,
    titleKey: "learning.bestpractices.steps.1.title",
    titleDefault: "Risk identification",
    objectiveKey: "learning.bestpractices.steps.1.objective",
    objectiveDefault:
      "Create a catalogue of all risks that could considerably affect your jurisdiction or area of responsibility.",
    processItems: [
      "Review the national risk catalogue and other relevant analyses at equal, higher, or lower levels of government.",
      "Identify risks that directly affect your jurisdiction and note existing definitions.",
      "Where national-level risks are too broad, develop more specific sub-risks with clear tracebacks to the parent risk.",
      "Ensure risks are mutually exclusive and that each has a differentiable impact independent of intensity.",
    ],
    docItems: [
      "A clear name and definition for each risk.",
      "If applicable, a reference to the parent risk in the national catalogue.",
      "Relevant historical events.",
    ],
    exampleTitle: "Failure of electricity supply (national)",
    exampleItems: [
      "Management system failures in transmission networks",
      "Distribution network infrastructure damage",
      "Electricity production facility disruptions",
      "Electricity market operational failures",
    ],
    exampleNote:
      "The national risk was too broad to effectively analyse local vulnerabilities and response capabilities.",
  },
  {
    n: 2,
    titleKey: "learning.bestpractices.steps.2.title",
    titleDefault: "Parameter definition",
    objectiveKey: "learning.bestpractices.steps.2.objective",
    objectiveDefault:
      "Establish measurable parameters that accurately describe the magnitude and characteristics of each identified risk.",
    processItems: [
      "Identify intensity parameters: factors that influence the impact of an incident, such as wind speed for storms or duration for a blackout.",
      "Limit to 2 to 4 parameters per risk where possible.",
      "Do not use damage indicators (casualties, financial losses) as parameters — these are estimated separately.",
      "Avoid redundancy between parameters and minimise geographically-binding parameters.",
    ],
    docItems: [
      "A clear definition of each parameter with measurement units or qualitative levels.",
      "Explanation of any unfamiliar terminology used.",
    ],
    exampleTitle: "Parameters for 'Failure of electricity supply'",
    exampleItems: [
      "Duration of interruption (hours / days)",
      "Geographic scope (number of affected municipalities)",
      "Warning period (planned rolling blackout vs. sudden blackout)",
      "Disruption severity (blackout vs. brownout)",
    ],
    exampleNote: null,
  },
  {
    n: 3,
    titleKey: "learning.bestpractices.steps.3.title",
    titleDefault: "Scenario building",
    objectiveKey: "learning.bestpractices.steps.3.objective",
    objectiveDefault:
      "Develop concrete scenarios that comprehensively cover the range of possible risk manifestations.",
    processItems: [
      "Assign specific, concrete values to each parameter for every scenario using AND logic only (no OR relationships).",
      "Define at least 2 scenarios, ideally 3: considerable (manageable with standard resources), major (requires additional coordination), and extreme (necessitates extraordinary measures).",
      "Ensure scenarios cover all relevant and conceivable impact magnitudes without overlap.",
      "Document the rationale for scenario selection and any key assumptions.",
    ],
    docItems: [
      "Each scenario described with specific parameter values.",
      "Rationale for scenario selection.",
      "Key assumptions and limitations.",
    ],
    exampleTitle: "Scenarios for 'Failure of electricity supply'",
    exampleItems: [
      "Considerable: 4 hours, 2 municipalities, planned rolling blackout",
      "Major: 24 hours, 5 municipalities, sudden blackout",
      "Extreme: 72 hours, entire region (15 municipalities), sudden blackout",
    ],
    exampleNote: null,
  },
  {
    n: 4,
    titleKey: "learning.bestpractices.steps.4.title",
    titleDefault: "Cascade identification",
    objectiveKey: "learning.bestpractices.steps.4.objective",
    objectiveDefault:
      "Map the interconnections between risks to understand how risks can trigger or be triggered by other risks.",
    processItems: [
      "Identify which risks can cause your catalogued risks, and which risks your catalogued risks may cause.",
      "At a minimum, provide qualitative descriptions of cascade relationships focused on the most significant links.",
      "Where feasible, quantify cascade relationships using conditional probabilities (see Probability and cascade scales).",
      "For three-scenario risks, up to nine scenario-to-scenario combinations exist per cascade link — prioritise the most important ones.",
    ],
    docItems: [
      "Initiating risk and resulting risk for each cascade.",
      "Cascade mechanism: how one risk triggers the other.",
      "Probability or likelihood estimate (quantitative or qualitative).",
    ],
    exampleTitle: null,
    exampleItems: [],
    exampleNote: null,
  },
  {
    n: 5,
    titleKey: "learning.bestpractices.steps.5.title",
    titleDefault: "Probability assessment",
    objectiveKey: "learning.bestpractices.steps.5.objective",
    objectiveDefault:
      "Estimate the likelihood of each risk scenario using standardized scales and incorporating cascade effects.",
    processItems: [
      "Use the standard NCCN probability scales (P0 to P7) to express direct probability as a return period.",
      "Incorporate causing risks from Step 4: consider how upstream risks affect the likelihood of your scenarios.",
      "Ensure consistency with higher-level government analyses and comparability across different risks.",
      "Document assumptions, data sources, and where estimates are uncertain, the range of plausible values.",
    ],
    docItems: [
      "Quantitative probability estimate using NCCN scales.",
      "Qualitative narrative supporting the estimate.",
      "Integration of cascade effects into the probability calculation.",
    ],
    exampleTitle: null,
    exampleItems: [],
    exampleNote: null,
  },
  {
    n: 6,
    titleKey: "learning.bestpractices.steps.6.title",
    titleDefault: "Impact assessment",
    objectiveKey: "learning.bestpractices.steps.6.objective",
    objectiveDefault:
      "Comprehensively evaluate the potential consequences of each risk scenario across all ten damage indicators.",
    processItems: [
      "Assess each scenario against the 10 standardized NCCN damage indicators: Ha, Hb, Hc (human), Sa, Sb, Sc, Sd (societal), Ea (environmental), Fa, Fb (financial).",
      "Always assume the scenario has already occurred — impact assessment focuses on consequences, not probability.",
      "Estimate the direct impact only (cascade effects are assessed via the cascade links from Step 4).",
      "Use multiple information sources, document methodologies and expert inputs, and consider uncertainty.",
    ],
    docItems: [
      "A scale class value for each relevant damage indicator.",
      "Qualitative narrative supporting each assessment.",
      "Integration of cascade effects and secondary impact considerations.",
    ],
    exampleTitle: null,
    exampleItems: [],
    exampleNote: null,
  },
  {
    n: 7,
    titleKey: "learning.bestpractices.steps.7.title",
    titleDefault: "Impact aggregation",
    objectiveKey: "learning.bestpractices.steps.7.objective",
    objectiveDefault:
      "Synthesize individual damage indicator assessments into a comprehensive total impact measure for risk comparison and prioritization.",
    processItems: [
      "Use the NCCN standardized aggregation tool to convert all indicators to a common monetary equivalent scale.",
      "Validate automated results through manual review and cross-check for logical consistency across scenarios.",
      "Use aggregated results for ranking and prioritization, but interpret differences of less than one order of magnitude with caution given inherent estimation uncertainty.",
      "Maintain compatibility with national and peer jurisdiction templates to enable aggregation and comparison.",
    ],
    docItems: [
      "Aggregated total impact score per scenario.",
      "Documentation of limitations and confidence levels.",
      "Summary materials for decision-makers.",
    ],
    exampleTitle: null,
    exampleItems: [],
    exampleNote: null,
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function BestPracticesGovPage() {
  const { t } = useTranslation();

  usePageTitle(
    t(
      "learning.bestpractices.title",
      "Best practices for governmental risk analysis",
    ),
  );
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t(
        "learning.bestpractices.title",
        "Best practices for governmental risk analysis",
      ),
      url: "/learning/best-practices",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.bestpractices.title">
            Best practices for governmental risk analysis
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.bestpractices.intro">
            This guide provides a structured, seven-step methodology for
            conducting risk analyses at any level of government — national,
            regional, provincial, or municipal. It is designed to be compatible
            with the BNRA framework, allowing results to be compared,
            aggregated, and communicated across administrative levels. The
            methodology can be followed to a greater or lesser extent depending
            on the time, resources, and expertise available.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Five cornerstones                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.bestpractices.cornerstones.title">
            Five cornerstones of the methodology
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.bestpractices.cornerstones.intro">
            Before the seven steps, five foundational principles underpin the
            entire approach. Together they ensure that risk analyses are
            methodologically sound, practically useful, and capable of producing
            results that can be meaningfully compared and combined across
            different organisations and levels of government.
          </Trans>
        </Typography>

        <Grid container spacing={1.5}>
          {CORNERSTONES.map((c) => (
            <Grid key={c.number} size={{ xs: 12, sm: 6 }}>
              <CornerstoneCard>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      backgroundColor: c.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 500,
                      fontSize: "0.8rem",
                      color: "rgba(0,0,0,0.65)",
                      flexShrink: 0,
                    }}
                  >
                    {c.number}
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    {t(c.titleKey, c.titleDefault)}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {t(c.bodyKey, c.bodyDefault)}
                </Typography>
              </CornerstoneCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Seven steps                                                         */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.bestpractices.steps.title">
            Seven-step implementation guide
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 3 }}
        >
          <Trans i18nKey="learning.bestpractices.steps.intro">
            The seven steps below provide a structured workflow for conducting a
            risk assessment compatible with the BNRA. Each step builds on the
            previous one, and the outputs of each step serve as inputs for
            subsequent steps.
          </Trans>
        </Typography>

        <Stepper orientation="vertical" sx={{ ml: 1 }}>
          {STEPS.map((step) => (
            <Step key={step.n} active>
              <StepLabel
                StepIconComponent={() => <StepChip>{step.n}</StepChip>}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 500, ml: 0.5 }}
                >
                  {t(step.titleKey, step.titleDefault)}
                </Typography>
              </StepLabel>
              <StepContent sx={{ ml: 0.5 }}>
                <Box sx={{ pb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      display: "block",
                      mb: 0.75,
                    }}
                  >
                    {t("learning.bestpractices.objective", "Objective")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1.5 }}
                  >
                    {t(step.objectiveKey, step.objectiveDefault)}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      display: "block",
                      mb: 0.75,
                    }}
                  >
                    {t("learning.bestpractices.process", "Process")}
                  </Typography>
                  <Box sx={{ mb: 1.5 }}>
                    {step.processItems.map((item, i) => (
                      <BulletRow key={i}>
                        <Bullet />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", lineHeight: 1.6 }}
                        >
                          {item}
                        </Typography>
                      </BulletRow>
                    ))}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      display: "block",
                      mb: 0.75,
                    }}
                  >
                    {t("learning.bestpractices.documentation", "Document")}
                  </Typography>
                  <Box sx={{ mb: step.exampleTitle ? 1.5 : 0 }}>
                    {step.docItems.map((item, i) => (
                      <BulletRow key={i}>
                        <Bullet />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", lineHeight: 1.6 }}
                        >
                          {item}
                        </Typography>
                      </BulletRow>
                    ))}
                  </Box>

                  {step.exampleTitle && (
                    <ExampleBox>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 500,
                          color: "text.secondary",
                          display: "block",
                          mb: 0.75,
                        }}
                      >
                        {t("learning.bestpractices.example", "Example:")}{" "}
                        {step.exampleTitle}
                      </Typography>
                      {step.exampleItems.map((item, i) => (
                        <BulletRow key={i}>
                          <Bullet />
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary", lineHeight: 1.6 }}
                          >
                            {item}
                          </Typography>
                        </BulletRow>
                      ))}
                      {step.exampleNote && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.disabled",
                            display: "block",
                            mt: 0.75,
                            fontStyle: "italic",
                          }}
                        >
                          {step.exampleNote}
                        </Typography>
                      )}
                    </ExampleBox>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Scope note                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Box
        sx={{
          p: 2.5,
          backgroundColor: "grey.50",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          mb: 5,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
          <Trans i18nKey="learning.bestpractices.scope.title">
            Scope of this guide
          </Trans>
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.bestpractices.scope.body">
            This guide covers the core seven-step methodology applicable to all
            governmental levels. Advanced topics including malicious actor and
            emerging risk types, quantitative cascade modelling using Monte
            Carlo simulation, and the incorporation of long-term climate change
            projections introduce significant additional complexity and are
            addressed separately in the methodology section of this portal.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Download and contact                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box
        sx={{
          p: 2.5,
          backgroundColor: "grey.100",
          borderRadius: 2,
          borderLeft: "4px solid",
          borderColor: "primary.main",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 5,
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
            <Trans i18nKey="learning.bestpractices.download.title">
              Full guidelines document
            </Trans>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Trans i18nKey="learning.bestpractices.download.body">
              The complete guidelines document — including additional examples,
              quality assurance checklists, and implementation considerations —
              is available for download. For questions or feedback, contact the
              NCCN at cipra.bnra@nccn.fgov.be.
            </Trans>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0, flexWrap: "wrap" }}>
          {/* TODO: replace href with the actual hosted URL for the guidelines PDF */}
          <Button
            href="https://bnra.powerappsportals.com/documents/Risk_Analysis_Guidelines.pdf"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<DownloadIcon />}
            variant="outlined"
            size="small"
          >
            <Trans i18nKey="learning.bestpractices.download.button">
              Download PDF
            </Trans>
          </Button>
          <Button
            href="mailto:cipra.bnra@nccn.fgov.be"
            startIcon={<OpenInNewIcon sx={{ fontSize: "14px !important" }} />}
            variant="outlined"
            size="small"
          >
            <Trans i18nKey="learning.bestpractices.contact.button">
              Contact NCCN
            </Trans>
          </Button>
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Prev navigation — back to information portal                       */}
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
        <Box></Box>

        <Button
          component={RouterLink}
          to="/learning"
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.reporting.backToPortal">
            Back to information portal
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
