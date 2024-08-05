import { useEffect, useState } from "react";
import ImpactDistributionPieChart from "../../components/charts/ImpactDistributionPieChart";
import ImpactSankey from "../../components/charts/ImpactSankey";
import ProbabilitySankey from "../../components/charts/ProbabilitySankey";
import {
  Stack,
  Typography,
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS, SCENARIO_PARAMS, getScenarioSuffix, getWorstCaseScenario } from "../../functions/scenarios";
import ImpactBarChart from "../../components/charts/ImpactBarChart";
import { capFirst } from "../../functions/capFirst";

export default function SankeyGraph({
  calculations,
  selectedNodeId,
  setSelectedNodeId,
}: {
  calculations: RiskCalculation[] | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}) {
  const [calculation, setCalculation] = useState<RiskCalculation | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<"wcs" | SCENARIOS>("wcs");
  const [split, setSplit] = useState<"total" | "scenario" | "impact">("impact");
  const [causes, setCauses] = useState(5);
  const [effects, setEffects] = useState(5);

  useEffect(() => {
    if (!calculations) return;

    setCalculation(calculations.find((c) => c.riskId === selectedNodeId) || null);
  }, [selectedNodeId, calculations]);

  if (!calculation) return null;

  const scenario = selectedScenario === "wcs" ? getWorstCaseScenario(calculation) : selectedScenario;

  return (
    <Accordion disabled={!calculations || !selectedNodeId}>
      <AccordionSummary>
        <Typography variant="subtitle2">Risk sankey diagram</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{}}>
        <Stack direction="row" sx={{ mb: 8 }}>
          <Box sx={{ width: "calc(50% - 150px)", height: 600 }}>
            {/* <ProbabilitySankey
              calculation={calculation}
              maxCauses={causes}
              scenario={scenario}
              debug={true}
              onClick={(id: string) => setSelectedNodeId(id)}
            /> */}
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
            <Box sx={{ width: "100%", textAlign: "center", mb: 2 }}>
              <Typography variant="h6">{calculation.riskTitle}</Typography>
              <Typography variant="subtitle1" color={SCENARIO_PARAMS[scenario].color}>
                {capFirst(scenario)} scenario
              </Typography>
            </Box>
            <Box
              sx={{
                width: 200,
                height: 350,
              }}
            >
              {/* <ImpactBarChart calculation={calculation} scenarioSuffix={getScenarioSuffix(scenario)} /> */}
              {/* <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">
                  Total Probability: <b>{Math.round(10000 * getYearlyProbability(calculation.tp)) / 100}% / year</b>
                </Typography>
                <Typography variant="subtitle2">
                  Total Impact: <b>{getMoneyString(calculation.ti)} / event</b>
                </Typography>
              </Box> */}
            </Box>
          </Stack>
          <Box sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}>
            {/* <ImpactSankey
              calculation={calculation}
              maxEffects={effects}
              scenario={scenario}
              onClick={(id: string) => setSelectedNodeId(id)}
              debug={true}
            /> */}
          </Box>
        </Stack>
      </AccordionDetails>
      <AccordionActions>
        <Stack direction="row" spacing={5} sx={{ flex: 1 }}>
          <FormControl sx={{ flex: 1 }} fullWidth>
            <TextField
              label="Causes"
              type="number"
              value={causes}
              onChange={(e) => {
                if (e.target.value !== "" && !isNaN(parseInt(e.target.value))) {
                  setCauses(Math.min(10, Math.max(1, parseInt(e.target.value))));
                }
              }}
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }} fullWidth>
            <InputLabel>Show Scenario</InputLabel>
            <Select
              value={selectedScenario}
              label="Show Scenario"
              onChange={(e) => setSelectedScenario(e.target.value as any)}
            >
              <MenuItem value={"wcs"}>Worst Case</MenuItem>
              <MenuItem value={"considerable"}>Considerable</MenuItem>
              <MenuItem value={"major"}>Major</MenuItem>
              <MenuItem value={"extreme"}>Extreme</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }} fullWidth>
            <InputLabel>Split flows</InputLabel>
            <Select value={split} label="Node Size" onChange={(e) => setSplit(e.target.value as any)}>
              <MenuItem value={"total"}>-</MenuItem>
              <MenuItem value={"scenario"}>Scenario</MenuItem>
              <MenuItem value={"impact"}>Impact</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ flex: 1 }} fullWidth>
            <TextField
              type="number"
              label="Effects"
              value={effects}
              onChange={(e) => {
                if (e.target.value !== "" && !isNaN(parseInt(e.target.value))) {
                  setEffects(Math.min(10, Math.max(1, parseInt(e.target.value))));
                }
              }}
            />
          </FormControl>
        </Stack>
      </AccordionActions>
    </Accordion>
  );
}
