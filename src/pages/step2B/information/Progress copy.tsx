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
  causes,
  catalysingEffects,
  causeIndex,
  catalysingEffectIndex,
  hasClimateChange,
}: {
  activeStep: STEPS;
  goToStep(step: STEPS): void;
  riskType: string | undefined;
  causes: DVRiskCascade[] | undefined;
  catalysingEffects: DVRiskCascade[] | undefined;
  causeIndex: string | null;
  catalysingEffectIndex: string | null;
  hasClimateChange: boolean | null;
}) {
  const { t } = useTranslation();

  let causesStepLabel;
  if (riskType === RISK_TYPE.STANDARD)
    causesStepLabel = t(stepNames[STEPS.CAUSES].titleI18N, stepNames[STEPS.CAUSES].titleDefault);
  else if (riskType === RISK_TYPE.MANMADE)
    causesStepLabel = t(manmadeStepNames[STEPS.CAUSES].titleI18N, manmadeStepNames[STEPS.CAUSES].titleDefault);
  else if (riskType === RISK_TYPE.EMERGING)
    causesStepLabel = t(emergingStepNames[STEPS.CAUSES].titleI18N, emergingStepNames[STEPS.CAUSES].titleDefault);

  return (
    <Box sx={{ flex: "1 1 auto", mx: 12, pt: 0.5 }} id="step2A-progress-bar">
      <Stepper nonLinear activeStep={activeStep}>
        <Step completed={activeStep > STEPS.INTRODUCTION}>
          {activeStep === STEPS.INTRODUCTION ? (
            <StepLabel>
              {t(stepNames[STEPS.INTRODUCTION].titleI18N, stepNames[STEPS.INTRODUCTION].titleDefault)}
            </StepLabel>
          ) : (
            <StepButton onClick={() => goToStep(STEPS.INTRODUCTION)} icon={<DoneStepIcon />}>
              {t(stepNames[STEPS.INTRODUCTION].titleI18N, stepNames[STEPS.INTRODUCTION].titleDefault)}
            </StepButton>
          )}
        </Step>
        {causes && causes.length > 0 && (
          <Step completed={activeStep > STEPS.CAUSES}>
            {activeStep < STEPS.CAUSES && (
              <StepLabel>
                {causesStepLabel} {causes && causes.length > 0 && ` (${causes.length})`}
              </StepLabel>
            )}
            {activeStep === STEPS.CAUSES && (
              <StepLabel>
                {causesStepLabel} {causes && causeIndex && ` (${causeIndex}/${causes.length})`}
              </StepLabel>
            )}
            {activeStep > STEPS.CAUSES && (
              <StepButton color="secondary" onClick={() => goToStep(STEPS.CAUSES)} icon={<DoneStepIcon />}>
                {causesStepLabel} {causes && causes.length > 0 && ` (${causes.length})`}
              </StepButton>
            )}
          </Step>
        )}
        {hasClimateChange && (
          <Step completed={activeStep > STEPS.CLIMATE_CHANGE}>
            {activeStep < STEPS.CLIMATE_CHANGE && (
              <StepLabel>
                {t(stepNames[STEPS.CLIMATE_CHANGE].titleI18N, stepNames[STEPS.CLIMATE_CHANGE].titleDefault)}
              </StepLabel>
            )}
            {activeStep === STEPS.CLIMATE_CHANGE && (
              <StepLabel>
                {t(stepNames[STEPS.CLIMATE_CHANGE].titleI18N, stepNames[STEPS.CLIMATE_CHANGE].titleDefault)}
              </StepLabel>
            )}
            {activeStep > STEPS.CLIMATE_CHANGE && (
              <StepButton color="secondary" onClick={() => goToStep(STEPS.CLIMATE_CHANGE)} icon={<DoneStepIcon />}>
                {t(stepNames[STEPS.CLIMATE_CHANGE].titleI18N, stepNames[STEPS.CLIMATE_CHANGE].titleDefault)}
              </StepButton>
            )}
          </Step>
        )}
        {catalysingEffects && catalysingEffects.length > 0 && (
          <Step completed={activeStep > STEPS.CATALYSING_EFFECTS}>
            {activeStep < STEPS.CATALYSING_EFFECTS && (
              <StepLabel>
                {t(stepNames[STEPS.CATALYSING_EFFECTS].titleI18N, stepNames[STEPS.CATALYSING_EFFECTS].titleDefault)}{" "}
                {catalysingEffects && catalysingEffects.length > 0 && ` (${catalysingEffects.length})`}
              </StepLabel>
            )}
            {activeStep === STEPS.CATALYSING_EFFECTS && (
              <StepLabel>
                {t(stepNames[STEPS.CATALYSING_EFFECTS].titleI18N, stepNames[STEPS.CATALYSING_EFFECTS].titleDefault)}{" "}
                {catalysingEffects &&
                  catalysingEffectIndex &&
                  ` (${catalysingEffectIndex}/${catalysingEffects.length})`}
              </StepLabel>
            )}
            {activeStep > STEPS.CATALYSING_EFFECTS && (
              <StepButton color="secondary" onClick={() => goToStep(STEPS.CATALYSING_EFFECTS)} icon={<DoneStepIcon />}>
                {t(stepNames[STEPS.CATALYSING_EFFECTS].titleI18N, stepNames[STEPS.CATALYSING_EFFECTS].titleDefault)}{" "}
                {catalysingEffects && catalysingEffects.length > 0 && ` (${catalysingEffects.length})`}
              </StepButton>
            )}
          </Step>
        )}
      </Stepper>
    </Box>
  );
}
