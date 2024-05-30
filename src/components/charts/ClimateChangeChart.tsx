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

const CustomTooltip = ({ active, payload }: TooltipProps<number, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          border: "1px solid #f5f5f5",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: "10px",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#666",
            fontWeight: 700,
            paddingBottom: 5,
            borderBottom: "2px solid #f5f5f5",
          }}
        >
          {payload[0].payload.name}
        </p>
        <p>
          <Typography variant="subtitle2">Probability</Typography>
          <Typography variant="caption">
            {" "}
            {Math.round(payload[0]?.value! * 10000) / 100}% change of occuring in the next 3 years
          </Typography>
        </p>
        <p>
          <Typography variant="subtitle2">Impact</Typography>
          <Typography variant="caption">{`${getImpactScale(payload[1]?.value! / 10, "")}/5`}</Typography>
        </p>
      </div>
    );
  }

  return null;
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
        p: getPartialProbabilityRelativeScale(calculation[`dp${scenarioSuffix}`], calculation, scenarioSuffix),
        p2050: getPartialProbabilityRelativeScale(
          calculation[`dp50${scenarioSuffix}`],
          calculation,
          scenarioSuffix,
          true
        ),
      },
      ...(calculation.causes
        .filter((c) => c[`ip50${scenarioSuffix}`] !== 0)
        .map((c) => {
          return {
            name: c.cause.riskTitle,
            p: getPartialProbabilityRelativeScale(c[`ip${scenarioSuffix}`], calculation, scenarioSuffix),
            p2050: getPartialProbabilityRelativeScale(c[`ip50${scenarioSuffix}`], calculation, scenarioSuffix, true),
          };
        }) || []),
    ].sort((a, b) => b.p2050 - a.p2050);

    const tp50 = getTotalProbabilityRelativeScale(calculation, scenarioSuffix, true);

    return [
      {
        name: "Total probability",
        P2023: getTotalProbabilityRelativeScale(calculation, scenarioSuffix),
        P2050: tp50,
      },
      ...causes
        .reduce(
          ([cumulCauses, pCumul], c, i) => {
            if (pCumul / tp50 > 0.8 && i > 2) return [cumulCauses, pCumul] as [Cause2050[], number];

            return [[...cumulCauses, c], pCumul + c.p2050] as [Cause2050[], number];
          },
          [[], 0] as [Cause2050[], number]
        )[0]
        .map((cause) => ({
          name: cause.name,
          P2023: cause.p,
          P2050: cause.p2050,
        })),
    ];
  }, [calculation, scenarioSuffix]);

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
      <Bar name="Probability in 2023" dataKey="P2023" fill="#8884d8" />
      <Bar name="Probability in 2050" dataKey="P2050" fill="#ffc658" />
    </BarChart>
  );
}
