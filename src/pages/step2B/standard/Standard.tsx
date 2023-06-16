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
import CatalysingEffectsAnalysis from "./CatalysingEffectsnalysis";

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
  const [cascadeIndex1, setCascadeIndex1] = useState<number | null>(null);
  const [cascadeIndex2, setCascadeIndex2] = useState<number | null>(null);
  const [visibleCascade, setVisibleCascade] = useState<number | null>(null);
  const [cascadeAnalysis1, setCascadeAnalysis1] = useState<DVCascadeAnalysis | null>(null);
  const [cascadeAnalysis2, setCascadeAnalysis2] = useState<DVCascadeAnalysis | null>(null);

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

  const isLoading = activeStep === null || causes === null || climateChange === null || catalysingEffects === null;
  const cascadeIndex = visibleCascade === 1 ? cascadeIndex1 || 0 : cascadeIndex2 || 0;
  const setCascadeIndex = (newIndex: number) => {
    if (visibleCascade === 1) {
      setCascadeIndex2(newIndex);
      setCascadeAnalysis2(null);
      setVisibleCascade(2);
    } else {
      setCascadeIndex1(newIndex);
      setCascadeAnalysis1(null);
      setVisibleCascade(1);
    }
  };
  let cascade: DVRiskCascade | undefined;
  if (!isLoading) {
    if (activeStep === STEPS.CAUSES) cascade = causes[cascadeIndex];
    else if (activeStep === STEPS.CLIMATE_CHANGE) cascade = climateChange;
    else if (activeStep == STEPS.CATALYSING_EFFECTS) cascade = catalysingEffects[cascadeIndex];
  }
  const cascadeAnalysis = visibleCascade === 1 ? cascadeAnalysis1 : cascadeAnalysis2;

  const { getData: loadCascadeAnalysis, isFetching: fetchingCascadeAnalysis } = useLazyRecords<DVCascadeAnalysis>({
    table: DataTable.CASCADE_ANALYSIS,
  });

  useEffect(() => {
    if (isLoading) return;

    if (cascade && (!cascadeAnalysis || cascade.cr4de_bnrariskcascadeid !== cascadeAnalysis._cr4de_cascade_value))
      loadCascadeAnalysis({
        query: `$orderby=createdon&$filter=_cr4de_expert_value eq ${user?.contactid} and _cr4de_risk_file_value eq ${directAnalysis._cr4de_risk_file_value} and _cr4de_cascade_value eq ${cascade.cr4de_bnrariskcascadeid}`,
        onComplete: async (result) => {
          if (isLoading || !cascade) return;

          if (result === null || result.length <= 0) {
            await api.createCascadeAnalysis({
              "cr4de_expert@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
              "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${directAnalysis._cr4de_risk_file_value})`,
              "cr4de_cascade@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${cascade.cr4de_bnrariskcascadeid})`,
            });
            await loadCascadeAnalysis();
          } else {
            if (visibleCascade === 1) setCascadeAnalysis1(result[0]);
            else setCascadeAnalysis2(result[0]);
          }
        },
        saveOptions: true,
      });
  }, [causes, climateChange, catalysingEffects, activeStep, visibleCascade]);

  useEffect(() => {
    const newStep: STEPS = parseInt(searchParams.get("step") || STEPS.INTRODUCTION.toString(), 10) as STEPS;
    const newIndex = parseInt(searchParams.get("index") || "0", 10);

    if (newStep !== activeStep) {
      setActiveStep(newStep);
      setCascadeIndex(newIndex);
    } else if (newIndex !== cascadeIndex) {
      setCascadeIndex(newIndex);

      window.scrollTo({
        behavior: "smooth",
        top: window.scrollY + (document.getElementById("cascade-title")?.getBoundingClientRect().top || 0),
      });
    }
  }, [searchParams]);

  useEffect(() => {
    setTimeout(
      () =>
        window.scrollTo({
          behavior: "smooth",
          top: 0,
        }),
      1000
    );
  }, [activeStep]);

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
      return hasClimateChange || hasCatalysing;
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      return hasCatalysing;
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
    }
  };

  const handlePreviousStep = () => {
    if (isLoading) return false;

    const hasCauses = Boolean(causes && causes.length > 0);
    const hasClimateChange = Boolean(climateChange);
    const hasCatalysing = Boolean(catalysingEffects && catalysingEffects.length > 0);

    if (activeStep === STEPS.CAUSES) {
      if (cascadeIndex > 0) {
        handleChangeStep(STEPS.CAUSES, cascadeIndex - 1);
      } else {
        handleChangeStep(STEPS.INTRODUCTION);
      }
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      if (hasCauses) handleChangeStep(STEPS.CAUSES, causes.length - 1);
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      if (hasClimateChange) handleChangeStep(STEPS.CLIMATE_CHANGE);
      else if (hasCauses) handleChangeStep(STEPS.CAUSES, causes.length - 1);
    }
  };

  const hasMissingValues = () => {
    setQuantiErrors(null);
    setQualiError(false);

    if (activeStep === STEPS.CAUSES) {
      if (!cascadeAnalysis) return true;

      const errors = getCauseFieldsWithErrors(cascadeAnalysis);

      if (Object.keys(errors).length <= 0) return false;
      else if (errors.cr4de_quali_cascade === null) {
        setQualiError(true);
        return true;
      } else {
        setQuantiErrors([true]);
        return true;
      }
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      if (!directAnalysis) return true;

      const errors = getCCFieldsWithErrors(directAnalysis);

      if (Object.keys(errors).length <= 0) return false;
      else if (errors.cr4de_dp50_quali === null) {
        setQualiError(true);
        return true;
      } else {
        setQuantiErrors([
          errors.cr4de_dp50_quanti_c === null,
          errors.cr4de_dp50_quanti_m === null,
          errors.cr4de_dp50_quanti_e === null,
        ]);
        return true;
      }
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      if (!cascadeAnalysis) return true;

      const errors = getCatalysingFieldsWithErrors(cascadeAnalysis);

      if (Object.keys(errors).length <= 0) return false;
      else if (errors.cr4de_quali_cascade === null) {
        setQualiError(true);
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
              in: activeStep === STEPS.INTRODUCTION,
              component: <Introduction />,
            },
            {
              in: activeStep === STEPS.CAUSES && visibleCascade === 1,
              component: !isLoading && cascadeIndex1 !== null && (
                <CascadeAnalysis
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={cascadeAnalysis1}
                  cascade={causes[cascadeIndex1]}
                  cause={causes[cascadeIndex1].cr4de_cause_hazard}
                  effect={directAnalysis.cr4de_risk_file}
                  index={cascadeIndex1}
                  count={causes.length}
                  quantiErrors={quantiErrors}
                  qualiError={qualiError}
                  reloadCascadeAnalysis={loadCascadeAnalysis}
                />
              ),
            },
            {
              in: activeStep === STEPS.CAUSES && visibleCascade === 2,
              component: !isLoading && cascadeIndex2 !== null && (
                <CascadeAnalysis
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={cascadeAnalysis2}
                  cascade={causes[cascadeIndex2]}
                  cause={causes[cascadeIndex2].cr4de_cause_hazard}
                  effect={directAnalysis.cr4de_risk_file}
                  index={cascadeIndex2}
                  count={causes.length}
                  quantiErrors={quantiErrors}
                  qualiError={qualiError}
                  reloadCascadeAnalysis={loadCascadeAnalysis}
                />
              ),
            },
            {
              in: activeStep === STEPS.CLIMATE_CHANGE,
              component: climateChange && (
                <ClimateChangeAnalysis
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={cascadeAnalysis}
                  cascade={climateChange}
                  quantiErrors={quantiErrors}
                  qualiError={qualiError}
                  onShowCauses={() => setQuickNavOpen(OPEN_STATE.CAUSES)}
                  reloadDirectAnalysis={reloadDirectAnalysis}
                  reloadCascadeAnalysis={loadCascadeAnalysis}
                />
              ),
            },
            {
              in: activeStep === STEPS.CATALYSING_EFFECTS && visibleCascade === 1,
              component: !isLoading && cascadeIndex1 !== null && (
                <CatalysingEffectsAnalysis
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={cascadeAnalysis1}
                  cause={causes[cascadeIndex1].cr4de_cause_hazard}
                  effect={directAnalysis.cr4de_risk_file}
                  index={cascadeIndex1}
                  count={causes.length}
                  qualiError={qualiError}
                  reloadCascadeAnalysis={loadCascadeAnalysis}
                />
              ),
            },
            {
              in: activeStep === STEPS.CATALYSING_EFFECTS && visibleCascade === 2,
              component: !isLoading && cascadeIndex2 !== null && (
                <CatalysingEffectsAnalysis
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={cascadeAnalysis2}
                  cause={causes[cascadeIndex2].cr4de_cause_hazard}
                  effect={directAnalysis.cr4de_risk_file}
                  index={cascadeIndex2}
                  count={causes.length}
                  qualiError={qualiError}
                  reloadCascadeAnalysis={loadCascadeAnalysis}
                />
              ),
            },
          ]}
        />
      </Box>

      {directAnalysis && causes !== null && catalysingEffects !== null && (
        <QuickNavSidebar
          step2A={directAnalysis}
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
