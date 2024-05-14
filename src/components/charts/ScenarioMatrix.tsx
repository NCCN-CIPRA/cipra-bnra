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
import { getImpactScale, getTotalImpactRelativeScale } from "../../functions/Impact";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { Box, Stack, Typography } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { DVAnalysisRun, RiskAnalysisResults, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS, SCENARIO_PARAMS } from "../../functions/scenarios";
import { hexToRGB } from "../../functions/colors";
import { getProbabilityScaleNumber, getTotalProbabilityRelativeScale } from "../../functions/Probability";
import round from "../../functions/roundNumberString";
import { capFirst } from "../../functions/capFirst";

const CustomTooltip = ({ active, payload }: TooltipProps<number, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ border: "1px solid #ccc", padding: 1, bgcolor: "rgba(255,255,255,0.8)", mb: 1 }}>
        <Typography variant="subtitle2" sx={{ textDecoration: "underline" }}>
          {capFirst(payload[0].payload.name)} scenario
        </Typography>

        <Stack direction="row" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ width: 100 }}>
            Probability :
          </Typography>
          <Typography variant="body2" sx={{ width: 50, textAlign: "right" }}>
            {round(payload[1]?.value)} / 5
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ width: 100 }}>
            Impact :
          </Typography>
          <Typography variant="body2" sx={{ width: 50, textAlign: "right" }}>
            {round(payload[0].value)} / 5
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ width: 100, fontWeight: "bold" }}>
            Total Risk :
          </Typography>
          <Typography variant="body2" sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}>
            {round((payload[0].value || 0) * (payload[1].value || 0))}
          </Typography>
        </Stack>
      </Box>
    );
  }

  return null;
};

export default function ScenarioMatrix({ calculation, mrs }: { calculation: RiskCalculation; mrs: SCENARIOS }) {
  const navigate = useNavigate();

  const data = [
    {
      id: SCENARIOS.CONSIDERABLE,
      name: SCENARIOS.CONSIDERABLE,
      color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
      x: getTotalProbabilityRelativeScale(calculation, "_c"),
      y: getTotalImpactRelativeScale(calculation, "_c"),
      z: 1,
    },
    {
      id: SCENARIOS.MAJOR,
      name: SCENARIOS.MAJOR,
      color: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
      x: getTotalProbabilityRelativeScale(calculation, "_m"),
      y: getTotalImpactRelativeScale(calculation, "_m"),
      z: 1,
    },
    {
      id: SCENARIOS.EXTREME,
      name: SCENARIOS.EXTREME,
      color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
      x: getTotalProbabilityRelativeScale(calculation, "_e"),
      y: getTotalImpactRelativeScale(calculation, "_e"),
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
        domain={[0, 5.5]}
        ticks={[1, 2, 3, 4, 5]}
        // tickFormatter={(v: number) => `${v * 100}%`}
        name="probability"
        unit=""
      />
      <XAxis
        type="number"
        dataKey="y"
        scale="linear"
        domain={[0, 5.5]}
        ticks={[1, 2, 3, 4, 5]}
        // tickFormatter={(v: number) => String(Math.round(Math.log10(v)) - 7)}
        name="impact"
        unit=""
      />
      <ZAxis type="number" range={[150]} />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} content={CustomTooltip} />
      <Scatter name="BNRA Risk Matrix" data={data}>
        {data.map((d) => (
          <Cell
            key={d.name}
            fill={d.name === mrs ? d.color : hexToRGB(d.color, 0.3)}
            stroke={d.name === mrs ? "#888" : "#aaa"}
            strokeWidth={2}
            radius={20}
            style={{ cursor: "pointer" }}
            // onClick={(e) => navigate(`/reporting/${d.id}`)}
          />
        ))}
      </Scatter>
    </ScatterChart>
  );
}
