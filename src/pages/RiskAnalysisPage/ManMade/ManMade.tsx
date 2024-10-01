import { Alert, Box, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import * as IP from "../../../functions/intensityParameters";
import { SCENARIOS } from "../../../functions/scenarios";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CapacitiesSection from "./CapacitiesSection";
import Bibliography from "../Bibliography";
import { RiskFilePageContext } from "../../BaseRiskFilePage";
import ActionsSection from "./PreferredActionsSection";
import { Cascades } from "../../BaseRisksPage";
import MMSankeyDiagram from "./MMSankeyDiagram";
import MMImpactSection from "./MMImpactSection";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../../components/RiskFileTitle";
import { getIndirectImpact } from "../../../functions/Impact";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import MMAnalysisTutorial from "./MMAnalysisTutorial";

export default function ManMade({
  riskFile,
  cascades,
  mode = "view",
  isEditing,
  attachments,
  loadAttachments,
  hazardCatalogue,

  setIsEditing,
  reloadRiskFile,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
  mode?: "view" | "edit";
  isEditing: boolean;
  attachments: DVAttachment<unknown, DVAttachment<unknown, unknown>>[];
  hazardCatalogue: SmallRisk[] | null;
  loadAttachments: () => Promise<unknown>;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
}) {
  const { t } = useTranslation();

  const MRS = riskFile.cr4de_mrs || SCENARIOS.EXTREME;
  const [scenario, setScenario] = useState(MRS);

  const rf = riskFile;

  const intensityParameters = IP.unwrap(rf.cr4de_intensity_parameters);

  const effects = cascades.effects.map((c) => getIndirectImpact(c, riskFile, MRS));

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskFile} />

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">{t("risks.ananylis.quantiResults", "Quantitative Analysis Results")}</Typography>

          <MMSankeyDiagram
            riskFile={riskFile}
            cascades={cascades}
            debug={mode === "edit"}
            manmade
            scenario={scenario}
            setScenario={setScenario}
          />
        </Box>

        {scenario !== MRS && (
          <Box>
            <Alert severity="warning">
              {t(
                "risks.analysis.scenarioChange",
                "You have changed the scenario is the sankey diagram above. Please be aware the the qualitative analysis results below only apply to the Most Relevant Scenario."
              )}
            </Alert>
          </Box>
        )}

        {rf.cr4de_intensity_parameters && (
          <Box className="mrag" sx={{ mt: 8 }}>
            <Typography variant="h5">{t("Most Relevant Actor Group")}</Typography>

            <ScenarioMatrix riskFile={riskFile} mrs={MRS} />

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

        <Box className="actions-assess" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Preferred Malicious Actions")}</Typography>

          <ActionsSection
            riskFile={rf}
            effects={effects}
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

        <Box className="impact-assess" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Other Impactful Actions")}</Typography>

          <MMImpactSection
            riskFile={rf}
            effects={effects}
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

        <Bibliography
          riskFile={riskFile}
          cascades={cascades.all}
          attachments={attachments}
          reloadAttachments={loadAttachments}
        />
        <BNRASpeedDial offset={{ x: 0, y: 56 }} HelpComponent={MMAnalysisTutorial} />
      </Box>
    </>
  );
}
