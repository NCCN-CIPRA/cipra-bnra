import { useState, useEffect, useRef } from "react";
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
import { CascadeAnalysisInput, getCascadeInput } from "../../functions/cascades";

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
  const [fade, setFade] = useState(true);
  const [activeStep, setActiveStep] = useState<STEPS | null>(null);
  const [cascadeIndex, setCascadeIndex] = useState(parseInt(searchParams.get("index") || "1", 10) - 1);
  const [activeCauseScenario, setActiveCauseScenario] = useState(SCENARIOS.CONSIDERABLE);
  const [activeEffectScenario, setActiveEffectScenario] = useState(SCENARIOS.CONSIDERABLE);

  const [causes, setCauses] = useState<DVRiskCascade[] | null>(null);
  const [catalysingEffects, setCatalysingEffects] = useState<DVRiskCascade[] | null>(null);
  const [cascade, setCascade] = useState<DVRiskCascade<DVRiskFile> | null>(null);
  const [cascadeAnalysis, setCascadeAnalysis] = useState<DVCascadeAnalysis | null>(null);

  const step2BInput = useRef<CascadeAnalysisInput | null>(null);

  const [finishedDialogOpen, setFinishedDialogOpen] = useState(false);
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const [runTutorial, setRunTutorial] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);

  const {
    data: cascades,
    loading: loadingCascades,
    getData: loadCascades,
  } = useLazyRecords<DVRiskCascade<DVRiskFile>>({
    table: DataTable.RISK_CASCADE,
    transformResult: (result: DVRiskCascade<DVRiskFile>[]) => {
      return result.sort((a, b) => a.cr4de_cause_hazard.cr4de_title.localeCompare(b.cr4de_cause_hazard.cr4de_title));
    },
  });

  /**
   * Retrieve the participation record from the database that is defined in the page url when the page loads
   */
  const {
    data: step2B,
    loading: loading2B,
    getData: load2B,
  } = useLazyRecords<DVCascadeAnalysis>({
    table: DataTable.CASCADE_ANALYSIS,
  });

  /**
   * Retrieve the participation record from the database that is defined in the page url when the page loads
   */
  const { data: step2A } = useRecord<DVDirectAnalysis<DVRiskFile>>({
    table: DataTable.DIRECT_ANALYSIS,
    id: routeParams.step2A_id,
    query: "$expand=cr4de_risk_file",
    onComplete: async (step2A) => {
      loadCascades({
        query: `$filter=_cr4de_effect_hazard_value eq ${step2A._cr4de_risk_file_value}&$expand=cr4de_cause_hazard`,
      });
      load2B({
        query: `$filter=_cr4de_expert_value eq ${user?.contactid} and _cr4de_risk_file_value eq ${step2A._cr4de_risk_file_value}`,
      });
    },
  });

  useEffect(() => {
    if (cascades) {
      const iCauses = cascades && cascades.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type !== "Emerging Risk");
      const iCatalysingEffects =
        cascades && cascades.filter((c) => c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk");

      let iCascade: DVRiskCascade<DVRiskFile> | null = null;
      if (activeStep === STEPS.CAUSES) iCascade = iCauses && iCauses[cascadeIndex];
      else if (activeStep === STEPS.CATALYSING_EFFECTS)
        iCascade = iCatalysingEffects && iCatalysingEffects[cascadeIndex];

      setCauses(iCauses);
      setCatalysingEffects(iCatalysingEffects);
      setCascade(iCascade);

      if (step2B) {
        const iCascadeAnalysis = step2B.find(
          (s) => iCascade && s._cr4de_risk_file_value === iCascade._cr4de_effect_hazard_value
        );

        if (iCascadeAnalysis) {
          setCascadeAnalysis(iCascadeAnalysis);
          step2BInput.current = getCascadeInput(iCascadeAnalysis);
        }
      }
    }
  }, [cascades, cascadeIndex, activeStep, step2B]);

  async function handleSave() {
    if (!cascadeAnalysis || !step2BInput.current) return;

    api.updateCascadeAnalysis(cascadeAnalysis.cr4de_bnracascadeanalysisid, {
      cr4de_c2c: step2BInput.current.cr4de_c2c ? `CP${step2BInput.current.cr4de_c2c}` : null,
      cr4de_c2m: step2BInput.current.cr4de_c2m ? `CP${step2BInput.current.cr4de_c2m}` : null,
      cr4de_c2e: step2BInput.current.cr4de_c2e ? `CP${step2BInput.current.cr4de_c2e}` : null,
      cr4de_m2c: step2BInput.current.cr4de_m2c ? `CP${step2BInput.current.cr4de_m2c}` : null,
      cr4de_m2m: step2BInput.current.cr4de_m2m ? `CP${step2BInput.current.cr4de_m2m}` : null,
      cr4de_m2e: step2BInput.current.cr4de_m2e ? `CP${step2BInput.current.cr4de_m2e}` : null,
      cr4de_e2c: step2BInput.current.cr4de_e2c ? `CP${step2BInput.current.cr4de_e2c}` : null,
      cr4de_e2m: step2BInput.current.cr4de_e2m ? `CP${step2BInput.current.cr4de_e2m}` : null,
      cr4de_e2e: step2BInput.current.cr4de_e2e ? `CP${step2BInput.current.cr4de_e2e}` : null,
      cr4de_quali_cascade:
        !step2BInput.current.cr4de_quali_cascade || step2BInput.current.cr4de_quali_cascade === null
          ? null
          : step2BInput.current.cr4de_quali_cascade,
    });
  }

  usePageTitle(t("step2B.pageTitle", "BNRA 2023 - 2026 Risk Analysis B"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("step2B.breadcrumb", "Risk Analysis B"), url: "/overview" },
    step2A ? { name: step2A.cr4de_risk_file?.cr4de_title, url: "" } : null,
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
        ...(newStep === STEPS.CAUSES || newStep === STEPS.CATALYSING_EFFECTS ? { index: "1" } : {}),
      });
    }, transitionDelay);

    return () => clearTimeout(timer);
  };

  const next = async () => {
    if (!step2B || !causes) return;

    if (activeStep === STEPS.REVIEW) {
      //   const errors = {
      //     [STEPS.CONSIDERABLE]: validateScenarioInputs(
      //       inputRef.current.considerable,
      //       step2A?.cr4de_risk_file.cr4de_risk_type
      //     ),
      //     [STEPS.MAJOR]: validateScenarioInputs(inputRef.current.major, step2A?.cr4de_risk_file.cr4de_risk_type),
      //     [STEPS.EXTREME]: validateScenarioInputs(inputRef.current.extreme, step2A?.cr4de_risk_file.cr4de_risk_type),
      //   };

      //   if (Object.values(errors).some((e) => e.length > 0)) {
      //     setInputErrors(errors);

      //     window.scrollTo({
      //       top: 0,
      //       behavior: "smooth",
      //     });
      //   } else {
      setIsSaving(true);
      navigate("/overview");
      //   }
    } else if (activeStep === STEPS.INTRODUCTION) {
      if (!step2B.find((s) => s._cr4de_risk_file_value === causes[0]._cr4de_effect_hazard_value)) {
        await createCascadeAnalysis(causes[0]);
      }

      if (causes && causes.length > 0) {
        transitionTo(STEPS.CAUSES);
      } else if (catalysingEffects && catalysingEffects.length > 0) {
        transitionTo(STEPS.CATALYSING_EFFECTS);
      } else {
        transitionTo(STEPS.REVIEW);
      }
    } else if (activeStep === STEPS.CAUSES) {
      handleSave();

      if (!handleNextCascade()) {
        const nextCascadeIndex = cascadeIndex + 1;
        const nextCascade = causes[nextCascadeIndex];

        if (!nextCascade) {
          if (catalysingEffects && catalysingEffects.length > 0) {
            transitionTo(STEPS.CATALYSING_EFFECTS);
          } else {
            transitionTo(STEPS.REVIEW);
          }
        } else {
          if (!step2B.find((s) => s._cr4de_risk_file_value === nextCascade._cr4de_effect_hazard_value)) {
            await createCascadeAnalysis(nextCascade);
          }

          setCascadeIndex(nextCascadeIndex);
          setSearchParams({
            step: searchParams.get("step") || "1",
            index: (nextCascadeIndex + 1).toString(),
          });
        }
      }
    } else {
      transitionTo(STEPS.INTRODUCTION);
    }
  };

  const createCascadeAnalysis = async (cascade: DVRiskCascade) => {
    setIsLoading(true);

    await api.createCascadeAnalysis({
      "cr4de_expert@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
      "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${cascade._cr4de_effect_hazard_value})`,
      "cr4de_cascade@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${cascade.cr4de_bnrariskcascadeid})`,
    });

    await load2B();

    setIsLoading(false);
  };

  const previous = async () => {
    console.log(step2B, causes, catalysingEffects, activeStep);
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
        const previousCascadeIndex = cascadeIndex - 1;
        const previousCascade = causes[previousCascadeIndex];

        if (!previousCascade) {
          transitionTo(STEPS.INTRODUCTION);
        } else {
          if (!step2B.find((s) => s._cr4de_risk_file_value === previousCascade._cr4de_effect_hazard_value)) {
            await createCascadeAnalysis(previousCascade);
          }

          setCascadeIndex(previousCascadeIndex);
          setSearchParams({
            step: searchParams.get("step") || "1",
            index: (previousCascadeIndex + 1).toString(),
          });
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
        setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
        setActiveEffectScenario(SCENARIOS.CONSIDERABLE);

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
        setActiveCauseScenario(SCENARIOS.EXTREME);
        setActiveEffectScenario(SCENARIOS.EXTREME);

        return false;
      }
    } else if (activeCauseScenario === SCENARIOS.MAJOR) {
      setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
    } else {
      setActiveCauseScenario(SCENARIOS.MAJOR);
    }

    return true;
  }

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
      <Fade in={fade} timeout={transitionDelay}>
        <Box sx={{ mt: 6, mb: 16 }}>
          {!step2A && (
            <Box sx={{ mt: 32, textAlign: "center" }}>
              <CircularProgress />
            </Box>
          )}
          {step2A && step2A.cr4de_risk_file.cr4de_risk_type === "Standard Risk" && (
            <Standard
              activeStep={activeStep}
              cascade={cascade}
              cascadeIndex={cascadeIndex}
              step2A={step2A}
              step2B={cascadeAnalysis}
              step2BInput={step2BInput.current}
              activeCauseScenario={activeCauseScenario}
              activeEffectScenario={activeEffectScenario}
              setRunTutorial={setRunTutorial}
              setStep2BInput={(input) => (step2BInput.current = input)}
              onNext={next}
              onPrevious={previous}
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
