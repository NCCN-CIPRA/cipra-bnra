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
import { Box, Stack, Typography } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import {
  DVAnalysisRun,
  RiskAnalysisResults,
  RiskCalculation,
} from "../../types/dataverse/DVAnalysisRun";
import {
  SCENARIOS,
  SCENARIO_PARAMS,
  getScenarioParameter,
} from "../../functions/scenarios";
import { hexToRGB } from "../../functions/colors";
import {
  getProbabilityScaleNumber,
  getTotalProbabilityRelativeScale,
} from "../../functions/Probability";
import round from "../../functions/roundNumberString";
import { capFirst } from "../../functions/capFirst";
import { useTranslation } from "react-i18next";
import { ticks } from "d3";

const CustomTooltip = ({ active, payload }: TooltipProps<number, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: 1,
          bgcolor: "rgba(255,255,255,0.8)",
          mb: 1,
        }}
      >
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
          <Typography
            variant="body2"
            sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}
          >
            {round((payload[0].value || 0) * (payload[1].value || 0))}
          </Typography>
        </Stack>
      </Box>
    );
  }

  return null;
};

export default function ScenarioMatrix({
  riskFile,
  mrs,
  fontSize = 12,
  radius = 150,
  width = 300,
  height = 270,
}: {
  riskFile: DVRiskFile;
  mrs: SCENARIOS;
  fontSize?: number;
  radius?: number;
  width?: number;
  height?: number;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const data = [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].map(
    (s) => ({
      id: s,
      name: s,
      color: SCENARIO_PARAMS[s].color,
      x: getScenarioParameter(riskFile, "TP", s),
      y: getScenarioParameter(riskFile, "TI", s),
      z: 1,
    })
  );

  return (
    <ScatterChart
      id="scenario-matrix"
      width={width}
      height={height}
      margin={{
        top: 30,
        right: 15,
        bottom: 2 * fontSize,
        left: 2 * (fontSize - 12),
      }}
      style={{
        float: "right",
        overflow: "hidden",
        // backgroundColor: "rgba(0, 0, 0, 0.2",
      }}
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
        fontSize={fontSize}
        // tickFormatter={(v: number) => `${v * 100}%`}
        name="probability"
        unit=""
        label={{
          value: t("impact"),
          angle: -90,
          position: "insideLeft",
          offset: (30 * (20 - fontSize)) / 8,
          fontSize,
        }}
      />
      <XAxis
        type="number"
        dataKey="y"
        scale="linear"
        domain={[0, 5.5]}
        ticks={[1, 2, 3, 4, 5]}
        fontSize={fontSize}
        // tickFormatter={(v: number) => String(Math.round(Math.log10(v)) - 7)}
        name="impact"
        unit=""
        label={{
          value: t("probability"),
          position: "insideBottom",
          offset: -width / 30,
          fontSize,
        }}
      />
      <ZAxis dataKey="z" type="number" range={[0, radius]} />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} content={CustomTooltip} />
      <Scatter name="BNRA Risk Matrix" data={data}>
        {data.map((d) => (
          <Cell
            key={d.name}
            fill={d.name === mrs ? d.color : hexToRGB(d.color, 0.3)}
            stroke={d.name === mrs ? "#888" : "#aaa"}
            strokeWidth={2}
            style={{ cursor: "pointer" }}
            // onClick={(e) => navigate(`/reporting/${d.id}`)}
          />
        ))}
      </Scatter>
    </ScatterChart>
  );
}
