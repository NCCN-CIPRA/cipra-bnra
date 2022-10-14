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
import LoadingButton from "@mui/lab/LoadingButton";
import { Trans } from "react-i18next";
import useAPI from "../hooks/useAPI";
import { useOutletContext } from "react-router-dom";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { AuthPageContext } from "../pages/AuthPage";

export default function SurveyDialog({
  open,
  riskFile,
  onClose,
}: {
  open: boolean;
  riskFile: DVRiskFile | null;
  onClose: () => void;
}) {
  const api = useAPI();
  const { user } = useOutletContext<AuthPageContext>();

  const [isLoading, setIsLoading] = useState(false);

  const [q1, setQ1] = useState<number | null>(3);
  const [q2, setQ2] = useState<number | null>(3);
  const [q3, setQ3] = useState<number | null>(3);
  const [q4, setQ4] = useState<number | null>(3);
  const [quali, setQuali] = useState("");

  const handleSubmitFeedback = async () => {
    if (!riskFile) return;

    setIsLoading(true);

    await api.createFeedback({
      "cr4de_contact@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user.contactid})`,
      "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
      cr4de_q1: q1,
      cr4de_q2: q1,
      cr4de_q3: q3,
      cr4de_q4: q4,
      cr4de_quali_validation: quali,
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
            <Trans i18nKey="validation.dialog.helpText">
              Would you mind providing some feedback for this step in the process? This will help us streamline our
              methodology for subsequent experts and iterations.
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
                  Do not agree
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
                  Totally agree
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                It was clear what was expected of me
              </Typography>
              <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                <Rating
                  size="large"
                  value={q1}
                  onChange={(event, newValue) => {
                    setQ1(newValue);
                  }}
                />
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                The subject was in line with my personal expertise and/or interests
              </Typography>
              <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                <Rating
                  size="large"
                  value={q2}
                  onChange={(event, newValue) => {
                    setQ2(newValue);
                  }}
                />
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                I understand the necessity of this step in the BNRA process
              </Typography>
              <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                <Rating
                  size="large"
                  value={q3}
                  onChange={(event, newValue) => {
                    setQ3(newValue);
                  }}
                />
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                The time and/or effort required of me for this step was as expected
              </Typography>
              <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                <Rating
                  size="large"
                  value={q4}
                  onChange={(event, newValue) => {
                    setQ4(newValue);
                  }}
                />
              </Box>
            </Stack>
            <TextField
              multiline
              rows={3}
              placeholder="Any other remarks or feedback?"
              value={quali}
              onChange={(e) => setQuali(e.target.value)}
            />
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <Trans i18nKey="validation.dialog.cancel">Skip</Trans>
        </Button>
        <LoadingButton loading={isLoading} onClick={handleSubmitFeedback}>
          <Trans i18nKey="validation.dialog.finish">Submit Feedback</Trans>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
