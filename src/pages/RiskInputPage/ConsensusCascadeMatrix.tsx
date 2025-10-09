import { Box, Grid, Tooltip, Typography } from "@mui/material";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";
import { Trans, useTranslation } from "react-i18next";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import { useOutletContext } from "react-router-dom";
import { Indicators } from "../../types/global";
import {
  cpScale7FromPAbs,
  pAbsFromCPScale5,
} from "../../functions/indicators/cp";
import { BasePageContext } from "../BasePage";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";

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
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        padding: 1,
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

const CPX = ({ value, cause }: { value: string; cause: SmallRisk }) => {
  const { indicators } = useOutletContext<BasePageContext>();

  let realCP = value;
  if (indicators === Indicators.V2) {
    const cpVal = parseFloat(value.replace("CP", ""));
    const cp7 = Math.round(2 * cpScale7FromPAbs(pAbsFromCPScale5(cpVal))) / 2;
    realCP =
      cause.cr4de_risk_type === RISK_TYPE.MANMADE ? `M${cp7}` : `CP${cp7}`;
  }
  console.log(cause);
  return (
    <Box
      sx={{
        backgroundColor: COLORS[value as keyof typeof COLORS] || "white",
        padding: 1,
        textAlign: "center",
      }}
    >
      <Typography variant="body1" color="black">
        {realCP}
      </Typography>
    </Box>
  );
};

export default function ConsensusCascadeMatrix({
  cause,
  cascade,
}: {
  cause: SmallRisk;
  cascade: DVCascadeAnalysis;
}) {
  return (
    <Box>
      <Box
        sx={{
          maxWidth: 1000,
          margin: "auto",
          px: 2,
        }}
      >
        <Grid container spacing={1} sx={{ margin: "auto" }}>
          <Grid size={{ xs: 4.5 }}></Grid>
          <Grid size={{ xs: 7.5 }}>
            <Box sx={{ padding: 1, textAlign: "center" }}>
              <Typography variant="h6">
                {cause.cr4de_risk_type === RISK_TYPE.MANMADE
                  ? "Attack"
                  : "Effect"}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 4.5 }}>
            <Tooltip title={cause.cr4de_title}>
              <Box sx={{ padding: 1, textAlign: "center" }}>
                <Typography variant="h6">
                  {cause.cr4de_risk_type === RISK_TYPE.MANMADE
                    ? "Actor"
                    : "Cause"}
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
            <CPX value={cascade.cr4de_c2c || "CP0"} cause={cause} />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX value={cascade.cr4de_c2m || "CP0"} cause={cause} />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX value={cascade.cr4de_c2e || "CP0"} cause={cause} />
          </Grid>

          <Grid size={{ xs: 4.5 }}>
            <ScenarioBox scenario={SCENARIOS.MAJOR} />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX value={cascade.cr4de_m2c || "CP0"} cause={cause} />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX value={cascade.cr4de_m2m || "CP0"} cause={cause} />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX value={cascade.cr4de_m2e || "CP0"} cause={cause} />
          </Grid>

          <Grid size={{ xs: 4.5 }}>
            <ScenarioBox scenario={SCENARIOS.EXTREME} />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX value={cascade.cr4de_e2c || "CP0"} cause={cause} />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX value={cascade.cr4de_e2m || "CP0"} cause={cause} />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX value={cascade.cr4de_e2e || "CP0"} cause={cause} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
