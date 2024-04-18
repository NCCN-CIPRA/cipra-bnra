import { Box, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import HistoricalEventsTable from "../../components/HistoricalEventsTable";
import ScenariosTable from "../../components/ScenariosTable";
import * as IP from "../../functions/intensityParameters";
import IntensityParametersTable from "../../components/IntensityParametersTable";
import ScenarioTable from "./ScenarioTable";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import { hexToRGB } from "../../functions/colors";
import { DVAnalysisRun, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { getDirectImpact, getIndirectImpact } from "../../functions/Impact";
import ImpactBarChart from "../../components/charts/ImpactBarChart";
import SankeyDiagram from "../../components/charts/SankeyDiagram";
import ScenarioMatrix from "../../components/charts/ScenarioMatrix";
import HistoricalEvents from "./HistoricalEvents";
import Scenario from "./Scenario";
import { getYearlyProbability } from "../../functions/analysis/calculateTotalRisk";
import ProbabilityOriginPieChart from "../../components/charts/ProbabilityOriginPieChart";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import getImpactColor from "../../functions/getImpactColor";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import ClimateChangeChart from "../../components/charts/ClimateChangeChart";
import { useMemo } from "react";
import ProbabilitySection from "./ProbabilitySection";
import ImpactSection from "./ImpactSection";
import { Link } from "react-router-dom";
import DefinitionSection from "./DefinitionSection";
import CBSection from "./CBSection";
import HASection from "./HASection";

export default function Emerging({
  riskFile,
  otherRiskFiles,
  cascades,
  mode = "view",
}: {
  riskFile: DVRiskFile<DVAnalysisRun<unknown, string>>;
  otherRiskFiles: DVRiskFile<DVAnalysisRun<unknown, string>>[];
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  mode?: "view" | "edit";
}) {
  const rf = riskFile;

  const catalyzing = cascades.filter((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid);

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <Typography variant="h3" sx={{ mb: 4 }}>
          {rf.cr4de_title}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">Definition</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <DefinitionSection riskFile={rf} mode={mode} />
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Horizon Analysis</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <HASection riskFile={rf} mode={mode} />
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Catalysing Effects</Typography>

          {catalyzing.map((c, i) => (
            <Box sx={{ borderLeft: "solid 8px #eee", mt: 2, px: 2, py: 1, backgroundColor: "white" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {c.cr4de_effect_hazard.cr4de_title}
              </Typography>
              <Typography variant="subtitle2" sx={{ pl: 0 }}>
                {c.cr4de_cause_hazard.cr4de_title} panel:
              </Typography>
              <Box
                sx={{ pl: 2, mb: 2, borderBottom: "1px solid #eee" }}
                dangerouslySetInnerHTML={{ __html: c.cr4de_quali_cause || "" }}
              />
              <Typography variant="subtitle2" sx={{ pl: 0 }}>
                {c.cr4de_effect_hazard.cr4de_title} panel:
              </Typography>
              <Box sx={{ pl: 2 }} dangerouslySetInnerHTML={{ __html: c.cr4de_quali || "" }} />
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
