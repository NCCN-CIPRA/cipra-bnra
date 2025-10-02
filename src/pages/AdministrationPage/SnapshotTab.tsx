import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  LinearProgress,
  Typography,
} from "@mui/material";
import useAPI from "../../hooks/useAPI";
import { useState } from "react";
import { updateSnapshots } from "../../functions/snapshot";
import {
  DVCascadeSnapshot,
  SerializedCauseSnapshotResults,
  SerializedCPMatrix,
  SerializedEffectSnapshotResults,
} from "../../types/dataverse/DVCascadeSnapshot";

export default function SnapshotTab() {
  const api = useAPI();
  const [action, setAction] = useState("Idle");
  const [progress, setProgress] = useState(0);

  const handleCreateSnapshot = async () => {
    setAction("Loading data...");
    setProgress(-1);
    const summaries = await api.getRiskSummaries();
    const riskSnapshots = await api.getRiskSnapshots();
    const cascadesSnapshots = await api.getCascadeSnapshots();
    const riskFiles = await api.getRiskFiles();
    const cascades = await api.getRiskCascades();
    setAction("Creating snapshots...");

    const res = updateSnapshots(
      summaries,
      riskSnapshots,
      cascadesSnapshots,
      riskFiles.filter((rf) => !rf.cr4de_hazard_id.startsWith("X")),
      cascades,
      false
    );

    setAction("Saving snapshots: 0%");

    const doSummaries = false;
    const doRisks = true;
    const doCascades = false;

    let maxProgress = 0;
    if (doSummaries) maxProgress += res.updatedSummaries.length;
    if (doRisks) maxProgress += res.updatedRiskSnapshots.length;
    if (doCascades) maxProgress += res.updatedCascadesSnapshots.length;

    let counter = 0;

    if (doSummaries) {
      for (const sum of res.updatedSummaries) {
        if (sum.cr4de_bnrariskfilesummaryid) {
          // console.log(sum);
          delete sum.cr4de_risk_file;
          delete sum._cr4de_risk_file_value;
          await api.updateRiskSummary(sum.cr4de_bnrariskfilesummaryid, sum);
        } else await api.createRiskSummary(sum);

        counter += 1;
        const p = (100 * counter) / maxProgress;
        setAction(`Saving snapshots: ${Math.round(p)}%`);
        setProgress(p);
      }
    }

    if (doRisks) {
      for (const ss of res.updatedRiskSnapshots) {
        if (ss.cr4de_bnrariskfilesnapshotid) {
          delete ss.cr4de_risk_file;
          delete ss._cr4de_risk_file_value;
          await api.updateRiskSnapshot(ss.cr4de_bnrariskfilesnapshotid, ss);
        } else await api.createRiskSnapshot(ss);

        counter += 1;
        const p = (100 * counter) / maxProgress;
        setAction(`Saving snapshots: ${Math.round(p)}%`);
        setProgress(p);
      }
    }

    if (doCascades) {
      console.log(res.updatedCascadesSnapshots);
      for (const cs of res.updatedCascadesSnapshots) {
        if (
          cs.cr4de_bnrariskcascadesnapshotid !==
          "c07069ef-da87-f011-b4cb-000d3ab805fb"
        )
          continue;
        console.log(cs);
        if (cs.cr4de_bnrariskcascadesnapshotid) {
          delete cs.cr4de_risk_cascade;
          delete cs._cr4de_risk_cascade_value;
          delete cs.cr4de_cause_risk;
          delete cs._cr4de_cause_risk_value;
          delete cs.cr4de_effect_risk;
          delete cs._cr4de_effect_risk_value;
          await api.updateCascadeSnapshot(
            cs.cr4de_bnrariskcascadesnapshotid,
            cs
          );
        } else {
          delete cs.cr4de_bnrariskcascadesnapshotid;
          delete cs.cr4de_risk_cascade;
          delete cs._cr4de_risk_cascade_value;
          delete cs.cr4de_cause_risk;
          delete cs._cr4de_cause_risk_value;
          delete cs.cr4de_effect_risk;
          delete cs._cr4de_effect_risk_value;
          await api.createCascadeSnapshot(
            cs as DVCascadeSnapshot<
              unknown,
              unknown,
              unknown,
              SerializedCauseSnapshotResults,
              SerializedEffectSnapshotResults,
              SerializedCPMatrix
            >
          );
        }

        counter += 1;
        const p = (100 * counter) / maxProgress;
        setAction(`Saving snapshots: ${Math.round(p)}%`);
        setProgress(p);
      }
    }

    setAction("Idle");
    setProgress(0);
  };

  return (
    <Container sx={{ mb: 18 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{}}>
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">{action}</Typography>
          </Box>
          <LinearProgress
            variant={progress >= 0 ? "determinate" : "indeterminate"}
            value={progress}
          />
        </CardContent>
        <CardActions>
          <Button color="warning" onClick={handleCreateSnapshot}>
            Create snapshot
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
