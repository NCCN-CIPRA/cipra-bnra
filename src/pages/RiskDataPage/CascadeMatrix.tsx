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
import {
  DVRiskCascade,
  serializeCPMatrix,
} from "../../types/dataverse/DVRiskCascade";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { Trans, useTranslation } from "react-i18next";
import { useState } from "react";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Indicators } from "../../types/global";
import {
  mScale3FromPAbs,
  mScale7FromPAbs,
  pAbsFromMScale3,
  pAbsFromMScale7,
} from "../../functions/indicators/motivation";
import {
  cpScale5FromPAbs,
  cpScale7FromPAbs,
  pAbsFromCPScale5,
  pAbsFromCPScale7,
} from "../../functions/indicators/cp";
import { ScenarioDescriptionBox } from "../../components/ScenarioDescription";

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
  onChange,
}: {
  value: number;
  onChange: (newValue: number) => Promise<void>;
}) => {
  const theme = useTheme();
  const [innerVal, setValue] = useState(value);

  // const stringVal = `CP${innerVal}`;
  const colorVal = `CP${Math.round(2 * innerVal) / 2}` as keyof typeof COLORS;
  const getVal = (str: string) => parseFloat(str.replace("CP", ""));

  return (
    <Box
      sx={{
        backgroundColor: colorVal ? COLORS[colorVal] : undefined,
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
      }}
    >
      <Select
        value={colorVal}
        onChange={(e) => {
          onChange(getVal(e.target.value as string));
          setValue(getVal(e.target.value as string));
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
}: {
  cause: DVRiskSnapshot;
  effect: DVRiskSnapshot;
  cascade: DVCascadeSnapshot;
}) {
  const theme = useTheme();

  const api = useAPI();
  const queryClient = useQueryClient();
  const { indicators } = useOutletContext<BasePageContext>();

  const [showScenarios, setShowScenarios] = useState(false);
  const mutation = useMutation({
    mutationFn: async (
      newC: Partial<DVRiskCascade> & { cr4de_bnrariskcascadeid: string }
    ) => api.updateCascade(newC.cr4de_bnrariskcascadeid, newC),
    onSuccess: async () => {
      // If you're invalidating a single query
      await queryClient.invalidateQueries({
        queryKey: [DataTable.RISK_CASCADE],
      });
    },
  });

  const causeScenarios = JSON.parse(cause.cr4de_scenarios || "");
  const effectScenarios = JSON.parse(effect.cr4de_scenarios || "");

  const handleChange = async (
    causeScenario: SCENARIOS,
    effectScenario: SCENARIOS,
    newCPVal: number
  ) => {
    let pAbs = 0;
    if (indicators === Indicators.V1) {
      if (cause.cr4de_risk_type === RISK_TYPE.MANMADE) {
        pAbs = pAbsFromMScale3(newCPVal);
      } else {
        pAbs = pAbsFromCPScale5(newCPVal);
      }
    } else {
      if (cause.cr4de_risk_type === RISK_TYPE.MANMADE) {
        pAbs = pAbsFromMScale7(newCPVal);
      } else {
        pAbs = pAbsFromCPScale7(newCPVal);
      }
    }

    const updatedCPMatrix = { ...cascade.cr4de_quanti_cp };
    updatedCPMatrix[causeScenario][effectScenario] = {
      abs: pAbs,
      scale5:
        cause.cr4de_risk_type === RISK_TYPE.MANMADE
          ? mScale3FromPAbs(pAbs)
          : cpScale5FromPAbs(pAbs),
      scale7:
        cause.cr4de_risk_type === RISK_TYPE.MANMADE
          ? mScale7FromPAbs(pAbs)
          : cpScale7FromPAbs(pAbs),
    };

    mutation.mutate({
      cr4de_bnrariskcascadeid: cascade._cr4de_risk_cascade_value,
      cr4de_quanti_input: serializeCPMatrix(updatedCPMatrix),
    });
  };

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
              onChange={(newValue) =>
                handleChange(
                  SCENARIOS.CONSIDERABLE,
                  SCENARIOS.CONSIDERABLE,
                  newValue
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.CONSIDERABLE][SCENARIOS.MAJOR]
                  .scale5
              }
              onChange={(newValue) =>
                handleChange(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, newValue)
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
              onChange={(newValue) =>
                handleChange(
                  SCENARIOS.CONSIDERABLE,
                  SCENARIOS.EXTREME,
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
                cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.CONSIDERABLE]
                  .scale5
              }
              onChange={(newValue) =>
                handleChange(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE, newValue)
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.MAJOR].scale5
              }
              onChange={(newValue) =>
                handleChange(SCENARIOS.MAJOR, SCENARIOS.MAJOR, newValue)
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.MAJOR][SCENARIOS.EXTREME]
                  .scale5
              }
              onChange={(newValue) =>
                handleChange(SCENARIOS.MAJOR, SCENARIOS.EXTREME, newValue)
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
              onChange={(newValue) =>
                handleChange(
                  SCENARIOS.EXTREME,
                  SCENARIOS.CONSIDERABLE,
                  newValue
                )
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.MAJOR]
                  .scale5
              }
              onChange={(newValue) =>
                handleChange(SCENARIOS.EXTREME, SCENARIOS.MAJOR, newValue)
              }
            />
          </Grid>
          <Grid size={{ xs: 2.5 }} sx={{ cursor: "pointer" }}>
            <CPX
              value={
                cascade.cr4de_quanti_cp[SCENARIOS.EXTREME][SCENARIOS.EXTREME]
                  .scale5
              }
              onChange={(newValue) =>
                handleChange(SCENARIOS.EXTREME, SCENARIOS.EXTREME, newValue)
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
                  parameters={JSON.parse(causeScenarios.considerable)}
                />
              </TableCell>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.CONSIDERABLE}
                  parameters={JSON.parse(effectScenarios.considerable)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.MAJOR}
                  parameters={JSON.parse(causeScenarios.major)}
                />
              </TableCell>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.MAJOR}
                  parameters={JSON.parse(effectScenarios.major)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.EXTREME}
                  parameters={JSON.parse(causeScenarios.extreme)}
                />
              </TableCell>
              <TableCell sx={{ verticalAlign: "top" }}>
                <ScenarioDescriptionBox
                  scenario={SCENARIOS.EXTREME}
                  parameters={JSON.parse(effectScenarios.extreme)}
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
