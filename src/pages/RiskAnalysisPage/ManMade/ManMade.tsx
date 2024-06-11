import { Box, List, ListItemButton, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import * as IP from "../../../functions/intensityParameters";
import { SCENARIOS } from "../../../functions/scenarios";
import { DVAnalysisRun, RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";
import { getDirectImpact, getIndirectImpact } from "../../../functions/Impact";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import { Cause } from "../../../functions/Probability";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { useEffect, useMemo } from "react";
import { Link, useOutletContext } from "react-router-dom";
import DefinitionSection from "../DefinitionSection";
import CapacitiesSection from "./CapacitiesSection";
import IntelligenceSection from "./IntelligenceSection";
import Bibliography from "../Bibliography";
import { DataTable } from "../../../hooks/useAPI";
import useRecords from "../../../hooks/useRecords";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { RiskFilePageContext } from "../../BaseRiskFilePage";
import ActionsSection from "./PreferredActionsSection";
import { Cascades } from "../../BaseRisksPage";
import MMSankeyDiagram from "./MMSankeyDiagram";
import MMImpactSection from "./MMImpactSection";

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

export default function ManMade({
  riskFile,
  calculation,
  cascades,
  mode = "view",
  isEditing,
  setIsEditing,
  reloadRiskFile,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
  calculation: RiskCalculation;
  mode?: "view" | "edit";
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
}) {
  const { hazardCatalogue, attachments, loadAttachments } = useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    if (!attachments) loadAttachments();
  }, []);

  const rf = riskFile;

  const intensityParameters = IP.unwrap(rf.cr4de_intensity_parameters);
  const MRS = getMostRelevantScenario(calculation);
  const MRSSuffix = getScenarioSuffix(MRS);

  return (
    <>
      {/* <Typography variant="h2" sx={{ mb: 4 }}>
        Standard Risks
      </Typography> */}

      <Box sx={{ mb: 10 }}>
        <Typography variant="h3">{rf.cr4de_title}</Typography>
        <Typography variant="subtitle2" color="secondary" sx={{ mb: 4 }}>
          Malicious Actor Risk File
        </Typography>

        <MMSankeyDiagram calculation={calculation} debug={mode === "edit"} manmade scenario={MRS} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">Definition</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <DefinitionSection
              riskFile={rf}
              mode={mode}
              attachments={attachments}
              updateAttachments={loadAttachments}
              isEditingOther={isEditing}
              setIsEditing={setIsEditing}
              reloadRiskFile={reloadRiskFile}
              allRisks={hazardCatalogue}
            />
          </Box>
        </Box>

        {rf.cr4de_intensity_parameters && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5">Most Relevant Actor Group</Typography>

            <ScenarioMatrix calculation={calculation} mrs={MRS} />

            <CapacitiesSection
              intensityParameters={intensityParameters}
              riskFile={rf}
              scenario={MRS}
              mode={mode}
              attachments={attachments}
              updateAttachments={loadAttachments}
              isEditingOther={isEditing}
              setIsEditing={setIsEditing}
              reloadRiskFile={reloadRiskFile}
              allRisks={hazardCatalogue}
            />
          </Box>
        )}

        <Box sx={{ mt: 8, clear: "both" }}>
          <Typography variant="h5">Intelligence Assessment</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <IntelligenceSection
              riskFile={rf}
              MRSSuffix={MRSSuffix}
              calc={calculation}
              mode={mode}
              attachments={attachments}
              updateAttachments={loadAttachments}
              isEditingOther={isEditing}
              setIsEditing={setIsEditing}
              reloadRiskFile={reloadRiskFile}
              allRisks={hazardCatalogue}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Prefered Malicious Actions</Typography>

          <ActionsSection
            riskFile={rf}
            effects={cascades.effects}
            scenario={MRS}
            calc={calculation}
            mode={mode}
            attachments={attachments}
            updateAttachments={loadAttachments}
            isEditingOther={isEditing}
            setIsEditing={setIsEditing}
            reloadRiskFile={reloadRiskFile}
            allRisks={hazardCatalogue}
          />
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Other Impactful Actions</Typography>

          <MMImpactSection
            riskFile={rf}
            effects={cascades.effects}
            scenario={MRS}
            calc={calculation}
            mode={mode}
            attachments={attachments}
            updateAttachments={loadAttachments}
            isEditingOther={isEditing}
            setIsEditing={setIsEditing}
            reloadRiskFile={reloadRiskFile}
            allRisks={hazardCatalogue}
          />
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Catalysing Effects</Typography>

          <Box sx={{ borderLeft: "solid 8px #eee", mt: 2, backgroundColor: "white" }}>
            <Box sx={{ px: 2, pt: 2 }}>
              <Typography variant="body2" paragraph>
                The following emerging risks were identified as having a potential catalysing effect on the probability
                and/or impact of this risk. Please refer to the corresponding risk files for the qualitative assessment
                of this effect:
              </Typography>
            </Box>
            <List>
              {cascades.catalyzingEffects.map((c, i) => (
                <ListItemButton
                  LinkComponent={Link}
                  href={`/risks/${c.cr4de_cause_hazard.cr4de_riskfilesid}?tab=analysis`}
                >
                  <Typography variant="subtitle2" sx={{ pl: 2 }}>
                    {c.cr4de_cause_hazard.cr4de_title}{" "}
                  </Typography>
                </ListItemButton>
              ))}
            </List>
          </Box>
        </Box>

        <Bibliography
          riskFile={riskFile}
          cascades={cascades.all}
          attachments={attachments}
          reloadAttachments={loadAttachments}
        />
      </Box>
    </>
  );
}
