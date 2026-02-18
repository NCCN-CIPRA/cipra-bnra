import { Box, Typography } from "@mui/material";
import Attachments from "./Attachments";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { RiskFilePageContext } from "../pages/BaseRiskFilePage";
import { DataTable } from "../hooks/useAPI";

export default function RiskFileBibliography({
  riskFileId,
}: {
  riskFileId: string;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { attachments } = useOutletContext<RiskFilePageContext>();

  return (
    <Box className="risk-file-sources" sx={{ mt: 8 }}>
      <Typography variant="h5">{t("Bibliography")}</Typography>
      <Box
        sx={{
          borderLeft: "solid 8px #eee",
          px: 2,
          mt: 2,
          backgroundColor: "white",
        }}
      >
        <Attachments
          riskFileId={riskFileId}
          attachments={
            attachments
              ? attachments.map((a) =>
                  a.cr4de_referencedSource
                    ? ({
                        ...a.cr4de_referencedSource,
                        cr4de_bnraattachmentid: a.cr4de_bnraattachmentid,
                        cr4de_field: a.cr4de_field,
                        cr4de_referencedSource: a.cr4de_referencedSource,
                      } as DVAttachment)
                    : a,
                )
              : null
          }
          onUpdate={() =>
            queryClient.invalidateQueries({
              queryKey: riskFileId
                ? [DataTable.ATTACHMENT, riskFileId]
                : [DataTable.ATTACHMENT],
            })
          }
          alwaysOpen
        />
      </Box>
    </Box>
  );
}
