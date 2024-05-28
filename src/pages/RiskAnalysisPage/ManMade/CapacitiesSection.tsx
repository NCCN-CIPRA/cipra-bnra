import { Box, Button, Stack, Typography } from "@mui/material";
import { IntensityParameter } from "../../../functions/intensityParameters";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { SCENARIOS, SCENARIO_PARAMS, unwrap } from "../../../functions/scenarios";
import { useState } from "react";
import TextInputBox from "../../../components/TextInputBox";
import useAPI from "../../../hooks/useAPI";
import { LoadingButton } from "@mui/lab";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";

export default function Scenario({
  intensityParameters,
  riskFile,
  scenario,
  mode,
  attachments = null,
  updateAttachments = null,
}: {
  intensityParameters: IntensityParameter[];
  riskFile: DVRiskFile;
  scenario: SCENARIOS;
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<void>);
}) {
  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [mrsScenario, setMrsScenario] = useState<string | null>(riskFile.cr4de_mrs_scenario);

  const scenarios = unwrap(
    intensityParameters,
    riskFile.cr4de_scenario_considerable,
    riskFile.cr4de_scenario_major,
    riskFile.cr4de_scenario_extreme
  );

  const getDefaultText = () => {
    return `
      <p style="font-size:14px;">
        The <i>${scenario}</i> scenario was identified as the <i>Most Relevant Scenario</i>. This means that it
        represent the highest amount of risk (probability x impact) of the three scenarios. It can be summarized as
        follows:
      </p>
      <p></p>
      ${scenarios[scenario][0].value}
    `;
  };

  const saveScenario = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_mrs_scenario: reset ? null : mrsScenario,
    });
    if (reset) {
      setMrsScenario(null);
    }
    setEditing(false);
    // await reloadRiskFile();
    setSaving(false);
    // setOpen(false);
  };

  return (
    <Box sx={{ borderLeft: "solid 8px " + SCENARIO_PARAMS[scenario].color, pl: 2, py: 1, mt: 2, background: "white" }}>
      {editing && (
        <Box sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
          <TextInputBox
            limitedOptions
            initialValue={mrsScenario || getDefaultText()}
            setUpdatedValue={(str) => setMrsScenario(str || null)}
            sources={attachments}
            updateSources={updateAttachments}
          />
        </Box>
      )}
      {!editing && mrsScenario && <Box className="htmleditor" dangerouslySetInnerHTML={{ __html: mrsScenario }} />}
      {!editing && !mrsScenario && (
        <>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Actors of this type with <i>{scenario}</i> capabilities were identified as the{" "}
            <i>most relevant actor group</i>. This means that they represent the highest amount of risk (motivation x
            impact). They can be described as follows:
          </Typography>
          <Box sx={{ mb: 2 }} dangerouslySetInnerHTML={{ __html: scenarios[scenario][0].value }} />
        </>
      )}
      <div style={{ clear: "both" }} />
      {mode === "edit" && (
        <Stack direction="row" sx={{ borderTop: "1px solid #eee", pt: 1, mr: 2 }}>
          {!editing && (
            <>
              <Button onClick={() => setEditing(true)}>Edit</Button>
              <Box sx={{ flex: 1 }} />
              <LoadingButton
                color="error"
                loading={saving}
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you wish to reset this field to default? All changes made to this field will be gone."
                    )
                  )
                    saveScenario(true);
                }}
              >
                Reset to default
              </LoadingButton>
            </>
          )}
          {editing && (
            <>
              <LoadingButton loading={saving} onClick={() => saveScenario()}>
                Save
              </LoadingButton>
              <Box sx={{ flex: 1 }} />
              <Button
                color="warning"
                onClick={() => {
                  if (window.confirm("Are you sure you wish to discard your changes?")) setEditing(false);
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
