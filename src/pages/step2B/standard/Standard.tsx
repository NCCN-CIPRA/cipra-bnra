import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Trans } from "react-i18next";
import { Scenarios } from "../../../functions/scenarios";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import Introduction from "./Introduction";
import { RefObject } from "react";
import { stepNames, STEPS } from "../../step2A/Steps";
import ScenarioAnalysis from "./ScenarioAnalysis";

export default function Standard({
  activeStep,
  step2A,
  causes,
  setRunTutorial,
}: {
  activeStep: STEPS | null;
  step2A: DVDirectAnalysis<DVRiskFile>;
  causes: DVRiskCascade<DVRiskFile>[];
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
            directAnalysis={step2A}
            causes={causes}
            scenarioName="considerable"
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
            directAnalysis={step2A}
            causes={causes}
            scenarioName="major"
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
            directAnalysis={step2A}
            causes={causes}
            scenarioName="extreme"
          />
        </Box>
      )}
    </>
  );
}
