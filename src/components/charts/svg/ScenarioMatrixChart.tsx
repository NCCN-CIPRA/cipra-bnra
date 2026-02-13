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
import { SCENARIOS, SCENARIO_PARAMS } from "../../../functions/scenarios";
import { hexToRGB } from "../../../functions/colors";
import { useTranslation } from "react-i18next";
import { ContentType } from "recharts/types/component/Tooltip";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../../types/dataverse/DVRiskSnapshot";
import {
  pScale5FromReturnPeriodMonths,
  pScale7FromReturnPeriodMonths,
  returnPeriodMonthsFromYearlyEventRate,
  tpScale5to7,
} from "../../../functions/indicators/probability";
import {
  iScale7FromEuros,
  tiScale5FromEuros,
  tiScale5to7,
} from "../../../functions/indicators/impact";
import { RiskFileQuantiResults } from "../../../types/dataverse/DVRiskFile";

export default function ScenarioMatrixChart({
  riskFile,
  mrs,
  results,
  fontSize = 12,
  radius = 150,
  width = 300,
  height = 270,
  maxScale = 5,
  CustomTooltip,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults>;
  mrs: SCENARIOS;
  results?: RiskFileQuantiResults | null;
  fontSize?: number;
  radius?: number;
  width?: number;
  height?: number;
  maxScale: number;
  CustomTooltip?: ContentType<ValueType, NameType> | null;
}) {
  const { t } = useTranslation();

  let data = [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].map(
    (s) => ({
      id: s,
      name: s,
      color: SCENARIO_PARAMS[s].color,
      y:
        maxScale === 7
          ? tpScale5to7(riskFile.cr4de_quanti[s].tp.yearly.scale)
          : riskFile.cr4de_quanti[s].tp.yearly.scale,
      x:
        maxScale === 7
          ? tiScale5to7(riskFile.cr4de_quanti[s].ti.all.scaleTot)
          : riskFile.cr4de_quanti[s].ti.all.scaleTot,
      z: 1,
    }),
  );

  if (results) {
    data = [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].map(
      (s) => ({
        id: s,
        name: s,
        color: SCENARIO_PARAMS[s].color,
        x:
          maxScale === 7
            ? iScale7FromEuros(
                results[s]?.impactStatistics?.sampleMedian.all || 0,
                undefined,
                100,
              )
            : tiScale5FromEuros(
                results[s]?.impactStatistics?.sampleMedian.all || 0,
                undefined,
              ),
        y:
          maxScale === 7
            ? pScale7FromReturnPeriodMonths(
                returnPeriodMonthsFromYearlyEventRate(
                  results[s]?.probabilityStatistics?.sampleMean || 0,
                ),
                100,
              )
            : pScale5FromReturnPeriodMonths(
                returnPeriodMonthsFromYearlyEventRate(
                  results[s]?.probabilityStatistics?.sampleMean || 0,
                ),
                100,
              ),
        z: 1,
      }),
    );
  }

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
        dataKey="y"
        domain={[0, maxScale + 0.5]}
        ticks={Array(maxScale)
          .fill(null)
          .map((_, i) => i + 1)}
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
        dataKey="x"
        scale="linear"
        domain={[0, maxScale + 0.5]}
        ticks={Array(maxScale)
          .fill(null)
          .map((_, i) => i + 1)}
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
