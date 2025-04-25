import { Box, Button, Paper } from "@mui/material";
import { STEPS } from "./Steps";
import { Trans, useTranslation } from "react-i18next";
import Progress from "../information/Progress";
import { stepNames } from "./Steps";

export default function BottomBar({
  catalysingEffects,
  cascadeIndex,
  activeStep,
  hasNextStep,
  nextStepDisabled,
  onNext,
  onPrevious,
  onGoToStep,
  onFinish,
}: {
  activeStep: STEPS;
  catalysingEffects: number;
  cascadeIndex: number;
  hasNextStep: boolean;
  nextStepDisabled: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (step: STEPS) => void;
  onFinish: () => void;
}) {
  const { t } = useTranslation();

  return (
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
      <Button id="back-button" color="primary" onClick={onPrevious} disabled={activeStep === STEPS.INTRODUCTION}>
        <Trans i18nKey="button.back">Back</Trans>
      </Button>

      <Progress
        activeStep={activeStep || 0}
        steps={[
          {
            id: STEPS.INTRODUCTION,
            title: t(stepNames[STEPS.INTRODUCTION].titleI18N, stepNames[STEPS.INTRODUCTION].titleDefault),
          },
          ...(catalysingEffects > 0
            ? [
                {
                  id: STEPS.CATALYSING_EFFECTS,
                  title: t(
                    stepNames[STEPS.CATALYSING_EFFECTS].titleI18N,
                    stepNames[STEPS.CATALYSING_EFFECTS].titleDefault
                  ),
                  activeSuffix: `(${cascadeIndex}/${catalysingEffects})`,
                  inactiveSuffix: `(${catalysingEffects})`,
                },
              ]
            : []),
        ]}
        goToStep={onGoToStep}
      />

      <Box id="step2A-next-buttons">
        {hasNextStep && (
          <Button disabled={nextStepDisabled} color="primary" sx={{ mr: 1 }} onClick={onNext} className="next-button">
            <Trans i18nKey="button.next">Next</Trans>
          </Button>
        )}
        <Button color="primary" sx={{ mr: 1 }} onClick={() => onFinish()}>
          <Trans i18nKey="button.saveandexit">Save & exit</Trans>
        </Button>
      </Box>
    </Box>
  );
}
