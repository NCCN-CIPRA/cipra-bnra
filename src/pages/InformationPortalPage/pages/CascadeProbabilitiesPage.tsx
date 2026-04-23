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
import { SCENARIOS } from "../../../functions/scenarios";

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

const SplitCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  boxShadow: "none",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  height: "100%",
}));

const MatrixCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  fontSize: "0.78rem",
  padding: theme.spacing(1),
  borderRight: `1px solid ${theme.palette.divider}`,
  "&:last-child": { borderRight: "none" },
}));

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SCENARIO_COLORS = {
  considerable: { bg: "#EAF3FB", border: "#9DC3E6", label: "Considerable" },
  major: { bg: "#FEFAE6", border: "#FFE699", label: "Major" },
  extreme: { bg: "#FDEAEA", border: "#F47C7C", label: "Extreme" },
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ScenarioChip({ scenario }: { scenario: SCENARIOS }) {
  const s = SCENARIO_COLORS[scenario];
  return (
    <Chip
      label={s.label}
      size="small"
      sx={{
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        color: "rgba(0,0,0,0.7)",
        fontWeight: 500,
        fontSize: "0.68rem",
        height: 20,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function CascadeProbabilitiesPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.cascadeprob.title", "Cascade probabilities"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
    {
      name: t("learning.cascadeprob.title", "Cascade probabilities"),
      url: "/learning/cascade-probabilities",
    },
  ]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          <Trans i18nKey="learning.cascadeprob.title">
            Cascade probabilities
          </Trans>
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.cascadeprob.intro">
            The previous pages introduced conditional probabilities and
            explained that each cascade link carries a CP value expressing the
            likelihood that one risk triggers another. This page explains the
            full mechanics: how the nine scenario combinations of a cascade link
            are specified, how a single effect is selected when a cascade fires,
            and how the simulation handles chains and loops without getting
            stuck.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* The 3x3 matrix                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.cascadeprob.matrix.title">
            The 3x3 conditional probability matrix
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.cascadeprob.matrix.body">
            Because every risk is assessed in three scenarios, a single cascade
            link between two risks represents nine possible cause-effect
            combinations. A considerable flood may cause a considerable, major,
            or extreme power outage — each with a different probability. A major
            flood may do the same, again with different probabilities. For each
            of these nine combinations, experts provide a separate conditional
            probability estimate.
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
                <MatrixCell
                  sx={{ textAlign: "left", fontWeight: 500, width: 180 }}
                >
                  {t(
                    "learning.cascadeprob.matrix.causeLabel",
                    "Cause scenario",
                  )}
                </MatrixCell>
                {(["considerable", "major", "extreme"] as SCENARIOS[]).map(
                  (s) => (
                    <MatrixCell key={s} sx={{ fontWeight: 500 }}>
                      <ScenarioChip scenario={s} />
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          color: "text.disabled",
                          mt: 0.5,
                        }}
                      >
                        {t("learning.cascadeprob.matrix.effectLabel", "effect")}
                      </Typography>
                    </MatrixCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {(["considerable", "major", "extreme"] as SCENARIOS[]).map(
                (cause) => (
                  <TableRow key={cause}>
                    <MatrixCell sx={{ textAlign: "left" }}>
                      <ScenarioChip scenario={cause} />
                    </MatrixCell>
                    {(["considerable", "major", "extreme"] as SCENARIOS[]).map(
                      (effect) => (
                        <MatrixCell
                          key={effect}
                          sx={{
                            backgroundColor: SCENARIO_COLORS[effect].bg + "33",
                          }}
                        >
                          <Box
                            sx={{
                              fontFamily: "monospace",
                              fontSize: "0.78rem",
                              color: "text.secondary",
                            }}
                          >
                            CP({cause[0]}&rarr;{effect[0]})
                          </Box>
                        </MatrixCell>
                      ),
                    )}
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography
          variant="caption"
          sx={{ color: "text.disabled", display: "block", mb: 2 }}
        >
          <Trans i18nKey="learning.cascadeprob.matrix.caption">
            Each cell contains an independent CP estimate. A major cause
            triggering an extreme effect is not required to be more or less
            likely than a considerable cause triggering an extreme effect —
            experts assess each combination on its own merits.
          </Trans>
        </Typography>

        <AccentCard>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.cascadeprob.matrix.selection.title">
              Only selected cascade links are estimated
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.cascadeprob.matrix.selection.body">
              Not every risk pair in the catalogue has a cascade link. Only
              pairs where experts consider a non-zero conditional probability
              plausible are included. For each selected pair, all nine cells of
              the matrix are filled in — experts do not skip combinations they
              consider unlikely, they assign them CP0 instead. This keeps the
              matrix complete and unambiguous.
            </Trans>
          </Typography>
        </AccentCard>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Cascade activation and effect selection                             */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.cascadeprob.activation.title">
            Cascade activation and effect selection
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.cascadeprob.activation.body">
            When a causing scenario fires in the simulation, the three CP values
            in the corresponding row of the matrix are used to determine whether
            a cascade activates and, if so, which effect scenario is triggered.
            This happens in two steps.
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
                <Trans i18nKey="learning.cascadeprob.activation.step1.title">
                  Step 1: does the cascade activate?
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1 }}
              >
                <Trans i18nKey="learning.cascadeprob.activation.step1.body">
                  The three CP values in the row are treated as independent
                  probabilities of each effect scenario occurring. The
                  probability that at least one effect occurs is:
                </Trans>
              </Typography>
              <FormulaBox sx={{ margin: 0 }}>
                P_any = 1 - (1-CP_c) × (1-CP_m) × (1-CP_e)
              </FormulaBox>
            </SplitCard>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <SplitCard>
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                <Trans i18nKey="learning.cascadeprob.activation.step2.title">
                  Step 2: which effect scenario?
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6, mb: 1 }}
              >
                <Trans i18nKey="learning.cascadeprob.activation.step2.body">
                  If the cascade activates, exactly one effect scenario is
                  selected. Each scenario's probability of being chosen is
                  proportional to its CP value relative to the sum of all three:
                </Trans>
              </Typography>
              <FormulaBox sx={{ margin: 0 }}>
                P(effect = c) = CP_c / (CP_c + CP_m + CP_e)
              </FormulaBox>
            </SplitCard>
          </Grid>
        </Grid>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7 }}
        >
          <Trans i18nKey="learning.cascadeprob.activation.note">
            This two-step approach ensures that only one effect scenario fires
            per cascade link per simulation run, preventing the same downstream
            risk from being counted multiple times. It also naturally handles
            cases where multiple effect severity levels have non-zero CP values,
            producing a distribution of outcomes weighted by expert estimates.
          </Trans>
        </Typography>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Chains and loops                                                    */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.cascadeprob.loops.title">
            Cascade chains and loops
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 2 }}
        >
          <Trans i18nKey="learning.cascadeprob.loops.body">
            Once a cascade activates an effect scenario, that scenario may
            itself have outgoing links to further risks. The simulation follows
            these chains recursively until no further cascades activate. In
            practice, chains terminate naturally after a small number of steps
            because each link has a conditional probability below 1, so the
            likelihood of the chain continuing decreases with each step.
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
                <Trans i18nKey="learning.cascadeprob.loops.cycles.title">
                  Handling cycles
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.cascadeprob.loops.cycles.body">
                  Some cascade links form cycles — a power outage may cause a
                  telecom disruption, which may in turn worsen the power outage.
                  To prevent infinite loops, the simulation tracks which
                  scenarios have already fired in the current run. If a scenario
                  is triggered again, it is not re-fired. This prevents loops
                  while still capturing mutual amplification between linked
                  risks.
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
                <Trans i18nKey="learning.cascadeprob.loops.multipaths.title">
                  Multiple paths to the same effect
                </Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.6 }}
              >
                <Trans i18nKey="learning.cascadeprob.loops.multipaths.body">
                  The same scenario can be reached via multiple independent
                  cascade paths in a single run. If a flood independently causes
                  both a power outage and a telecom disruption, and both have a
                  link to supply shortfalls, the supply shortfall scenario is
                  counted once — but is reached regardless of which path
                  triggered it first.
                </Trans>
              </Typography>
            </SplitCard>
          </Grid>
        </Grid>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Aggregating to total probability                                    */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ mb: 5 }}>
        <SectionTitle variant="h6">
          <Trans i18nKey="learning.cascadeprob.aggregation.title">
            From cascade contributions to total probability
          </Trans>
        </SectionTitle>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
        >
          <Trans i18nKey="learning.cascadeprob.aggregation.body">
            The total probability of a given scenario is the sum of its direct
            probability and all cascade contributions from every risk that could
            trigger it. For each causing risk C with total probability P(C), the
            contribution to effect E is:
          </Trans>
        </Typography>

        <FormulaBox>P(C → E) = P(C) × CP(E | C)</FormulaBox>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.7, mb: 1.5 }}
        >
          <Trans i18nKey="learning.cascadeprob.aggregation.total">
            Summing over all causing risks gives the total probability of E:
          </Trans>
        </Typography>

        <FormulaBox>
          P(E) = DirectProbability(E) + P(C1 → E) + P(C2 → E) + ... + P(Cn → E)
        </FormulaBox>

        <AccentCard sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.75 }}>
            <Trans i18nKey="learning.cascadeprob.aggregation.why.title">
              Why this cannot be solved analytically
            </Trans>
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.7 }}
          >
            <Trans i18nKey="learning.cascadeprob.aggregation.why.body">
              P(C) in the formula above is itself a total probability that may
              include cascade contributions from other risks — including,
              potentially, E itself. This creates a system of mutually dependent
              equations with no closed-form solution. Rather than inverting this
              system analytically, the BNRA resolves it through Monte Carlo
              simulation: by running thousands of independent simulations and
              counting outcomes, the true probability distribution emerges from
              the aggregate results. This is described in detail on the next
              page.
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
          to="/learning/methodology-impact-probability"
          startIcon={<ChevronLeftIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.cascadeprob.prev">
            Previous: Impact and probability scales
          </Trans>
        </Button>

        <Button
          component={RouterLink}
          to="/learning/monte-carlo-simulation"
          endIcon={<ChevronRightIcon />}
          variant="outlined"
          color="primary"
        >
          <Trans i18nKey="learning.cascadeprob.next">
            Next: Monte Carlo simulation
          </Trans>
        </Button>
      </Box>
    </Container>
  );
}
