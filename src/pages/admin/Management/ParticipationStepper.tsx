import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { SelectableContact } from "./Selectables";
import { Step, StepLabel, Stepper, Tooltip, Button } from "@mui/material";

export default function ParticipationStepper({
  contact,
  participation,
}: {
  contact: SelectableContact;
  participation: DVParticipation<undefined | SelectableContact, DVRiskFile>;
}) {
  let activeStep = 0;

  if (contact.msdyn_portaltermsagreementdate !== null) activeStep++;
  if (participation.cr4de_validation_finished) activeStep++;

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ width: "550px" }}>
      <Step completed={activeStep > 0}>
        <Tooltip
          title={
            activeStep > 0
              ? `The expert has registered their account on ${contact.msdyn_portaltermsagreementdate}`
              : "The expert has not yet registered their account"
          }
        >
          <StepLabel icon={"0"}></StepLabel>
        </Tooltip>
      </Step>
      <Step completed={activeStep > 1}>
        <Tooltip
          title={
            activeStep > 1
              ? "The expert has validated this risk file"
              : "The expert has not yet validated this risk file"
          }
        >
          <StepLabel icon={1}></StepLabel>
        </Tooltip>
      </Step>
      {participation.cr4de_risk_file.cr4de_risk_type === "Standard Risk" ? (
        <>
          <Step completed={activeStep > 2}>
            <Tooltip
              title={activeStep > 2 ? "The expert has finished step 2A" : "The expert has not yet finished step 2A"}
            >
              <StepLabel icon={"2A"}></StepLabel>
            </Tooltip>
          </Step>
          <Step completed={activeStep > 3}>
            <Tooltip
              title={activeStep > 3 ? "The expert has finished step 2B" : "The expert has not yet finished step 2B"}
            >
              <StepLabel icon={"2B"}></StepLabel>
            </Tooltip>
          </Step>
        </>
      ) : (
        <>
          <Step completed={activeStep > 2}>
            <Tooltip
              title={activeStep > 2 ? "The expert has finished step 2" : "The expert has not yet finished step 2"}
            >
              <StepLabel icon={"2"}></StepLabel>
            </Tooltip>
          </Step>
          <Step completed={activeStep > 3} disabled>
            <StepLabel icon={"/"}></StepLabel>
          </Step>
        </>
      )}
      <Step completed={activeStep > 4}>
        <Tooltip
          title={
            activeStep > 4
              ? "The expert has participated in the consensus meeting"
              : "The expert has not yet participated in the consensus meeting"
          }
        >
          <StepLabel icon={"3"}></StepLabel>
        </Tooltip>
      </Step>
    </Stepper>
  );
}
