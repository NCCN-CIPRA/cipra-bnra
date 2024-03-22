import { useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell,
  LabelList,
  Legend,
} from "recharts";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import {
  Typography,
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
} from "@mui/material";
import { getMoneyString } from "../../functions/Impact";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { select } from "d3";

interface MatrixRisk {
  riskId: string;
  id: string;
  title: string;
  fullTitle: string;
  x: number;
  y: number;
  tr: number;
  scenario: SCENARIOS;
  keyRisk: boolean;
  code: string;
  category: string;
}

const CATEGORIES: { [key: string]: "circle" | "cross" | "diamond" | "square" | "star" | "triangle" | "wye" } = {
  Cyber: "square",
  EcoTech: "star",
  Health: "diamond",
  "Man-made": "cross",
  Nature: "triangle",
  Transversal: "circle",
};

const CATEGORY_NAMES: { [key: string]: string } = {
  Cyber: "Cyber Risks",
  EcoTech: "Economical and Technological Risks",
  Health: "Health Risks",
  "Man-made": "Man-made Risks and Malicious Actors",
  Nature: "Natural Risks",
  Transversal: "Societal Risks",
};

const defaultFields = (c: RiskCalculation) =>
  ({
    riskId: c.riskId,
    title: c.riskTitle,
    keyRisk: Boolean(c.keyRisk),
    code: c.code,
    category: c.category,
  } as Partial<MatrixRisk>);

export default function CalculationsRiskMatrix({
  calculations,
  selectedNodeId,
  setSelectedNodeId,
}: {
  calculations: RiskCalculation[] | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
}) {
  const [dots, setDots] = useState<MatrixRisk[] | null>(null);
  const [worstCase, setWorstCase] = useState(false);
  const [labels, setLabels] = useState(false);
  const [scales, setScales] = useState<"absolute" | "classes">("classes");
  const [nonKeyRisks, setNonKeyRisks] = useState<"show" | "fade" | "hide">("show");
  const [categories, setCategories] = useState<"shapes" | "none">("none");
  const [scenarios, setScenarios] = useState<"colors" | "none">("colors");

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active) {
      if (scales === "absolute")
        return (
          <Stack sx={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid #eee", p: 1 }}>
            <Typography variant="subtitle1">{payload?.[0].payload.title}</Typography>
            <Typography variant="subtitle2">{`Total Probability: ${
              Math.round((payload?.[0].value as number) * 100000) / 1000
            }%`}</Typography>
            <Typography variant="subtitle2">{`Total Impact: ${getMoneyString(
              payload?.[1].value as number
            )}`}</Typography>
            <Typography variant="subtitle2">{`Total Risk: ${getMoneyString(
              payload?.[0].payload.tr as number
            )}`}</Typography>
          </Stack>
        );
      return (
        <Stack sx={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid #eee", p: 1 }}>
          <Typography variant="subtitle1">{payload?.[0].payload.title}</Typography>
          <Typography variant="subtitle2">{`Total Probability: TP${
            Math.round((payload?.[0].value as number) * 10) / 10
          }`}</Typography>
          <Typography variant="subtitle2">{`Total Impact: TI${
            Math.round((payload?.[1].value as number) * 10) / 10
          }`}</Typography>
          <Typography variant="subtitle2">{`Total Risk: TR${
            Math.round((payload?.[0].payload.tr as number) * 10) / 10
          }`}</Typography>
        </Stack>
      );
    }

    return null;
  };

  const recalcPI = (tp: number, ti: number) =>
    scales === "classes"
      ? {
          x: 5 * (1 - Math.pow(1 - tp, 365)),
          y: Math.log10(ti / 100000000) / 0.9,
          tr: Math.log10(100) / Math.log10(tp * ti),
        }
      : {
          x: tp,
          y: ti,
          tr: tp * ti,
        };

  useMemo(() => {
    if (!calculations) return;

    setDots(
      calculations.reduce((split, c) => {
        const rs = [c.tp_c * c.ti_c, c.tp_m * c.ti_m, c.tp_e * c.ti_e];

        if (worstCase) {
          if ((c.tp_c === 0 && c.tp_m === 0 && c.tp_e === 0) || (c.ti_c === 0 && c.ti_m === 0 && c.ti_e === 0))
            return split;

          return [
            ...split,
            [
              {
                id: `${c.riskId}_c`,
                fullTitle: `Considerable ${c.riskTitle}`,
                scenario: SCENARIOS.CONSIDERABLE,
                ...defaultFields(c),
                ...recalcPI(c.tp_c, c.ti_c),
              } as MatrixRisk,
              {
                id: `${c.riskId}_m`,
                fullTitle: `Major ${c.riskTitle}`,
                ...recalcPI(c.tp_m, c.ti_m),
                scenario: SCENARIOS.MAJOR,
                ...defaultFields(c),
              } as MatrixRisk,
              {
                riskId: c.riskId,
                id: `${c.riskId}_e`,
                fullTitle: `Extreme ${c.riskTitle}`,
                ...recalcPI(c.tp_e, c.ti_e),
                scenario: SCENARIOS.EXTREME,
                ...defaultFields(c),
              } as MatrixRisk,
            ][rs.indexOf(Math.max(...rs))],
          ];
        } else {
          return [
            ...split,
            ...(c.tp_c === 0 || c.ti_c === 0
              ? []
              : [
                  {
                    riskId: c.riskId,
                    id: `${c.riskId}_c`,
                    fullTitle: `Considerable ${c.riskTitle}`,
                    ...recalcPI(c.tp_c, c.ti_c),
                    scenario: SCENARIOS.CONSIDERABLE,
                    ...defaultFields(c),
                  } as MatrixRisk,
                ]),
            ...(c.tp_m === 0 || c.ti_m === 0
              ? []
              : [
                  {
                    riskId: c.riskId,
                    id: `${c.riskId}_m`,
                    fullTitle: `Major ${c.riskTitle}`,
                    ...recalcPI(c.tp_m, c.ti_m),
                    scenario: SCENARIOS.MAJOR,
                    ...defaultFields(c),
                  } as MatrixRisk,
                ]),
            ...(c.tp_e === 0 || c.ti_e === 0
              ? []
              : [
                  {
                    riskId: c.riskId,
                    id: `${c.riskId}_e`,
                    fullTitle: `Extreme ${c.riskTitle}`,
                    ...recalcPI(c.tp_e, c.ti_e),
                    scenario: SCENARIOS.EXTREME,
                    ...defaultFields(c),
                  } as MatrixRisk,
                ]),
          ];
        }
      }, [] as MatrixRisk[])
    );
  }, [calculations, worstCase, scales, nonKeyRisks]);

  return (
    <Accordion disabled={!calculations}>
      <AccordionSummary>
        <Typography variant="subtitle2">Risk matrix</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ResponsiveContainer width="100%" aspect={1}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
            onClick={() => setSelectedNodeId(null)}
          >
            <defs>
              <linearGradient id="colorUv" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="25%" stopColor="#f4b183" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#ffd966" stopOpacity={0.4} />
                <stop offset="75%" stopColor="#A9D18E" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid fill="url(#colorUv)" />
            {scales === "absolute" ? (
              <>
                <XAxis
                  type="number"
                  dataKey="x"
                  name="probability"
                  unit="%"
                  scale="log"
                  domain={["auto", "auto"]}
                  // tickCount={10}
                  tickFormatter={(n) => `${Math.round(n * 100000) / 1000}`}
                  ticks={[0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="impact"
                  scale="log"
                  domain={["auto", "auto"]}
                  tickCount={10}
                  tickFormatter={getMoneyString}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="number"
                  dataKey="x"
                  name="probability"
                  unit=""
                  scale="linear"
                  domain={[0, 5]}
                  // tickCount={10}
                  tickFormatter={(n) => `TP${n}`}
                  ticks={[1, 2, 3, 4, 5]}
                  label={{
                    value: "Total Probability",
                    position: "insideBottom",
                    offset: -10,
                    props: { fontWeight: "bold" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="impact"
                  scale="linear"
                  domain={[0, 5]}
                  tickCount={6}
                  tickFormatter={(n) => `TI${n}`}
                  ticks={[1, 2, 3, 4, 5]}
                  label={{ value: "Total Impact", angle: -90, position: "insideLeft" }}
                />
              </>
            )}
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
            {Object.entries(CATEGORIES).map(([CATEGORY, shape]) => {
              const catData = dots?.filter((d) => d.category === CATEGORY) || [];

              return (
                <Scatter
                  key={CATEGORY}
                  name={`${CATEGORY} Risks`}
                  data={catData}
                  fill="#8884d8"
                  shape={categories === "shapes" ? shape : "circle"}
                >
                  {labels && <LabelList dataKey="code" position="insideTop" offset={15} />}
                  {catData.map((entry, index) => {
                    let opacity = 1;
                    if (selectedNodeId !== null) {
                      if (selectedNodeId !== entry.riskId) opacity = opacity * 0.2;
                    }
                    if (nonKeyRisks !== "show" && !entry.keyRisk) {
                      if (nonKeyRisks === "fade") {
                        opacity = opacity * 0.2;
                      } else {
                        opacity = 0;
                      }
                    }

                    return (
                      <Cell
                        key={`cell-${entry.id}`}
                        fill={scenarios === "colors" ? SCENARIO_PARAMS[entry.scenario].color : "rgba(150,150,150,1)"}
                        stroke="rgba(150,150,150,0.4)"
                        strokeWidth={1}
                        opacity={opacity}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(entry.riskId);
                        }}
                      />
                    );
                  })}
                </Scatter>
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
        <Stack direction="row" sx={{ mx: 4, pb: 4, mt: 2 }} spacing={4}>
          {categories === "shapes" && (
            <Box sx={{ flex: 1 }}>
              <Legend
                wrapperStyle={{ position: "relative" }}
                payload={Object.entries(CATEGORIES).map(([CATEGORY, shape]) => ({
                  value: CATEGORY_NAMES[CATEGORY],
                  type: shape,
                  color: "rgba(150,150,150,1)",
                }))}
              />
            </Box>
          )}
          {scenarios === "colors" && (
            <Box sx={{ flex: 1 }}>
              <Legend
                wrapperStyle={{ position: "relative" }}
                payload={Object.entries(SCENARIO_PARAMS).map(([scenario, params]) => ({
                  value: `${scenario[0].toUpperCase()}${scenario.slice(1)} Scenario`,
                  type: "circle",
                  color: params.color,
                }))}
              />
            </Box>
          )}
        </Stack>
      </AccordionDetails>
      <AccordionActions sx={{ mx: 2 }}>
        <Stack direction="row" spacing={5} sx={{ flex: 1 }}>
          <FormGroup sx={{}}>
            <FormControlLabel
              control={<Checkbox checked={worstCase} onChange={(e) => setWorstCase(e.target.checked)} />}
              label="Show only worst case scenario"
            />
            <FormControlLabel
              control={<Checkbox checked={labels} onChange={(e) => setLabels(e.target.checked)} />}
              label="Show labels"
            />
          </FormGroup>
          <Stack direction="column" sx={{ flex: 1 }} spacing={3}>
            <Stack direction="row" spacing={5}>
              <FormControl sx={{ flex: 1 }} fullWidth>
                <InputLabel>Scale Display</InputLabel>
                <Select value={scales} label="Scale Display" onChange={(e) => setScales(e.target.value as any)}>
                  <MenuItem value={"classes"}>Classes</MenuItem>
                  <MenuItem value={"absolute"}>Absolute</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ flex: 1 }} fullWidth>
                <InputLabel>Non-key Risks</InputLabel>
                <Select
                  value={nonKeyRisks}
                  label="Non-key Risks"
                  onChange={(e) => setNonKeyRisks(e.target.value as any)}
                >
                  <MenuItem value={"show"}>Show</MenuItem>
                  <MenuItem value={"fade"}>Fade</MenuItem>
                  <MenuItem value={"hide"}>Hide</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={5}>
              <FormControl sx={{ flex: 1 }} fullWidth>
                <InputLabel>Categories display</InputLabel>
                <Select
                  value={categories}
                  label="Categories display"
                  onChange={(e) => setCategories(e.target.value as any)}
                >
                  <MenuItem value={"shapes"}>Shapes</MenuItem>
                  <MenuItem value={"none"}>None</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ flex: 1 }} fullWidth>
                <InputLabel>Scenarios display</InputLabel>
                <Select
                  value={scenarios}
                  label="Scenarios display"
                  onChange={(e) => setScenarios(e.target.value as any)}
                >
                  <MenuItem value={"colors"}>Colors</MenuItem>
                  <MenuItem value={"none"}>None</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Stack>
      </AccordionActions>
    </Accordion>
  );
}
