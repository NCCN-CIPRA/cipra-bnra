import { Bar, BarChart, YAxis } from "recharts";

type FillType = "full" | "partial" | "empty";

const getProbabilityBars = (value: number, maxScale: number) => {
  const floorVal = Math.floor(value);
  const decimal = value - floorVal;

  return Array(maxScale)
    .fill(null)
    .map((_, i) => ({
      name: i,
      barHeight: i + 1,
      fillType: (i < floorVal
        ? "full"
        : i === floorVal
          ? "partial"
          : "empty") as FillType,
      decimal,
    }));
};

const CustomBar = (props: any) => {
  const { x, y, width, height, fillType, decimal } = props;

  if (fillType === "full") {
    return <rect x={x} y={y} width={width} height={height} fill="#000000b0" />;
  }

  if (fillType === "partial" && decimal > 0) {
    const filledWidth = width * decimal;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={filledWidth}
          height={height}
          fill="#000000b0"
        />
        <rect
          x={x + filledWidth}
          y={y}
          width={width - filledWidth}
          height={height}
          fill="#00000040"
        />
      </g>
    );
  }

  // empty, or partial with decimal === 0
  return <rect x={x} y={y} width={width} height={height} fill="#00000040" />;
};

export function ProbabilityBarsChart({
  tp,
  maxScale,
  chartWidth,
  height = 100,
}: {
  tp: number;
  maxScale: number;
  chartWidth: number;
  manmade?: boolean;
  height?: number;
}) {
  return (
    <BarChart
      width={chartWidth}
      height={height}
      data={getProbabilityBars(tp, maxScale)}
    >
      <YAxis domain={[0, maxScale]} hide />
      <Bar
        dataKey="barHeight"
        shape={(props: any) => <CustomBar {...props} />}
      />
    </BarChart>
  );
}
