import { useState, useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
} from "@mui/material";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import Progress from "./information/Progress";
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

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [fade, setFade] = useState(true);
  const [step, setStep] = useState<STEPS | null>(null);

  const inputRef = useRef<ScenarioInputs | null>(null);
  const [inputErrors, setInputErrors] = useState<(keyof ScenarioInput)[]>([]);

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
      setStep(newStep);
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
    if (inputRef.current && step !== STEPS.INTRODUCTION && step !== STEPS.REVIEW && step !== null) {
      const errors = validateScenarioInputs(inputRef.current[step2Name[step]]);

      await handleSave(errors.length <= 0);
      console.log(errors);
      if (errors.length > 0) {
        setInputErrors(errors);
        window.scrollTo(0, 0);

        return;
      }
    }

    setInputErrors([]);

    if (step === STEPS.REVIEW) {
      navigate("/overview");
    } else {
      transitionTo(step !== null ? step + 1 : STEPS.INTRODUCTION);
    }
  };

  const previous = async () => {
    await handleSave();

    setInputErrors([]);

    if (step !== null && step !== STEPS.INTRODUCTION) {
      transitionTo(step - 1);
    }
  };

  useEffect(() => {
    if (step === null) {
      const searchParamStep = searchParams.get("step");
      if (searchParamStep && parseInt(searchParamStep, 10) in STEPS) {
        transitionTo(parseInt(searchParamStep, 10) as STEPS);
      } else transitionTo(STEPS.INTRODUCTION);
    }
  }, [step]);

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
            {step === null && (
              <Box sx={{ mt: 32, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            )}
            {step === STEPS.INTRODUCTION && (
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
            {step === STEPS.CONSIDERABLE && step2A?.cr4de_risk_file && (
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
                  inputErrors={inputErrors}
                />
              </Box>
            )}
            {step === STEPS.MAJOR && step2A?.cr4de_risk_file && (
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
                  inputErrors={inputErrors}
                />
              </Box>
            )}
            {step === STEPS.EXTREME && step2A?.cr4de_risk_file && (
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
                  inputErrors={inputErrors}
                />
              </Box>
            )}
            {inputRef.current && step === STEPS.REVIEW && step2A && (
              <Box>
                <Box sx={{ mb: 2, ml: 1 }}>
                  <Typography variant="h4">
                    <Trans i18nKey="2A.review.title">Review your answers</Trans>
                  </Typography>
                </Box>
                <Review inputs={inputRef.current} />
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

        <Progress currentStep={step || 0} goToStep={transitionTo} inputRef={inputRef} inputErrors={inputErrors} />

        {step === STEPS.REVIEW ? (
          <Button id="next-button" disabled={isSaving} color="primary" sx={{ mr: 1 }} onClick={next}>
            <Trans i18nKey="button.saveandexit">Save & exit</Trans>
          </Button>
        ) : (
          <Button id="next-button" disabled={isSaving} color="primary" sx={{ mr: 1 }} onClick={next}>
            <Trans i18nKey="button.next">Next</Trans>
          </Button>
        )}
      </Box>
    </>
  );
}
