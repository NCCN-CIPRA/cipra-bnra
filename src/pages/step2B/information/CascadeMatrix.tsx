import Grid from "@mui/material/Unstable_Grid2";
import { styled, Box, Typography, useTheme, Tooltip } from "@mui/material";
import { getCascadeField } from "../../../functions/cascades";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { Trans, useTranslation } from "react-i18next";

const COLORS = {
  CP0: "#e0ffcc",
  CP1: "#caf2c2",
  CP2: "#fff8b8",
  CP3: "#feffd6",
  CP4: "#ffe7d1",
  CP5: "#ffd6c9",
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
      <Trans i18nKey={scenario}>{t(SCENARIO_PARAMS[scenario].titleI18N, SCENARIO_PARAMS[scenario].titleDefault)}</Trans>
    </Box>
  );
};

const CPX = ({ value }: { value: string | null }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: value ? COLORS[value as keyof typeof COLORS] : undefined,
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
  cascade,
  step2B,
}: {
  cascade: DVRiskCascade<DVRiskFile, DVRiskFile>;
  step2B: DVCascadeAnalysis;
}) {
  const theme = useTheme();
  return (
    <Grid container spacing={1}>
      <Grid xs={4.5}></Grid>
      <Grid xs={7.5}>
        <Tooltip title={cascade.cr4de_effect_hazard.cr4de_title}>
          <Box sx={{ padding: theme.spacing(1), textAlign: "center" }}>
            <Typography variant="h6">
              <Trans i18nKey="2B.effect">Effect</Trans>
            </Typography>
          </Box>
        </Tooltip>
      </Grid>

      <Grid xs={4.5}>
        <Tooltip title={cascade.cr4de_cause_hazard.cr4de_title}>
          <Box sx={{ padding: theme.spacing(1), textAlign: "center" }}>
            <Typography variant="h6">
              <Trans i18nKey="2B.cause">Cause</Trans>
            </Typography>
          </Box>
        </Tooltip>
      </Grid>
      <Grid xs={2.5} sx={{ alignSelf: "flex-end" }}>
        <ScenarioBox scenario={SCENARIOS.CONSIDERABLE} />
      </Grid>
      <Grid xs={2.5} sx={{ alignSelf: "flex-end" }}>
        <ScenarioBox scenario={SCENARIOS.MAJOR} />
      </Grid>
      <Grid xs={2.5} sx={{ alignSelf: "flex-end" }}>
        <ScenarioBox scenario={SCENARIOS.EXTREME} />
      </Grid>

      <Grid xs={4.5}>
        <ScenarioBox scenario={SCENARIOS.CONSIDERABLE} />
      </Grid>
      <Grid xs={2.5}>
        <CPX value={step2B[getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.CONSIDERABLE)]} />
      </Grid>
      <Grid xs={2.5}>
        <CPX value={step2B[getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR)]} />
      </Grid>
      <Grid xs={2.5}>
        <CPX value={step2B[getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.EXTREME)]} />
      </Grid>

      <Grid xs={4.5}>
        <ScenarioBox scenario={SCENARIOS.MAJOR} />
      </Grid>
      <Grid xs={2.5}>
        <CPX value={step2B[getCascadeField(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE)]} />
      </Grid>
      <Grid xs={2.5}>
        <CPX value={step2B[getCascadeField(SCENARIOS.MAJOR, SCENARIOS.MAJOR)]} />
      </Grid>
      <Grid xs={2.5}>
        <CPX value={step2B[getCascadeField(SCENARIOS.MAJOR, SCENARIOS.EXTREME)]} />
      </Grid>

      <Grid xs={4.5}>
        <ScenarioBox scenario={SCENARIOS.EXTREME} />
      </Grid>
      <Grid xs={2.5}>
        <CPX value={step2B[getCascadeField(SCENARIOS.EXTREME, SCENARIOS.CONSIDERABLE)]} />
      </Grid>
      <Grid xs={2.5}>
        <CPX value={step2B[getCascadeField(SCENARIOS.EXTREME, SCENARIOS.MAJOR)]} />
      </Grid>
      <Grid xs={2.5}>
        <CPX value={step2B[getCascadeField(SCENARIOS.EXTREME, SCENARIOS.EXTREME)]} />
      </Grid>
    </Grid>
  );
}
