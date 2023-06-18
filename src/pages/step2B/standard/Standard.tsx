import { useState, useEffect } from "react";

import { STEPS } from "./Steps";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { Box, CircularProgress, Fade } from "@mui/material";
import { CrossFade } from "../../../components/CrossFade";
import Introduction from "./Introduction";
import BottomBar from "./BottomBar";
import useLazyRecords from "../../../hooks/useLazyRecords";
import useRecords from "../../../hooks/useRecords";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { useOutletContext, useSearchParams } from "react-router-dom";
import CascadeAnalysis from "./CascadeAnalysis";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { AuthPageContext } from "../../AuthPage";
import {
  getCCFieldsWithErrors,
  getCatalysingFieldsWithErrors,
  getCauseFieldsWithErrors,
} from "../information/validateInput";
import { useTranslation } from "react-i18next";
import ClimateChangeAnalysis from "./ClimateChangeAnalysis";
import QuickNavSidebar, { OPEN_STATE } from "../information/QuickNavSidebar";
import CatalysingEffectsAnalysis from "./CatalysingEffectsAnalysis";

export default function Standard({
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

  const [causes, setCauses] = useState<DVRiskCascade<DVRiskFile, SmallRisk>[] | null>(null);
  const [climateChange, setClimateChange] = useState<DVRiskCascade<DVRiskFile, SmallRisk> | null | undefined>(null);
  const [catalysingEffects, setCatalysingEffects] = useState<DVRiskCascade<DVRiskFile, SmallRisk>[] | null>(null);
  const [cascadeIndex, setCascadeIndex] = useState<number | null>(null);
  const [cascadeAnalysis, setCascadeAnalysis] = useState<DVCascadeAnalysis | null>(null);

  const [quantiErrors, setQuantiErrors] = useState<boolean[] | null>(null);
  const [qualiError, setQualiError] = useState(false);
  const [quickNavOpen, setQuickNavOpen] = useState(OPEN_STATE.CLOSED);

  useRecords<DVRiskCascade<DVRiskFile, SmallRisk>>({
    table: DataTable.RISK_CASCADE,
    query: `$filter=_cr4de_effect_hazard_value eq ${directAnalysis._cr4de_risk_file_value}&$expand=cr4de_cause_hazard,cr4de_effect_hazard($select=cr4de_hazard_id,cr4de_title,cr4de_risk_type)`,
    transformResult: (result: DVRiskCascade<DVRiskFile, SmallRisk>[]) => {
      return result.sort((a, b) => {
        if (a.cr4de_cause_hazard.cr4de_subjective_importance !== b.cr4de_cause_hazard.cr4de_subjective_importance) {
          return a.cr4de_cause_hazard.cr4de_subjective_importance - b.cr4de_cause_hazard.cr4de_subjective_importance;
        }
        return a.cr4de_cause_hazard.cr4de_hazard_id.localeCompare(b.cr4de_cause_hazard.cr4de_hazard_id);
      });
    },
    onComplete: async (result: DVRiskCascade<DVRiskFile, SmallRisk>[]) => {
      const iCauses = result.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type !== "Emerging Risk");
      const iCatalysingEffects = result.filter(
        (c) =>
          c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk" &&
          c.cr4de_cause_hazard.cr4de_title.indexOf("Climate Change") < 0
      );
      const iClimateChange = result.find((c) => c.cr4de_cause_hazard.cr4de_title.indexOf("Climate Change") >= 0);

      setCauses(iCauses);
      setCatalysingEffects(iCatalysingEffects);
      setClimateChange(iClimateChange);
    },
  });

  const isLoading =
    activeStep === null ||
    causes === null ||
    climateChange === null ||
    catalysingEffects === null ||
    cascadeIndex === null;
  let cascade: DVRiskCascade<DVRiskFile, SmallRisk> | null | undefined = null;
  if (!isLoading) {
    if (activeStep === STEPS.CAUSES) cascade = causes[cascadeIndex];
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

    const hasCauses = Boolean(causes && causes.length > 0);
    const hasClimateChange = Boolean(climateChange);
    const hasCatalysing = Boolean(catalysingEffects && catalysingEffects.length > 0);

    if (activeStep === STEPS.INTRODUCTION) {
      return hasCauses || hasClimateChange || hasCatalysing;
    } else if (activeStep === STEPS.CAUSES) {
      return Boolean((causes && causes.length > 0) || hasClimateChange || hasCatalysing);
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      return hasCatalysing;
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      return Boolean(catalysingEffects && catalysingEffects.length > 0);
    }
    return false;
  };

  const handleNextStep = () => {
    if (isLoading) return false;

    const hasCauses = Boolean(causes && causes.length > 0);
    const hasClimateChange = Boolean(climateChange);
    const hasCatalysing = Boolean(catalysingEffects && catalysingEffects.length > 0);

    if (hasMissingValues()) return;

    if (activeStep === STEPS.INTRODUCTION) {
      if (hasCauses) handleChangeStep(STEPS.CAUSES);
      else if (hasClimateChange) handleChangeStep(STEPS.CLIMATE_CHANGE);
      else if (hasCatalysing) handleChangeStep(STEPS.CATALYSING_EFFECTS);
    } else if (activeStep === STEPS.CAUSES) {
      if (cascadeIndex < causes.length - 1) {
        handleChangeStep(STEPS.CAUSES, cascadeIndex + 1);
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

    const hasCauses = Boolean(causes && causes.length > 0);
    const hasClimateChange = Boolean(climateChange);
    const hasCatalysing = Boolean(catalysingEffects && catalysingEffects.length > 0);

    if (activeStep === STEPS.CAUSES) {
      if (cascadeIndex > 0) handleChangeStep(STEPS.CAUSES, cascadeIndex - 1);
      else handleChangeStep(STEPS.INTRODUCTION);
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      if (hasCauses) handleChangeStep(STEPS.CAUSES, causes.length - 1);
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      if (cascadeIndex > 0) handleChangeStep(STEPS.CATALYSING_EFFECTS, cascadeIndex - 1);
      else if (hasClimateChange) handleChangeStep(STEPS.CLIMATE_CHANGE);
      else if (hasCauses) handleChangeStep(STEPS.CAUSES, causes.length - 1);
      else handleChangeStep(STEPS.INTRODUCTION);
    }
  };

  const hasMissingValues = () => {
    setQuantiErrors(null);
    setQualiError(false);

    if (activeStep === STEPS.CAUSES) {
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
              in: !isLoading && activeStep === STEPS.CAUSES,
              component: !isLoading && cascadeIndex !== null && (
                <CascadeAnalysis
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={cascadeAnalysis}
                  cascade={causes[cascadeIndex]}
                  index={cascadeIndex}
                  count={causes.length}
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

      {directAnalysis && causes !== null && catalysingEffects !== null && (
        <QuickNavSidebar
          step2A={directAnalysis}
          step2B={step2B || []}
          causes={causes}
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
              causes={causes.length}
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
