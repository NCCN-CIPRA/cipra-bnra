import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Trans } from "react-i18next";
import { Scenarios } from "../../../functions/scenarios";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import Introduction from "./Introduction";
import Review from "./Review";
import ScenarioAnalysis from "./ScenarioAnalysis";
import { stepNames, STEPS } from "../Steps";
import { RefObject } from "react";
import { ScenarioInput, ScenarioInputs } from "../fields";
import { ScenarioErrors } from "../information/Progress";

export default function ManMade({
  activeStep,
  step2A,
  causes,
  effects,
  inputRef,
  inputErrors,
  setRunTutorial,
}: {
  activeStep: STEPS | null;
  step2A: DVDirectAnalysis<DVRiskFile> | null;
  causes: DVRiskCascade<DVRiskFile, unknown>[] | null;
  effects: DVRiskCascade<unknown, DVRiskFile>[] | null;
  inputRef: RefObject<ScenarioInputs>;
  inputErrors: ScenarioErrors;
  setRunTutorial: (run: boolean) => void;
}) {
  return (
    <>
      {activeStep === STEPS.INTRODUCTION && <Introduction onRunTutorial={() => setRunTutorial(true)} />}
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
            causes={causes}
            effects={effects}
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
            causes={causes}
            effects={effects}
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
            causes={causes}
            effects={effects}
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
    </>
  );
}
