import { Box, Button, Stack } from "@mui/material";
import { RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";
import TextInputBox from "../../../components/TextInputBox";
import { useEffect, useMemo, useState } from "react";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../../hooks/useAPI";
import { Cause, getYearlyProbability } from "../../../functions/Probability";
import { SCENARIOS, SCENARIO_SUFFIX, getScenarioSuffix } from "../../../functions/scenarios";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import round from "../../../functions/roundNumberString";

export default function ProbabilitySection({
  riskFile,
  causes,
  scenario,
  calc,
  mode,
  attachments = null,
  updateAttachments = null,
  setIsEditing,
  reloadRiskFile,
}: {
  riskFile: DVRiskFile;
  causes: Cause[];
  scenario: SCENARIOS;
  calc: RiskCalculation;
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<unknown>);
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
}) {
  const scenarioSuffix = getScenarioSuffix(scenario);

  const paretoCauses = useMemo(() => {
    return causes
      .sort((a, b) => b.p - a.p)
      .reduce(
        ([cumulCauses, pCumul], c) => {
          if (pCumul / calc[`tp${scenarioSuffix}`] > 0.8) return [cumulCauses, pCumul] as [Cause[], number];

          return [[...cumulCauses, c], pCumul + c.p] as [Cause[], number];
        },
        [[], 0] as [Cause[], number]
      )[0];
  }, [riskFile, causes]);

  const getDefaultText = () => {
    const text = `
          <p style="font-size:10pt;">
          There is an estimated <b>${round(100 * getYearlyProbability(calc[`tp${scenarioSuffix}`]))}%</b> chance
          for a ${scenario} ${riskFile.cr4de_title.toLocaleLowerCase()} to occur in the next 12 months. The following possible underlying causes for
          such an incident were identified:
          </p>
          <p><br></p>
        `;

    const descriptions = paretoCauses
      .map((c, i) => {
        const riskName = c.id ? `<a href="/risks/${c.id}" target="_blank">${c.name}</a>` : c.name;

        return `<p style="font-weight:bold;font-size:10pt;">
                    ${i + 1}. ${riskName} (${round((100 * c.p) / calc[`tp${scenarioSuffix}`])}% of total probability)
                    </p>
                    <p><br></p>
                    ${c.quali}
                    <p><br></p>
              <p><br></p>`;
      })
      .join("\n");

    return text + descriptions;
  };

  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [probQuali, setProbQuali] = useState<string>(riskFile.cr4de_mrs_probability || getDefaultText());

  useEffect(() => setProbQuali(riskFile.cr4de_mrs_probability || getDefaultText()), [riskFile]);

  useEffect(() => setIsEditing(editing), [editing]);

  const saveRiskFile = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_mrs_probability: reset ? null : probQuali,
    });
    if (reset) {
      setProbQuali(getDefaultText());
    }
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
          dangerouslySetInnerHTML={{ __html: probQuali }}
        />
      )}
      {editing && (
        <Box sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
          <TextInputBox
            limitedOptions
            initialValue={probQuali}
            setUpdatedValue={(str) => setProbQuali(str || "")}
            sources={attachments}
            updateSources={updateAttachments}
          />
        </Box>
      )}
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
                    saveRiskFile(true);
                }}
              >
                Reset to default
              </LoadingButton>
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
                  if (window.confirm("Are you sure you wish to discard your changes?")) setEditing(false);
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
