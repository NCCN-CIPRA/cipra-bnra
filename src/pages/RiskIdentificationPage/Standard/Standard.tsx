import { Box, IconButton, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { Cascades } from "../../BaseRisksPage";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../../BaseRiskFilePage";
import DefinitionSection from "../DefinitionSection";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Section } from "../HelpSiderBar";
import HistoricalEvents from "../HistoricalEvents";
import { SCENARIOS } from "../../../functions/scenarios";
import { useEffect } from "react";
import ScenarioSection from "./ScenarioSection";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import Scenario from "../../RiskAnalysisPage/Standard/Scenario";
import Bibliography from "../../RiskAnalysisPage/Bibliography";
import RiskFileTitle from "../../../components/RiskFileTitle";

const ibsx = {
  transition: "opacity .3s ease",
  ml: 1,
};

export default function Standard({
  riskFile,
  cascades,
  mode = "view",
  isEditing,
  setIsEditing,
  reloadRiskFile,
}: {
  riskFile: DVRiskFile;
  cascades: Cascades;
  mode?: "view" | "edit";
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const { helpOpen, setHelpFocus, hazardCatalogue, attachments, loadAttachments } =
    useOutletContext<RiskFilePageContext>();

  useEffect(() => {
    if (!attachments) loadAttachments();
  }, []);

  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskFile={riskFile} />

      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">
          {t("riskFile.definition.title", "Definition")}
          {helpOpen && (
            <IconButton size="small" sx={ibsx} onClick={() => setHelpFocus(Section.PROB_BREAKDOWN)}>
              <HelpOutlineIcon fontSize="inherit" />
            </IconButton>
          )}
        </Typography>{" "}
        <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
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
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5">
            {t("riskFile.historicalEvents.title", "Historical Events")}
            {helpOpen && (
              <IconButton size="small" sx={ibsx} onClick={() => setHelpFocus(Section.IMPACT_BREAKDOWN)}>
                <HelpOutlineIcon fontSize="inherit" />
              </IconButton>
            )}
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

      <Box sx={{ mt: 8 }}>
        <ScenarioSection riskFile={riskFile} helpOpen={helpOpen} setHelpFocus={setHelpFocus} />
      </Box>

      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">Most Relevant Scenario</Typography>

        <ScenarioMatrix riskFile={riskFile} mrs={riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE} />

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

      <Bibliography
        riskFile={riskFile}
        cascades={cascades.all}
        attachments={attachments}
        reloadAttachments={loadAttachments}
      />
    </Box>
  );
}
