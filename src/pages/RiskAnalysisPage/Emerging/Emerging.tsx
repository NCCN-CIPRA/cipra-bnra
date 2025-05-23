import { Box, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import CatalyzingSection from "./CatalyzingSection";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../../components/RiskFileTitle";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import EmergingAnalysisTutorial from "./EmergingAnalysisTutorial";
import handleExportRiskfile from "../../../functions/export/exportBNRA";
import useAPI from "../../../hooks/useAPI";
import RiskFileBibliography from "../../../components/RiskFileBibliography";

export default function Emerging({
  riskFile,
  cascades,
}: {
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
}) {
  const { t } = useTranslation();
  const api = useAPI();

  return (
    <>
      <Box sx={{ mb: 10 }}>
        <RiskFileTitle riskFile={riskFile} />

        <Box className="catalyzing" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Catalysing Effects")}</Typography>

          <CatalyzingSection cascades={cascades} />
        </Box>

        <RiskFileBibliography risk={riskFile} />
        <BNRASpeedDial
          offset={{ x: 0, y: 56 }}
          exportAction={handleExportRiskfile(riskFile, api)}
          HelpComponent={EmergingAnalysisTutorial}
        />
      </Box>
    </>
  );
}
