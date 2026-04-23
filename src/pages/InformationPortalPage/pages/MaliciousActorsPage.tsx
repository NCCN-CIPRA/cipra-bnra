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
  borderRadius: 4,
  padding: theme.spacing(2.5, 3),
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const CapabilityCard = styled(Paper)(({ theme }) => ({
  padding: 16,
  boxShadow: "none",
  borderRadius: 4,
  height: "100%",
  border: `1px solid ${theme.palette.divider}`,
}));

const SplitCard = styled(Paper)(({ theme }) => ({
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

const CAPABILITY_LEVELS = [
  {
    color: "#9DC3E620",
    labelKey: "learning.malicious.capabilities.low.title",
    labelDefault: "Low capabilities",
    descKey: "learning.malicious.capabilities.low.desc",
    descDefault:
      "Actors with limited technical and operational means. Attacks are restricted in scale, coordination, or sophistication, for example, small-scale vandalism or lone actors with basic resources.",
  },
  {
    color: "#FFE69920",
    labelKey: "learning.malicious.capabilities.medium.title",
    labelDefault: "Medium capabilities",
    descKey: "learning.malicious.capabilities.medium.desc",
    descDefault:
      "Actors with either high technical or high operational capabilities, but not both. Attacks are coordinated and can produce significant harm, such as organised criminal networks or mid-tier extremist groups.",
  },
  {
    color: "#F47C7C20",
    labelKey: "learning.malicious.capabilities.high.title",
    labelDefault: "High capabilities",
    descKey: "learning.malicious.capabilities.high.desc",
    descDefault:
      "Actors with advanced technical expertise, significant resources, and the ability to execute complex, sustained campaigns, such as well-resourced state-sponsored actors.",
  },
];

const M_SCALE = [
  {
    code: "M0",
    returnPeriod: "Never",
    likelihood: "< 0.01%",
    desc: "Essentially impossible",
    color: "#e0e0e0",
  },
  {
    code: "M1",
    returnPeriod: "> 30 years",
    likelihood: "0.01% - 10%",
    desc: "Very improbable",
    color: "#EAF3DE",
  },
  {
    code: "M2",
    returnPeriod: "10 - 30 years",
    likelihood: "10% - 25%",
    desc: "Improbable",
    color: "#C0DD97",
  },
  {
    code: "M3",
    returnPeriod: "6 - 10 years",
    likelihood: "25% - 40%",
    desc: "Not likely",
    color: "#97C459",
  },
  {
    code: "M4",
    returnPeriod: "4 - 6 years",
    likelihood: "40% - 55%",
    desc: "Possible",
    color: "#FFE699",
  },
  {
    code: "M5",
    returnPeriod: "2 - 4 years",
    likelihood: "55% - 75%",
    desc: "Likely",
    color: "#FBBE6A",
  },
  {
    code: "M6",
    returnPeriod: "1 - 2 years",
    likelihood: "75% - 90%",
    desc: "Very likely",
    color: "#F47C7C",
  },
  {
    code: "M7",
    returnPeriod: "< 1 year",
    likelihood: "90% - 100%",
    desc: "Almost certain",
    color: "#E24B4A",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function MaliciousActorsPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.malicious.title", "Malicious actors"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.malicious.title", "Malicious actors"),
      url: "/learning/malicious-actors",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.malicious.title">Malicious actors</Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.malicious.intro">
            Not all risks arise from nature or accident. Some are the result of
            deliberate human choices; terrorist attacks, state-sponsored
            interference, organised crime, or hybrid campaigns. These
            intentional threats behave differently from other hazards and
            require a different analytical approach. In the BNRA, they are
            modelled through a dedicated class of entries in the risk catalogue
            known as malicious actor risks.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Why different                                                       */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.malicious.why.title">
            Why malicious risks need a different approach
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.malicious.why.body">
            For most hazards in the catalogue, historical records, physical
            models, or epidemiological data provide a basis for estimating how
            often a risk might occur. A river flood can be characterised by a
            return period derived from decades of hydrological measurements. A
            disease outbreak can be modelled using transmission dynamics.
          </Trans>
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.malicious.why.body2">
            Intentional threats do not have this property. The likelihood of an
            attack depends not on natural processes but on human decisions that
            are inherently strategic, adaptive, and often hidden. Adversaries
            may deliberately avoid patterns that could be used to predict them.
            For these reasons, the probability of a malicious act cannot
            meaningfully be estimated from return periods alone.
          </Trans>
        </Typography>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.malicious.why.intelligence.title">
              Based on capability and motivation
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.malicious.why.intelligence.body">
              Instead of historical frequencies, the BNRA draws on concepts
              familiar to the intelligence community: the technical and
              operational capabilities of an actor group, and their assessed
              motivation to act. Expert input from intelligence services feeds
              into both dimensions, allowing an informed probability estimate
              without requiring a statistical record of past attacks.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Structure in the catalogue                                          */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.malicious.structure.title">
            How malicious actors are structured in the catalogue
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.malicious.structure.body">
            The BNRA risk catalogue contains five malicious actor entries, each
            representing a broad class of actor group rather than a specific
            named organisation. For each entry, three capability levels are
            defined (analogous to the considerable, major, and extreme scenarios
            used for standard risks) reflecting the range of technical and
            operational means available to actors within that group.
          </Trans>
        </Typography>

        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {CAPABILITY_LEVELS.map((level) => (
            <Grid key={level.labelDefault} size={{ xs: 12, sm: 4 }}>
              <CapabilityCard sx={{ backgroundColor: level.color }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 500, mb: 1, color: "rgba(0,0,0,0.75)" }}
                >
                  {t(level.labelKey, level.labelDefault)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(0,0,0,0.65)", lineHeight: 1.6 }}
                >
                  {t(level.descKey, level.descDefault)}
                </Typography>
              </CapabilityCard>
            </Grid>
          ))}
        </Grid>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.malicious.structure.roots.title">
              Malicious actors are always root nodes
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.malicious.structure.roots.body">
              In the BNRA cascade model, malicious actor entries always appear
              as root nodes. They are never the downstream effect of another
              risk; an actor group is not considered to have been caused by a
              flood or a pandemic. They can, however, trigger other risks in the
              catalogue: a successful attack may cause a power outage, a supply
              chain disruption, or a public health emergency.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Motivation as conditional probability                               */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.malicious.motivation.title">
            Motivation as a conditional probability
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.malicious.motivation.body">
            As described on the risk cascades page, a cascade link between two
            risks is characterised by a conditional probability: the likelihood
            that one risk triggers another. For malicious actor risks, this same
            mechanism is used. Each actor entry in the catalogue can be thought
            of as a source node in the cascade graph, with directed links to the
            attack-type risks it may cause. For example, a link from a terrorist
            actor group to an attack against a soft target, or from an organised
            crime group to a critical infrastructure attack.
          </Trans>
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.malicious.motivation.body2">
            The <strong>motivation estimate</strong> assigned to each actor
            capability level is precisely this conditional probability: given
            that an actor group of this capability level exists and is active,
            what is the probability that they successfully carry out an attack
            within the three-year window? A high motivation value reflects not
            just a desire to attack, but demonstrated intent and operational
            readiness.
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
                <Trans i18nKey="learning.malicious.motivation.link.standard.title">
                  Comparable to the CP scale
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.malicious.motivation.link.standard.body">
                  For standard risks, cascade links use the CP0-CP7 conditional
                  probability scale. For malicious actor links, a dedicated
                  M-scale is used instead, but it serves exactly the same role:
                  it quantifies how likely the cascade from actor to attack is
                  to activate. The M-scale is simply calibrated to the shorter
                  timescales over which human intent can realistically be
                  assessed.
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
                <Trans i18nKey="learning.malicious.motivation.link.cascade.title">
                  How it feeds into the total probability
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.malicious.motivation.link.cascade.body">
                  Just like any other cascade contribution, the indirect
                  probability of an attack-type risk includes the contribution
                  from each relevant actor group: the motivation of the actor
                  multiplied by the assumed presence of that actor. This is then
                  summed with the direct probability of the attack occurring
                  without any of the modelled actor groups being involved.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.malicious.motivation.scale.intro">
            The M-scale ranges from M0 to M7, expressed as the probability of a
            successful attack within the three-year window. Note that the
            highest class (M7) corresponds to a return period of under one year,
            compared to over 5000 years for the lowest non-zero class of the
            standard probability scale. Human behaviour and motivation simply
            cannot be meaningfully predicted on timescales of centuries.
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
                  {t("learning.malicious.motivation.col.scale", "Scale")}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {t(
                    "learning.malicious.motivation.col.return",
                    "Return period",
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {t(
                    "learning.malicious.motivation.col.likelihood",
                    "3-year likelihood",
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {t("learning.malicious.motivation.col.desc", "Description")}
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
                    {row.desc}
                  </TableCell>
                </ScaleRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.malicious.motivation.sensitivity.title">
              Sensitivity and aggregation
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.malicious.motivation.sensitivity.body">
              Where specific actor names or intelligence details are too
              sensitive to include in published risk files, experts work with
              aggregated information: an estimated count of relevant actors and
              an average motivation level for that group. This preserves
              analytical rigour while ensuring that risk files remain
              unclassified and suitable for publication.
            </Trans>
          </Typography>
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
          to="/learning/risk-cascades"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.malicious.prev">
            Previous: Risk cascades
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/impact-and-probability-scales"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.malicious.next">
            Next: Impact and probability scales
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
