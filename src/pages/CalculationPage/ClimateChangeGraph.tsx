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
import { SCENARIOS, SCENARIO_PARAMS, getScenarioSuffix } from "../../functions/scenarios";
import ClimateChangeChart from "../../components/charts/ClimateChangeChart";

const capFirst = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function ClimateChangeGraph({
  calculations,
  selectedNodeId,
  setSelectedNodeId,
}: {
  calculations: RiskCalculation[] | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}) {
  const [calculation, setCalculation] = useState<RiskCalculation | null>(null);
  const [scenario, setScenario] = useState<"wcs" | SCENARIOS>("wcs");
  const [split, setSplit] = useState<"total" | "scenario" | "impact">("impact");
  const [causes, setCauses] = useState(5);
  const [effects, setEffects] = useState(5);

  useEffect(() => {
    if (!calculations) return;

    setCalculation(calculations.find((c) => c.riskId === selectedNodeId) || null);
  }, [selectedNodeId, calculations]);

  if (!calculation) return null;

  const rs = [
    calculation.tp_c * calculation.ti_c,
    calculation.tp_m * calculation.ti_m,
    calculation.tp_e * calculation.ti_e,
  ];

  const scenarioSuffix = getScenarioSuffix(
    scenario === "wcs"
      ? [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME][rs.indexOf(Math.max(...rs))]
      : scenario
  );

  return (
    <Accordion disabled={!calculations || !selectedNodeId}>
      <AccordionSummary>
        <Typography variant="subtitle2">Climate Change diagram</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{}}>
        <Stack direction="row" sx={{ mb: 8 }}>
          <ClimateChangeChart calculation={calculation} scenarioSuffix={scenarioSuffix} />
        </Stack>
      </AccordionDetails>
      <AccordionActions>
        <Stack direction="row" spacing={5} sx={{ flex: 1 }}>
          <FormControl sx={{ flex: 1 }} fullWidth>
            <InputLabel>Show Scenario</InputLabel>
            <Select value={scenario} label="Show Scenario" onChange={(e) => setScenario(e.target.value as any)}>
              <MenuItem value={"wcs"}>Worst Case</MenuItem>
              <MenuItem value={"considerable"}>Considerable</MenuItem>
              <MenuItem value={"major"}>Major</MenuItem>
              <MenuItem value={"extreme"}>Extreme</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </AccordionActions>
    </Accordion>
  );
}
