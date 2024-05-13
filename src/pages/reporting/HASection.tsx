import { Box, Button, Stack, Typography } from "@mui/material";
import ProbabilityOriginPieChart from "../../components/charts/ProbabilityOriginPieChart";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import TextInputBox from "../../components/TextInputBox";
import { useMemo, useState } from "react";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { LoadingButton } from "@mui/lab";
import useAPI from "../../hooks/useAPI";
import { Cause } from "../../functions/Probability";

export default function HASection({ riskFile, mode }: { riskFile: DVRiskFile; mode: "view" | "edit" }) {
  const api = useAPI();
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [ha, setHA] = useState<string | null>(riskFile.cr4de_horizon_analysis);

  const saveRiskFile = async (reset = false) => {
    setSaving(true);
    await api.updateRiskFile(riskFile.cr4de_riskfilesid, {
      cr4de_horizon_analysis: ha,
    });

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
          dangerouslySetInnerHTML={{ __html: ha || "" }}
        />
      )}
      {editing && (
        <Box sx={{ mb: 4, fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
          <TextInputBox initialValue={ha} setUpdatedValue={(str) => setHA(str || "")} />
        </Box>
      )}
      {mode === "edit" && (
        <Stack direction="row" sx={{ borderTop: "1px solid #eee", pt: 1, mr: 2 }}>
          {!editing && (
            <>
              <Button onClick={() => setEditing(true)}>Edit</Button>
              <Box sx={{ flex: 1 }} />
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
