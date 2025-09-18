import { Cell, Pie, PieChart } from "recharts";
import { IMPACT_CATEGORY } from "../../../functions/Impact";
import {
  getImpactColorScales,
  IMPACT_COLORS,
} from "../../../functions/getImpactColor";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../../../pages/BasePage";
import { Indicators } from "../../../types/global";

const RADIAN = Math.PI / 180;
export const pieWidth = 200;
export const pieHeight = 100;

const getBars = (impact: IMPACT_CATEGORY, maxScales: number) => {
  const scales = getImpactColorScales(maxScales, IMPACT_COLORS[impact]);

  return Array(maxScales)
    .fill(null)
    .map((_, i) => ({
      name: i.toString(),
      value: 1,
      color: scales[i],
    }));
};

const needle = (
  value: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[],
  cx: number,
  cy: number,
  iR: number,
  oR: number,
  color: string,
  needleWidth: number = 30
) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (value / total);
  const length = iR + (oR - iR) / 2;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = needleWidth;
  const x0 = cx;
  const y0 = cy;
  const xp = x0 - length * cos;
  const yp = y0 + length * sin;

  return (
    <g>
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />
      <path
        d={`M${x0 + r * sin} ${y0 + r * cos} L${xp} ${yp} L${x0 - r * sin} ${
          y0 - r * cos
        } Z`}
        stroke={color}
        strokeWidth={0}
        fill={color}
      />
    </g>
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
  const { indicators } = useOutletContext<BasePageContext>();

  const piePadding = width / 40;
  const cx = width / 2;
  const cy = height - needleWidth;
  const oR = Math.min(height - piePadding, (width - piePadding) / 2);
  const iR = oR / 2;

  const maxScale = indicators === Indicators.V1 ? 5 : 7;
  const bars = getBars(category, maxScale);

  return (
    <PieChart width={width} height={height}>
      <Pie
        dataKey="value"
        startAngle={180}
        endAngle={0}
        data={bars}
        cx={cx - 5}
        cy={cy - 2 - needleWidth}
        innerRadius={iR}
        outerRadius={oR}
        fill="#8884d8"
        stroke="none"
        paddingAngle={1}
      >
        {bars.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
        ))}
      </Pie>
      {needle(value, bars, cx, cy, iR, oR, "#555", needleWidth)}
    </PieChart>
  );
}
