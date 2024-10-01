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
  isExternal = false,
  reloadAttachments,
}: {
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
  isExternal?: boolean;
  reloadAttachments: () => Promise<unknown>;
}) {
  const { t } = useTranslation();

  return (
    <Box className="risk-file-sources" sx={{ mt: 8 }}>
      <Typography variant="h5">{t("Bibliography")}</Typography>
      <Box sx={{ borderLeft: "solid 8px #eee", px: 2, mt: 2, backgroundColor: "white" }}>
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
          isExternal={isExternal}
        />
      </Box>
    </Box>
  );
}
