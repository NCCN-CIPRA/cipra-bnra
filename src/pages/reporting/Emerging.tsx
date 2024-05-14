import { Box, List, ListItem, ListItemButton, Typography } from "@mui/material";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { DVAnalysisRun, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import DefinitionSection from "./DefinitionSection";
import HASection from "./HASection";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import Bibliography from "./Bibliography";

export default function Emerging({
  riskFile,
  otherRiskFiles,
  cascades,
  mode = "view",
}: {
  riskFile: DVRiskFile<DVAnalysisRun<unknown, string>>;
  otherRiskFiles: DVRiskFile<DVAnalysisRun<unknown, string>>[];
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  mode?: "view" | "edit";
}) {
  const { data: attachments, reloadData: reloadAttachments } = useRecords<DVAttachment>({
    table: DataTable.ATTACHMENT,
    query: `$filter=_cr4de_risk_file_value eq ${riskFile?.cr4de_riskfilesid}`,
  });
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
              updateAttachments={reloadAttachments}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">Horizon Analysis</Typography>
          <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
            <HASection riskFile={rf} mode={mode} attachments={attachments} updateAttachments={reloadAttachments} />
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

        <Bibliography riskFile={riskFile} attachments={attachments} reloadAttachments={reloadAttachments} />
      </Box>
    </>
  );
}
