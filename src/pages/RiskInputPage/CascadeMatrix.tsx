import { Box, Typography, useTheme, Tooltip, Grid } from "@mui/material";
import { getCascadeField } from "../../functions/cascades";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Trans, useTranslation } from "react-i18next";

const COLORS = {
  CP0: "#e0ffcc",
  CP1: "#caf2c2",
  CP2: "#fff8b8",
  CP3: "#feffd6",
  CP4: "#ffe7d1",
  CP5: "#ffd6c9",
  "CP0.5": "#e0ffcc",
  "CP1.5": "#caf2c2",
  "CP2.5": "#fff8b8",
  "CP3.5": "#feffd6",
  "CP4.5": "#ffe7d1",
  "CP5.5": "#ffd6c9",
};

const ScenarioBox = ({ scenario }: { scenario: SCENARIOS }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        padding: theme.spacing(1),
        textAlign: "center",
        backgroundColor: `${SCENARIO_PARAMS[scenario].color}`,
        color: "white",
      }}
    >
      <Trans i18nKey={scenario}>
        {t(
          SCENARIO_PARAMS[scenario].titleI18N,
          SCENARIO_PARAMS[scenario].titleDefault
        )}
      </Trans>
    </Box>
  );
};

const CPX = ({ value }: { value: string | null }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: value
          ? COLORS[value as keyof typeof COLORS]
          : undefined,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
    </Box>
  );
};

export default function CascadeMatrix({
  cause,
  effect,
  cascadeAnalysis,
  onChangeScenario,
}: {
  cause: DVRiskFile;
  effect: DVRiskFile;
  cascadeAnalysis: DVCascadeAnalysis;
  onChangeScenario: (
    causeScenario: SCENARIOS,
    effectScenario: SCENARIOS
  ) => void;
}) {
  const theme = useTheme();
  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 4.5 }}></Grid>
      <Grid size={{ xs: 7.5 }}>
        <Tooltip title={cause.cr4de_title}>
          <Box sx={{ padding: theme.spacing(1), textAlign: "center" }}>
            <Typography variant="h6">
              {cause.cr4de_risk_type === RISK_TYPE.MANMADE ? (
                <Trans i18nKey="2B.attack">Attack</Trans>
              ) : (
                <Trans i18nKey="2B.effect">Effect</Trans>
              )}
            </Typography>
          </Box>
        </Tooltip>
      </Grid>

      <Grid size={{ xs: 4.5 }}>
        <Tooltip title={effect.cr4de_title}>
          <Box sx={{ padding: theme.spacing(1), textAlign: "center" }}>
            <Typography variant="h6">
              {cause.cr4de_risk_type === RISK_TYPE.MANMADE ? (
                <Trans i18nKey="2B.actor">Actor</Trans>
              ) : (
                <Trans i18nKey="2B.cause">Cause</Trans>
              )}
            </Typography>
          </Box>
        </Tooltip>
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ alignSelf: "flex-end" }}>
        <ScenarioBox scenario={SCENARIOS.CONSIDERABLE} />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ alignSelf: "flex-end" }}>
        <ScenarioBox scenario={SCENARIOS.MAJOR} />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ alignSelf: "flex-end" }}>
        <ScenarioBox scenario={SCENARIOS.EXTREME} />
      </Grid>

      <Grid size={{ xs: 4.5 }}>
        <ScenarioBox scenario={SCENARIOS.CONSIDERABLE} />
      </Grid>
      <Grid
        size={{ xs: 2.5 }}
        sx={{ cursor: "pointer" }}
        onClick={() =>
          onChangeScenario(SCENARIOS.CONSIDERABLE, SCENARIOS.CONSIDERABLE)
        }
      >
        <CPX
          value={
            cascadeAnalysis[
              getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.CONSIDERABLE)
            ]
          }
        />
      </Grid>
      <Grid
        size={{ xs: 2.5 }}
        sx={{ cursor: "pointer" }}
        onClick={() =>
          onChangeScenario(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR)
        }
      >
        <CPX
          value={
            cascadeAnalysis[
              getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR)
            ]
          }
        />
      </Grid>
      <Grid
        size={{ xs: 2.5 }}
        sx={{ cursor: "pointer" }}
        onClick={() =>
          onChangeScenario(SCENARIOS.CONSIDERABLE, SCENARIOS.EXTREME)
        }
      >
        <CPX
          value={
            cascadeAnalysis[
              getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.EXTREME)
            ]
          }
        />
      </Grid>

      <Grid size={{ xs: 4.5 }}>
        <ScenarioBox scenario={SCENARIOS.MAJOR} />
      </Grid>
      <Grid
        size={{ xs: 2.5 }}
        sx={{ cursor: "pointer" }}
        onClick={() =>
          onChangeScenario(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE)
        }
      >
        <CPX
          value={
            cascadeAnalysis[
              getCascadeField(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE)
            ]
          }
        />
      </Grid>
      <Grid
        size={{ xs: 2.5 }}
        sx={{ cursor: "pointer" }}
        onClick={() => onChangeScenario(SCENARIOS.MAJOR, SCENARIOS.MAJOR)}
      >
        <CPX
          value={
            cascadeAnalysis[getCascadeField(SCENARIOS.MAJOR, SCENARIOS.MAJOR)]
          }
        />
      </Grid>
      <Grid
        size={{ xs: 2.5 }}
        sx={{ cursor: "pointer" }}
        onClick={() => onChangeScenario(SCENARIOS.MAJOR, SCENARIOS.EXTREME)}
      >
        <CPX
          value={
            cascadeAnalysis[getCascadeField(SCENARIOS.MAJOR, SCENARIOS.EXTREME)]
          }
        />
      </Grid>

      <Grid size={{ xs: 4.5 }}>
        <ScenarioBox scenario={SCENARIOS.EXTREME} />
      </Grid>
      <Grid
        size={{ xs: 2.5 }}
        sx={{ cursor: "pointer" }}
        onClick={() =>
          onChangeScenario(SCENARIOS.EXTREME, SCENARIOS.CONSIDERABLE)
        }
      >
        <CPX
          value={
            cascadeAnalysis[
              getCascadeField(SCENARIOS.EXTREME, SCENARIOS.CONSIDERABLE)
            ]
          }
        />
      </Grid>
      <Grid
        size={{ xs: 2.5 }}
        sx={{ cursor: "pointer" }}
        onClick={() => onChangeScenario(SCENARIOS.EXTREME, SCENARIOS.MAJOR)}
      >
        <CPX
          value={
            cascadeAnalysis[getCascadeField(SCENARIOS.EXTREME, SCENARIOS.MAJOR)]
          }
        />
      </Grid>
      <Grid
        size={{ xs: 2.5 }}
        sx={{ cursor: "pointer" }}
        onClick={() => onChangeScenario(SCENARIOS.EXTREME, SCENARIOS.EXTREME)}
      >
        <CPX
          value={
            cascadeAnalysis[
              getCascadeField(SCENARIOS.EXTREME, SCENARIOS.EXTREME)
            ]
          }
        />
      </Grid>
    </Grid>
  );
}
