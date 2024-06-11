import { Box, Button, Stack, Typography } from "@mui/material";
import { CascadeCalculation, RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";
import TextInputBox from "../../../components/TextInputBox";
import { useEffect, useMemo, useState } from "react";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../../hooks/useAPI";
import getImpactColor from "../../../functions/getImpactColor";
import { Effect, IMPACT_CATEGORY, getIndirectImpact } from "../../../functions/Impact";
import {
  SCENARIOS,
  SCENARIO_LETTER,
  SCENARIO_SUFFIX,
  getScenarioLetter,
  getScenarioSuffix,
} from "../../../functions/scenarios";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import round from "../../../functions/roundNumberString";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { getLargestCascade } from "../../../functions/cascades";

type MMEffect = Effect & {
  cpMax: number;
};

export default function MMImpactSection({
  riskFile,
  effects,
  scenario,
  calc,
  mode,
  attachments = null,
  updateAttachments = null,
  isEditingOther,
  setIsEditing,
  reloadRiskFile,
  allRisks,
}: {
  riskFile: DVRiskFile;
  effects: DVRiskCascade[];
  scenario: SCENARIOS;
  calc: RiskCalculation;
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<unknown>);
  isEditingOther: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
  allRisks: SmallRisk[] | null;
}) {
  const cDict = useMemo(
    () =>
      effects.reduce(
        (acc, e) => ({
          ...acc,
          [e.cr4de_bnrariskcascadeid]: e,
        }),
        {} as { [id: string]: DVRiskCascade }
      ),
    [effects]
  );
  const scenarioLetter = getScenarioLetter(scenario);
  const scenarioSuffix = getScenarioSuffix(scenario);

  const largestEffects = calc.effects.map((e) => {
    const largestCascade = getLargestCascade(scenarioLetter, e);

    return {
      ...getIndirectImpact(e, calc, scenarioSuffix, cDict[e.cascadeId]),
      cpMax: e[largestCascade],
    };
  });
  const totP = largestEffects.reduce((p, e) => p + e.cpMax, 0);
  const impactTI = Math.round(calc[`ti${scenarioSuffix}`] as number);

  const CPParetoEffects = useMemo(() => {
    return largestEffects
      .sort((a, b) => b.cpMax - a.cpMax)
      .reduce(
        ([cumulEffects, cpCumul], e) => {
          if (cpCumul > 0.8 && cumulEffects.length >= 3) return [cumulEffects, cpCumul] as [MMEffect[], number];

          return [[...cumulEffects, e], cpCumul + e.cpMax / totP] as [MMEffect[], number];
        },
        [[], 0] as [MMEffect[], number]
      )[0];
  }, [riskFile, effects]);

  const IParetoEffects = useMemo(() => {
    return largestEffects
      .sort((a, b) => b.i - a.i)
      .reduce(
        ([cumulEffects, iCumul], e) => {
          if (iCumul > 0.8 && cumulEffects.length >= 3) return [cumulEffects, iCumul] as [MMEffect[], number];

          return [[...cumulEffects, e], iCumul + e.i] as [MMEffect[], number];
        },
        [[], 0] as [MMEffect[], number]
      )[0];
  }, [riskFile, effects]);

  const impactEffects = IParetoEffects.filter((e) => CPParetoEffects.indexOf(e) < 0);

  const getDefaultText = () => {
    const text = `
          <p style="font-size:10pt;font-family: Arial">
          The following actions may not usually be preferred by these actors, but are still considered of interest due to the high impact
          a potential incident may have:
          </p>
          <p><br></p>
        `;

    const descriptions = impactEffects
      .map((e, i) => {
        const riskName = e.id ? `<a href="/risks/${e.id}" target="_blank">${e.name}</a>` : e.name;

        return `<p style="font-weight:bold;font-size:10pt;font-family: Arial"">
                    ${i + 1}. ${riskName} 
                    </p>
                    <p style="font-size:10pt;font-family: Arial">
                      <b>${round((100 * e.cp) / totP)}%</b> relative preference for this type of action -
                      <b>${round((100 * (e.i * impactTI)) / calc.ti)}%</b> of total impact
                    </p>
                    <p><br></p>
                    <p style="font-size: 8pt;margin-bottom:0px;text-decoration:underline">Input from the ${
                      riskFile.cr4de_title
                    } panel:</p>
                    ${e.quali_cause || "<p>No input</p>"}
                    <p><br></p>
                    <p style="font-size: 8pt;margin-bottom:0px;text-decoration:underline">Input from the ${
                      e.name
                    } panel:</p>
                    ${e.quali || "<p>No input</p>"}
                    <p><br></p>
              <p><br></p>`;
      })
      .join("\n");

    return text + descriptions;
  };

  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [iQuali, setIQuali] = useState<string>(riskFile.cr4de_mrs_mm_impact || getDefaultText());

  useEffect(() => setIQuali(riskFile.cr4de_mrs_mm_impact || getDefaultText()), [riskFile]);

  useEffect(() => setIsEditing(editing), [editing]);

  const saveRiskFile = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_mrs_mm_impact: reset ? null : iQuali,
    });
    if (reset) {
      setIQuali(getDefaultText());
    }
    reloadRiskFile();

    setEditing(false);
    // await reloadRiskFile();
    setSaving(false);
    // setOpen(false);
  };

  const startEdit = () => {
    if (isEditingOther) {
      window.alert("You are already editing another section. Please close this section before editing another.");
    } else {
      setEditing(true);
    }
  };

  return (
    <Box sx={{ borderLeft: "solid 8px " + getImpactColor("S"), px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
      {!editing && (
        <Box
          className="htmleditor"
          sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
          dangerouslySetInnerHTML={{ __html: iQuali }}
        />
      )}
      {editing && (
        <Box sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
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
        <Stack direction="row" sx={{ borderTop: "1px solid #eee", pt: 1, mr: 2 }}>
          {!editing && (
            <>
              <Button onClick={startEdit}>Edit</Button>
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
    </Box>
  );
}
