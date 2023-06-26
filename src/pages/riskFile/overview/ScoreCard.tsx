import { Paper } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { R2G, TEAL } from "./Colors";

const RADIAN = Math.PI / 180;
const data = [
  { name: "Bad", value: 80, color: R2G.RED },
  { name: "Fine", value: 45, color: R2G.YELLOW },
  { name: "Good", value: 25, color: R2G.GREEN },
];
const iR = 50;
const oR = 100;
const value = 50;

const needle = (
  value: number,
  data: any[],
  cx: number,
  cy: number,
  iR: number,
  oR: number,
  color: string | undefined
) => {
  let total = 0;
  data.forEach((v: { value: number }) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
  ];
};

export default function ScoreCard({ width = 244, height = 175 }: { width: number; height: number }) {
  return (
    <Paper sx={{ width: "100%", height: "100%", p: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={300} height={100}>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx={width / 2}
            cy={height / 2}
            innerRadius={iR}
            outerRadius={oR}
            fill="#8884d8"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {needle(value, data, width / 2, height / 2, iR, oR, TEAL)}
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}
