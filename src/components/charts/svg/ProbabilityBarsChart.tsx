import { Bar, BarChart, YAxis } from "recharts";

const arrow = (
  value: number,
  cy: number,
  arrowWidth: number,
  graphWidth: number,
  color: string,
  maxScale: number,
) => {
  const ratio = graphWidth - 20;
  const x0 = 10 + (ratio * value) / maxScale;
  const y0 = cy + arrowWidth;

  const xa = x0 - arrowWidth / 2;
  const ya = y0;
  const xb = x0;
  const yb = y0 - arrowWidth;
  const xc = x0 + arrowWidth / 2;
  const yc = y0;

  return (
    <path
      d={`M${xa} ${ya} L${xb} ${yb} L${xc} ${yc} L${xa} ${ya}`}
      stroke="#none"
      fill={color}
    />
  );
};

const getProbabilityBars = (value: number, maxScale: number) => {
  return Array(maxScale)
    .fill(null)
    .map((_, i) => ({
      name: i,
      uv: value >= i ? i + 1 : 0,
      pv: value < i ? i + 1 : 0,
    }));
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
      style={{}}
    >
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <YAxis domain={[0, 5]} hide />
      <Bar dataKey="uv" fill="#000000b0" stackId="a" />
      <Bar dataKey="pv" fill="#00000040" stackId="a" />
      {arrow(tp, height, 10, chartWidth, "#000000b0", maxScale)}
    </BarChart>
  );
}
