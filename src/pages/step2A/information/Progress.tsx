import { Box, Stepper, Step, StepLabel, Tooltip, StepButton, StepIcon } from "@mui/material";
import { useTranslation } from "react-i18next";
import { stepNames, STEPS } from "../Steps";
import { RefObject, useEffect, useState } from "react";
import { ScenarioInput, ScenarioInputs } from "../fields";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CheckIcon from "@mui/icons-material/Check";
import { Scenarios } from "../../../functions/scenarios";

const isScenarioComplete = (input: ScenarioInput) => Object.values(input).every((v) => v !== null);
const isScenarioEmpty = (input: ScenarioInput) => Object.values(input).every((v) => v === null);

const enum STATUS {
  DONE,
  DOING,
  ERROR,
  NOT_STARTED,
}

export type ScenarioErrors = {
  [STEPS.CONSIDERABLE]: (keyof ScenarioInput)[];
  [STEPS.MAJOR]: (keyof ScenarioInput)[];
  [STEPS.EXTREME]: (keyof ScenarioInput)[];
};

function DoingStepIcon({}) {
  return (
    <Box
      sx={{
        borderRadius: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.38)",
        height: 24,
        width: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <MoreHorizIcon fontSize="small" />
    </Box>
  );
}

function DoneStepIcon({}) {
  return (
    <Box
      sx={{
        borderRadius: "50%",
        backgroundColor: "rgba(0, 0, 0, 0.38)",
        height: 24,
        width: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <CheckIcon fontSize="small" />
    </Box>
  );
}

export default function Progress({
  activeStep,
  goToStep,
  inputRef,
  inputErrors,
  setCurrentStep,
}: {
  activeStep: STEPS;
  goToStep(step: STEPS): void;
  inputRef: RefObject<ScenarioInputs>;
  inputErrors: ScenarioErrors;
  setCurrentStep: (s: STEPS) => void;
}) {
  const { t } = useTranslation();

  const [steps, setSteps] = useState(Array(5).fill(STATUS.NOT_STARTED));

  useEffect(() => {
    if (inputRef.current) {
      let currentStep;

      if (isScenarioComplete(inputRef.current.extreme)) {
        steps[3] = STATUS.DONE;
        steps[4] = STATUS.DOING;

        currentStep = STEPS.REVIEW;
      }

      if (isScenarioComplete(inputRef.current.major)) {
        steps[2] = STATUS.DONE;
        if (steps[3] === STATUS.NOT_STARTED) steps[3] = STATUS.DOING;

        currentStep = currentStep || STEPS.EXTREME;
      }

      if (isScenarioComplete(inputRef.current.considerable)) {
        steps[1] = STATUS.DONE;
        if (steps[2] === STATUS.NOT_STARTED) steps[2] = STATUS.DOING;

        currentStep = currentStep || STEPS.MAJOR;
      }

      if (isScenarioEmpty(inputRef.current.considerable) && activeStep === 0) {
        steps[0] = STATUS.DOING;

        currentStep = currentStep || STEPS.INTRODUCTION;
      } else {
        steps[0] = STATUS.DONE;
        if (steps[1] === STATUS.NOT_STARTED) steps[1] = STATUS.DOING;

        currentStep = currentStep || STEPS.CONSIDERABLE;
      }

      setCurrentStep(currentStep);
      setSteps(steps);
    }
  }, [activeStep, setCurrentStep]);

  return (
    <Box sx={{ flex: "1 1 auto", mx: 12, pt: 0.5 }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((status: STATUS, stepName: STEPS) => (
          <Step key={stepName} completed={status === STATUS.DONE}>
            <Tooltip title={t(stepNames[stepName].titleI18N, stepNames[stepName].titleDefault)}>
              {inputErrors[stepName as keyof ScenarioErrors] &&
              inputErrors[stepName as keyof ScenarioErrors].length > 0 ? (
                <StepButton onClick={() => goToStep(stepName)}>
                  <StepLabel error>{t(stepNames[stepName].titleI18N, stepNames[stepName].titleDefault)}</StepLabel>
                </StepButton>
              ) : (
                <>
                  {stepName !== activeStep && status === STATUS.DONE && (
                    <StepButton color="secondary" onClick={() => goToStep(stepName)} icon={<DoneStepIcon />}>
                      {t(stepNames[stepName].titleI18N, stepNames[stepName].titleDefault)}
                    </StepButton>
                  )}
                  {stepName !== activeStep && status === STATUS.DOING && (
                    <StepButton onClick={() => goToStep(stepName)} icon={<DoingStepIcon />}>
                      {t(stepNames[stepName].titleI18N, stepNames[stepName].titleDefault)}
                    </StepButton>
                  )}
                  {(stepName === activeStep || status === STATUS.NOT_STARTED) && (
                    <StepLabel>{t(stepNames[stepName].titleI18N, stepNames[stepName].titleDefault)}</StepLabel>
                  )}
                </>
              )}
            </Tooltip>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
