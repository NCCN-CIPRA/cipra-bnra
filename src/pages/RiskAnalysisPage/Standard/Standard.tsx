import { Alert, Box, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import {
  getCascadeParameter,
  getScenarioParameter,
  SCENARIOS,
} from "../../../functions/scenarios";
import { getDirectImpact, getIndirectImpact } from "../../../functions/Impact";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import Scenario from "./Scenario";
import { useState } from "react";
import ProbabilitySection from "./ProbabilitySection";
import ImpactSection from "./ImpactSection";
import CBSection from "./CBSection";
import { Cause } from "../../../functions/Probability";
import Bibliography from "../Bibliography";
import SankeyDiagram from "./SankeyDiagram";
import DisclaimerSection from "../DisclaimerSection";
import { useTranslation } from "react-i18next";
import RiskFileTitle from "../../../components/RiskFileTitle";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import BNRASpeedDial from "../../../components/BNRASpeedDial";
import StandardAnalysisTutorial from "./StandardAnalysisTutorial";
import { Cascades } from "../../../functions/cascades";
import handleExportRiskfile from "../../../functions/export/exportBNRA";
import useAPI from "../../../hooks/useAPI";

const getScenarioSuffix = (scenario: SCENARIOS) => {
  if (scenario === SCENARIOS.CONSIDERABLE) return "_c";
  else if (scenario === SCENARIOS.MAJOR) return "_m";
  return "_e";
};

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
  const api = useAPI();

  const MRS = riskFile.cr4de_mrs || SCENARIOS.EXTREME;
  const [scenario, setScenario] = useState(MRS);

  const rf = riskFile;
  const MRSSuffix = getScenarioSuffix(MRS);

  const causes: Cause[] = [
    {
      id: null,
      name: "No underlying cause",
      p: getScenarioParameter(riskFile, "DP", MRS) || 0,
      quali: rf[`cr4de_dp_quali${MRSSuffix}`],
    },
    ...(cascades.causes
      .filter((c) => getCascadeParameter(c, MRS, "IP"))
      .map((c) => {
        return {
          id: c.cr4de_cause_hazard.cr4de_riskfilesid,
          name: c.cr4de_cause_hazard.cr4de_title,
          p: getCascadeParameter(c, MRS, "IP") || 0,
          quali: c.cr4de_quali,
        };
      }) || []),
  ].sort((a, b) => b.p - a.p);

  const effects = [
    getDirectImpact(riskFile, MRS),
    ...cascades.effects.map((c) => getIndirectImpact(c, riskFile, MRS)),
  ];
  // effects.map((e, i) => console.log(e, i === 0 ? riskFile : cascades.effects[i - 1]));
  // console.log(riskFile, cascades.effects);
  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskFile={riskFile} />

      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">
          {t("risks.ananylis.quantiResults", "Quantitative Analysis Results")}
        </Typography>

        <SankeyDiagram
          riskFile={riskFile}
          cascades={cascades}
          debug={mode === "edit"}
          scenario={scenario}
          setScenario={setScenario}
        />
      </Box>

      {scenario !== MRS && (
        <Box>
          <Alert severity="warning">
            {t(
              "risks.analysis.scenarioChange",
              "You have changed the scenario is the sankey diagram above. Please be aware the the qualitative analysis results below only apply to the Most Relevant Scenario."
            )}
          </Alert>
        </Box>
      )}

      {rf.cr4de_intensity_parameters && (
        <Box className="mrs" sx={{ mt: 8 }}>
          <Typography variant="h5">{t("Most Relevant Scenario")}</Typography>

          <ScenarioMatrix riskFile={riskFile} mrs={MRS} />

          {/* <IntensityParametersTable initialParameters={rf.cr4de_intensity_parameters} /> */}

          <Scenario
            riskFile={rf}
            scenario={MRS}
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

      <DisclaimerSection
        riskFile={rf}
        mode={mode}
        attachments={attachments}
        updateAttachments={loadAttachments}
        isEditingOther={isEditing}
        setIsEditing={setIsEditing}
        reloadRiskFile={reloadRiskFile}
        allRisks={hazardCatalogue}
      />

      <Box className="probability-assess" sx={{ mt: 8, clear: "both" }}>
        <Typography variant="h5">{t("Probability Assessment")}</Typography>
        <Box
          sx={{
            borderLeft: "solid 8px #eee",
            px: 2,
            py: 1,
            mt: 2,
            backgroundColor: "white",
          }}
        >
          <ProbabilitySection
            riskFile={rf}
            causes={causes}
            scenario={MRS}
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

      <Box className="impact-assess" sx={{ mt: 8 }}>
        <Typography variant="h5">{t("Impact Assessment")}</Typography>

        <ImpactSection
          riskFile={rf}
          effects={effects}
          scenario={MRS}
          impactName="human"
          mode={mode}
          attachments={attachments}
          updateAttachments={loadAttachments}
          isEditingOther={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={reloadRiskFile}
          allRisks={hazardCatalogue}
        />

        <ImpactSection
          riskFile={rf}
          effects={effects}
          scenario={MRS}
          impactName="societal"
          mode={mode}
          attachments={attachments}
          updateAttachments={loadAttachments}
          isEditingOther={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={reloadRiskFile}
          allRisks={hazardCatalogue}
        />

        <ImpactSection
          riskFile={rf}
          effects={effects}
          scenario={MRS}
          impactName="environmental"
          mode={mode}
          attachments={attachments}
          updateAttachments={loadAttachments}
          isEditingOther={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={reloadRiskFile}
          allRisks={hazardCatalogue}
        />

        <ImpactSection
          riskFile={rf}
          effects={effects}
          scenario={MRS}
          impactName="financial"
          mode={mode}
          attachments={attachments}
          updateAttachments={loadAttachments}
          isEditingOther={isEditing}
          setIsEditing={setIsEditing}
          reloadRiskFile={reloadRiskFile}
          allRisks={hazardCatalogue}
        />

        <Box
          className="cb-impact"
          sx={{
            borderLeft: "solid 8px #eee",
            px: 2,
            py: 1,
            mt: 2,
            backgroundColor: "white",
          }}
        >
          <Typography variant="h6">Cross-border Impact</Typography>
          <CBSection
            riskFile={riskFile}
            scenarioSuffix={MRSSuffix}
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

      <Bibliography
        riskFile={riskFile}
        cascades={cascades.all}
        attachments={attachments}
        reloadAttachments={loadAttachments}
      />

      <BNRASpeedDial
        offset={{ x: 0, y: 56 }}
        exportAction={handleExportRiskfile(riskFile, api)}
        HelpComponent={StandardAnalysisTutorial}
      />
    </Box>
  );
}
