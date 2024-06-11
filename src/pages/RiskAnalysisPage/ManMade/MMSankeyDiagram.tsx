import { Stack, Typography, Box, Button } from "@mui/material";
import { RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";
import { SCENARIOS, SCENARIO_PARAMS, getScenarioSuffix } from "../../../functions/scenarios";
import { getTotalProbabilityRelativeScale } from "../../../functions/Probability";
import ProbabilityBars from "../../../components/charts/ProbabilityBars";
import ImpactBarChart from "../../../components/charts/ImpactBarChart";
import { useNavigate, useOutletContext } from "react-router-dom";
import ProbabilitySankey from "../../../components/charts/ProbabilitySankey";
import ImpactSankey from "../../../components/charts/ImpactSankey";
import { RiskFilePageContext } from "../../BaseRiskFilePage";
import { useEffect, useState } from "react";
import ActionsSankey from "../../../components/charts/ActionsSankey";

export default function MMSankeyDiagram({
  calculation,
  scenario,
  debug = false,
  manmade = false,
}: {
  calculation: RiskCalculation;
  scenario: SCENARIOS;
  debug?: boolean;
  manmade?: boolean;
}) {
  const navigate = useNavigate();
  const { isEditing } = useOutletContext<RiskFilePageContext>();
  const [selectedScenario, setSelectedScenario] = useState(scenario);

  useEffect(() => {
    setSelectedScenario(scenario);
  }, [calculation]);

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
          calculation={calculation}
          maxActions={null}
          shownActionPortion={0.8}
          minActionPortion={null}
          scenario={selectedScenario}
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
          <ProbabilityBars
            tp={getTotalProbabilityRelativeScale(calculation, getScenarioSuffix(selectedScenario))}
            chartWidth={200}
            manmade={true}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center", mt: 0, mb: 1 }}>
            <Typography variant="subtitle2">Scenario</Typography>
          </Box>
          <Stack direction="row" justifyContent="space-between">
            <Button
              variant="outlined"
              sx={{
                color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
                fontWeight: selectedScenario === SCENARIOS.CONSIDERABLE ? "bold" : "normal",
                opacity: selectedScenario === SCENARIOS.CONSIDERABLE ? 1 : 0.15,
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
              onClick={() => setSelectedScenario(SCENARIOS.CONSIDERABLE)}
            >
              C
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
                fontWeight: selectedScenario === SCENARIOS.MAJOR ? "bold" : "normal",
                opacity: selectedScenario === SCENARIOS.MAJOR ? 1 : 0.3,
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
              onClick={() => setSelectedScenario(SCENARIOS.MAJOR)}
            >
              M
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
                fontWeight: selectedScenario === SCENARIOS.EXTREME ? "bold" : "normal",
                opacity: selectedScenario === SCENARIOS.EXTREME ? 1 : 0.15,
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
              onClick={() => setSelectedScenario(SCENARIOS.EXTREME)}
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
            <Typography variant="subtitle2">Damage Indicators</Typography>
          </Box>
          <ImpactBarChart calculation={calculation} scenarioSuffix={getScenarioSuffix(selectedScenario)} />
        </Box>
      </Stack>
      <Box sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}>
        <ImpactSankey
          calculation={calculation}
          maxEffects={null}
          shownEffectPortion={0.8}
          minEffectPortion={null}
          scenario={selectedScenario}
          onClick={goToRiskFile}
          debug={debug}
        />
      </Box>
    </Stack>
  );
}
