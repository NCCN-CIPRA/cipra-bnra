import { useNavigate } from "react-router-dom";
import {
  ScatterChart,
  Scatter,
  Cell,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  BarChart,
  Legend,
  Bar,
} from "recharts";
import { scaleLog } from "d3-scale";
import { getImpactScale } from "../../functions/Impact";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { Typography } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import {
  CascadeCalculation,
  DVAnalysisRun,
  RiskAnalysisResults,
  RiskCalculation,
} from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS, SCENARIO_PARAMS, SCENARIO_SUFFIX } from "../../functions/scenarios";
import { hexToRGB } from "../../functions/colors";
import { useMemo } from "react";
import {
  Cause as Cause2023,
  getPartialProbabilityRelativeScale,
  getTotalProbabilityRelativeScale,
} from "../../functions/Probability";
import { getPercentageProbability, getYearlyProbability } from "../../functions/Probability";
import round from "../../functions/roundNumberString";

type Cause2050 = Cause2023 & {
  p2050: number;
};

const getTP50 = (calcs: RiskCalculation, scenarioSuffix: SCENARIO_SUFFIX) => {
  return calcs[`tp50${scenarioSuffix}`] || 0.0001;
};

export default function ClimateChangeChart({
  calculation,
  scenarioSuffix,
}: {
  calculation: RiskCalculation;
  scenarioSuffix: SCENARIO_SUFFIX;
}) {
  const data = useMemo(() => {
    const causes = [
      {
        name: "No underlying cause",
        p_c: getPartialProbabilityRelativeScale(calculation[`dp_c`], calculation, "_c"),
        p2050_c: getPartialProbabilityRelativeScale(calculation[`dp50_c`], calculation, "_c", true),
        p_m: getPartialProbabilityRelativeScale(calculation[`dp_m`], calculation, "_m"),
        p2050_m: getPartialProbabilityRelativeScale(calculation[`dp50_m`], calculation, "_m", true),
        p_e: getPartialProbabilityRelativeScale(calculation[`dp_e`], calculation, "_e"),
        p2050_e: getPartialProbabilityRelativeScale(calculation[`dp50_e`], calculation, "_e", true),
      },
      ...(calculation.causes
        .filter((c) => c[`ip50_c`] !== 0)
        .map((c) => {
          return {
            name: c.cause.riskTitle,
            p_c: getPartialProbabilityRelativeScale(c[`ip_c`], calculation, "_c"),
            p2050_c: getPartialProbabilityRelativeScale(c[`ip50_c`], calculation, "_c", true),
            p_m: getPartialProbabilityRelativeScale(c[`ip_m`], calculation, "_m"),
            p2050_m: getPartialProbabilityRelativeScale(c[`ip50_m`], calculation, "_m", true),
            p_e: getPartialProbabilityRelativeScale(c[`ip_e`], calculation, "_e"),
            p2050_e: getPartialProbabilityRelativeScale(c[`ip50_e`], calculation, "_e", true),
          };
        }) || []),
    ]
      .sort(
        (a, b) =>
          (Math.abs(b.p2050_c - b.p_c) + Math.abs(b.p2050_m - b.p_m) + Math.abs(b.p2050_e - b.p_e)) / 3 -
          (Math.abs(a.p2050_c - a.p_c) + Math.abs(a.p2050_m - a.p_m) + Math.abs(a.p2050_e - a.p_e)) / 3
      )
      .slice(0, 5);
    console.log(causes);
    const tp50_c = getTotalProbabilityRelativeScale(calculation, "_c", true);
    const tp50_m = getTotalProbabilityRelativeScale(calculation, "_m", true);
    const tp50_e = getTotalProbabilityRelativeScale(calculation, "_e", true);

    const tp_c = getTotalProbabilityRelativeScale(calculation, "_c");
    const tp_m = getTotalProbabilityRelativeScale(calculation, "_m");
    const tp_e = getTotalProbabilityRelativeScale(calculation, "_e");

    return [
      {
        name: "Total probability",
        P2023_c: tp50_c >= tp_c ? tp_c : tp50_c,
        P2050_c_inc: tp50_c >= tp_c ? tp50_c - tp_c : 0,
        P2050_c_dec: tp50_c >= tp_c ? 0 : tp_c - tp50_c,
        P2023_m: tp50_m >= tp_m ? tp_m : tp50_m,
        P2050_m_inc: tp50_m >= tp_m ? tp50_m - tp_m : 0,
        P2050_m_dec: tp50_m >= tp_m ? 0 : tp_m - tp50_m,
        P2023_e: tp50_e >= tp_e ? tp_e : tp50_e,
        P2050_e_inc: tp50_e >= tp_e ? tp50_e - tp_e : 0,
        P2050_e_dec: tp50_e >= tp_e ? 0 : tp_e - tp50_e,
      },
      ...causes
        // .reduce(
        //   ([cumulCauses, pCumul], c, i) => {
        //     if (pCumul / tp50 > 0.8 && i > 2) return [cumulCauses, pCumul] as [Cause2050[], number];

        //     return [[...cumulCauses, c], pCumul + c.p2050] as [Cause2050[], number];
        //   },
        //   [[], 0] as [Cause2050[], number]
        // )[0]
        .map((cause) => ({
          name: cause.name,
          P2023_c: cause.p2050_c >= cause.p_c ? cause.p_c : cause.p2050_c,
          P2050_c_inc: cause.p2050_c >= cause.p_c ? cause.p2050_c - cause.p_c : 0,
          P2050_c_dec: cause.p2050_c >= cause.p_c ? 0 : cause.p_c - cause.p2050_c,
          P2023_m: cause.p2050_m >= cause.p_m ? cause.p_m : cause.p2050_m,
          P2050_m_inc: cause.p2050_m >= cause.p_m ? cause.p2050_m - cause.p_m : 0,
          P2050_m_dec: cause.p2050_m >= cause.p_m ? 0 : cause.p_m - cause.p2050_m,
          P2023_e: cause.p2050_e >= cause.p_e ? cause.p_e : cause.p2050_e,
          P2050_e_inc: cause.p2050_e >= cause.p_e ? cause.p2050_e - cause.p_e : 0,
          P2050_e_dec: cause.p2050_e >= cause.p_e ? 0 : cause.p_e - cause.p2050_e,
        })),
    ];
  }, [calculation, scenarioSuffix]);
  console.log(calculation);
  return (
    <BarChart
      width={750}
      height={450}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 30,
        bottom: 30,
      }}
      layout="vertical"
      barCategoryGap="15%"
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        domain={[0, 5.5]}
        ticks={[1, 2, 3, 4, 5]}
        type="number"
        // tickFormatter={(value) => getPercentageProbability(value)}
        label={{ value: "Probability of occurence in the next 12 months", dy: 25 }}
      />
      <YAxis dataKey="name" type="category" width={150} />
      <Tooltip formatter={(value) => `${round(value as number)} / 5`} />
      <Legend align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: 30 }} />
      <Bar name="Considerable scenario" dataKey="P2023_c" stackId="c" fill={SCENARIO_PARAMS.considerable.color} />
      <Bar name="Major scenario" dataKey="P2023_m" stackId="m" fill={SCENARIO_PARAMS.major.color} />
      <Bar name="Extreme scenario" dataKey="P2023_e" stackId="e" fill={SCENARIO_PARAMS.extreme.color} />
      <Bar name="Increased probability in 2050" dataKey="P2050_c_inc" stackId="c" fill="red" />
      <Bar legendType="none" dataKey="P2050_m_inc" stackId="m" fill="red" />
      <Bar legendType="none" dataKey="P2050_e_inc" stackId="e" fill="red" />
      <Bar name="Decreased probability in 2050" dataKey="P2050_c_dec" stackId="c" fill="green" />
      <Bar legendType="none" dataKey="P2050_m_dec" stackId="m" fill="green" />
      <Bar legendType="none" dataKey="P2050_e_dec" stackId="e" fill="green" />
    </BarChart>
  );
}
