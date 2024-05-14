import { Box, Typography } from "@mui/material";
import Attachments from "../../components/Attachments";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

export default function Bibliography({
  attachments,
  riskFile,
  reloadAttachments,
}: {
  attachments: DVAttachment[] | null;
  riskFile: DVRiskFile;
  reloadAttachments: () => Promise<void>;
}) {
  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5">Bibliography</Typography>
      <Box sx={{ borderLeft: "solid 8px #eee", mt: 2, backgroundColor: "white" }}>
        <Attachments attachments={attachments} riskFile={riskFile} onUpdate={() => reloadAttachments()} alwaysOpen />
      </Box>
    </Box>
  );
}
