import { Stack, Typography, Box } from "@mui/material";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS, getScenarioSuffix } from "../../functions/scenarios";
import { getTotalProbabilityRelativeScale } from "../../functions/Probability";
import ProbabilityBars from "../../components/charts/ProbabilityBars";
import ImpactBarChart from "../../components/charts/ImpactBarChart";
import { useNavigate } from "react-router-dom";
import ProbabilitySankey from "../../components/charts/ProbabilitySankey";
import ImpactSankey from "../../components/charts/ImpactSankey";

export default function SankeyDiagram({
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

  return (
    <Stack direction="row" sx={{ mb: 8 }}>
      <Box sx={{ width: "calc(50% - 150px)", height: 600 }}>
        <ProbabilitySankey
          calculation={calculation}
          maxCauses={null}
          shownCausePortion={0.8}
          minCausePortion={null}
          scenario={scenario}
          onClick={(id: string) => navigate(`/risks/${id}/analysis`)}
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
            tp={getTotalProbabilityRelativeScale(calculation, getScenarioSuffix(scenario))}
            chartWidth={200}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            height: 400,
          }}
        >
          <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
            <Typography variant="subtitle2">Damage Indicators</Typography>
          </Box>
          <ImpactBarChart calculation={calculation} scenarioSuffix={getScenarioSuffix(scenario)} />
        </Box>
      </Stack>
      <Box sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}>
        <ImpactSankey
          calculation={calculation}
          maxEffects={null}
          shownEffectPortion={0.8}
          minEffectPortion={null}
          scenario={scenario}
          onClick={(id: string) => navigate(`/risks/${id}/analysis`)}
          debug={debug}
        />
      </Box>
    </Stack>
  );
}
