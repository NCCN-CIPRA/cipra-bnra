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

export default function Emerging({
  riskFile,
  cascades,
  mode = "view",
}: {
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  mode?: "view" | "edit";
}) {
  const { attachments, loadAttachments } = useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    if (!attachments) loadAttachments();
  }, []);
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
            <DefinitionSection
              riskFile={rf}
              mode={mode}
              attachments={attachments}
              updateAttachments={loadAttachments}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Horizon Analysis</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <HASection riskFile={rf} mode={mode} attachments={attachments} updateAttachments={loadAttachments} />
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

        <Bibliography riskFile={riskFile} attachments={attachments} reloadAttachments={loadAttachments} />
      </Box>
    </>
  );
}
