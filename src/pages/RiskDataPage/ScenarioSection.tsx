import { useState } from "react";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import {
  DVRiskSnapshot,
  parseRiskSnapshotQuali,
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
  serializeRiskFileQuantiInput,
  parseRiskFileQuantiInput,
} from "../../types/dataverse/DVRiskFile";
import {
  diScale5FromEuros,
  eurosFromDIScale5,
  eurosFromIScale7,
  iScale7FromEuros,
} from "../../functions/indicators/impact";
import { useOutletContext } from "react-router-dom";
import { Environment, Indicators } from "../../types/global";
import {
  pScale5FromReturnPeriodMonths,
  pScale5to7,
  pScale7FromReturnPeriodMonths,
  returnPeriodMonthsFromPScale5,
  returnPeriodMonthsFromPScale7,
} from "../../functions/indicators/probability";
import ScenarioDescription from "../../components/ScenarioDescription";
import HTMLEditor from "../../components/HTMLEditor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAPI, { DataTable } from "../../hooks/useAPI";
import {
  RiskQualis,
  RiskScenarioQualis,
  serializeRiskQualis,
} from "../../types/dataverse/Riskfile";
import { serializeChangeLogDiff } from "../../types/dataverse/DVChangeLog";
import { RiskFilePageContext } from "../BaseRiskFilePage";

export function ScenarioSection({
  riskFile,
  qualiField,
  quantiFields,
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
  const { user, indicators, environment, showDiff, publicRiskSnapshot } =
    useOutletContext<RiskFilePageContext>();

  const [open, setOpen] = useState(false);

  const [quali, setQuali] = useState(
    riskFile.cr4de_quali[scenario][qualiField] || ""
  );
  const publicQuali =
    publicRiskSnapshot && parseRiskSnapshotQuali(publicRiskSnapshot);

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

  const handleChangeQuanti =
    (field: DP_FIELD | DI_FIELD) => (scaleValue: number) => {
      if (riskFile.cr4de_risk_file === undefined) return;

      const rf = riskFile.cr4de_risk_file as DVRiskFile;
      const quantiInput = parseRiskFileQuantiInput(rf.cr4de_quanti);

      const newQuantiInput = JSON.parse(JSON.stringify(quantiInput));

      if (field === "dp") {
        const rpMonths =
          indicators === Indicators.V1
            ? returnPeriodMonthsFromPScale5(scaleValue)
            : returnPeriodMonthsFromPScale7(scaleValue);

        newQuantiInput[scenario].dp = {
          rpMonths: rpMonths,
          scale5: pScale5FromReturnPeriodMonths(rpMonths),
          scale7: pScale7FromReturnPeriodMonths(rpMonths),
        };

        api.createChangeLog({
          "cr4de_changed_by@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
          cr4de_changed_by_email: user?.emailaddress1,
          cr4de_changed_object_type: "RISK_FILE",
          cr4de_changed_object_id: riskFile._cr4de_risk_file_value,
          cr4de_change_short: `DP value of ${scenario} scenario of ${riskFile.cr4de_title}`,
          cr4de_diff: serializeChangeLogDiff([
            {
              property: `cr4de_quanti.${scenario}.dp.rpMonths`,
              originalValue: quantiInput[scenario].dp.rpMonths,
              newValue: newQuantiInput[scenario].dp.rpMonths,
            },
            {
              property: `cr4de_quanti.${scenario}.dp.scale5`,
              originalValue: quantiInput[scenario].dp.scale5,
              newValue: newQuantiInput[scenario].dp.scale5,
            },
            {
              property: `cr4de_quanti.${scenario}.dp.scale7`,
              originalValue: quantiInput[scenario].dp.scale7,
              newValue: newQuantiInput[scenario].dp.scale7,
            },
          ]),
        });
      } else {
        const euros =
          indicators === Indicators.V1
            ? eurosFromDIScale5(scaleValue)
            : eurosFromIScale7(scaleValue);

        newQuantiInput[scenario].di[field] = {
          abs: euros,
          scale5: diScale5FromEuros(euros),
          scale7: iScale7FromEuros(euros),
        };

        api.createChangeLog({
          "cr4de_changed_by@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
          cr4de_changed_by_email: user?.emailaddress1,
          cr4de_changed_object_type: "RISK_FILE",
          cr4de_changed_object_id: riskFile._cr4de_risk_file_value,
          cr4de_change_short: `${field} of ${scenario} of ${
            riskFile.cr4de_title
          }: ${capFirst(field)}${
            quantiInput[scenario].di[field].scale7
          } -> ${capFirst(field)}${newQuantiInput[scenario].di[field].scale7}`,
          cr4de_diff: serializeChangeLogDiff([
            {
              property: `cr4de_quanti.${scenario}.di.${field}.abs`,
              originalValue: quantiInput[scenario].di[field].abs,
              newValue: newQuantiInput[scenario].di[field].abs,
            },
            {
              property: `cr4de_quanti.${scenario}.di.${field}.scale5`,
              originalValue: quantiInput[scenario].di[field].scale5,
              newValue: newQuantiInput[scenario].di[field].scale5,
            },
            {
              property: `cr4de_quanti.${scenario}.di.${field}.scale7`,
              originalValue: quantiInput[scenario].di[field].scale7,
              newValue: newQuantiInput[scenario].di[field].scale7,
            },
          ]),
        });
      }

      mutation.mutate({
        cr4de_riskfilesid: riskFile._cr4de_risk_file_value,
        cr4de_quanti: serializeRiskFileQuantiInput(newQuantiInput),
      });
    };

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
              originalHTML={
                publicQuali
                  ? publicQuali.cr4de_quali[scenario][qualiField] || ""
                  : undefined
              }
              isEditable={environment === Environment.DYNAMIC}
              onSave={async (newQuali: string | null) => {
                setQuali(newQuali || "");

                api.createChangeLog({
                  "cr4de_changed_by@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
                  cr4de_changed_by_email: user?.emailaddress1,
                  cr4de_changed_object_type: "RISK_FILE",
                  cr4de_changed_object_id: riskFile._cr4de_risk_file_value,
                  cr4de_change_short: `Quali description of ${qualiField} of ${scenario} of ${riskFile.cr4de_title}`,
                  cr4de_diff: serializeChangeLogDiff([
                    {
                      property: `cr4de_quali.${scenario}.${qualiField}`,
                      originalValue: riskFile.cr4de_quali[scenario][qualiField],
                      newValue: newQuali,
                    },
                  ]),
                });

                mutation.mutate({
                  cr4de_riskfilesid: riskFile._cr4de_risk_file_value,
                  cr4de_quali: serializeRiskQualis({
                    ...riskFile.cr4de_quali,
                    [scenario]: {
                      ...riskFile.cr4de_quali[scenario],
                      [qualiField]: newQuali,
                    },
                  }),
                });
              }}
            />

            {quantiFields.length > 0 && (
              <Stack direction="column" sx={{ mt: 2 }}>
                {quantiFields.map((quantiField) => {
                  let initialValue = 0;
                  let compareValue = null;

                  if (quantiField === "dp") {
                    if (indicators === Indicators.V1) {
                      initialValue = riskFile.cr4de_quanti[scenario].dp.scale5;
                      compareValue =
                        publicRiskSnapshot &&
                        publicRiskSnapshot.cr4de_quanti[scenario].dp.scale5;
                    } else {
                      initialValue = pScale7FromReturnPeriodMonths(
                        riskFile.cr4de_quanti[scenario].dp.rpMonths
                      );
                      compareValue =
                        publicRiskSnapshot &&
                        pScale5to7(
                          publicRiskSnapshot.cr4de_quanti[scenario].dp.scale5
                        );
                    }
                  } else {
                    if (indicators === Indicators.V1) {
                      initialValue = diScale5FromEuros(
                        riskFile.cr4de_quanti[scenario].di[quantiField].euros
                      );
                      compareValue =
                        publicRiskSnapshot &&
                        diScale5FromEuros(
                          publicRiskSnapshot.cr4de_quanti[scenario].di[
                            quantiField
                          ].euros
                        );
                    } else {
                      initialValue = iScale7FromEuros(
                        riskFile.cr4de_quanti[scenario].di[quantiField].euros
                      );
                      compareValue =
                        publicRiskSnapshot &&
                        iScale7FromEuros(
                          publicRiskSnapshot.cr4de_quanti[scenario].di[
                            quantiField
                          ].euros
                        );
                    }
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
                        <Slider
                          initialValue={initialValue}
                          prefix={
                            quantiField === "dp"
                              ? quantiField.toUpperCase()
                              : capFirst(quantiField)
                          }
                          maxScale={indicators === Indicators.V1 ? 5 : 7}
                          compareValue={showDiff ? compareValue : null}
                          onChange={
                            user?.roles.analist &&
                            environment === Environment.DYNAMIC
                              ? handleChangeQuanti(quantiField)
                              : null
                          }
                        />
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
