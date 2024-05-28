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
import { Cause } from "../../functions/Probability";
import useRecords from "../../hooks/useRecords";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { DataTable } from "../../hooks/useAPI";
import useLazyRecords from "../../hooks/useLazyRecords";
import Attachments from "../../components/Attachments";
import CCSection from "./CCSection";
import Bibliography from "./Bibliography";

const getMostRelevantScenario = (r: RiskCalculation) => {
  if (r.tr_c > r.tr_m && r.tr_c > r.tr_e) return SCENARIOS.CONSIDERABLE;
  if (r.tr_m > r.tr_c && r.tr_m > r.tr_e) return SCENARIOS.MAJOR;
  return SCENARIOS.EXTREME;
};

const getScenarioSuffix = (scenario: SCENARIOS) => {
  if (scenario === SCENARIOS.CONSIDERABLE) return "_c";
  else if (scenario === SCENARIOS.MAJOR) return "_m";
  return "_e";
};

export default function Standard({
  riskFile,
  otherRiskFiles,
  cascades,
  mode = "view",
}: {
  riskFile: DVRiskFile<DVAnalysisRun<unknown, string>>;
  otherRiskFiles: DVRiskFile<DVAnalysisRun<unknown, string>>[];
  cascades: DVRiskCascade<SmallRisk>[];
  mode?: "view" | "edit";
}) {
  const { data: attachments, reloadData: reloadAttachments } = useRecords<DVAttachment<unknown, DVAttachment>>({
    table: DataTable.ATTACHMENT,
    query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_referencedSource`,
  });

  const calculations = useMemo(
    () => otherRiskFiles.map((rf) => JSON.parse(rf.cr4de_latest_calculation?.cr4de_results as string)),
    [otherRiskFiles]
  );
  const cDict = useMemo(
    () =>
      cascades.reduce(
        (acc, c) => ({
          ...acc,
          [c.cr4de_bnrariskcascadeid]: c,
        }),
        {} as { [key: string]: DVRiskCascade }
      ),
    [cascades]
  );

  const rf = riskFile;

  const intensityParameters = IP.unwrap(rf.cr4de_intensity_parameters);
  const calc: RiskCalculation = JSON.parse(rf.cr4de_latest_calculation?.cr4de_results as string);
  const MRS = getMostRelevantScenario(calc);
  const MRSSuffix = getScenarioSuffix(MRS);

  const ti_H = Math.round(calc[`ti_Ha${MRSSuffix}`] + calc[`ti_Hb${MRSSuffix}`] + calc[`ti_Hc${MRSSuffix}`]);
  const ti_S = Math.round(
    calc[`ti_Sa${MRSSuffix}`] + calc[`ti_Sb${MRSSuffix}`] + calc[`ti_Sc${MRSSuffix}`] + calc[`ti_Sd${MRSSuffix}`]
  );
  const ti_E = Math.round(calc[`ti_Ea${MRSSuffix}`]);
  const ti_F = Math.round(calc[`ti_Fa${MRSSuffix}`] + calc[`ti_Fb${MRSSuffix}`]);

  const causes: Cause[] = [
    {
      id: null,
      name: "No underlying cause",
      p: calc[`dp${MRSSuffix}`],
      quali: rf[`cr4de_dp_quali${MRSSuffix}`],
    },
    ...(calc.causes
      .filter((c) => c[`ip${MRSSuffix}`] !== 0)
      .map((c) => {
        return {
          id: c.cause.riskId,
          name: c.cause.riskTitle,
          p: c[`ip${MRSSuffix}`],
          quali: cDict[c.cascadeId].cr4de_quali,
        };
      }) || []),
  ].sort((a, b) => b.p - a.p);

  const effects = [
    getDirectImpact(calc, riskFile, MRSSuffix),
    ...calc.effects.map((c) => getIndirectImpact(c, calc, MRSSuffix, cDict[c.cascadeId])),
  ];

  const catalyzing = cascades.filter(
    (c) =>
      c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid &&
      c.cr4de_c2c === null &&
      c.cr4de_cause_hazard.cr4de_title.indexOf("Climate") < 0
  );
  const cc = cascades.find((c) => c.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0);

  return (
    <>
      {/* <Typography variant="h2" sx={{ mb: 4 }}>
        Standard Risks
      </Typography> */}

      <Box sx={{ mb: 10 }}>
        <Typography variant="h3" sx={{ mb: 4 }}>
          {rf.cr4de_title}
        </Typography>

        <SankeyDiagram
          calculations={calculations}
          selectedNodeId={rf.cr4de_riskfilesid}
          setSelectedNodeId={() => {}}
          type="PARETO"
          debug={mode === "edit"}
          scenario={MRS}
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">Definition</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <DefinitionSection
              riskFile={rf}
              mode={mode}
              attachments={attachments}
              updateAttachments={reloadAttachments}
            />
          </Box>
        </Box>

        {rf.cr4de_historical_events && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5">Historical Events</Typography>
            <HistoricalEvents
              riskFile={rf}
              mode={mode}
              attachments={attachments}
              updateAttachments={reloadAttachments}
            />
          </Box>
        )}

        {rf.cr4de_intensity_parameters && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5">Most Relevant Scenario</Typography>

            <ScenarioMatrix calculation={calc} mrs={MRS} />

            {/* <IntensityParametersTable initialParameters={rf.cr4de_intensity_parameters} /> */}

            <Scenario
              intensityParameters={intensityParameters}
              riskFile={rf}
              scenario={MRS}
              mode={mode}
              attachments={attachments}
              updateAttachments={reloadAttachments}
            />
          </Box>
        )}

        <Box sx={{ mt: 8, clear: "both" }}>
          <Typography variant="h5">Probability Assessment</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <ProbabilitySection
              riskFile={rf}
              causes={causes}
              MRSSuffix={MRSSuffix}
              calc={calc}
              mode={mode}
              attachments={attachments}
              updateAttachments={reloadAttachments}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Impact Assessment</Typography>

          <ImpactSection
            riskFile={rf}
            effects={effects}
            scenarioSuffix={MRSSuffix}
            impactName="human"
            calc={calc}
            mode={mode}
            attachments={attachments}
            updateAttachments={reloadAttachments}
          />

          <ImpactSection
            riskFile={rf}
            effects={effects}
            scenarioSuffix={MRSSuffix}
            impactName="societal"
            calc={calc}
            mode={mode}
            attachments={attachments}
            updateAttachments={reloadAttachments}
          />

          <ImpactSection
            riskFile={rf}
            effects={effects}
            scenarioSuffix={MRSSuffix}
            impactName="environmental"
            calc={calc}
            mode={mode}
            attachments={attachments}
            updateAttachments={reloadAttachments}
          />

          <ImpactSection
            riskFile={rf}
            effects={effects}
            scenarioSuffix={MRSSuffix}
            impactName="financial"
            calc={calc}
            mode={mode}
            attachments={attachments}
            updateAttachments={reloadAttachments}
          />

          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <Typography variant="h6">Cross-border Impact</Typography>
            <CBSection
              riskFile={riskFile}
              scenarioSuffix={MRSSuffix}
              mode={mode}
              attachments={attachments}
              updateAttachments={reloadAttachments}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Climate Change</Typography>

          <CCSection
            cc={cc}
            mode={mode}
            riskFile={rf}
            scenarioSuffix={MRSSuffix}
            calculation={calc}
            attachments={attachments}
            updateAttachments={reloadAttachments}
          />
        </Box>

        {catalyzing.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5">Other Catalysing Effects</Typography>

            <Box sx={{ borderLeft: "solid 8px #eee", mt: 2, backgroundColor: "white" }}>
              <Box sx={{ px: 2, pt: 2 }}>
                <Typography variant="body2" paragraph>
                  The following emerging risks were identified as having a potential catalysing effect on the
                  probability and/or impact of this risk. Please refer to the corresponding risk files for the
                  qualitative assessment of this effect:
                </Typography>
              </Box>
              <List>
                {catalyzing.map((c, i) => (
                  <ListItemButton
                    LinkComponent={Link}
                    href={`/risks/${c.cr4de_cause_hazard.cr4de_riskfilesid}?tab=analysis`}
                    target="_blank"
                  >
                    <Typography variant="subtitle2" sx={{ pl: 2 }}>
                      {c.cr4de_cause_hazard.cr4de_title}{" "}
                    </Typography>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Box>
        )}

        <Bibliography riskFile={riskFile} attachments={attachments} reloadAttachments={reloadAttachments} />
      </Box>
    </>
  );
}
