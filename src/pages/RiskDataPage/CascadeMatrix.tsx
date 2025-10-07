import {
  Grid,
  Box,
  Typography,
  useTheme,
  Tooltip,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Trans, useTranslation } from "react-i18next";
import { useState } from "react";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Indicators } from "../../types/global";
import {
  pAbsFromCPScale5,
  pAbsFromCPScale7,
} from "../../functions/indicators/cp";
import { ScenarioDescriptionBox } from "../../components/ScenarioDescription";
import {
  pDailyFromMScale3,
  pDailyFromMScale7,
} from "../../functions/indicators/motivation";

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

const CPX = ({
  value,
  isActorCause,
  onChange,
}: {
  value: number;
  isActorCause: boolean;
  onChange?: (newCPAbs: number) => unknown;
}) => {
  const theme = useTheme();
  const { indicators } = useOutletContext<BasePageContext>();

  const [innerVal, setValue] = useState(Math.round(2 * value) / 2);

  const prefix = isActorCause ? "M" : "CP";

  // const stringVal = `CP${innerVal}`;
  const colorVal = `CP${innerVal}` as keyof typeof COLORS;
  const getVal = (str: string) => parseFloat(str);

  const handleChange = (newVal: string) => {
    setValue(getVal(newVal));

    if (!onChange) return;

    if (indicators === Indicators.V1) {
      if (isActorCause) {
        onChange(pDailyFromMScale3(getVal(newVal)));
      } else {
        onChange(pAbsFromCPScale5(getVal(newVal)));
      }
    } else {
      if (isActorCause) {
        onChange(pDailyFromMScale7(getVal(newVal)));
      } else {
        onChange(pAbsFromCPScale7(getVal(newVal)));
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colorVal ? COLORS[colorVal] : undefined,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
      }}
    >
      {onChange ? (
        <Select<string>
          value={innerVal.toString()}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
          sx={{
            border: "none",
            "& .MuiInputBase-input": { padding: 0 },
            "& fieldset": { border: "none" },
          }}
        >
          <MenuItem value="0">{prefix}0</MenuItem>
          <MenuItem value="0.5">{prefix}0.5</MenuItem>
          <MenuItem value="1">{prefix}1</MenuItem>
          <MenuItem value="1.5">{prefix}1.5</MenuItem>
          <MenuItem value="2">{prefix}2</MenuItem>
          <MenuItem value="2.5">{prefix}2.5</MenuItem>
          <MenuItem value="3">{prefix}3</MenuItem>
          <MenuItem value="3.5">{prefix}3.5</MenuItem>
          {(!isActorCause || indicators === Indicators.V2) && (
            <>
              <MenuItem value="4">{prefix}4</MenuItem>
              <MenuItem value="4.5">{prefix}4.5</MenuItem>
              <MenuItem value="5">{prefix}5</MenuItem>
              <MenuItem value="5.5">{prefix}5.5</MenuItem>
            </>
          )}
          {indicators === Indicators.V2 && (
            <>
              <MenuItem value="6">{prefix}6</MenuItem>
              <MenuItem value="6.5">{prefix}6.5</MenuItem>
              <MenuItem value="7">{prefix}7</MenuItem>
              <MenuItem value="7.5">{prefix}7.5</MenuItem>
            </>
          )}
        </Select>
      ) : (
        <Typography variant="body1" color="black">
          {prefix}
          {innerVal}
        </Typography>
      )}
    </Box>
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
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][
                  SCENARIOS.CONSIDERABLE
                ].scale5
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
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][SCENARIOS.MAJOR]
                  .scale5
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
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][
                  SCENARIOS.EXTREME
                ].scale5
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
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.CONSIDERABLE]
                  .scale5
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
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.MAJOR].scale5
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
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.EXTREME]
                  .scale5
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
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][
                  SCENARIOS.CONSIDERABLE
                ].scale5
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
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.MAJOR]
                  .scale5
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
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.EXTREME]
                  .scale5
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

// export function CascadeSnapshotMatrix({
//   cause,
//   effect,
//   cascade,
//   isCause = false,
//   onChange,
// }: {
//   cause: DVRiskSnapshot;
//   effect: DVRiskSnapshot;
//   cascade: DVCascadeSnapshot;
//   isCause?: boolean;
//   onChange: (field: keyof DVRiskCascade, newValue: string) => Promise<void>;
// }) {
//   const theme = useTheme();

//   const causeScenarios: Scenarios = JSON.parse(cause.cr4de_scenarios || "");
//   const effectScenarios: Scenarios = JSON.parse(effect.cr4de_scenarios || "");

//   return (
//     <Grid container spacing={1}>
//       <Grid size={{ xs: 4.5 }}></Grid>
//       <Grid size={{ xs: 7.5 }}>
//         <Tooltip title={effect.cr4de_title}>
//           <Box sx={{ padding: theme.spacing(1), textAlign: "center" }}>
//             <Typography variant="h6">
//               {cause.cr4de_risk_type === RISK_TYPE.MANMADE ? (
//                 <Trans i18nKey="2B.attack">Attack</Trans>
//               ) : (
//                 <Trans i18nKey="2B.effect">Effect</Trans>
//               )}
//             </Typography>
//           </Box>
//         </Tooltip>
//       </Grid>

//       <Grid size={{ xs: 4.5 }}>
//         <Tooltip title={cause.cr4de_title}>
//           <Box
//             sx={{
//               padding: theme.spacing(1),
//               textAlign: "center",
//               alignItems: "end",
//             }}
//           >
//             <Typography variant="h6">
//               {cause.cr4de_risk_type === RISK_TYPE.MANMADE ? (
//                 <Trans i18nKey="2B.actor">Actor</Trans>
//               ) : (
//                 <Trans i18nKey="2B.cause">Cause</Trans>
//               )}
//             </Typography>
//           </Box>
//         </Tooltip>
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ alignSelf: "flex-end" }}>
//         <ScenarioBox scenario={SCENARIOS.CONSIDERABLE} />
//         <Box
//           sx={{
//             ml: 0,
//             pl: 2,
//             mr: 2,
//             borderLeft: `8px solid ${
//               SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
//             }55`,
//           }}
//           dangerouslySetInnerHTML={{ __html: effectScenarios.considerable }}
//         />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ alignSelf: "flex-end" }}>
//         <ScenarioBox scenario={SCENARIOS.MAJOR} />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ alignSelf: "flex-end" }}>
//         <ScenarioBox scenario={SCENARIOS.EXTREME} />
//       </Grid>

//       <Grid size={{ xs: 4.5 }}>
//         <ScenarioBox scenario={SCENARIOS.CONSIDERABLE} />
//         <Box
//           sx={{
//             ml: 0,
//             pl: 2,
//             mr: 2,
//             borderLeft: `8px solid ${
//               SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
//             }55`,
//           }}
//           dangerouslySetInnerHTML={{ __html: causeScenarios.considerable }}
//         />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
//         <CPX
//           value={`CP${
//             cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][
//               SCENARIOS.CONSIDERABLE
//             ].scale5
//           }`}
//           onChange={(newValue) =>
//             onChange(
//               getCascadeField(
//                 SCENARIOS.CONSIDERABLE,
//                 SCENARIOS.CONSIDERABLE,
//                 isCause
//               ),
//               newValue
//             )
//           }
//         />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
//         <CPX
//           value={`CP${
//             cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][SCENARIOS.MAJOR]
//               .scale5
//           }`}
//           onChange={(newValue) =>
//             onChange(
//               getCascadeField(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, isCause),
//               newValue
//             )
//           }
//         />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
//         <CPX
//           value={`CP${
//             cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][SCENARIOS.EXTREME]
//               .scale5
//           }`}
//           onChange={(newValue) =>
//             onChange(
//               getCascadeField(
//                 SCENARIOS.CONSIDERABLE,
//                 SCENARIOS.EXTREME,
//                 isCause
//               ),
//               newValue
//             )
//           }
//         />
//       </Grid>

//       <Grid size={{ xs: 4.5 }}>
//         <ScenarioBox scenario={SCENARIOS.MAJOR} />
//         <Box
//           sx={{
//             ml: 0,
//             pl: 2,
//             mr: 2,
//             borderLeft: `8px solid ${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}55`,
//           }}
//           dangerouslySetInnerHTML={{ __html: causeScenarios.major }}
//         />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
//         <CPX
//           value={`CP${
//             cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.CONSIDERABLE]
//               .scale5
//           }`}
//           onChange={(newValue) =>
//             onChange(
//               getCascadeField(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE, isCause),
//               newValue
//             )
//           }
//         />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
//         <CPX
//           value={`CP${
//             cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.MAJOR].scale5
//           }`}
//           onChange={(newValue) =>
//             onChange(
//               getCascadeField(SCENARIOS.MAJOR, SCENARIOS.MAJOR, isCause),
//               newValue
//             )
//           }
//         />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
//         <CPX
//           value={`CP${
//             cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.EXTREME].scale5
//           }`}
//           onChange={(newValue) =>
//             onChange(
//               getCascadeField(SCENARIOS.MAJOR, SCENARIOS.EXTREME, isCause),
//               newValue
//             )
//           }
//         />
//       </Grid>

//       <Grid size={{ xs: 4.5 }}>
//         <ScenarioBox scenario={SCENARIOS.EXTREME} />
//         <Box
//           sx={{
//             ml: 0,
//             pl: 2,
//             mr: 2,
//             borderLeft: `8px solid ${
//               SCENARIO_PARAMS[SCENARIOS.EXTREME].color
//             }55`,
//           }}
//           dangerouslySetInnerHTML={{ __html: causeScenarios.extreme }}
//         />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
//         <CPX
//           value={`CP${
//             cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.CONSIDERABLE]
//               .scale5
//           }`}
//           onChange={(newValue) =>
//             onChange(
//               getCascadeField(
//                 SCENARIOS.EXTREME,
//                 SCENARIOS.CONSIDERABLE,
//                 isCause
//               ),
//               newValue
//             )
//           }
//         />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
//         <CPX
//           value={`CP${
//             cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.MAJOR].scale5
//           }`}
//           onChange={(newValue) =>
//             onChange(
//               getCascadeField(SCENARIOS.EXTREME, SCENARIOS.MAJOR, isCause),
//               newValue
//             )
//           }
//         />
//       </Grid>
//       <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
//         <CPX
//           value={`CP${
//             cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.EXTREME].scale5
//           }`}
//           onChange={(newValue) =>
//             onChange(
//               getCascadeField(SCENARIOS.EXTREME, SCENARIOS.EXTREME, isCause),
//               newValue
//             )
//           }
//         />
//       </Grid>
//     </Grid>
//   );
// }
