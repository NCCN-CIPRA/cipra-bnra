import { Box, IconButton, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { Cascades } from "../../BaseRisksPage";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../../BaseRiskFilePage";
import DefinitionSection from "../DefinitionSection";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Section } from "../HelpSiderBar";
import { getScenarioSuffix, SCENARIOS } from "../../../functions/scenarios";
import { useEffect } from "react";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import Bibliography from "../../RiskAnalysisPage/Bibliography";
import RiskFileTitle from "../../../components/RiskFileTitle";
import IntelligenceSection from "./IntelligenceSection";
import CapacitiesSection from "../../RiskAnalysisPage/ManMade/CapacitiesSection";
import * as IP from "../../../functions/intensityParameters";

const ibsx = {
  transition: "opacity .3s ease",
  ml: 1,
};

export default function Manmade({
  riskFile,
  cascades,
  mode = "view",
  isEditing,
  setIsEditing,
  reloadRiskFile,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
  mode?: "view" | "edit";
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const { helpOpen, setHelpFocus, hazardCatalogue, attachments, loadAttachments } =
    useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    if (!attachments) loadAttachments();
  }, []);

  const intensityParameters = IP.unwrap(riskFile.cr4de_intensity_parameters);
  const MRS = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;
  const MRSSuffix = getScenarioSuffix(MRS);

  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskFile={riskFile} />

      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">
          {t("riskFile.definition.title", "Definition")}
          {helpOpen && (
            <IconButton size="small" sx={ibsx} onClick={() => setHelpFocus(Section.PROB_BREAKDOWN)}>
              <HelpOutlineIcon fontSize="inherit" />
            </IconButton>
          )}
        </Typography>{" "}
        <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
          <DefinitionSection
            riskFile={riskFile}
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

      <Box sx={{ mt: 8, clear: "both" }}>
        <Typography variant="h5">Intelligence Assessment</Typography>
        <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
          <IntelligenceSection
            riskFile={riskFile}
            MRSSuffix={MRSSuffix}
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

      {riskFile.cr4de_intensity_parameters && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Most Relevant Actor Group")}</Typography>

          <ScenarioMatrix riskFile={riskFile} mrs={MRS} />

          <CapacitiesSection
            intensityParameters={intensityParameters}
            riskFile={riskFile}
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

      <Bibliography
        riskFile={riskFile}
        cascades={cascades.all}
        attachments={attachments}
        reloadAttachments={loadAttachments}
      />
    </Box>
  );
}
