import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
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

const GroupCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const IndicatorRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: theme.spacing(1.5),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
    paddingBottom: 0,
  },
  "&:first-of-type": {
    paddingTop: 0,
  },
}));

const IndicatorBadge = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  width: 32,
  height: 32,
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 500,
  fontSize: "0.75rem",
  fontFamily: theme.typography.fontFamily,
}));

const AggregationCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(2.5, 3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const ScaleBar = styled(Box)(() => ({
  display: "flex",
  borderRadius: 4,
  overflow: "hidden",
  height: 8,
  width: "100%",
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const INDICATOR_GROUPS = [
  {
    key: "human",
    color: "#F47C7C",
    bgColor: "#FDEAEA",
    labelKey: "learning.impact.groups.human.title",
    labelDefault: "Human impact",
    descKey: "learning.impact.groups.human.desc",
    descDefault:
      "Effects on the lives, physical health, and wellbeing of people in Belgium.",
    indicators: [
      {
        code: "Ha",
        labelKey: "learning.impact.indicators.ha.title",
        labelDefault: "Fatalities",
        descKey: "learning.impact.indicators.ha.desc",
        descDefault:
          "Number of people whose deaths are directly attributable to the event.",
      },
      {
        code: "Hb",
        labelKey: "learning.impact.indicators.hb.title",
        labelDefault: "Injured and sick people",
        descKey: "learning.impact.indicators.hb.desc",
        descDefault:
          "Number of people suffering physical or mental injuries or illness as a direct result of the event, weighted by severity.",
      },
      {
        code: "Hc",
        labelKey: "learning.impact.indicators.hc.title",
        labelDefault: "People in need of assistance",
        descKey: "learning.impact.indicators.hc.desc",
        descDefault:
          "Number of people requiring evacuation, emergency shelter, food, or other care, expressed in person-days.",
      },
    ],
  },
  {
    key: "societal",
    color: "#9DC3E6",
    bgColor: "#EAF3FB",
    labelKey: "learning.impact.groups.societal.title",
    labelDefault: "Societal impact",
    descKey: "learning.impact.groups.societal.desc",
    descDefault:
      "Effects on the functioning of society, public order, and confidence in the state.",
    indicators: [
      {
        code: "Sa",
        labelKey: "learning.impact.indicators.sa.title",
        labelDefault: "Supply shortfalls",
        descKey: "learning.impact.indicators.sa.desc",
        descDefault:
          "Disruption to critical goods and services such as water, food, electricity, healthcare, or transport, measured in person-days and weighted by the importance of the need.",
      },
      {
        code: "Sb",
        labelKey: "learning.impact.indicators.sb.title",
        labelDefault: "Diminished public order",
        descKey: "learning.impact.indicators.sb.desc",
        descDefault:
          "Number of people whose daily lives are disrupted by domestic unrest or insecurity, measured in person-days.",
      },
      {
        code: "Sc",
        labelKey: "learning.impact.indicators.sc.title",
        labelDefault: "Damage to reputation",
        descKey: "learning.impact.indicators.sc.desc",
        descDefault:
          "Significance and duration of reputational harm to Belgium internationally, including effects on diplomatic relations or trade.",
      },
      {
        code: "Sd",
        labelKey: "learning.impact.indicators.sd.title",
        labelDefault: "Loss of confidence in the state",
        descKey: "learning.impact.indicators.sd.desc",
        descDefault:
          "Significance and duration of loss of public trust in government institutions or impairment of state functions.",
      },
    ],
  },
  {
    key: "environmental",
    color: "#A9D18E",
    bgColor: "#EEF7E8",
    labelKey: "learning.impact.groups.environmental.title",
    labelDefault: "Environmental impact",
    descKey: "learning.impact.groups.environmental.desc",
    descDefault:
      "Long-term damage to ecosystems, biodiversity, and natural resources.",
    indicators: [
      {
        code: "Ea",
        labelKey: "learning.impact.indicators.ea.title",
        labelDefault: "Damaged ecosystems",
        descKey: "learning.impact.indicators.ea.desc",
        descDefault:
          "Area of ecosystems seriously damaged and the duration of that damage, measured in km² x years. Includes forests, wetlands, agricultural land, and watercourses affected by chemical, biological, or physical harm.",
      },
    ],
  },
  {
    key: "financial",
    color: "#FFE699",
    bgColor: "#FEFAE6",
    labelKey: "learning.impact.groups.financial.title",
    labelDefault: "Financial impact",
    descKey: "learning.impact.groups.financial.desc",
    descDefault:
      "Direct costs and broader economic losses resulting from the event.",
    indicators: [
      {
        code: "Fa",
        labelKey: "learning.impact.indicators.fa.title",
        labelDefault: "Financial asset damages",
        descKey: "learning.impact.indicators.fa.desc",
        descDefault:
          "Direct losses to assets and the cost of emergency response. Includes damage to buildings, infrastructure, and equipment, as well as the cost of emergency services and care.",
      },
      {
        code: "Fb",
        labelKey: "learning.impact.indicators.fb.title",
        labelDefault: "Reduction of economic performance",
        descKey: "learning.impact.indicators.fb.desc",
        descDefault:
          "Indirect economic losses reflecting reduced value creation in Belgium. Quantified as a decline in GDP, growth in unemployment, or equivalent macroeconomic indicators.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function HowDoWeMeasureImpactPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.impact.title", "How do we measure impact?"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.impact.title", "How do we measure impact?"),
      url: "/learning/how-do-we-measure-impact",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.howmeasureimpact.title">
            How do we measure impact?
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.impact.intro">
            When a risk materialises, its consequences are rarely limited to a
            single domain. A major flood damages buildings, disrupts transport,
            displaces people, and may contaminate water sources. To capture this
            complexity, the BNRA measures impact across ten indicators spanning
            four domains: human, societal, environmental, and financial. Each
            indicator is estimated independently by experts for every risk
            scenario.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Overview strip                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.impact.overview.title">
            Four domains, ten indicators
          </Trans>
        </SectionTitle>

        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {INDICATOR_GROUPS.map((group) => (
            <Grid key={group.key} size={{ xs: 6, sm: 3 }}>
              <Box
                sx={{
                  backgroundColor: group.bgColor,
                  borderRadius: 2,
                  p: 1.5,
                  height: "100%",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 500, color: "rgba(0,0,0,0.7)", mb: 1 }}
                >
                  {t(group.labelKey, group.labelDefault)}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {group.indicators.map((ind) => (
                    <Chip
                      key={ind.code}
                      label={ind.code}
                      size="small"
                      sx={{
                        backgroundColor: group.color,
                        color: "rgba(0,0,0,0.7)",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 22,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.impact.overview.scale">
            Each indicator is scored on a scale from 0 to 7, where 0 means no
            impact and 7 represents the most severe level. The scale is
            constructed so that each step represents roughly an
            order-of-magnitude increase in severity, making it possible to
            meaningfully compare impacts across very different types of event
            severities.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Indicator groups                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.impact.indicators.title">
            The indicators in detail
          </Trans>
        </SectionTitle>

        <Grid container spacing={2}>
          {INDICATOR_GROUPS.map((group) => (
            <Grid key={group.key} size={{ xs: 12, sm: 6 }}>
              <GroupCard>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: group.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    {t(group.labelKey, group.labelDefault)}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6, mb: 2 }}
                >
                  {t(group.descKey, group.descDefault)}
                </Typography>

                <Box
                  sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    pt: 1.5,
                  }}
                >
                  {group.indicators.map((ind) => (
                    <IndicatorRow key={ind.code}>
                      <IndicatorBadge
                        sx={{
                          backgroundColor: group.bgColor,
                          color: "rgba(0,0,0,0.65)",
                        }}
                      >
                        {ind.code}
                      </IndicatorBadge>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            mb: 0.25,
                            color: "text.primary",
                          }}
                        >
                          {t(ind.labelKey, ind.labelDefault)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", lineHeight: 1.6 }}
                        >
                          {t(ind.descKey, ind.descDefault)}
                        </Typography>
                      </Box>
                    </IndicatorRow>
                  ))}
                </Box>
              </GroupCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Aggregation and TI                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.impact.aggregation.title">
            From ten indicators to a single score
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.impact.aggregation.intro">
            Ten separate indicators make for a rich and nuanced picture, but
            comparing risks across all of them simultaneously is complex. To
            enable objective comparison, the BNRA converts all indicators to a
            common monetary equivalent scale, using the financial asset damage
            indicator (Fa) as the reference unit. This conversion is based on
            established equivalences between financial damage and other forms of
            harm, such as the statistical value of a life or the economic cost
            of ecosystem degradation.
          </Trans>
        </Typography>

        <AggregationCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.impact.aggregation.ti.title">
              Total Impact (TI)
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.impact.aggregation.ti.body">
              Once all indicators are expressed on a common scale, they are
              aggregated into a single Total Impact score (TI), ranging from 0
              to 7. This score represents the overall severity of a scenario
              across all domains combined. Combined with the probability of the
              scenario, the TI score allows any two risks to be compared
              objectively, regardless of the nature of their consequences.
            </Trans>
          </Typography>

          <Box sx={{ mt: 2 }}>
            <ScaleBar>
              {[...Array(8)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    backgroundColor:
                      i === 0
                        ? "#e0e0e0"
                        : `rgba(244, 124, 124, ${0.15 + i * 0.12})`,
                    borderRight: i < 7 ? "2px solid white" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              ))}
            </ScaleBar>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}
            >
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                {t(
                  "learning.impact.aggregation.ti.scaleMin",
                  "TI 0 - no impact",
                )}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                {t(
                  "learning.impact.aggregation.ti.scaleMax",
                  "TI 7 - catastrophic",
                )}
              </Typography>
            </Box>
          </Box>
        </AggregationCard>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mt: 2 }}
        >
          <Trans i18nKey="learning.impact.aggregation.note">
            The individual indicator scores are always retained alongside the
            aggregated TI score. This means it is always possible to look beyond
            the summary figure and understand exactly which type of harm drives
            the impact of a given risk scenario.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Link to technical scales                                            */}
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
            <Trans i18nKey="learning.impact.technicalLink.title">
              Looking for the full scale definitions?
            </Trans>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Trans i18nKey="learning.impact.technicalLink.body">
              The exact thresholds, units, and weighting factors for each
              indicator are available in the technical reference section.
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
          <Trans i18nKey="learning.impact.technicalLink.button">
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
          to="/learning/what-is-a-risk"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.impact.prev">
            Previous: What is a risk?
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/how-do-we-measure-probability"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.impact.next">
            Next: How do we measure probability?
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
