import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, TooltipProps } from "recharts";
import { Box, Typography } from "@mui/material";
import { getImpactScale } from "../../functions/Impact";
import { RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

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

export default function ImpactDistributionPieChart({
  riskFile = null,
  calculation,
}: {
  riskFile?: DVRiskFile | null;
  calculation: RiskCalculation | null;
}) {
  if (!calculation) return null;

  const dataGlobal = [
    {
      name: "Human Impact",
      value: calculation.ti_Ha + calculation.ti_Hb + calculation.ti_Hc,
      color: "#c2000a",
      total: calculation.ti,
      scale: "H",
    },
    {
      name: "Societal Impact",
      value: calculation.ti_Sa + calculation.ti_Sb + calculation.ti_Sc + calculation.ti_Sd,
      color: "#a6932d",
      total: calculation.ti,
      scale: "S",
    },
    {
      name: "Environmental Impact",
      value: calculation.ti_Ea,
      color: "#488f31",
      total: calculation.ti,
      scale: "E",
    },
    {
      name: "Financial Impact",
      value: calculation.ti_Fa + calculation.ti_Fb,
      color: "#004c6d",
      total: calculation.ti,
      scale: "F",
    },
  ];

  const dataSpecific = [
    {
      name: "Fatalities",
      value: calculation.ti_Ha,
      color: "#de6148",
      total: calculation.ti,
      scale: "Ha",
    },
    {
      name: "Injured and sick people",
      value: calculation.ti_Hb,
      color: "#f39d87",
      total: calculation.ti,
      scale: "Hb",
    },
    {
      name: "People in need of assistance",
      value: calculation.ti_Hc,
      color: "#ffd7cc",
      total: calculation.ti,
      scale: "Hv",
    },
    {
      name: "Supply shortfalls and unmet human needs",
      value: calculation.ti_Sa,
      color: "#bca632",
      total: calculation.ti,
      scale: "Sa",
    },
    {
      name: "Diminished public order and domestic security",
      value: calculation.ti_Sb,
      color: "#d2ba37",
      total: calculation.ti,
      scale: "Sb",
    },
    {
      name: "Damage to the reputation of Belgium",
      value: calculation.ti_Sc,
      color: "#e8ce3d",
      total: calculation.ti,
      scale: "Sc",
    },
    {
      name: "Loss of confidence in or loss of functioning of the state and/or its values",
      value: calculation.ti_Sd,
      color: "#ffe342",
      total: calculation.ti,
      scale: "Sd",
    },
    {
      name: "Damaged ecosystems",
      value: calculation.ti_Ea,
      color: "#83af70",
      total: calculation.ti,
      scale: "Ea",
    },
    {
      name: "Financial asset damages",
      value: calculation.ti_Fa,
      color: "#6996b3",
      total: calculation.ti,
      scale: "Fa",
    },
    {
      name: "Reduction of economic performance",
      value: calculation.ti_Fb,
      color: "#c1e7ff",
      total: calculation.ti,
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
