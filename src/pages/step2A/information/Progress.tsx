import { Box, Stepper, Step, StepLabel, Tooltip, StepButton, StepIcon } from "@mui/material";
import { useTranslation } from "react-i18next";
import { stepNames, STEPS } from "../Steps";
import { RefObject } from "react";
import { ScenarioInput, ScenarioInputs } from "../fields";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CheckIcon from "@mui/icons-material/Check";

const isScenarioComplete = (input: ScenarioInput) => Object.values(input).every((v) => v !== null);
const isScenarioEmpty = (input: ScenarioInput) => Object.values(input).every((v) => v === null);

const enum STATUS {
  DONE,
  DOING,
  ERROR,
  NOT_STARTED,
}

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
  currentStep,
  goToStep,
  inputRef,
  inputErrors,
}: {
  currentStep: STEPS;
  goToStep(step: STEPS): void;
  inputRef: RefObject<ScenarioInputs>;
  inputErrors: any[];
}) {
  const { t } = useTranslation();

  const steps: STATUS[] = Array(5).fill(STATUS.NOT_STARTED);

  if (inputRef.current) {
    if (isScenarioComplete(inputRef.current.considerable)) {
      steps[0] = STATUS.DONE;
      steps[1] = STATUS.DONE;
      if (isScenarioComplete(inputRef.current.major)) {
        steps[2] = STATUS.DONE;
        if (isScenarioComplete(inputRef.current.extreme)) {
          steps[3] = STATUS.DONE;
          steps[4] = STATUS.DOING;
        } else {
          steps[3] = STATUS.DOING;
        }
      } else {
        steps[2] = STATUS.DOING;
      }
    } else if (isScenarioEmpty(inputRef.current.considerable) && currentStep === 0) {
      steps[0] = STATUS.DOING;
    } else {
      steps[0] = STATUS.DONE;
      steps[1] = STATUS.DOING;
    }
  }

  return (
    <Box sx={{ flex: "1 1 auto", mx: 12, pt: 0.5 }}>
      <Stepper nonLinear activeStep={currentStep}>
        {steps.map((status: STATUS, stepName: STEPS) => (
          <Step key={stepName} completed={status === STATUS.DONE}>
            <Tooltip title={t(stepNames[stepName].titleI18N, stepNames[stepName].titleDefault)}>
              <>
                {stepName !== currentStep && status === STATUS.DONE && (
                  <StepButton color="secondary" onClick={() => goToStep(stepName)} icon={<DoneStepIcon />}>
                    {t(stepNames[stepName].titleI18N, stepNames[stepName].titleDefault)}
                  </StepButton>
                )}
                {stepName !== currentStep && status === STATUS.DOING && (
                  <>
                    <StepButton onClick={() => goToStep(stepName)} icon={<DoingStepIcon />}>
                      {t(stepNames[stepName].titleI18N, stepNames[stepName].titleDefault)}
                    </StepButton>
                  </>
                )}
                {(stepName === currentStep || status === STATUS.NOT_STARTED) && (
                  <StepLabel error={stepName === currentStep && inputErrors.length > 0}>
                    {t(stepNames[stepName].titleI18N, stepNames[stepName].titleDefault)}
                  </StepLabel>
                )}
              </>
            </Tooltip>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
