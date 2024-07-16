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
import SummaryCharts from "../../components/charts/SummaryCharts";

export default function ExecutiveSummaryGraph({
  riskFile,
  calculations,
  selectedNodeId,
  setSelectedNodeId,
}: {
  riskFile: DVRiskFile;
  calculations: RiskCalculation[] | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}) {
  const [calculation, setCalculation] = useState<RiskCalculation | null>(null);
  const [scenario, setScenario] = useState<"wcs" | SCENARIOS>("wcs");

  useEffect(() => {
    if (!calculations) return;

    setCalculation(calculations.find((c) => c.riskId === selectedNodeId) || null);
  }, [selectedNodeId, calculations]);

  if (!calculation) return null;

  const trueScenario = scenario === "wcs" ? getWorstCaseScenario(calculation) : scenario;

  return (
    <Accordion disabled={!calculations || !selectedNodeId}>
      <AccordionSummary>
        <Typography variant="subtitle2">Executive Summary diagrams</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{}}>
        <SummaryCharts riskFile={riskFile} calculation={calculation} scenario={trueScenario} />
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
