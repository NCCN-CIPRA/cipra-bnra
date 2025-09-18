import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import useAPI from "../hooks/useAPI";
import { useOutletContext } from "react-router-dom";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { FeedbackStep } from "../types/dataverse/DVFeedback";
import { BasePageContext } from "../pages/BasePage";

export default function SurveyDialog({
  open,
  riskFile,
  step,
  onClose,
}: {
  open: boolean;
  riskFile: DVRiskFile | null;
  step: FeedbackStep;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const api = useAPI();
  const { user } = useOutletContext<BasePageContext>();

  const [isLoading, setIsLoading] = useState(false);

  const [q1, setQ1] = useState<number | null>(0);
  const [q2, setQ2] = useState<number | null>(0);
  const [q3, setQ3] = useState<number | null>(0);
  const [q4, setQ4] = useState<number | null>(0);
  const [quali, setQuali] = useState("");

  const handleSubmitFeedback = async () => {
    if (!riskFile || !user) return;

    setIsLoading(true);

    await api.createFeedback({
      "cr4de_contact@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user.contactid})`,
      "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
      cr4de_q1: q1,
      cr4de_q2: q1,
      cr4de_q3: q3,
      cr4de_q4: q4,
      cr4de_quali_validation: quali,
      cr4de_step: step,
    });

    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Trans i18nKey="survey.dialog.title">Feedback</Trans>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1" paragraph>
            <Trans i18nKey="feedback.dialog.helpText">
              Would you mind providing some feedback for this step in the
              process? This will help us streamline our methodology for
              subsequent experts and iterations.
            </Trans>
          </Typography>
          <Stack direction="column" spacing={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ flex: 1 }} />
              <Box sx={{ width: 160, display: "flex", mr: 5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    transform: "translateX(-5px)",
                    width: "50px",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  <Trans i18nKey="feedback.dialog.dontagree">
                    Do not agree
                  </Trans>
                </Typography>
                <Box sx={{ flex: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    transform: "translateX(5px)",
                    width: "50px",
                    textAlign: "center",
                    display: "inline-block",
                  }}
                >
                  <Trans i18nKey="feedback.dialog.agree">Totally agree</Trans>
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                <Trans i18nKey="feedback.dialog.q1">
                  It was clear what was expected of me
                </Trans>
              </Typography>
              <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                <Rating
                  size="large"
                  value={q1}
                  onChange={(_event, newValue) => {
                    setQ1(newValue);
                  }}
                />
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                <Trans i18nKey="feedback.dialog.q2">
                  The subject was in line with my personal expertise and/or
                  interests
                </Trans>
              </Typography>
              <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                <Rating
                  size="large"
                  value={q2}
                  onChange={(_event, newValue) => {
                    setQ2(newValue);
                  }}
                />
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                <Trans i18nKey="feedback.dialog.q3">
                  I understand the necessity of this step in the BNRA process
                </Trans>
              </Typography>
              <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                <Rating
                  size="large"
                  value={q3}
                  onChange={(_event, newValue) => {
                    setQ3(newValue);
                  }}
                />
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                <Trans i18nKey="feedback.dialog.q4">
                  The time and/or effort required of me for this step was as
                  expected
                </Trans>
              </Typography>
              <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                <Rating
                  size="large"
                  value={q4}
                  onChange={(_event, newValue) => {
                    setQ4(newValue);
                  }}
                />
              </Box>
            </Stack>
            <TextField
              multiline
              rows={3}
              placeholder={t(
                "feedback.dialog.remarks",
                "Any other remarks or feedback?"
              )}
              value={quali}
              onChange={(e) => setQuali(e.target.value)}
            />
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <Trans i18nKey="feedback.dialog.skip">Skip</Trans>
        </Button>
        <Button loading={isLoading} onClick={handleSubmitFeedback}>
          <Trans i18nKey="feedback.dialog.submit">Submit Feedback</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
