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
import { useEffect, useState } from "react";
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
  RiskScenarioSimulationOutput,
  Scenario,
} from "../../functions/simulation/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  RectangleProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { iScale7FromEuros } from "../../functions/indicators/impact";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import useSavedState from "../../hooks/useSavedState";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import {
  pScale7FromReturnPeriodMonths,
  returnPeriodMonthsFromPDaily,
} from "../../functions/indicators/probability";
import RiskMatrixChart from "../../components/charts/svg/RiskMatrixChart";

const HorizonBar = (props: RectangleProps) => {
  const { x, y, width, height } = props;

  if (x == null || y == null || width == null || height == null) {
    return null;
  }

  return (
    <line x1={x} y1={y} x2={x + width} y2={y} stroke={"#000"} strokeWidth={2} />
  );
};

const DotBar = (props: RectangleProps) => {
  const { x, y, width, height } = props;

  if (x == null || y == null || width == null || height == null) {
    return null;
  }

  return (
    <line
      x1={x + width / 2}
      y1={y + height}
      x2={x + width / 2}
      y2={y}
      stroke={"#000"}
      strokeWidth={2}
      stroke-dasharray={"5"}
    />
  );
};

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
    useSavedState<Scenario | null>("simulationScenario", null);
  const [numberOfSimulations, setNumberOfSimulations] = useSavedState(
    "numberOfSimulations",
    2000
  );
  const [actions, setActions] = useState(["Idle"]);
  const [progress, setProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [output, setOutput] = useState<RiskScenarioSimulationOutput[] | null>(
    null
  );
  const [showRiskFile, setShowRiskFile] =
    useState<RiskScenarioSimulationOutput | null>(null);
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
    setOutput(result?.risks || null);
    // setOutput(output);

    setAction("Done");
    setProgress(0);
  };

  useEffect(() => {
    if (output && selectedRF && selectedScenario)
      setShowRiskFile(
        output.find(
          (o) =>
            o.id === selectedRF.cr4de_riskfilesid &&
            o.scenario === selectedScenario
        ) || null
      );
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
              <Select<Scenario | "">
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
              Risk Matrix
            </Typography>
            <RiskMatrixChart
              data={
                output
                  ? output
                      .filter((o) => {
                        if (selectedRF) {
                          if (o.id !== selectedRF.cr4de_riskfilesid)
                            return false;
                        }
                        if (selectedScenario) {
                          if (o.scenario !== selectedScenario) return false;
                        }
                        return true;
                      })
                      .map((r) => ({
                        id: r.id,
                        hazardId: r.hazardId,
                        name: `${r.name} (${r.scenario})`,
                        scenario: r.scenario,
                        category: r.category,
                        totalImpact: iScale7FromEuros(
                          r.medianImpact,
                          undefined,
                          100
                        ),
                        totalProbability: pScale7FromReturnPeriodMonths(
                          returnPeriodMonthsFromPDaily(r.totalProbability),
                          100
                        ),
                      }))
                  : undefined
              }
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Total impact histogram
            </Typography>
            <ResponsiveContainer width={"100%"} height={400}>
              <BarChart
                data={showRiskFile ? showRiskFile.impact : undefined}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  domain={[0, "dataMax + 0.1"]}
                  tickFormatter={(value) => Math.abs(value).toFixed(2)}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="p"
                  fill="#8884d8"
                  // activeBar={<Rectangle fill="pink" stroke="blue" />}
                >
                  {/* <ErrorBar
                    dataKey="stdError"
                    width={4}
                    strokeWidth={2}
                    stroke="green"
                    direction="y"
                  /> */}
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
                data={showRiskFile ? showRiskFile.indicators : undefined}
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
                  stackId={"a"}
                  dataKey={"min"}
                  fill="none"
                  legendType="none"
                />
                <Bar
                  stackId={"a"}
                  dataKey={"bar"}
                  shape={<HorizonBar />}
                  legendType="none"
                />
                <Bar
                  stackId={"a"}
                  dataKey={"bottomWhisker"}
                  shape={<DotBar />}
                  legendType="none"
                />
                <Bar
                  stackId={"a"}
                  dataKey={"bottomBox"}
                  fill={"#8884d8"}
                  legendType="none"
                />
                <Bar
                  stackId={"a"}
                  dataKey={"bar"}
                  shape={<HorizonBar />}
                  legendType="none"
                />
                <Bar
                  stackId={"a"}
                  dataKey={"topBox"}
                  fill={"#8884d8"}
                  legendType="none"
                />
                <Bar
                  stackId={"a"}
                  dataKey={"topWhisker"}
                  shape={<DotBar />}
                  legendType="none"
                />
                <Bar
                  stackId={"a"}
                  dataKey={"bar"}
                  shape={<HorizonBar />}
                  legendType="none"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Expected impact per cascade
            </Typography>
            <ResponsiveContainer width={"100%"} height={800}>
              <BarChart
                data={
                  showRiskFile ? showRiskFile.cascadeContributions : undefined
                }
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 1]} />
                <YAxis dataKey="name" type="category" width={200} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="averageImpactContribution"
                  fill="#8884d8"
                  // activeBar={<Rectangle fill="pink" stroke="blue" />}
                >
                  {/* <ErrorBar
                    dataKey="stdError"
                    width={4}
                    strokeWidth={2}
                    stroke="green"
                    direction="x"
                  /> */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Probability of cascade effects
            </Typography>
            <ResponsiveContainer width={"100%"} height={800}>
              <BarChart
                data={
                  showRiskFile
                    ? showRiskFile.cascadeCounts
                        .filter((c) => c.id !== showRiskFile.id && c.p > 0.01)
                        .map((c) => ({
                          ...c,
                          name: `${c.name} (${c.scenario})`,
                          fill: c.scenario
                            ? SCENARIO_PARAMS[c.scenario].color
                            : "#8884d8",
                        }))
                    : undefined
                }
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 1]} />
                <YAxis dataKey="name" type="category" width={200} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="p"
                  fill="#8884d8"
                  // activeBar={<Rectangle fill="pink" stroke="blue" />}
                >
                  {/* <ErrorBar
                    dataKey="stdError"
                    width={4}
                    strokeWidth={2}
                    stroke="green"
                    direction="x"
                  /> */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Probability of root causes
            </Typography>
            <ResponsiveContainer width={"100%"} height={800}>
              <BarChart
                data={
                  showRiskFile
                    ? showRiskFile.rootCauses
                        .map((c) => ({
                          ...c,
                          name: `${c.name} (${c.scenario})`,
                          pRel:
                            Math.round(
                              (100 * c.p) / showRiskFile!.totalProbability
                            ) / 100,
                          rp: returnPeriodMonthsFromPDaily(c.p),
                          fill: c.scenario
                            ? SCENARIO_PARAMS[c.scenario].color
                            : "#8884d8",
                        }))
                        .sort((a, b) => b.pRel - a.pRel)
                        .filter((c) => c.pRel > 0.01)
                    : undefined
                }
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, "dataMax"]} />
                <YAxis dataKey="name" type="category" width={200} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="pRel"
                  fill="#8884d8"
                  // activeBar={<Rectangle fill="pink" stroke="blue" />}
                >
                  {/* <ErrorBar
                    dataKey="stdError"
                    width={4}
                    strokeWidth={2}
                    stroke="green"
                    direction="x"
                  /> */}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Probability of first order causes
            </Typography>
            <ResponsiveContainer width={"100%"} height={800}>
              <BarChart
                data={
                  showRiskFile
                    ? showRiskFile.firstOrderCauses
                        .map((c) => ({
                          ...c,
                          name: `${c.name} (${c.scenario})`,
                          pRel:
                            Math.round(
                              (100 * c.p) / showRiskFile!.totalProbability
                            ) / 100,
                          rp: returnPeriodMonthsFromPDaily(c.p),
                          fill: c.scenario
                            ? SCENARIO_PARAMS[c.scenario].color
                            : "#8884d8",
                        }))
                        .sort((a, b) => b.pRel - a.pRel)
                        .filter((c) => c.pRel > 0.01)
                    : undefined
                }
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, "dataMax"]} />
                <YAxis dataKey="name" type="category" width={200} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="pRel"
                  fill="#8884d8"
                  // activeBar={<Rectangle fill="pink" stroke="blue" />}
                >
                  {/* <ErrorBar
                    dataKey="stdError"
                    width={4}
                    strokeWidth={2}
                    stroke="green"
                    direction="x"
                  /> */}
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
