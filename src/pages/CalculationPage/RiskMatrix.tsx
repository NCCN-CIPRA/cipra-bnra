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
  Input,
} from "@mui/material";
import { getMoneyString } from "../../functions/Impact";
import { SCENARIOS, SCENARIO_PARAMS, SCENARIO_SUFFIX } from "../../functions/scenarios";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { scaleLog, select } from "d3";
import getCategoryColor from "../../functions/getCategoryColor";
import { getTotalProbabilityRelativeScale, getYearlyProbability } from "../../functions/Probability";
import { getTotalImpactRelative } from "../../functions/TotalImpact";

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

const CATEGORIES: {
  [key: string]: { color: string; shape: "circle" | "cross" | "diamond" | "square" | "star" | "triangle" | "wye" };
} = {
  Cyber: {
    shape: "square",
    color: getCategoryColor("Cyber"),
  },
  EcoTech: {
    shape: "star",
    color: getCategoryColor("EcoTech"),
  },
  Health: {
    shape: "diamond",
    color: getCategoryColor("Health"),
  },
  "Man-made": {
    shape: "wye",
    color: getCategoryColor("Man-made"),
  },
  Nature: {
    shape: "triangle",
    color: getCategoryColor("Nature"),
  },
  Transversal: {
    shape: "circle",
    color: getCategoryColor("Transversal"),
  },
};

const CATEGORY_NAMES: { [key: string]: string } = {
  Cyber: "Cyber Risks",
  EcoTech: "Economical and Technological Risks",
  Health: "Health Risks",
  "Man-made": "Man-made Risks and Malicious Actors",
  Nature: "Natural Risks",
  Transversal: "Societal Risks",
};

const ES_RISKS = [
  "C05",
  "C04",
  "H04",
  "H01",
  "H03",
  "H02",
  "M01",
  "M14",
  "M13",
  "M17",
  "M16",
  "M06",
  "N14",
  "N18",
  "N17",
  "N01",
  "N02",
  "N03",
  "N13",
  "S03",
  "S15",
  "S06",
  "S02",
  "S01",
  "S19",
  "T05",
  "T09",
  "T16",
  "T17",
];

const getScaleString = (value: number) => {
  if (value <= 1) return "Very Low";
  if (value <= 2) return "Low";
  if (value <= 3) return "Medium";
  if (value <= 4) return "High";
  return "Very High";
};

const defaultFields = (c: RiskCalculation) =>
  ({
    riskId: c.riskId,
    title: c.riskTitle,
    keyRisk: Boolean(c.keyRisk),
    code: c.code,
    category: c.category,
  } as Partial<MatrixRisk>);

const pScale = scaleLog().base(100);

export default function RiskMatrix({
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
  const [es, setES] = useState(false);
  const [scales, setScales] = useState<"absolute" | "classes">("classes");
  const [nonKeyRisks, setNonKeyRisks] = useState<"show" | "fade" | "hide">("show");
  const [categories, setCategories] = useState<"shapes" | "colors" | "both" | "none">("none");
  const [scenarios, setScenarios] = useState<"colors" | "shapes" | "none">("colors");

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active) {
      if (scales === "absolute")
        return (
          <Stack sx={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid #eee", p: 1 }}>
            <Typography variant="subtitle1">{payload?.[0].payload.title}</Typography>
            <Typography variant="subtitle2">{`Total Probability: ${
              Math.round((payload?.[1].value as number) * 100000) / 1000
            }%`}</Typography>
            <Typography variant="subtitle2">{`Total Impact: ${getMoneyString(
              payload?.[0].value as number
            )}`}</Typography>
            <Typography variant="subtitle2">{`Total Risk: ${getMoneyString(
              payload?.[0].payload.tr as number
            )}`}</Typography>
          </Stack>
        );
      return (
        <Stack sx={{ backgroundColor: "rgba(255,255,255,0.8)", border: "1px solid #eee", p: 1 }}>
          <Typography variant="subtitle1">{payload?.[0].payload.title}</Typography>
          <Typography variant="subtitle2">
            {`Total Probability: ${Math.round((payload?.[1].value as number) * 10) / 10}`} / 5
          </Typography>
          <Typography variant="subtitle2">
            {`Total Impact: ${Math.round((payload?.[0].value as number) * 10) / 10}`} / 5
          </Typography>
          <Typography variant="subtitle2">{`Total Risk: ${
            Math.round((payload?.[0].payload.tr as number) * 10) / 10
          }`}</Typography>
        </Stack>
      );
    }

    return null;
  };

  const getColor = (entry: MatrixRisk) => {
    if (scenarios === "colors") {
      return SCENARIO_PARAMS[entry.scenario].color;
    }
    if (categories === "colors" || categories === "both") {
      return CATEGORIES[entry.category].color;
    }

    return "rgba(150,150,150,1)";
  };

  const recalcPI = (calculation: RiskCalculation, scenarioSuffix: SCENARIO_SUFFIX) => {
    // scales === "classes"
    //   ? {
    //       x: 5 * (1 - Math.pow(1 - tp, 365)),
    //       y: Math.log10(ti / 100000000) / 0.9,
    //       tr: Math.log10(100) / Math.log10(tp * ti),
    //     }
    //   : {
    //       x: getYearlyProbability(tp),
    //       y: ti,
    //       tr: tp * ti,
    //     };
    const p = getTotalProbabilityRelativeScale(calculation, scenarioSuffix);
    const i = getTotalImpactRelative(calculation, scenarioSuffix);

    return {
      tp: p,
      ti: i,
      tr: p * i,
    };
  };

  useMemo(() => {
    if (!calculations) return;

    setDots(
      calculations
        .reduce((split, c) => {
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
                  ...recalcPI(c, "_c"),
                } as MatrixRisk,
                {
                  id: `${c.riskId}_m`,
                  fullTitle: `Major ${c.riskTitle}`,
                  ...recalcPI(c, "_m"),
                  scenario: SCENARIOS.MAJOR,
                  ...defaultFields(c),
                } as MatrixRisk,
                {
                  riskId: c.riskId,
                  id: `${c.riskId}_e`,
                  fullTitle: `Extreme ${c.riskTitle}`,
                  ...recalcPI(c, "_e"),
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
                      ...recalcPI(c, "_c"),
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
                      ...recalcPI(c, "_m"),
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
                      ...recalcPI(c, "_e"),
                      scenario: SCENARIOS.EXTREME,
                      ...defaultFields(c),
                    } as MatrixRisk,
                  ]),
            ];
          }
        }, [] as MatrixRisk[])
        .filter((r) => {
          if (es) {
            return ES_RISKS.indexOf(r.code) >= 0;
          }
          return true;
        })
    );
  }, [calculations, worstCase, scales, nonKeyRisks, es]);

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
                <YAxis
                  type="number"
                  dataKey="tp"
                  name="probability"
                  unit="%"
                  scale="linear"
                  domain={[0, 1]}
                  // tickCount={10}
                  tickFormatter={(n) => `${Math.round(n * 100000) / 1000}`}
                  ticks={[0.2, 0.4, 0.6, 0.8, 1]}
                />
                <XAxis
                  type="number"
                  dataKey="ti"
                  name="impact"
                  scale="log"
                  domain={[50000000, 5000000000000]}
                  tickFormatter={getMoneyString}
                  ticks={[50000000, 500000000, 5000000000, 50000000000, 500000000000]}
                />
              </>
            ) : (
              <>
                <YAxis
                  type="number"
                  dataKey="tp"
                  name="probability"
                  unit=""
                  scale="linear"
                  domain={[0, 5.5]}
                  // tickCount={5}
                  tickFormatter={(s, n) => getScaleString(s)}
                  ticks={[1, 2, 3, 4, 5]}
                  label={{
                    offset: -15,
                    value: scales === "classes" ? "Probability" : "Yearly Probability",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <XAxis
                  type="number"
                  dataKey="ti"
                  name="impact"
                  domain={[0, 5.5]}
                  // tickCount={6}
                  // tickFormatter={(s, n) => `TI${n}`}
                  // ticks={[160000000, 800000000, 4000000000, 20000000000, 100000000000, 500000000000]}
                  tickFormatter={(s, n) => getScaleString(s)}
                  ticks={[1, 2, 3, 4, 5]}
                  label={{
                    value: scales === "classes" ? "Impact" : "Impact of an event",
                    position: "insideBottom",
                    offset: -20,

                    props: { fontWeight: "bold" },
                  }}
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
                  shape={categories === "shapes" || categories === "both" ? shape.shape : "circle"}
                >
                  {labels && <LabelList dataKey="code" position="insideTop" offset={15} fontSize={20} />}
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
                        fill={getColor(entry)}
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
          {categories === "shapes" ||
            (categories === "both" && (
              <Box sx={{ flex: 1 }}>
                <Legend
                  wrapperStyle={{ position: "relative" }}
                  payload={Object.entries(CATEGORIES).map(([CATEGORY, shape]) => ({
                    value: CATEGORY_NAMES[CATEGORY],
                    type: shape.shape,
                    color: categories === "both" ? CATEGORIES[CATEGORY].color : "rgba(150,150,150,1)",
                  }))}
                />
              </Box>
            ))}
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
            <FormControlLabel
              control={<Checkbox checked={es} onChange={(e) => setES(e.target.checked)} />}
              label="Show only executive summary"
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
                  <MenuItem value={"colors"}>Colors</MenuItem>
                  <MenuItem value={"both"}>Shapes & Colors</MenuItem>
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
            <Stack direction="row" spacing={5}>
              <FormControl sx={{ flex: 1 }} fullWidth>
                <InputLabel>Font Size</InputLabel>
                <Input type="number" />
              </FormControl>
            </Stack>
          </Stack>
        </Stack>
      </AccordionActions>
    </Accordion>
  );
}
