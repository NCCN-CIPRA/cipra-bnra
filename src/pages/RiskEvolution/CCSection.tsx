import { Box, Button, Stack } from "@mui/material";
import TextInputBox from "../../components/TextInputBox";
import { useEffect, useState } from "react";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../hooks/useAPI";
import { Cause as Cause2023 } from "../../functions/Probability";
import ClimateChangeChart from "../../components/charts/ClimateChangeChart";
import { getCascadeParameter, getScenarioParameter, getScenarioSuffix, SCENARIOS } from "../../functions/scenarios";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { DVAttachment } from "../../types/dataverse/DVAttachment";

type Cause2050 = Cause2023 & {
  p2050: number;
};

export default function CCSection({
  riskFile,
  causes,
  cc,
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
  causes: DVRiskCascade<SmallRisk, unknown>[];
  cc: DVRiskCascade<SmallRisk, unknown> | null;
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
  const [ccQuanti, setCCQuanti] = useState<Cause2050[] | null>(null);
  const [ccQuali, setCCQuali] = useState<string | null>(riskFile.cr4de_mrs_cc || null);

  useEffect(() => setCCQuali(riskFile.cr4de_mrs_cc || null), [riskFile]);

  useEffect(() => setIsEditing(editing), [editing]);

  const scenarioSuffix = getScenarioSuffix(scenario);
  useEffect(() => {
    const tp50 = getScenarioParameter(riskFile, "TP50", scenario) || 0.000001;

    const allCauses = [
      {
        id: null,
        name: "No underlying cause",
        p: getScenarioParameter(riskFile, "DP", scenario) || 0.000001,
        p2050: getScenarioParameter(riskFile, "DP50", scenario) || 0.000001,
      },
      ...(causes
        .filter((c) => getCascadeParameter(c, scenario, "IP50") !== 0)
        .map((c) => {
          return {
            id: c.cr4de_cause_hazard.cr4de_riskfilesid,
            name: c.cr4de_cause_hazard.cr4de_title,
            p: getCascadeParameter(c, scenario, "IP") || 0.000001,
            p2050: getCascadeParameter(c, scenario, "IP50") || 0.000001,
          };
        }) || []),
    ]
      .sort((a, b) => b.p2050 - a.p2050)
      .reduce(
        ([cumulCauses, pCumul], c, i) => {
          if (pCumul / tp50 > 0.8 && i > 2) return [cumulCauses, pCumul] as [Cause2050[], number];

          return [[...cumulCauses, c], pCumul + c.p2050] as [Cause2050[], number];
        },
        [[], 0] as [Cause2050[], number]
      )[0];
    console.log(allCauses, causes);
    setCCQuanti(allCauses);

    if (ccQuali === null) {
      setCCQuali(
        allCauses
          .map((c, i) => {
            if (c.id) return `<a href="/risks/${c.id}" target="_blank">${c.name}</a>`;

            return (
              "<p style='font-weight:bold'>No underlying cause</p><p>" +
              cc?.cr4de_quali +
              "</p><p>" +
              cc?.cr4de_quali_cause +
              "</p>"
            );
          })
          .join("<br />")
      );
    }
  }, [riskFile, causes, scenarioSuffix]);

  const saveRiskFile = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_mrs_cc: ccQuali,
    });
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
    <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
      <Box sx={{ margin: "auto", width: "750px" }}>
        <ClimateChangeChart riskFile={riskFile} causes={causes} scenario={scenario} />
      </Box>
      <Box>
        {!editing && (
          <Box
            className="htmleditor"
            sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}
            dangerouslySetInnerHTML={{ __html: ccQuali || "" }}
          />
        )}
        {editing && (
          <Box sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
            <TextInputBox
              limitedOptions
              initialValue={ccQuali}
              setUpdatedValue={(str) => setCCQuali(str || "")}
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
      <Box sx={{ clear: "both" }} />
    </Box>
  );

  return null;
}
