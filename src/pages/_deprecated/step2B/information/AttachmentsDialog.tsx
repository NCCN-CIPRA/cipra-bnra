import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import useLazyRecords from "../../../hooks/useLazyRecords";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { AuthPageContext } from "../../AuthPage";
import { useOutletContext } from "react-router-dom";

export default function AttachmentsDialog({
  field,
  riskFile,
  cascadeAnalysis,
  open,
  existingSource,
  onClose,
  onSaved,
}: {
  field: string;
  riskFile: DVRiskFile;
  cascadeAnalysis: DVCascadeAnalysis;
  open: boolean;
  existingSource?: DVAttachment;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const api = useAPI();
  const { user } = useOutletContext<AuthPageContext>();

  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const {
    data: allAttachments,
    loading: loadingAllAttachments,
    getData: loadAllAttachments,
  } = useLazyRecords<DVAttachment>({
    table: DataTable.ATTACHMENT,
    query: `$filter=_cr4de_owner_value eq '${user?.contactid}'`,
  });

  useEffect(() => {
    if (open && !allAttachments) {
      loadAllAttachments();
    }

    if (open && existingSource) {
      setTitle(existingSource.cr4de_name);
      setUrl(existingSource.cr4de_url);
    }
  }, [open]);

  const handlePickFile = () => {
    if (!inputRef.current) return;

    inputRef.current.click();
  };

  const handleSaveAttachment = async () => {
    if (!inputRef.current) return;

    const file = inputRef.current.files && inputRef.current.files[0];

    setIsSaving(true);

    if (existingSource) {
      await api.updateAttachmentFields(existingSource.cr4de_bnraattachmentid, {
        cr4de_name: title || (file && file.name),
        cr4de_url: url,
      });
    } else {
      await api.createAttachment(
        {
          "cr4de_owner@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
          cr4de_name: title || (file && file.name),
          cr4de_field: field,
          cr4de_url: url,
          ...(riskFile
            ? {
                "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
              }
            : {}),
          ...(cascadeAnalysis
            ? {
                "cr4de_cascadeanalysis@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises( ${cascadeAnalysis.cr4de_bnracascadeanalysisid})`,
              }
            : {}),
        },
        file
      );
    }

    setTitle(null);
    setUrl(null);

    await onSaved();

    setIsSaving(false);
    onClose();
  };

  const handleAddPreviousSource = async (a: DVAttachment) => {
    setIsSaving(true);

    await api.createAttachment(
      {
        "cr4de_owner@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
        cr4de_field: field,
        "cr4de_referencedSource@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnraattachments(${a.cr4de_bnraattachmentid})`,
        ...(riskFile
          ? {
              "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
            }
          : {}),
        ...(cascadeAnalysis
          ? {
              "cr4de_cascadeanalysis@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnracascadeanalysises(${cascadeAnalysis.cr4de_bnracascadeanalysisid})`,
            }
          : {}),
      },
      null
    );

    await onSaved();

    setIsSaving(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth={!isSaving}
      sx={{ maxHeight: 500, width: "100%" }}
    >
      <input
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onInput={handleSaveAttachment}
      />
      <DialogTitle>
        <Trans i18nKey="source.dialog.title">Provide source material</Trans>
      </DialogTitle>
      {isSaving ? (
        <DialogContent sx={{ textAlign: "center" }}>
          <Box sx={{ mt: 2 }}>
            <CircularProgress size={20} />
          </Box>
          <DialogContentText>
            <Trans i18nKey="source.dialog.savingText">Saving new source.</Trans>
          </DialogContentText>
        </DialogContent>
      ) : (
        <>
          <DialogContent>
            <Grid container spacing={4}>
              <Grid size={4}>
                <DialogContentText>
                  <Trans i18nKey="source.dialog.helpText.onlineSource">
                    Please provide a title and a web url for the online source,
                  </Trans>
                </DialogContentText>
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
              {!existingSource && (
                <>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ ml: 2, mr: -2 }}
                  />
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    size={4}
                  >
                    <DialogContentText>
                      <Trans i18nKey="source.dialog.helpText.uploadSource">
                        upload a file from your computer,
                      </Trans>
                    </DialogContentText>
                    <Button
                      variant="outlined"
                      startIcon={<UploadFileIcon />}
                      onClick={handlePickFile}
                      sx={{ mb: 4 }}
                    >
                      <Trans i18nKey="source.dialog.uploadFile">
                        Upload File
                      </Trans>
                    </Button>
                  </Grid>
                </>
              )}
              {!existingSource && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ mr: -2 }} />
                  <Grid
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    size={4}
                  >
                    <DialogContentText>
                      <Trans i18nKey="source.dialog.helpText.reuseSource">
                        or reference a source you have previously used:
                      </Trans>
                    </DialogContentText>
                    {allAttachments ? (
                      <List
                        sx={{
                          maxHeight: 160,
                          overflowY: "scroll",
                          width: "100%",
                          mt: 2,
                          border: "1px solid #eee",
                        }}
                      >
                        {allAttachments.map((a) => (
                          <ListItem
                            key={a.cr4de_bnraattachmentid}
                            disablePadding
                          >
                            <ListItemButton
                              onClick={() => handleAddPreviousSource(a)}
                            >
                              <ListItemText primary={a.cr4de_name} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Box sx={{ textAlign: "center", mt: 2 }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>
              <Trans i18nKey="source.dialog.cancel">Cancel</Trans>
            </Button>
            <Button onClick={handleSaveAttachment}>
              <Trans i18nKey="source.dialog.addSource">Add source</Trans>
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
