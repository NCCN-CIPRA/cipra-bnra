import { ReactNode, useMemo, useRef, useState } from "react";
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
  Stack,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Collapse,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Trans } from "react-i18next";
import { DVAttachment } from "../types/dataverse/DVAttachment";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import useAPI from "../hooks/useAPI";
import { DVValidation } from "../types/dataverse/DVValidation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import { useOutletContext } from "react-router-dom";
import { AuthPageContext } from "../pages/AuthPage";

const fieldIndex = {
  definition: 0,
  historical_events: 1,
  scenarios: 2,
};

export interface Action {
  icon: ReactNode;
  tooltip: string;
  onClick: (e: any) => Promise<void>;
}

export default function Attachments({
  actions,
  attachments,
  children,
  field,
  riskFile,
  cascades = null,
  validation,
  isExternal = false,
  alwaysOpen = false,
  onUpdate,
}: {
  actions?: Action[];
  attachments: DVAttachment[] | null;
  children?: ReactNode;
  field?: string;
  riskFile?: DVRiskFile | null;
  cascades?: DVRiskCascade<SmallRisk, SmallRisk>[] | null;
  validation?: DVValidation<DVRiskFile | undefined> | null;
  isExternal?: boolean;
  alwaysOpen?: boolean;
  onUpdate: () => Promise<unknown>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const api = useAPI();
  const theme = useTheme();
  const { t } = useTranslation();
  const { user } = useOutletContext<AuthPageContext>();

  const [openDialog, setOpenDialog] = useState(false);
  const [expanded, setExpanded] = useState(alwaysOpen);

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingFinished, setIsUploadingFinished] = useState(false);
  const [isRemovingFile, setIsRemovingFile] = useState(false);
  const [isRemovingFinished, setIsRemovingFinished] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [existingId, setExistingId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleToggleDialog = () => setOpenDialog(!openDialog);

  const fieldAttachments = useMemo(() => {
    if (!attachments) return [];

    if (!field) return attachments;

    return attachments?.filter((a) => {
      // Only show attachments that belong to this field
      if (a.cr4de_field !== field) return false;

      // If the viewer is not external (CIPRA) we can show all sources
      if (!isExternal) return true;

      // If the viewer is external, only show CIPRA sources
      if (a._cr4de_validation_value === null) return true;

      // And their own source
      if (a._cr4de_owner_value === user?.contactid) return true;

      return false;
    });
  }, [attachments, field, isExternal, user?.contactid]);

  const handlePickFile = () => {
    if (!inputRef.current) return;

    inputRef.current.click();
  };

  const handleSaveAttachment = async () => {
    if (!inputRef.current) return;

    const file = inputRef.current.files && inputRef.current.files[0];

    setIsUploadingFile(true);
    setOpenDialog(false);

    if (existingId) {
      await api.updateAttachmentFields(existingId, { cr4de_name: title || (file && file.name), cr4de_url: url });
    } else {
      await api.createAttachment(
        {
          "cr4de_owner@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
          cr4de_name: title || (file && file.name),
          // cr4de_reference: attachments ? attachments.reduce((max, a) => Math.max(max, a.cr4de_reference), -1) + 1 : 1,
          cr4de_field: field,
          cr4de_url: url,
          ...(riskFile
            ? {
                "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
              }
            : {}),
          ...(validation
            ? {
                "cr4de_validation@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnravalidations(${validation.cr4de_bnravalidationid})`,
              }
            : {}),
        },
        file
      );
    }

    setExistingId(null);
    setTitle(null);
    setUrl(null);

    await onUpdate();

    setIsUploadingFile(false);
    setIsUploadingFinished(true);
  };

  const handleEditAttachment = async (attachment: DVAttachment) => {
    setExistingId(attachment.cr4de_bnraattachmentid);
    setTitle(attachment.cr4de_name);
    setUrl(attachment.cr4de_url);

    setOpenDialog(true);
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
                label={t("source.dialog.sourceTitle")}
                fullWidth
                variant="standard"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                margin="dense"
                id="url"
                label={t("source.dialog.sourceLink")}
                fullWidth
                variant="standard"
                value={url || ""}
                onChange={(e) => setUrl(e.target.value)}
              />
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ mx: 4 }} />
            {!existingId && (
              <Grid item xs sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={handlePickFile}>
                  <Trans i18nKey="source.dialog.uploadFile">Upload File</Trans>
                </Button>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggleDialog}>
            <Trans i18nKey="source.dialog.cancel">Cancel</Trans>
          </Button>
          <Button onClick={handleSaveAttachment}>
            {existingId ? (
              <Trans i18nKey="source.dialog.updateSource">Update source</Trans>
            ) : (
              <Trans i18nKey="source.dialog.addSource">Add source</Trans>
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={isUploadingFile}>
        <Alert severity="info" icon={false} sx={{ width: "100%" }}>
          <CircularProgress size={12} sx={{ mr: 1 }} />{" "}
          <Trans i18nKey="source.alert.savingAttachment">Saving attachment</Trans>
        </Alert>
      </Snackbar>
      <Snackbar open={isUploadingFinished} autoHideDuration={6000} onClose={() => setIsUploadingFinished(false)}>
        <Alert severity="success" sx={{ width: "100%" }} onClose={() => setIsUploadingFinished(false)}>
          <Trans i18nKey="source.alert.attachmentSaved">Attachment saved</Trans>
        </Alert>
      </Snackbar>
      <Snackbar open={isRemovingFile}>
        <Alert severity="info" icon={false} sx={{ width: "100%" }}>
          <CircularProgress size={12} sx={{ mr: 1 }} />{" "}
          <Trans i18nKey="source.alert.removingAttachment">Removing attachment</Trans>
        </Alert>
      </Snackbar>
      <Snackbar open={isRemovingFinished} autoHideDuration={6000} onClose={() => setIsRemovingFinished(false)}>
        <Alert severity="success" sx={{ width: "100%" }} onClose={() => setIsRemovingFinished(false)}>
          <Trans i18nKey="source.alert.attachmentRemoved">Attachment removed</Trans>
        </Alert>
      </Snackbar>
      <Snackbar open={isDownloading}>
        <Alert severity="info" icon={false} sx={{ width: "100%" }}>
          <CircularProgress size={12} sx={{ mr: 1 }} />{" "}
          <Trans i18nKey="source.alert.downloadingAttachment">Downloading attachment</Trans>
        </Alert>
      </Snackbar>

      <Stack direction="row" sx={{ mt: 2 }}>
        {user?.admin && (
          <Tooltip title={t("source.button.attach")}>
            <IconButton onClick={handleToggleDialog}>
              <AttachFileIcon />
            </IconButton>
          </Tooltip>
        )}
        {actions &&
          actions.map((a, i) => (
            <Tooltip title={a.tooltip}>
              <IconButton key={i} onClick={a.onClick} className="add-attachment-button">
                {a.icon}
              </IconButton>
            </Tooltip>
          ))}
        <Box sx={{ flex: 1 }} />
        {!alwaysOpen && (
          <Tooltip title={expanded ? t("source.button.hide") : t("source.button.show")}>
            <IconButton onClick={() => setExpanded(!expanded)} className="attachment-expand-button">
              <ExpandMoreIcon
                sx={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: theme.transitions.create("transform", {
                    duration: theme.transitions.duration.shortest,
                  }),
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {children}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 50 }}>
                <Trans i18nKey="source.list.reference">Reference</Trans>
              </TableCell>
              <TableCell>
                <Trans i18nKey="source.list.fileName">Source filename</Trans>
              </TableCell>
              {user?.roles.analist && !isExternal && (
                <TableCell sx={{ width: 0, whiteSpace: "nowrap" }}>Section</TableCell>
              )}
              <TableCell sx={{ width: 0, whiteSpace: "nowrap" }}>
                <Trans i18nKey="source.list.type">Source Type</Trans>
              </TableCell>
              {user?.roles.analist && !isExternal && <TableCell align="right" sx={{ width: 0 }}></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {fieldAttachments.length > 0 ? (
              fieldAttachments
                .sort((a, b) => {
                  if (a.cr4de_reference === null && b.cr4de_reference !== null) {
                    return 1;
                  }
                  if (b.cr4de_reference === null && a.cr4de_reference !== null) {
                    return -1;
                  }
                  if (a.cr4de_reference !== null && b.cr4de_reference !== null) {
                    return a.cr4de_reference - b.cr4de_reference;
                  }

                  if (a.cr4de_field === null && b.cr4de_field !== null) {
                    return 1;
                  }
                  if (b.cr4de_field === null && a.cr4de_field !== null) {
                    return -1;
                  }
                  if (a.cr4de_field !== null && b.cr4de_field !== null) {
                    if (a.cr4de_field > b.cr4de_field) {
                      return 1;
                    }
                    return -1;
                  }

                  if (a.cr4de_name > b.cr4de_name) {
                    return 1;
                  }
                  return -1;
                })
                .map((a) => (
                  <TableRow key={a.cr4de_bnraattachmentid} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ position: "relative", textAlign: "center" }}>
                      <a style={{ position: "absolute", top: -100 }} id={`ref-${a.cr4de_reference}`}></a>
                      {a.cr4de_reference}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Link
                        sx={{ "&:hover": { cursor: "pointer" } }}
                        onClick={async () => {
                          if (a) {
                            setIsDownloading(true);
                          }
                          await api.serveAttachmentFile(a);
                          setIsDownloading(false);
                        }}
                      >
                        {a.cr4de_name}
                      </Link>
                    </TableCell>
                    {user?.admin && !isExternal && <TableCell>{a.cr4de_field ? a.cr4de_field : "-"}</TableCell>}
                    <TableCell>
                      {a.cr4de_url ? t("source.type.link") : t("source.type.file")}
                      {user?.admin && a.cr4de_referencedSource ? "*" : ""}
                    </TableCell>
                    {user?.roles.analist && !isExternal && (
                      <TableCell align="center" sx={{ whiteSpace: "nowrap", textAlign: "right" }}>
                        {(!isExternal || a._cr4de_owner_value === user?.contactid) && (
                          <>
                            {a.cr4de_url && (
                              <IconButton
                                onClick={() => {
                                  handleEditAttachment(a);
                                }}
                              >
                                <EditIcon color="primary" />
                              </IconButton>
                            )}
                            <IconButton
                              onClick={() => {
                                handleRemoveAttachment(a.cr4de_bnraattachmentid);
                              }}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell sx={{ textAlign: "center" }} colSpan={4}>
                  <Trans i18nKey="source.list.noSources">No sources attached</Trans>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Collapse>
    </Box>
  );
}
