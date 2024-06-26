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
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
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
import { CCInput } from "./standard/ClimateChangeAnalysis";
import ManMade from "./manmade/ManMade";
import Emerging from "./emerging/Emerging";

type RouteParams = {
  step2A_id: string;
};

const transitionDelay = 500;

export default function ({}) {
  // const { t } = useTranslation();
  // const { user } = useOutletContext<AuthPageContext>();
  // const routeParams = useParams() as RouteParams;
  // const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();
  // const api = useAPI();

  // const [isSaving, setIsSaving] = useState(false);
  // const [saveError, setSaveError] = useState(false);
  // const [fadeIn, setFadeIn] = useState(true);
  // const [activeStep, setActiveStep] = useState<STEPS | null>(null);
  // const [cascadeIndex, setCascadeIndex] = useState(parseInt(searchParams.get("index") || "0", 10));
  // const [activeCauseScenario, setActiveCauseScenario] = useState(SCENARIOS.CONSIDERABLE);
  // const [activeEffectScenario, setActiveEffectScenario] = useState(SCENARIOS.CONSIDERABLE);

  // const [causes, setCauses] = useState<DVRiskCascade<DVRiskFile, DVRiskFile>[] | null>(null);
  // const [catalysingEffects, setCatalysingEffects] = useState<DVRiskCascade<DVRiskFile, DVRiskFile>[] | null>(null);
  // const [climateChange, setClimateChange] = useState<DVRiskCascade<DVRiskFile, DVRiskFile> | null>(null);
  // const [effects, setEffects] = useState<DVRiskCascade<DVRiskFile, DVRiskFile>[] | null>(null);
  // const [cascade, setCascade] = useState<DVRiskCascade<DVRiskFile, DVRiskFile> | null>(null);
  // const [cascadeAnalysis, setCascadeAnalysis] = useState<DVCascadeAnalysis | null>(null);

  // const step2AInput = useRef<CCInput | null>(null);
  // const step2BInput = useRef<CascadeAnalysisInput | null>(null);
  // const [inputErrors, setInputErrors] = useState<Step2BErrors | null>(null);
  // const [qualiError, setQualiError] = useState(false);
  // const [ccErrors, setCCErrors] = useState<boolean[] | null>(null);

  // const [finishedDialogOpen, setFinishedDialogOpen] = useState(false);
  // const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  // const [runTutorial, setRunTutorial] = useState(false);
  // const [openSpeedDial, setOpenSpeedDial] = useState(false);
  // const [quickNavOpen, setQuickNavOpen] = useState(OPEN_STATE.CLOSED);
  // const [, forceUpdate] = useReducer((x) => x + 1, 0);

  // /**
  //  * Retrieve the direct analysis record from the database that is defined in the page url when the page loads
  //  */
  // const { data: step2A } = useRecord<DVDirectAnalysis<DVRiskFile>>({
  //   table: DataTable.DIRECT_ANALYSIS,
  //   id: routeParams.step2A_id,
  //   query: "$expand=cr4de_risk_file",
  //   onComplete: async (step2A) => {
  //     step2AInput.current = {
  //       cr4de_dp50_quanti_c: step2A.cr4de_dp50_quanti_c,
  //       cr4de_dp50_quanti_m: step2A.cr4de_dp50_quanti_m,
  //       cr4de_dp50_quanti_e: step2A.cr4de_dp50_quanti_e,
  //       cr4de_dp50_quali: step2A.cr4de_dp50_quali,
  //     };
  //     loadCascades({
  //       query: `$filter=_cr4de_cause_hazard_value eq ${step2A._cr4de_risk_file_value} or _cr4de_effect_hazard_value eq ${step2A._cr4de_risk_file_value}&$expand=cr4de_cause_hazard,cr4de_effect_hazard`,
  //     });
  //     load2B({
  //       query: `$orderby=createdon&$filter=_cr4de_expert_value eq ${user?.contactid} and _cr4de_risk_file_value eq ${step2A._cr4de_risk_file_value}`,
  //       saveOptions: true,
  //     });
  //   },
  // });

  // const riskType = step2A?.cr4de_risk_file.cr4de_risk_type;

  // const {
  //   data: cascades,
  //   loading: loadingCascades,
  //   getData: loadCascades,
  // } = useLazyRecords<DVRiskCascade<DVRiskFile, DVRiskFile>>({
  //   table: DataTable.RISK_CASCADE,
  //   transformResult: (result: DVRiskCascade<DVRiskFile, DVRiskFile>[]) => {
  //     return result.sort((a, b) => {
  //       if (a.cr4de_cause_hazard.cr4de_subjective_importance !== b.cr4de_cause_hazard.cr4de_subjective_importance) {
  //         return a.cr4de_cause_hazard.cr4de_subjective_importance - b.cr4de_cause_hazard.cr4de_subjective_importance;
  //       }
  //       return a.cr4de_cause_hazard.cr4de_hazard_id.localeCompare(b.cr4de_cause_hazard.cr4de_hazard_id);
  //     });
  //   },
  // });

  // /**
  //  * Retrieve the cascade analysis record from the database that corresponds to the participant
  //  */
  // const { data: step2B, getData: load2B } = useLazyRecords<DVCascadeAnalysis>({
  //   table: DataTable.CASCADE_ANALYSIS,
  //   onComplete: async (results) => {
  //     if (cascadeIndex && causes !== null && catalysingEffects !== null && effects !== null) {
  //       let iCascade: DVRiskCascade<DVRiskFile, DVRiskFile> | null = null;

  //       if (activeStep === STEPS.CAUSES && riskType === RISK_TYPE.STANDARD) iCascade = causes && causes[cascadeIndex];
  //       else if (activeStep === STEPS.CAUSES) iCascade = effects && effects[cascadeIndex];
  //       else if (activeStep === STEPS.CATALYSING_EFFECTS)
  //         iCascade = catalysingEffects && catalysingEffects[cascadeIndex];

  //       let iCascadeAnalysis = results.find(
  //         (s) => iCascade && s._cr4de_cascade_value === iCascade.cr4de_bnrariskcascadeid
  //       );
  //       if (iCascadeAnalysis) setCascadeAnalysis(iCascadeAnalysis);
  //     }
  //   },
  // });

  // const findOrCreateCascadeAnalysis = async function (iCascade: DVRiskCascade<DVRiskFile>) {
  //   if (step2A && step2B) {
  //     let iCascadeAnalysis = step2B.find(
  //       (s) => iCascade && s._cr4de_cascade_value === iCascade.cr4de_bnrariskcascadeid
  //     );

  //     if (!iCascadeAnalysis) {
  //       await api.createCascadeAnalysis({
  //         "cr4de_expert@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
  //         "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${step2A._cr4de_risk_file_value})`,
  //         "cr4de_cascade@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnrariskcascades(${iCascade.cr4de_bnrariskcascadeid})`,
  //       });

  //       await load2B();

  //       iCascadeAnalysis = step2B.find((s) => iCascade && s._cr4de_cascade_value === iCascade.cr4de_bnrariskcascadeid);
  //     }

  //     return iCascadeAnalysis || null;
  //   }

  //   return null;
  // };

  // const updateStep2BInput = async function (iCascade: DVRiskCascade<DVRiskFile>) {
  //   const iCascadeAnalysis = await findOrCreateCascadeAnalysis(iCascade);

  //   if (iCascadeAnalysis) {
  //     setCascadeAnalysis(iCascadeAnalysis);
  //     step2BInput.current = getCascadeInput(iCascadeAnalysis);
  //   }
  // };

  // const hasNextStep = () => {
  //   const hasCatalysing = catalysingEffects && catalysingEffects.length > 0;
  //   const hasClimateChange = Boolean(climateChange);
  //   const hasCauses = causes && causes.length > 0;
  //   const hasEffects = effects && effects.length > 0;

  //   if (riskType === "Standard Risk") {
  //     if (activeStep === STEPS.INTRODUCTION) {
  //       return hasCauses || hasClimateChange || hasCatalysing;
  //     } else if (activeStep === STEPS.CAUSES) {
  //       if (hasClimateChange || hasCatalysing) return true;

  //       if (causes && cascadeIndex < causes?.length - 1) return true;

  //       return activeCauseScenario !== SCENARIOS.EXTREME || activeEffectScenario !== SCENARIOS.EXTREME;
  //     } else if (activeStep === STEPS.CLIMATE_CHANGE) {
  //       return hasCatalysing;
  //     }
  //     return false;
  //   } else if (riskType === "Malicious Man-made Risk") {
  //     if (activeStep === STEPS.INTRODUCTION) {
  //       return hasEffects || hasClimateChange || hasCatalysing;
  //     } else if (activeStep === STEPS.CAUSES) {
  //       if (hasClimateChange || hasCatalysing) return true;

  //       if (effects && cascadeIndex < effects?.length - 1) return true;

  //       return activeCauseScenario !== SCENARIOS.EXTREME || activeEffectScenario !== SCENARIOS.EXTREME;
  //     } else if (activeStep === STEPS.CLIMATE_CHANGE) {
  //       return hasCatalysing;
  //     }
  //     return false;
  //   } else if (riskType === "Emerging Risk") {
  //     if (activeStep === STEPS.INTRODUCTION) {
  //       return hasEffects;
  //     }
  //     return false;
  //   }

  //   return false;
  // };

  // // Split the cascades into causes and catalyzing effects
  // // Set the current viewed cascade based on the "Active Step" and "Cascade Index" parameters (initialized by URL)
  // useEffect(() => {
  //   if (cascades && step2A) {
  //     const iCauses = cascades.filter(
  //       (c) =>
  //         c._cr4de_effect_hazard_value === step2A._cr4de_risk_file_value &&
  //         c.cr4de_cause_hazard.cr4de_risk_type !== "Emerging Risk"
  //     );
  //     const iCatalysingEffects = cascades.filter(
  //       (c) =>
  //         c._cr4de_effect_hazard_value === step2A._cr4de_risk_file_value &&
  //         c.cr4de_cause_hazard.cr4de_risk_type === "Emerging Risk" &&
  //         c.cr4de_cause_hazard.cr4de_title.indexOf("Climate Change") < 0
  //     );
  //     const iClimateChange = cascades.find(
  //       (c) =>
  //         c._cr4de_effect_hazard_value === step2A?._cr4de_risk_file_value &&
  //         c.cr4de_cause_hazard.cr4de_title.indexOf("Climate Change") >= 0
  //     );
  //     const iEffects = cascades.filter((c) => c._cr4de_cause_hazard_value === step2A?._cr4de_risk_file_value);

  //     setCauses(iCauses);
  //     setCatalysingEffects(iCatalysingEffects);
  //     setClimateChange(iClimateChange || null);
  //     setEffects(iEffects);
  //   }
  // }, [cascades]);

  // useEffect(() => {
  //   let iCascade: DVRiskCascade<DVRiskFile, DVRiskFile> | null = null;

  //   if (activeStep === STEPS.CAUSES && riskType === RISK_TYPE.STANDARD) iCascade = causes && causes[cascadeIndex];
  //   else if (activeStep === STEPS.CAUSES) iCascade = effects && effects[cascadeIndex];
  //   else if (climateChange && activeStep === STEPS.CLIMATE_CHANGE && climateChange) iCascade = climateChange;
  //   else if (catalysingEffects && activeStep === STEPS.CATALYSING_EFFECTS) iCascade = catalysingEffects[cascadeIndex];

  //   setCascade(iCascade);

  //   if (iCascade) {
  //     updateStep2BInput(iCascade);
  //   }
  // }, [causes, effects, climateChange, catalysingEffects, cascadeIndex, activeStep, step2A, step2B]);

  // async function handleSave() {
  //   if (activeStep === STEPS.CAUSES || activeStep === STEPS.CATALYSING_EFFECTS) {
  //     if (!cascadeAnalysis || !step2BInput.current) return;

  //     api
  //       .updateCascadeAnalysis(cascadeAnalysis.cr4de_bnracascadeanalysisid, {
  //         cr4de_c2c: step2BInput.current.cr4de_c2c != null ? `CP${step2BInput.current.cr4de_c2c}` : null,
  //         cr4de_c2m: step2BInput.current.cr4de_c2m != null ? `CP${step2BInput.current.cr4de_c2m}` : null,
  //         cr4de_c2e: step2BInput.current.cr4de_c2e != null ? `CP${step2BInput.current.cr4de_c2e}` : null,
  //         cr4de_m2c: step2BInput.current.cr4de_m2c != null ? `CP${step2BInput.current.cr4de_m2c}` : null,
  //         cr4de_m2m: step2BInput.current.cr4de_m2m != null ? `CP${step2BInput.current.cr4de_m2m}` : null,
  //         cr4de_m2e: step2BInput.current.cr4de_m2e != null ? `CP${step2BInput.current.cr4de_m2e}` : null,
  //         cr4de_e2c: step2BInput.current.cr4de_e2c != null ? `CP${step2BInput.current.cr4de_e2c}` : null,
  //         cr4de_e2m: step2BInput.current.cr4de_e2m != null ? `CP${step2BInput.current.cr4de_e2m}` : null,
  //         cr4de_e2e: step2BInput.current.cr4de_e2e != null ? `CP${step2BInput.current.cr4de_e2e}` : null,
  //         cr4de_quali_cascade:
  //           !step2BInput.current.cr4de_quali_cascade || step2BInput.current.cr4de_quali_cascade === null
  //             ? null
  //             : step2BInput.current.cr4de_quali_cascade,
  //       })
  //       .then(() => load2B());
  //   } else if (activeStep === STEPS.CLIMATE_CHANGE) {
  //     if (!climateChange || !step2A || !step2AInput.current) return;

  //     api.updateDirectAnalysis(step2A?.cr4de_bnradirectanalysisid, {
  //       cr4de_dp50_quanti_c: step2AInput.current.cr4de_dp50_quanti_c,
  //       cr4de_dp50_quanti_m: step2AInput.current.cr4de_dp50_quanti_m,
  //       cr4de_dp50_quanti_e: step2AInput.current.cr4de_dp50_quanti_e,
  //       cr4de_dp50_quali: step2AInput.current.cr4de_dp50_quali,
  //     });
  //   }
  // }

  // const handleTransitionTo = (newStep: STEPS, newIndex: number = 0, forceFadeIn = false) => {
  //   setFadeIn(false);

  //   if (activeStep !== newStep || newIndex !== cascadeIndex) {
  //     handleChangeCascade(newStep, newIndex);
  //   }

  //   const timer = setTimeout(() => {
  //     setActiveStep(newStep);
  //     setIsSaving(false);
  //     window.scrollTo(0, 0);
  //     setSearchParams({
  //       step: newStep.toString(),
  //       ...(newStep === STEPS.CAUSES || newStep === STEPS.CATALYSING_EFFECTS ? { index: newIndex.toString() } : {}),
  //     });

  //     if (forceFadeIn) setFadeIn(true);
  //   }, transitionDelay);

  //   return () => clearTimeout(timer);
  // };

  // const finish = () => {};

  // const handleNext = async () => {
  //   if (!step2B || causes === null || effects === null || catalysingEffects === null) return;

  //   setQualiError(false);
  //   setCCErrors(null);

  //   if (activeStep === STEPS.INTRODUCTION) {
  //     if (riskType === RISK_TYPE.STANDARD && causes && causes.length > 0) {
  //       setCascadeAnalysis(await findOrCreateCascadeAnalysis(causes[0]));

  //       handleTransitionTo(STEPS.CAUSES);
  //     } else if ((riskType === RISK_TYPE.MANMADE || riskType === RISK_TYPE.EMERGING) && effects && effects.length > 0) {
  //       setCascadeAnalysis(await findOrCreateCascadeAnalysis(effects[0]));

  //       handleTransitionTo(STEPS.CAUSES);
  //     } else if ((riskType === RISK_TYPE.STANDARD || riskType === RISK_TYPE.MANMADE) && climateChange) {
  //       setCascadeAnalysis(await findOrCreateCascadeAnalysis(climateChange));

  //       handleTransitionTo(STEPS.CLIMATE_CHANGE);
  //     } else if (
  //       (riskType === RISK_TYPE.STANDARD || riskType === RISK_TYPE.MANMADE) &&
  //       catalysingEffects &&
  //       catalysingEffects.length > 0
  //     ) {
  //       setCascadeAnalysis(await findOrCreateCascadeAnalysis(catalysingEffects[0]));

  //       handleTransitionTo(STEPS.CATALYSING_EFFECTS);
  //     } else {
  //       finish();
  //     }
  //   } else if (activeStep === STEPS.CAUSES) {
  //     handleSave();

  //     if (!handleNextCascadeScenario()) {
  //       if (step2BInput.current?.cr4de_quali_cascade === null || step2BInput.current?.cr4de_quali_cascade === "") {
  //         setQualiError(true);

  //         return;
  //       }

  //       const nextCascadeIndex = cascadeIndex + 1;

  //       if (riskType === RISK_TYPE.STANDARD) {
  //         if (nextCascadeIndex >= causes.length) {
  //           if (climateChange) {
  //             setCascadeAnalysis(await findOrCreateCascadeAnalysis(climateChange));

  //             handleTransitionTo(STEPS.CLIMATE_CHANGE);
  //           } else if (catalysingEffects && catalysingEffects.length > 0) {
  //             setCascadeAnalysis(await findOrCreateCascadeAnalysis(catalysingEffects[0]));

  //             setCascadeIndex(0);
  //             handleTransitionTo(STEPS.CATALYSING_EFFECTS);
  //           } else {
  //             finish();
  //           }
  //         } else {
  //           handleChangeCascade(activeStep, nextCascadeIndex);
  //         }
  //       } else if (riskType === RISK_TYPE.MANMADE || riskType === RISK_TYPE.EMERGING) {
  //         if (nextCascadeIndex >= effects.length) {
  //           if (riskType === RISK_TYPE.MANMADE && climateChange) {
  //             setCascadeAnalysis(await findOrCreateCascadeAnalysis(climateChange));

  //             handleTransitionTo(STEPS.CLIMATE_CHANGE);
  //           } else if (riskType === RISK_TYPE.MANMADE && catalysingEffects && catalysingEffects.length > 0) {
  //             setCascadeAnalysis(await findOrCreateCascadeAnalysis(catalysingEffects[0]));

  //             setCascadeIndex(0);
  //             handleTransitionTo(STEPS.CATALYSING_EFFECTS);
  //           } else {
  //             finish();
  //           }
  //         } else {
  //           handleChangeCascade(activeStep, nextCascadeIndex);
  //         }
  //       }
  //     } else {
  //       document.getElementById("cascade-title")?.scrollIntoView({ behavior: "smooth" });
  //     }
  //   } else if (activeStep === STEPS.CLIMATE_CHANGE) {
  //     handleSave();

  //     if (
  //       step2AInput.current &&
  //       (step2AInput.current.cr4de_dp50_quanti_c === null ||
  //         step2AInput.current.cr4de_dp50_quanti_m === null ||
  //         step2AInput.current.cr4de_dp50_quanti_e === null)
  //     ) {
  //       setCCErrors([
  //         step2AInput.current.cr4de_dp50_quanti_c === null,
  //         step2AInput.current.cr4de_dp50_quanti_m === null,
  //         step2AInput.current.cr4de_dp50_quanti_e === null,
  //       ]);

  //       return;
  //     }

  //     if (
  //       step2AInput.current === null ||
  //       step2AInput.current.cr4de_dp50_quali === null ||
  //       step2AInput.current.cr4de_dp50_quali === ""
  //     ) {
  //       setQualiError(true);

  //       return;
  //     }

  //     if (
  //       (riskType === RISK_TYPE.STANDARD || riskType === RISK_TYPE.MANMADE) &&
  //       catalysingEffects &&
  //       catalysingEffects.length > 0
  //     ) {
  //       setCascadeAnalysis(await findOrCreateCascadeAnalysis(catalysingEffects[0]));

  //       setCascadeIndex(0);
  //       handleTransitionTo(STEPS.CATALYSING_EFFECTS);
  //     } else {
  //       finish();
  //     }
  //   } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
  //     handleSave();

  //     if (step2BInput.current?.cr4de_quali_cascade === null || step2BInput.current?.cr4de_quali_cascade === "") {
  //       setQualiError(true);

  //       return;
  //     }

  //     const nextCascadeIndex = cascadeIndex + 1;

  //     if (nextCascadeIndex >= catalysingEffects.length) {
  //       finish();
  //     } else {
  //       handleChangeCascade(activeStep, nextCascadeIndex);
  //     }
  //   }
  // };

  // const handlePrevious = async () => {
  //   if (!step2B || causes === null || effects === null || catalysingEffects === null) return;

  //   if (activeStep === STEPS.CAUSES) {
  //     handleSave();

  //     if (!handlePreviousCascadeScenario()) {
  //       const previousCascadeIndex = cascadeIndex - 1;

  //       if (previousCascadeIndex < 0) {
  //         handleTransitionTo(STEPS.INTRODUCTION);
  //       } else {
  //         handleChangeCascade(activeStep, previousCascadeIndex);
  //       }
  //     } else {
  //       document.getElementById("cascade-title")?.scrollIntoView({ behavior: "smooth" });
  //     }
  //   } else if (activeStep === STEPS.CLIMATE_CHANGE) {
  //     handleSave();

  //     if (riskType === RISK_TYPE.STANDARD && causes && causes.length > 0) {
  //       setCascadeAnalysis(await findOrCreateCascadeAnalysis(causes[causes.length - 1]));

  //       handleTransitionTo(STEPS.CAUSES, causes.length - 1);
  //     } else if ((riskType === RISK_TYPE.MANMADE || riskType === RISK_TYPE.EMERGING) && effects && effects.length > 0) {
  //       setCascadeAnalysis(await findOrCreateCascadeAnalysis(effects[effects.length - 1]));

  //       handleTransitionTo(STEPS.CAUSES, effects.length - 1);
  //     } else {
  //       handleTransitionTo(STEPS.INTRODUCTION);
  //     }
  //   } else if (activeStep === STEPS.CATALYSING_EFFECTS) {
  //     handleSave();

  //     const previousCascadeIndex = cascadeIndex - 1;

  //     if (previousCascadeIndex < 0) {
  //       if ((riskType === RISK_TYPE.STANDARD || riskType === RISK_TYPE.MANMADE) && climateChange) {
  //         setCascadeAnalysis(await findOrCreateCascadeAnalysis(climateChange));

  //         handleTransitionTo(STEPS.CLIMATE_CHANGE);
  //       } else if (riskType === RISK_TYPE.STANDARD && causes && causes.length > 0) {
  //         setCascadeAnalysis(await findOrCreateCascadeAnalysis(causes[causes.length - 1]));

  //         handleTransitionTo(STEPS.CAUSES, causes.length - 1);
  //       } else if (
  //         (riskType === RISK_TYPE.MANMADE || riskType === RISK_TYPE.EMERGING) &&
  //         effects &&
  //         effects.length > 0
  //       ) {
  //         setCascadeAnalysis(await findOrCreateCascadeAnalysis(effects[effects.length - 1]));

  //         handleTransitionTo(STEPS.CAUSES, effects.length - 1);
  //       } else {
  //         handleTransitionTo(STEPS.INTRODUCTION);
  //       }
  //     } else {
  //       handleChangeCascade(activeStep, previousCascadeIndex);
  //     }
  //   }
  // };

  // function handleNextCascadeScenario(): Boolean {
  //   if (activeCauseScenario === SCENARIOS.EXTREME) {
  //     if (activeEffectScenario === SCENARIOS.CONSIDERABLE) {
  //       setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
  //       setActiveEffectScenario(SCENARIOS.MAJOR);
  //     } else if (activeEffectScenario === SCENARIOS.MAJOR) {
  //       setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
  //       setActiveEffectScenario(SCENARIOS.EXTREME);
  //     } else {
  //       return false;
  //     }
  //   } else if (activeCauseScenario === SCENARIOS.CONSIDERABLE) {
  //     setActiveCauseScenario(SCENARIOS.MAJOR);
  //   } else {
  //     setActiveCauseScenario(SCENARIOS.EXTREME);
  //   }

  //   return true;
  // }

  // function handlePreviousCascadeScenario() {
  //   if (activeCauseScenario === SCENARIOS.CONSIDERABLE) {
  //     if (activeEffectScenario === SCENARIOS.MAJOR) {
  //       setActiveCauseScenario(SCENARIOS.EXTREME);
  //       setActiveEffectScenario(SCENARIOS.CONSIDERABLE);
  //     } else if (activeEffectScenario === SCENARIOS.EXTREME) {
  //       setActiveCauseScenario(SCENARIOS.EXTREME);
  //       setActiveEffectScenario(SCENARIOS.MAJOR);
  //     } else {
  //       return false;
  //     }
  //   } else if (activeCauseScenario === SCENARIOS.MAJOR) {
  //     setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
  //   } else {
  //     setActiveCauseScenario(SCENARIOS.MAJOR);
  //   }

  //   return true;
  // }

  // const handleChangeScenario = (causeScenario: SCENARIOS | null, effectScenario: SCENARIOS | null) => {
  //   if (causeScenario) setActiveCauseScenario(causeScenario);
  //   if (effectScenario) setActiveEffectScenario(effectScenario);
  // };

  // const handleChangeCascade = (newStep: STEPS, newCascadeIndex: number) => {
  //   let newCascade: DVRiskCascade<DVRiskFile, DVRiskFile> | null = null;

  //   if (newStep === STEPS.CAUSES && riskType === RISK_TYPE.STANDARD) newCascade = causes && causes[newCascadeIndex];
  //   else if (newStep === STEPS.CAUSES) newCascade = effects && effects[newCascadeIndex];
  //   if (newStep === STEPS.CLIMATE_CHANGE) newCascade = climateChange;
  //   if (newStep === STEPS.CATALYSING_EFFECTS) newCascade = catalysingEffects && catalysingEffects[newCascadeIndex];
  //   console.log(newCascade, effects);
  //   if (!newCascade) return;

  //   setFadeIn(false);

  //   setSearchParams({
  //     step: searchParams.get("step") || STEPS.CAUSES.toString(),
  //     index: newCascadeIndex.toString(),
  //   });

  //   // window.scroll({ top: 0, left: 0, behavior: "smooth" });

  //   setTimeout(async () => {
  //     setIsSaving(true);
  //     setCascadeIndex(newCascadeIndex);
  //     setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
  //     setActiveEffectScenario(SCENARIOS.CONSIDERABLE);

  //     if (newCascade) await updateStep2BInput(newCascade);

  //     setIsSaving(false);
  //   }, transitionDelay);
  // };

  // // Transition to the step in the URL parameters after first loading the page
  // useEffect(() => {
  //   if (activeStep === null) {
  //     const searchParamStep = searchParams.get("step");

  //     if (searchParamStep && parseInt(searchParamStep, 10) in STEPS) {
  //       handleTransitionTo(parseInt(searchParamStep, 10) as STEPS, undefined, true);
  //     } else handleTransitionTo(STEPS.INTRODUCTION, undefined, true);
  //   }
  // }, [activeStep]);

  // // useEffect(() => {
  // //   const searchParamStep = searchParams.get("step");
  // //   const searchParamIndex = searchParams.get("index");

  // //   if (activeStep && searchParamStep && parseInt(searchParamStep, 10) !== activeStep) {
  // //     console.log("useEffect A");
  // //     handleTransitionTo(
  // //       parseInt(searchParamStep, 10) as STEPS,
  // //       searchParamIndex ? parseInt(searchParamIndex, 10) : undefined
  // //     );
  // //   } else if (cascadeIndex !== null && searchParamIndex && parseInt(searchParamIndex, 10) !== cascadeIndex) {
  // //     console.log("useEffect B");
  // //     handleChangeCascade(parseInt(searchParamIndex, 10));
  // //   }
  // // }, [searchParams]);

  // // Auto-save after 10s of inactivity
  // useEffect(() => {
  //   const autosaveTimer = setTimeout(() => {
  //     handleSave();
  //   }, 10000);

  //   return () => clearTimeout(autosaveTimer);
  // }, []);

  // useEffect(() => {
  //   if (fadeIn) {
  //     window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  //   }
  // }, [fadeIn]);

  // usePageTitle(t("step2B.pageTitle", "BNRA 2023 - 2026 Risk Analysis B"));
  // useBreadcrumbs([
  //   { name: t("bnra.shortName"), url: "/" },
  //   { name: t("step2B.breadcrumb", "Risk Analysis B"), url: "/overview" },
  //   step2A ? { name: step2A.cr4de_risk_file?.cr4de_title, url: "" } : null,
  // ]);

  return (
    <>
      {/* <Container sx={{ position: "relative" }}>
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
          {step2A && riskType === RISK_TYPE.STANDARD && (
            <Standard
              activeStep={activeStep}
              causes={causes}
              catalysingEffects={catalysingEffects}
              climateChange={climateChange}
              cascade={cascade}
              cascadeIndex={cascadeIndex}
              step2A={step2A}
              step2B={cascadeAnalysis}
              step2AInput={step2AInput.current}
              step2BInput={step2BInput.current}
              activeCauseScenario={activeCauseScenario}
              activeEffectScenario={activeEffectScenario}
              qualiError={qualiError}
              quantiErrors={ccErrors}
              runTutorial={runTutorial}
              visible={fadeIn}
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
          {step2A && riskType === RISK_TYPE.MANMADE && (
            <ManMade
              activeStep={activeStep}
              effects={effects}
              catalysingEffects={catalysingEffects}
              climateChange={climateChange}
              cascade={cascade}
              cascadeIndex={cascadeIndex}
              step2A={step2A}
              step2B={cascadeAnalysis}
              step2AInput={step2AInput.current}
              step2BInput={step2BInput.current}
              activeCauseScenario={activeCauseScenario}
              activeEffectScenario={activeEffectScenario}
              qualiError={qualiError}
              quantiErrors={ccErrors}
              runTutorial={runTutorial}
              visible={fadeIn}
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

          {step2A && riskType === RISK_TYPE.EMERGING && (
            <Emerging
              activeStep={activeStep}
              effects={effects}
              catalysingEffects={catalysingEffects}
              climateChange={climateChange}
              cascade={cascade}
              cascadeIndex={cascadeIndex}
              step2A={step2A}
              step2B={cascadeAnalysis}
              step2AInput={step2AInput.current}
              step2BInput={step2BInput.current}
              activeCauseScenario={activeCauseScenario}
              activeEffectScenario={activeEffectScenario}
              qualiError={qualiError}
              quantiErrors={ccErrors}
              runTutorial={runTutorial}
              visible={fadeIn}
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
        activeStep={activeStep}
        riskFile={step2A?.cr4de_risk_file}
        forceOpen={openSpeedDial}
        onRunTutorial={() => setRunTutorial(true)}
      />

      {step2A && causes !== null && effects !== null && catalysingEffects !== null && (
        <QuickNavSidebar
          step2A={step2A}
          causes={riskType === RISK_TYPE.STANDARD ? causes : effects}
          climateChange={climateChange}
          catalysingEffects={catalysingEffects}
          hasCauses={activeStep === STEPS.CLIMATE_CHANGE}
          open={quickNavOpen}
          setOpen={setQuickNavOpen}
          onTransitionTo={handleTransitionTo}
        />
      )}

      <BottomBar
        step2A={step2A}
        causes={riskType === RISK_TYPE.STANDARD ? causes : effects}
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
          setCCErrors(null);

          if (!hasNextStep()) {
            if (activeStep === STEPS.CAUSES) {
              handleSave();

              if (
                step2BInput.current?.cr4de_quali_cascade === null ||
                step2BInput.current?.cr4de_quali_cascade === ""
              ) {
                setQualiError(true);

                return;
              }
            } else if (activeStep === STEPS.CLIMATE_CHANGE) {
              handleSave();

              if (
                step2AInput.current === null ||
                step2AInput.current.cr4de_dp50_quali === null ||
                step2AInput.current.cr4de_dp50_quali === ""
              ) {
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
          setInputErrors(
            validateStep2B(
              step2AInput.current,
              step2B,
              cascade,
              step2BInput.current,
              causes,
              climateChange,
              catalysingEffects
            )
          );
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
          onTransitionTo={handleTransitionTo}
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
      )} */}
    </>
  );
}
