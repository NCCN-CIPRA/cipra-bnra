import { Box, Button, Stack, Typography } from "@mui/material";
import TextInputBox from "../../components/TextInputBox";
import { useEffect, useMemo, useState } from "react";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../hooks/useAPI";
import {
  Cause as Cause2023,
  getPartialProbabilityRelativeScale,
  getTotalProbabilityRelativeScale,
} from "../../functions/Probability";
import ClimateChangeChart from "../../components/charts/ClimateChangeChart";
import { SCENARIO_SUFFIX } from "../../functions/scenarios";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { DVAttachment } from "../../types/dataverse/DVAttachment";

type Cause2050 = Cause2023 & {
  p2050: number;
};

export default function CCSection({
  riskFile,
  cc,
  scenarioSuffix,
  calculation,
  mode,
  attachments = null,
  updateAttachments = null,
}: {
  riskFile: DVRiskFile;
  cc: DVRiskCascade<SmallRisk, unknown> | undefined;
  scenarioSuffix: SCENARIO_SUFFIX;
  calculation: RiskCalculation;
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<unknown>);
}) {
  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [ccQuali, setCCQuali] = useState<string | null>(riskFile.cr4de_mrs_cc || null);

  useEffect(() => {
    const tp50 = getTotalProbabilityRelativeScale(calculation, scenarioSuffix, true);

    const causes = [
      {
        id: null,
        name: "No underlying cause",
        p: getPartialProbabilityRelativeScale(calculation[`dp${scenarioSuffix}`], calculation, scenarioSuffix),
        p2050: getPartialProbabilityRelativeScale(
          calculation[`dp50${scenarioSuffix}`],
          calculation,
          scenarioSuffix,
          true
        ),
      },
      ...(calculation.causes
        .filter((c) => c[`ip50${scenarioSuffix}`] !== 0)
        .map((c) => {
          return {
            id: c.cause.riskId,
            name: c.cause.riskTitle,
            p: getPartialProbabilityRelativeScale(c[`ip${scenarioSuffix}`], calculation, scenarioSuffix),
            p2050: getPartialProbabilityRelativeScale(c[`ip50${scenarioSuffix}`], calculation, scenarioSuffix, true),
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

    if (ccQuali === null) {
      setCCQuali(
        causes
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
  }, [calculation, scenarioSuffix]);

  const saveRiskFile = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_mrs_cc: ccQuali,
    });

    setEditing(false);
    // await reloadRiskFile();
    setSaving(false);
    // setOpen(false);
  };

  return (
    <Box sx={{ borderLeft: "solid 8px #eee", px: 2, py: 1, mt: 2, backgroundColor: "white" }}>
      <Box sx={{ margin: "auto", width: "750px" }}>
        <ClimateChangeChart calculation={calculation} scenarioSuffix={scenarioSuffix} />
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
      <Box sx={{ clear: "both" }} />
    </Box>
  );
}
