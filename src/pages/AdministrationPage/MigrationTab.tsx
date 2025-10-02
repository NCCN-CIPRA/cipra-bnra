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
import {
  getSerializedQualiResults,
  snapshotFromRiskfile,
} from "../../functions/snapshot";
import {
  RiskFileQuantiInput,
  RiskFileScenarioQuantiInput,
  serializeRiskFileQuantiInput,
} from "../../types/dataverse/DVRiskFile";
import { pScale7FromReturnPeriodMonths } from "../../functions/indicators/probability";
import { iScale7FromEuros } from "../../functions/indicators/impact";

const scenarios = [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME];

const iFields = [
  "ha",
  "hb",
  "hc",
  "sa",
  "sb",
  "sc",
  "sd",
  "ea",
  "fa",
  "fb",
] as (keyof RiskFileScenarioQuantiInput["di"])[];

export default function MigrationTab() {
  const api = useAPI();
  const [action, setAction] = useState("Idle");
  const [progress, setProgress] = useState(0);

  const handleMigrateScenarios = async () => {
    setAction("Loading data...");
    setProgress(-1);
    const riskFiles = await api.getRiskFiles();

    setAction("Migrating risk files quanti input...");
    let counter = 0;
    const maxProgress = riskFiles.length;

    for (const rf of riskFiles) {
      const snapshot = parseRiskSnapshot(snapshotFromRiskfile(rf));

      const quanti: RiskFileQuantiInput = scenarios.reduce((res, s) => {
        const scenarioResult: RiskFileScenarioQuantiInput = {
          dp: {
            rpMonths: snapshot.cr4de_quanti[s].dp.rpMonths,
            scale5: snapshot.cr4de_quanti[s].dp.scale5,
            scale7: pScale7FromReturnPeriodMonths(
              snapshot.cr4de_quanti[s].dp.rpMonths
            ),
          },
          dp50: {
            rpMonths: snapshot.cr4de_quanti[s].dp50.rpMonths,
            scale5: snapshot.cr4de_quanti[s].dp50.scale5,
            scale7: pScale7FromReturnPeriodMonths(
              snapshot.cr4de_quanti[s].dp50.rpMonths
            ),
          },
          di: iFields.reduce(
            (acc, field) => ({
              ...acc,
              [field]: {
                abs: snapshot.cr4de_quanti[s].di[field].euros,
                scale5: snapshot.cr4de_quanti[s].di[field].scale5,
                scale7: iScale7FromEuros(
                  snapshot.cr4de_quanti[s].di[field].euros
                ),
              },
            }),
            {} as RiskFileScenarioQuantiInput["di"]
          ),
        };

        return {
          ...res,
          [s]: scenarioResult,
        };
      }, {} as RiskFileQuantiInput);
      // if (rf.cr4de_title.indexOf("rail transport") < 0) continue;

      // console.log(snapshot.cr4de_title);
      // console.log("SNAPSHOT: ", snapshot.cr4de_quanti);
      // console.log("RISK FILE: ", quanti);
      // console.log(rf);
      // break;

      await api.updateRiskFile(rf.cr4de_riskfilesid, {
        cr4de_quanti: serializeRiskFileQuantiInput(quanti),
        cr4de_quali: getSerializedQualiResults(rf),
      });

      counter += 1;
      const p = (100 * counter) / maxProgress;
      setAction(`Saving riskfiles: ${Math.round(p)}%`);
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
