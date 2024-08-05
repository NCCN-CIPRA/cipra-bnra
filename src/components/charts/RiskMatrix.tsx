import { useCallback, useMemo, useState } from "react";
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
import SaveIcon from "@mui/icons-material/Download";
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
  Button,
  IconButton,
} from "@mui/material";
import { getMoneyString, getTotalImpactRelativeScale, IMPACT_CATEGORY } from "../../functions/Impact";
import {
  SCENARIOS,
  SCENARIO_PARAMS,
  SCENARIO_SUFFIX,
  getScenarioParameter,
  getScenarioSuffix,
} from "../../functions/scenarios";
import { CATEGORY_NAMES, DVRiskFile, RISK_CATEGORY } from "../../types/dataverse/DVRiskFile";
import { scaleLog, select } from "d3";
import getCategoryColor from "../../functions/getCategoryColor";
import { getTotalProbabilityRelativeScale, getYearlyProbability } from "../../functions/Probability";
import { hexToRGB } from "../../functions/colors";
import { capFirst } from "../../functions/capFirst";
import { useGenerateImage } from "recharts-to-png";
import FileSaver from "file-saver";
import { useTranslation } from "react-i18next";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";

interface MatrixRisk {
  riskId: string;
  id: string;
  title: string;
  fullTitle: string;
  x: number;
  y: number;
  tr: number;
  scenario: SCENARIOS;
  code: string;
  category: RISK_CATEGORY;
  mrs: boolean;
}

const CATEGORIES: Partial<{
  [key in RISK_CATEGORY]: {
    color: string;
    shape: "circle" | "cross" | "diamond" | "square" | "star" | "triangle" | "wye";
  };
}> = {
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

const defaultFields = (c: SmallRisk) =>
  ({
    riskId: c.cr4de_riskfilesid,
    title: c.cr4de_title,
    executiveSummary: ES_RISKS.indexOf(c.cr4de_hazard_id || "") >= 0,
    code: c.cr4de_hazard_id,
    category: c.cr4de_risk_category,
  } as Partial<MatrixRisk>);

const pScale = scaleLog().base(100);

export default function RiskMatrix({
  riskFiles,
  selectedNodeId = null,
  setSelectedNodeId,

  scenario = "MRS",
  labels = false,
  onlyES = false,
  category = "All",
  impact = "All",
  categoryDisplay = "shapes",
  scenarioDisplay = "colors",
}: {
  riskFiles: SmallRisk[] | null;
  selectedNodeId?: string | null;
  setSelectedNodeId: (id: string | null) => void;

  scenario?: "All" | "MRS" | SCENARIOS;
  labels?: Boolean;
  onlyES?: Boolean;
  category?: "All" | RISK_CATEGORY;
  impact?: "All" | IMPACT_CATEGORY;
  categoryDisplay?: "shapes" | "colors" | "both" | "none";
  scenarioDisplay?: "colors" | "shapes" | "none";
}) {
  const { t } = useTranslation();
  const [dots, setDots] = useState<MatrixRisk[] | null>(null);

  // useCurrentPng usage (isLoading is optional)
  const [getDivJpeg, { ref, isLoading }] = useGenerateImage({
    type: "image/png",
    quality: 1,
    options: { scale: 4 } as any,
  });

  // Can also pass in options for html2canvas
  // const [getPng, { ref }] = useCurrentPng({ backgroundColor: '#000' });

  const handleDownload = useCallback(async () => {
    const png = await getDivJpeg();

    // Verify that png is not undefined
    if (png) {
      // Download with FileSaver
      FileSaver.saveAs(png, `riskMatrix.png`);
    }
  }, [getDivJpeg]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active) {
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

  const getColor = (entry: MatrixRisk, opacity: number = 1) => {
    if (scenarioDisplay === "colors") {
      return hexToRGB(SCENARIO_PARAMS[entry.scenario].color, opacity);
    }
    if (categoryDisplay === "colors" || categoryDisplay === "both") {
      return hexToRGB(CATEGORIES[entry.category]?.color || `rgba(150,150,150,${opacity})`, opacity);
    }

    return `rgba(150,150,150,${opacity})`;
  };

  const recalcPI = (calculation: RiskCalculation, scenarioSuffix: SCENARIO_SUFFIX, visible = true) => {
    if (!visible) {
      return {
        tp: 0,
        ti: 0,
        tr: 0,
      };
    }
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
    const i = getTotalImpactRelativeScale(calculation, scenarioSuffix);

    return {
      tp: p,
      ti: i,
      tr: p * i,
    };
  };

  useMemo(() => {
    if (!riskFiles) return;

    const allDots = riskFiles
      .filter((rf) => rf.cr4de_risk_category !== RISK_CATEGORY.EMERGING)
      .reduce((d, rf) => {
        const tmp = [...d];

        [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].forEach((s) => {
          const tp = getScenarioParameter(rf, "TP", s);
          const ti = impact === "All" ? getScenarioParameter(rf, "TI", s) : getScenarioParameter(rf, `TI_${impact}`, s);

          if (tp !== null && ti !== null) {
            tmp.push({
              id: `${rf.cr4de_riskfilesid}${getScenarioSuffix(s)}`,
              fullTitle: `${capFirst(s)} ${rf.cr4de_title}`,
              scenario: s,
              tp: tp,
              ti: ti,
              tr: tp * ti,
              ...defaultFields(rf),
              mrs: rf.cr4de_mrs === s,
            } as MatrixRisk);
          }
        });

        return tmp;
      }, [] as MatrixRisk[]);

    allDots.sort((a, b) => (a.id > b.id ? -1 : 1));

    setDots(allDots);
  }, [riskFiles, impact]);

  const categoryLegend = categoryDisplay !== "none" && category === "All";
  const scenarioLegend = scenarioDisplay === "colors";

  const legendMargin = 0 + (categoryLegend ? 60 : 0) + (scenarioLegend ? 30 : 0);

  return (
    <Stack direction="row" sx={{ width: "100%", height: "100%", position: "relative" }}>
      <Box ref={ref} sx={{ flex: 1, height: "100%", p: 2 }}>
        <ResponsiveContainer width="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 30 + legendMargin,
              left: 60,
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

            <YAxis
              type="number"
              dataKey="tp"
              name="probability"
              unit=""
              scale="linear"
              domain={[0, 5.5]}
              // tickCount={5}
              tickFormatter={(s, n) => t(getScaleString(s))}
              ticks={[1, 2, 3, 4, 5]}
              label={{
                offset: -45,
                // value: scales === "classes" ? "Probability" : "Yearly Probability",
                value: t("learning.probability.2.text.title", "Probability"),
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
              tickFormatter={(s, n) => t(getScaleString(s))}
              ticks={[1, 2, 3, 4, 5]}
              label={{
                // value: scales === "classes" ? "Impact" : "Impact of an event",
                value: "Impact",
                position: "insideBottom",
                offset: -20,

                props: { fontWeight: "bold" },
              }}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
            {Object.entries(CATEGORIES).map(([CATEGORY, shape]) => {
              const catData = dots?.filter((d) => d.category === CATEGORY) || [];

              return (
                <Scatter
                  key={CATEGORY}
                  name={`${CATEGORY} Risks`}
                  data={catData}
                  fill="#8884d8"
                  shape={categoryDisplay === "shapes" || categoryDisplay === "both" ? shape.shape : "circle"}
                >
                  {labels && (category === "All" || category === CATEGORY) && (
                    <LabelList dataKey="code" position="insideTop" offset={15} fontSize={20} />
                  )}
                  {catData.map((entry, index) => {
                    let opacity = 1;
                    let strokeOpacity = 0.4;
                    if (selectedNodeId !== null) {
                      if (selectedNodeId !== entry.riskId) opacity = opacity * 0.2;
                    }

                    if (onlyES && ES_RISKS.indexOf(entry.code) < 0) {
                      opacity = 0;
                      strokeOpacity = 0;
                    }

                    if (scenario === "MRS") {
                      if (!entry.mrs) {
                        opacity = 0;
                        strokeOpacity = 0;
                      }
                    } else if (scenario !== "All" && scenario !== entry.scenario) {
                      opacity = 0;
                      strokeOpacity = 0;
                    }

                    if (category !== "All" && entry.category !== category) {
                      if (onlyES) {
                        opacity *= 0.2;
                        strokeOpacity *= 0.2;
                      } else {
                        opacity = 0;
                        strokeOpacity = 0;
                      }
                    }

                    // if (nonKeyRisks !== "show" && !entry.keyRisk) {
                    //   if (nonKeyRisks === "fade") {
                    //     opacity = opacity * 0.2;
                    //   } else {
                    //     opacity = 0;
                    //   }
                    // }

                    // if (worstCase && !entry.worstCase) {
                    //   opacity = 0;
                    // }

                    return (
                      <Cell
                        id={`cell-${entry.id}`}
                        key={`cell-${entry.id}`}
                        // fill={}
                        stroke={`rgba(150,150,150,${strokeOpacity})`}
                        strokeWidth={1}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNodeId(entry.riskId);
                        }}
                        style={{
                          // opacity: entry.visible ? opacity : 0,
                          fill: getColor(entry, opacity),
                          transition: "all 1s ease",
                        }}
                      />
                    );
                  })}
                </Scatter>
              );
            })}
          </ScatterChart>
        </ResponsiveContainer>
        <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
          {categoryLegend && (
            <Box className="custom-legend-wrapper" sx={{ flex: 1, height: 60 }}>
              <Legend
                wrapperStyle={{ position: "relative" }}
                align="center"
                payload={Object.entries(CATEGORIES).map(([CATEGORY, shape]) => ({
                  value: t(CATEGORY, CATEGORY_NAMES[CATEGORY as RISK_CATEGORY]),
                  type: categoryDisplay === "both" || categoryDisplay === "shapes" ? shape.shape : "circle",
                  color:
                    categoryDisplay === "both" || categoryDisplay === "colors"
                      ? CATEGORIES[CATEGORY as RISK_CATEGORY]?.color || "rgba(150,150,150,1)"
                      : "rgba(150,150,150,1)",
                }))}
              />
            </Box>
          )}
          {scenarioLegend && (
            <Box className="custom-legend-wrapper" sx={{ flex: 1, height: 30, textAlign: "center" }}>
              <Legend
                chartHeight={30}
                height={30}
                wrapperStyle={{ position: "relative" }}
                align="center"
                payload={Object.entries(SCENARIO_PARAMS).map(([scenario, params]) => ({
                  value: t(`2A.${scenario}.title`, `${scenario[0].toUpperCase()}${scenario.slice(1)} Scenario`),
                  type: "circle",
                  color: params.color,
                }))}
              />
            </Box>
          )}
        </Box>
      </Box>
      <IconButton sx={{ position: "absolute", top: 45, right: 45 }} onClick={handleDownload}>
        <SaveIcon />
      </IconButton>
    </Stack>
  );
}
