import {
  ScatterChart,
  Scatter,
  Cell,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import {
  SCENARIOS,
  SCENARIO_PARAMS,
  getScenarioParameter,
} from "../../../functions/scenarios";
import { hexToRGB } from "../../../functions/colors";
import { useTranslation } from "react-i18next";
import { ContentType } from "recharts/types/component/Tooltip";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export default function ScenarioMatrixChart({
  riskFile,
  mrs,
  fontSize = 12,
  radius = 150,
  width = 300,
  height = 270,
  CustomTooltip,
}: {
  riskFile: DVRiskFile;
  mrs: SCENARIOS;
  fontSize?: number;
  radius?: number;
  width?: number;
  height?: number;
  CustomTooltip?: ContentType<ValueType, NameType> | null;
}) {
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
          value: t("probability"),
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
          value: t("impact"),
          position: "insideBottom",
          offset: -width / 30,
          fontSize,
        }}
      />
      <ZAxis dataKey="z" type="number" range={[0, radius]} />
      {CustomTooltip && (
        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={CustomTooltip} />
      )}
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
