import { Box, Typography } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { getCascadeParameter, getScenarioParameter, SCENARIOS } from "../../../functions/scenarios";
import { getDirectImpact, getIndirectImpact } from "../../../functions/Impact";
import ScenarioMatrix from "../../../components/charts/ScenarioMatrix";
import Scenario from "./Scenario";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { useEffect, useMemo } from "react";
import ProbabilitySection from "./ProbabilitySection";
import ImpactSection from "./ImpactSection";
import { useOutletContext } from "react-router-dom";
import CBSection from "./CBSection";
import { Cause } from "../../../functions/Probability";
import Bibliography from "../Bibliography";
import SankeyDiagram from "./SankeyDiagram";
import { RiskFilePageContext } from "../../BaseRiskFilePage";
import DisclaimerSection from "../DisclaimerSection";
import { useTranslation } from "react-i18next";
import { Cascades } from "../../BaseRisksPage";
import RiskFileTitle from "../../../components/RiskFileTitle";

const getScenarioSuffix = (scenario: SCENARIOS) => {
  if (scenario === SCENARIOS.CONSIDERABLE) return "_c";
  else if (scenario === SCENARIOS.MAJOR) return "_m";
  return "_e";
};

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

  const rf = riskFile;

  const MRS = riskFile.cr4de_mrs || SCENARIOS.EXTREME;
  const MRSSuffix = getScenarioSuffix(MRS);

  const cDict = useMemo(
    () =>
      cascades.all.reduce(
        (acc, c) => ({
          ...acc,
          [c.cr4de_bnrariskcascadeid]: c,
        }),
        {} as { [key: string]: DVRiskCascade }
      ),
    [cascades]
  );

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

  const effects = [getDirectImpact(riskFile, MRS), ...cascades.effects.map((c) => getIndirectImpact(c, riskFile, MRS))];

  return (
    <Box sx={{ mb: 10 }}>
      <RiskFileTitle riskFile={riskFile} />

      <Box sx={{ mt: 8 }}>
        <Typography variant="h5">{t("risks.ananylis.quantiResults", "Quantitative Analysis Results")}</Typography>

        <SankeyDiagram riskFile={riskFile} cascades={cascades} debug={mode === "edit"} scenario={MRS} />
      </Box>

      {rf.cr4de_intensity_parameters && (
        <Box sx={{ mt: 8 }}>
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

      <Box sx={{ mt: 8, clear: "both" }}>
        <Typography variant="h5">{t("Probability Assessment")}</Typography>
        <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
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

      <Box sx={{ mt: 8 }}>
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

        <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
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
    </Box>
  );
}
