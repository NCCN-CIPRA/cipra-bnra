import { Box, Button, Stack } from "@mui/material";
import TextInputBox from "../../../components/TextInputBox";
import { useEffect, useState } from "react";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../../hooks/useAPI";
import { SCENARIO_SUFFIX } from "../../../functions/scenarios";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";

export default function CBSection({
  riskFile,
  scenarioSuffix,
  mode,
  attachments = null,
  updateAttachments = null,
  isEditingOther,
  setIsEditing,
  reloadRiskFile,
  allRisks,
}: {
  riskFile: DVRiskFile;
  scenarioSuffix: SCENARIO_SUFFIX;
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
  const [cb, setCB] = useState<string | null>(
    riskFile[`cr4de_cross_border_impact_quali${scenarioSuffix}`]
  );

  useEffect(
    () => setCB(riskFile[`cr4de_cross_border_impact_quali${scenarioSuffix}`]),
    [riskFile]
  );

  useEffect(() => setIsEditing(editing), [editing]);

  const saveRiskFile = async () => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      [`cr4de_cross_border_impact_quali${scenarioSuffix}`]: cb,
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

  return (
    <>
      {!editing && (
        <Box
          className="htmleditor"
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
          dangerouslySetInnerHTML={{ __html: cb || "" }}
        />
      )}
      {editing && (
        <Box
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        >
          <TextInputBox
            limitedOptions
            initialValue={cb}
            setUpdatedValue={(str) => setCB(str || "")}
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
