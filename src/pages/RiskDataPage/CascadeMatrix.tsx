import {
  Grid,
  Box,
  Typography,
  useTheme,
  Tooltip,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Menu,
} from "@mui/material";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Trans, useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Indicators } from "../../types/global";
import {
  cpScale5FromPAbs,
  cpScale7FromPAbs,
  getIntervalStringCPScale5,
  getIntervalStringCPScale7,
  pAbsFromCPScale5,
  pAbsFromCPScale7,
} from "../../functions/indicators/cp";
import { ScenarioDescriptionBox } from "../../components/ScenarioDescription";
import {
  getIntervalStringMScale3,
  getIntervalStringMScale7,
  mScale3FromPDaily,
  mScale7FromPDaily,
  pDailyFromMScale3,
  pDailyFromMScale7,
} from "../../functions/indicators/motivation";
import { list } from "../../functions/array";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const COLORS_V1 = {
  0: "#e0ffcc",
  1: "#caf2c2",
  2: "#fff8b8",
  3: "#feffd6",
  4: "#ffe7d1",
  5: "#ffd6c9",
  "0.5": "#e0ffcc",
  "1.5": "#caf2c2",
  "2.5": "#fff8b8",
  "3.5": "#feffd6",
  "4.5": "#ffe7d1",
  "5.5": "#ffd6c9",
};

const COLORS_V2 = {
  0: "#e0ffcc",
  "0.5": "#e0ffcc",
  1: "#caf2c2",
  "1.5": "#caf2c2",
  2: "#fff8b8",
  "2.5": "#fff8b8",
  3: "#feffd6",
  "3.5": "#feffd6",
  4: "#ffe7d1",
  "4.5": "#ffe7d1",
  5: "#ffd6c9",
  "5.5": "#ffd6c9",
  6: "#ffd4d1",
  "6.5": "#ffd4d1",
  7: "#ffc9c9",
  "7.5": "#ffc9c9",
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

const getCPValueTooltip = (
  cp: number,
  isActorCause: boolean,
  indicators: Indicators
) => {
  if (isActorCause) {
    return `This estimation represents a probability between ${
      indicators === Indicators.V1
        ? getIntervalStringMScale3(cp)
        : getIntervalStringMScale7(cp)
    } that the actor group will attempt and successfully execute the attack scenario in the coming 3 years`;
  } else {
    return `This estimation represents a probability between ${
      indicators === Indicators.V1
        ? getIntervalStringCPScale5(cp)
        : getIntervalStringCPScale7(cp)
    } for the effect risk scenario to happen when the causing risk scenario has happened.`;
  }
};

const CPX = ({
  cpAbs,
  isActorCause,
  onChange,
}: {
  cpAbs: number;
  isActorCause: boolean;
  onChange?: (newCPAbs: number) => unknown;
}) => {
  const { indicators } = useOutletContext<BasePageContext>();

  const colors = indicators === Indicators.V1 ? COLORS_V1 : COLORS_V2;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [innerVal, setValue] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let cpVal = 0;
    if (indicators === Indicators.V1) {
      cpVal = isActorCause ? mScale3FromPDaily(cpAbs) : cpScale5FromPAbs(cpAbs);
    } else {
      cpVal = isActorCause ? mScale7FromPDaily(cpAbs) : cpScale7FromPAbs(cpAbs);
    }
    setValue(Math.round(2 * cpVal) / 2);
  }, [cpAbs, isActorCause, indicators]);

  const prefix = isActorCause ? "M" : "CP";

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleChange = (newVal: number) => {
    let cpAbs = 0;
    if (indicators === Indicators.V1) {
      cpAbs = isActorCause ? pDailyFromMScale3(cpAbs) : pAbsFromCPScale5(cpAbs);
    } else {
      cpAbs = isActorCause ? pDailyFromMScale7(cpAbs) : pAbsFromCPScale7(cpAbs);
    }
    setValue(Math.round(2 * cpAbs) / 2);

    if (!onChange) return;

    if (indicators === Indicators.V1) {
      if (isActorCause) {
        onChange(pDailyFromMScale3(newVal));
      } else {
        onChange(pAbsFromCPScale5(newVal));
      }
    } else {
      if (isActorCause) {
        onChange(pDailyFromMScale7(newVal));
      } else {
        onChange(pAbsFromCPScale7(newVal));
      }
    }

    handleClose();
  };

  let maxScale = 7;
  if (indicators === Indicators.V1) {
    if (isActorCause) maxScale = 3;
    else maxScale = 5;
  }

  return (
    <Tooltip
      title={
        menuOpen ? null : getCPValueTooltip(innerVal, isActorCause, indicators)
      }
    >
      <Box
        sx={{
          display: "flex",
          backgroundColor: colors[innerVal.toString() as keyof typeof colors],
          padding: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={menuOpen ? undefined : handleClick}
      >
        <Typography variant="body1" color="black" component={"span"}>
          {prefix}
          {innerVal}
        </Typography>
        {onChange && <ArrowDropDownIcon />}
        {onChange && (
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "center",
            }}
          >
            {list(maxScale + 0.5, 0.5).map((i) => (
              <Tooltip
                key={i}
                title={getCPValueTooltip(i, isActorCause, indicators)}
                placement="left-end"
              >
                <MenuItem value={i} onClick={() => handleChange(i)}>
                  {isActorCause ? "M" : "CP"}
                  {i}
                </MenuItem>
              </Tooltip>
            ))}
          </Menu>
        )}
      </Box>
    </Tooltip>
  );
};

export default function CascadeMatrix({
  cause,
  effect,
  cascade,
  onChange,
}: {
  cause: DVRiskSnapshot;
  effect: DVRiskSnapshot;
  cascade: DVCascadeSnapshot;
  onChange?: (
    causeScenario: SCENARIOS,
    effectScenario: SCENARIOS,
    newCPAbs: number
  ) => unknown;
}) {
  const theme = useTheme();

  const [showScenarios, setShowScenarios] = useState(false);

  const isActorCause = cause.cr4de_risk_type === RISK_TYPE.MANMADE;

  const causeScenarios = JSON.parse(cause.cr4de_scenarios || "");
  const effectScenarios = JSON.parse(effect.cr4de_scenarios || "");

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
              cpAbs={
                cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][
                  SCENARIOS.CONSIDERABLE
                ].abs
              }
              isActorCause={isActorCause}
              onChange={
                onChange &&
                ((newValue) =>
                  onChange(
                    SCENARIOS.CONSIDERABLE,
                    SCENARIOS.CONSIDERABLE,
                    newValue
                  ))
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              cpAbs={
                cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][SCENARIOS.MAJOR]
                  .abs
              }
              isActorCause={isActorCause}
              onChange={
                onChange &&
                ((newValue) =>
                  onChange(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, newValue))
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              cpAbs={
                cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][
                  SCENARIOS.EXTREME
                ].abs
              }
              isActorCause={isActorCause}
              onChange={
                onChange &&
                ((newValue) =>
                  onChange(SCENARIOS.CONSIDERABLE, SCENARIOS.EXTREME, newValue))
              }
            />
          </Grid>

          <Grid size={{ xs: 4.5 }}>
            <ScenarioBox scenario={SCENARIOS.MAJOR} />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              cpAbs={
                cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.CONSIDERABLE]
                  .abs
              }
              isActorCause={isActorCause}
              onChange={
                onChange &&
                ((newValue) =>
                  onChange(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE, newValue))
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              cpAbs={
                cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.MAJOR].abs
              }
              isActorCause={isActorCause}
              onChange={
                onChange &&
                ((newValue) =>
                  onChange(SCENARIOS.MAJOR, SCENARIOS.MAJOR, newValue))
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              cpAbs={
                cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.EXTREME].abs
              }
              isActorCause={isActorCause}
              onChange={
                onChange &&
                ((newValue) =>
                  onChange(SCENARIOS.MAJOR, SCENARIOS.EXTREME, newValue))
              }
            />
          </Grid>

          <Grid size={{ xs: 4.5 }}>
            <ScenarioBox scenario={SCENARIOS.EXTREME} />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              cpAbs={
                cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][
                  SCENARIOS.CONSIDERABLE
                ].abs
              }
              isActorCause={isActorCause}
              onChange={
                onChange &&
                ((newValue) =>
                  onChange(SCENARIOS.EXTREME, SCENARIOS.CONSIDERABLE, newValue))
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              cpAbs={
                cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.MAJOR].abs
              }
              isActorCause={isActorCause}
              onChange={
                onChange &&
                ((newValue) =>
                  onChange(SCENARIOS.EXTREME, SCENARIOS.MAJOR, newValue))
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              cpAbs={
                cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.EXTREME]
                  .abs
              }
              isActorCause={isActorCause}
              onChange={
                onChange &&
                ((newValue) =>
                  onChange(SCENARIOS.EXTREME, SCENARIOS.EXTREME, newValue))
              }
            />
          </Grid>
        </Grid>
      </Box>

      <Table sx={{ px: 4, mt: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2">Show scenarios</Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowScenarios(!showScenarios)}
                >
                  {showScenarios ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
          {showScenarios && (
            <TableRow>
              <TableCell sx={{ width: "50%" }}>
                <Typography variant="subtitle2">{cause.cr4de_title}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2">
                  {effect.cr4de_title}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableHead>
        {showScenarios && (
          <TableBody>
            <TableRow>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.CONSIDERABLE}
                  parameters={causeScenarios.considerable}
                />
              </TableCell>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.CONSIDERABLE}
                  parameters={effectScenarios.considerable}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.MAJOR}
                  parameters={causeScenarios.major}
                />
              </TableCell>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.MAJOR}
                  parameters={effectScenarios.major}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.EXTREME}
                  parameters={causeScenarios.extreme}
                />
              </TableCell>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.EXTREME}
                  parameters={effectScenarios.extreme}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </Box>
  );
}
