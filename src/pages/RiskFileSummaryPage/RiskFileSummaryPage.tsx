import { useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { Box, Container, Stack } from "@mui/material";
import SummaryCharts from "../../components/charts/SummaryCharts";
import { SCENARIOS } from "../../functions/scenarios";
import { useTranslation } from "react-i18next";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import RiskFileTitle from "../../components/RiskFileTitle";
import { getLanguage } from "../../functions/translations";
import BNRASpeedDial from "../../components/BNRASpeedDial";
import handleExportRiskfile from "../../functions/export/exportBNRA";
import useAPI, { DataTable } from "../../hooks/useAPI";
import RiskFileSummaryTutorial from "./RiskFileSummaryTutorial";
import HTMLEditor from "../../components/HTMLEditor";
import { BasePageContext } from "../BasePage";
import { useMutation } from "@tanstack/react-query";

export default function RiskFileSummaryPage() {
  const { environment } = useOutletContext<BasePageContext>();
  const { i18n } = useTranslation();
  const api = useAPI();
  const { user, riskSummary } = useOutletContext<RiskFilePageContext>();

  const summary =
    riskSummary[`cr4de_summary_${getLanguage(i18n.language)}`] || "";

  const updateRiskFile = useMutation({
    mutationFn: async (newHTML: string) => {
      await Promise.all([
        api.updateRiskSummary(riskSummary.cr4de_bnrariskfilesummaryid, {
          cr4de_summary_en: newHTML || undefined,
        }),
        api.updateRiskFile(riskSummary._cr4de_risk_file_value, {
          cr4de_mrs_summary: newHTML,
        }),
      ]);
    },
  });

  return (
    <Container sx={{ mt: 2, pb: 8 }}>
      <RiskFileTitle riskFile={riskSummary} />
      <Stack direction="row" sx={{ mb: 8 }} columnGap={4}>
        <Box id="summary-text" data-testid="summary-text" sx={{ flex: 1 }}>
          <HTMLEditor
            initialHTML={summary}
            onSave={updateRiskFile}
            queryKeyToInvalidate={[
              DataTable.RISK_FILE,
              riskSummary._cr4de_risk_file_value,
            ]}
          />
        </Box>
        {riskSummary.cr4de_risk_type !== RISK_TYPE.EMERGING && (
          <Box>
            <Box id="summary-charts" sx={{ bgcolor: "white" }}>
              <SummaryCharts
                riskSummary={riskSummary}
                scenario={riskSummary.cr4de_mrs || SCENARIOS.MAJOR}
                manmade={riskSummary.cr4de_risk_type === RISK_TYPE.MANMADE}
                canDownload={Boolean(user && user.roles.internal)}
              />
            </Box>
          </Box>
        )}
      </Stack>
      {user && (
        <Box sx={{ position: "fixed", bottom: 96, right: 40 }}>
          <BNRASpeedDial
            offset={{ x: 0, y: 56 }}
            // editAction={() => setEditing(true)}
            exportAction={handleExportRiskfile(riskSummary, api, environment)}
            HelpComponent={RiskFileSummaryTutorial}
          />
        </Box>
      )}
    </Container>
  );
}
