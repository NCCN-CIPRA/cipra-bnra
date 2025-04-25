import { Box, Button, Stack } from "@mui/material";
import TextInputBox from "../../components/TextInputBox";
import { useEffect, useState } from "react";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import useAPI from "../../hooks/useAPI";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";

export default function DefinitionSection({
  riskFile,
  attachments = null,
  updateAttachments = null,
  mode,
  isEditingOther,
  setIsEditing,
  reloadRiskFile,
  allRisks,
}: {
  riskFile: DVRiskFile;
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<unknown>);
  mode: "view" | "edit";
  isEditingOther: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
  allRisks: SmallRisk[] | null;
}) {
  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [definition, setDefinition] = useState<string | null>(
    riskFile.cr4de_definition
  );

  useEffect(
    () => setIsEditing(editing),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editing]
  );

  const saveRiskFile = async () => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_definition: definition,
    });
    reloadRiskFile();

    setEditing(false);
    // await reloadRiskFile();
    setSaving(false);
    // setOpen(false);
  };

  const startEdit = () => {
    if (isEditingOther) {
      window.alert(
        "You are already editing another section. Please close this section before editing another."
      );
    } else {
      setEditing(true);
    }
  };

  useEffect(() => {
    setDefinition(riskFile.cr4de_definition);
  }, [riskFile]);

  return (
    <>
      {!editing && (
        <Box
          className="htmleditor"
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
          dangerouslySetInnerHTML={{ __html: definition || "" }}
        />
      )}
      {editing && (
        <Box
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        >
          <TextInputBox
            limitedOptions
            initialValue={definition}
            setUpdatedValue={(str) => setDefinition(str || "")}
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
              <Button onClick={startEdit}>Edit</Button>
              <Box sx={{ flex: 1 }} />
            </>
          )}
          {editing && (
            <>
              <Button loading={saving} onClick={() => saveRiskFile()}>
                Save
              </Button>
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
