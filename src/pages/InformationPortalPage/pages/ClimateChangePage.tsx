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

const AssumptionCard = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const AssumptionNumber = styled(Box)(({ theme }) => ({
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

const SCENARIO_COLORS = {
  Considerable: "#9DC3E6",
  Major: "#FFE699",
  Extreme: "#F47C7C",
};

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ClimateChangePage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.climate.title", "Climate change in the BNRA"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.climate.title", "Climate change in the BNRA"),
      url: "/learning/climate-change",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.climate.title">
            Climate change in the BNRA
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.climate.intro">
            Climate change is classified as an emerging risk in the BNRA because
            its future trajectory is inherently uncertain. But it occupies a
            unique position in the catalogue: unlike all other emerging risks,
            its effects on Belgium's risk landscape can be estimated
            quantitatively. This page explains how climate change is modelled,
            what assumptions underlie the analysis, and how to read the results
            in the platform.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Why quantitative                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.climate.why.title">
            Why climate change is treated differently
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.climate.why.body">
            Most emerging risks are assessed qualitatively because too little is
            known about their trajectory to produce reliable numbers. Climate
            change is different: decades of scientific research, extensive
            measurement networks, and internationally validated modelling have
            produced well-established projections of how the climate will evolve
            under different emissions scenarios. These projections are
            sufficiently robust to translate into changes in the probability of
            specific hazard types — flooding, drought, storms, heatwaves —
            making a quantitative treatment both possible and meaningful.
          </Trans>
        </Typography>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.climate.why.scope.title">
              Scope: probability only, not impact
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.climate.why.scope.body">
              The climate change analysis estimates how the probability of
              affected risks changes between 2023 and 2050. The impact
              associated with each intensity scenario is assumed to remain
              constant over time — the scenarios themselves do not change, and
              no additional adaptation measures are assumed to be taken between
              now and 2050. Only the likelihood of each scenario occurring is
              re-estimated for the future period.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Key assumptions                                                     */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.climate.assumptions.title">
            Key assumptions
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.climate.assumptions.intro">
            To make the analysis tractable, a set of explicit assumptions was
            agreed upon before the assessment began. These are documented here
            so that readers can understand the conditions under which the
            results are valid.
          </Trans>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {[
            {
              n: 1,
              titleKey: "learning.climate.assumptions.1.title",
              titleDefault: "Target period: 2050-2053",
              bodyKey: "learning.climate.assumptions.1.body",
              bodyDefault:
                "The analysis estimates probabilities for the period 2050-2053, chosen because it overlaps with strategic planning horizons currently under development at national and European level. This gives the results direct policy relevance.",
            },
            {
              n: 2,
              titleKey: "learning.climate.assumptions.2.title",
              titleDefault: "Probability change only",
              bodyKey: "learning.climate.assumptions.2.body",
              bodyDefault:
                "Only the probability of risk scenarios is re-estimated for 2050. The impact levels associated with the considerable, major, and extreme scenarios are assumed to remain unchanged — the scenarios describe what the event looks like, not how often it happens.",
            },
            {
              n: 3,
              titleKey: "learning.climate.assumptions.3.title",
              titleDefault: "No additional adaptation",
              bodyKey: "learning.climate.assumptions.3.body",
              bodyDefault:
                "The 2050 estimates assume that no additional adaptation or mitigation measures are taken between 2023 and 2050. This is a conservative assumption that gives an upper bound on how much risk increases under climate change.",
            },
            {
              n: 4,
              titleKey: "learning.climate.assumptions.4.title",
              titleDefault: "Direct effects only for directly affected risks",
              bodyKey: "learning.climate.assumptions.4.body",
              bodyDefault:
                "Not all risks are directly affected by climate change. Only standard risks for which a direct physical link to climate exists — such as flooding, drought, or heatwaves — have their direct probability re-estimated. Other risks may still be indirectly affected through cascade chains from directly affected risks.",
            },
            {
              n: 5,
              titleKey: "learning.climate.assumptions.5.title",
              titleDefault: "Single climate pathway",
              bodyKey: "learning.climate.assumptions.5.body",
              bodyDefault:
                "A single high-end emissions scenario is used: either the SSP5-8.5 trajectory from the IPCC 6th Assessment Report, or the equivalent RCP5-8.5 concentration pathway from the 5th Assessment Report, depending on the risk. This pathway assumes an energy-intensive, fossil-fuel-based economy and represents a high-impact scenario.",
            },
          ].map((a) => (
            <AssumptionCard key={a.n}>
              <AssumptionNumber>{a.n}</AssumptionNumber>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 500, mb: 0.5 }}
                >
                  {t(a.titleKey, a.titleDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", lineHeight: 1.6 }}
                >
                  {t(a.bodyKey, a.bodyDefault)}
                </Typography>
              </Box>
            </AssumptionCard>
          ))}
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Direct vs indirect                                                  */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.climate.direct.title">
            Direct and indirect influence
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.climate.direct.body">
            Climate change affects risks through two distinct mechanisms.
            Understanding the difference is important for interpreting the
            results correctly.
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
                <Trans i18nKey="learning.climate.direct.direct.title">
                  Directly influenced risks
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1.5 }}
              >
                <Trans i18nKey="learning.climate.direct.direct.body">
                  Risks whose own physical mechanism is directly driven by
                  climate variables. Heatwaves, river flooding, coastal
                  flooding, droughts, and storms all fall into this category.
                  For these risks, experts re-estimated the direct probability
                  under the 2050 climate scenario. Their "no underlying cause"
                  probability bar in the Risk Evolution chart changes between
                  2023 and 2050.
                </Trans>
              </Typography>
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                {["Heatwaves", "River flooding", "Drought", "Storms"].map(
                  (r) => (
                    <Chip
                      key={r}
                      label={r}
                      size="small"
                      sx={{
                        backgroundColor: "#EEF7E8",
                        color: "rgba(0,0,0,0.65)",
                        fontSize: "0.7rem",
                        height: 22,
                      }}
                    />
                  ),
                )}
              </Box>
            </SplitCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.climate.direct.indirect.title">
                  Indirectly influenced risks
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1.5 }}
              >
                <Trans i18nKey="learning.climate.direct.indirect.body">
                  Risks that are not directly driven by climate but that are
                  triggered by, or dependent on, risks that are directly
                  affected. A dam failure, for example, becomes more likely not
                  because climate directly causes dam failures, but because more
                  frequent and severe river flooding increases the load on dams.
                  Almost every risk is indirectly influenced to some degree,
                  though often by negligible amounts.
                </Trans>
              </Typography>
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                {[
                  "Dam failure",
                  "Landslides",
                  "Wildfire",
                  "Supply disruptions",
                ].map((r) => (
                  <Chip
                    key={r}
                    label={r}
                    size="small"
                    sx={{
                      backgroundColor: "#EAF3FB",
                      color: "rgba(0,0,0,0.65)",
                      fontSize: "0.7rem",
                      height: 22,
                    }}
                  />
                ))}
              </Box>
            </SplitCard>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.climate.direct.note">
            An important consequence of this distinction: only directly
            influenced risks had their direct probability re-estimated by
            experts. Indirectly influenced risks automatically inherit changes
            through the cascade model — if flooding becomes more frequent,
            everything that flooding can cause also becomes indirectly more
            frequent, without requiring a separate expert elicitation for each
            downstream risk.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* How to read the chart                                               */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.climate.chart.title">
            Reading the Risk Evolution chart
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.climate.chart.body">
            The Risk Evolution chart on each standard risk file page shows the
            total, direct, and indirect probabilities for all three scenarios in
            both 2023 and 2050. Here is how to interpret it:
          </Trans>
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {[
            {
              titleKey: "learning.climate.chart.structure.title",
              titleDefault: "Chart structure",
              bodyKey: "learning.climate.chart.structure.body",
              bodyDefault:
                "The total probability for the risk sits at the top of the chart. Below it, the contributing causes are listed in descending order of how much they change between 2023 and 2050 — the causes that change most due to climate change appear highest in the list.",
            },
            {
              titleKey: "learning.climate.chart.scenarios.title",
              titleDefault: "Three scenarios, three colours",
              bodyKey: "learning.climate.chart.scenarios.body",
              bodyDefault:
                "All probability values are shown for all three scenarios simultaneously, using the platform's standard colour coding.",
            },
            {
              titleKey: "learning.climate.chart.changes.title",
              titleDefault: "Red and green bars",
              bodyKey: "learning.climate.chart.changes.body",
              bodyDefault:
                "When comparing 2023 to 2050, increases in probability are shown in red and decreases in green. Hovering over any element shows the exact probability values for both years and the percentage change.",
            },
            {
              titleKey: "learning.climate.chart.indirect.title",
              titleDefault: "Indirect causes in the chart",
              bodyKey: "learning.climate.chart.indirect.body",
              bodyDefault:
                "The causing risks shown in the chart are not necessarily the most important causes of the risk overall — they are the causes that change most due to climate change. For the full picture of what causes a risk, see the Sankey diagram on the Risk Analysis page.",
            },
          ].map((item) => (
            <SplitCard key={item.titleKey} sx={{ height: "auto" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                {t(item.titleKey, item.titleDefault)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                {t(item.bodyKey, item.bodyDefault)}
              </Typography>
            </SplitCard>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {Object.entries(SCENARIO_COLORS).map(([label, color]) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{
                backgroundColor: color,
                color: "rgba(0,0,0,0.7)",
                fontWeight: 500,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Qualitative section                                                 */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.climate.quali.title">
            Qualitative reasoning
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.climate.quali.body">
            Below every Risk Evolution chart, a qualitative section provides the
            reasoning behind the quantitative results. For risks that are
            directly influenced by climate change, this section contains a
            summary of the expert input gathered during the assessment and an
            analysis of the chart. For risks that are only indirectly
            influenced, the section consists of an analysis of the chart alone,
            explaining which upstream risks are driving the change and why.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Navigation                                                          */}
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
          to="/learning/aggregation-and-reporting"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.climate.prev">
            Previous: Aggregation and reporting
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning"
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.climate.portal">
            Back to information portal
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
