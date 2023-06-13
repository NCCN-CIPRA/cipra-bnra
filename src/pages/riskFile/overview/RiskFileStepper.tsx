import { DVContact } from "../../../types/dataverse/DVContact";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import {
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Paper,
  StepConnector,
  stepClasses,
  stepConnectorClasses,
  useTheme,
} from "@mui/material";
import LoadingTab from "../LoadingTab";

function ProgressConnector(props: any) {
  console.log(props);

  return <StepConnector {...props} />;
}

export default function RiskFileStepper({
  riskFile,
  participations,
}: {
  riskFile: DVRiskFile;
  participations: DVParticipation<DVContact>[];
}) {
  const theme = useTheme();

  if (!riskFile || participations === null) return <LoadingTab />;

  const epxertParticipations = participations.filter((p) => p.cr4de_role === "expert");

  let activeStep = 0;
  const progress = {
    p: 1,
    v: 1,
    a: 0,
    b: 0,
  };

  activeStep++;

  if (riskFile.cr4de_step2a_enabled) {
    activeStep++;

    epxertParticipations.forEach((p) => {
      if (p.cr4de_direct_analysis_finished) {
        progress.a += 1 / epxertParticipations.length;
      }
      if (p.cr4de_cascade_analysis_finished) {
        progress.b += 1 / epxertParticipations.length;
      }
    });
    if (progress.a >= 1) {
      activeStep++;
      if (progress.b >= 1) {
        activeStep++;
      }
    }
  }

  return (
    <Paper
      sx={{
        mt: 4,
        py: 3,
        [`& .${stepConnectorClasses.line}`]: { borderTopWidth: 3 },
        [`& .${stepClasses.root}:nth-child(2) .${stepConnectorClasses.line}::after`]: {
          content: '" "',
          display: "inline-block",
          width: `${progress.p * 100}%`,
          backgroundColor: theme.palette.primary.main,
          position: "absolute",
          top: 0,
          bottom: 0,
        },
        [`& .${stepClasses.root}:nth-child(3) .${stepConnectorClasses.line}::after`]: {
          content: '" "',
          display: "inline-block",
          width: `${progress.v * 100}%`,
          backgroundColor: theme.palette.primary.main,
          position: "absolute",
          top: 0,
          bottom: 0,
        },
        [`& .${stepClasses.root}:nth-child(4) .${stepConnectorClasses.line}::after`]: {
          content: '" "',
          display: "inline-block",
          width: `${progress.a * 100}%`,
          backgroundColor: theme.palette.primary.main,
          position: "absolute",
          top: 0,
          bottom: 0,
        },
        [`& .${stepClasses.root}:nth-child(5) .${stepConnectorClasses.line}::after`]: {
          content: '" "',
          display: "inline-block",
          width: `${progress.b * 100}%`,
          backgroundColor: theme.palette.primary.main,
          position: "absolute",
          top: 0,
          bottom: 0,
        },
      }}
    >
      <Stepper activeStep={activeStep} alternativeLabel connector={<ProgressConnector />}>
        <Step active={activeStep === 0} completed={activeStep > 0}>
          <Tooltip title="The expert has not yet registered their account">
            <StepLabel icon={"0"}>Preliminary Risk File</StepLabel>
          </Tooltip>
        </Step>
        <Step active={activeStep === 1} completed={activeStep > 1}>
          <Tooltip title="The expert has not yet registered their account">
            <StepLabel icon={"1"}>Validation</StepLabel>
          </Tooltip>
        </Step>
        <Step active={activeStep === 2} completed={activeStep > 2}>
          <Tooltip title="The expert has not yet registered their account">
            <StepLabel icon={"2"}>Analysis A</StepLabel>
          </Tooltip>
        </Step>
        <Step active={activeStep === 3} completed={activeStep > 3}>
          <Tooltip title="The expert has not yet registered their account">
            <StepLabel icon={"3"}>Analysis B</StepLabel>
          </Tooltip>
        </Step>
        <Step active={activeStep === 4} completed={activeStep > 4}>
          <Tooltip title="The expert has not yet registered their account">
            <StepLabel icon={"4"}>Consensus</StepLabel>
          </Tooltip>
        </Step>
      </Stepper>
    </Paper>
  );
}
