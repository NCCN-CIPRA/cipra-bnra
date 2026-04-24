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
import { Trans, useTranslation } from "react-i18next";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import usePageTitle from "../../../hooks/usePageTitle";
import { Link as RouterLink } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  paddingBottom: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const IndicatorTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
}));

const ScaleRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td": { borderBottom: "none" },
  "&:hover": { backgroundColor: theme.palette.grey[50] },
  verticalAlign: "top",
}));

const NoteBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 2),
  marginTop: theme.spacing(1),
}));

const GroupDivider = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.divider}`,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

const GroupDot = styled(Box)(() => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  flexShrink: 0,
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// Scale colors: green (low impact) to red (severe)
const SCALE_COLORS = [
  "#F5F5F5", // 0
  "#E8F5E9", // 1
  "#C8E6C9", // 2
  "#A5D6A7", // 3
  "#FFE082", // 4
  "#FFCA28", // 5
  "#FF8A65", // 6
  "#EF5350", // 7
];

const GROUPS = [
  {
    key: "human",
    color: "#F47C7C",
    labelKey: "learning.impactscales.groups.human",
    labelDefault: "Human impact",
    indicators: [
      {
        code: "Ha",
        nameKey: "learning.impactscales.ha.name",
        nameDefault: "Ha - Fatalities",
        descKey: "learning.impactscales.ha.desc",
        descDefault:
          "Deaths that can be directly attributed to the event. Only deaths of Belgian citizens or deaths within Belgian economic borders are counted.",
        unit: "Number of people deceased",
        rows: [
          {
            scale: "Ha0",
            value: "0 (No or negligible impact / Not applicable)",
          },
          { scale: "Ha1", value: "1" },
          { scale: "Ha2", value: "2 - 5" },
          { scale: "Ha3", value: "6 - 25" },
          { scale: "Ha4", value: "26 - 250" },
          { scale: "Ha5", value: "251 - 1,500" },
          { scale: "Ha6", value: "1,501 - 10,000" },
          { scale: "Ha7", value: "> 10,000" },
        ],
        note: null,
        weightTable: null,
      },
      {
        code: "Hb",
        nameKey: "learning.impactscales.hb.name",
        nameDefault: "Hb - Injured and sick people",
        descKey: "learning.impactscales.hb.desc",
        descDefault:
          "People affected by physical or mental injuries or illness directly attributable to the event. Deaths are counted under Ha, not Hb. People requiring only one-time emergency psychological care are counted under Hc.",
        unit: "Number of weighted sick / injured people",
        rows: [
          {
            scale: "Hb0",
            value: "0 (No or negligible impact / Not applicable)",
          },
          { scale: "Hb1", value: "< 5" },
          { scale: "Hb2", value: "5 - 50" },
          { scale: "Hb3", value: "51 - 250" },
          { scale: "Hb4", value: "251 - 2,500" },
          { scale: "Hb5", value: "2,501 - 15,000" },
          { scale: "Hb6", value: "15,001 - 100,000" },
          { scale: "Hb7", value: "> 100,000" },
        ],
        note: "Injuries are aggregated using severity weighting factors before the total is assigned a scale class.",
        weightTable: {
          headers: ["Severity level", "Injury", "Illness", "Weight"],
          rows: [
            [
              "Severe",
              "Hospital stay of at least 7 days",
              "Chronic illness requiring ongoing medical treatment",
              "1",
            ],
            [
              "Moderate",
              "Hospital stay of 1 to 6 days",
              "Persistent illness requiring treatment; full recovery expected",
              "0.1",
            ],
            [
              "Minor",
              "Medical attention, no hospital stay, no lasting harm",
              "Minor illness requiring treatment; full recovery",
              "0.003",
            ],
          ],
        },
      },
      {
        code: "Hc",
        nameKey: "learning.impactscales.hc.name",
        nameDefault: "Hc - People in need of assistance",
        descKey: "learning.impactscales.hc.desc",
        descDefault:
          "People who must be evacuated, temporarily housed, or otherwise cared for before, during, and after an event. Measured in person-days (number of people multiplied by the number of days they require assistance). Supply shortfalls for large populations are counted under Sa, not Hc.",
        unit: "Person-days",
        rows: [
          {
            scale: "Hc0",
            value: "0 (No or negligible impact / Not applicable)",
          },
          { scale: "Hc1", value: "< 15,000" },
          { scale: "Hc2", value: "15,001 - 100,000" },
          { scale: "Hc3", value: "100,001 - 500,000" },
          { scale: "Hc4", value: "500,001 - 5,000,000" },
          { scale: "Hc5", value: "5,000,000 - 25,000,000" },
          { scale: "Hc6", value: "25,000,001 - 250,000,000" },
          { scale: "Hc7", value: "> 250,000,000" },
        ],
        note: "Example: 10 people requiring shelter for 100 days = 1,000 person-days. The cost of providing support services is counted under Fa.",
        weightTable: null,
      },
    ],
  },
  {
    key: "societal",
    color: "#9DC3E6",
    labelKey: "learning.impactscales.groups.societal",
    labelDefault: "Societal impact",
    indicators: [
      {
        code: "Sa",
        nameKey: "learning.impactscales.sa.name",
        nameDefault: "Sa - Supply shortfalls and unmet human needs",
        descKey: "learning.impactscales.sa.desc",
        descDefault:
          "Breakdowns or severe disruptions to the supply of critical goods and services. Measured in person-days, weighted by the importance of the unmet need.",
        unit: "Weighted person-days",
        rows: [
          {
            scale: "Sa0",
            value: "0 (No or negligible impact / Not applicable)",
          },
          { scale: "Sa1", value: "< 500" },
          { scale: "Sa2", value: "501 - 5,000" },
          { scale: "Sa3", value: "5,001 - 25,000" },
          { scale: "Sa4", value: "25,001 - 250,000" },
          { scale: "Sa5", value: "250,001 - 1,500,000" },
          { scale: "Sa6", value: "1,500,001 - 10,000,000" },
          { scale: "Sa7", value: "> 10,000,000" },
        ],
        note: "Need importance weighting factors are applied before totalling.",
        weightTable: {
          headers: ["Need category", "Examples", "Weight"],
          rows: [
            [
              "Physical needs",
              "Potable water, basic foodstuffs, medicine, emergency services, first responder communications",
              "1",
            ],
            [
              "Security needs",
              "Electricity, heating, non-emergency medical care, telecommunications, transport, financial services",
              "0.5",
            ],
            [
              "Comfort needs",
              "Fuel, media, waste management, government services, postal and courier services",
              "0.1",
            ],
          ],
        },
      },
      {
        code: "Sb",
        nameKey: "learning.impactscales.sb.name",
        nameDefault: "Sb - Diminished public order and domestic security",
        descKey: "learning.impactscales.sb.desc",
        descDefault:
          "People whose daily lives are adversely restricted by domestic unrest or insecurity. Measured in person-days. Note: this indicator counts people affected by the consequences of unrest (e.g. afraid to go outside), not people participating in demonstrations.",
        unit: "Person-days",
        rows: [
          {
            scale: "Sb0",
            value: "0 (No or negligible impact / Not applicable)",
          },
          { scale: "Sb1", value: "< 5,000" },
          { scale: "Sb2", value: "10,001 - 50,000" },
          { scale: "Sb3", value: "50,001 - 250,000" },
          { scale: "Sb4", value: "250,001 - 2,500,000" },
          { scale: "Sb5", value: "2,500,001 - 15,000,000" },
          { scale: "Sb6", value: "15,000,001 - 100,000,000" },
          { scale: "Sb7", value: "> 100,000,000" },
        ],
        note: null,
        weightTable: null,
      },
      {
        code: "Sc",
        nameKey: "learning.impactscales.sc.name",
        nameDefault: "Sc - Damage to the reputation of Belgium",
        descKey: "learning.impactscales.sc.desc",
        descDefault:
          "Significance and duration of reputational loss for Belgium abroad. Assessed qualitatively; the descriptions below should be understood as peak values rather than hard limits.",
        unit: "Qualitative",
        rows: [
          { scale: "Sc0", value: "No or negligible impact / Not applicable" },
          {
            scale: "Sc1",
            value:
              "Damage lasting only a few days, related to issues of medium importance (e.g. negative coverage in foreign media).",
          },
          {
            scale: "Sc2",
            value:
              "Damage lasting one to a few weeks, related to important issues.",
          },
          {
            scale: "Sc3",
            value:
              "Damage lasting several weeks, related to important issues, with minor impact on Belgium's international standing.",
          },
          {
            scale: "Sc4",
            value:
              "Considerable damage lasting several weeks, with impact on Belgium's international standing and cooperation (e.g. termination of significant agreements, expulsion of Belgian ambassador).",
          },
          {
            scale: "Sc5",
            value:
              "Considerable damage lasting several months, with impact on international standing and cooperation.",
          },
          {
            scale: "Sc6",
            value:
              "Considerable damage lasting several months to years, with impact on international standing and cooperation.",
          },
          {
            scale: "Sc7",
            value:
              "Lasting, severe, or irreversible loss of reputation with far-reaching impact on Belgium's international standing (e.g. political isolation, boycotts).",
          },
        ],
        note: null,
        weightTable: null,
      },
      {
        code: "Sd",
        nameKey: "learning.impactscales.sd.name",
        nameDefault: "Sd - Loss of confidence in or functioning of the state",
        descKey: "learning.impactscales.sd.desc",
        descDefault:
          "Significance of loss of public confidence in state institutions, or impairment of state functions. Assessed qualitatively; the descriptions below should be understood as peak values rather than hard limits.",
        unit: "Qualitative",
        rows: [
          { scale: "Sd0", value: "No or negligible impact / Not applicable" },
          { scale: "Sd1", value: "-" },
          {
            scale: "Sd2",
            value:
              "Impairment of confidence related to issues of medium significance (e.g. very critical media coverage), possible threat of impairment of a state function lasting a few days.",
          },
          {
            scale: "Sd3",
            value:
              "Damage to confidence related to significant issues (e.g. extremely critical media coverage, occasional demonstrations), partial impairment of a state function lasting one to a few weeks.",
          },
          {
            scale: "Sd4",
            value:
              "Damage to confidence related to significant issues (e.g. strikes, larger demonstrations), impairment of a state function or infringement of some citizens' rights lasting several weeks to a few months.",
          },
          {
            scale: "Sd5",
            value:
              "Considerable damage to general confidence (e.g. extended strikes, mass demonstrations), impairment of some state functions or partial infringement of citizens' rights lasting several months to a year.",
          },
          { scale: "Sd6", value: "-" },
          {
            scale: "Sd7",
            value:
              "Lasting, severe, or irreversible loss of general confidence (e.g. formation of vigilante groups), total impairment of state functions or massive and widespread infringement of citizens' rights.",
          },
        ],
        note: null,
        weightTable: null,
      },
    ],
  },
  {
    key: "environmental",
    color: "#A9D18E",
    labelKey: "learning.impactscales.groups.environmental",
    labelDefault: "Environmental impact",
    indicators: [
      {
        code: "Ea",
        nameKey: "learning.impactscales.ea.name",
        nameDefault: "Ea - Damaged ecosystems",
        descKey: "learning.impactscales.ea.desc",
        descDefault:
          "Ecosystems (forests, agricultural land, watercourses, wetlands, etc.) that are seriously damaged and will recover very slowly, if ever. Measured as affected area multiplied by duration of adverse effects. Economic impacts of ecosystem damage are counted under Fa and Fb, not Ea.",
        unit: "km² x years",
        rows: [
          {
            scale: "Ea0",
            value: "0 (No or negligible impact / Not applicable)",
          },
          { scale: "Ea1", value: "< 500" },
          { scale: "Ea2", value: "51 - 500" },
          { scale: "Ea3", value: "501 - 2,500" },
          { scale: "Ea4", value: "2,501 - 25,000" },
          { scale: "Ea5", value: "25,001 - 150,000" },
          { scale: "Ea6", value: "150,001 - 1,000,000" },
          { scale: "Ea7", value: "> 1,000,000" },
        ],
        note: "An area under the influence of multiple effects is counted only once. Duration is measured until the ecosystem returns to normal.",
        weightTable: null,
      },
    ],
  },
  {
    key: "financial",
    color: "#FFE699",
    labelKey: "learning.impactscales.groups.financial",
    labelDefault: "Financial impact",
    indicators: [
      {
        code: "Fa",
        nameKey: "learning.impactscales.fa.name",
        nameDefault: "Fa - Financial asset damages",
        descKey: "learning.impactscales.fa.desc",
        descDefault:
          "Losses to existing assets and the cost of coping. Includes damage to buildings and equipment, as well as emergency response costs. All damage is counted regardless of whether insurance or the state covers the cost.",
        unit: "Euros",
        rows: [
          { scale: "Fa0", value: "€0 (No impact / Not applicable)" },
          { scale: "Fa1", value: "< €2.5 million" },
          { scale: "Fa2", value: "€2.5 - 25 million" },
          { scale: "Fa3", value: "€25 - 150 million" },
          { scale: "Fa4", value: "€150 million - €1 billion" },
          { scale: "Fa5", value: "€1 - 10 billion" },
          { scale: "Fa6", value: "€10 - 50 billion" },
          { scale: "Fa7", value: "> €50 billion" },
        ],
        note: "Scale intervals follow approximately: y = e^(1.92(x ± 0.5) + 13.2). This formula is used for calculations but has no direct physical interpretation.",
        weightTable: null,
      },
      {
        code: "Fb",
        nameKey: "learning.impactscales.fb.name",
        nameDefault: "Fb - Reduction of economic performance",
        descKey: "learning.impactscales.fb.desc",
        descDefault:
          "Indirect economic effects that reduce future value creation in Belgium, as opposed to Fa which covers direct asset damage. Expressed as GDP reduction, governmental debt increase, or growth in unemployment.",
        unit: "Euro-equivalents (GDP)",
        rows: [
          { scale: "Fb0", value: "€0 (No impact)" },
          {
            scale: "Fb1",
            value: "< €2.5 million   |   < 0.1% unemployment growth",
          },
          {
            scale: "Fb2",
            value: "€2.5 - 25 million   |   0.1% - 1% unemployment growth",
          },
          {
            scale: "Fb3",
            value: "€25 - 150 million   |   1% - 10% unemployment growth",
          },
          {
            scale: "Fb4",
            value:
              "€150 million - €1 billion   |   10% - 20% unemployment growth",
          },
          {
            scale: "Fb5",
            value: "€1 - 10 billion   |   20% - 50% unemployment growth",
          },
          {
            scale: "Fb6",
            value: "€10 - 50 billion   |   50% - 75% unemployment growth",
          },
          {
            scale: "Fb7",
            value: "> €50 billion   |   > 75% unemployment growth",
          },
        ],
        note: "Multiple equivalent interpretations are provided (GDP reduction, government debt increase, unemployment growth) to help experts without a financial background assess this indicator.",
        weightTable: null,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function IndicatorTable({
  rows,
}: {
  rows: { scale: string; value: string }[];
}) {
  return (
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
            <TableCell sx={{ fontWeight: 500, width: 60 }}>Scale</TableCell>
            <TableCell sx={{ fontWeight: 500 }}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <ScaleRow key={row.scale}>
              <TableCell>
                <Chip
                  label={row.scale}
                  size="small"
                  sx={{
                    backgroundColor: SCALE_COLORS[i],
                    color: "rgba(0,0,0,0.7)",
                    fontWeight: 500,
                    fontSize: "0.7rem",
                    height: 22,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                />
              </TableCell>
              <TableCell
                sx={{
                  color: row.value === "-" ? "text.disabled" : "text.secondary",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                }}
              >
                {row.value}
              </TableCell>
            </ScaleRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function WeightTable({
  table,
}: {
  table: { headers: string[]; rows: string[][] };
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        mt: 1.5,
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "grey.100" }}>
            {table.headers.map((h) => (
              <TableCell key={h} sx={{ fontWeight: 500, fontSize: "0.78rem" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {table.rows.map((row, i) => (
            <ScaleRow key={i}>
              {row.map((cell, j) => (
                <TableCell
                  key={j}
                  sx={{
                    fontSize: "0.78rem",
                    lineHeight: 1.5,
                    fontFamily: j === row.length - 1 ? "monospace" : "inherit",
                    fontWeight: j === row.length - 1 ? 500 : 400,
                    color:
                      j === row.length - 1 ? "text.primary" : "text.secondary",
                  }}
                >
                  {cell}
                </TableCell>
              ))}
            </ScaleRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ImpactScalesPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.impactscales.title", "Impact scales"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.impactscales.title", "Impact scales"),
      url: "/learning/impact-scales",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.impactscales.title">Impact scales</Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.impactscales.intro">
            This page provides the full set of ten impact indicator scales used
            in the BNRA framework, grouped by domain. Each indicator runs from 0
            (no impact) to 7 (catastrophic), with intervals calibrated so that
            equivalent class numbers across different indicators represent
            approximately comparable levels of harm.
          </Trans>
        </Typography>

        {/* Quick reference chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
          {GROUPS.map((g) => (
            <Box
              key={g.key}
              component="a"
              href={`#group-${g.key}`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.25,
                py: 0.4,
                borderRadius: 20,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                textDecoration: "none",
                fontSize: "0.78rem",
                color: "text.secondary",
                fontWeight: 500,
                "&:hover": { backgroundColor: "grey.50" },
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: g.color,
                }}
              />
              {t(g.labelKey, g.labelDefault)}
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {g.indicators.map((ind) => (
                  <Chip
                    key={ind.code}
                    label={ind.code}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.65rem",
                      backgroundColor: "grey.100",
                    }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Design principles                                                   */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.impactscales.principles.title">
            Scale design principles
          </Trans>
        </SectionTitle>

        <Grid container spacing={2}>
          {[
            {
              titleKey: "learning.impactscales.principles.equivalence.title",
              titleDefault: "Cross-indicator equivalence",
              bodyKey: "learning.impactscales.principles.equivalence.body",
              bodyDefault:
                "Scale class 3 on Ha (fatalities) is calibrated to represent a comparable degree of harm to class 3 on Ea (ecosystem damage) or Fa (financial losses). This allows all indicators to be aggregated into a single Total Impact score.",
            },
            {
              titleKey: "learning.impactscales.principles.logarithmic.title",
              titleDefault: "Logarithmic intervals",
              bodyKey: "learning.impactscales.principles.logarithmic.body",
              bodyDefault:
                "Intervals increase exponentially between classes, allowing the scales to span many orders of magnitude. Each step represents roughly a 10x increase in the underlying quantity.",
            },
            {
              titleKey: "learning.impactscales.principles.direct.title",
              titleDefault: "Direct impact only",
              bodyKey: "learning.impactscales.principles.direct.body",
              bodyDefault:
                "When assessing impact, always assume the scenario has already occurred and estimate only the direct consequences — not the additional impacts that may cascade to other risks. Cascade impacts are estimated separately.",
            },
            {
              titleKey: "learning.impactscales.principles.adaptation.title",
              titleDefault: "Adaptation for other levels",
              bodyKey: "learning.impactscales.principles.adaptation.body",
              bodyDefault:
                "Scale interval boundaries may be adapted for specific operational contexts, provided the fundamental units, conceptual framework, and cross-indicator equivalence relationships are preserved.",
            },
          ].map((card) => (
            <Grid key={card.titleKey} size={{ xs: 12, sm: 6 }}>
              <Paper
                sx={{
                  p: 2,
                  boxShadow: "none",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  height: "100%",
                }}
              >
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
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Indicator groups                                                    */}
      {/* ------------------------------------------------------------------ */}
      {GROUPS.map((group) => (
        <Box key={group.key} id={`group-${group.key}`}>
          <GroupDivider>
            <GroupDot sx={{ backgroundColor: group.color }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {t(group.labelKey, group.labelDefault)}
            </Typography>
          </GroupDivider>

          {group.indicators.map((indicator) => (
            <Box key={indicator.code} sx={{ mb: 4 }}>
              <IndicatorTitle variant="subtitle1">
                {t(indicator.nameKey, indicator.nameDefault)}
              </IndicatorTitle>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
              >
                {t(indicator.descKey, indicator.descDefault)}
              </Typography>

              <IndicatorTable rows={indicator.rows} />

              {indicator.weightTable && (
                <WeightTable table={indicator.weightTable} />
              )}

              {indicator.note && (
                <NoteBox>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                      display: "block",
                    }}
                  >
                    {indicator.note}
                  </Typography>
                </NoteBox>
              )}
            </Box>
          ))}
        </Box>
      ))}

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
            <Trans i18nKey="learning.scales.download.title">
              Standard scales for probability and impact document
            </Trans>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            <Trans i18nKey="learning.scales.download.body">
              A document with all standardised scales for probability and impact
              is available for download. For questions or feedback, contact the
              NCCN at cipra.bnra@nccn.fgov.be.
            </Trans>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0, flexWrap: "wrap" }}>
          {/* TODO: replace href with the actual hosted URL for the guidelines PDF */}
          <Button
            href="https://bnra.powerappsportals.com/documents/BNRA-standardised-scales.pdf"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<DownloadIcon />}
            variant="outlined"
            size="small"
          >
            <Trans i18nKey="learning.scales.download.button">
              Download PDF
            </Trans>
          </Button>
          <Button
            href="mailto:cipra.bnra@nccn.fgov.be"
            startIcon={<OpenInNewIcon sx={{ fontSize: "14px !important" }} />}
            variant="outlined"
            size="small"
          >
            <Trans i18nKey="learning.scales.contact.button">Contact NCCN</Trans>
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
