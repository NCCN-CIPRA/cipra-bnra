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

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// Green to red gradient for probability scales (increasing likelihood)
const P_COLORS = [
  "#F5F5F5", // P0 - impossible
  "#E8F5E9", // P1
  "#C8E6C9", // P2
  "#A5D6A7", // P3
  "#FFE082", // P4
  "#FFCA28", // P5
  "#FF8A65", // P6
  "#EF5350", // P7
];

const P_SCALE = [
  { code: "P0", returnPeriod: "Never", likelihood: "0%", desc: "Impossible" },
  {
    code: "P1",
    returnPeriod: "> 5,000 years",
    likelihood: "< 0.05%",
    desc: "Extremely unlikely; never happened before but not impossible",
  },
  {
    code: "P2",
    returnPeriod: "500 - 5,000 years",
    likelihood: "0.05% - 0.5%",
    desc: "Very unlikely; few, if any, known events worldwide",
  },
  {
    code: "P3",
    returnPeriod: "50 - 500 years",
    likelihood: "0.5% - 5%",
    desc: "Unlikely; may have occurred in Belgium, but possibly some generations ago",
  },
  {
    code: "P4",
    returnPeriod: "5 - 50 years",
    likelihood: "5% - 50%",
    desc: "Likely; on average, one event in Belgium during a human lifespan",
  },
  {
    code: "P5",
    returnPeriod: "0.5 - 5 years",
    likelihood: "50% - 99%",
    desc: "Very likely; a few events in Belgium during a human lifespan",
  },
  {
    code: "P6",
    returnPeriod: "1 - 6 months",
    likelihood: "> 99%",
    desc: "Almost certain; multiple events in Belgium during a human lifespan",
  },
  {
    code: "P7",
    returnPeriod: "< 1 month",
    likelihood: "~100%",
    desc: "Essentially certain; multiple yearly occurrences",
  },
];

const M_SCALE = [
  {
    code: "M0",
    returnPeriod: "Never",
    likelihood: "< 0.01%",
    desc: "Essentially impossible",
  },
  {
    code: "M1",
    returnPeriod: "> 30 years",
    likelihood: "0.01% - 10%",
    desc: "Very improbable",
  },
  {
    code: "M2",
    returnPeriod: "10 - 30 years",
    likelihood: "10% - 25%",
    desc: "Improbable",
  },
  {
    code: "M3",
    returnPeriod: "6 - 10 years",
    likelihood: "25% - 40%",
    desc: "Not likely",
  },
  {
    code: "M4",
    returnPeriod: "4 - 6 years",
    likelihood: "40% - 55%",
    desc: "Possible",
  },
  {
    code: "M5",
    returnPeriod: "2 - 4 years",
    likelihood: "55% - 75%",
    desc: "Likely",
  },
  {
    code: "M6",
    returnPeriod: "1 - 2 years",
    likelihood: "75% - 90%",
    desc: "Very likely",
  },
  {
    code: "M7",
    returnPeriod: "< 1 year",
    likelihood: "90% - 100%",
    desc: "Almost certain",
  },
];

const CP_SCALE = [
  {
    code: "CP0",
    likelihood: "< 0.01%",
    odds: "Less than 1 in 10,000",
    desc: "Causing incident will essentially never lead to the cascade effect",
  },
  {
    code: "CP1",
    likelihood: "0.01% - 10%",
    odds: "Around 1 in 20",
    desc: "Causing incident will almost never lead to the cascade effect",
  },
  {
    code: "CP2",
    likelihood: "10% - 25%",
    odds: "Around 1 in 6",
    desc: "Causing incident will very unlikely lead to the cascade effect",
  },
  {
    code: "CP3",
    likelihood: "25% - 40%",
    odds: "Around 1 in 3",
    desc: "Causing incident will probably not lead to the cascade effect",
  },
  {
    code: "CP4",
    likelihood: "40% - 55%",
    odds: "Around 1 in 2",
    desc: "Causing incident will probably lead to the cascade effect",
  },
  {
    code: "CP5",
    likelihood: "55% - 75%",
    odds: "Around 2 in 3",
    desc: "Causing incident will often lead to the cascade effect",
  },
  {
    code: "CP6",
    likelihood: "75% - 90%",
    odds: "Around 5 in 6",
    desc: "Causing incident will very likely lead to the cascade effect",
  },
  {
    code: "CP7",
    likelihood: "90% - 100%",
    odds: "Around 19 in 20",
    desc: "Causing incident will almost certainly lead to the cascade effect",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ProbabilityScalesPage() {
  const { t } = useTranslation();

  usePageTitle(
    t("learning.probscales.title", "Probability and cascade scales"),
  );
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.probscales.title", "Probability and cascade scales"),
      url: "/learning/probability-scales",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.probscales.title">
            Probability and cascade scales
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.probscales.intro">
            This page provides a structured reference for the three probability
            scales used in the BNRA framework: the direct probability scale (P),
            the malicious actor motivation scale (M), and the conditional
            probability scale (CP) used to quantify cascade links. All scales
            are designed to be used consistently across all levels of government
            and vital sector risk analyses.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Direct probability scale                                            */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.probscales.p.title">
            Direct probability scale (P0 - P7)
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.probscales.p.body">
            Used to express the likelihood of a standard risk scenario occurring
            due to its own internal causes. Expressed as a return period
            (average time between occurrences) or equivalently as the three-year
            likelihood of at least one occurrence.
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
                <TableCell sx={{ fontWeight: 500, width: 60 }}>Scale</TableCell>
                <TableCell sx={{ fontWeight: 500, width: 180 }}>
                  Return period
                </TableCell>
                <TableCell sx={{ fontWeight: 500, width: 130 }}>
                  3-year likelihood
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  Qualitative description
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {P_SCALE.map((row, i) => (
                <ScaleRow key={row.code}>
                  <TableCell>
                    <Chip
                      label={row.code}
                      size="small"
                      sx={{
                        backgroundColor: P_COLORS[i],
                        color: "rgba(0,0,0,0.7)",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 22,
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.returnPeriod}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.primary",
                      fontSize: "0.8rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {row.likelihood}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.8rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {row.desc}
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <NoteBox>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", lineHeight: 1.6, display: "block" }}
          >
            <Trans i18nKey="learning.probscales.p.note">
              <strong>Technical note:</strong> The 3-year likelihoods above
              reflect the probability of exceedance (one or more events). For
              calculations, convert to a daily probability using the Poisson
              formula: P_daily = 1 - exp((1/30.437) / RP_months), where
              RP_months is the return period expressed in months. Scale
              intervals approximately follow RP = e^(12 - 2.3 x P).
            </Trans>
          </Typography>
        </NoteBox>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Motivation scale                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.probscales.m.title">
            Malicious actor motivation scale (M0 - M7)
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.probscales.m.body">
            Used for malicious actor risks instead of the direct probability
            scale. Expresses the probability that an actor group, at a given
            capability level, successfully carries out an attack within the
            three-year analysis window. The scale is calibrated to shorter
            timescales than the P scale because human intent and capability
            cannot be meaningfully predicted over centuries.
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
                <TableCell sx={{ fontWeight: 500, width: 60 }}>Scale</TableCell>
                <TableCell sx={{ fontWeight: 500, width: 180 }}>
                  Return period
                </TableCell>
                <TableCell sx={{ fontWeight: 500, width: 130 }}>
                  3-year likelihood
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  Qualitative description
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {M_SCALE.map((row, i) => (
                <ScaleRow key={row.code}>
                  <TableCell>
                    <Chip
                      label={row.code}
                      size="small"
                      sx={{
                        backgroundColor: P_COLORS[i],
                        color: "rgba(0,0,0,0.7)",
                        fontWeight: 500,
                        fontSize: "0.7rem",
                        height: 22,
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.returnPeriod}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.primary",
                      fontSize: "0.8rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {row.likelihood}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.8rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {row.desc}
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <NoteBox>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", lineHeight: 1.6, display: "block" }}
          >
            <Trans i18nKey="learning.probscales.m.note">
              <strong>Key difference from P scale:</strong> M1 corresponds to a
              return period of only 30 years, compared to over 5,000 years for
              P1. The M scale is also used as a conditional probability in the
              cascade model: it expresses the probability that a given actor
              group triggers a downstream attack-type risk within the analysis
              window.
            </Trans>
          </Typography>
        </NoteBox>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Conditional probability scale                                       */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.probscales.cp.title">
            Conditional probability scale (CP0 - CP7)
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.probscales.cp.body">
            Used to express the likelihood of a cascade effect occurring given
            that a causing risk scenario has already occurred. Each cascade link
            between two risks is characterised by a CP value for each of the
            nine possible cause-effect scenario combinations (considerable,
            major, or extreme cause triggering a considerable, major, or extreme
            effect). CP values are treated as marginal probabilities over the
            full three-year analysis window, not as daily rates.
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
                <TableCell sx={{ fontWeight: 500, width: 60 }}>Scale</TableCell>
                <TableCell sx={{ fontWeight: 500, width: 130 }}>
                  Likelihood
                </TableCell>
                <TableCell sx={{ fontWeight: 500, width: 160 }}>Odds</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  Qualitative description
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CP_SCALE.map((row, i) => (
                <ScaleRow key={row.code}>
                  <TableCell>
                    <Chip
                      label={row.code}
                      size="small"
                      sx={{
                        backgroundColor: P_COLORS[i],
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
                      color: "text.primary",
                      fontSize: "0.8rem",
                      fontFamily: "monospace",
                    }}
                  >
                    {row.likelihood}
                  </TableCell>
                  <TableCell
                    sx={{ color: "text.secondary", fontSize: "0.8rem" }}
                  >
                    {row.odds}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.8rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {row.desc}
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <NoteBox>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", lineHeight: 1.6, display: "block" }}
          >
            <Trans i18nKey="learning.probscales.cp.note">
              <strong>Interpreting CP values:</strong> When a causing scenario
              fires, the three CP values for the relevant row of the 3x3 matrix
              are used in two steps: first, compute P_any = 1 -
              (1-CP_c)(1-CP_m)(1-CP_e) to determine whether any cascade
              activates; then if it does, select one effect scenario with
              probability proportional to each CP value. See the Cascade
              probabilities page for full mechanics.
            </Trans>
          </Typography>
        </NoteBox>
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
