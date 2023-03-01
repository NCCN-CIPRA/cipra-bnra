import TextInputBox from "../../../components/TextInputBox";
import { useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Trans } from "react-i18next";

export const NO_COMMENT = "[[NO_COMMENT]]";

export default function QualiTextInputBox({
  id,
  height = "300px",
  initialValue,
  limitedOptions,
  debounceInterval = 5000,
  error,

  onSave,
  onBlur,
  setUpdatedValue,
}: {
  id?: string;
  height?: string;
  initialValue: string | null;
  limitedOptions?: boolean;
  debounceInterval?: number;
  error?: boolean;

  onSave?: (newValue: string | null) => void;
  onBlur?: () => void;
  setUpdatedValue?: (newValue: string | null | undefined) => void;
}) {
  const [noComment, setNoComment] = useState(initialValue === NO_COMMENT);
  const [confirmDialog, setConfirmDialog] = useState(false);

  const setNoCommentConfirmed = () => {
    setNoComment(true);
    setConfirmDialog(false);

    if (onSave) onSave(NO_COMMENT);
  };

  const handleNoComment = () => {
    if (initialValue !== null || initialValue === "") {
      setConfirmDialog(true);
    } else {
      setNoCommentConfirmed();
    }
  };

  const handleAddComment = () => {
    setNoComment(false);
    if (onSave) onSave("");
  };

  return (
    <Paper sx={{ p: 2, mx: 2, mb: 2, pb: 1 }}>
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogContent>
          <Trans i18nKey="2A.noComment.confirm">Are you sure you wish to remove your comment?</Trans>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>
            <Trans i18nKey="button.cancel">Cancel</Trans>
          </Button>
          <Button onClick={() => setNoCommentConfirmed()}>
            <Trans i18nKey="button.confirm">Confirm</Trans>
          </Button>
        </DialogActions>
      </Dialog>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography>
            <Trans i18nKey="2A.error.quali.required">
              Please enter a comment. If you have absolutely nothing to comment, please press the "No Comment" button.
            </Trans>
          </Typography>
        </Alert>
      )}
      {noComment ? (
        <Alert severity="info">
          <AlertTitle>
            <Trans i18nKey="2A.noComment.title">You have chosen not to comment on this section</Trans>
          </AlertTitle>
          <Trans i18nKey="2A.noComment.1">
            Please be aware that we really need the qualitative explanation to understand the quantitative results etc.
          </Trans>
        </Alert>
      ) : (
        <TextInputBox
          id={id}
          height={height}
          initialValue={initialValue === NO_COMMENT ? "" : initialValue}
          limitedOptions={limitedOptions}
          debounceInterval={debounceInterval}
          onSave={onSave}
          onBlur={onBlur}
          setUpdatedValue={setUpdatedValue}
        />
      )}
      <Box sx={{ mt: 1, textAlign: "right" }}>
        {noComment ? (
          <Button variant="outlined" onClick={handleAddComment}>
            <Trans i18nKey="button.addComment">Add Comment</Trans>
          </Button>
        ) : (
          <Button variant="outlined" onClick={handleNoComment}>
            <Trans i18nKey="button.noComment">No Comment</Trans>
          </Button>
        )}
      </Box>
    </Paper>
  );
}
