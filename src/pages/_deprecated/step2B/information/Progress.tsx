import { Box, Stepper, Step, StepLabel, Tooltip, StepButton, StepIcon } from "@mui/material";
import { useTranslation } from "react-i18next";
import { RefObject, useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CheckIcon from "@mui/icons-material/Check";
import { emergingStepNames, manmadeStepNames, stepNames, STEPS } from "../Steps";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { Step2BErrors } from "./validateInput";
import { RISK_TYPE } from "../../../types/dataverse/DVRiskFile";

const enum STATUS {
  DONE,
  DOING,
  ERROR,
  NOT_STARTED,
}

interface PROGRESS_STEP {
  id: number;
  title: string;
  activeSuffix?: string;
  inactiveSuffix?: string;
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
  steps,
  activeStep,
  goToStep,
}: {
  steps: PROGRESS_STEP[];
  activeStep: number;
  goToStep(step: number): void;
}) {
  return (
    <Box sx={{ flex: "1 1 auto", mx: 12, pt: 0.5 }} id="step2A-progress-bar">
      <Stepper nonLinear>
        {steps.map((s, i) => (
          <Step key={s.id} active={activeStep === s.id} completed={activeStep > s.id}>
            {activeStep === s.id && (
              <StepLabel>
                {s.title} {s.activeSuffix || ""}
              </StepLabel>
            )}
            {activeStep > s.id && (
              <StepButton onClick={() => goToStep(s.id)} icon={<DoneStepIcon />}>
                {s.title} {s.inactiveSuffix || ""}
              </StepButton>
            )}
            {activeStep < s.id && (
              <StepLabel>
                {s.title} {s.inactiveSuffix || ""}
              </StepLabel>
            )}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
