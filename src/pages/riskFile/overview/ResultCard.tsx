import { Paper } from "@mui/material";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { TEAL } from "./Colors";

const data = [
  {
    subject: "DP",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "H",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "S",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "E",
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "F",
    A: 85,
    B: 90,
    fullMark: 150,
  },
];

export default function ResultCard({}) {
  return (
    <Paper sx={{ width: "100%", height: "100%", p: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis />
          <Radar name="Mike" dataKey="A" stroke={TEAL} fill={TEAL} fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
