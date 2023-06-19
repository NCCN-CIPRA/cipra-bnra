import { Fade, Box, CircularProgress, Button, Link, Container, Stack, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { SCENARIOS, Scenarios } from "../../../functions/scenarios";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import Introduction from "./Introduction";
import { useEffect, useState, MutableRefObject } from "react";
import { stepNames, STEPS } from "./Steps";
import AttackAnalysis from "./AttackAnalysis";
import { Link as RouterLink, useOutletContext, useSearchParams } from "react-router-dom";
import { DVContact } from "../../../types/dataverse/DVContact";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { useUnmountEffect } from "framer-motion";
import { CascadeAnalysisInput } from "../../../functions/cascades";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import useRecords from "../../../hooks/useRecords";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import useLazyRecords from "../../../hooks/useLazyRecords";
import AttachmentsDialog from "../information/AttachmentsDialog";
import ClimateChangeAnalysis, { CCInput } from "../standard/ClimateChangeAnalysis";
import CatalysingEffectsAnalysis from "../standard/CatalysingEffectsAnalysis";
import CascadeTutorial from "../information/CascadeTutorial";
import CCTutorial from "../information/CCTutorial";
import CatalysingTutorial from "../information/CatalysingTutorial";
import { AuthPageContext } from "../../AuthPage";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import QuickNavSidebar, { OPEN_STATE } from "../information/QuickNavSidebar";
import { CrossFade } from "../../../components/CrossFade";
import {
  getCCFieldsWithErrors,
  getCatalysingFieldsWithErrors,
  getCauseFieldsWithErrors,
} from "../information/validateInput";
import BottomBar from "./BottomBar";

export default function ManMade({
  directAnalysis,
  isFetchingDirectAnalysis,
  reloadDirectAnalysis,
  onFinish,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  isFetchingDirectAnalysis: boolean;
  reloadDirectAnalysis: () => Promise<void>;
  onFinish: () => Promise<void>;
}) {
  const api = useAPI();
  const { t } = useTranslation();
  const { user } = useOutletContext<AuthPageContext>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState<STEPS | null>(null);

  const [climateChange, setClimateChange] = useState<DVRiskCascade<DVRiskFile, DVRiskFile> | null | undefined>(null);
  const [catalysingEffects, setCatalysingEffects] = useState<DVRiskCascade<DVRiskFile, DVRiskFile>[] | null>(null);
  const [cascadeIndex, setCascadeIndex] = useState<number | null>(null);
  const [cascadeAnalysis, setCascadeAnalysis] = useState<DVCascadeAnalysis | null>(null);

  const [quantiErrors, setQuantiErrors] = useState<boolean[] | null>(null);
  const [qualiError, setQualiError] = useState(false);
  const [quickNavOpen, setQuickNavOpen] = useState(OPEN_STATE.CLOSED);

  const { data: attacks, reloadData: reloadAttacks } = useRecords<DVRiskCascade<DVRiskFile, DVRiskFile>>({
    table: DataTable.RISK_CASCADE,
    query: `$filter=_cr4de_cause_hazard_value eq ${directAnalysis._cr4de_risk_file_value}&$expand=cr4de_effect_hazard`,
    transformResult: (result: DVRiskCascade<DVRiskFile, DVRiskFile>[]) => {
      return result.sort((a, b) => {
        if (a.cr4de_effect_hazard.cr4de_subjective_importance !== b.cr4de_effect_hazard.cr4de_subjective_importance) {
          return a.cr4de_effect_hazard.cr4de_subjective_importance - b.cr4de_effect_hazard.cr4de_subjective_importance;
        }
        return a.cr4de_effect_hazard.cr4de_hazard_id.localeCompare(b.cr4de_effect_hazard.cr4de_hazard_id);
      });
    },
  });

  useRecords<DVRiskCascade<DVRiskFile, DVRiskFile>>({
    table: DataTable.RISK_CASCADE,
    query: `$filter=_cr4de_effect_hazard_value eq ${directAnalysis._cr4de_risk_file_value}&$expand=cr4de_cause_hazard`,
    transformResult: (result: DVRiskCascade<DVRiskFile, DVRiskFile>[]) => {
      return result.sort((a, b) => {
        if (a.cr4de_cause_hazard.cr4de_subjective_importance !== b.cr4de_cause_hazard.cr4de_subjective_importance) {
          return a.cr4de_cause_hazard.cr4de_subjective_importance - b.cr4de_cause_hazard.cr4de_subjective_importance;
        }
        return a.cr4de_cause_hazard.cr4de_hazard_id.localeCompare(b.cr4de_cause_hazard.cr4de_hazard_id);
      });
    },
    onComplete: async (result: DVRiskCascade<DVRiskFile, DVRiskFile>[]) => {
      const iCatalysingEffects = result.filter(
        (c) =>
          c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk" &&
          c.cr4de_cause_hazard.cr4de_title.indexOf("Climate change") < 0
      );
      const iClimateChange = result.find((c) => c.cr4de_cause_hazard.cr4de_title.indexOf("Climate change") >= 0);

      setCatalysingEffects(iCatalysingEffects);
      setClimateChange(iClimateChange);
    },
  });

  const isLoading =
    activeStep === null ||
    attacks === null ||
    climateChange === null ||
    catalysingEffects === null ||
    cascadeIndex === null;
  let cascade: DVRiskCascade<DVRiskFile, DVRiskFile> | null | undefined = null;
  if (!isLoading) {
    if (activeStep === STEPS.ATTACKS) cascade = attacks[cascadeIndex];
    else if (activeStep === STEPS.CLIMATE_CHANGE) cascade = climateChange;
    else if (activeStep === STEPS.CATALYSING_EFFECTS) cascade = catalysingEffects[cascadeIndex];
  }

  const {
    data: step2B,
    getData: loadCascadeAnalyses,
    isFetching: fetchingCascadeAnalysis,
  } = useLazyRecords<DVCascadeAnalysis>({
    table: DataTable.CASCADE_ANALYSIS,
  });

  const onCompleteCascadeAnalysis = async (result: DVCascadeAnalysis<unknown>[]) => {
    if (!cascade) return;

    const resultCascadeAnalysis =
      result?.find((r) => cascade && r._cr4de_cascade_value === cascade.cr4de_bnrariskcascadeid) ?? null;

    if (!resultCascadeAnalysis) {
      await api.createCascadeAnalysis({
        "cr4de_expert@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
        "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${directAnalysis._cr4de_risk_file_value})`,
        "cr4de_cascade@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${cascade.cr4de_bnrariskcascadeid})`,
      });
      await loadCascadeAnalyses({
        query: `$orderby=createdon&$filter=_cr4de_expert_value eq ${user?.contactid} and _cr4de_risk_file_value eq ${directAnalysis._cr4de_risk_file_value}`,
        onComplete: onCompleteCascadeAnalysis,
        saveOptions: true,
      });
    } else {
      setCascadeAnalysis(resultCascadeAnalysis);
    }
  };

  useEffect(() => {
    if (!cascade) return;

    if (cascade && (!cascadeAnalysis || cascade.cr4de_bnrariskcascadeid !== cascadeAnalysis._cr4de_cascade_value))
      loadCascadeAnalyses({
        query: `$orderby=createdon&$filter=_cr4de_expert_value eq ${user?.contactid} and _cr4de_risk_file_value eq ${directAnalysis._cr4de_risk_file_value}`,
        onComplete: onCompleteCascadeAnalysis,
        saveOptions: true,
      });
  }, [cascade]);

  useEffect(() => {
    const newStep: STEPS = parseInt(searchParams.get("step") || STEPS.INTRODUCTION.toString(), 10) as STEPS;
    const newIndex = parseInt(searchParams.get("index") || "0", 10);

    if (newStep !== activeStep) {
      setActiveStep(newStep);
      setCascadeIndex(newIndex);

      setTimeout(
        () =>
          window.scrollTo({
            behavior: "smooth",
            top: 0,
          }),
        1000
      );
    } else if (newIndex !== cascadeIndex) {
      window.scrollTo({
        behavior: "smooth",
        top: window.scrollY + (document.getElementById("cascade-title")?.getBoundingClientRect().top || 0),
      });

      setTimeout(() => setCascadeIndex(newIndex), 500);
    }
  }, [searchParams]);

  const handleChangeStep = (newStep: STEPS, newIndex: number = 0) => {
    setSearchParams({
      step: newStep.toString(),
      index: newIndex.toString(),
    });
  };

  const hasNextStep = () => {
    if (isLoading) return false;

    const hasAttacks = Boolean(attacks && attacks.length > 0);
    const hasClimateChange = Boolean(climateChange);
    const hasCatalysing = Boolean(catalysingEffects && catalysingEffects.length > 0);

    if (activeStep === STEPS.INTRODUCTION) {
      return hasAttacks || hasClimateChange || hasCatalysing;
    } else if (activeStep === STEPS.ATTACKS) {
      return Boolean((attacks && cascadeIndex < attacks.length - 1) || hasClimateChange || hasCatalysing);
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      return hasCatalysing;
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      return Boolean(catalysingEffects && cascadeIndex < catalysingEffects.length - 1);
    }
    return false;
  };

  const handleNextStep = () => {
    if (isLoading) return false;

    const hasCauses = Boolean(attacks && attacks.length > 0);
    const hasClimateChange = Boolean(climateChange);
    const hasCatalysing = Boolean(catalysingEffects && catalysingEffects.length > 0);

    if (hasMissingValues()) return;

    if (activeStep === STEPS.INTRODUCTION) {
      if (hasCauses) handleChangeStep(STEPS.ATTACKS);
      else if (hasClimateChange) handleChangeStep(STEPS.CLIMATE_CHANGE);
      else if (hasCatalysing) handleChangeStep(STEPS.CATALYSING_EFFECTS);
    } else if (activeStep === STEPS.ATTACKS) {
      if (cascadeIndex < attacks.length - 1) {
        handleChangeStep(STEPS.ATTACKS, cascadeIndex + 1);
      } else {
        if (hasClimateChange) handleChangeStep(STEPS.CLIMATE_CHANGE);
        else if (hasCatalysing) handleChangeStep(STEPS.CATALYSING_EFFECTS);
      }
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      if (hasCatalysing) handleChangeStep(STEPS.CATALYSING_EFFECTS);
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      if (cascadeIndex < catalysingEffects.length - 1) {
        handleChangeStep(STEPS.CATALYSING_EFFECTS, cascadeIndex + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (isLoading) return false;

    const hasCauses = Boolean(attacks && attacks.length > 0);
    const hasClimateChange = Boolean(climateChange);
    const hasCatalysing = Boolean(catalysingEffects && catalysingEffects.length > 0);

    if (activeStep === STEPS.ATTACKS) {
      if (cascadeIndex > 0) handleChangeStep(STEPS.ATTACKS, cascadeIndex - 1);
      else handleChangeStep(STEPS.INTRODUCTION);
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      if (hasCauses) handleChangeStep(STEPS.ATTACKS, attacks.length - 1);
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      if (cascadeIndex > 0) handleChangeStep(STEPS.CATALYSING_EFFECTS, cascadeIndex - 1);
      else if (hasClimateChange) handleChangeStep(STEPS.CLIMATE_CHANGE);
      else if (hasCauses) handleChangeStep(STEPS.ATTACKS, attacks.length - 1);
      else handleChangeStep(STEPS.INTRODUCTION);
    }
  };

  const hasMissingValues = () => {
    setQuantiErrors(null);
    setQualiError(false);

    if (activeStep === STEPS.ATTACKS) {
      if (!cascadeAnalysis) return true;

      const errors = getCauseFieldsWithErrors(cascadeAnalysis);

      if (Object.keys(errors).length <= 0) return false;
      else if (Object.keys(errors).length > 1 || errors.cr4de_quali_cascade === undefined) {
        setTimeout(() => setQuantiErrors([true]), 500);
        return true;
      } else {
        setTimeout(() => setQualiError(true), 500);
        return true;
      }
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      if (!directAnalysis) return true;

      const errors = getCCFieldsWithErrors(directAnalysis);

      if (Object.keys(errors).length <= 0) return false;
      else if (Object.keys(errors).length > 1 || errors.cr4de_dp50_quali === undefined) {
        setTimeout(
          () =>
            setQuantiErrors([
              errors.cr4de_dp50_quanti_c === null,
              errors.cr4de_dp50_quanti_m === null,
              errors.cr4de_dp50_quanti_e === null,
            ]),
          500
        );
        return true;
      } else {
        setTimeout(() => setQualiError(true), 500);
        return true;
      }
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      if (!cascadeAnalysis) return true;

      const errors = getCatalysingFieldsWithErrors(cascadeAnalysis);

      if (Object.keys(errors).length <= 0) return false;
      else if (errors.cr4de_quali_cascade === null) {
        setTimeout(() => setQualiError(true), 500);
        return true;
      }
    }
  };

  const handleFinish = () => {
    if (!hasNextStep() && hasMissingValues()) return;

    onFinish();
  };

  return (
    <>
      <Box sx={{ mt: 6 }}>
        <CrossFade
          components={[
            {
              in: isLoading,
              component: (
                <Box sx={{ mt: 32, textAlign: "center" }}>
                  <CircularProgress />
                </Box>
              ),
            },
            {
              in: !isLoading && activeStep === STEPS.INTRODUCTION,
              component: <Introduction />,
            },
            {
              in: !isLoading && activeStep === STEPS.ATTACKS,
              component: !isLoading && cascadeIndex !== null && (
                <AttackAnalysis
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={cascadeAnalysis}
                  cascade={attacks[cascadeIndex]}
                  index={cascadeIndex}
                  count={attacks.length}
                  quantiErrors={quantiErrors}
                  qualiError={qualiError}
                  reloadCascadeAnalysis={loadCascadeAnalyses}
                />
              ),
            },
            {
              in: !isLoading && activeStep === STEPS.CLIMATE_CHANGE,
              component: climateChange && (
                <ClimateChangeAnalysis
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={cascadeAnalysis}
                  cascade={climateChange}
                  quantiErrors={quantiErrors}
                  qualiError={qualiError}
                  onShowCauses={() => setQuickNavOpen(OPEN_STATE.CAUSES)}
                  reloadDirectAnalysis={reloadDirectAnalysis}
                  reloadCascadeAnalysis={loadCascadeAnalyses}
                />
              ),
            },
            {
              in: !isLoading && activeStep === STEPS.CATALYSING_EFFECTS,
              component: !isLoading && cascadeIndex !== null && (
                <CatalysingEffectsAnalysis
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={cascadeAnalysis}
                  cascade={catalysingEffects[cascadeIndex]}
                  index={cascadeIndex}
                  count={catalysingEffects.length}
                  qualiError={qualiError}
                  reloadCascadeAnalysis={loadCascadeAnalyses}
                />
              ),
            },
          ]}
        />
      </Box>

      {directAnalysis && attacks !== null && catalysingEffects !== null && (
        <QuickNavSidebar
          step2A={directAnalysis}
          step2B={step2B || []}
          causes={attacks}
          climateChange={climateChange}
          catalysingEffects={catalysingEffects}
          hasCauses={activeStep === STEPS.CLIMATE_CHANGE}
          open={quickNavOpen}
          setOpen={setQuickNavOpen}
          onTransitionTo={handleChangeStep}
        />
      )}

      <Fade in={!isLoading}>
        <Box>
          {!isLoading && (
            <BottomBar
              activeStep={activeStep}
              attacks={attacks.length}
              climateChange={climateChange !== undefined}
              catalysingEffects={catalysingEffects.length}
              cascadeIndex={cascadeIndex + 1}
              hasNextStep={hasNextStep()}
              nextStepDisabled={isFetchingDirectAnalysis || fetchingCascadeAnalysis}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onGoToStep={handleChangeStep}
              onFinish={handleFinish}
            />
          )}
        </Box>
      </Fade>
    </>
  );
}
