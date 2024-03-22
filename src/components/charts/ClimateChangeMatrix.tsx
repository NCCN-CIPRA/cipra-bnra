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
} from "recharts";
import { scaleLog } from "d3-scale";
import { getImpactScale } from "../../functions/Impact";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { Typography } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DVAnalysisRun, RiskAnalysisResults, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import { hexToRGB } from "../../functions/colors";

const getTP50 = (calcs: RiskCalculation, scenarioSuffix: "_c" | "_m" | "_e") => {
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

export default function ClimateChangeMatrix({ calculation }: { calculation: RiskCalculation }) {
  const navigate = useNavigate();

  const data = [
    {
      id: SCENARIOS.CONSIDERABLE,
      name: SCENARIOS.CONSIDERABLE,
      color: hexToRGB(SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color, 0.3),
      x: calculation.tp_c || 0.001,
      y: calculation.ti_c || 1600000,
      z: 1,
    },
    {
      id: SCENARIOS.CONSIDERABLE,
      name: SCENARIOS.CONSIDERABLE,
      color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
      x: getTP50(calculation, "_c"),
      y: calculation.ti_c || 1600000,
      z: 1,
    },
    {
      id: SCENARIOS.MAJOR,
      name: SCENARIOS.MAJOR,
      color: hexToRGB(SCENARIO_PARAMS[SCENARIOS.MAJOR].color, 0.3),
      x: calculation.tp_m || 0.001,
      y: calculation.ti_m || 1600000,
      z: 1,
    },
    {
      id: SCENARIOS.MAJOR,
      name: SCENARIOS.MAJOR,
      color: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
      x: getTP50(calculation, "_m"),
      y: calculation.ti_m || 1600000,
      z: 1,
    },
    {
      id: SCENARIOS.EXTREME,
      name: SCENARIOS.EXTREME,
      color: hexToRGB(SCENARIO_PARAMS[SCENARIOS.EXTREME].color, 0.3),
      x: calculation.tp_e || 0.001,
      y: calculation.ti_e || 1600000,
      z: 1,
    },
    {
      id: SCENARIOS.EXTREME,
      name: SCENARIOS.EXTREME,
      color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
      x: getTP50(calculation, "_e"),
      y: calculation.ti_e || 1600000,
      z: 1,
    },
  ];

  return (
    <ScatterChart
      width={300}
      height={270}
      margin={{
        top: 30,
        right: 15,
        bottom: 20,
        left: 40,
      }}
      style={{ float: "right" }}
    >
      <defs>
        <linearGradient id="colorUv" x1="0" y1="1" x2="1" y2="0">
          <stop offset="15%" stopColor="#69B34C" stopOpacity={0.5} />
          <stop offset="50%" stopColor="#FAB733" stopOpacity={0.5} />
          <stop offset="95%" stopColor="#FF0D0D" stopOpacity={0.5} />
        </linearGradient>
      </defs>
      <CartesianGrid fill="url(#colorUv)" />
      <YAxis
        type="number"
        dataKey="x"
        scale={scaleLog().base(3)}
        domain={[0.00001, 3]}
        ticks={[0.0001, 0.001, 0.01, 0.1, 1]}
        tickFormatter={(v: number) => `${v * 100}%`}
        name="probability"
        unit=""
      />
      <XAxis
        type="number"
        dataKey="y"
        scale={scaleLog().base(10)}
        domain={[10000000, Math.pow(10, 12.5)]}
        ticks={[100000000, 1000000000, 10000000000, 100000000000, 1000000000000]}
        tickFormatter={(v: number) => String(Math.round(Math.log10(v)) - 7)}
        name="impact"
        unit=""
      />
      <ZAxis type="number" range={[150]} />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} content={CustomTooltip} />
      <Scatter name="BNRA Risk Matrix" data={data}>
        {data.map((d) => (
          <Cell
            key={d.name}
            fill={d.color}
            stroke={"#888"}
            strokeWidth={2}
            radius={20}
            style={{ cursor: "pointer" }}
            onClick={(e) => navigate(`/reporting/${d.id}`)}
          />
        ))}
      </Scatter>
    </ScatterChart>
  );
}
