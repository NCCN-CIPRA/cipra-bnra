import {
  Box,
  Button,
  Chip,
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

const AccentCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: 8,
  padding: theme.spacing(2.5, 3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const TypeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const ScaleRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td": { borderBottom: "none" },
  "&:hover": { backgroundColor: theme.palette.grey[50] },
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const P_SCALE = [
  {
    code: "P0",
    returnPeriod: "Never",
    likelihood: "0%",
    descKey: "learning.probability.pscale.p0.desc",
    descDefault: "Impossible",
    color: "#e0e0e0",
  },
  {
    code: "P1",
    returnPeriod: "> 5000 years",
    likelihood: "< 0.05%",
    descKey: "learning.probability.pscale.p1.desc",
    descDefault: "Extremely unlikely; never happened before but not impossible",
    color: "#EAF3DE",
  },
  {
    code: "P2",
    returnPeriod: "500 - 5000 years",
    likelihood: "0.05% - 0.5%",
    descKey: "learning.probability.pscale.p2.desc",
    descDefault: "Very unlikely; few, if any, known events worldwide",
    color: "#C0DD97",
  },
  {
    code: "P3",
    returnPeriod: "50 - 500 years",
    likelihood: "0.5% - 5%",
    descKey: "learning.probability.pscale.p3.desc",
    descDefault:
      "Unlikely; may have occurred in Belgium, but possibly some generations ago",
    color: "#97C459",
  },
  {
    code: "P4",
    returnPeriod: "5 - 50 years",
    likelihood: "5% - 50%",
    descKey: "learning.probability.pscale.p4.desc",
    descDefault:
      "Likely; on average, one event in Belgium during a human lifespan",
    color: "#FFE699",
  },
  {
    code: "P5",
    returnPeriod: "0.5 - 5 years",
    likelihood: "50% - 99%",
    descKey: "learning.probability.pscale.p5.desc",
    descDefault: "Very likely; a few events in Belgium during a human lifespan",
    color: "#FBBE6A",
  },
  {
    code: "P6",
    returnPeriod: "1 - 6 months",
    likelihood: "> 99%",
    descKey: "learning.probability.pscale.p6.desc",
    descDefault:
      "Almost certain; multiple events in Belgium during a human lifespan",
    color: "#F47C7C",
  },
  {
    code: "P7",
    returnPeriod: "< 1 month",
    likelihood: "~100%",
    descKey: "learning.probability.pscale.p7.desc",
    descDefault: "Essentially certain; multiple yearly occurrences",
    color: "#E24B4A",
  },
];

const M_SCALE = [
  {
    code: "M0",
    returnPeriod: "Never",
    likelihood: "< 0.01%",
    descDefault: "Essentially impossible",
    color: "#e0e0e0",
  },
  {
    code: "M1",
    returnPeriod: "> 30 years",
    likelihood: "0.01% - 10%",
    descDefault: "Very improbable",
    color: "#EAF3DE",
  },
  {
    code: "M2",
    returnPeriod: "10 - 30 years",
    likelihood: "10% - 25%",
    descDefault: "Improbable",
    color: "#C0DD97",
  },
  {
    code: "M3",
    returnPeriod: "6 - 10 years",
    likelihood: "25% - 40%",
    descDefault: "Not likely",
    color: "#97C459",
  },
  {
    code: "M4",
    returnPeriod: "4 - 6 years",
    likelihood: "40% - 55%",
    descDefault: "Possible",
    color: "#FFE699",
  },
  {
    code: "M5",
    returnPeriod: "2 - 4 years",
    likelihood: "55% - 75%",
    descDefault: "Likely",
    color: "#FBBE6A",
  },
  {
    code: "M6",
    returnPeriod: "1 - 2 years",
    likelihood: "75% - 90%",
    descDefault: "Very likely",
    color: "#F47C7C",
  },
  {
    code: "M7",
    returnPeriod: "< 1 year",
    likelihood: "90% - 100%",
    descDefault: "Almost certain",
    color: "#E24B4A",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function HowDoWeMeasureProbabilityPage() {
  const { t } = useTranslation();

  usePageTitle(
    t("learning.probability.title", "How do we measure probability?"),
  );
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.probability.title", "How do we measure probability?"),
      url: "/learning/how-do-we-measure-probability",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.probability.title">
            How do we measure probability?
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.probability.intro">
            Knowing how severe a risk could be is only part of the picture.
            Equally important is understanding how likely it is to occur. The
            BNRA uses a structured probability scale to express this likelihood
            in a consistent and comparable way across all 118 risks in the
            catalogue.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Return period concept                                               */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.probability.returnperiod.title">
            Thinking in return periods
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.probability.returnperiod.body">
            Probability is expressed as a return period: the average number of
            years expected to pass between two occurrences of a given event. A
            flood with a return period of 100 years does not mean it happens
            exactly once per century. It means that in any given year, there is
            a 1% chance of it occurring. Over three years, that probability
            rises to roughly 3%.
          </Trans>
        </Typography>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.probability.returnperiod.why.title">
              Why three years?
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.probability.returnperiod.why.body">
              All probability estimates in the BNRA are expressed as the
              likelihood of at least one occurrence within a three-year window,
              matching the validity period of each edition. This makes it easier
              to interpret the results in a planning context: a risk with a 40%
              three-year likelihood is one that decision-makers should
              reasonably expect to face within the current assessment period.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* P scale                                                             */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.probability.pscale.title">
            The probability scale (P0 - P7)
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.probability.pscale.intro">
            Experts estimate the probability of each risk scenario using a scale
            from P0 to P7. Each step represents roughly an order-of-magnitude
            change in return period, covering everything from events that
            essentially never happen to those occurring multiple times per year.
            The scale below shows the corresponding return period and three-year
            likelihood for each class.
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
                <TableCell sx={{ fontWeight: 500, width: 56 }}>
                  {t("learning.probability.pscale.col.scale", "Scale")}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {t("learning.probability.pscale.col.return", "Return period")}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {t(
                    "learning.probability.pscale.col.likelihood",
                    "3-year likelihood",
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {t("learning.probability.pscale.col.desc", "Description")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {P_SCALE.map((row) => (
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
                    {row.returnPeriod}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.likelihood}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {t(
                      `learning.probability.pscale.${row.code.toLowerCase()}.desc`,
                      row.descDefault,
                    )}
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Malicious actor motivation scale                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.probability.mscale.title">
            A different scale for malicious actors
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.probability.mscale.intro">
            For risks involving deliberate human action, a standard return
            period is less meaningful. An attacker does not follow a statistical
            pattern. Instead, the BNRA uses a motivation scale (M0 to M7) that
            expresses the probability that a given actor group successfully
            carries out an attack within the three-year window. This combines
            both the intent and the capability of the actor, as assessed by
            relevant experts and intelligence inputs.
          </Trans>
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.probability.mscale.timeframe">
            The scale also has a notably shorter range than the standard
            probability scale. Where P1 corresponds to a return period of up to
            5000 years, the equivalent lowest class on the motivation scale (M1)
            reflects a return period of only 30 years. This is intentional:
            human behaviour, intent, and organisational capability simply cannot
            be meaningfully predicted on timescales of centuries or millennia.
            The motivation scale is therefore calibrated to the horizon over
            which such assessments can realistically be made.
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
                <TableCell sx={{ fontWeight: 500, width: 56 }}>
                  {t("learning.probability.mscale.col.scale", "Scale")}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {t(
                    "learning.probability.mscale.col.return",
                    "Return period of successful attack",
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {t(
                    "learning.probability.mscale.col.likelihood",
                    "3-year likelihood",
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {t("learning.probability.mscale.col.desc", "Description")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {M_SCALE.map((row) => (
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
                    {row.returnPeriod}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.likelihood}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.descDefault}
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Expert estimation                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.probability.experts.title">
            How are probability estimates obtained?
          </Trans>
        </SectionTitle>

        <Grid container spacing={2}>
          {[
            {
              titleKey: "learning.probability.experts.elicitation.title",
              titleDefault: "Expert elicitation",
              bodyKey: "learning.probability.experts.elicitation.body",
              bodyDefault:
                "For each risk scenario, domain experts assign a probability class based on their knowledge of the risk, historical data, and professional judgment. Multiple experts contribute estimates for the same scenario, which are then averaged and validated in consensus meetings.",
            },
            {
              titleKey: "learning.probability.experts.consensus.title",
              titleDefault: "Consensus validation",
              bodyKey: "learning.probability.experts.consensus.body",
              bodyDefault:
                "Raw expert estimates are reviewed collectively in consensus sessions. Where significant disagreement exists, experts discuss their reasoning until a shared estimate is reached. The final consensus value is what enters the BNRA calculations.",
            },
            {
              titleKey: "learning.probability.experts.historical.title",
              titleDefault: "Historical grounding",
              bodyKey: "learning.probability.experts.historical.body",
              bodyDefault:
                "Where historical records or scientific models exist, such as hydrological data for flood return periods or epidemiological data for disease outbreaks, these are used to anchor expert estimates and improve consistency.",
            },
            {
              titleKey: "learning.probability.experts.timeframe.title",
              titleDefault: "Fixed time horizon",
              bodyKey: "learning.probability.experts.timeframe.body",
              bodyDefault:
                "All estimates refer to the current state of affairs over the three-year assessment period. They do not account for future trends such as climate change, unless those effects are explicitly modelled as part of an emerging risk analysis.",
            },
          ].map((card) => (
            <Grid key={card.titleKey} size={{ xs: 12, sm: 6 }}>
              <TypeCard>
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
              </TypeCard>
            </Grid>
          ))}
        </Grid>
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
            <Trans i18nKey="learning.probability.technicalLink.title">
              Looking for the full scale definitions?
            </Trans>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Trans i18nKey="learning.probability.technicalLink.body">
              The exact numeric conversions and calculation formulas used in the
              BNRA are available in the technical reference section.
            </Trans>
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to="/learning/methodology-impact-probability"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          size="small"
          sx={{ flexShrink: 0 }}
        >
          <Trans i18nKey="learning.probability.technicalLink.button">
            Impact and probability scales
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
          to="/learning/how-do-we-measure-impact"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.probability.prev">
            Previous: How do we measure impact?
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/risk-catalogue"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.probability.next">
            Next: The risk catalogue
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
