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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { Trans } from "react-i18next";
import useAPI from "../../../hooks/useAPI";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AuthPageContext } from "../../AuthPage";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { Step2BErrors } from "./validateInput";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { STEPS } from "../Steps";

export default function FinishDialog({
  step2A,
  finishedDialogOpen,
  inputErrors,
  setFinishedDialogOpen,
  setSurveyDialogOpen,
  onTransitionTo,
}: {
  step2A: DVDirectAnalysis;
  finishedDialogOpen: boolean;
  inputErrors: Step2BErrors | null;
  setFinishedDialogOpen: (open: boolean) => void;
  setSurveyDialogOpen: (open: boolean) => void;
  onTransitionTo: (newStep: STEPS, newIndex: number) => void;
}) {
  const api = useAPI();
  const navigate = useNavigate();
  const { user } = useOutletContext<AuthPageContext>();
  const theme = useTheme();

  return (
    <Dialog open={finishedDialogOpen} onClose={() => setFinishedDialogOpen(false)}>
      {inputErrors && Object.keys(inputErrors).length <= 0 ? (
        <>
          <DialogTitle>
            <Trans i18nKey="2B.finishedDialog.title">Are you finished with step 2B?</Trans>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Trans i18nKey="2B.finishedDialog.helpText">
                Even if you indicate that you are finished, you can still return at a later time to make changes until
                the end of step 2B for this risk file.
              </Trans>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFinishedDialogOpen(false)}>
              <Trans i18nKey="2A.finishedDialog.cancel">No, I am not finished</Trans>
            </Button>
            <Button
              onClick={async () => {
                if (!step2A) return;

                setFinishedDialogOpen(false);
                setSurveyDialogOpen(true);

                const participants = await api.getParticipants(
                  `$filter=_cr4de_contact_value eq ${user.contactid} and _cr4de_direct_analysis_value eq ${step2A.cr4de_bnradirectanalysisid}`
                );
                if (participants.length >= 0) {
                  // await process.finishStep2A(step2A.cr4de_risk_file, participants[0]);
                  await api.finishStep(step2A._cr4de_risk_file_value, user.contactid, "2B");
                }
              }}
            >
              <Trans i18nKey="2A.finishedDialog.finish">Yes, I am finished</Trans>
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>
            <Trans i18nKey="2B.exitDialog.title">Would you like to exit step 2B?</Trans>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 4 }}>
              <Trans i18nKey="2B.exitDialog.helpText">
                Your progress will be saved and you may return at a later time to continue where you left of.
              </Trans>
            </DialogContentText>
            <Accordion square sx={{ border: `1px solid ${theme.palette.divider}` }} elevation={0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography>
                  <Trans i18nKey="2B.showErrors">Missing inputs</Trans>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {inputErrors?.causes &&
                    Object.values(inputErrors.causes).map((e) => (
                      <ListItem>
                        <ListItemButton
                          onClick={() => {
                            onTransitionTo(STEPS.CAUSES, e[1]);
                            setFinishedDialogOpen(false);
                          }}
                        >
                          {e[0].cr4de_cause_hazard.cr4de_title}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  {inputErrors?.climateChange && (
                    <ListItem>
                      <ListItemButton
                        onClick={() => {
                          onTransitionTo(STEPS.CLIMATE_CHANGE, 0);
                          setFinishedDialogOpen(false);
                        }}
                      >
                        {inputErrors.climateChange[0].cr4de_cause_hazard.cr4de_title}
                      </ListItemButton>
                    </ListItem>
                  )}
                  {inputErrors?.catalysingEffects &&
                    Object.values(inputErrors.catalysingEffects).map((e) => (
                      <ListItem
                        onClick={() => {
                          onTransitionTo(STEPS.CATALYSING_EFFECTS, 0);
                          setFinishedDialogOpen(false);
                        }}
                      >
                        <ListItemButton>{e[0].cr4de_cause_hazard.cr4de_title}</ListItemButton>
                      </ListItem>
                    ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFinishedDialogOpen(false)}>
              <Trans i18nKey="2B.exitDialog.cancel">No, stay here</Trans>
            </Button>
            <Button
              onClick={async () => {
                navigate("/overview");
              }}
            >
              <Trans i18nKey="2A.exitDialog.finish">Yes, return to my risks</Trans>
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
