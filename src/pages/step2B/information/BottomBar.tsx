import { MutableRefObject } from "react";
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
  Tooltip,
} from "@mui/material";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { STEPS } from "../Steps";
import { CascadeAnalysisInput, getCascadeField } from "../../../functions/cascades";
import { Trans, useTranslation } from "react-i18next";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import Progress from "./Progress";
import { SCENARIOS } from "../../../functions/scenarios";
import { Step2BErrors } from "./validateInput";

export default function BottomBar({
  step2A,
  causes,
  climateChange,
  catalysingEffects,
  cascadeIndex,
  activeStep,
  activeCauseScenario,
  activeEffectScenario,
  isSaving,
  hasNextStep,
  step2BInput,
  onNext,
  onPrevious,
  onGoToStep,
  onFinish,
}: {
  step2A: DVDirectAnalysis<DVRiskFile> | null;
  causes: DVRiskCascade[] | null;
  climateChange: DVRiskCascade | null;
  catalysingEffects: DVRiskCascade[] | null;
  cascadeIndex: number;
  activeStep: STEPS | null;
  activeCauseScenario: SCENARIOS;
  activeEffectScenario: SCENARIOS;
  isSaving: boolean;
  hasNextStep: boolean | null;
  step2BInput: MutableRefObject<CascadeAnalysisInput | null>;
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
      <Button id="back-button" disabled={isSaving} color="primary" onClick={onPrevious}>
        <Trans i18nKey="button.back">Back</Trans>
      </Button>

      <Progress
        activeStep={activeStep || 0}
        goToStep={onGoToStep}
        riskType={step2A?.cr4de_risk_file.cr4de_risk_type}
        causes={causes || []}
        causeIndex={activeStep === STEPS.CAUSES ? (cascadeIndex + 1).toString() : null}
        catalysingEffects={catalysingEffects || []}
        catalysingEffectIndex={activeStep === STEPS.CATALYSING_EFFECTS ? (cascadeIndex + 1).toString() : null}
        hasClimateChange={Boolean(climateChange)}
      />

      <Box id="step2A-next-buttons">
        {hasNextStep && (
          <Tooltip
            title={
              step2BInput.current &&
              step2BInput.current[getCascadeField(activeCauseScenario, activeEffectScenario)] != null
                ? t("2B.doneButton.continue", "Continue")
                : t("2B.doneButton.selectValue", "Please select a value before continuing")
            }
          >
            <span>
              <Button
                disabled={
                  isSaving ||
                  (activeStep === STEPS.CAUSES &&
                    (!step2BInput.current ||
                      step2BInput.current[getCascadeField(activeCauseScenario, activeEffectScenario)] == null))
                }
                color="primary"
                sx={{ mr: 1 }}
                onClick={onNext}
                className="next-button"
              >
                <Trans i18nKey="button.next">Next</Trans>
              </Button>
            </span>
          </Tooltip>
        )}
        <Button disabled={isSaving} color="primary" sx={{ mr: 1 }} onClick={() => onFinish()}>
          <Trans i18nKey="button.saveandexit">Save & exit</Trans>
        </Button>
      </Box>
    </Box>
  );
}
