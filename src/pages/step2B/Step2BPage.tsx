import { useState, useEffect, useRef, useReducer } from "react";
import {
  Box,
  Button,
  Paper,
  Fade,
  Container,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import usePageTitle from "../../hooks/usePageTitle";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import useAPI, { DataTable } from "../../hooks/useAPI";
import Progress from "./information/Progress";
import SavingOverlay from "../../components/SavingOverlay";
import useRecord from "../../hooks/useRecord";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import Standard from "./standard/Standard";
import { STEPS } from "./Steps";
import useLazyRecords from "../../hooks/useLazyRecords";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import CircularProgress from "@mui/material/CircularProgress";
import useRecords from "../../hooks/useRecords";
import { AuthPageContext } from "../AuthPage";
import { SCENARIOS } from "../../functions/scenarios";
import { CascadeAnalysisInput, getCascadeField, getCascadeInput } from "../../functions/cascades";

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

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [activeStep, setActiveStep] = useState<STEPS | null>(null);
  const [cascadeIndex, setCascadeIndex] = useState(parseInt(searchParams.get("index") || "1", 10) - 1);
  const [activeCauseScenario, setActiveCauseScenario] = useState(SCENARIOS.CONSIDERABLE);
  const [activeEffectScenario, setActiveEffectScenario] = useState(SCENARIOS.CONSIDERABLE);

  const [causes, setCauses] = useState<DVRiskCascade<DVRiskFile, DVRiskFile>[] | null>(null);
  const [catalysingEffects, setCatalysingEffects] = useState<DVRiskCascade<DVRiskFile, DVRiskFile>[] | null>(null);
  const [climateChange, setClimateChange] = useState<DVRiskCascade<DVRiskFile, DVRiskFile> | null>(null);
  const [cascade, setCascade] = useState<DVRiskCascade<DVRiskFile, DVRiskFile> | null>(null);
  const [cascadeAnalysis, setCascadeAnalysis] = useState<DVCascadeAnalysis | null>(null);

  const step2BInput = useRef<CascadeAnalysisInput | null>(null);

  const [finishedDialogOpen, setFinishedDialogOpen] = useState(false);
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const {
    data: cascades,
    loading: loadingCascades,
    getData: loadCascades,
  } = useLazyRecords<DVRiskCascade<DVRiskFile, DVRiskFile>>({
    table: DataTable.RISK_CASCADE,
    transformResult: (result: DVRiskCascade<DVRiskFile, DVRiskFile>[]) => {
      return result.sort((a, b) => a.cr4de_cause_hazard.cr4de_title.localeCompare(b.cr4de_cause_hazard.cr4de_title));
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
      console.log("onComplete");
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
    console.log("updateStep2BInput");
    const iCascadeAnalysis = await findOrCreateCascadeAnalysis(iCascade);
    console.log(iCascadeAnalysis);
    if (iCascadeAnalysis) {
      setCascadeAnalysis(iCascadeAnalysis);
      step2BInput.current = getCascadeInput(iCascadeAnalysis);
    }
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
  }

  usePageTitle(t("step2B.pageTitle", "BNRA 2023 - 2026 Risk Analysis B"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("step2B.breadcrumb", "Risk Analysis B"), url: "/overview" },
    step2A ? { name: step2A.cr4de_risk_file?.cr4de_title, url: "" } : null,
  ]);

  const transitionTo = (newStep: STEPS) => {
    setFadeIn(false);

    const timer = setTimeout(() => {
      setActiveStep(newStep);
      setFadeIn(true);
      setIsSaving(false);
      window.scrollTo(0, 0);
      setSearchParams({
        step: newStep.toString(),
        ...(newStep === STEPS.CAUSES || newStep === STEPS.CATALYSING_EFFECTS ? { index: "1" } : {}),
      });
    }, transitionDelay);

    return () => clearTimeout(timer);
  };

  const finish = () => {};

  const next = async () => {
    if (!step2B || causes === null || catalysingEffects === null) return;

    if (activeStep === STEPS.INTRODUCTION) {
      if (causes && causes.length > 0) {
        await findOrCreateCascadeAnalysis(causes[0]);

        transitionTo(STEPS.CAUSES);
      } else if (climateChange) {
        await findOrCreateCascadeAnalysis(climateChange);

        transitionTo(STEPS.CLIMATE_CHANGE);
      } else if (catalysingEffects && catalysingEffects.length > 0) {
        await findOrCreateCascadeAnalysis(catalysingEffects[0]);

        transitionTo(STEPS.CATALYSING_EFFECTS);
      } else {
        finish();
      }
    } else if (activeStep === STEPS.CAUSES) {
      handleSave();

      if (!handleNextCascade()) {
        const nextCascadeIndex = cascadeIndex + 1;
        const nextCascade = causes[nextCascadeIndex];

        if (!nextCascade) {
          if (climateChange) {
            await findOrCreateCascadeAnalysis(climateChange);

            transitionTo(STEPS.CLIMATE_CHANGE);
          } else if (catalysingEffects && catalysingEffects.length > 0) {
            await findOrCreateCascadeAnalysis(catalysingEffects[0]);

            setCascadeIndex(1);
            transitionTo(STEPS.CATALYSING_EFFECTS);
          } else {
            finish();
          }
        } else {
          setFadeIn(false);
          setIsSaving(true);

          setCascadeIndex(nextCascadeIndex);
          setSearchParams({
            step: searchParams.get("step") || STEPS.CAUSES.toString(),
            index: (nextCascadeIndex + 1).toString(),
          });

          // window.scroll({ top: 0, left: 0, behavior: "smooth" });

          setTimeout(async () => {
            await updateStep2BInput(nextCascade);
            setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
            setActiveEffectScenario(SCENARIOS.CONSIDERABLE);

            setIsSaving(false);
          }, transitionDelay);
        }
      }
    } else if (activeStep === STEPS.CLIMATE_CHANGE) {
      handleSave();

      if (!handleNextCascade()) {
        if (catalysingEffects && catalysingEffects.length > 0) {
          await findOrCreateCascadeAnalysis(catalysingEffects[0]);

          setCascadeIndex(1);
          transitionTo(STEPS.CATALYSING_EFFECTS);
        } else {
          finish();
        }
      }
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      handleSave();

      const nextCascadeIndex = cascadeIndex + 1;
      const nextCascade = catalysingEffects[nextCascadeIndex];

      if (!nextCascade) {
        if (climateChange) {
          await findOrCreateCascadeAnalysis(climateChange);

          transitionTo(STEPS.CLIMATE_CHANGE);
        } else {
          finish();
        }
      } else {
        setFadeIn(false);
        setIsSaving(true);

        setCascadeIndex(nextCascadeIndex);
        setSearchParams({
          step: searchParams.get("step") || STEPS.CATALYSING_EFFECTS.toString(),
          index: (nextCascadeIndex + 1).toString(),
        });

        // window.scroll({ top: 0, left: 0, behavior: "smooth" });

        setTimeout(async () => {
          await updateStep2BInput(nextCascade);

          setIsSaving(false);
        }, transitionDelay);
      }
    }
  };

  const previous = async () => {
    if (!step2B || !causes || !catalysingEffects) return;

    // if (activeStep === STEPS.REVIEW) {
    //   setCascadeIndex(catalysingEffects.length - 1);
    //   setSearchParams({
    //     step: searchParams.get("step") || "1",
    //     index: catalysingEffects.length.toString(),
    //   });
    // } else
    if (activeStep === STEPS.CAUSES) {
      handleSave();

      if (!handlePreviousCascade()) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

        const previousCascadeIndex = cascadeIndex - 1;
        const previousCascade = causes[previousCascadeIndex];

        if (!previousCascade) {
          transitionTo(STEPS.INTRODUCTION);
        } else {
          setFadeIn(false);
          setIsSaving(true);

          setCascadeIndex(previousCascadeIndex);
          setSearchParams({
            step: searchParams.get("step") || "1",
            index: (previousCascadeIndex + 1).toString(),
          });

          // window.scrollTo({ top: 0, behavior: "smooth" });

          setTimeout(async () => {
            await updateStep2BInput(previousCascade);

            setActiveCauseScenario(SCENARIOS.EXTREME);
            setActiveEffectScenario(SCENARIOS.EXTREME);

            setIsSaving(false);
          }, transitionDelay);
        }
      }
    } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
      handleSave();

      if (!handlePreviousCascade()) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

        const previousCascadeIndex = cascadeIndex - 1;
        const previousCascade = causes[previousCascadeIndex];

        if (!previousCascade) {
          transitionTo(STEPS.CAUSES);

          setCascadeIndex(causes.length - 1);
        } else {
          setFadeIn(false);
          setIsSaving(true);

          setCascadeIndex(previousCascadeIndex);
          setSearchParams({
            step: searchParams.get("step") || "2",
            index: (previousCascadeIndex + 1).toString(),
          });

          // window.scrollTo({ top: 0, behavior: "smooth" });

          setTimeout(async () => {
            await updateStep2BInput(previousCascade);

            setActiveCauseScenario(SCENARIOS.EXTREME);
            setActiveEffectScenario(SCENARIOS.EXTREME);

            setIsSaving(false);
          }, transitionDelay);
        }
      }
    }
  };

  function handleNextCascade(): Boolean {
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

  function handlePreviousCascade() {
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

  // Transition to the step in the URL parameters after first loading the page
  useEffect(() => {
    if (activeStep === null) {
      const searchParamStep = searchParams.get("step");

      if (searchParamStep && parseInt(searchParamStep, 10) in STEPS) {
        transitionTo(parseInt(searchParamStep, 10) as STEPS);
      } else transitionTo(STEPS.INTRODUCTION);
    }
  }, [activeStep]);

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

      <SavingOverlay visible={isSaving} />
      <Fade in={fadeIn} timeout={transitionDelay} mountOnEnter unmountOnExit>
        <Box sx={{ mt: 6, mb: 16 }}>
          {!step2A && (
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
              step2BInput={step2BInput.current}
              activeCauseScenario={activeCauseScenario}
              activeEffectScenario={activeEffectScenario}
              setRunTutorial={setRunTutorial}
              setStep2BInput={(input, update) => {
                step2BInput.current = input;

                if (update) {
                  forceUpdate();
                }
              }}
              onNext={next}
              onPrevious={previous}
              onChangeScenario={handleChangeScenario}
              onUnmount={() => {
                setFadeIn(true);
              }}
            />
          )}
          {/* {step2A && step2A.cr4de_risk_file.cr4de_risk_type === "Malicious Man-made Risk" && (
              <ManMade
                activeStep={activeStep}
                step2A={step2A}
                causes={causes}
                effects={effects}
                inputRef={inputRef}
                inputErrors={inputErrors}
                setRunTutorial={setRunTutorial}
              />
            )} */}
        </Box>
      </Fade>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          p: 1,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
        }}
        component={Paper}
        elevation={5}
      >
        <Button id="back-button" disabled={isSaving} color="secondary" onClick={previous}>
          <Trans i18nKey="button.back">Back</Trans>
        </Button>

        <Progress
          activeStep={activeStep || 0}
          goToStep={transitionTo}
          riskType={step2A?.cr4de_risk_file.cr4de_risk_type}
          causes={causes || []}
          causeIndex={activeStep === STEPS.CAUSES ? (cascadeIndex + 1).toString() : null}
          catalysingEffects={catalysingEffects || []}
          catalysingEffectIndex={activeStep === STEPS.CATALYSING_EFFECTS ? (cascadeIndex + 1).toString() : null}
          hasClimateChange={Boolean(climateChange)}
        />

        <Box id="step2A-next-buttons">
          {activeStep !== STEPS.REVIEW && (
            <Tooltip
              title={
                step2BInput.current &&
                step2BInput.current[getCascadeField(activeCauseScenario, activeEffectScenario)] != null
                  ? t("2B.doneButton.continue", "Continue")
                  : t("2B.doneButton.selectValue", "Please select a value before continuing")
              }
            >
              <span>
                <Button
                  disabled={
                    isSaving ||
                    ((activeStep === STEPS.CAUSES || activeStep === STEPS.CATALYSING_EFFECTS) &&
                      (!step2BInput.current ||
                        step2BInput.current[getCascadeField(activeCauseScenario, activeEffectScenario)] == null))
                  }
                  color="primary"
                  sx={{ mr: 1 }}
                  onClick={next}
                >
                  <Trans i18nKey="button.next">Next</Trans>
                </Button>
              </span>
            </Tooltip>
          )}
          <Button disabled={isSaving} color="primary" sx={{ mr: 1 }} onClick={() => setFinishedDialogOpen(true)}>
            <Trans i18nKey="button.saveandexit">Save & exit</Trans>
          </Button>
        </Box>
      </Box>

      <Dialog open={finishedDialogOpen} onClose={() => setFinishedDialogOpen(false)}>
        <>
          <DialogTitle>
            <Trans i18nKey="2A.exitDialog.title">Would you like to exit step 2A?</Trans>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Trans i18nKey="2A.exitDialog.helpText">
                Your progress will be saved and you may return at a later time to continue where you left of.
              </Trans>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFinishedDialogOpen(false)}>
              <Trans i18nKey="2A.exitDialog.cancel">No, stay here</Trans>
            </Button>
            <Button
              onClick={async () => {
                if (!step2A) return;

                // handleSave();

                navigate("/overview");
              }}
            >
              <Trans i18nKey="2A.exitDialog.finish">Yes, return to my risks</Trans>
            </Button>
          </DialogActions>
        </>
      </Dialog>
    </>
  );
}
