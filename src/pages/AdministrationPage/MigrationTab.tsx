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
import {
  DVRiskSnapshot,
  SerializedRiskSnapshotResults,
} from "../../types/dataverse/DVRiskSnapshot";

export default function MigrationTab() {
  const api = useAPI();
  const [action, setAction] = useState("Idle");
  const [progress, setProgress] = useState(0);

  const handleMigrateScenarios = async () => {
    setAction("Loading data...");
    setProgress(-1);
    const riskSnapshots = await api.getRiskSnapshots();
    const riskFiles = await api.getRiskFiles();

    const ssDict = riskSnapshots.reduce(
      (acc, ss) => ({
        ...acc,
        [ss._cr4de_risk_file_value]: ss,
      }),
      {} as {
        [key: string]: DVRiskSnapshot<unknown, SerializedRiskSnapshotResults>;
      }
    );

    setAction("Migrating risk files and snapshots...");
    let counter = 0;
    const maxProgress = riskFiles.length;

    for (const rf of riskFiles) {
      const ss = ssDict[rf.cr4de_riskfilesid];

      JSON.parse(rf.cr4de_historical_events || "{}");
      JSON.parse(rf.cr4de_intensity_parameters || "{}");
      JSON.parse(rf.cr4de_scenario_considerable || "{}");
      JSON.parse(rf.cr4de_scenario_major || "{}");
      JSON.parse(rf.cr4de_scenario_extreme || "{}");

      JSON.parse(ss.cr4de_historical_events || "{}");
      JSON.parse(ss.cr4de_intensity_parameters || "{}");
      JSON.parse(ss.cr4de_scenarios || "{}");

      counter += 1;
      const p = (100 * counter) / maxProgress;
      setAction(`Saving snapshots: ${Math.round(p)}%`);
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
            Migrate Scenarios
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
