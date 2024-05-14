import { Box, Button, Stack, Typography } from "@mui/material";
import ProbabilityOriginPieChart from "../../components/charts/ProbabilityOriginPieChart";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { getYearlyProbability } from "../../functions/Probability";
import TextInputBox from "../../components/TextInputBox";
import { useMemo, useState } from "react";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../hooks/useAPI";
import getImpactColor from "../../functions/getImpactColor";
import { Effect, IMPACT_CATEGORY } from "../../functions/Impact";
import { SCENARIO_SUFFIX } from "../../functions/scenarios";
import { DVAttachment } from "../../types/dataverse/DVAttachment";

export default function ImpactSection({
  riskFile,
  effects,
  scenarioSuffix,
  impactName,
  calc,
  mode,
  attachments = null,
  updateAttachments = null,
}: {
  riskFile: DVRiskFile;
  effects: Effect[];
  scenarioSuffix: SCENARIO_SUFFIX;
  impactName: "human" | "societal" | "environmental" | "financial";
  calc: RiskCalculation;
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<void>);
}) {
  const impactLetter = impactName[0] as "h" | "s" | "e" | "f";
  const impactLetterUC = impactLetter.toUpperCase() as IMPACT_CATEGORY;

  const impactTI = Math.round(
    ((calc[`ti_${impactLetterUC}a${scenarioSuffix}`] as number) || 0) +
      ((calc[`ti_${impactLetterUC}b${scenarioSuffix}` as keyof typeof calc] as number) || 0) +
      ((calc[`ti_${impactLetterUC}c${scenarioSuffix}` as keyof typeof calc] as number) || 0) +
      ((calc[`ti_${impactLetterUC}d${scenarioSuffix}` as keyof typeof calc] as number) || 0)
  );

  const paretoEffects = useMemo(() => {
    return effects
      .sort((a, b) => b[impactLetter] - a[impactLetter])
      .reduce(
        ([cumulEffects, iCumul], e) => {
          if (iCumul > 0.8 && cumulEffects.length >= 3) return [cumulEffects, iCumul] as [Effect[], number];
          console.log(iCumul);
          return [[...cumulEffects, e], iCumul + e[impactLetter]] as [Effect[], number];
        },
        [[], 0] as [Effect[], number]
      )[0];
  }, [riskFile, effects]);

  const getDefaultText = () => {
    const text = `
          <p style="font-size:14px;">
          The ${impactName} impact represents an estimated <b>${Math.round(
      (100 * impactTI) / calc.ti
    )}%</b> of the total impact of an
        incident of this magnitude. Possible explanation for the ${impactName} impact are:
          </p>
          <p><br></p>
        `;

    const descriptions = paretoEffects
      .map((e, i) => {
        const riskName = e.id ? `<a href="/risks/${e.id}" target="_blank">${e.name}</a>` : e.name;

        return `<p style="font-weight:bold;font-size:14px;">
                    ${i + 1}. ${riskName} 
                    </p>
                    <p style="font-size:14px;">
                      <b>${Math.round(10000 * e[impactLetter]) / 100}%</b> of total ${impactName} impact -
                      <b>${Math.round((10000 * e[impactLetter] * impactTI) / calc.ti) / 100}%</b> of total impact
                    </p>
                    <p><br></p>
                    ${e.quali || e[`quali_${impactLetter}`]}
                    <p><br></p>
              <p><br></p>`;
      })
      .join("\n");

    return text + descriptions;
  };

  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [iQuali, setIQuali] = useState<string>(riskFile[`cr4de_mrs_impact_${impactLetter}`] || getDefaultText());

  const saveRiskFile = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      [`cr4de_mrs_impact_${impactLetter}`]: reset ? null : iQuali,
    });
    if (reset) {
      setIQuali(getDefaultText());
    }
    setEditing(false);
    // await reloadRiskFile();
    setSaving(false);
    // setOpen(false);
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
    </Box>
  );
}
