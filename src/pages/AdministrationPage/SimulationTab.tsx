import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { useMemo, useState } from "react";
import { parseRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import {
  snapshotFromRiskCascade,
  snapshotFromRiskfile,
} from "../../functions/snapshot";
import { parseCascadeSnapshot } from "../../types/dataverse/DVRiskCascade";
import {
  getRiskCatalogue,
  getRiskCatalogueFromSnapshots,
} from "../../functions/riskfiles";
import { useQuery } from "@tanstack/react-query";
import workerUrl from "../../functions/simulation/simulation.worker?worker&url";
import { proxy, wrap } from "vite-plugin-comlink/symbol";
import { SimulationWorker } from "../../functions/simulation/simulation.worker";
import { SimulationOutput } from "../../functions/simulation/types";
import { processSimulation } from "../../functions/simulation/processSimulation";
import round from "../../functions/roundNumberString";

function getSimulationWorker() {
  const jsWorker = `import ${JSON.stringify(
    new URL(workerUrl, import.meta.url)
  )}`;
  const blobWorker = new Blob([jsWorker], { type: "application/javascript" });
  const ww = new Worker(URL.createObjectURL(blobWorker), { type: "module" });
  const worker = wrap<SimulationWorker>(ww);

  return worker;
}

const RUNS = 10000;

export default function SimulationTab() {
  const api = useAPI();
  const [action, setAction] = useState("Idle");
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<SimulationOutput | null>(null);

  const { data: rfs } = useQuery({
    queryKey: [DataTable.RISK_FILE],
    queryFn: () => api.getRiskFiles(),
    select: (data) => data.filter((rf) => !rf.cr4de_hazard_id.startsWith("X")),
  });
  // const { data: rss } = useQuery({
  //   queryKey: [DataTable.RISK_SNAPSHOT],
  //   queryFn: () => api.getRiskSnapshots(),
  //   select: (data) => data.filter((rf) => !rf.cr4de_hazard_id.startsWith("X")),
  // });
  const { data: cs } = useQuery({
    queryKey: [DataTable.RISK_CASCADE],
    queryFn: () => api.getRiskCascades(),
  });

  const rc = useMemo(() => {
    if (rfs) return getRiskCatalogue(rfs);
  }, [rfs]);

  const simulationData = useMemo(() => {
    if (output && rc) return processSimulation(output, rc);
  }, [output, rc]);

  const runSimulation = async () => {
    if (!rfs || !cs) return;

    setAction("Loading data...");
    setProgress(-1);
    const riskSnapshots = rfs.map(snapshotFromRiskfile).map(parseRiskSnapshot);
    const rc = getRiskCatalogueFromSnapshots(riskSnapshots);
    const cascadeSnapshots = cs
      .filter((cs) => rc[cs._cr4de_cause_hazard_value])
      .map((cs) =>
        snapshotFromRiskCascade(rc[cs._cr4de_cause_hazard_value], cs, true)
      )
      .map(parseCascadeSnapshot);

    const simulator = getSimulationWorker();

    const output = await simulator.simulate(
      {
        riskFiles: riskSnapshots,
        cascades: cascadeSnapshots,
        numberOfSimulations: RUNS,
      },
      proxy((message, runIndex) => {
        setAction(message);
        if (runIndex !== undefined) {
          setProgress(((runIndex + 1) / RUNS) * 100);
        }
      })
    );

    console.log(output);
    setOutput(output);

    setAction("Done");
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
          <Button
            disabled={!rfs || !cs}
            color="warning"
            onClick={runSimulation}
          >
            Run Simulation
          </Button>
        </CardActions>
      </Card>
      {simulationData && (
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{}}>
            <Stack direction="column" sx={{ my: 2 }}>
              {simulationData.map((s, i) => (
                <Stack
                  direction={"row"}
                  key={s.risk._cr4de_risk_file_value}
                  spacing={2}
                  sx={{
                    alignItems: "top",
                    mb: 4,
                    pb: 2,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Stack
                    direction={"column"}
                    spacing={2}
                    sx={{ mb: 1, flex: 1 }}
                  >
                    <Stack
                      direction={"row"}
                      spacing={2}
                      sx={{ alignItems: "top", mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ flex: 1 }}>
                        {i + 1}. {s.risk.cr4de_title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {s.occurrences.length / RUNS} occurences per year
                      </Typography>
                    </Stack>
                    <Stack
                      direction={"column"}
                      sx={{
                        mb: 2,
                        pl: 4,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ borderBottom: "1px solid #eee", mb: 1 }}
                      >
                        Top Causes
                      </Typography>
                      {s.causes.slice(0, 5).map((c) => (
                        <Stack
                          direction={"row"}
                          key={c.risk?._cr4de_risk_file_value || "None"}
                          spacing={2}
                          sx={{ alignItems: "center", mb: 1 }}
                        >
                          <Typography sx={{ flex: 1 }} variant="subtitle1">
                            {c.risk?.cr4de_title || "No identified cause"}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {c.occurrences.length / RUNS} occurences per year
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                  <Stack
                    direction={"column"}
                    spacing={2}
                    sx={{ mb: 1, flex: 1 }}
                    justifyContent="flex-start"
                  >
                    <Stack
                      direction={"row"}
                      spacing={2}
                      sx={{ alignItems: "top", mb: 1 }}
                    >
                      <Typography variant="body1" sx={{ flex: 1 }}></Typography>
                      <Typography
                        variant="caption"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {round(s.averageImpact.all / 100, 0, ",", " ")} k€
                        expected annualized impact
                      </Typography>
                    </Stack>
                    <Stack
                      direction={"column"}
                      sx={{
                        mb: 2,
                        pl: 4,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ borderBottom: "1px solid #eee", mb: 1 }}
                      >
                        Top Consequences
                      </Typography>
                      {s.effects.slice(0, 5).map((e) => (
                        <Stack
                          direction={"row"}
                          key={e.risk._cr4de_risk_file_value}
                          spacing={2}
                          sx={{ alignItems: "center", mb: 1 }}
                        >
                          <Typography sx={{ flex: 1 }} variant="subtitle1">
                            {e.risk.cr4de_title}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {round(e.averageImpact.all / 100, 0, ",", " ")} k€
                            expected annualized impact
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
