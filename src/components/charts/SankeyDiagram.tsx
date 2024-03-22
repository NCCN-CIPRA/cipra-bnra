import { useEffect, useState } from "react";
import ImpactDistributionPieChart from "./ImpactDistributionPieChart";
import ImpactSankey from "./ImpactSankey";
import ProbabilitySankey from "./ProbabilitySankey";
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
} from "@mui/material";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS } from "../../functions/scenarios";
import ImpactBarChart from "./ImpactBarChart";

export default function SankeyDiagram({
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

  return (
    <Stack direction="row" sx={{ mb: 8 }}>
      <Box sx={{ width: "calc(50% - 150px)", height: 600 }}>
        <ProbabilitySankey
          calculation={calculation}
          shownCausePortion={0.9}
          scenario={scenario === "wcs" ? null : scenario}
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
            width: "100%",
            height: 400,
          }}
        >
          <ImpactBarChart calculation={calculation} />
          <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
            <Typography variant="subtitle2">Damage Indicators</Typography>
          </Box>
        </Box>
      </Stack>
      <Box sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}>
        <ImpactSankey
          calculation={calculation}
          shownEffectPortion={0.9}
          scenario={scenario === "wcs" ? null : scenario}
          onClick={(id: string) => setSelectedNodeId(id)}
        />
      </Box>
    </Stack>
  );
}
