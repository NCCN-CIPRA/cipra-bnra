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
import { parseRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { SCENARIOS } from "../../functions/scenarios";
import { oldToNewCPMatrix } from "../../functions/snapshot";
import {
  CPMatrix,
  parseCPMatrix,
  serializeCPMatrix,
} from "../../types/dataverse/DVCascadeSnapshot";

// const scenarios = [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME];

// const   iFields = [
//   "ha",
//   "hb",
//   "hc",
//   "sa",
//   "sb",
//   "sc",
//   "sd",
//   "ea",
//   "fa",
//   "fb",
// ] as (keyof RiskFileScenarioQuantiInput["di"])[];
const ACTOR_RISKS = [
  "8a58db5b-aa6c-ed11-9561-000d3adf7089", // "M01",
  "8d58db5b-aa6c-ed11-9561-000d3adf7089", // "MO2",
  "8e58db5b-aa6c-ed11-9561-000d3adf7089", // "M03",
  "8c58db5b-aa6c-ed11-9561-000d3adf7089", // "M04",
  "8f58db5b-aa6c-ed11-9561-000d3adf7089", //  "M05"
];

export default function MigrationTab() {
  const api = useAPI();
  const [action, setAction] = useState("Idle");
  const [progress, setProgress] = useState(0);

  const handleMigrateScenarios = async () => {
    setAction("Loading data...");
    setProgress(-1);

    const risks = await api.getRiskSnapshots();
    const cascadeSnapshots = await api
      .getCascadeSnapshots()
      .then((d) =>
        d.filter((c) => ACTOR_RISKS.indexOf(c._cr4de_cause_risk_value) >= 0)
      );
    const cascades = await api.getRiskCascades();

    setAction("Migrating attack cp values...");
    let counter = 0;
    const maxProgress = cascadeSnapshots.length;

    for (const c of cascadeSnapshots) {
      const cause = risks.find(
        (r) => r._cr4de_risk_file_value === c._cr4de_cause_risk_value
      );
      const realCascade = cascades.find(
        (rc) => rc.cr4de_bnrariskcascadeid === c._cr4de_risk_cascade_value
      );
      if (!cause || !realCascade) return;

      const oldCP = parseCPMatrix(c.cr4de_quanti_cp);

      const newCPMatrixSnapshot = oldToNewCPMatrix(
        parseRiskSnapshot(cause),
        realCascade,
        false
      );
      const newCPMatrix: CPMatrix = {
        [SCENARIOS.CONSIDERABLE]: {
          ...newCPMatrixSnapshot[SCENARIOS.CONSIDERABLE],
          avg: oldCP.considerable.avg,
        },
        [SCENARIOS.MAJOR]: {
          ...newCPMatrixSnapshot[SCENARIOS.MAJOR],
          avg: oldCP.major.avg,
        },
        [SCENARIOS.EXTREME]: {
          ...newCPMatrixSnapshot[SCENARIOS.EXTREME],
          avg: oldCP.extreme.avg,
        },
      };

      // cpMatrix.considerable.considerable.abs = pDailyFromReturnPeriodMonths(
      //   returnPeriodMonthsFromPTimeframe(
      //     cpMatrix.considerable.considerable.abs,
      //     3 * 12
      //   )
      // );
      // cpMatrix.considerable.major.abs = pDailyFromReturnPeriodMonths(
      //   returnPeriodMonthsFromPTimeframe(
      //     cpMatrix.considerable.major.abs,
      //     3 * 12
      //   )
      // );
      // cpMatrix.considerable.extreme.abs = pDailyFromReturnPeriodMonths(
      //   returnPeriodMonthsFromPTimeframe(
      //     cpMatrix.considerable.extreme.abs,
      //     3 * 12
      //   )
      // );
      // cpMatrix.major.considerable.abs = pDailyFromReturnPeriodMonths(
      //   returnPeriodMonthsFromPTimeframe(
      //     cpMatrix.major.considerable.abs,
      //     3 * 12
      //   )
      // );
      // cpMatrix.major.major.abs = pDailyFromReturnPeriodMonths(
      //   returnPeriodMonthsFromPTimeframe(cpMatrix.major.major.abs, 3 * 12)
      // );
      // cpMatrix.major.extreme.abs = pDailyFromReturnPeriodMonths(
      //   returnPeriodMonthsFromPTimeframe(cpMatrix.major.extreme.abs, 3 * 12)
      // );
      // cpMatrix.extreme.considerable.abs = pDailyFromReturnPeriodMonths(
      //   returnPeriodMonthsFromPTimeframe(
      //     cpMatrix.extreme.considerable.abs,
      //     3 * 12
      //   )
      // );
      // cpMatrix.extreme.major.abs = pDailyFromReturnPeriodMonths(
      //   returnPeriodMonthsFromPTimeframe(cpMatrix.extreme.major.abs, 3 * 12)
      // );
      // cpMatrix.extreme.extreme.abs = pDailyFromReturnPeriodMonths(
      //   returnPeriodMonthsFromPTimeframe(cpMatrix.extreme.extreme.abs, 3 * 12)
      // );

      await api.updateCascadeSnapshot(c.cr4de_bnrariskcascadesnapshotid, {
        cr4de_quanti_cp: serializeCPMatrix(newCPMatrix),
      });
      console.log(c, newCPMatrix);
      counter += 1;
      const p = (100 * counter) / maxProgress;
      setAction(`Saving cascades: ${Math.round(p)}%`);
      setProgress(p);
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
          <Button color="warning" onClick={handleMigrateScenarios}>
            Migrate Risk File Inputs
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
