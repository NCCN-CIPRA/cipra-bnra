import { Box, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import Bibliography from "../Bibliography";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../../BaseRiskFilePage";
import { useEffect } from "react";
import CatalyzingSection from "./CatalyzingSection";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../../components/RiskFileTitle";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import EmergingAnalysisTutorial from "./EmergingAnalysisTutorial";

export default function Emerging({
  riskFile,
  cascades,
  mode = "view",
  isEditing,
  attachments,
  loadAttachments,
  hazardCatalogue,
  setIsEditing,
  reloadRiskFile,
  reloadCascades,
}: {
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  mode?: "view" | "edit";
  attachments: DVAttachment<unknown, DVAttachment<unknown, unknown>>[];
  hazardCatalogue: SmallRisk[] | null;
  loadAttachments: () => Promise<unknown>;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
  reloadCascades: (riskFile: DVRiskFile<unknown>) => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const rf = riskFile;

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskFile} />

        <Box className="catalyzing" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Catalysing Effects")}</Typography>

          <CatalyzingSection
            riskFile={rf}
            cascades={cascades}
            mode={mode}
            attachments={attachments}
            updateAttachments={loadAttachments}
            isEditingOther={isEditing}
            setIsEditing={setIsEditing}
            reloadCascades={reloadCascades}
            allRisks={hazardCatalogue}
          />
        </Box>

        <Bibliography
          riskFile={riskFile}
          cascades={cascades}
          attachments={attachments}
          reloadAttachments={loadAttachments}
        />
        <BNRASpeedDial
          offset={{ x: 0, y: 56 }}
          exportAction={() =>
            navigate(`/risks/${riskFile.cr4de_riskfilesid}/export`)
          }
          HelpComponent={EmergingAnalysisTutorial}
        />
      </Box>
    </>
  );
}
