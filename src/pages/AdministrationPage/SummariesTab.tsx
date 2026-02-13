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
import { parseRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { SCENARIOS } from "../../functions/scenarios";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import {
  DVCascadeSnapshot,
  SerializedCauseSnapshotResults,
  SerializedCPMatrix,
  SerializedEffectSnapshotResults,
} from "../../types/dataverse/DVCascadeSnapshot";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";

export default function SummariesTab() {
  const api = useAPI();
  const [action, setAction] = useState("Idle");
  const [progress, setProgress] = useState(0);

  const handleCreateSnapshot = async () => {
    setAction("Loading data...");
    setProgress(-1);
    const summaries = await api.getRiskSummaries();
    const riskSnapshots = await api.getRiskSnapshots();
    const cascadesSnapshots = await api.getCascadeSnapshots<
      DVCascadeSnapshot<
        unknown,
        unknown,
        SmallRisk,
        SerializedCauseSnapshotResults,
        SerializedEffectSnapshotResults,
        SerializedCPMatrix
      >
    >("$expand=cr4de_effect_risk($select=cr4de_hazard_id)");
    const riskFiles = await api.getRiskFiles();
    const cascades = await api.getRiskCascades<
      DVRiskCascade<DVRiskFile, DVRiskFile>
    >();
    setAction("Creating snapshots...");

    const res = updateSnapshots(
      summaries,
      riskSnapshots,
      cascadesSnapshots,
      riskFiles.filter((rf) => !rf.cr4de_hazard_id.startsWith("X")),
      cascades,
      false,
    );

    setAction("Saving summaries: 0%");

    const doSummaries = true;

    const maxProgress = summaries.length;

    let counter = 0;

    if (doSummaries) {
      for (const sum of summaries) {
        counter += 1;
        const snapshot = riskSnapshots.find(
          (s) => s._cr4de_risk_file_value === sum._cr4de_risk_file_value,
        );
        const riskFile = riskFiles.find(
          (s) => s.cr4de_riskfilesid === sum._cr4de_risk_file_value,
        );
        const updatedSummary = res.updatedSummaries.find(
          (s) =>
            s.cr4de_bnrariskfilesummaryid === sum.cr4de_bnrariskfilesummaryid,
        );
        if (!snapshot || !riskFile || !updatedSummary) continue;
        const parsed = parseRiskSnapshot(snapshot);
        const scenario = parsed.cr4de_mrs || SCENARIOS.CONSIDERABLE;

        // const effects = cascadesSnapshots
        //   .filter(
        //     (c) => c._cr4de_cause_risk_value === riskFile.cr4de_riskfilesid,
        //   )
        //   .map((c) => {
        //     const cpMatrix = parseCPMatrix(c.cr4de_quanti_cp);
        //     return {
        //       ...c,
        //       cr4de_quanti_cp: cpMatrix,
        //     };
        //   });
        // const totCP = effects.reduce((p, e) => {
        //   return p + e.cr4de_quanti_cp[scenario].avg;
        // }, 0.00000001);

        // const actions: ActionRisksSummary[] = effects
        //   .map((e) => ({
        //     id: e.cr4de_effect_risk.cr4de_riskfilesid,
        //     name: `risk.${e.cr4de_effect_risk.cr4de_hazard_id}.name`,
        //     p: e.cr4de_quanti_cp[scenario].avg / totCP,
        //   }))
        //   .sort((a, b) => b.p - a.p);

        // let minCP = 0;

        // let cumulP = 0;
        // for (const c of actions) {
        //   cumulP += c.p;

        //   if (cumulP >= 0.8) {
        //     minCP = c.p;
        //     break;
        //   }
        // }

        // const selectedActions: CauseRisksSummary[] = actions
        //   .filter((e) => e.p >= minCP)
        //   .map((e) => ({
        //     cause_risk_id: "id" in e ? e.id : "",
        //     cause_risk_title: e.name,
        //     cause_risk_p: e.p,
        //   }));

        // const otherActions: CauseRisksSummary[] =
        //   selectedActions.length < actions.length
        //     ? [
        //         {
        //           cause_risk_id: "",
        //           cause_risk_title: "Other actions",
        //           cause_risk_p: actions
        //             .filter((c) => c.p < minCP)
        //             .reduce((t, a) => t + a.p, 0.00001),
        //           other_causes: actions
        //             .filter((c) => c.p < minCP)
        //             .map((e) => ({
        //               cause_risk_id: "id" in e ? e.id : "",
        //               cause_risk_title: e.name,
        //               cause_risk_p: e.p,
        //             })),
        //         },
        //       ]
        //     : [];

        await api.updateRiskSummary(sum.cr4de_bnrariskfilesummaryid, {
          cr4de_mrs_p:
            Math.round(100 * parsed.cr4de_quanti[scenario].tp.scale5TP) / 100,
          cr4de_mrs_i:
            Math.round(100 * parsed.cr4de_quanti[scenario].ti.all.scale5TI) /
            100,
          cr4de_mrs_h:
            Math.round(100 * parsed.cr4de_quanti[scenario].ti.h.scale5Cat) /
            100,
          cr4de_mrs_s:
            Math.round(100 * parsed.cr4de_quanti[scenario].ti.s.scale5Cat) /
            100,
          cr4de_mrs_e:
            Math.round(100 * parsed.cr4de_quanti[scenario].ti.e.scale5Cat) /
            100,
          cr4de_mrs_f:
            Math.round(100 * parsed.cr4de_quanti[scenario].ti.f.scale5Cat) /
            100,

          // cr4de_causing_risks:
          //   parsed.cr4de_risk_type === RISK_TYPE.MANMADE
          //     ? JSON.stringify([...selectedActions, ...otherActions])
          //     : sum.cr4de_causing_risks,
          // cr4de_effect_risks: sum.cr4de_effect_risks,
        });

        setProgress((100 * counter) / maxProgress);
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
            Update Summaries
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
