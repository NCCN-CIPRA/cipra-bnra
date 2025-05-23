import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import DefinitionSection from "../DefinitionSection";
import RiskFileTitle from "../../../components/RiskFileTitle";
import RiskFileBibliography from "../../../components/RiskFileBibliography";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";
import ScenarioSection from "../ScenarioSection";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import ManmadeIdentificationTutorial from "./ManmadeIdentificationTutorial";
import handleExportRiskfile from "../../../functions/export/exportBNRA";
import useAPI from "../../../hooks/useAPI";

export default function Manmade({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  const { t } = useTranslation();
  const api = useAPI();

  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskFile={riskSummary} />

      <Box>
        <Typography variant="h5">
          {t("riskFile.definition.title", "Definition")}
        </Typography>{" "}
        <Box
          id="definition"
          sx={{
            borderLeft: "solid 8px #eee",
            px: 2,
            py: 1,
            mt: 2,
            backgroundColor: "white",
          }}
        >
          <DefinitionSection riskSummary={riskSummary} />
        </Box>
      </Box>

      <Box id="intelligence" sx={{ mt: 8, clear: "both" }}>
        <ScenarioSection riskSummary={riskSummary} />
      </Box>

      <Box id="sources">
        <RiskFileBibliography risk={riskSummary} />
      </Box>

      <BNRASpeedDial
        offset={{ x: 0, y: 56 }}
        exportAction={handleExportRiskfile(riskSummary, api)}
        HelpComponent={ManmadeIdentificationTutorial}
      />
    </Box>
  );
}
