import {
  Grid,
  Box,
  Typography,
  useTheme,
  Tooltip,
  Select,
  MenuItem,
} from "@mui/material";
import {
  SCENARIOS,
  SCENARIO_PARAMS,
  Scenarios,
} from "../../functions/scenarios";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Trans, useTranslation } from "react-i18next";
import { useState } from "react";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";

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

export function getCascadeField(
  causeScenario: SCENARIOS,
  effectScenario: SCENARIOS,
  isCause = false
): keyof DVRiskCascade {
  if (causeScenario === SCENARIOS.CONSIDERABLE) {
    if (effectScenario === SCENARIOS.CONSIDERABLE) {
      return `cr4de_c2c${isCause ? "_cause" : ""}`;
    } else if (effectScenario === SCENARIOS.MAJOR) {
      return `cr4de_c2m${isCause ? "_cause" : ""}`;
    } else {
      return `cr4de_c2e${isCause ? "_cause" : ""}`;
    }
  } else if (causeScenario === SCENARIOS.MAJOR) {
    if (effectScenario === SCENARIOS.CONSIDERABLE) {
      return `cr4de_m2c${isCause ? "_cause" : ""}`;
    } else if (effectScenario === SCENARIOS.MAJOR) {
      return `cr4de_m2m${isCause ? "_cause" : ""}`;
    } else {
      return `cr4de_m2e${isCause ? "_cause" : ""}`;
    }
  } else {
    if (effectScenario === SCENARIOS.CONSIDERABLE) {
      return `cr4de_e2c${isCause ? "_cause" : ""}`;
    } else if (effectScenario === SCENARIOS.MAJOR) {
      return `cr4de_e2m${isCause ? "_cause" : ""}`;
    } else {
      return `cr4de_e2e${isCause ? "_cause" : ""}`;
    }
  }
}

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

const CPX = ({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (newValue: string) => Promise<void>;
}) => {
  const theme = useTheme();
  const [innerVal, setValue] = useState(value);

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
      <Select
        value={innerVal}
        onChange={(e) => {
          onChange(e.target.value as string);
          setValue(e.target.value as string);
        }}
        sx={{
          border: "none",
          "& .MuiInputBase-input": { padding: 0 },
          "& fieldset": { border: "none" },
        }}
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
  cascade,
  isCause = false,
  onChange,
}: {
  cause: DVRiskFile;
  effect: DVRiskFile;
  cascade: DVRiskCascade;
  isCause?: boolean;
  onChange: (field: keyof DVRiskCascade, newValue: string) => Promise<void>;
}) {
  const theme = useTheme();

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 4.5 }}></Grid>
      <Grid size={{ xs: 7.5 }}>
        <Tooltip title={effect.cr4de_title}>
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
        <Tooltip title={cause.cr4de_title}>
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
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={
            cascade[
              getCascadeField(
                SCENARIOS.CONSIDERABLE,
                SCENARIOS.CONSIDERABLE,
                isCause
              )
            ] as string
          }
          onChange={(newValue) =>
            onChange(
              getCascadeField(
                SCENARIOS.CONSIDERABLE,
                SCENARIOS.CONSIDERABLE,
                isCause
              ),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={
            cascade[
              getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, isCause)
            ] as string
          }
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, isCause),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={
            cascade[
              getCascadeField(
                SCENARIOS.CONSIDERABLE,
                SCENARIOS.EXTREME,
                isCause
              )
            ] as string
          }
          onChange={(newValue) =>
            onChange(
              getCascadeField(
                SCENARIOS.CONSIDERABLE,
                SCENARIOS.EXTREME,
                isCause
              ),
              newValue
            )
          }
        />
      </Grid>

      <Grid size={{ xs: 4.5 }}>
        <ScenarioBox scenario={SCENARIOS.MAJOR} />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={
            cascade[
              getCascadeField(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE, isCause)
            ] as string
          }
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE, isCause),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={
            cascade[
              getCascadeField(SCENARIOS.MAJOR, SCENARIOS.MAJOR, isCause)
            ] as string
          }
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.MAJOR, SCENARIOS.MAJOR, isCause),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={
            cascade[
              getCascadeField(SCENARIOS.MAJOR, SCENARIOS.EXTREME, isCause)
            ] as string
          }
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.MAJOR, SCENARIOS.EXTREME, isCause),
              newValue
            )
          }
        />
      </Grid>

      <Grid size={{ xs: 4.5 }}>
        <ScenarioBox scenario={SCENARIOS.EXTREME} />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={
            cascade[
              getCascadeField(
                SCENARIOS.EXTREME,
                SCENARIOS.CONSIDERABLE,
                isCause
              )
            ] as string
          }
          onChange={(newValue) =>
            onChange(
              getCascadeField(
                SCENARIOS.EXTREME,
                SCENARIOS.CONSIDERABLE,
                isCause
              ),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={
            cascade[
              getCascadeField(SCENARIOS.EXTREME, SCENARIOS.MAJOR, isCause)
            ] as string
          }
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.EXTREME, SCENARIOS.MAJOR, isCause),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={
            cascade[
              getCascadeField(SCENARIOS.EXTREME, SCENARIOS.EXTREME, isCause)
            ] as string
          }
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.EXTREME, SCENARIOS.EXTREME, isCause),
              newValue
            )
          }
        />
      </Grid>
    </Grid>
  );
}

export function CascadeSnapshotMatrix({
  cause,
  effect,
  cascade,
  isCause = false,
  onChange,
}: {
  cause: DVRiskSnapshot;
  effect: DVRiskSnapshot;
  cascade: DVCascadeSnapshot;
  isCause?: boolean;
  onChange: (field: keyof DVRiskCascade, newValue: string) => Promise<void>;
}) {
  const theme = useTheme();

  const causeScenarios: Scenarios = JSON.parse(cause.cr4de_scenarios || "");
  const effectScenarios: Scenarios = JSON.parse(effect.cr4de_scenarios || "");

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 4.5 }}></Grid>
      <Grid size={{ xs: 7.5 }}>
        <Tooltip title={effect.cr4de_title}>
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
        <Tooltip title={cause.cr4de_title}>
          <Box
            sx={{
              padding: theme.spacing(1),
              textAlign: "center",
              alignItems: "end",
            }}
          >
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
        <Box
          sx={{
            ml: 0,
            pl: 2,
            mr: 2,
            borderLeft: `8px solid ${
              SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
            }55`,
          }}
          dangerouslySetInnerHTML={{ __html: effectScenarios.considerable }}
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ alignSelf: "flex-end" }}>
        <ScenarioBox scenario={SCENARIOS.MAJOR} />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ alignSelf: "flex-end" }}>
        <ScenarioBox scenario={SCENARIOS.EXTREME} />
      </Grid>

      <Grid size={{ xs: 4.5 }}>
        <ScenarioBox scenario={SCENARIOS.CONSIDERABLE} />
        <Box
          sx={{
            ml: 0,
            pl: 2,
            mr: 2,
            borderLeft: `8px solid ${
              SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
            }55`,
          }}
          dangerouslySetInnerHTML={{ __html: causeScenarios.considerable }}
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={`CP${
            cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][
              SCENARIOS.CONSIDERABLE
            ].scale5
          }`}
          onChange={(newValue) =>
            onChange(
              getCascadeField(
                SCENARIOS.CONSIDERABLE,
                SCENARIOS.CONSIDERABLE,
                isCause
              ),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={`CP${
            cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][SCENARIOS.MAJOR]
              .scale5
          }`}
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, isCause),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={`CP${
            cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][SCENARIOS.EXTREME]
              .scale5
          }`}
          onChange={(newValue) =>
            onChange(
              getCascadeField(
                SCENARIOS.CONSIDERABLE,
                SCENARIOS.EXTREME,
                isCause
              ),
              newValue
            )
          }
        />
      </Grid>

      <Grid size={{ xs: 4.5 }}>
        <ScenarioBox scenario={SCENARIOS.MAJOR} />
        <Box
          sx={{
            ml: 0,
            pl: 2,
            mr: 2,
            borderLeft: `8px solid ${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}55`,
          }}
          dangerouslySetInnerHTML={{ __html: causeScenarios.major }}
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={`CP${
            cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.CONSIDERABLE]
              .scale5
          }`}
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE, isCause),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={`CP${
            cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.MAJOR].scale5
          }`}
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.MAJOR, SCENARIOS.MAJOR, isCause),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={`CP${
            cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.EXTREME].scale5
          }`}
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.MAJOR, SCENARIOS.EXTREME, isCause),
              newValue
            )
          }
        />
      </Grid>

      <Grid size={{ xs: 4.5 }}>
        <ScenarioBox scenario={SCENARIOS.EXTREME} />
        <Box
          sx={{
            ml: 0,
            pl: 2,
            mr: 2,
            borderLeft: `8px solid ${
              SCENARIO_PARAMS[SCENARIOS.EXTREME].color
            }55`,
          }}
          dangerouslySetInnerHTML={{ __html: causeScenarios.extreme }}
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={`CP${
            cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.CONSIDERABLE]
              .scale5
          }`}
          onChange={(newValue) =>
            onChange(
              getCascadeField(
                SCENARIOS.EXTREME,
                SCENARIOS.CONSIDERABLE,
                isCause
              ),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={`CP${
            cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.MAJOR].scale5
          }`}
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.EXTREME, SCENARIOS.MAJOR, isCause),
              newValue
            )
          }
        />
      </Grid>
      <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
        <CPX
          value={`CP${
            cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.EXTREME].scale5
          }`}
          onChange={(newValue) =>
            onChange(
              getCascadeField(SCENARIOS.EXTREME, SCENARIOS.EXTREME, isCause),
              newValue
            )
          }
        />
      </Grid>
    </Grid>
  );
}
