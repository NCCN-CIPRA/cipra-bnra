import { Box, Button, Stack } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import {
  SCENARIOS,
  SCENARIO_PARAMS,
  unwrap,
} from "../../../functions/scenarios";
import * as IP from "../../../functions/intensityParameters";
import { useEffect, useState } from "react";
import TextInputBox from "../../../components/TextInputBox";
import useAPI from "../../../hooks/useAPI";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";

export default function Scenario({
  riskFile,
  scenario,
  mode,
  attachments = null,
  updateAttachments = null,
  isEditingOther,
  setIsEditing,
  reloadRiskFile,
  allRisks,
}: {
  riskFile: DVRiskFile;
  scenario: SCENARIOS;
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

  useEffect(
    () => setIsEditing(editing),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editing]
  );

  const intensityParameters = IP.unwrap(riskFile.cr4de_intensity_parameters);
  const scenarios = unwrap(
    intensityParameters,
    riskFile.cr4de_scenario_considerable,
    riskFile.cr4de_scenario_major,
    riskFile.cr4de_scenario_extreme
  );

  const getDefaultText = () => {
    const text = `
      <p style="font-size:10pt;font-family: Arial">
        The <i>${scenario}</i> scenario of <b>${riskFile.cr4de_title}</b> was identified as the most relevant scenario. This means that it represent the highest amount of risk (probability x impact) of the three scenarios, as visualised in the risk matrix to the right.
      </p>
      <p></p>
    `;
    const descriptions = scenarios[scenario]
      .map(
        (ip) =>
          `<p>&nbsp;</p><p style="font-weight:bold;font-size:10pt;font-family: Arial">
          ${ip.name}
        </p>
        <div style="font-weight:normal;font-family: Arial;font-size:10px !important;font-style:italic;margin-left:10px">
          ${ip.description}
        </div>
        <p style="font-size:10pt;font-family: Arial">
            ${ip.value}
          </p>
          <p></p>`
      )
      .join("\n");

    return text + descriptions;
  };

  const [mrsScenario, setMrsScenario] = useState<string>(
    riskFile.cr4de_mrs_scenario || getDefaultText()
  );

  useEffect(
    () => setMrsScenario(riskFile.cr4de_mrs_scenario || getDefaultText()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [riskFile]
  );

  const saveScenario = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_mrs_scenario: reset ? null : mrsScenario,
    });
    if (reset) {
      setMrsScenario(getDefaultText());
    }
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
    <Box
      sx={{
        borderLeft: "solid 8px " + SCENARIO_PARAMS[scenario].color,
        pl: 2,
        py: 1,
        mt: 2,
        background: "white",
      }}
    >
      {editing && (
        <Box
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
        >
          <TextInputBox
            limitedOptions
            initialValue={mrsScenario || getDefaultText()}
            setUpdatedValue={(str) => setMrsScenario(str || "")}
            sources={attachments}
            updateSources={updateAttachments}
            allRisks={allRisks}
          />
        </Box>
      )}
      {!editing && (
        <Box
          className="htmleditor"
          dangerouslySetInnerHTML={{ __html: mrsScenario }}
        />
      )}
      <div style={{ clear: "both" }} />
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
                    saveScenario(true);
                }}
              >
                Reset to default
              </Button>
            </>
          )}
          {editing && (
            <>
              <Button loading={saving} onClick={() => saveScenario()}>
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
