import Grid from "@mui/material/Unstable_Grid2";
import { styled, Box, Typography, useTheme, Tooltip, Select, MenuItem } from "@mui/material";
import { CascadeAnalysisInput, getCascadeField } from "../../../functions/cascades";
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import { Trans, useTranslation } from "react-i18next";
import { useState } from "react";

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
      <Trans i18nKey={scenario}>{t(SCENARIO_PARAMS[scenario].titleI18N, SCENARIO_PARAMS[scenario].titleDefault)}</Trans>
    </Box>
  );
};

const CPX = ({ value, onChange }: { value: string | null; onChange: (newValue: string) => Promise<void> }) => {
  const theme = useTheme();
  const [innerVal, setValue] = useState(value);

  return (
    <Box
      sx={{
        backgroundColor: value ? COLORS[value as keyof typeof COLORS] : undefined,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
      }}
    >
      <Select
        value={innerVal}
        onChange={(e) => {
          onChange(e.target.value as string);
          setValue(e.target.value as string);
        }}
        sx={{ border: "none", "& .MuiInputBase-input": { padding: 0 }, "& fieldset": { border: "none" } }}
      >
        <MenuItem value="CP0">CP0</MenuItem>
        <MenuItem value="CP0.5">CP0.5</MenuItem>
        <MenuItem value="CP1">CP1</MenuItem>
        <MenuItem value="CP1.5">CP1.5</MenuItem>
        <MenuItem value="CP2">CP2</MenuItem>
        <MenuItem value="CP2.5">CP2.5</MenuItem>
        <MenuItem value="CP3">CP3</MenuItem>
        <MenuItem value="CP3.5">CP3.5</MenuItem>
        <MenuItem value="CP4">CP4</MenuItem>
        <MenuItem value="CP4.5">CP4.5</MenuItem>
        <MenuItem value="CP5">CP5</MenuItem>
      </Select>
    </Box>
  );
};

export default function CascadeMatrix({
  cause,
  effect,
  cascadeAnalysis,
  onChange,
}: {
  cause: DVRiskFile;
  effect: DVRiskFile;
  cascadeAnalysis: DVCascadeAnalysis;
  onChange: (field: keyof DVRiskCascade, newValue: string) => Promise<void>;
}) {
  const theme = useTheme();
  return (
    <Grid container spacing={1}>
      <Grid xs={4.5}></Grid>
      <Grid xs={7.5}>
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

      <Grid xs={4.5}>
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
      <Grid xs={2.5} sx={{ cursor: "pointer" }}>
        <CPX
          value={cascadeAnalysis[getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.CONSIDERABLE)]}
          onChange={(newValue) => onChange("cr4de_c2c", newValue)}
        />
      </Grid>
      <Grid xs={2.5} sx={{ cursor: "pointer" }}>
        <CPX
          value={cascadeAnalysis[getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR)]}
          onChange={(newValue) => onChange("cr4de_c2m", newValue)}
        />
      </Grid>
      <Grid xs={2.5} sx={{ cursor: "pointer" }}>
        <CPX
          value={cascadeAnalysis[getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.EXTREME)]}
          onChange={(newValue) => onChange("cr4de_c2e", newValue)}
        />
      </Grid>

      <Grid xs={4.5}>
        <ScenarioBox scenario={SCENARIOS.MAJOR} />
      </Grid>
      <Grid xs={2.5} sx={{ cursor: "pointer" }}>
        <CPX
          value={cascadeAnalysis[getCascadeField(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE)]}
          onChange={(newValue) => onChange("cr4de_m2c", newValue)}
        />
      </Grid>
      <Grid xs={2.5} sx={{ cursor: "pointer" }}>
        <CPX
          value={cascadeAnalysis[getCascadeField(SCENARIOS.MAJOR, SCENARIOS.MAJOR)]}
          onChange={(newValue) => onChange("cr4de_m2m", newValue)}
        />
      </Grid>
      <Grid xs={2.5} sx={{ cursor: "pointer" }}>
        <CPX
          value={cascadeAnalysis[getCascadeField(SCENARIOS.MAJOR, SCENARIOS.EXTREME)]}
          onChange={(newValue) => onChange("cr4de_m2e", newValue)}
        />
      </Grid>

      <Grid xs={4.5}>
        <ScenarioBox scenario={SCENARIOS.EXTREME} />
      </Grid>
      <Grid xs={2.5} sx={{ cursor: "pointer" }}>
        <CPX
          value={cascadeAnalysis[getCascadeField(SCENARIOS.EXTREME, SCENARIOS.CONSIDERABLE)]}
          onChange={(newValue) => onChange("cr4de_e2c", newValue)}
        />
      </Grid>
      <Grid xs={2.5} sx={{ cursor: "pointer" }}>
        <CPX
          value={cascadeAnalysis[getCascadeField(SCENARIOS.EXTREME, SCENARIOS.MAJOR)]}
          onChange={(newValue) => onChange("cr4de_e2m", newValue)}
        />
      </Grid>
      <Grid xs={2.5} sx={{ cursor: "pointer" }}>
        <CPX
          value={cascadeAnalysis[getCascadeField(SCENARIOS.EXTREME, SCENARIOS.EXTREME)]}
          onChange={(newValue) => onChange("cr4de_e2e", newValue)}
        />
      </Grid>
    </Grid>
  );
}
