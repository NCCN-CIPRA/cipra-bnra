import { useState, useEffect, useRef, useReducer } from "react";
import {
  Box,
  Button,
  Fade,
  Container,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import usePageTitle from "../../hooks/usePageTitle";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useRecord from "../../hooks/useRecord";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import Standard from "./standard/Standard";
import { STEPS } from "./Steps";
import useLazyRecords from "../../hooks/useLazyRecords";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthPageContext } from "../AuthPage";
import { SCENARIOS } from "../../functions/scenarios";
import { CascadeAnalysisInput, getCascadeInput } from "../../functions/cascades";
import SurveyDialog from "../../components/SurveyDialog";
import { FeedbackStep } from "../../types/dataverse/DVFeedback";
import InformationButton from "./information/InformationButton";
import QuickNavSidebar, { OPEN_STATE } from "./information/QuickNavSidebar";
import FinishDialog from "./information/FinishDialog";
import BottomBar from "./information/BottomBar";
import { Step2BErrors, validateStep2B } from "./information/validateInput";

type RouteParams = {
  step2A_id: string;
};

const transitionDelay = 500;

export default function ({}) {
  const { t } = useTranslation();
  const { user } = useOutletContext<AuthPageContext>();
  const routeParams = useParams() as RouteParams;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const api = useAPI();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [activeStep, setActiveStep] = useState<STEPS | null>(null);
  const [cascadeIndex, setCascadeIndex] = useState(parseInt(searchParams.get("index") || "0", 10));
  const [activeCauseScenario, setActiveCauseScenario] = useState(SCENARIOS.CONSIDERABLE);
  const [activeEffectScenario, setActiveEffectScenario] = useState(SCENARIOS.CONSIDERABLE);

  const [causes, setCauses] = useState<DVRiskCascade<DVRiskFile, DVRiskFile>[] | null>(null);
  const [catalysingEffects, setCatalysingEffects] = useState<DVRiskCascade<DVRiskFile, DVRiskFile>[] | null>(null);
  const [climateChange, setClimateChange] = useState<DVRiskCascade<DVRiskFile, DVRiskFile> | null>(null);
  const [cascade, setCascade] = useState<DVRiskCascade<DVRiskFile, DVRiskFile> | null>(null);
  const [cascadeAnalysis, setCascadeAnalysis] = useState<DVCascadeAnalysis | null>(null);

  const step2AInput = useRef<string | null>(null);
  const step2BInput = useRef<CascadeAnalysisInput | null>(null);
  const [inputErrors, setInputErrors] = useState<Step2BErrors | null>(null);
  const [qualiError, setQualiError] = useState(false);

  const [finishedDialogOpen, setFinishedDialogOpen] = useState(false);
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [quickNavOpen, setQuickNavOpen] = useState(OPEN_STATE.CLOSED);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const {
    data: cascades,
    loading: loadingCascades,
    getData: loadCascades,
  } = useLazyRecords<DVRiskCascade<DVRiskFile, DVRiskFile>>({
    table: DataTable.RISK_CASCADE,
    transformResult: (result: DVRiskCascade<DVRiskFile, DVRiskFile>[]) => {
      return result.sort((a, b) => {
        if (a.cr4de_cause_hazard.cr4de_subjective_importance !== b.cr4de_cause_hazard.cr4de_subjective_importance) {
          return a.cr4de_cause_hazard.cr4de_subjective_importance - b.cr4de_cause_hazard.cr4de_subjective_importance;
        }
        return a.cr4de_cause_hazard.cr4de_hazard_id.localeCompare(b.cr4de_cause_hazard.cr4de_hazard_id);
      });
    },
  });

  /**
   * Retrieve the cascade analysis record from the database that corresponds to the participant
   */
  const {
    data: step2B,
    loading: loading2B,
    getData: load2B,
  } = useLazyRecords<DVCascadeAnalysis>({
    table: DataTable.CASCADE_ANALYSIS,
    onComplete: async (results) => {
      if (cascadeIndex && causes && catalysingEffects) {
        let iCascade: DVRiskCascade<DVRiskFile, DVRiskFile> | null = null;
        if (activeStep === STEPS.CAUSES) iCascade = causes && causes[cascadeIndex];
        else if (activeStep === STEPS.CATALYSING_EFFECTS)
          iCascade = catalysingEffects && catalysingEffects[cascadeIndex];

        let iCascadeAnalysis = results.find(
          (s) => iCascade && s._cr4de_cascade_value === iCascade.cr4de_bnrariskcascadeid
        );

        if (iCascadeAnalysis) setCascadeAnalysis(iCascadeAnalysis);
      }
    },
  });

  /**
   * Retrieve the direct analysis record from the database that is defined in the page url when the page loads
   */
  const { data: step2A } = useRecord<DVDirectAnalysis<DVRiskFile>>({
    table: DataTable.DIRECT_ANALYSIS,
    id: routeParams.step2A_id,
    query: "$expand=cr4de_risk_file",
    onComplete: async (step2A) => {
      loadCascades({
        query: `$filter=_cr4de_effect_hazard_value eq ${step2A._cr4de_risk_file_value}&$expand=cr4de_cause_hazard,cr4de_effect_hazard($select=cr4de_title)`,
      });
      load2B({
        query: `$orderby=createdon&$filter=_cr4de_expert_value eq ${user?.contactid} and _cr4de_risk_file_value eq ${step2A._cr4de_risk_file_value}`,
        saveOptions: true,
      });
    },
  });

  const findOrCreateCascadeAnalysis = async function (iCascade: DVRiskCascade<DVRiskFile>) {
    if (step2A && step2B) {
      let iCascadeAnalysis = step2B.find(
        (s) => iCascade && s._cr4de_cascade_value === iCascade.cr4de_bnrariskcascadeid
      );

      if (!iCascadeAnalysis) {
        await api.createCascadeAnalysis({
          "cr4de_expert@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
          "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${step2A._cr4de_risk_file_value})`,
          "cr4de_cascade@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${iCascade.cr4de_bnrariskcascadeid})`,
        });

        await load2B();

        iCascadeAnalysis = step2B.find((s) => iCascade && s._cr4de_cascade_value === iCascade.cr4de_bnrariskcascadeid);
      }

      return iCascadeAnalysis || null;
    }

    return null;
  };

  const updateStep2BInput = async function (iCascade: DVRiskCascade<DVRiskFile>) {
    const iCascadeAnalysis = await findOrCreateCascadeAnalysis(iCascade);

    if (iCascadeAnalysis) {
      setCascadeAnalysis(iCascadeAnalysis);
      step2BInput.current = getCascadeInput(iCascadeAnalysis);
    }
  };

  const hasNextStep = () => {
    const hasCatalysing = catalysingEffects && catalysingEffects.length > 0;
    const hasClimateChange = Boolean(climateChange);
    const hasCauses = causes && causes.length > 0;

    if (activeStep === STEPS.INTRODUCTION) {
      return hasCauses || hasClimateChange || hasCatalysing;
    } else if (activeStep === STEPS.CAUSES) {
      if (hasClimateChange || hasCatalysing) return true;

      if (causes && cascadeIndex < causes?.length - 1) return true;

      return activeCauseScenario !== SCENARIOS.EXTREME || activeEffectScenario !== SCENARIOS.EXTREME;
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      return hasCatalysing;
    }
    return false;
  };

  // Split the cascades into causes and catalyzing effects
  // Set the current viewed cascade based on the "Active Step" and "Cascade Index" parameters (initialized by URL)
  useEffect(() => {
    if (cascades) {
      const iCauses = cascades && cascades.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type !== "Emerging Risk");
      const iCatalysingEffects =
        cascades &&
        cascades.filter(
          (c) =>
            c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk" &&
            c.cr4de_cause_hazard.cr4de_title.indexOf("Climate Change") < 0
        );
      const iClimateChange =
        cascades && cascades.find((c) => c.cr4de_cause_hazard.cr4de_title.indexOf("Climate Change") >= 0);

      let iCascade: DVRiskCascade<DVRiskFile, DVRiskFile> | null = null;
      if (activeStep === STEPS.CAUSES) iCascade = iCauses && iCauses[cascadeIndex];
      else if (activeStep === STEPS.CLIMATE_CHANGE && iClimateChange) iCascade = iClimateChange;
      else if (activeStep === STEPS.CATALYSING_EFFECTS)
        iCascade = iCatalysingEffects && iCatalysingEffects[cascadeIndex];

      setCauses(iCauses);
      setCatalysingEffects(iCatalysingEffects);
      setClimateChange(iClimateChange || null);
      setCascade(iCascade);

      if (iCascade) {
        updateStep2BInput(iCascade);
      }
    }
  }, [cascades, cascadeIndex, activeStep, step2A, step2B]);

  async function handleSave() {
    if (activeStep === STEPS.CAUSES || activeStep === STEPS.CATALYSING_EFFECTS) {
      if (!cascadeAnalysis || !step2BInput.current) return;

      api
        .updateCascadeAnalysis(cascadeAnalysis.cr4de_bnracascadeanalysisid, {
          cr4de_c2c: step2BInput.current.cr4de_c2c != null ? `CP${step2BInput.current.cr4de_c2c}` : null,
          cr4de_c2m: step2BInput.current.cr4de_c2m != null ? `CP${step2BInput.current.cr4de_c2m}` : null,
          cr4de_c2e: step2BInput.current.cr4de_c2e != null ? `CP${step2BInput.current.cr4de_c2e}` : null,
          cr4de_m2c: step2BInput.current.cr4de_m2c != null ? `CP${step2BInput.current.cr4de_m2c}` : null,
          cr4de_m2m: step2BInput.current.cr4de_m2m != null ? `CP${step2BInput.current.cr4de_m2m}` : null,
          cr4de_m2e: step2BInput.current.cr4de_m2e != null ? `CP${step2BInput.current.cr4de_m2e}` : null,
          cr4de_e2c: step2BInput.current.cr4de_e2c != null ? `CP${step2BInput.current.cr4de_e2c}` : null,
          cr4de_e2m: step2BInput.current.cr4de_e2m != null ? `CP${step2BInput.current.cr4de_e2m}` : null,
          cr4de_e2e: step2BInput.current.cr4de_e2e != null ? `CP${step2BInput.current.cr4de_e2e}` : null,
          cr4de_quali_cascade:
            !step2BInput.current.cr4de_quali_cascade || step2BInput.current.cr4de_quali_cascade === null
              ? null
              : step2BInput.current.cr4de_quali_cascade,
        })
        .then(() => load2B());
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      if (!climateChange || !step2A) return;

      api.updateDirectAnalysis(step2A?.cr4de_bnradirectanalysisid, {
        cr4de_dp50_quali: step2AInput.current,
      });
    }
  }

  const handleTransitionTo = (newStep: STEPS, newIndex: number = 0) => {
    setFadeIn(false);

    if (newIndex !== cascadeIndex) {
      handleChangeCascade(newIndex);
    }

    const timer = setTimeout(() => {
      setActiveStep(newStep);
      setFadeIn(true);
      setIsSaving(false);
      window.scrollTo(0, 0);
      setSearchParams({
        step: newStep.toString(),
        ...(newStep === STEPS.CAUSES || newStep === STEPS.CATALYSING_EFFECTS ? { index: newIndex.toString() } : {}),
      });
    }, transitionDelay);

    return () => clearTimeout(timer);
  };

  const finish = () => {};

  const handleNext = async () => {
    if (!step2B || causes === null || catalysingEffects === null) return;

    setQualiError(false);

    if (activeStep === STEPS.INTRODUCTION) {
      if (causes && causes.length > 0) {
        await findOrCreateCascadeAnalysis(causes[0]);

        handleTransitionTo(STEPS.CAUSES);
      } else if (climateChange) {
        await findOrCreateCascadeAnalysis(climateChange);

        handleTransitionTo(STEPS.CLIMATE_CHANGE);
      } else if (catalysingEffects && catalysingEffects.length > 0) {
        await findOrCreateCascadeAnalysis(catalysingEffects[0]);

        handleTransitionTo(STEPS.CATALYSING_EFFECTS);
      } else {
        finish();
      }
    } else if (activeStep === STEPS.CAUSES) {
      handleSave();

      if (!handleNextCascadeScenario()) {
        if (step2BInput.current?.cr4de_quali_cascade === null || step2BInput.current?.cr4de_quali_cascade === "") {
          setQualiError(true);

          return;
        }

        const nextCascadeIndex = cascadeIndex + 1;

        if (nextCascadeIndex >= causes.length) {
          if (climateChange) {
            await findOrCreateCascadeAnalysis(climateChange);

            handleTransitionTo(STEPS.CLIMATE_CHANGE);
          } else if (catalysingEffects && catalysingEffects.length > 0) {
            await findOrCreateCascadeAnalysis(catalysingEffects[0]);

            setCascadeIndex(0);
            handleTransitionTo(STEPS.CATALYSING_EFFECTS);
          } else {
            finish();
          }
        } else {
          handleChangeCascade(nextCascadeIndex);
        }
      } else {
        document.getElementById("cascade-title")?.scrollIntoView({ behavior: "smooth" });
      }
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      handleSave();

      if (step2AInput.current === null || step2AInput.current === "") {
        setQualiError(true);

        return;
      }

      if (catalysingEffects && catalysingEffects.length > 0) {
        await findOrCreateCascadeAnalysis(catalysingEffects[0]);

        setCascadeIndex(0);
        handleTransitionTo(STEPS.CATALYSING_EFFECTS);
      } else {
        finish();
      }
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      handleSave();

      if (step2BInput.current?.cr4de_quali_cascade === null || step2BInput.current?.cr4de_quali_cascade === "") {
        setQualiError(true);

        return;
      }

      const nextCascadeIndex = cascadeIndex + 1;

      if (nextCascadeIndex >= catalysingEffects.length) {
        if (climateChange) {
          await findOrCreateCascadeAnalysis(climateChange);

          handleTransitionTo(STEPS.CLIMATE_CHANGE);
        } else {
          finish();
        }
      } else {
        handleChangeCascade(nextCascadeIndex);
      }
    }
  };

  const handlePrevious = async () => {
    if (!step2B || !causes || !catalysingEffects) return;

    if (activeStep === STEPS.CAUSES) {
      handleSave();

      if (!handlePreviousCascadeScenario()) {
        const previousCascadeIndex = cascadeIndex - 1;

        if (previousCascadeIndex < 0) {
          handleTransitionTo(STEPS.INTRODUCTION);
        } else {
          handleChangeCascade(previousCascadeIndex);
        }
      } else {
        document.getElementById("cascade-title")?.scrollIntoView({ behavior: "smooth" });
      }
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      handleSave();

      if (causes && causes.length > 0) {
        await findOrCreateCascadeAnalysis(causes[causes.length - 1]);

        handleTransitionTo(STEPS.CAUSES, causes.length - 1);
      } else {
        handleTransitionTo(STEPS.INTRODUCTION);
      }
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      handleSave();

      const previousCascadeIndex = cascadeIndex - 1;

      if (previousCascadeIndex < 0) {
        if (climateChange) {
          await findOrCreateCascadeAnalysis(climateChange);

          handleTransitionTo(STEPS.CLIMATE_CHANGE);
        } else if (causes && causes.length > 0) {
          await findOrCreateCascadeAnalysis(causes[causes.length - 1]);

          setCascadeIndex(causes.length - 1);
          handleTransitionTo(STEPS.CAUSES);
        } else {
          handleTransitionTo(STEPS.INTRODUCTION);
        }
      } else {
        handleChangeCascade(previousCascadeIndex);
      }
    }
  };

  function handleNextCascadeScenario(): Boolean {
    if (activeCauseScenario === SCENARIOS.EXTREME) {
      if (activeEffectScenario === SCENARIOS.CONSIDERABLE) {
        setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
        setActiveEffectScenario(SCENARIOS.MAJOR);
      } else if (activeEffectScenario === SCENARIOS.MAJOR) {
        setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
        setActiveEffectScenario(SCENARIOS.EXTREME);
      } else {
        return false;
      }
    } else if (activeCauseScenario === SCENARIOS.CONSIDERABLE) {
      setActiveCauseScenario(SCENARIOS.MAJOR);
    } else {
      setActiveCauseScenario(SCENARIOS.EXTREME);
    }

    return true;
  }

  function handlePreviousCascadeScenario() {
    if (activeCauseScenario === SCENARIOS.CONSIDERABLE) {
      if (activeEffectScenario === SCENARIOS.MAJOR) {
        setActiveCauseScenario(SCENARIOS.EXTREME);
        setActiveEffectScenario(SCENARIOS.CONSIDERABLE);
      } else if (activeEffectScenario === SCENARIOS.EXTREME) {
        setActiveCauseScenario(SCENARIOS.EXTREME);
        setActiveEffectScenario(SCENARIOS.MAJOR);
      } else {
        return false;
      }
    } else if (activeCauseScenario === SCENARIOS.MAJOR) {
      setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
    } else {
      setActiveCauseScenario(SCENARIOS.MAJOR);
    }

    return true;
  }

  const handleChangeScenario = (causeScenario: SCENARIOS | null, effectScenario: SCENARIOS | null) => {
    if (causeScenario) setActiveCauseScenario(causeScenario);
    if (effectScenario) setActiveEffectScenario(effectScenario);
  };

  const handleChangeCascade = (newCascadeIndex: number) => {
    const newCascade = cascades && cascades[newCascadeIndex];
    if (!newCascade) return;

    setFadeIn(false);

    setSearchParams({
      step: searchParams.get("step") || STEPS.CAUSES.toString(),
      index: newCascadeIndex.toString(),
    });

    // window.scroll({ top: 0, left: 0, behavior: "smooth" });

    setTimeout(async () => {
      setIsSaving(true);
      setCascadeIndex(newCascadeIndex);
      await updateStep2BInput(newCascade);
      setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
      setActiveEffectScenario(SCENARIOS.CONSIDERABLE);

      setIsSaving(false);
    }, transitionDelay);
  };

  // Transition to the step in the URL parameters after first loading the page
  useEffect(() => {
    if (activeStep === null) {
      const searchParamStep = searchParams.get("step");

      if (searchParamStep && parseInt(searchParamStep, 10) in STEPS) {
        handleTransitionTo(parseInt(searchParamStep, 10) as STEPS);
      } else handleTransitionTo(STEPS.INTRODUCTION);
    }
  }, [activeStep]);

  useEffect(() => {
    const searchParamStep = searchParams.get("step");
    const searchParamIndex = searchParams.get("index");

    if (activeStep && searchParamStep && parseInt(searchParamStep, 10) !== activeStep) {
      handleTransitionTo(
        parseInt(searchParamStep, 10) as STEPS,
        searchParamIndex ? parseInt(searchParamIndex, 10) : undefined
      );
    } else if (cascadeIndex !== null && searchParamIndex && parseInt(searchParamIndex, 10) !== cascadeIndex) {
      handleChangeCascade(parseInt(searchParamIndex, 10));
    }
  }, [searchParams]);

  // Auto-save after 10s of inactivity
  useEffect(() => {
    const autosaveTimer = setTimeout(() => {
      handleSave();
    }, 10000);

    return () => clearTimeout(autosaveTimer);
  }, []);

  useEffect(() => {
    if (fadeIn) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [fadeIn]);

  usePageTitle(t("step2B.pageTitle", "BNRA 2023 - 2026 Risk Analysis B"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("step2B.breadcrumb", "Risk Analysis B"), url: "/overview" },
    step2A ? { name: step2A.cr4de_risk_file?.cr4de_title, url: "" } : null,
  ]);

  return (
    <>
      <Container sx={{ position: "relative" }}>
        <Dialog
          open={saveError}
          onClose={() => setSaveError(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography paragraph>
                <Trans i18nKey="2A.savingError.1">
                  An error occured while saving your input. Please check your internet connection.
                </Trans>
              </Typography>
              <Typography paragraph>
                <Trans i18nKey="2A.savingError.2">A new autosave will be attempted in 10 seconds.</Trans>
              </Typography>
              <Typography paragraph>
                <Trans i18nKey="2A.savingError.3">If the error keeps returning, please contact us.</Trans>
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveError(false)} autoFocus>
              <Trans i18nKey="button.ok">Ok</Trans>
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      <Fade in={fadeIn} timeout={transitionDelay} mountOnEnter unmountOnExit>
        <Box sx={{ mt: 6, mb: 16 }}>
          {(!step2A || isSaving) && (
            <Box sx={{ mt: 32, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          )}
          {step2A && step2A.cr4de_risk_file.cr4de_risk_type === "Standard Risk" && (
            <Standard
              activeStep={activeStep}
              causes={causes}
              catalysingEffects={catalysingEffects}
              climateChange={climateChange}
              cascade={cascade}
              cascadeIndex={cascadeIndex}
              step2A={step2A}
              step2B={cascadeAnalysis}
              step2AInput={step2AInput}
              step2BInput={step2BInput.current}
              activeCauseScenario={activeCauseScenario}
              activeEffectScenario={activeEffectScenario}
              qualiError={qualiError}
              runTutorial={runTutorial}
              setRunTutorial={setRunTutorial}
              setStep2BInput={(input, update) => {
                step2BInput.current = input;

                if (update) {
                  forceUpdate();
                }
              }}
              onSave={handleSave}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onChangeScenario={handleChangeScenario}
              onUnmount={() => {
                setFadeIn(true);
              }}
              onShowCauses={() => setQuickNavOpen(OPEN_STATE.CAUSES)}
            />
          )}
        </Box>
      </Fade>

      <InformationButton
        riskFile={step2A?.cr4de_risk_file}
        forceOpen={openSpeedDial}
        onRunTutorial={() => setRunTutorial(true)}
      />

      {step2A && causes !== null && catalysingEffects !== null && (
        <QuickNavSidebar
          step2A={step2A}
          causes={causes}
          climateChange={climateChange}
          catalysingEffects={catalysingEffects}
          hasCauses={activeStep === STEPS.CLIMATE_CHANGE}
          open={quickNavOpen}
          setOpen={setQuickNavOpen}
        />
      )}

      <BottomBar
        step2A={step2A}
        causes={causes}
        climateChange={climateChange}
        catalysingEffects={catalysingEffects}
        cascadeIndex={cascadeIndex}
        activeStep={activeStep}
        activeCauseScenario={activeCauseScenario}
        activeEffectScenario={activeEffectScenario}
        isSaving={isSaving}
        hasNextStep={hasNextStep()}
        step2BInput={step2BInput}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onGoToStep={handleTransitionTo}
        onFinish={() => {
          setQualiError(false);
          if (!hasNextStep()) {
            if (activeStep === STEPS.CAUSES) {
              if (
                step2BInput.current?.cr4de_quali_cascade === null ||
                step2BInput.current?.cr4de_quali_cascade === ""
              ) {
                setQualiError(true);

                return;
              }
            } else if (activeStep === STEPS.CLIMATE_CHANGE) {
              if (step2AInput.current === null || step2AInput.current === "") {
                setQualiError(true);

                return;
              }
            } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
              handleSave();

              if (
                step2BInput.current?.cr4de_quali_cascade === null ||
                step2BInput.current?.cr4de_quali_cascade === ""
              ) {
                setQualiError(true);

                return;
              }
            }
          }
          setInputErrors(validateStep2B(step2A, step2B, causes, climateChange, catalysingEffects));
          setFinishedDialogOpen(true);
        }}
      />

      {step2A && (
        <FinishDialog
          step2A={step2A}
          finishedDialogOpen={finishedDialogOpen}
          inputErrors={inputErrors}
          setFinishedDialogOpen={setFinishedDialogOpen}
          setSurveyDialogOpen={setSurveyDialogOpen}
        />
      )}

      {step2A && (
        <SurveyDialog
          open={surveyDialogOpen}
          riskFile={step2A?.cr4de_risk_file}
          step={FeedbackStep.STEP_2A}
          onClose={() => {
            setSurveyDialogOpen(false);
            navigate("/overview");
          }}
        />
      )}
    </>
  );
}
