import {
  Box,
  Button,
  Chip,
  Container,
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

const ScaleRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td": { borderBottom: "none" },
  "&:hover": { backgroundColor: theme.palette.grey[50] },
}));

const SubsectionLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(3),
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const P_SCALE_CENTERS = [
  {
    code: "P1",
    range: "> 5000 years",
    center: "~26,000 months",
    note: "Upper bin: apply same factor beyond P1",
  },
  {
    code: "P2",
    range: "500 - 5000 years",
    center: "~30,000 months",
    note: "Geometric center of range",
  },
  {
    code: "P3",
    range: "50 - 500 years",
    center: "~3,000 months",
    note: "Geometric center of range",
  },
  {
    code: "P4",
    range: "5 - 50 years",
    center: "~300 months",
    note: "Geometric center of range",
  },
  {
    code: "P5",
    range: "0.5 - 5 years",
    center: "~30 months",
    note: "Geometric center of range",
  },
  {
    code: "P6",
    range: "1 - 6 months",
    center: "~2.5 months",
    note: "Geometric center of range",
  },
  {
    code: "P7",
    range: "< 1 month",
    center: "~0.5 months",
    note: "Lower bin: apply same factor below P7",
  },
];

const FA_EQUIVALENCE = [
  {
    indicator: "Ha",
    unit: "Fatalities",
    conversion: "Statistical value of a human life",
  },
  {
    indicator: "Hb",
    unit: "Injured / sick people",
    conversion: "Weighted by severity; fraction of statistical life value",
  },
  {
    indicator: "Hc",
    unit: "Person-days of assistance",
    conversion: "Daily cost of emergency care and shelter",
  },
  {
    indicator: "Sa",
    unit: "Person-days of unmet needs",
    conversion:
      "Daily economic value of disrupted service, weighted by need importance",
  },
  {
    indicator: "Sb",
    unit: "Person-days of disrupted order",
    conversion: "Estimated daily welfare loss per affected person",
  },
  {
    indicator: "Sc",
    unit: "Reputational damage (qual.)",
    conversion: "Estimated trade and diplomatic cost over duration",
  },
  {
    indicator: "Sd",
    unit: "Loss of state confidence (qual.)",
    conversion: "Estimated governance and welfare cost over duration",
  },
  {
    indicator: "Ea",
    unit: "km² x years of ecosystem damage",
    conversion: "Economic value of ecosystem services per km² per year",
  },
  {
    indicator: "Fb",
    unit: "GDP reduction (euro)",
    conversion: "Direct monetary equivalent, no conversion needed",
  },
];

const HB_WEIGHTS = [
  {
    level: "Severe",
    injury: "Hospital stay of at least 7 days",
    illness: "Chronic illness requiring ongoing treatment",
    weight: "1",
  },
  {
    level: "Moderate",
    injury: "Hospital stay of 1 to 6 days",
    illness: "Persistent illness requiring treatment; full recovery expected",
    weight: "0.1",
  },
  {
    level: "Minor",
    injury: "No permanent harm; medical attention, no hospital stay",
    illness: "Minor illness requiring treatment; full recovery",
    weight: "0.003",
  },
];

const SA_WEIGHTS = [
  {
    category: "Physical needs",
    examples: "Potable water, basic foodstuffs, medicine, emergency services",
    weight: "1",
  },
  {
    category: "Security needs",
    examples:
      "Electricity, heating, non-emergency medical care, telecoms, transport",
    weight: "0.5",
  },
  {
    category: "Comfort needs",
    examples:
      "Fuel, media, waste management, government services, postal services",
    weight: "0.1",
  },
];

const CP_SCALE = [
  { code: "CP0", range: "< 0.01%", center: "0%", color: "#e0e0e0" },
  { code: "CP1", range: "0.01% - 10%", center: "~1%", color: "#EAF3DE" },
  { code: "CP2", range: "10% - 25%", center: "~16%", color: "#C0DD97" },
  { code: "CP3", range: "25% - 40%", center: "~32%", color: "#FFE699" },
  { code: "CP4", range: "40% - 55%", center: "~47%", color: "#FBBE6A" },
  { code: "CP5", range: "55% - 75%", center: "~65%", color: "#F47C7C" },
  { code: "CP6", range: "75% - 90%", center: "~82%", color: "#E24B4A" },
  { code: "CP7", range: "90% - 100%", center: "~95%", color: "#A32D2D" },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ImpactProbabilityScalesPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.scales.title", "Impact and probability scales"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.scales.title", "Impact and probability scales"),
      url: "/learning/methodology-impact-probability",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.scales.title">
            Impact and probability scales
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.scales.intro">
            The earlier pages introduced the probability and impact scales and
            explained what each class represents. This page explains what
            happens next: how a qualitative expert judgment such as P3 or Ha4 is
            converted into a numeric value, how all ten impact indicators are
            brought onto a common scale so that they can be aggregated, and how
            conditional probabilities are interpreted differently from direct
            probabilities in the calculations.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* From scale class to numeric value                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.scales.centers.title">
            From scale class to numeric value
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.scales.centers.body">
            Each probability scale class covers a range of return periods rather
            than a single value. To use these classes in calculations, a single
            representative numeric value is needed for each class. Rather than
            taking the arithmetic midpoint of the range, the BNRA uses the
            geometric (exponential) center. This is appropriate because the
            scale itself is logarithmic: each step represents roughly an
            order-of-magnitude change, so the midpoint that best represents the
            range is the one that sits in the middle on a log scale.
          </Trans>
        </Typography>

        <AccentCard sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.scales.centers.formula.title">
              Geometric center of a range
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 0.5 }}
          >
            <Trans i18nKey="learning.scales.centers.formula.body">
              For a scale class covering a return period range from a to b (in
              months), the representative value used in calculations is:
            </Trans>
          </Typography>
          <FormulaBox>center = sqrt(a × b)</FormulaBox>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.scales.centers.formula.openbins">
              For the open-ended top and bottom bins (P1 and P7), an imaginary
              adjacent bin of the same multiplicative width is assumed beyond
              the boundary, and its center is used. The same logic applies to
              impact scale bins.
            </Trans>
          </Typography>
        </AccentCard>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
        >
          <Trans i18nKey="learning.scales.centers.conversion">
            Once the return period center is known in months, it is converted to
            a daily probability using a Poisson process assumption, which models
            events as occurring randomly and independently over time:
          </Trans>
        </Typography>

        <FormulaBox>
          pDaily = 1 - exp( (1 / 30.437) / returnPeriodMonths )
        </FormulaBox>

        <Typography
          variant="caption"
          sx={{ color: "text.disabled", display: "block", mt: 0.5, mb: 2 }}
        >
          <Trans i18nKey="learning.scales.centers.conversionNote">
            30.437 is the average number of days per month. This daily
            probability is what the Monte Carlo simulation uses internally.
          </Trans>
        </Typography>

        <SubsectionLabel>
          {t(
            "learning.scales.centers.tableLabel",
            "Approximate numeric centers for P-scale classes",
          )}
        </SubsectionLabel>

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
                <TableCell sx={{ fontWeight: 500, width: 56 }}>Scale</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  Return period range
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  Representative center
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {P_SCALE_CENTERS.map((row) => (
                <ScaleRow key={row.code}>
                  <TableCell>
                    <Chip
                      label={row.code}
                      size="small"
                      sx={{ fontWeight: 500, fontSize: "0.7rem", height: 22 }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.range}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.primary",
                      fontSize: "0.8rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {row.center}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.disabled", fontSize: "0.75rem" }}
                  >
                    {row.note}
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Weighting factors                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.scales.weights.title">
            Weighting factors within indicators
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.scales.weights.body">
            Two impact indicators use internal weighting factors to aggregate
            different sub-categories of harm into a single score before the
            indicator class is assigned. These weights reflect the relative
            severity or importance of different types of impact within the same
            indicator.
          </Trans>
        </Typography>

        <SubsectionLabel>
          {t(
            "learning.scales.weights.hb.label",
            "Hb — Injured and sick people: severity weights",
          )}
        </SubsectionLabel>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
        >
          <Trans i18nKey="learning.scales.weights.hb.body">
            People affected by injury or illness are not all equivalent in terms
            of harm suffered. The Hb indicator therefore applies a weighting
            factor based on severity before summing the total. A person with a
            severe injury counts as 1, a moderate injury as 0.1, and a minor
            injury as 0.003. Deaths are not counted here but under the Ha
            indicator.
          </Trans>
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            mb: 3,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 500, width: 100 }}>
                  Severity level
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Injury</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Illness</TableCell>
                <TableCell sx={{ fontWeight: 500, width: 80 }}>
                  Weight
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {HB_WEIGHTS.map((row) => (
                <ScaleRow key={row.level}>
                  <TableCell sx={{ fontWeight: 500, fontSize: "0.8rem" }}>
                    {row.level}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.injury}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.illness}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 500,
                        fontSize: "0.8rem",
                        color: "text.primary",
                      }}
                    >
                      {row.weight}
                    </Box>
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <SubsectionLabel>
          {t(
            "learning.scales.weights.sa.label",
            "Sa — Supply shortfalls: need importance weights",
          )}
        </SubsectionLabel>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
        >
          <Trans i18nKey="learning.scales.weights.sa.body">
            Not all supply disruptions are equally severe. A lack of drinking
            water is immediately life-threatening; a disruption to postal
            services is not. The Sa indicator weights person-days of disruption
            by the importance of the unmet need, loosely based on a hierarchy of
            human needs. The weighted sum is what determines the Sa scale class.
          </Trans>
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            mb: 1,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 500, width: 140 }}>
                  Need category
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Examples</TableCell>
                <TableCell sx={{ fontWeight: 500, width: 80 }}>
                  Weight
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {SA_WEIGHTS.map((row) => (
                <ScaleRow key={row.category}>
                  <TableCell sx={{ fontWeight: 500, fontSize: "0.8rem" }}>
                    {row.category}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.examples}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        fontFamily: "monospace",
                        fontWeight: 500,
                        fontSize: "0.8rem",
                      }}
                    >
                      {row.weight}
                    </Box>
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Fa equivalence                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.scales.fa.title">
            Converting all indicators to a common scale
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.scales.fa.body">
            The ten impact indicators each use different units: number of
            fatalities, person-days, km² x years, euros. To aggregate them into
            a single Total Impact (TI) score, they must first be expressed on a
            common scale. The BNRA uses the financial asset damage indicator Fa
            as the reference unit, converting all other indicators to their
            monetary equivalent.
          </Trans>
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.scales.fa.body2">
            This conversion is based on established equivalences: for example,
            the statistical value of a human life is used to convert fatalities
            to euros, and the economic value of ecosystem services per km² per
            year is used to convert environmental damage. The scale classes of
            all indicators are constructed so that equivalent classes across
            different indicators represent roughly the same level of
            Fa-equivalent harm.
          </Trans>
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
        >
          <Trans i18nKey="learning.scales.fa.formula.body">
            Because the Fa scale is logarithmic, the Fa-equivalent monetary
            value for a given scale class x can be approximated by the following
            exponential function, which defines the geometric center of each
            bin:
          </Trans>
        </Typography>

        <FormulaBox>
          I_direct(x) = Fa(x) ≈ e^(1.92·x + 13.2) [in euros]
        </FormulaBox>

        <Typography
          variant="caption"
          sx={{ color: "text.disabled", display: "block", mt: 0.5, mb: 2 }}
        >
          <Trans i18nKey="learning.scales.fa.formula.note">
            Where x is the integer scale class (0 to 7). For example, Fa3
            corresponds to roughly €25–150 million, and the formula gives the
            geometric center of that bin. The same exponential structure applies
            to all other indicators once converted to their Fa equivalent.
          </Trans>
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 500, width: 56 }}>
                  Indicator
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Original unit</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  Fa-equivalence basis
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {FA_EQUIVALENCE.map((row) => (
                <ScaleRow key={row.indicator}>
                  <TableCell>
                    <Chip
                      label={row.indicator}
                      size="small"
                      sx={{ fontWeight: 500, fontSize: "0.7rem", height: 22 }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.unit}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.conversion}
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.scales.fa.retain.title">
              Individual indicators are always retained
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.scales.fa.retain.body">
              The Fa-equivalent aggregation is used for ranking and comparison
              purposes. All ten original indicator values are always retained
              alongside the aggregated TI score, so it is always possible to
              look beyond the summary figure and understand exactly which type
              of harm drives the impact of a given risk scenario.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* CP as marginal probability                                          */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.scales.cp.title">
            Conditional probabilities as marginal probabilities
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.scales.cp.body">
            The conditional probability (CP) scale looks similar to the direct
            probability scale, but is interpreted differently in calculations.
            Direct probability values are converted to daily probabilities via
            the Poisson formula and used in a time-based simulation. Conditional
            probabilities are not: they are treated as marginal probabilities
            over the entire three-year analysis window. When a causing risk
            fires in the simulation, the CP value is applied once to determine
            whether the cascade activates, it is not converted to a daily rate.
            The full mechanics of how cascades are computed from these values
            are explained on the next page.
          </Trans>
        </Typography>

        <SubsectionLabel>
          {t(
            "learning.scales.cp.tableLabel",
            "CP scale classes and approximate numeric centers",
          )}
        </SubsectionLabel>

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
                <TableCell sx={{ fontWeight: 500, width: 56 }}>Scale</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Likelihood range</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  Representative center
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>Interpretation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CP_SCALE.map((row) => (
                <ScaleRow key={row.code}>
                  <TableCell>
                    <Chip
                      label={row.code}
                      size="small"
                      sx={{
                        backgroundColor: row.color,
                        color: "rgba(0,0,0,0.7)",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 22,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.range}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.primary",
                      fontSize: "0.8rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {row.center}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {t(
                      `learning.scales.cp.${row.code.toLowerCase()}.interp`,
                      row.code === "CP0"
                        ? "Never activates"
                        : row.code === "CP1"
                          ? "Almost never activates"
                          : row.code === "CP2"
                            ? "Rarely activates"
                            : row.code === "CP3"
                              ? "Occasionally activates"
                              : row.code === "CP4"
                                ? "About as likely as not"
                                : row.code === "CP5"
                                  ? "More often than not"
                                  : row.code === "CP6"
                                    ? "Usually activates"
                                    : "Almost always activates",
                    )}
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Uncertainty intervals                                               */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.scales.uncertainty.title">
            Uncertainty in scale estimates
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.scales.uncertainty.body">
            Expert estimates are inherently uncertain. A probability class such
            as P3 covers a range of 50 to 500 years (an order of magnitude) and
            the true value could lie anywhere within it. To reflect this
            uncertainty in the results, the Monte Carlo simulation does not
            simply use the geometric center value for each scale class. Instead,
            it samples from a probability distribution centered on that value.
          </Trans>
        </Typography>

        <AccentCard sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.scales.uncertainty.distribution.title">
              Normal distribution on the log scale
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
          >
            <Trans i18nKey="learning.scales.uncertainty.distribution.body1">
              For each simulation run, the numeric value of a scale class is
              drawn from a normal distribution on the linear scale, with the
              geometric center of the bin as the mean and a fixed standard
              deviation. The width of the scale interval serves as the 95%
              confidence interval, giving a standard deviation of 2.55. Values
              close to the center are sampled most often, but values near the
              edges of the bin, or occasionally just beyond, are also possible.
            </Trans>
          </Typography>
          <FormulaBox>
            sampled_value ~ Normal( mean = center, sigma = 2.55 )
          </FormulaBox>
          <Typography
            variant="caption"
            sx={{ color: "text.disabled", display: "block", mt: 0.5 }}
          >
            <Trans i18nKey="learning.scales.uncertainty.distribution.note1">
              A sigma of 2.55 is a fixed constant corresponding to a 95%
              confidence interval of [-0.5, 0.5] on the linear scale class
              value. This means that in 95% of simulation runs, the sampled
              scale class will fall within half a class step of the expert's
              estimate.
            </Trans>
          </Typography>
        </AccentCard>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.scales.uncertainty.effect1">
            This sampling approach propagates the inherent uncertainty of expert
            estimates through the entire simulation. Risks where experts are
            highly uncertain about the probability or impact will show wider
            distributions in the output results, while well-constrained
            estimates produce tighter distributions. The reported median values
            and any uncertainty bands in the results reflect this full
            distribution of outcomes across all simulation runs.
          </Trans>
        </Typography>
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
          to="/learning/malicious-actors"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.scales.prev">
            Previous: Malicious actors
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/cascade-probabilities"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.scales.next">
            Next: Cascade probabilities
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
