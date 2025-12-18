import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import DefinitionSection from "../DefinitionSection";
import HistoricalEvents from "../HistoricalEvents";
import ScenarioSection from "../ScenarioSection";
import RiskFileTitle from "../../../components/RiskFileTitle";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";
import RiskFileBibliography from "../../../components/RiskFileBibliography";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import StandardIdentificationTutorial from "./StandardIdentificationTutorial";
import handleExportRiskfile from "../../../functions/export/exportBNRA";
import useAPI from "../../../hooks/useAPI";
import { BasePageContext } from "../../BasePage";
import { useOutletContext } from "react-router-dom";

export default function Standard({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  const { environment } = useOutletContext<BasePageContext>();
  const { t } = useTranslation();
  const api = useAPI();

  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskFile={riskSummary} />

      <Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {t("riskFile.definition.title", "Definition")}
        </Typography>
        <DefinitionSection riskSummary={riskSummary} />
      </Box>

      <Box id="scenarios" sx={{ mt: 8 }}>
        <ScenarioSection riskSummary={riskSummary} />
      </Box>

      {riskSummary.cr4de_historical_events && (
        <Box id="historical-events" sx={{ mt: 8 }}>
          <Typography variant="h5">
            {t("riskFile.historicalEvents.title", "Historical Events")}
          </Typography>
          <HistoricalEvents riskSummary={riskSummary} />
        </Box>
      )}

      <Box id="sources">
        <RiskFileBibliography risk={riskSummary} />
      </Box>

      <BNRASpeedDial
        offset={{ x: 0, y: 56 }}
        exportAction={handleExportRiskfile(riskSummary, api, environment)}
        HelpComponent={StandardIdentificationTutorial}
      />
    </Box>
  );
}
