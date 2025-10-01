import { useState } from "react";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import {
  DVRiskSnapshot,
  parseRiskSnapshotScenarios,
  RiskSnapshotResults,
} from "../../types/dataverse/DVRiskSnapshot";
import { Box, Paper, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { capFirst } from "../../functions/capFirst";
import { Slider } from "./Slider";
import {
  DP_FIELD,
  DI_FIELD,
  getQuantiLabel,
  DVRiskFile,
} from "../../types/dataverse/DVRiskFile";
import {
  diScale5FromEuros,
  iScale7FromEuros,
} from "../../functions/indicators/impact";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import { Indicators } from "../../types/global";
import { pScale5to7 } from "../../functions/indicators/probability";
import ScenarioDescription from "../../components/ScenarioDescription";
import HTMLEditor from "../../components/HTMLEditor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAPI, { DataTable } from "../../hooks/useAPI";
import {
  RiskQualis,
  RiskScenarioQualis,
  serializeRiskQualis,
} from "../../types/dataverse/Riskfile";

export function ScenarioSection({
  riskFile,
  quantiFields,
  qualiField,
  scenario,
  isAttack,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults, RiskQualis>;
  quantiFields: (DP_FIELD | DI_FIELD)[];
  qualiField: keyof RiskScenarioQualis;
  scenario: SCENARIOS;
  isAttack?: boolean;
}) {
  const api = useAPI();
  const queryClient = useQueryClient();
  const { indicators } = useOutletContext<BasePageContext>();

  const [open, setOpen] = useState(false);

  const [quali, setQuali] = useState(
    riskFile.cr4de_quali[scenario][qualiField] || ""
  );
  const mutation = useMutation({
    mutationFn: async (
      newC: Partial<DVRiskFile> & { cr4de_riskfilesid: string }
    ) => api.updateRiskFile(newC.cr4de_riskfilesid, newC),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [DataTable.RISK_FILE],
      });
    },
  });

  const scenarios = parseRiskSnapshotScenarios(riskFile.cr4de_scenarios);

  return (
    <Stack
      direction="column"
      sx={{ flex: open ? 10 : 1, transition: "all .3s ease" }}
    >
      <Paper
        sx={{
          p: 2,
          bgcolor: `${SCENARIO_PARAMS[scenario].color}`,
          color: "white",
          cursor: "pointer",
          "&:hover": { opacity: 0.7 },
          // width: open ? "100%" : "150px",
          transition: "all .3s ease",
          borderRadius: 0,
          display: "flex",
        }}
        onClick={() => setOpen(!open)}
      >
        <ExpandMoreIcon sx={{ transform: open ? "none" : "rotate(-90deg)" }} />
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          {capFirst(scenario)}
        </Typography>
      </Paper>

      {open && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2">Scenario Description:</Typography>
          <Box sx={{ pb: 2, pl: 3, mb: 2, borderBottom: "1px solid #eee" }}>
            <ScenarioDescription parameters={scenarios[scenario]} />
          </Box>
          <Typography variant="subtitle2">Final Consensus Results:</Typography>
          <Box sx={{ pb: 2, pl: 3, mb: 2, mt: 2 }}>
            <HTMLEditor
              initialHTML={quali}
              onSave={async (newQuali: string | null) => {
                setQuali(newQuali || "");
                mutation.mutate({
                  cr4de_riskfilesid: riskFile._cr4de_risk_file_value,
                  cr4de_quali: serializeRiskQualis({
                    ...riskFile.cr4de_quali,
                    [scenario]: {
                      ...riskFile.cr4de_quali[scenario],
                      dp: newQuali,
                    },
                  }),
                });
              }}
            />

            {quantiFields.length > 0 && (
              <Stack direction="column" sx={{ mt: 2 }}>
                {quantiFields.map((quantiField) => {
                  let initialValue = 0;

                  if (quantiField === "dp") {
                    if (indicators === Indicators.V1)
                      initialValue = riskFile.cr4de_quanti[scenario].dp.scale;
                    else
                      initialValue = pScale5to7(
                        riskFile.cr4de_quanti[scenario].dp.scale
                      );
                  } else {
                    if (indicators === Indicators.V1)
                      initialValue = diScale5FromEuros(
                        riskFile.cr4de_quanti[scenario].di[quantiField].abs
                      );
                    else
                      initialValue = iScale7FromEuros(
                        riskFile.cr4de_quanti[scenario].di[quantiField].abs
                      );
                  }

                  return (
                    <Stack
                      key={quantiField}
                      direction="row"
                      sx={{ alignItems: "center" }}
                    >
                      <Typography variant="caption" sx={{ flex: 1 }}>
                        <i>{getQuantiLabel(quantiField, isAttack)}</i>{" "}
                        Estimation:
                      </Typography>
                      <Box
                        sx={{
                          flex: 1,
                          minWidth: "300px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {/* {riskFile.cr4de_consensus_type !== null ? ( */}
                        <Slider
                          value={initialValue}
                          prefix={
                            quantiField === "dp"
                              ? quantiField.toUpperCase()
                              : capFirst(quantiField)
                          }
                          maxScale={indicators === Indicators.V1 ? 5 : 7}
                          // spread={
                          //   // user.roles.analist
                          //   //   ? getDASpread(
                          //   //       directAnalyses,
                          //   //       n as keyof DVDirectAnalysis
                          //   //     )
                          //   //   : null
                          //   null
                          // }
                          // onChange={
                          // user.roles.analist
                          //   ? async (newValue) => {
                          //       await api.updateRiskFile(
                          //         riskFile.cr4de_riskfilesid,
                          //         {
                          //           [n]: newValue,
                          //         }
                          //       );
                          //     }
                          //   : null
                          //   null
                          // }
                        />
                        {/* ) : (
                        <Typography variant="subtitle2">N/A</Typography>
                      )} */}
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </Box>

          {/* <Attachments
            reset={lastParam !== parameter || reloadAttachments}
            getAttachments={() =>
              api.getAttachments(
                `$filter=_cr4de_risk_file_value eq ${
                  riskFile.cr4de_riskfilesid
                } and _cr4de_directanalysis_value eq null and cr4de_field eq 'cr4de_${getField(parameter)}_${
                  scenarioLetter[scenario]
                }'&$expand=cr4de_referencedSource`
              )
            }
            consolidateAttachment={null}
            deleteAttachment={async (attachment: DVAttachment) => {
              await api.deleteAttachment(attachment.cr4de_bnraattachmentid);
              setReloadAttachments(true);
            }}
          /> */}
          {/* {user.roles.analist && (
            <Box sx={{ textAlign: "center" }}>
              <Button loading={saving} variant="outlined" onClick={handleSave}>
                Save & Close
              </Button>
            </Box>
          )} */}
        </Box>
      )}
    </Stack>
  );
}
