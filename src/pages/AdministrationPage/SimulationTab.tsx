import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  FormGroup,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  TextField,
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
import { getRiskCatalogueFromSnapshots } from "../../functions/riskfiles";
import { useQuery } from "@tanstack/react-query";
import workerUrl from "../../functions/simulation/simulation.worker?worker&url";
import { proxy, wrap } from "vite-plugin-comlink/symbol";
import { SimulationWorker } from "../../functions/simulation/simulation.worker";
import {
  AverageRiskEvent,
  Impact,
  noImpact,
} from "../../functions/simulation/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ErrorBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  eurosFromIScale7,
  iScale7FromEuros,
} from "../../functions/indicators/impact";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import useSavedState from "../../hooks/useSavedState";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { SCENARIOS } from "../../functions/scenarios";

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
  const [selectedRF, setSelectedRF] = useSavedState<DVRiskFile | null>(
    "simulationRiskFile",
    null
  );
  const [selectedScenario, setSelectedScenario] =
    useSavedState<SCENARIOS | null>("simulationScenario", null);
  const [numberOfSimulations, setNumberOfSimulations] = useSavedState(
    "numberOfSimulations",
    2000
  );
  const [actions, setActions] = useState(["Idle"]);
  const [progress, setProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [output, setOutput] = useState<any | null>(null);
  // const [impacts, setImpacts] = useState<number[]>([]);
  // const [cvs, setCVs] = useState<number[]>([]);

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

  const setAction = (newAction: string) => {
    setActions((actions) => [newAction, ...actions]);
  };

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

    const result = await simulator.simulate(
      {
        riskFiles: riskSnapshots,
        cascades: cascadeSnapshots,
        options: {
          filterRiskFileIds: selectedRF
            ? [selectedRF.cr4de_riskfilesid]
            : undefined,
          filterScenarios: selectedScenario ? [selectedScenario] : undefined,
          minRuns: numberOfSimulations,
          maxRuns: numberOfSimulations + 1,
          relStd: 0.2,
        },
      },
      proxy((message, runIndex) => {
        setAction(message);
        console.log(message);
        if (runIndex !== undefined) {
          // innerImpacts.push(runIndex);
          setProgress(((runIndex + 1) / RUNS) * 100);
        }
      })
    );

    // setImpacts(output?.other.map((i) => i.all));
    setOutput(result?.other);
    // setOutput(output);

    setAction("Done");
    setProgress(0);
  };

  const impactData = useMemo(() => {
    const maxScale = 8;
    const binWidth = 0.5;
    const bins = Math.ceil(maxScale / binWidth);

    const data = new Array(bins).fill(null).map((_, i) => ({
      name: `TI${i / 2}`,
      count: 0,
      p: 0,
      error: 0,
      min: i <= 0 ? 0 : eurosFromIScale7(i / 2 - binWidth),
      max: eurosFromIScale7(i + binWidth),
    }));

    if (output?.averageRisks) {
      const averageEvent: AverageRiskEvent =
        output.averageRisks[selectedRF?.cr4de_riskfilesid || ""]?.[
          selectedScenario || SCENARIOS.CONSIDERABLE
        ];

      if (!averageEvent) return;

      averageEvent.allImpacts.forEach((impact) => {
        for (const bin of data) {
          if (impact.all >= bin.min && impact.all < bin.max) {
            bin.count += 1;
            bin.p += 1 / averageEvent.allImpacts.length;
            break;
          }
        }
      });

      return data.map((d) => ({
        ...d,
        p: Math.round(1000 * d.p) / 1000,
        error: Math.sqrt(d.count) / (averageEvent.allImpacts.length * binWidth),
      }));
    }

    return data;
  }, [output, selectedRF, selectedScenario]);

  const indicatorData = useMemo(() => {
    const data = Object.keys(noImpact).map((i) => ({
      name: i,
      impact: 0,
      error: 0,
    }));

    const averageEvent: AverageRiskEvent =
      output?.averageRisks[selectedRF?.cr4de_riskfilesid || ""]?.[
        selectedScenario || SCENARIOS.CONSIDERABLE
      ];

    if (averageEvent) {
      Object.keys(noImpact).forEach((i) => {
        const d = data.find((el) => el.name === i);

        if (!d) return;

        d.impact =
          Math.round(
            (100 *
              averageEvent.allImpacts.reduce(
                (sum, val) => sum + iScale7FromEuros(val[i as keyof Impact]),
                0
              )) /
              averageEvent.allImpacts.length
          ) / 100;
        d.error = Math.sqrt(
          averageEvent.allImpacts.reduce(
            (sqrDiff, val) =>
              sqrDiff +
              Math.pow(iScale7FromEuros(val[i as keyof Impact]) - d.impact, 2),
            0
          ) /
            (averageEvent.allImpacts.length - 1)
        );
      });
    }

    return data;
  }, [output, selectedRF, selectedScenario]);

  const cascadeData = useMemo(() => {
    const averageEvent: AverageRiskEvent =
      output?.averageRisks[selectedRF?.cr4de_riskfilesid || ""]?.[
        selectedScenario || SCENARIOS.CONSIDERABLE
      ];

    if (!averageEvent) return [];

    const data = averageEvent.triggeredEvents
      .map((e) => {
        const average =
          e.allImpacts.reduce(
            (sum, val) => sum + val.all / averageEvent.allImpacts.length,
            0
          ) / e.allImpacts.length;

        return {
          name: e.risk.name,
          count: e.allImpacts.length,
          all: e.allImpacts.map((i) =>
            iScale7FromEuros(i.all / averageEvent.allImpacts.length)
          ),
          impact: Math.round(100 * average) / 100,
          error: Math.sqrt(
            e.allImpacts.reduce(
              (sqrDiff, val) =>
                sqrDiff +
                Math.pow(
                  iScale7FromEuros(val.all / averageEvent.allImpacts.length) -
                    average,
                  2
                ),
              0
            ) / e.allImpacts.length
          ),
        };
      })
      .filter((c) => c.impact > 0)
      .sort((a, b) => b.impact - a.impact);

    return data;
  }, [output, selectedRF, selectedScenario]);

  return (
    <Container sx={{ mb: 18 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{}}>
          <FormGroup>
            <FormControl>
              <InputLabel id="rf-label">Riskfile to simulate</InputLabel>
              <Select
                labelId="rf-label"
                variant="outlined"
                label="Riskfile to simulate"
                value={selectedRF?.cr4de_riskfilesid || ""}
                onChange={(e) =>
                  setSelectedRF(
                    rfs?.find(
                      (rf) => rf.cr4de_riskfilesid === e.target.value
                    ) || null
                  )
                }
              >
                <MenuItem value={""}>All</MenuItem>
                {rfs
                  ?.filter((rf) => rf.cr4de_risk_type !== RISK_TYPE.EMERGING)
                  .sort((a, b) =>
                    a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id)
                  )
                  .map((rf) => (
                    <MenuItem value={rf.cr4de_riskfilesid}>
                      {rf.cr4de_hazard_id} {rf.cr4de_title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <InputLabel id="scenario-label">Scenario to simulate</InputLabel>
              <Select<SCENARIOS | "">
                labelId="scenario-label"
                variant="outlined"
                value={selectedScenario || ""}
                onChange={(e) =>
                  setSelectedScenario(
                    e.target.value !== "" ? e.target.value : null
                  )
                }
                label="Scenario to simulate"
              >
                <MenuItem value={""}>All</MenuItem>
                <MenuItem value={SCENARIOS.CONSIDERABLE}>
                  {SCENARIOS.CONSIDERABLE}
                </MenuItem>
                <MenuItem value={SCENARIOS.MAJOR}>{SCENARIOS.MAJOR}</MenuItem>
                <MenuItem value={SCENARIOS.EXTREME}>
                  {SCENARIOS.EXTREME}
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <TextField
                label="Number of events to simulate"
                value={numberOfSimulations}
                onChange={(e) =>
                  setNumberOfSimulations(parseInt(e.target.value))
                }
                variant="outlined"
                type="number"
              ></TextField>
            </FormControl>
          </FormGroup>
          <Stack direction="column" sx={{ p: 1, my: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: -1 }}>
              Status
            </Typography>
            <pre
              style={{
                backgroundColor: "#eee",
                padding: 12,
                height: 200,
                overflowY: "scroll",
                position: "relative",
              }}
            >
              {actions.join("\n")}
              <IconButton
                sx={{ position: "absolute", top: 10, right: 10 }}
                onClick={() => setActions([])}
              >
                <GridDeleteIcon />
              </IconButton>
            </pre>
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Progress
            </Typography>
            <LinearProgress
              variant={progress >= 0 ? "determinate" : "indeterminate"}
              value={progress}
            />
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            disabled={!rfs || !cs}
            color="warning"
            onClick={runSimulation}
          >
            Run Simulation
          </Button>
        </CardActions>
      </Card>

      <Card>
        <CardHeader title="Statistical results" />
        <CardContent>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Total impact histogram
            </Typography>
            <ResponsiveContainer width={"100%"} height={400}>
              <BarChart
                data={impactData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis min={0} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="p"
                  fill="#8884d8"
                  // activeBar={<Rectangle fill="pink" stroke="blue" />}
                >
                  <ErrorBar
                    dataKey="error"
                    width={4}
                    strokeWidth={2}
                    stroke="green"
                    direction="y"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Expected impact per damage indicator
            </Typography>
            <ResponsiveContainer width={"100%"} height={600}>
              <BarChart
                data={indicatorData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis ticks={[0, 1, 2, 3, 4, 5, 6, 7]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="impact"
                  fill="#8884d8"
                  // activeBar={<Rectangle fill="pink" stroke="blue" />}
                >
                  <ErrorBar
                    dataKey="error"
                    width={4}
                    strokeWidth={2}
                    stroke="green"
                    direction="y"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Expected impact per cascade
            </Typography>
            <ResponsiveContainer width={"100%"} height={2000}>
              <BarChart
                data={cascadeData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis ticks={[0, 1, 2, 3, 4, 5, 6, 7]} type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="impact"
                  fill="#8884d8"
                  // activeBar={<Rectangle fill="pink" stroke="blue" />}
                >
                  <ErrorBar
                    dataKey="error"
                    width={4}
                    strokeWidth={2}
                    stroke="green"
                    direction="x"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* {cvData && (
        <Card>
          <CardContent>
            <BarChart
              width={500}
              height={300}
              data={cvData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                fill="#8884d8"
                // activeBar={<Rectangle fill="pink" stroke="blue" />}
              />
            </BarChart>
          </CardContent>
        </Card>
      )} */}
    </Container>
  );
}
