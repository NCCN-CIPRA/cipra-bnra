import { Box, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import Bibliography from "../Bibliography";
import { useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../../BaseRiskFilePage";
import { useEffect } from "react";
import CatalyzingSection from "./CatalyzingSection";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../../components/RiskFileTitle";

export default function Emerging({
  riskFile,
  cascades,
  mode = "view",
  isEditing,
  setIsEditing,
  reloadRiskFile,
}: {
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  mode?: "view" | "edit";
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const { hazardCatalogue, attachments, loadAttachments, reloadCascades } = useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    if (!attachments) loadAttachments();
  }, []);
  const rf = riskFile;

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskFile} />

        <Box sx={{ mt: 8 }}>
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
      </Box>
    </>
  );
}
