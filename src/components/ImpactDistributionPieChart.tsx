import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, TooltipProps } from "recharts";
import { Box, Typography } from "@mui/material";
import { getImpactScale } from "../functions/Impact";
import { CalculatedRisk } from "../types/CalculatedRisk";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          border: "1px solid #f5f5f5",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
        }}
      >
        <p style={{ margin: 0, marginBottom: 5, textDecoration: "underline" }}>
          <Typography variant="subtitle1">{payload[0].name}:</Typography>
        </p>
        <p style={{ margin: 0, marginLeft: 10 }}>
          <Typography variant="subtitle2">{getImpactScale(payload[0]!.value!, payload[0]!.payload.scale!)}</Typography>
        </p>
        <p style={{ margin: 0, marginLeft: 10 }}>
          <Typography variant="caption">
            {Math.round((payload[0]!.value! / payload[0]!.payload.total!) * 10000) / 100}% of total impact
          </Typography>
        </p>
      </div>
    );
  }

  return null;
};

export default function ImpactDistributionPieChart({ riskFile }: { riskFile: CalculatedRisk | null }) {
  if (!riskFile) return null;

  const dataGlobal = [
    {
      name: "Human Impact",
      value: riskFile.calculated[0].ti_Ha + riskFile.calculated[0].ti_Hb + riskFile.calculated[0].ti_Hc,
      color: "#c2000a",
      total: riskFile.calculated[0].ti,
      scale: "H",
    },
    {
      name: "Societal Impact",
      value:
        riskFile.calculated[0].ti_Sa +
        riskFile.calculated[0].ti_Sb +
        riskFile.calculated[0].ti_Sc +
        riskFile.calculated[0].ti_Sd,
      color: "#a6932d",
      total: riskFile.calculated[0].ti,
      scale: "S",
    },
    {
      name: "Environmental Impact",
      value: riskFile.calculated[0].ti_Ea,
      color: "#488f31",
      total: riskFile.calculated[0].ti,
      scale: "E",
    },
    {
      name: "Financial Impact",
      value: riskFile.calculated[0].ti_Fa + riskFile.calculated[0].ti_Fb,
      color: "#004c6d",
      total: riskFile.calculated[0].ti,
      scale: "F",
    },
  ];

  const dataSpecific = [
    {
      name: "Fatalities",
      value: riskFile.calculated[0].ti_Ha,
      color: "#de6148",
      total: riskFile.calculated[0].ti,
      scale: "Ha",
    },
    {
      name: "Injured and sick people",
      value: riskFile.calculated[0].ti_Hb,
      color: "#f39d87",
      total: riskFile.calculated[0].ti,
      scale: "Hb",
    },
    {
      name: "People in need of assistance",
      value: riskFile.calculated[0].ti_Hc,
      color: "#ffd7cc",
      total: riskFile.calculated[0].ti,
      scale: "Hv",
    },
    {
      name: "Supply shortfalls and unmet human needs",
      value: riskFile.calculated[0].ti_Sa,
      color: "#bca632",
      total: riskFile.calculated[0].ti,
      scale: "Sa",
    },
    {
      name: "Diminished public order and domestic security",
      value: riskFile.calculated[0].ti_Sb,
      color: "#d2ba37",
      total: riskFile.calculated[0].ti,
      scale: "Sb",
    },
    {
      name: "Damage to the reputation of Belgium",
      value: riskFile.calculated[0].ti_Sc,
      color: "#e8ce3d",
      total: riskFile.calculated[0].ti,
      scale: "Sc",
    },
    {
      name: "Loss of confidence in or loss of functioning of the state and/or its values",
      value: riskFile.calculated[0].ti_Sd,
      color: "#ffe342",
      total: riskFile.calculated[0].ti,
      scale: "Sd",
    },
    {
      name: "Damaged ecosystems",
      value: riskFile.calculated[0].ti_Ea,
      color: "#83af70",
      total: riskFile.calculated[0].ti,
      scale: "Ea",
    },
    {
      name: "Financial asset damages",
      value: riskFile.calculated[0].ti_Fa,
      color: "#6996b3",
      total: riskFile.calculated[0].ti,
      scale: "Fa",
    },
    {
      name: "Reduction of economic performance",
      value: riskFile.calculated[0].ti_Fb,
      color: "#c1e7ff",
      total: riskFile.calculated[0].ti,
      scale: "Fb",
    },
  ];

  return (
    <>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={dataGlobal} dataKey="value" cx="50%" cy="50%" outerRadius={55} fill="#8884d8">
            {dataGlobal.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Pie data={dataSpecific} dataKey="value" cx="50%" cy="50%" innerRadius={65} outerRadius={80} fill="#82ca9d">
            {dataSpecific.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={CustomTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
