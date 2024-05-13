import { Box, Typography } from "@mui/material";
import { Bar, BarChart, YAxis } from "recharts";
import getScaleString from "../../functions/getScaleString";

const arrow = (value: number, cy: number, arrowWidth: number, graphWidth: number, color: string) => {
  const ratio = graphWidth - 20;
  const x0 = 10 + ratio * value * 0.2;
  const y0 = cy + arrowWidth;

  const xa = x0 - arrowWidth / 2;
  const ya = y0;
  const xb = x0;
  const yb = y0 - arrowWidth;
  const xc = x0 + arrowWidth / 2;
  const yc = y0;

  return [<path d={`M${xa} ${ya} L${xb} ${yb} L${xc} ${yc} L${xa} ${ya}`} stroke="#none" fill={color} />];
};

const getProbabilityBars = (value: number) => {
  return [0, 1, 2, 3, 4].map((i) => ({
    name: i,
    uv: value >= i ? i + 1 : 0,
    pv: value < i ? i + 1 : 0,
  }));
};

export default function ProbabilityBars({ tp, chartWidth }: { tp: number; chartWidth: number }) {
  return (
    <Box sx={{ mb: 4, width: chartWidth }}>
      <Typography variant="subtitle2" sx={{ mb: 0, textAlign: "center" }}>
        Probability
      </Typography>
      <BarChart width={chartWidth} height={100} data={getProbabilityBars(tp)} style={{}}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <YAxis domain={[0, 5]} hide />
        <Bar dataKey="uv" fill="#8884d8" stackId="a" />
        <Bar dataKey="pv" fill="#8884d840" stackId="a" />
        {arrow(tp, 100, 10, chartWidth, "#101010")}
      </BarChart>
      <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
        {getScaleString(tp)}
      </Typography>
    </Box>
  );
}
