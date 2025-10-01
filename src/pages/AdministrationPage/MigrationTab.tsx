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
  parseRiskFields,
  stringifyRiskFields,
} from "../../functions/parseDataverseFields";
import {
  DVRiskSnapshot,
  SerializedRiskSnapshotResults,
  serializeRiskSnapshotScenarios,
} from "../../types/dataverse/DVRiskSnapshot";
import { Scenarios } from "../../functions/scenarios";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";

export default function MigrationTab() {
  const api = useAPI();
  const [action, setAction] = useState("Idle");
  const [progress, setProgress] = useState(0);

  const handleMigrateScenarios = async () => {
    setAction("Loading data...");
    setProgress(-1);
    const riskSummaries = await api.getRiskSummaries();
    const riskSnapshots = await api.getRiskSnapshots();
    const riskFiles = await api.getRiskFiles();

    const sumDict = riskSummaries.reduce(
      (acc, ss) => ({
        ...acc,
        [ss._cr4de_risk_file_value]: ss,
      }),
      {} as {
        [key: string]: DVRiskSummary;
      }
    );
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
      let parsedFields = parseRiskFields(rf);
      const migratedFields = stringifyRiskFields(parsedFields);
      parsedFields = parseRiskFields(migratedFields);

      const sum = sumDict[rf.cr4de_riskfilesid];
      const ss = ssDict[rf.cr4de_riskfilesid];

      await api.updateRiskFile(rf.cr4de_riskfilesid, {
        cr4de_historical_events: migratedFields.cr4de_historical_events,
        cr4de_intensity_parameters: migratedFields.cr4de_intensity_parameters,
        cr4de_scenario_considerable: migratedFields.cr4de_scenario_considerable,
        cr4de_scenario_major: migratedFields.cr4de_scenario_major,
        cr4de_scenario_extreme: migratedFields.cr4de_scenario_extreme,
      });
      await api.updateRiskSummary(sum.cr4de_bnrariskfilesummaryid, {
        cr4de_historical_events: migratedFields.cr4de_historical_events,
        cr4de_intensity_parameters: migratedFields.cr4de_intensity_parameters,
        cr4de_scenario_considerable: migratedFields.cr4de_scenario_considerable,
        cr4de_scenario_major: migratedFields.cr4de_scenario_major,
        cr4de_scenario_extreme: migratedFields.cr4de_scenario_extreme,
      });
      await api.updateRiskSnapshot(ss.cr4de_bnrariskfilesnapshotid, {
        cr4de_historical_events: migratedFields.cr4de_historical_events,
        cr4de_intensity_parameters: migratedFields.cr4de_intensity_parameters,
        cr4de_scenarios: serializeRiskSnapshotScenarios(
          parsedFields.cr4de_scenarios as Scenarios
        ),
      });

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
