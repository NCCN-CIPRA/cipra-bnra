import { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS, getWorstCaseScenario } from "../../functions/scenarios";
import SummaryCharts from "../../components/charts/SummaryCharts";

export default function ExecutiveSummaryGraph({
  riskFile,
  calculations,
  selectedNodeId,
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

    setCalculation(
      calculations.find((c) => c.riskId === selectedNodeId) || null
    );
  }, [selectedNodeId, calculations]);

  if (!calculation) return null;

  const trueScenario =
    scenario === "wcs" ? getWorstCaseScenario(calculation) : scenario;

  return (
    <Accordion disabled={!calculations || !selectedNodeId}>
      <AccordionSummary>
        <Typography variant="subtitle2">Executive Summary diagrams</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{}}>
        <SummaryCharts riskFile={riskFile} scenario={trueScenario} />
      </AccordionDetails>
      <AccordionActions>
        <Stack direction="row" spacing={5} sx={{ flex: 1 }}>
          <FormControl sx={{ flex: 1 }} fullWidth>
            <InputLabel>Show Scenario</InputLabel>
            <Select
              value={scenario}
              label="Show Scenario"
              onChange={(e) => setScenario(e.target.value as SCENARIOS | "wcs")}
            >
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
