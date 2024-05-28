import { Box, Typography } from "@mui/material";
import Attachments from "../../components/Attachments";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

export default function Bibliography({
  attachments,
  riskFile,
  reloadAttachments,
}: {
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  riskFile: DVRiskFile;
  reloadAttachments: () => Promise<unknown>;
}) {
  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5">Bibliography</Typography>
      <Box sx={{ borderLeft: "solid 8px #eee", mt: 2, backgroundColor: "white" }}>
        <Attachments
          attachments={
            attachments
              ? attachments.map((a) =>
                  a.cr4de_referencedSource
                    ? {
                        ...a.cr4de_referencedSource,
                        cr4de_bnraattachmentid: a.cr4de_bnraattachmentid,
                        cr4de_field: a.cr4de_field,
                      }
                    : a
                )
              : null
          }
          riskFile={riskFile}
          onUpdate={() => reloadAttachments()}
          alwaysOpen
        />
      </Box>
    </Box>
  );
}
