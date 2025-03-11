import { Box, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { Cascades } from "../../BaseRisksPage";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DefinitionSection from "../DefinitionSection";
import HistoricalEvents from "../HistoricalEvents";
import { SCENARIOS } from "../../../functions/scenarios";
import ScenarioSection from "./ScenarioSection";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import Scenario from "../../RiskAnalysisPage/Standard/Scenario";
import Bibliography from "../../RiskAnalysisPage/Bibliography";
import RiskFileTitle from "../../../components/RiskFileTitle";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import StandardIdentificationTutorial from "./StandardIdentificationTutorial";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";

export default function Standard({
  riskFile,
  cascades,
  mode = "view",
  isEditing,
  attachments,
  loadAttachments,
  hazardCatalogue,
  setIsEditing,
  reloadRiskFile,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
  mode?: "view" | "edit";
  isEditing: boolean;
  attachments: DVAttachment<unknown, DVAttachment<unknown, unknown>>[];
  hazardCatalogue: SmallRisk[] | null;
  loadAttachments: () => Promise<unknown>;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskFile={riskFile} />

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
          <DefinitionSection
            riskFile={riskFile}
            mode={mode}
            attachments={attachments}
            updateAttachments={loadAttachments}
            isEditingOther={isEditing}
            setIsEditing={setIsEditing}
            reloadRiskFile={reloadRiskFile}
            allRisks={hazardCatalogue}
          />
        </Box>
      </Box>

      {riskFile.cr4de_historical_events && (
        <Box id="historical-events" sx={{ mt: 8 }}>
          <Typography variant="h5">
            {t("riskFile.historicalEvents.title", "Historical Events")}
          </Typography>
          <HistoricalEvents
            riskFile={riskFile}
            mode={mode}
            attachments={attachments}
            updateAttachments={loadAttachments}
            isEditingOther={isEditing}
            setIsEditing={setIsEditing}
            reloadRiskFile={reloadRiskFile}
            allRisks={hazardCatalogue}
          />
        </Box>
      )}

      <Box id="scenarios" sx={{ mt: 8 }}>
        <ScenarioSection riskFile={riskFile} />
      </Box>

      <Box id="mrs" sx={{ mt: 8 }}>
        <Typography variant="h5">
          <Trans i18nKey="hazardCatalogue.mrs">Most Relevant Scenario</Trans>
        </Typography>

        <ScenarioMatrix
          riskFile={riskFile}
          mrs={riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE}
        />

        <Scenario
          riskFile={riskFile}
          scenario={riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE}
          mode={mode}
          attachments={attachments}
          updateAttachments={loadAttachments}
          isEditingOther={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={reloadRiskFile}
          allRisks={hazardCatalogue}
        />
      </Box>

      <Box id="sources">
        <Bibliography
          riskFile={riskFile}
          cascades={cascades.all}
          attachments={attachments}
          reloadAttachments={loadAttachments}
        />
      </Box>

      <BNRASpeedDial
        offset={{ x: 0, y: 56 }}
        exportAction={() =>
          navigate(`/risks/${riskFile.cr4de_riskfilesid}/export`)
        }
        HelpComponent={StandardIdentificationTutorial}
      />
    </Box>
  );
}
