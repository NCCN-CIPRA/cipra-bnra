import { Box, IconButton, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { Cascades } from "../../BaseRisksPage";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
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
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import ManmadeIdentificationTutorial from "./ManmadeIdentificationTutorial";
import BNRASpeedDial from "../../../components/BNRASpeedDial";

const ibsx = {
  transition: "opacity .3s ease",
  ml: 1,
};

export default function Manmade({
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
  loadAttachments: () => Promise<unknown>;
  hazardCatalogue: SmallRisk[] | null;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const intensityParameters = IP.unwrap(riskFile.cr4de_intensity_parameters);
  const MRS = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;
  const MRSSuffix = getScenarioSuffix(MRS);

  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskFile={riskFile} />

      <Box>
        <Typography variant="h5">
          {t("riskFile.definition.title", "Definition")}
        </Typography>{" "}
        <Box
          id="definition"
          sx={{
            borderLeft: "solid 8px #eee",
            px: 2,
            py: 1,
            mt: 2,
            backgroundColor: "white",
          }}
        >
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

      {/* <Box id="intelligence" sx={{ mt: 8, clear: "both" }}>
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
      </Box> */}

      {riskFile.cr4de_intensity_parameters && (
        <Box id="mrag" sx={{ mt: 8 }}>
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

      <Box id="sources">
        <Bibliography
          riskFile={riskFile}
          cascades={cascades.all}
          attachments={attachments}
          reloadAttachments={loadAttachments}
        />
      </Box>

      <BNRASpeedDial
        offset={{ x: 0, y: 56 }}
        exportAction={() =>
          navigate(`/risks/${riskFile.cr4de_riskfilesid}/export`)
        }
        HelpComponent={ManmadeIdentificationTutorial}
      />
    </Box>
  );
}
