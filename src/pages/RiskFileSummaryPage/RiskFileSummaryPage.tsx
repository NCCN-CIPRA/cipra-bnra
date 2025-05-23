import { useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { Box, Container, Stack } from "@mui/material";
import SummaryCharts from "../../components/charts/SummaryCharts.new";
import { SCENARIOS } from "../../functions/scenarios";
import { useTranslation } from "react-i18next";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import RiskFileTitle from "../../components/RiskFileTitle";
import { getLanguage } from "../../functions/translations";
import BNRASpeedDial from "../../components/BNRASpeedDial";

export default function RiskFileSummaryPage() {
  const { i18n } = useTranslation();
  const { user, riskSummary } = useOutletContext<RiskFilePageContext>();

  const summary =
    riskSummary[`cr4de_summary_${getLanguage(i18n.language)}`] || "";

  return (
    <Container sx={{ mt: 2, pb: 8 }}>
      <RiskFileTitle riskFile={riskSummary} />
      <Stack direction="row" sx={{ mb: 8 }} columnGap={4}>
        <Box id="summary-text" sx={{ flex: 1 }}>
          <Box
            className="htmleditor"
            sx={{
              mb: 4,
              fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
            }}
            dangerouslySetInnerHTML={{ __html: summary }}
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
            // exportAction={handleExportRiskfile(riskFile, api)}
            // HelpComponent={RiskFileSummaryTutorial}
          />
        </Box>
      )}
    </Container>
  );
}
