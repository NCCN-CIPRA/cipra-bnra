import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
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
import { useEffect, useMemo, useState } from "react";
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
  TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";
import { iScale7FromEuros } from "../../functions/indicators/impact";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import useSavedState from "../../hooks/useSavedState";
import { DataGrid, GridColDef, GridDeleteIcon } from "@mui/x-data-grid";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import {
  pScale7FromReturnPeriodMonths,
  pTimeframeFromReturnPeriodMonths,
  returnPeriodMonthsFromPDaily,
} from "../../functions/indicators/probability";
import RiskMatrixChart from "../../components/charts/svg/RiskMatrixChart";
import { CascadeContributionData } from "../../functions/simulation/statistics";

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

const diffColumns: GridColDef[] = [
  // { field: "id" },
  {
    field: "hazardId",
    minWidth: 50,
  },
  {
    field: "scenario",
    minWidth: 100,
  },
  { field: "name", flex: 1 },
  { field: "deltaTP", width: 100 },
  { field: "deltaTI", width: 100 },
  { field: "delta", width: 100 },
];

const CPImportanceColumns: GridColDef[] = [
  // { field: "id" },
  {
    field: "cause",
    valueGetter: (c: RiskScenarioSimulationOutput) => `${c.scenario} ${c.name}`,
    flex: 1,
  },
  {
    field: "effect",
    valueGetter: (c: CascadeContributionData) => `${c.scenario} ${c.name}`,
    flex: 1,
  },
  { field: "cp", width: 200, type: "number" },
  { field: "impactPerCP", width: 400, type: "number" },
];

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
  const { data: rss } = useQuery({
    queryKey: [DataTable.RISK_SNAPSHOT],
    queryFn: () => api.getRiskSnapshots(),
    select: (data) => data.filter((rf) => !rf.cr4de_hazard_id.startsWith("X")),
  });
  const riskSnapshots = useMemo(
    () =>
      rss
        ? getRiskCatalogueFromSnapshots(rss.map((r) => parseRiskSnapshot(r)))
        : null,
    [rss]
  );

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

  const diff = useMemo(() => {
    if (!output || !riskSnapshots) return null;

    return output
      .map((risk) => ({
        id: `${risk.id} ${risk.scenario}`,
        hazardId: risk.hazardId,
        name: risk.name,
        scenario: risk.scenario,
        deltaTP:
          Math.round(
            100 *
              (pScale7FromReturnPeriodMonths(
                returnPeriodMonthsFromPDaily(risk.totalProbability),
                100
              ) -
                pScale7FromReturnPeriodMonths(
                  riskSnapshots?.[risk.id].cr4de_quanti[risk.scenario].tp
                    .rpMonths || 0
                ))
          ) / 100,
        deltaTI:
          Math.round(
            100 *
              (iScale7FromEuros(risk.medianImpact, undefined, 100) -
                iScale7FromEuros(
                  riskSnapshots?.[risk.id].cr4de_quanti[risk.scenario].ti.all
                    .euros || 0
                ))
          ) / 100,
        delta:
          Math.round(
            100 *
              (Math.abs(
                pScale7FromReturnPeriodMonths(
                  returnPeriodMonthsFromPDaily(risk.totalProbability),
                  100
                ) -
                  pScale7FromReturnPeriodMonths(
                    riskSnapshots?.[risk.id].cr4de_quanti[risk.scenario].tp
                      .rpMonths || 0
                  )
              ) +
                Math.abs(
                  iScale7FromEuros(risk.medianImpact, undefined, 100) -
                    iScale7FromEuros(
                      riskSnapshots?.[risk.id].cr4de_quanti[risk.scenario].ti
                        .all.euros || 0
                    )
                ))
          ) / 100,
      }))
      .sort((a, b) => b.delta - a.delta);
  }, [output, riskSnapshots]);

  const CPimportance:
    | {
        cause: RiskScenarioSimulationOutput;
        effect: CascadeContributionData;
        cp: number;
        impactPerCP: number;
      }[]
    | null = useMemo(() => {
    if (!output || !cs || !riskSnapshots) return null;

    const cps = [];

    for (const rf of output) {
      for (const cc of rf.cascadeContributions) {
        // Direct probability
        if (!cc.scenario) continue;

        const cascade = cs.find(
          (c) =>
            c._cr4de_cause_hazard_value === rf.id &&
            c._cr4de_effect_hazard_value === cc.id
        );

        if (!cascade) continue;

        const css = parseCascadeSnapshot(
          snapshotFromRiskCascade(riskSnapshots[rf.id], cascade)
        );

        if (css.cr4de_quanti_cp[rf.scenario][cc.scenario].scale7 <= 0) continue;

        cps.push({
          id: `${rf.id} ${rf.scenario} - ${cc.id} ${cc.scenario}`,
          cause: rf,
          effect: cc,
          cp: css.cr4de_quanti_cp[rf.scenario][cc.scenario].scale7,
          impactPerCP: Math.round(
            (rf.totalProbability *
              rf.medianImpact *
              cc.averageImpactContribution) /
              css.cr4de_quanti_cp[rf.scenario][cc.scenario].scale7
          ),
        });
      }
    }

    return cps.sort((a, b) => b.impactPerCP - a.impactPerCP);
  }, [cs, output, riskSnapshots]);

  console.log(CPimportance && CPimportance.slice(0, 20));

  return (
    // <Container sx={{ mb: 18 }}>
    <Box sx={{ m: 4 }}>
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

      <Card sx={{ my: 2 }}>
        <CardHeader title="Change overview" />
        <CardContent>
          <Box>
            <DataGrid
              rows={diff || []}
              columns={diffColumns}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 20 } },
              }}
              pageSizeOptions={[20, 100]}
              checkboxSelection
              sx={{ border: 0 }}
              onRowClick={(r) =>
                setSelectedRF(
                  rfs?.find((rf) => rf.cr4de_hazard_id === r.row.hazardId) ||
                    null
                )
              }
              rowSelection={false}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ my: 2 }}>
        <CardHeader title="Cascade CP Importance" />
        <CardContent>
          <Box>
            <DataGrid
              rows={CPimportance || []}
              columns={CPImportanceColumns}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 20 } },
                sorting: {
                  sortModel: [{ field: "impactPerCP", sort: "desc" }],
                },
              }}
              pageSizeOptions={[5, 10, 20, 100]}
              checkboxSelection
              sx={{ border: 0 }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ my: 2 }}>
        <CardHeader title="Risk Matrix" />
        <CardContent>
          <Box>
            <RiskMatrixChart
              data={
                output
                  ? output
                      // .filter((o) => {
                      //   if (selectedRF) {
                      //     if (o.id !== selectedRF.cr4de_riskfilesid)
                      //       return false;
                      //   }
                      //   if (selectedScenario) {
                      //     if (o.scenario !== selectedScenario) return false;
                      //   }
                      //   return true;
                      // })
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
                        expectedImpact: iScale7FromEuros(
                          r.medianImpact *
                            pTimeframeFromReturnPeriodMonths(
                              returnPeriodMonthsFromPDaily(r.totalProbability),
                              12
                            ),
                          undefined,
                          100
                        ),
                      }))
                  : // .filter((r) => r.expectedImpact > 4)
                    undefined
              }
              setSelectedNodeId={(
                id: string | null,
                scenario: Scenario | null
              ) => {
                if (id !== null) {
                  setSelectedRF(
                    rfs?.find((rf) => rf.cr4de_riskfilesid === id) || null
                  );
                }
                if (scenario !== null) {
                  setSelectedScenario(scenario);
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ my: 2 }}>
        <CardHeader title="Total impact histogram" />
        <CardContent>
          <Box>
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
        </CardContent>
      </Card>

      <Card sx={{ my: 2 }}>
        <CardHeader title="Expected impact per damage indicator" />
        <CardContent>
          <Box>
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
                <Legend />
                <Bar
                  stackId={"a"}
                  dataKey={"min"}
                  name={"Minimum"}
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
                  name="Median"
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
                <Tooltip
                  cursor={{ opacity: 0.5 }}
                  content={({
                    payload,
                    label,
                  }: TooltipContentProps<string | number, string>) => {
                    if (!payload || payload.length <= 0) return null;

                    return (
                      <Card className="custom-tooltip" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          {label}
                        </Typography>
                        <Typography variant="body2">
                          Minimum: <b>{payload[0].payload.raw.min}</b>
                        </Typography>
                        <Typography variant="body2">
                          Lower Quartile:{" "}
                          <b>{payload[0].payload.raw.lowerQuartile}</b>
                        </Typography>
                        <Typography variant="body2">
                          Median: <b>{payload[0].payload.raw.median}</b>
                        </Typography>
                        <Typography variant="body2">
                          Upper Quartile:{" "}
                          <b>{payload[0].payload.raw.upperQuartile}</b>
                        </Typography>
                        <Typography variant="body2">
                          Maximum: <b>{payload[0].payload.raw.max}</b>
                        </Typography>
                      </Card>
                    );
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ my: 2 }}>
        <CardHeader title="Expected impact per cascade" />
        <CardContent>
          <Box>
            <ResponsiveContainer width={"100%"} height={800}>
              <BarChart
                data={
                  showRiskFile
                    ? showRiskFile.cascadeContributions
                        .filter((c) => c.averageImpactContribution > 0.01)
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
        </CardContent>
      </Card>

      <Card sx={{ my: 2 }}>
        <CardHeader title="Probability of cascade effects" />
        <CardContent>
          <Box>
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
        </CardContent>
      </Card>

      <Card sx={{ my: 2 }}>
        <CardHeader title="Probability of root causes" />
        <CardContent>
          <Box>
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
                              (1000 * c.p) / showRiskFile!.totalProbability
                            ) / 1000,
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

      <Card sx={{ my: 2 }}>
        <CardHeader title="Probability of first order causes" />
        <CardContent>
          <Box>
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
                              (1000 * c.p) / showRiskFile!.totalProbability
                            ) / 1000,
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
    </Box>
  );
}
