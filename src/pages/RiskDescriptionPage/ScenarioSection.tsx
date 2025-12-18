import { useState } from "react";
import { Box, Typography, Tooltip, Stack, Button } from "@mui/material";
import { SCENARIO_PARAMS, SCENARIOS, wrap } from "../../functions/scenarios";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTranslation } from "react-i18next";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { ParsedRiskFields, RISK_TYPE } from "../../types/dataverse/Riskfile";
import { parseRiskFields } from "../../functions/parseDataverseFields";
import HTMLEditor from "../../components/HTMLEditor";
import { Environment } from "../../types/global";
import { useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { serializeChangeLogDiff } from "../../types/dataverse/DVChangeLog";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ScenarioSection({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  const api = useAPI();
  const queryClient = useQueryClient();
  const { user, environment } = useOutletContext<RiskFilePageContext>();
  const { t } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState(
    riskSummary.cr4de_mrs || SCENARIOS.CONSIDERABLE
  );

  const mutation = useMutation({
    mutationFn: async (
      newFields: Partial<DVRiskFile> & { cr4de_riskfilesid: string }
    ) => api.updateRiskFile(newFields.cr4de_riskfilesid, newFields),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [DataTable.RISK_FILE],
      });
    },
  });

  const parsedSummary: DVRiskSummary<unknown, ParsedRiskFields> = {
    ...riskSummary,
    ...parseRiskFields(riskSummary),
  };

  if (!parsedSummary.cr4de_scenarios) return null;

  const scenarioString =
    riskSummary.cr4de_risk_type === RISK_TYPE.MANMADE
      ? "actor groups"
      : "scenario";

  return (
    <>
      <Typography variant="h5">
        {t("riskFile.intensityParameters.title", "Intensity Parameters")} &{" "}
        {t("riskFile.scenarios.title", "Scenarios")}
      </Typography>

      <Box
        sx={{
          borderLeft: `solid 8px ${SCENARIO_PARAMS[selectedScenario].color}`,
          px: 2,
          py: 1,
          mt: 2,
          backgroundColor: "white",
          transition: "all .2s ease",
        }}
      >
        <Stack
          id="scenario-buttons"
          direction="row"
          justifyContent="flex-start"
          spacing={2}
          sx={{ mt: 1, mb: 4 }}
        >
          <Button
            variant="outlined"
            sx={{
              color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
              fontWeight:
                selectedScenario === SCENARIOS.CONSIDERABLE ? "bold" : "normal",
              opacity: selectedScenario === SCENARIOS.CONSIDERABLE ? 1 : 0.15,
              borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
              borderRadius: 48,
              backgroundColor: `${
                SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
              }20`,
              width: selectedScenario === SCENARIOS.CONSIDERABLE ? 130 : 48,
              minWidth: 48,
              height: 48,
              "&:hover": {
                opacity: 1,
                backgroundColor: `${
                  SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
                }20`,
                borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
              },
              transition: "all .2s ease",
              textTransform: "none",
              flexDirection: "column",
              lineHeight: 1.5,
            }}
            onClick={() => setSelectedScenario(SCENARIOS.CONSIDERABLE)}
          >
            <Box>
              {" "}
              C
              {selectedScenario === SCENARIOS.CONSIDERABLE ? "onsiderable" : ""}
            </Box>

            <Box sx={{ whiteSpace: "nowrap" }}>
              {selectedScenario === SCENARIOS.CONSIDERABLE
                ? scenarioString
                : ""}
            </Box>
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
              fontWeight:
                selectedScenario === SCENARIOS.MAJOR ? "bold" : "normal",
              opacity: selectedScenario === SCENARIOS.MAJOR ? 1 : 0.35,
              borderColor: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
              borderRadius: 48,
              backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}20`,
              width: selectedScenario === SCENARIOS.MAJOR ? 130 : 48,
              minWidth: 48,
              height: 48,
              "&:hover": {
                opacity: 1,
                backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}20`,
                borderColor: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
              },
              transition: "all .2s ease",
              textTransform: "none",
              flexDirection: "column",
              lineHeight: 1.5,
            }}
            onClick={() => setSelectedScenario(SCENARIOS.MAJOR)}
          >
            <Box> M{selectedScenario === SCENARIOS.MAJOR ? "ajor" : ""}</Box>

            <Box sx={{ whiteSpace: "nowrap" }}>
              {selectedScenario === SCENARIOS.MAJOR ? scenarioString : ""}
            </Box>
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
              fontWeight:
                selectedScenario === SCENARIOS.EXTREME ? "bold" : "normal",
              opacity: selectedScenario === SCENARIOS.EXTREME ? 1 : 0.1,
              borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
              borderRadius: 48,
              backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.EXTREME].color}20`,
              width: selectedScenario === SCENARIOS.EXTREME ? 130 : 48,
              minWidth: 48,
              height: 48,
              "&:hover": {
                opacity: 1,
                backgroundColor: `${
                  SCENARIO_PARAMS[SCENARIOS.EXTREME].color
                }20`,
                borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
              },
              transition: "all .2s ease",
              textTransform: "none",
              flexDirection: "column",
              lineHeight: 1.5,
            }}
            onClick={() => setSelectedScenario(SCENARIOS.EXTREME)}
          >
            <Box>
              {" "}
              E{selectedScenario === SCENARIOS.EXTREME ? "xtreme" : ""}
            </Box>
            <Box sx={{ whiteSpace: "nowrap" }}>
              {selectedScenario === SCENARIOS.EXTREME ? scenarioString : ""}
            </Box>
          </Button>
        </Stack>
        {riskSummary.cr4de_risk_type === RISK_TYPE.MANMADE ? (
          <Stack>
            {parsedSummary.cr4de_scenarios[selectedScenario].map((p) => {
              return (
                <HTMLEditor
                  initialHTML={Array.isArray(p.value) ? p.value[0] : p.value}
                  editableRole="analist"
                  isEditable={environment === Environment.DYNAMIC}
                  onSave={async (newParameterValue: string) => {
                    const scenarioField =
                      `cr4de_scenario_${selectedScenario.toLowerCase()}` as keyof DVRiskFile;

                    if (
                      riskSummary.cr4de_risk_file instanceof Object &&
                      "cr4de_riskfilesid" in riskSummary.cr4de_risk_file
                    ) {
                      const newScenario = parsedSummary.cr4de_scenarios![
                        selectedScenario
                      ].map((oldP) => {
                        if (oldP.name === p.name) {
                          return {
                            ...oldP,
                            value: newParameterValue,
                          };
                        }
                        return oldP;
                      });

                      api.createChangeLog({
                        "cr4de_changed_by@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
                        cr4de_changed_by_email: user?.emailaddress1,
                        cr4de_changed_object_type: "RISK_FILE",
                        cr4de_changed_object_id:
                          riskSummary._cr4de_risk_file_value,
                        cr4de_change_short: `Changed ${selectedScenario} scenario`,
                        cr4de_diff: serializeChangeLogDiff([
                          {
                            property: scenarioField,
                            originalValue: JSON.stringify(
                              parsedSummary.cr4de_scenarios![selectedScenario]
                            ),
                            newValue: JSON.stringify(newScenario),
                          },
                        ]),
                      });

                      mutation.mutate({
                        cr4de_riskfilesid: riskSummary.cr4de_risk_file
                          .cr4de_riskfilesid as string,
                        [scenarioField]: wrap(newScenario),
                      });
                    }
                  }}
                />
              );
            })}
          </Stack>
        ) : (
          <Stack>
            {parsedSummary.cr4de_scenarios[selectedScenario].map((p) => {
              return (
                <Box
                  key={`${parsedSummary._cr4de_risk_file_value}-${p.name}`}
                  sx={{ mb: 4 }}
                >
                  {p.description && (
                    <Typography variant="subtitle2">
                      {p.name}{" "}
                      <Tooltip
                        title={
                          <Box
                            dangerouslySetInnerHTML={{
                              __html: p.description || "",
                            }}
                          />
                        }
                      >
                        <HelpOutlineIcon fontSize="small" />
                      </Tooltip>
                    </Typography>
                  )}
                  {/* <Box dangerouslySetInnerHTML={{ __html: p.description || "" }} /> */}
                  <Box dangerouslySetInnerHTML={{ __html: p.value || "" }} />
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
    </>
  );
}
