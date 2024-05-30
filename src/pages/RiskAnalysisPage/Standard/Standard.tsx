import { Box, List, ListItemButton, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import * as IP from "../../../functions/intensityParameters";
import { SCENARIOS } from "../../../functions/scenarios";
import { DVAnalysisRun, RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";
import { getDirectImpact, getIndirectImpact } from "../../../functions/Impact";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import HistoricalEvents from "../HistoricalEvents";
import Scenario from "./Scenario";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { useEffect, useMemo } from "react";
import ProbabilitySection from "./ProbabilitySection";
import ImpactSection from "../ImpactSection";
import { Link, useOutletContext } from "react-router-dom";
import DefinitionSection from "../DefinitionSection";
import CBSection from "./CBSection";
import { Cause } from "../../../functions/Probability";
import useRecords from "../../../hooks/useRecords";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { DataTable } from "../../../hooks/useAPI";
import CCSection from "./CCSection";
import Bibliography from "../Bibliography";
import SankeyDiagram from "../SankeyDiagram";
import { RiskFilePageContext } from "../../BaseRiskFilePage";

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
  calculation,
  cascades,
  mode = "view",
  setIsEditing,
  reloadRiskFile,
}: {
  riskFile: DVRiskFile;
  calculation: RiskCalculation;
  cascades: DVRiskCascade<SmallRisk>[];
  mode?: "view" | "edit";
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
}) {
  const { attachments, loadAttachments } = useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    if (!attachments) loadAttachments();
  }, []);

  const rf = riskFile;

  const intensityParameters = IP.unwrap(rf.cr4de_intensity_parameters);
  const MRS = getMostRelevantScenario(calculation);
  const MRSSuffix = getScenarioSuffix(MRS);

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

  const causes: Cause[] = [
    {
      id: null,
      name: "No underlying cause",
      p: calculation[`dp${MRSSuffix}`],
      quali: rf[`cr4de_dp_quali${MRSSuffix}`],
    },
    ...(calculation.causes
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
    getDirectImpact(calculation, riskFile, MRSSuffix),
    ...calculation.effects.map((c) => getIndirectImpact(c, calculation, MRSSuffix, cDict[c.cascadeId])),
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

        <SankeyDiagram calculation={calculation} debug={mode === "edit"} scenario={MRS} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">Definition</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <DefinitionSection
              riskFile={rf}
              mode={mode}
              attachments={attachments}
              updateAttachments={loadAttachments}
              setIsEditing={setIsEditing}
              reloadRiskFile={reloadRiskFile}
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
              updateAttachments={loadAttachments}
              setIsEditing={setIsEditing}
              reloadRiskFile={reloadRiskFile}
            />
          </Box>
        )}

        {rf.cr4de_intensity_parameters && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5">Most Relevant Scenario</Typography>

            <ScenarioMatrix calculation={calculation} mrs={MRS} />

            {/* <IntensityParametersTable initialParameters={rf.cr4de_intensity_parameters} /> */}

            <Scenario
              intensityParameters={intensityParameters}
              riskFile={rf}
              scenario={MRS}
              mode={mode}
              attachments={attachments}
              updateAttachments={loadAttachments}
              setIsEditing={setIsEditing}
              reloadRiskFile={reloadRiskFile}
            />
          </Box>
        )}

        <Box sx={{ mt: 8, clear: "both" }}>
          <Typography variant="h5">Probability Assessment</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <ProbabilitySection
              riskFile={rf}
              causes={causes}
              scenario={MRS}
              calc={calculation}
              mode={mode}
              attachments={attachments}
              updateAttachments={loadAttachments}
              setIsEditing={setIsEditing}
              reloadRiskFile={reloadRiskFile}
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
            calc={calculation}
            mode={mode}
            attachments={attachments}
            updateAttachments={loadAttachments}
            setIsEditing={setIsEditing}
            reloadRiskFile={reloadRiskFile}
          />

          <ImpactSection
            riskFile={rf}
            effects={effects}
            scenarioSuffix={MRSSuffix}
            impactName="societal"
            calc={calculation}
            mode={mode}
            attachments={attachments}
            updateAttachments={loadAttachments}
            setIsEditing={setIsEditing}
            reloadRiskFile={reloadRiskFile}
          />

          <ImpactSection
            riskFile={rf}
            effects={effects}
            scenarioSuffix={MRSSuffix}
            impactName="environmental"
            calc={calculation}
            mode={mode}
            attachments={attachments}
            updateAttachments={loadAttachments}
            setIsEditing={setIsEditing}
            reloadRiskFile={reloadRiskFile}
          />

          <ImpactSection
            riskFile={rf}
            effects={effects}
            scenarioSuffix={MRSSuffix}
            impactName="financial"
            calc={calculation}
            mode={mode}
            attachments={attachments}
            updateAttachments={loadAttachments}
            setIsEditing={setIsEditing}
            reloadRiskFile={reloadRiskFile}
          />

          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <Typography variant="h6">Cross-border Impact</Typography>
            <CBSection
              riskFile={riskFile}
              scenarioSuffix={MRSSuffix}
              mode={mode}
              attachments={attachments}
              updateAttachments={loadAttachments}
              setIsEditing={setIsEditing}
              reloadRiskFile={reloadRiskFile}
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
            calculation={calculation}
            attachments={attachments}
            updateAttachments={loadAttachments}
            setIsEditing={setIsEditing}
            reloadRiskFile={reloadRiskFile}
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
                {catalyzing.map((c) => (
                  <ListItemButton
                    key={c.cr4de_bnrariskcascadeid}
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

        <Bibliography riskFile={riskFile} attachments={attachments} reloadAttachments={loadAttachments} />
      </Box>
    </>
  );
}
