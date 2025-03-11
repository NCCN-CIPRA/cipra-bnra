import { Box, Button, Stack, Typography } from "@mui/material";
import TextInputBox from "../../components/TextInputBox";
import { useEffect, useState } from "react";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../hooks/useAPI";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function DisclaimerSection({
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
  const [disclaimer, setDisclaimer] = useState<string | null>(
    riskFile.cr4de_mrs_disclaimer
  );

  useEffect(() => setIsEditing(editing), [editing]);

  const saveRiskFile = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_mrs_disclaimer: reset ? null : disclaimer,
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
    setDisclaimer(riskFile.cr4de_mrs_disclaimer);
  }, [riskFile]);

  if (!disclaimer && mode !== "edit") return null;

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5">Disclaimer</Typography>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          borderLeft: `solid 8px ${SCENARIO_PARAMS[SCENARIOS.EXTREME].color}`,
          px: 2,
          py: 1,
          mt: 2,
          backgroundColor: "white",
        }}
      >
        {disclaimer && (
          <WarningAmberIcon
            sx={{ color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color }}
          />
        )}
        <Box sx={{ flex: 1, ml: 2 }}>
          {!editing && (
            <Box
              className="htmleditor"
              sx={{
                mb: 4,
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
              }}
              dangerouslySetInnerHTML={{ __html: disclaimer || "" }}
            />
          )}
          {editing && (
            <Box
              sx={{
                mb: 4,
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
              }}
            >
              <TextInputBox
                limitedOptions
                initialValue={disclaimer}
                setUpdatedValue={(str) => setDisclaimer(str || "")}
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
                  {disclaimer && (
                    <LoadingButton
                      loading={saving}
                      color="error"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you wish to remove the disclaimer?"
                          )
                        )
                          saveRiskFile(true);
                      }}
                    >
                      Remove
                    </LoadingButton>
                  )}
                </>
              )}
              {editing && (
                <>
                  <LoadingButton
                    loading={saving}
                    onClick={() => saveRiskFile()}
                  >
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
        </Box>
      </Stack>
    </Box>
  );
}
