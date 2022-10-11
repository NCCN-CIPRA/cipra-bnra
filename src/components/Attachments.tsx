import { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Grid,
  Divider,
  Snackbar,
  CircularProgress,
  Alert,
} from "@mui/material";
import useLoggedInUser from "../hooks/useLoggedInUser";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Trans } from "react-i18next";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import useAPI from "../hooks/useAPI";

export default function Attachments({
  attachments,
  field,
  riskFile,
  onUpdate,
}: {
  attachments: DVAttachment[] | null;
  field: string;
  riskFile?: DVRiskFile | null;
  onUpdate: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const api = useAPI();
  const { user } = useLoggedInUser();

  const [openDialog, setOpenDialog] = useState(false);

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingFinished, setIsUploadingFinished] = useState(false);
  const [isRemovingFile, setIsRemovingFile] = useState(false);
  const [isRemovingFinished, setIsRemovingFinished] = useState(false);

  const [title, setTitle] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleToggleDialog = () => setOpenDialog(!openDialog);

  const fieldAttachments = useMemo(() => {
    if (!attachments) return [];

    if (!field) return attachments;

    return attachments?.filter((a) => a.cr4de_field === field);
  }, [attachments, field]);

  const handlePickFile = () => {
    if (!inputRef.current) return;

    inputRef.current.click();
  };

  const handleSaveAttachment = async () => {
    if (!inputRef.current) return;

    const file = inputRef.current.files && inputRef.current.files[0];

    setIsUploadingFile(true);
    setOpenDialog(false);

    await api.createAttachment(
      {
        "cr4de_owner@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
        cr4de_name: title || (file && file.name),
        cr4de_reference: attachments ? attachments.reduce((max, a) => Math.max(max, a.cr4de_reference), -1) + 1 : 1,
        cr4de_field: field,
        cr4de_url: url,
        ...(riskFile
          ? {
              "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
            }
          : {}),
      },
      file
    );

    setTitle(null);
    setUrl(null);

    await onUpdate();

    setIsUploadingFile(false);
    setIsUploadingFinished(true);
  };

  const handleRemoveAttachment = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this attachment?")) {
      setIsRemovingFile(true);

      await api.deleteAttachment(id);

      await onUpdate();

      setIsRemovingFile(false);
      setIsRemovingFinished(true);
    }
  };

  return (
    <Box mt={1}>
      <Dialog open={openDialog} onClose={handleToggleDialog}>
        <input ref={inputRef} type="file" style={{ display: "none" }} onInput={handleSaveAttachment} />
        <DialogTitle>
          <Trans i18nKey="source.dialog.title">Provide source material</Trans>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Trans i18nKey="source.dialog.helpText">
              Please provide a title and a web url for the source, or upload a file from your computer.
            </Trans>
          </DialogContentText>
          <Grid container>
            <Grid item xs>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Source Title"
                fullWidth
                variant="standard"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                margin="dense"
                id="url"
                label="Link"
                fullWidth
                variant="standard"
                value={url || ""}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ mx: 4 }} />
            <Grid item xs sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={handlePickFile}>
                Upload File
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleDialog}>Cancel</Button>
          <Button onClick={handleSaveAttachment}>Add source</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={isUploadingFile}>
        <Alert severity="info" icon={false} sx={{ width: "100%" }}>
          <CircularProgress size={12} sx={{ mr: 1 }} /> Saving attachment
        </Alert>
      </Snackbar>
      <Snackbar open={isUploadingFinished} autoHideDuration={6000} onClose={() => setIsUploadingFinished(false)}>
        <Alert severity="success" sx={{ width: "100%" }} onClose={() => setIsUploadingFinished(false)}>
          Attachment saved
        </Alert>
      </Snackbar>
      <Snackbar open={isRemovingFile}>
        <Alert severity="info" icon={false} sx={{ width: "100%" }}>
          <CircularProgress size={12} sx={{ mr: 1 }} /> Removing attachment
        </Alert>
      </Snackbar>
      <Snackbar open={isRemovingFinished} autoHideDuration={6000} onClose={() => setIsRemovingFinished(false)}>
        <Alert severity="success" sx={{ width: "100%" }} onClose={() => setIsRemovingFinished(false)}>
          Attachment removed
        </Alert>
      </Snackbar>

      <Box sx={{ flexWrap: "wrap", display: "flex", listStyle: "none" }}>
        {fieldAttachments.map((a) => (
          <ListItem key={a.cr4de_bnraattachmentid} sx={{ width: "auto", px: "8px" }}>
            <Chip
              label={a.cr4de_name}
              icon={<AttachFileIcon sx={{ fontSize: 16, mb: "2px" }} />}
              onClick={() => {
                api.serveAttachmentFile(a);
              }}
              onDelete={
                a._cr4de_owner_value === user?.contactid
                  ? () => {
                      handleRemoveAttachment(a.cr4de_bnraattachmentid);
                    }
                  : undefined
              }
            />
          </ListItem>
        ))}
      </Box>

      <Box sx={{ textAlign: "right" }}>
        <Button startIcon={<AttachFileIcon />} onClick={handleToggleDialog}>
          Provide source material
        </Button>
      </Box>
    </Box>
  );
}
