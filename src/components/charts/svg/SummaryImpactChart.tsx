import { Cell, Pie, PieChart } from "recharts";
import { IMPACT_CATEGORY } from "../../../functions/Impact";
import { IMPACT_COLOR_SCALES } from "../../../functions/getImpactColor";

const RADIAN = Math.PI / 180;
const data = [
  { name: "1", value: 1, color: "red" },
  { name: "2", value: 1, color: "orange" },
  { name: "3", value: 1, color: "yellow" },
  { name: "4", value: 1, color: "green" },
  { name: "5", value: 1, color: "blue" },
];
export const pieWidth = 200;
export const pieHeight = 100;

const getBars = (impact: IMPACT_CATEGORY) => [
  { name: "1", value: 1, color: IMPACT_COLOR_SCALES[impact][0] },
  { name: "2", value: 1, color: IMPACT_COLOR_SCALES[impact][1] },
  { name: "3", value: 1, color: IMPACT_COLOR_SCALES[impact][2] },
  { name: "4", value: 1, color: IMPACT_COLOR_SCALES[impact][3] },
  { name: "5", value: 1, color: IMPACT_COLOR_SCALES[impact][4] },
];

const needle = (
  value: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
  cx: number,
  cy: number,
  iR: number,
  oR: number,
  color: string,
  padding: number,
  needleWidth: number = 3
) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 4;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + padding;
  const y0 = cy + r;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return (
    <>
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
      <path
        d={`M${x0} ${y0} L${xp} ${yp} L${x0} ${y0} Z`}
        stroke={color}
        strokeWidth={needleWidth}
        fill={color}
      />
    </>
  );
};

export default function SummaryImpactChart({
  width = pieWidth,
  height = pieHeight,
  category,
  value,
  needleWidth = 3,
}: {
  category: IMPACT_CATEGORY;
  value: number;
  width?: number;
  height?: number;
  needleWidth?: number;
}) {
  const piePadding = width / 40;
  const cx = width / 2 - piePadding;
  const cy = height - piePadding;
  const oR = Math.min(height, width / 2);
  const iR = oR / 2;

  return (
    <PieChart width={width} height={height}>
      <Pie
        dataKey="value"
        startAngle={180}
        endAngle={0}
        data={getBars(category)}
        cx={cx}
        cy={cy}
        innerRadius={iR}
        outerRadius={oR}
        fill="#8884d8"
        stroke="none"
        paddingAngle={1}
      >
        {getBars(category).map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
        ))}
      </Pie>
      {needle(value, data, cx, cy, iR, oR, "#555", piePadding, needleWidth)}
    </PieChart>
  );
}
