import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Box } from "@mui/material";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { getMoneyString } from "../../functions/Impact";

export default function ImpactBarChart({ calculation }: { calculation: RiskCalculation | null }) {
  if (!calculation) return null;

  const data = [
    {
      name: "Human",
      H: calculation.ti_Ha + calculation.ti_Hb + calculation.ti_Hc,
      Ha: calculation.ti_Ha,
      Hb: calculation.ti_Hb,
      Hc: calculation.ti_Hc,
    },
    {
      name: "Societal",
      S: calculation.ti_Sa + calculation.ti_Sb + calculation.ti_Sc + calculation.ti_Sd,
      Sa: calculation.ti_Sa,
      Sb: calculation.ti_Sb,
      Sc: calculation.ti_Sc,
      Sd: calculation.ti_Sd,
    },
    {
      name: "Environmental",
      E: calculation.ti_Ea,
      Ea: calculation.ti_Ea,
    },
    {
      name: "Financial",
      F: calculation.ti_Fa + calculation.ti_Fb,
      Fa: calculation.ti_Fa,
      Fb: calculation.ti_Fb,
    },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          bottom: 85,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-90} dx={-5} dy={5} interval={0} textAnchor="end" />
        <YAxis domain={[0, 100]} hide={true} tickCount={4} />
        <Tooltip formatter={(value: any, name: any, props: any) => getMoneyString(value)} />
        <Bar dataKey="Ha" stackId="a" fill="#de6148" />
        <Bar dataKey="Hb" stackId="a" fill="#f39d87" />
        <Bar dataKey="Hc" stackId="a" fill="#ffd7cc" />
        {/* <Bar dataKey="H" stackId="a" style={{ display: "none" }} label /> */}
        <Bar dataKey="Sa" stackId="a" fill="#bca632" />
        <Bar dataKey="Sb" stackId="a" fill="#d2ba37" />
        <Bar dataKey="Sc" stackId="a" fill="#e8ce3d" />
        <Bar dataKey="Sd" stackId="a" fill="#ffe342" />
        {/* <Bar dataKey="S" stackId="a" style={{ display: "none" }} label /> */}
        <Bar dataKey="Ea" stackId="a" fill="#83af70" />
        {/* <Bar dataKey="E" stackId="a" style={{ display: "none" }} label /> */}
        <Bar dataKey="Fa" stackId="a" fill="#6996b3" />
        <Bar dataKey="Fb" stackId="a" fill="#c1e7ff" />
        {/* <Bar dataKey="F" stackId="a" style={{ display: "none" }} label /> */}
      </BarChart>
    </ResponsiveContainer>
  );
}
