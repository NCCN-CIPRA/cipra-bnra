import { Box, Typography } from "@mui/material";
import CatalyzingSection from "./CatalyzingSection";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../../components/RiskFileTitle";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import EmergingAnalysisTutorial from "./EmergingAnalysisTutorial";
import handleExportRiskfile from "../../../functions/export/exportBNRA";
import useAPI from "../../../hooks/useAPI";
import RiskFileBibliography from "../../../components/RiskFileBibliography";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";
import { DVCascadeSnapshot } from "../../../types/dataverse/DVCascadeSnapshot";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../../BasePage";

export default function Emerging({
  riskSummary,
  cascades,
}: {
  riskSummary: DVRiskSummary;
  cascades: DVCascadeSnapshot<unknown, DVRiskSnapshot, DVRiskSnapshot>[];
}) {
  const { environment } = useOutletContext<BasePageContext>();

  const { t } = useTranslation();
  const api = useAPI();

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskSummary} />

        <Box className="catalyzing" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Catalysing Effects")}</Typography>

          <CatalyzingSection cascades={cascades} />
        </Box>

        <RiskFileBibliography risk={riskSummary} />
        <BNRASpeedDial
          offset={{ x: 0, y: 56 }}
          exportAction={handleExportRiskfile(riskSummary, api, environment)}
          HelpComponent={EmergingAnalysisTutorial}
        />
      </Box>
    </>
  );
}
