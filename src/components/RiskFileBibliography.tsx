import { Box, Typography } from "@mui/material";
import Attachments from "./Attachments";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { useTranslation } from "react-i18next";
import { DVRiskSummary } from "../types/dataverse/DVRiskSummary";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { useOutletContext } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { RiskFilePageContext } from "../pages/BaseRiskFilePage";
import { DataTable } from "../hooks/useAPI";

export default function RiskFileBibliography({
  risk,
}: {
  risk: DVRiskSummary | DVRiskFile;
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
              queryKey: [
                DataTable.ATTACHMENT,
                "_cr4de_risk_file_value" in risk
                  ? risk._cr4de_risk_file_value
                  : risk.cr4de_riskfilesid,
              ],
            })
          }
          alwaysOpen
        />
      </Box>
    </Box>
  );
}
