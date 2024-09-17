import { Stack, Typography, Box, Button } from "@mui/material";
import { RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";
import { SCENARIOS, SCENARIO_PARAMS, getScenarioParameter, getScenarioSuffix } from "../../../functions/scenarios";
import { getTotalProbabilityRelativeScale } from "../../../functions/Probability";
import ProbabilityBars from "../../../components/charts/ProbabilityBars";
import ImpactBarChart from "../../../components/charts/ImpactBarChart";
import { useNavigate, useOutletContext } from "react-router-dom";
import ProbabilitySankey from "../../../components/charts/ProbabilitySankey";
import ImpactSankey from "../../../components/charts/ImpactSankey";
import { RiskFilePageContext } from "../../BaseRiskFilePage";
import { useEffect, useState } from "react";
import ActionsSankey from "../../../components/charts/ActionsSankey";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { Cascades } from "../../BaseRisksPage";
import { useTranslation } from "react-i18next";

export default function MMSankeyDiagram({
  riskFile,
  cascades,
  scenario,
  setScenario,
  debug = false,
  manmade = false,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
  scenario: SCENARIOS;
  setScenario: (s: SCENARIOS) => void;
  debug?: boolean;
  manmade?: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isEditing } = useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    setScenario(scenario);
  }, [riskFile]);

  const goToRiskFile = (id: string) => {
    if (
      !isEditing ||
      window.confirm(
        "Are you sure you wish to leave the page? You are still editing a field and unsaved changes will be lost."
      )
    ) {
      navigate(`/risks/${id}/analysis`);
    }
  };

  return (
    <Stack direction="row" sx={{ mb: 8 }}>
      <Box sx={{ width: "calc(50% - 150px)", height: 600 }}>
        <ActionsSankey
          riskFile={riskFile}
          cascades={cascades}
          maxActions={null}
          shownActionPortion={0.8}
          minActionPortion={null}
          scenario={scenario}
          onClick={goToRiskFile}
          debug={debug}
          manmade={manmade}
        />
      </Box>
      <Stack direction="column" justifyContent="center" sx={{ width: 300, p: "50px" }}>
        {/* <Box
        sx={{
          width: 200,
          height: 200,
        }}
      >
        <ProbabilityOriginPieChart riskFile={riskFile} />
      </Box>
      <Box
        sx={{
          width: 200,
          height: 200,
        }}
      >
        <ImpactOriginPieChart riskFile={riskFile} />
      </Box> */}
        {/* <Box sx={{ width: "100%", textAlign: "center", mb: 6 }}>
          <Typography variant="h6">{calculation.riskTitle}</Typography>
        </Box> */}
        <Box
          sx={{
            width: "100%",
          }}
        >
          <ProbabilityBars tp={getScenarioParameter(riskFile, "TP", scenario) || 0} chartWidth={200} manmade={true} />
        </Box>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center", mt: 0, mb: 1 }}>
            <Typography variant="subtitle2">{t("Scenario")}</Typography>
          </Box>
          <Stack direction="row" justifyContent="space-between">
            <Button
              variant="outlined"
              sx={{
                color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
                fontWeight: scenario === SCENARIOS.CONSIDERABLE ? "bold" : "normal",
                opacity: scenario === SCENARIOS.CONSIDERABLE ? 1 : 0.15,
                borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
                borderRadius: "50%",
                backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color}20`,
                width: 48,
                minWidth: 48,
                height: 48,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color}20`,
                  borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
                },
              }}
              onClick={() => setScenario(SCENARIOS.CONSIDERABLE)}
            >
              C
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
                fontWeight: scenario === SCENARIOS.MAJOR ? "bold" : "normal",
                opacity: scenario === SCENARIOS.MAJOR ? 1 : 0.3,
                borderColor: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
                borderRadius: "50%",
                backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}20`,
                width: 48,
                minWidth: 48,
                height: 48,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}20`,
                  borderColor: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
                },
              }}
              onClick={() => setScenario(SCENARIOS.MAJOR)}
            >
              M
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
                fontWeight: scenario === SCENARIOS.EXTREME ? "bold" : "normal",
                opacity: scenario === SCENARIOS.EXTREME ? 1 : 0.15,
                borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
                borderRadius: "50%",
                backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.EXTREME].color}20`,
                width: 48,
                minWidth: 48,
                height: 48,
                "&:hover": {
                  opacity: 1,
                  backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.EXTREME].color}20`,
                  borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
                },
              }}
              onClick={() => setScenario(SCENARIOS.EXTREME)}
            >
              E
            </Button>
          </Stack>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: 350,
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center", mt: 3 }}>
            <Typography variant="subtitle2">{t("Damage Indicators")}</Typography>
          </Box>
          <ImpactBarChart riskFile={riskFile} scenario={scenario} />
        </Box>
      </Stack>
      <Box sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}>
        <ImpactSankey
          riskFile={riskFile}
          cascades={cascades}
          maxEffects={null}
          shownEffectPortion={0.8}
          minEffectPortion={null}
          scenario={scenario}
          onClick={goToRiskFile}
          debug={debug}
        />
      </Box>
    </Stack>
  );
}
