import { Box, Button, Stack, Typography } from "@mui/material";
import TextInputBox from "../../../components/TextInputBox";
import { useEffect, useMemo, useState } from "react";
import { DVRiskFile, RISKFILE_RESULT_FIELD } from "../../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../../hooks/useAPI";
import getImpactColor from "../../../functions/getImpactColor";
import { Effect, IMPACT_CATEGORY } from "../../../functions/Impact";
import { getScenarioParameter, SCENARIOS } from "../../../functions/scenarios";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import round from "../../../functions/roundNumberString";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";

export default function ImpactSection({
  riskFile,
  effects,
  scenario,
  impactName,
  mode,
  attachments = null,
  updateAttachments = null,
  isEditingOther,
  setIsEditing,
  reloadRiskFile,
  allRisks,
}: {
  riskFile: DVRiskFile;
  effects: Effect[];
  scenario: SCENARIOS;
  impactName: "human" | "societal" | "environmental" | "financial";
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<unknown>);
  isEditingOther: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
  allRisks: SmallRisk[] | null;
}) {
  const impactLetter = impactName[0] as "h" | "s" | "e" | "f";
  const impactLetterUC = impactLetter.toUpperCase() as IMPACT_CATEGORY;

  const ti = getScenarioParameter(riskFile, "TI", scenario) || 0.00001;
  // const impactTI = effects.reduce((tot, e) => tot + e[impactLetter], 0) ;
  const impactTI = getScenarioParameter(riskFile, `TI_${impactLetterUC}`, scenario) || 0.00001;
  console.log(effects.reduce((tot, e) => tot + e.h, 0));
  const paretoEffects = useMemo(() => {
    return effects
      .sort((a, b) => b[impactLetter] - a[impactLetter])
      .reduce(
        ([cumulEffects, iCumul], e) => {
          if (iCumul > 0.8 * impactTI && cumulEffects.length >= 3) return [cumulEffects, iCumul] as [Effect[], number];

          return [[...cumulEffects, e], iCumul + e[impactLetter]] as [Effect[], number];
        },
        [[], 0] as [Effect[], number]
      )[0];
  }, [riskFile, effects]);

  const getDefaultText = () => {
    const text = `
          <p style="font-size:10pt;font-family: Arial">
          The ${impactName} impact represents an estimated <b>${round(
      (100 * impactTI) / ti
    )}%</b> of the total impact of an
        incident of this magnitude. Possible explanations for the ${impactName} impact are:
          </p>
          <p><br></p>
        `;

    const descriptions = paretoEffects
      .map((e, i) => {
        const riskName = e.id ? `<a href="/risks/${e.id}" target="_blank">${e.name}</a>` : `<a href="">${e.name}</a>`;

        if (e.quali_cause) {
          return `<p style="font-weight:bold;font-size:10pt;font-family: Arial"">
                    ${i + 1}. ${riskName}
                    </p>
                    <p style="font-size:10pt;font-family: Arial">
                      <b>${round(100 * e[impactLetter])}%</b> of total ${impactName} impact -
                      <b>${round((100 * e[impactLetter] * impactTI) / ti)}%</b> of total impact
                    </p>
                    <p><br></p>
                    <p style="font-size: 8pt;margin-bottom:0px;text-decoration:underline">Input from the ${
                      riskFile.cr4de_title
                    } panel:</p>
                    ${e.quali_cause || e[`quali_${impactLetter}`]}
                    <p><br></p>
                    <p style="font-size: 8pt;margin-bottom:0px;text-decoration:underline">Input from the ${
                      e.name
                    } panel:</p>
                    ${e.quali || e[`quali_${impactLetter}`]}
                    <p><br></p>
              <p><br></p>`;
        } else {
          return `<p style="font-weight:bold;font-size:10pt;font-family: Arial"">
                    ${i + 1}. ${riskName}
                    </p>
                    <p style="font-size:10pt;font-family: Arial">
                      <b>${round(100 * e[impactLetter])}%</b> of total ${impactName} impact -
                      <b>${round((100 * e[impactLetter] * impactTI) / ti)}%</b> of total impact
                    </p>
                    <p><br></p>
                    ${e.quali || e[`quali_${impactLetter}`]}
                    <p><br></p>
              <p><br></p>`;
        }
      })
      .join("\n");

    return text + descriptions;
  };

  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [iQuali, setIQuali] = useState<string>(riskFile[`cr4de_mrs_impact_${impactLetter}`] || getDefaultText());

  useEffect(() => setIQuali(riskFile[`cr4de_mrs_impact_${impactLetter}`] || getDefaultText()), [riskFile]);

  useEffect(() => setIsEditing(editing), [editing]);

  const saveRiskFile = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      [`cr4de_mrs_impact_${impactLetter}`]: reset ? null : iQuali,
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
    <Box
      sx={{ borderLeft: "solid 8px " + getImpactColor(impactLetterUC), px: 2, py: 1, mt: 2, backgroundColor: "white" }}
    >
      <Typography variant="h6">
        {impactLetter.toUpperCase()}
        {impactName.slice(1)} Impact
      </Typography>
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
