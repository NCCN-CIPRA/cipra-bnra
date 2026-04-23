import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

const ScenarioCard = styled(Paper)(({ theme }) => ({
  padding: 16,
  boxShadow: "none",
  borderRadius: 4,
  height: "100%",
  border: `1px solid ${theme.palette.divider}`,
}));

const ScenarioImgCard = styled(Paper)(({ theme }) => ({
  padding: 16,
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 4,
  display: "flex",
  justifyContent: "center",
  marginBottom: 24,
}));

const TypeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const ExampleTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td": { borderBottom: "none" },
  verticalAlign: "top",
  "& td": {
    fontSize: "0.78rem",
    color: theme.palette.text.secondary,
    lineHeight: 1.5,
  },
  "& td:first-of-type": {
    fontWeight: 500,
    color: theme.palette.text.primary,
    whiteSpace: "nowrap",
  },
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SCENARIOS = [
  {
    level: "considerable",
    color: "#9DC3E620",
    labelKey: "learning.scenarios.considerable.label",
    labelDefault: "Considerable",
    descKey: "learning.scenarios.considerable.desc",
    descDefault:
      "A significant but manageable event. Impacts are real and require a coordinated response, but remain within the capacity of existing services.",
  },
  {
    level: "major",
    color: "#FFE69920",
    labelKey: "learning.scenarios.major.label",
    labelDefault: "Major",
    descKey: "learning.scenarios.major.desc",
    descDefault:
      "A serious event that stretches response capacity and causes substantial harm across multiple sectors or regions.",
  },
  {
    level: "extreme",
    color: "#F47C7C20",
    labelKey: "learning.scenarios.extreme.label",
    labelDefault: "Extreme",
    descKey: "learning.scenarios.extreme.desc",
    descDefault:
      "A catastrophic event with severe, potentially long-lasting consequences that overwhelm normal response capacity.",
  },
];

const EXAMPLE_ROWS = [
  {
    parameter: "Magnitude (Mw)",
    considerable: "4.5 or above",
    major: "5.5 or above",
    extreme: "6.5 or above",
  },
  {
    parameter: "Time of occurrence",
    considerable: "Daytime, late spring",
    major: "Daytime or rush hour, winter",
    extreme: "Nighttime, winter",
  },
  {
    parameter: "Spatial extent",
    considerable: "Local (~300 km²), damage intensity VII on EMS-98",
    major: "Regional (~2,000 km²), damage intensity VII on EMS-98",
    extreme: "Wide regional (~7,500 km²), damage intensity VII on EMS-98",
  },
  {
    parameter: "Land use",
    considerable: "Rural, low population density, no vital infrastructure",
    major:
      "Densely populated, moderate infrastructure, at least one vital infrastructure present",
    extreme:
      "Urban centre, high infrastructure density, multiple vital infrastructures present",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function IntensityScenariosPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.scenarios.title", "Intensity scenarios"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.scenarios.title", "Intensity scenarios"),
      url: "/learning/intensity-scenarios",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.scenarios.title">Intensity scenarios</Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.scenarios.intro">
            Most risks do not come in a single fixed form. A storm can be a
            minor nuisance or a devastating force. A disease outbreak can affect
            hundreds or hundreds of thousands of people. Rather than reducing
            each risk to a single point on a scale, the BNRA defines three
            concrete scenarios of increasing severity for each hazard, allowing
            a much richer picture of what could actually happen and what it
            would mean for Belgium.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Why scenarios                                                       */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.scenarios.why.title">
            Why not just a single probability and impact?
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.scenarios.why.body">
            Traditional risk assessments often represent each risk as a single
            dot on a probability-impact matrix: one number for likelihood, one
            for severity. In reality, almost every hazard spans a continuous
            range of possible outcomes, each with its own probability and
            expected impact. A minor flood is far more likely than a
            catastrophic one, but both are part of the same risk.
          </Trans>
        </Typography>

        <ScenarioImgCard>
          <img
            alt="risicocyclus"
            src={`https://bnra.powerappsportals.com/scenarios.png`}
            style={{ width: "90%" }}
          ></img>
        </ScenarioImgCard>

        <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
          <Trans i18nKey="learning.scenarios.why.approach.title">
            The scenario-based approach
          </Trans>
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.scenarios.why.approach.body">
            Rather than trying to model this full continuum, which would be
            impractical, the BNRA samples three representative points from it: a
            considerable, a major, and an extreme scenario. These are not
            forecasts of what will happen, but structured frameworks that
            describe plausible courses an event might take. Experts then
            independently assess the probability and impact of each scenario,
            giving a much more complete and useful picture of the risk than a
            single estimate ever could.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* The three scenarios                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.scenarios.levels.title">
            The three scenarios
          </Trans>
        </SectionTitle>

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
          <Trans i18nKey="learning.scenarios.levels.note">
            Scenarios are designed before the risk analysis begins, based on
            expert judgment about where they fall on the risk function. Their
            exact probability and impact are only determined afterwards, during
            the expert consultation phase.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Intensity parameters                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.scenarios.parameters.title">
            Intensity parameters
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.scenarios.parameters.body">
            Each scenario is defined in terms of intensity parameters:
            hazard-specific factors that characterise how an event develops and
            how severe its effects are. For a storm, this might be wind speed
            and duration. For an earthquake, magnitude, spatial extent, time of
            day, and the nature of the affected area. These parameters give each
            scenario a concrete, unambiguous description that experts can reason
            about and that planners can act on.
          </Trans>
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.scenarios.parameters.guidelines">
            When selecting intensity parameters, scenario builders follow a few
            practical guidelines: the number of parameters is kept to a maximum
            of five, parameters should not overlap with each other, and damage
            or probability estimates should never be used as parameters since
            those are determined later in the analysis. A scenario is always
            understood as a situation where all parameters apply simultaneously.
          </Trans>
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
          >
            <Trans i18nKey="learning.scenarios.parameters.example.intro">
              The table below shows how intensity parameters are applied to the
              earthquake hazard as a concrete example:
            </Trans>
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "none",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.100" }}>
                  <TableCell sx={{ fontWeight: 500, width: 160 }}>
                    {t(
                      "learning.scenarios.parameters.col.parameter",
                      "Parameter",
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 500, backgroundColor: "#9DC3E620" }}
                  >
                    {t("learning.scenarios.considerable.label", "Considerable")}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 500, backgroundColor: "#FFE69920" }}
                  >
                    {t("learning.scenarios.major.label", "Major")}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 500, backgroundColor: "#F47C7C20" }}
                  >
                    {t("learning.scenarios.extreme.label", "Extreme")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {EXAMPLE_ROWS.map((row) => (
                  <ExampleTableRow key={row.parameter}>
                    <TableCell>{row.parameter}</TableCell>
                    <TableCell sx={{ backgroundColor: "#9DC3E610" }}>
                      {row.considerable}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#FFE69910" }}>
                      {row.major}
                    </TableCell>
                    <TableCell sx={{ backgroundColor: "#F47C7C10" }}>
                      {row.extreme}
                    </TableCell>
                  </ExampleTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography
            variant="caption"
            sx={{ color: "text.disabled", display: "block", mt: 1 }}
          >
            <Trans i18nKey="learning.scenarios.parameters.example.caption">
              Example: intensity parameters for the earthquake hazard. Each
              column describes a distinct scenario where all parameters apply
              simultaneously.
            </Trans>
          </Typography>
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Differences per risk type                                           */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.scenarios.types.title">
            How scenarios differ by risk type
          </Trans>
        </SectionTitle>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TypeCard>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#9DC3E6",
                  mb: 1.5,
                }}
              />
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.scenarios.types.standard.title">
                  Standard risks
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.scenarios.types.standard.body">
                  Scenarios are defined using physical or contextual intensity
                  parameters specific to the hazard. As the values of these
                  parameters increase, so does the expected impact of the event.
                </Trans>
              </Typography>
            </TypeCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TypeCard>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#F47C7C",
                  mb: 1.5,
                }}
              />
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.scenarios.types.malicious.title">
                  Malicious actor risks
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.scenarios.types.malicious.body">
                  Scenarios are defined by the technical and operational
                  capabilities of the actor group. Considerable corresponds to
                  low capabilities, major to high technical or operational
                  capability (but not both), and extreme to high capabilities on
                  both dimensions.
                </Trans>
              </Typography>
            </TypeCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TypeCard>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: "#A9D18E",
                  mb: 1.5,
                }}
              />
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.scenarios.types.emerging.title">
                  Emerging risks
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.scenarios.types.emerging.body">
                  No fixed scenarios are defined. Instead, the horizon analysis
                  describes one or more possible evolution pathways, including
                  potential timeframes or trigger events, and discusses how
                  quickly the emerging risk may become relevant.
                </Trans>
              </Typography>
            </TypeCard>
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
          to="/learning/risk-catalogue"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.scenarios.prev">
            Previous: The risk catalogue
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/risk-cascades"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.scenarios.next">Next: Risk cascades</Trans>
        </Button>
      </Box>
    </Container>
  );
}
