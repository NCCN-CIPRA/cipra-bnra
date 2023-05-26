import { useState, useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import usePageTitle from "../../hooks/usePageTitle";
import useRecord from "../../hooks/useRecord";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
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
} from "@mui/material";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import Progress, { ScenarioErrors } from "./information/Progress";
import InformationButton from "./information/InformationButton";
import useLazyRecords from "../../hooks/useLazyRecords";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { stepNames, STEPS } from "./Steps";
import { getScenarioInputs, getTrueInputs, ScenarioInput, ScenarioInputs } from "./fields";
import SavingOverlay from "../../components/SavingOverlay";
import Review from "./standard/Review";
import ScenarioAnalysis, { validateScenarioInputs } from "./standard/ScenarioAnalysis";
import { Scenarios } from "../../functions/scenarios";
import SurveyDialog from "../../components/SurveyDialog";
import { AuthPageContext } from "../AuthPage";
import { FeedbackStep } from "../../types/dataverse/DVFeedback";
import Introduction from "./standard/Introduction";
import Step2ATutorial from "./information/Step2ATutorial";
import Standard from "./standard/Standard";
import ManMade from "./manmade/ManMade";
import useProcess from "../../hooks/useProcess";
import Step2ATutorialMM from "./information/Step2ATutorialMM";

type RouteParams = {
  step2A_id: string;
};

const step2Name = {
  [STEPS.CONSIDERABLE]: "considerable" as keyof Scenarios,
  [STEPS.MAJOR]: "major" as keyof Scenarios,
  [STEPS.EXTREME]: "extreme" as keyof Scenarios,
};

const transitionDelay = 500;

const DRAWER_WIDTH = 360;

export default function Step2APage() {
  const { t } = useTranslation();
  const routeParams = useParams() as RouteParams;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const api = useAPI();
  const process = useProcess();
  const { user } = useOutletContext<AuthPageContext>();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [fade, setFade] = useState(true);
  const [activeStep, setActiveStep] = useState<STEPS | null>(null);
  const [currentStep, setCurrentStep] = useState(STEPS.INTRODUCTION);

  const [finishedDialogOpen, setFinishedDialogOpen] = useState(false);
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);

  const inputRef = useRef<ScenarioInputs | null>(null);
  const [inputErrors, setInputErrors] = useState<ScenarioErrors>({
    [STEPS.CONSIDERABLE]: [],
    [STEPS.MAJOR]: [],
    [STEPS.EXTREME]: [],
  });

  const {
    data: causes,
    loading: loadingCauses,
    getData: loadCauses,
  } = useLazyRecords<DVRiskCascade<DVRiskFile>>({
    table: DataTable.RISK_CASCADE,
    transformResult: (result: DVRiskCascade<DVRiskFile>[]) => {
      return result.sort((a, b) => a.cr4de_cause_hazard.cr4de_title.localeCompare(b.cr4de_cause_hazard.cr4de_title));
    },
  });
  const {
    data: effects,
    loading: loadingEffects,
    getData: loadEffects,
  } = useLazyRecords<DVRiskCascade<undefined, DVRiskFile>>({
    table: DataTable.RISK_CASCADE,
    transformResult: (result: DVRiskCascade<undefined, DVRiskFile>[]) => {
      return result.sort((a, b) => a.cr4de_effect_hazard.cr4de_title.localeCompare(b.cr4de_effect_hazard.cr4de_title));
    },
  });

  /**
   * Retrieve the step 2A record from the database that is defined in the page url when the page loads
   */
  const { data: step2A } = useRecord<DVDirectAnalysis<DVRiskFile>>({
    table: DataTable.DIRECT_ANALYSIS,
    id: routeParams.step2A_id,
    query: "$expand=cr4de_risk_file",
    onComplete: async (step2A) => {
      loadCauses({
        query: `$filter=_cr4de_effect_hazard_value eq ${step2A._cr4de_risk_file_value}&$expand=cr4de_cause_hazard($select=cr4de_title,cr4de_hazard_id)`,
      });
      loadEffects({
        query: `$filter=_cr4de_cause_hazard_value eq ${step2A._cr4de_risk_file_value}&$expand=cr4de_effect_hazard($select=cr4de_title,cr4de_hazard_id)`,
      });

      inputRef.current = {
        considerable: getScenarioInputs(step2A, "considerable"),
        major: getScenarioInputs(step2A, "major"),
        extreme: getScenarioInputs(step2A, "extreme"),
      };
    },
    onError: async (errorCode) => {
      if (errorCode === 404) {
        navigate("/overview");
      }
    },
  });

  const handleSave = async (showLoader = true) => {
    if (!step2A || !inputRef.current || isSaving) return;

    if (showLoader) setIsSaving(true);

    try {
      await api.updateDirectAnalysis(step2A.cr4de_bnradirectanalysisid, {
        ...getTrueInputs(inputRef.current.considerable, "considerable"),
        ...getTrueInputs(inputRef.current.major, "major"),
        ...getTrueInputs(inputRef.current.extreme, "extreme"),
      });

      setSaveError(false);
    } catch (e) {
      setSaveError(true);

      setIsSaving(false);
      throw e;
    }
  };

  usePageTitle(t("step2A.pageTitle", "BNRA 2023 - 2026 Risk Analysis A"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("step2A.breadcrumb", "Risk Analysis A"), url: "/overview" },
    step2A ? { name: step2A.cr4de_risk_file.cr4de_title, url: "" } : null,
  ]);

  const transitionTo = (newStep: STEPS) => {
    setFade(false);

    const timer = setTimeout(() => {
      setActiveStep(newStep);
      setFade(true);
      setIsSaving(false);
      window.scrollTo(0, 0);
      setSearchParams({
        step: newStep.toString(),
      });
    }, transitionDelay);

    return () => clearTimeout(timer);
  };

  const next = async () => {
    if (!inputRef.current) return;

    if (activeStep === STEPS.REVIEW) {
      const errors = {
        [STEPS.CONSIDERABLE]: validateScenarioInputs(
          inputRef.current.considerable,
          step2A?.cr4de_risk_file.cr4de_risk_type
        ),
        [STEPS.MAJOR]: validateScenarioInputs(inputRef.current.major, step2A?.cr4de_risk_file.cr4de_risk_type),
        [STEPS.EXTREME]: validateScenarioInputs(inputRef.current.extreme, step2A?.cr4de_risk_file.cr4de_risk_type),
      };

      if (Object.values(errors).some((e) => e.length > 0)) {
        setInputErrors(errors);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        setIsSaving(true);
        navigate("/overview");
      }
    } else if (activeStep === STEPS.INTRODUCTION) {
      transitionTo(activeStep + 1);
    } else {
      goToStep(activeStep !== null ? activeStep + 1 : STEPS.INTRODUCTION);
    }
  };

  const goToStep = async (to: STEPS) => {
    // Validate if we are going to the next step or if we are on a previous step
    if (to > currentStep || activeStep !== currentStep) {
      if (inputRef.current && activeStep !== STEPS.INTRODUCTION && activeStep !== STEPS.REVIEW && activeStep !== null) {
        const errors = validateScenarioInputs(
          inputRef.current[step2Name[activeStep]],
          step2A?.cr4de_risk_file.cr4de_risk_type
        );

        await handleSave(errors.length <= 0);

        if (errors.length > 0) {
          setInputErrors({ ...inputErrors, [activeStep]: errors });

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

          return;
        } else {
          setInputErrors({ ...inputErrors, [activeStep]: [] });
        }
      }
    } else {
      await handleSave();

      if (activeStep !== STEPS.INTRODUCTION && activeStep !== STEPS.REVIEW && activeStep !== null)
        setInputErrors({ ...inputErrors, [activeStep]: [] });
    }

    transitionTo(to);
  };

  const previous = async () => {
    if (activeStep !== null && activeStep !== STEPS.INTRODUCTION) {
      goToStep(activeStep - 1);
    }
  };

  useEffect(() => {
    if (activeStep === null) {
      const searchParamStep = searchParams.get("step");
      if (searchParamStep && parseInt(searchParamStep, 10) in STEPS) {
        transitionTo(parseInt(searchParamStep, 10) as STEPS);
      } else transitionTo(STEPS.INTRODUCTION);
    }
  }, [activeStep]);

  useEffect(() => {
    const autosaveTimer = setTimeout(() => {
      handleSave();
    }, 10000);

    return () => clearTimeout(autosaveTimer);
  }, []);

  const drawerWidth = DRAWER_WIDTH;

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
        <SavingOverlay visible={isSaving} />
        <Fade in={fade} timeout={transitionDelay}>
          <Box sx={{ mt: 6, mb: 16 }}>
            {(activeStep === null || !step2A) && (
              <Box sx={{ mt: 32, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            )}
            {step2A && step2A.cr4de_risk_file.cr4de_risk_type === "Standard Risk" && (
              <Standard
                activeStep={activeStep}
                step2A={step2A}
                causes={causes}
                effects={effects}
                inputRef={inputRef}
                inputErrors={inputErrors}
                setRunTutorial={setRunTutorial}
              />
            )}
            {step2A && step2A.cr4de_risk_file.cr4de_risk_type === "Malicious Man-made Risk" && (
              <ManMade
                activeStep={activeStep}
                step2A={step2A}
                causes={causes}
                effects={effects}
                inputRef={inputRef}
                inputErrors={inputErrors}
                setRunTutorial={setRunTutorial}
              />
            )}
          </Box>
        </Fade>
      </Container>
      <InformationButton
        riskFile={step2A?.cr4de_risk_file}
        forceOpen={openSpeedDial}
        onRunTutorial={() => setRunTutorial(true)}
      />
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
          goToStep={goToStep}
          inputRef={inputRef}
          inputErrors={inputErrors}
          riskType={step2A?.cr4de_risk_file.cr4de_risk_type}
          setCurrentStep={setCurrentStep}
        />

        <Box id="step2A-next-buttons">
          {activeStep !== STEPS.REVIEW && (
            <Button disabled={isSaving} color="primary" sx={{ mr: 1 }} onClick={next}>
              <Trans i18nKey="button.next">Next</Trans>
            </Button>
          )}
          <Button disabled={isSaving} color="primary" sx={{ mr: 1 }} onClick={() => setFinishedDialogOpen(true)}>
            <Trans i18nKey="button.saveandexit">Save & exit</Trans>
          </Button>
        </Box>
      </Box>

      <Dialog open={finishedDialogOpen} onClose={() => setFinishedDialogOpen(false)}>
        {currentStep === STEPS.REVIEW && Object.values(inputErrors).every((e) => e.length <= 0) ? (
          <>
            <DialogTitle>
              <Trans i18nKey="2A.finishedDialog.title">Are you finished with step 2A?</Trans>
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Trans i18nKey="2A.finishedDialog.helpText">
                  Even if you indicate that you are finished, you can still return at a later time to make changes until
                  the end of step 2A for this risk file.
                </Trans>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFinishedDialogOpen(false)}>
                <Trans i18nKey="2A.finishedDialog.cancel">No, I am not finished</Trans>
              </Button>
              <Button
                onClick={async () => {
                  if (!step2A) return;

                  setFinishedDialogOpen(false);
                  setSurveyDialogOpen(true);

                  const participants = await api.getParticipants(
                    `$filter=_cr4de_contact_value eq ${user.contactid} and _cr4de_direct_analysis_value eq ${step2A.cr4de_bnradirectanalysisid}`
                  );
                  if (participants.length >= 0) {
                    await process.finishStep2A(step2A.cr4de_risk_file, participants[0]);
                    await api.finishStep(step2A._cr4de_risk_file_value, user.contactid, "2A");
                  }
                }}
              >
                <Trans i18nKey="2A.finishedDialog.finish">Yes, I am finished</Trans>
              </Button>
            </DialogActions>
          </>
        ) : (
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

                  handleSave();

                  navigate("/overview");
                }}
              >
                <Trans i18nKey="2A.exitDialog.finish">Yes, return to my risks</Trans>
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {step2A && step2A.cr4de_risk_file.cr4de_risk_type === "Standard Risk" && (
        <Step2ATutorial
          run={runTutorial}
          setRun={setRunTutorial}
          setStep={transitionTo}
          handleSetSpeeddialOpen={setOpenSpeedDial}
        />
      )}

      {step2A && step2A.cr4de_risk_file.cr4de_risk_type === "Malicious Man-made Risk" && (
        <Step2ATutorialMM
          run={runTutorial}
          setRun={setRunTutorial}
          setStep={transitionTo}
          handleSetSpeeddialOpen={setOpenSpeedDial}
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
