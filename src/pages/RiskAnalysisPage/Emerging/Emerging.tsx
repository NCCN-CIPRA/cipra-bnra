import { Box, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVAnalysisRun } from "../../../types/dataverse/DVAnalysisRun";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import DefinitionSection from "../DefinitionSection";
import HASection from "./HASection";
import { DataTable } from "../../../hooks/useAPI";
import useRecords from "../../../hooks/useRecords";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import Bibliography from "../Bibliography";
import { useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../../BaseRiskFilePage";
import { useEffect } from "react";
import CatalyzingSection from "./CatalyzingSection";

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
  const { hazardCatalogue, attachments, loadAttachments, reloadCascades } = useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    if (!attachments) loadAttachments();
  }, []);
  const rf = riskFile;

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <Typography variant="h3">{rf.cr4de_title}</Typography>
        <Typography variant="subtitle2" color="secondary" sx={{ mb: 4 }}>
          Emerging Risk File
        </Typography>

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

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Horizon Analysis</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <HASection
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

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Catalysing Effects</Typography>

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
