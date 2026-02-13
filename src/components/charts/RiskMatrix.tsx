import { useCallback, useMemo, useState } from "react";
import SaveIcon from "@mui/icons-material/Download";
import { Stack, Box, IconButton } from "@mui/material";
import { IMPACT_CATEGORY } from "../../functions/Impact";
import { SCENARIOS, getScenarioSuffix } from "../../functions/scenarios";
import {
  RISK_CATEGORY,
  RiskFileQuantiResults,
} from "../../types/dataverse/DVRiskFile";
import { capFirst } from "../../functions/capFirst";
import { useGenerateImage } from "recharts-to-png";
import FileSaver from "file-saver";
import { BasePageContext } from "../../pages/BasePage";
import { useOutletContext } from "react-router-dom";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import {
  pScale7FromReturnPeriodMonths,
  returnPeriodMonthsFromYearlyEventRate,
} from "../../functions/indicators/probability";
import { iScale7FromEuros } from "../../functions/indicators/impact";
import { AggregatedImpacts } from "../../types/simulation";
import RiskMatrixChart from "./svg/RiskMatrixChart";
import { Legend } from "recharts";

interface MatrixRisk {
  riskId: string;
  id: string;
  title: string;
  fullTitle: string;
  ti: number;
  tp: number;
  tr: number;
  scenario: SCENARIOS;
  code: string;
  category: RISK_CATEGORY;
  mrs: boolean;
}

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

const defaultFields = (c: DVRiskSnapshot) =>
  ({
    riskId: c._cr4de_risk_file_value,
    title: c.cr4de_title,
    executiveSummary: ES_RISKS.indexOf(c.cr4de_hazard_id || "") >= 0,
    code: c.cr4de_hazard_id,
    category: c.cr4de_category,
  } as Partial<MatrixRisk>);

export default function RiskMatrix({
  riskFiles,
  selectedNodeId = null,
  setSelectedNodeId = () => {},

  scenario = "MRS",
  labels = false,
  labelSize = null,
  onlyES = false,
  category = "All",
  impact = "All",
  categoryDisplay = "shapes",
  scenarioDisplay = "colors",
}: {
  riskFiles: DVRiskSnapshot[] | null;
  selectedNodeId?: string | null;
  setSelectedNodeId?: (id: string | null) => void;

  scenario?: "All" | "MRS" | SCENARIOS;
  labels?: boolean;
  labelSize?: number | null;
  onlyES?: boolean;
  category?: "All" | RISK_CATEGORY;
  impact?: "All" | IMPACT_CATEGORY;
  categoryDisplay?: "shapes" | "colors" | "both" | "none";
  scenarioDisplay?: "colors" | "shapes" | "none";
}) {
  const { user } = useOutletContext<BasePageContext>();
  const [dots, setDots] = useState<MatrixRisk[] | null>(null);

  // useCurrentPng usage (isLoading is optional)
  const [getDivJpeg, { ref }] = useGenerateImage({
    type: "image/png",
    quality: 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  useMemo(() => {
    if (!riskFiles) return;

    const allDots = riskFiles
      .filter((rf) => rf.cr4de_category !== RISK_CATEGORY.EMERGING)
      .reduce((d, rf) => {
        const tmp = [...d];

        [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].forEach(
          (s) => {
            const i = impact.toLowerCase() as "all" | "h" | "s" | "e" | "f";
            const results = rf.cr4de_quanti_results as
              | RiskFileQuantiResults
              | null
              | undefined;

            const tp = results
              ? pScale7FromReturnPeriodMonths(
                  returnPeriodMonthsFromYearlyEventRate(
                    results[s].probabilityStatistics?.sampleMean || 0,
                  ),
                )
              : rf.cr4de_quanti[s].tp.yearly.scale;
            const ti = results
              ? iScale7FromEuros(
                  results[s].impactStatistics?.sampleMean[
                    impact.toLocaleLowerCase() as keyof AggregatedImpacts
                  ] || 0,
                )
              : rf.cr4de_quanti[s].ti[i].scaleTot;

            if (tp !== null && ti !== null) {
              tmp.push({
                id: `${rf._cr4de_risk_file_value}${getScenarioSuffix(s)}`,
                fullTitle: `${capFirst(s)} ${rf.cr4de_title}`,
                scenario: s,
                tp: tp,
                ti: ti,
                tr: tp * ti,
                ...defaultFields(rf),
                mrs: rf.cr4de_mrs === s,
              } as MatrixRisk);
            }
          },
        );

        return tmp;
      }, [] as MatrixRisk[])
      .filter((rf) => {
        if (scenario === "All") return true;
        if (scenario === "MRS") return rf.mrs;
        return rf.scenario === scenario;
      })
      .filter((rf) => {
        if (category === "All") return true;
        return rf.category === category;
      })
      .filter((rf) => {
        if (onlyES) return ES_RISKS.indexOf(rf.code) >= 0;
        return true;
      });

    allDots.sort((a, b) => (a.id > b.id ? -1 : 1));

    setDots(allDots);
  }, [riskFiles, impact, scenario, category, onlyES]);

  return (
    <Stack
      direction="row"
      sx={{ width: "100%", height: "100%", position: "relative" }}
    >
      <Box ref={ref} sx={{ flex: 1, height: "100%", p: 2, mb: 2 }}>
        <RiskMatrixChart
          data={
            dots
              ? dots
                  // .filter((o) => {
                  //   // return o.category === RISK_CATEGORY.CYBER;
                  //   return true;
                  // })
                  // .filter(
                  //   (r) =>
                  //     ["M01", "M02", "M03", "M04", "M05"].indexOf(
                  //       r.hazardId
                  //     ) >= 0
                  // )
                  .map((r) => ({
                    id: r.id,
                    node: r,
                    hazardId: r.code,
                    name: r.fullTitle,
                    scenario: r.scenario,
                    category: r.category,
                    totalImpact: r.ti,
                    totalProbability: r.tp,
                    expectedImpact: 0,
                  }))
              : // .filter((r) => {
                //   console.log(r);
                //   console.log(
                //     returnPeriodMonthsFromPTimeframe(
                //       r.node.probabilityStatistics.sampleMean,
                //       12
                //     )
                //   );
                //   return true;
                // })
                // .filter((r) => r.expectedImpact > 4)
                undefined
          }
          categoryDisplay={categoryDisplay}
          labelSize={labelSize || undefined}
          labels={labels}
          scenarioDisplay={scenarioDisplay}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          height={"100%"}
        />
        {/* <ResponsiveContainer width="100%">
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
              domain={[0, maxScale + 1.5]}
              // tickCount={5}
              // tickFormatter={(s) => t(getScaleString(s))}
              ticks={new Array(maxScale + 2).fill(null).map((_, i) => i)}
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
              domain={[0, maxScale + 1.5]}
              // tickCount={6}
              // tickFormatter={(s, n) => `TI${n}`}
              // ticks={[160000000, 800000000, 4000000000, 20000000000, 100000000000, 500000000000]}
              // tickFormatter={(s) => t(getScaleString(s))}
              ticks={new Array(maxScale + 2).fill(null).map((_, i) => i)}
              label={{
                // value: scales === "classes" ? "Impact" : "Impact of an event",
                value: "Impact",
                position: "insideBottom",
                offset: -20,

                props: { fontWeight: "bold" },
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={CustomTooltip}
            />
            {Object.entries(CATEGORIES).map(([CATEGORY, shape]) => {
              const catData =
                dots?.filter((d) => d.category === CATEGORY) || [];

              return (
                <Scatter
                  key={CATEGORY}
                  name={`${CATEGORY} Risks`}
                  data={catData}
                  fill="#8884d8"
                  shape={
                    categoryDisplay === "shapes" || categoryDisplay === "both"
                      ? shape.shape
                      : "circle"
                  }
                >
                  {labels && (category === "All" || category === CATEGORY) && (
                    <LabelList
                      dataKey="code"
                      position="insideTop"
                      offset={15}
                      fontSize={labelSize || 20}
                    />
                  )}
                  {catData.map((entry) => {
                    let opacity = 1;
                    let strokeOpacity = 0.4;
                    if (selectedNodeId !== null) {
                      if (selectedNodeId !== entry.riskId)
                        opacity = opacity * 0.2;
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
                    } else if (
                      scenario !== "All" &&
                      scenario !== entry.scenario
                    ) {
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
        </ResponsiveContainer> */}
        <Box sx={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Box className="custom-legend-wrapper" sx={{ flex: 1, height: 60 }}>
            <Legend
              // chartHeight={30}
              height={30}
              wrapperStyle={{ position: "relative" }}
              align="center"
              // payload={
              //   categoryLegend
              //     ? Object.entries(CATEGORIES).map(([CATEGORY, shape]) => ({
              //         value: t(
              //           CATEGORY,
              //           CATEGORY_NAMES[CATEGORY as RISK_CATEGORY] as string
              //         ),
              //         type:
              //           categoryDisplay === "both" ||
              //           categoryDisplay === "shapes"
              //             ? shape.shape
              //             : "circle",
              //         color:
              //           categoryDisplay === "both" ||
              //           categoryDisplay === "colors"
              //             ? CATEGORIES[CATEGORY as RISK_CATEGORY]?.color ||
              //               "rgba(150,150,150,1)"
              //             : "rgba(150,150,150,1)",
              //       }))
              //     : []
              // }
            />
          </Box>
          <Box
            className="custom-legend-wrapper"
            sx={{ flex: 1, height: 30, textAlign: "center" }}
          >
            <Legend
              // chartHeight={30}
              height={30}
              wrapperStyle={{ position: "relative" }}
              align="center"
              // payload={
              //   scenarioLegend
              //     ? Object.entries(SCENARIO_PARAMS).map(
              //         ([scenario, params]) => ({
              //           value: t(
              //             `2A.${scenario}.title`,
              //             `${scenario[0].toUpperCase()}${scenario.slice(
              //               1
              //             )} Scenario`
              //           ),
              //           type: "circle",
              //           color: params.color,
              //         })
              //       )
              //     : []
              // }
            />
          </Box>
        </Box>
      </Box>
      {user?.roles.internal && (
        <IconButton
          className="admin-button"
          sx={{ position: "absolute", top: 45, right: 45 }}
          onClick={handleDownload}
        >
          <SaveIcon />
        </IconButton>
      )}
    </Stack>
  );
}
