import { Box, Button, Stack } from "@mui/material";
import TextInputBox from "../../../components/TextInputBox";
import { useEffect, useState } from "react";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../../hooks/useAPI";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";

export default function HASection({
  riskFile,
  mode,
  attachments = null,
  updateAttachments = null,
  setIsEditing,
  reloadRiskFile,
  allRisks,
}: {
  riskFile: DVRiskFile;
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<unknown>);
  isEditingOther: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
  allRisks: SmallRisk[] | null;
}) {
  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [ha, setHA] = useState<string | null>(riskFile.cr4de_horizon_analysis);

  useEffect(() => setHA(riskFile.cr4de_horizon_analysis), [riskFile]);

  useEffect(
    () => setIsEditing(editing),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editing]
  );

  const saveRiskFile = async () => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_horizon_analysis: ha,
    });
    reloadRiskFile();

    setEditing(false);
    // await reloadRiskFile();
    setSaving(false);
    // setOpen(false);
  };

  return (
    <>
      {!editing && (
        <Box
          className="htmleditor"
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
          dangerouslySetInnerHTML={{ __html: ha || "" }}
        />
      )}
      {editing && (
        <Box
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        >
          <TextInputBox
            limitedOptions
            initialValue={ha}
            setUpdatedValue={(str) => setHA(str || "")}
            sources={attachments}
            updateSources={updateAttachments}
            allRisks={allRisks}
          />
        </Box>
      )}
      {mode === "edit" && (
        <Stack
          direction="row"
          sx={{ borderTop: "1px solid #eee", pt: 1, mr: 2 }}
        >
          {!editing && (
            <>
              <Button onClick={() => setEditing(true)}>Edit</Button>
              <Box sx={{ flex: 1 }} />
            </>
          )}
          {editing && (
            <>
              <LoadingButton loading={saving} onClick={() => saveRiskFile()}>
                Save
              </LoadingButton>
              <Box sx={{ flex: 1 }} />
              <Button
                color="warning"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you wish to discard your changes?"
                    )
                  )
                    setEditing(false);
                }}
              >
                Discard Changes
              </Button>
            </>
          )}
        </Stack>
      )}
    </>
  );
}
