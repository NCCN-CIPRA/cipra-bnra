import { Box, Stepper, Step, StepLabel, Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { stepNames, STEPS } from "./Steps";

export default function Progress({ currentStep }: { currentStep: STEPS }) {
  const { t } = useTranslation();

  return (
    <Box sx={{ flex: "1 1 auto", mx: 8, pt: 0.5 }}>
      <Stepper activeStep={currentStep}>
        {Object.keys(stepNames)
          .map((s) => parseInt(s, 10))
          .sort((a, b) => a - b)
          .map((s: STEPS) => (
            <Step>
              <Tooltip title={t(stepNames[s])}>
                {currentStep === s ? (
                  <StepLabel>{t(stepNames[currentStep])}</StepLabel>
                ) : (
                  <StepLabel sx={{ width: 24 }} />
                )}
              </Tooltip>
            </Step>
          ))}
      </Stepper>
    </Box>
  );
}
