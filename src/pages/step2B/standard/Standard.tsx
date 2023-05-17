import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { SCENARIOS, Scenarios } from "../../../functions/scenarios";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import Introduction from "./Introduction";
import { useEffect, useState } from "react";
import { stepNames, STEPS } from "../Steps";
import ScenarioAnalysis from "./ScenarioAnalysis";
import CascadeAnalysis from "./CascadeAnalysis";
import { useSearchParams } from "react-router-dom";
import { DVContact } from "../../../types/dataverse/DVContact";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { useUnmountEffect } from "framer-motion";
import { CascadeAnalysisInput } from "../../../functions/cascades";

export default function Standard({
  activeStep,
  cascade,
  cascadeIndex,
  step2A,
  step2B,
  step2BInput,
  activeCauseScenario,
  activeEffectScenario,
  setRunTutorial,
  setStep2BInput,
  onNext,
  onPrevious,
}: {
  activeStep: STEPS | null;
  cascade: DVRiskCascade<DVRiskFile> | null;
  cascadeIndex: number;
  step2A: DVDirectAnalysis<DVRiskFile>;
  step2B: DVCascadeAnalysis | null;
  step2BInput: CascadeAnalysisInput | null;
  activeCauseScenario: SCENARIOS;
  activeEffectScenario: SCENARIOS;
  setRunTutorial: (run: boolean) => void;
  setStep2BInput: (input: CascadeAnalysisInput) => void;
  onNext: () => Promise<void>;
  onPrevious: () => Promise<void>;
}) {
  return (
    <>
      {activeStep === STEPS.INTRODUCTION && <Introduction onRunTutorial={() => setRunTutorial(true)} />}
      {activeStep === STEPS.CAUSES && step2A.cr4de_risk_file && cascade && step2B && step2BInput && (
        <Box>
          <Container>
            <Box sx={{ mb: 2, ml: 1 }}>
              <Typography variant="h4">
                <Trans i18nKey="2B.causes.title">Cause</Trans>
              </Typography>
            </Box>
          </Container>
          <CascadeAnalysis
            riskFile={step2A.cr4de_risk_file}
            cascade={cascade}
            cascadeIndex={cascadeIndex}
            step2B={step2B}
            activeCauseScenario={activeCauseScenario}
            activeEffectScenario={activeEffectScenario}
            step2BInput={step2BInput}
            setStep2BInput={setStep2BInput}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        </Box>
      )}
      {activeStep === STEPS.CATALYSING_EFFECTS && step2A.cr4de_risk_file && cascade && step2B && step2BInput && (
        <Box>
          <Container>
            <Box sx={{ mb: 2, ml: 1 }}>
              <Typography variant="h4">
                <Trans i18nKey="2B.catalysingEffects.title">Catalysing Effects</Trans>
              </Typography>
            </Box>
          </Container>
          <CascadeAnalysis
            riskFile={step2A.cr4de_risk_file}
            cascade={cascade}
            cascadeIndex={cascadeIndex}
            step2B={step2B}
            activeCauseScenario={activeCauseScenario}
            activeEffectScenario={activeEffectScenario}
            step2BInput={step2BInput}
            setStep2BInput={setStep2BInput}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        </Box>
      )}
    </>
  );
}
