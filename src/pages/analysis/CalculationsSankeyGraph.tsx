import { useEffect, useState } from "react";
import ImpactDistributionPieChart from "../../components/ImpactDistributionPieChart";
import ImpactSankey from "../../components/ImpactSankey";
import ProbabilitySankey from "../../components/ProbabilitySankey";
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
} from "@mui/material";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";

export default function CalculationsSankeyGraph({
  calculations,
  selectedNodeId,
  setSelectedNodeId,
}: {
  calculations: RiskCalculation[] | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}) {
  const [calculation, setCalculation] = useState<RiskCalculation | null>(null);

  useEffect(() => {
    if (!calculations) return;

    setCalculation(calculations.find((c) => c.riskId === selectedNodeId) || null);
  }, [selectedNodeId, calculations]);

  if (!calculation) return null;

  return (
    <Accordion sx={{}}>
      <AccordionSummary>
        <Typography variant="subtitle2">Risk sankey diagram</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{}}>
        <Stack direction="row" sx={{ mb: 8 }}>
          <Box sx={{ width: "calc(50% - 150px)", height: 600 }}>
            <ProbabilitySankey
              calculation={calculation}
              maxCauses={5}
              onClick={(id: string) => setSelectedNodeId(id)}
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
            <Box sx={{ width: "100%", textAlign: "center", mb: 6 }}>
              <Typography variant="h6">{calculation.riskTitle}</Typography>
            </Box>
            <Box
              sx={{
                width: 200,
                height: 200,
              }}
            >
              <ImpactDistributionPieChart calculation={calculation} />
              <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
                <Typography variant="subtitle2">Damage Indicators</Typography>
              </Box>
            </Box>
          </Stack>
          <Box sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}>
            <ImpactSankey calculation={calculation} maxEffects={5} onClick={(id: string) => setSelectedNodeId(id)} />
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
