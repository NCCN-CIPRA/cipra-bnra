import { Box, Button, Stack, Typography } from "@mui/material";
import TextInputBox from "../../../components/TextInputBox";
import { useEffect, useState } from "react";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import useAPI from "../../../hooks/useAPI";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";

function CatalyzingEffect({
  riskFile,
  cascade,
  mode,
  attachments = null,
  updateAttachments = null,
  isEditingOther,
  setIsEditing,
  reloadCascades,
  allRisks,
}: {
  riskFile: DVRiskFile;
  cascade: DVRiskCascade<SmallRisk, SmallRisk>;
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<unknown>);
  isEditingOther: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadCascades: (riskFile: DVRiskFile) => Promise<unknown>;
  allRisks: SmallRisk[] | null;
}) {
  const getDefaultText = () => {
    return `<p style="font-size: 8pt;margin-bottom:0px;text-decoration:underline">Input from the ${
      riskFile.cr4de_title
    } panel:</p>
    ${cascade.cr4de_quali_cause || "<p>No input</p>"}
    <p><br></p>
    <p style="font-size: 8pt;margin-bottom:0px;text-decoration:underline">Input from the ${
      cascade.cr4de_effect_hazard.cr4de_title
    } panel:</p>
    ${cascade.cr4de_quali || "<p>No input</p>"}
    <p><br></p>
    <p><br></p>`;
  };

  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [iQuali, setIQuali] = useState<string>(
    cascade.cr4de_description || getDefaultText()
  );

  useEffect(
    () => setIQuali(cascade.cr4de_description || getDefaultText()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [riskFile]
  );

  useEffect(
    () => setIsEditing(editing),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editing]
  );

  const saveRiskFile = async (reset = false) => {
    setSaving(true);
    await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
      cr4de_description: reset ? null : iQuali,
    });
    if (reset) {
      setIQuali(getDefaultText());
    }
    reloadCascades(riskFile);

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
    <Box
      sx={{
        borderLeft: "solid 8px #eee",
        mt: 2,
        px: 2,
        py: 1,
        backgroundColor: "white",
      }}
    >
      <a
        href={`/risks/${cascade.cr4de_effect_hazard.cr4de_riskfilesid}/evolution`}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {cascade.cr4de_effect_hazard.cr4de_title}
        </Typography>
      </a>
      {!editing && (
        <Box
          className="htmleditor"
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
          dangerouslySetInnerHTML={{ __html: iQuali }}
        />
      )}
      {editing && (
        <Box
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        >
          <TextInputBox
            limitedOptions
            initialValue={iQuali}
            setUpdatedValue={(str) => setIQuali(str || "")}
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
              <Button
                color="error"
                loading={saving}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you wish to reset this field to default? All changes made to this field will be gone."
                    )
                  )
                    saveRiskFile(true);
                }}
              >
                Reset to default
              </Button>
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
    </Box>
  );
}

export default function CatalyzingSection({
  riskFile,
  cascades,
  mode,
  attachments = null,
  updateAttachments = null,
  isEditingOther,
  setIsEditing,
  reloadCascades,
  allRisks,
}: {
  riskFile: DVRiskFile;
  cascades: DVRiskCascade<SmallRisk, SmallRisk>[];
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<unknown>);
  isEditingOther: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadCascades: (riskFile: DVRiskFile) => Promise<unknown>;
  allRisks: SmallRisk[] | null;
}) {
  return (
    <>
      {cascades.map((c) => {
        return (
          <CatalyzingEffect
            key={c.cr4de_bnrariskcascadeid}
            riskFile={riskFile}
            cascade={c}
            mode={mode}
            attachments={attachments}
            updateAttachments={updateAttachments}
            isEditingOther={isEditingOther}
            setIsEditing={setIsEditing}
            reloadCascades={reloadCascades}
            allRisks={allRisks}
          />
        );
      })}
    </>
  );
}
