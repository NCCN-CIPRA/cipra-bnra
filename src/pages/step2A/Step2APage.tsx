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
import SavingOverlay from "./SavingOverlay";
import Review from "./steps/Review";
import ScenarioAnalysis, { validateScenarioInputs } from "./steps/ScenarioAnalysis";
import { Scenarios } from "../../functions/scenarios";
import SurveyDialog from "../../components/SurveyDialog";
import { AuthPageContext } from "../AuthPage";
import { FeedbackStep } from "../../types/dataverse/DVFeedback";

type RouteParams = {
  step2A_id: string;
};

const step2Name = {
  [STEPS.CONSIDERABLE]: "considerable" as keyof Scenarios,
  [STEPS.MAJOR]: "major" as keyof Scenarios,
  [STEPS.EXTREME]: "extreme" as keyof Scenarios,
};

const transitionDelay = 1000;

const DRAWER_WIDTH = 360;

export default function Step2APage() {
  const { t } = useTranslation();
  const routeParams = useParams() as RouteParams;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const api = useAPI();
  const { user } = useOutletContext<AuthPageContext>();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [fade, setFade] = useState(true);
  const [activeStep, setActiveStep] = useState<STEPS | null>(null);
  const [currentStep, setCurrentStep] = useState(STEPS.INTRODUCTION);

  const [finishedDialogOpen, setFinishedDialogOpen] = useState(false);
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);

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
        query: `$filter=_cr4de_effect_hazard_value eq ${step2A._cr4de_risk_file_value}&$expand=cr4de_cause_hazard($select=cr4de_title)`,
      });
      loadEffects({
        query: `$filter=_cr4de_cause_hazard_value eq ${step2A._cr4de_risk_file_value}&$expand=cr4de_effect_hazard($select=cr4de_title)`,
      });

      inputRef.current = {
        considerable: getScenarioInputs(step2A, "considerable"),
        major: getScenarioInputs(step2A, "major"),
        extreme: getScenarioInputs(step2A, "extreme"),
      };
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
        [STEPS.CONSIDERABLE]: validateScenarioInputs(inputRef.current.considerable),
        [STEPS.MAJOR]: validateScenarioInputs(inputRef.current.major),
        [STEPS.EXTREME]: validateScenarioInputs(inputRef.current.extreme),
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
        const errors = validateScenarioInputs(inputRef.current[step2Name[activeStep]]);

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
        <SavingOverlay visible={isSaving} drawerWidth={drawerWidth} />
        <Fade in={fade} timeout={transitionDelay}>
          <Box sx={{ mt: 6, mb: 16 }}>
            {activeStep === null && (
              <Box sx={{ mt: 32, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            )}
            {activeStep === STEPS.INTRODUCTION && (
              <>
                <Box style={{ marginRight: drawerWidth, position: "relative" }}>
                  <Box sx={{ mb: 2, ml: 1 }}>
                    <Typography variant="h5">
                      <Trans i18nKey="2A.introduction.title">Introduction</Trans>
                    </Typography>
                  </Box>
                  <Stack sx={{ mb: 4, ml: 1 }} rowGap={2}>
                    <Typography variant="body2">
                      <Trans i18nKey="2A.introduction.info.1">Explanation about step 2A</Trans>
                    </Typography>
                  </Stack>
                </Box>
              </>
            )}
            {activeStep === STEPS.CONSIDERABLE && step2A?.cr4de_risk_file && (
              <Box>
                <Box sx={{ mb: 2, ml: 1 }}>
                  <Typography variant="h4">
                    <Trans i18nKey="2A.considerable.title">Considerable Scenario</Trans>
                  </Typography>
                </Box>
                <ScenarioAnalysis
                  step={stepNames[STEPS.CONSIDERABLE]}
                  riskFile={step2A.cr4de_risk_file}
                  directAnalysis={step2A}
                  scenarioName="considerable"
                  inputRef={inputRef}
                  inputErrors={inputErrors[STEPS.CONSIDERABLE]}
                />
              </Box>
            )}
            {activeStep === STEPS.MAJOR && step2A?.cr4de_risk_file && (
              <Box>
                <Box sx={{ mb: 2, ml: 1 }}>
                  <Typography variant="h4">
                    <Trans i18nKey="2A.major.title">Major Scenario</Trans>
                  </Typography>
                </Box>
                <ScenarioAnalysis
                  step={stepNames[STEPS.MAJOR]}
                  riskFile={step2A.cr4de_risk_file}
                  directAnalysis={step2A}
                  scenarioName="major"
                  inputRef={inputRef}
                  inputErrors={inputErrors[STEPS.MAJOR]}
                />
              </Box>
            )}
            {activeStep === STEPS.EXTREME && step2A?.cr4de_risk_file && (
              <Box>
                <Box sx={{ mb: 2, ml: 1 }}>
                  <Typography variant="h4">
                    <Trans i18nKey="2A.extreme.title">Extreme Scenario</Trans>
                  </Typography>
                </Box>
                <ScenarioAnalysis
                  step={stepNames[STEPS.EXTREME]}
                  riskFile={step2A.cr4de_risk_file}
                  directAnalysis={step2A}
                  scenarioName="extreme"
                  inputRef={inputRef}
                  inputErrors={inputErrors[STEPS.EXTREME]}
                />
              </Box>
            )}
            {inputRef.current && activeStep === STEPS.REVIEW && step2A && (
              <Box>
                <Box sx={{ mb: 2, ml: 1 }}>
                  <Typography variant="h4">
                    <Trans i18nKey="2A.review.title">Review your answers</Trans>
                  </Typography>
                </Box>
                <Review inputs={inputRef.current} inputErrors={inputErrors} />
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
      <InformationButton riskFile={step2A?.cr4de_risk_file} />
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
          setCurrentStep={setCurrentStep}
        />

        {activeStep !== STEPS.REVIEW && (
          <Button id="next-button" disabled={isSaving} color="primary" sx={{ mr: 1 }} onClick={next}>
            <Trans i18nKey="button.next">Next</Trans>
          </Button>
        )}
        <Button
          id="next-button"
          disabled={isSaving}
          color="primary"
          sx={{ mr: 1 }}
          onClick={() => setFinishedDialogOpen(true)}
        >
          <Trans i18nKey="button.saveandexit">Save & exit</Trans>
        </Button>
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
                    api.updateParticipant(participants[0].cr4de_bnraparticipationid, {
                      cr4de_direct_analysis_finished: true,
                      cr4de_direct_analysis_finished_on: new Date(),
                    });
                    api.finishStep(step2A._cr4de_risk_file_value, user.contactid, "2A");
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
