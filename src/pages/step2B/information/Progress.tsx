import { Box, Stepper, Step, StepLabel, Tooltip, StepButton, StepIcon } from "@mui/material";
import { useTranslation } from "react-i18next";
import { RefObject, useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CheckIcon from "@mui/icons-material/Check";
import { stepNames, STEPS } from "../../step2A/Steps";

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
  activeStep,
  goToStep,
  riskType,
  setCurrentStep,
}: {
  activeStep: STEPS;
  goToStep(step: STEPS): void;
  riskType: string | undefined;
  setCurrentStep: (s: STEPS) => void;
}) {
  const { t } = useTranslation();

  const [steps, setSteps] = useState(Array(4).fill(STATUS.NOT_STARTED));

  return (
    <Box sx={{ flex: "1 1 auto", mx: 12, pt: 0.5 }} id="step2A-progress-bar">
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((status: STATUS, stepName: STEPS) => (
          <Step key={stepName} completed={status === STATUS.DONE}>
            <Tooltip title={t(stepNames[stepName].titleI18N, stepNames[stepName].titleDefault)}>
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
            </Tooltip>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
