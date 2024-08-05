import { Box, Typography } from "@mui/material";
import Attachments from "../../components/Attachments";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { useTranslation } from "react-i18next";

export default function Bibliography({
  attachments,
  riskFile,
  cascades,
  reloadAttachments,
}: {
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
  reloadAttachments: () => Promise<unknown>;
}) {
  const { t } = useTranslation();

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5">{t("Bibliography")}</Typography>
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
                        cr4de_referencedSource: a.cr4de_referencedSource,
                      }
                    : a
                )
              : null
          }
          riskFile={riskFile}
          cascades={cascades}
          onUpdate={() => reloadAttachments()}
          alwaysOpen
        />
      </Box>
    </Box>
  );
}
