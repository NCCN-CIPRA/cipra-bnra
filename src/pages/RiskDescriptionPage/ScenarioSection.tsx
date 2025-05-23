import { useState } from "react";
import { Box, Typography, Tooltip, Stack, Button } from "@mui/material";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTranslation } from "react-i18next";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";

export default function ScenarioSection({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  const { t } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState(
    riskSummary.cr4de_mrs || SCENARIOS.CONSIDERABLE
  );

  if (!riskSummary.cr4de_scenarios) return null;

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
        <Stack>
          {riskSummary.cr4de_scenarios[selectedScenario].map((p) => {
            return (
              <Box
                key={`${riskSummary._cr4de_risk_file_value}-${p.name}`}
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
      </Box>
    </>
  );
}
