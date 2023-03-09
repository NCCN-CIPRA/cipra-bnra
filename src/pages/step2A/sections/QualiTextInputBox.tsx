import TextInputBox from "../../../components/TextInputBox";
import { useState, useRef, ReactNode } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useAPI from "../../../hooks/useAPI";

export const NO_COMMENT = "[[NO_COMMENT]]";

export default function QualiTextInputBox({
  id,
  height = "300px",
  initialValue,
  limitedOptions,
  debounceInterval = 5000,
  error,
  attachments,

  onSave,
  onBlur,
  onOpenSourceDialog,
  setUpdatedValue,
  onReloadAttachments,
}: {
  id?: string;
  height?: string;
  initialValue: string | null;
  limitedOptions?: boolean;
  debounceInterval?: number;
  error?: boolean;
  attachments: DVAttachment<unknown, DVAttachment>[] | null;

  onSave?: (newValue: string | null) => void;
  onBlur?: () => void;
  onOpenSourceDialog: (existingSource?: DVAttachment) => void;
  setUpdatedValue?: (newValue: string | null | undefined) => void;
  onReloadAttachments: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const api = useAPI();

  const [noComment, setNoComment] = useState(initialValue === NO_COMMENT);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [removingAttachment, setRemovingAttachment] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

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

  const handleRemoveAttachment = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this attachment?")) {
      setRemovingAttachment(id);

      await api.deleteAttachment(id);

      await onReloadAttachments();

      setRemovingAttachment(null);
    }
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

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
        <Button variant="outlined" onClick={() => onOpenSourceDialog()} startIcon={<AttachFileIcon />}>
          <Trans i18nKey="button.addSource">Add Source</Trans>
        </Button>
        {noComment ? (
          <Button variant="outlined" onClick={handleAddComment}>
            <Trans i18nKey="button.addComment">Add Comment</Trans>
          </Button>
        ) : (
          <Button variant="outlined" onClick={handleNoComment}>
            <Trans i18nKey="button.noComment">No Comment</Trans>
          </Button>
        )}
      </Stack>

      {attachments && attachments.length > 0 && (
        <Table size="small" sx={{ mt: 1, mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans i18nKey="source.list.fileName">Source filename</Trans>
              </TableCell>
              <TableCell sx={{ width: 0, whiteSpace: "nowrap" }}>
                <Trans i18nKey="source.list.type">Source Type</Trans>
              </TableCell>
              <TableCell align="right" sx={{ width: 0 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attachments.map((a) => {
              const source = a.cr4de_referencedSource || a;

              return (
                <TableRow key={a.cr4de_bnraattachmentid} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Link
                      sx={{ "&:hover": { cursor: "pointer" } }}
                      onClick={async () => {
                        if (a) {
                          setIsDownloading(a.cr4de_bnraattachmentid);
                        }
                        await api.serveAttachmentFile(source);
                        setIsDownloading(null);
                      }}
                    >
                      {source.cr4de_name}
                    </Link>
                    {isDownloading === a.cr4de_bnraattachmentid && <CircularProgress size={20} sx={{ ml: 2 }} />}
                  </TableCell>
                  <TableCell>{source.cr4de_url ? t("source.type.link") : t("source.type.file")}</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: "nowrap", textAlign: "center" }}>
                    {a.cr4de_url && (
                      <IconButton
                        onClick={() => {
                          onOpenSourceDialog(a);
                        }}
                      >
                        <EditIcon color="primary" />
                      </IconButton>
                    )}
                    {removingAttachment === a.cr4de_bnraattachmentid ? (
                      <CircularProgress size={20} />
                    ) : (
                      <IconButton
                        onClick={() => {
                          handleRemoveAttachment(a.cr4de_bnraattachmentid);
                          setRemovingAttachment(a.cr4de_bnraattachmentid);
                        }}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
