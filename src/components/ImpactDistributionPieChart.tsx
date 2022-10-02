import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip,
  TooltipProps,
} from "recharts";
import { Box, Typography } from "@mui/material";

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
        <p
          style={{
            margin: 0,
            color: "#666",
            fontWeight: 700,
            paddingBottom: 5,
            borderBottom: "2px solid #f5f5f5",
          }}
        >
          {payload[0].name}
        </p>
        <p style={{ margin: 0 }}>
          <Typography variant="caption">
            {Math.round(
              (payload[0]!.value! / payload[0]!.payload.total!) * 10000
            ) / 100}
            % of total impact
          </Typography>
        </p>
      </div>
    );
  }

  return null;
};

export default function ImpactDistributionPieChart({
  riskFile,
}: {
  riskFile: any;
}) {
  if (!riskFile) return null;

  const dataGlobal = [
    {
      name: "Human",
      value:
        riskFile.calculated.ti_Ha +
        riskFile.calculated.ti_Hb +
        riskFile.calculated.ti_Hc,
      color: "rgba(214, 48, 49,1.0)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Societal",
      value:
        riskFile.calculated.ti_Sa +
        riskFile.calculated.ti_Sb +
        riskFile.calculated.ti_Sc +
        riskFile.calculated.ti_Sd,
      color: "rgba(108, 92, 231,1.0)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Environmental",
      value: riskFile.calculated.ti_Ea,
      color: "rgba(0, 184, 148,1.0)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Financial",
      value: riskFile.calculated.ti_Fa + riskFile.calculated.ti_Fb,
      color: "rgba(99, 110, 114,1.0)",
      total: riskFile.calculated.ti,
    },
  ];

  const dataSpecific = [
    {
      name: "Fatalities",
      value: riskFile.calculated.ti_Ha,
      color: "rgba(214, 48, 49,0.8)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Injured and sick people",
      value: riskFile.calculated.ti_Hb,
      color: "rgba(214, 48, 49,0.6)",
      total: riskFile.calculated.ti,
    },
    {
      name: "People in need of assistance",
      value: riskFile.calculated.ti_Hc,
      color: "rgba(214, 48, 49,0.4)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Supply shortfalls and unmet human needs",
      value: riskFile.calculated.ti_Sa,
      color: "rgba(108, 92, 231,0.8)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Diminished public order and domestic security",
      value: riskFile.calculated.ti_Sb,
      color: "rgba(108, 92, 231,0.6)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Damage to the reputation of Belgium",
      value: riskFile.calculated.ti_Sc,
      color: "rgba(108, 92, 231,0.4)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Loss of confidence in or loss of functioning of the state and/or its values",
      value: riskFile.calculated.ti_Sd,
      color: "rgba(108, 92, 231,0.2)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Damaged ecosystems",
      value: riskFile.calculated.ti_Ea,
      color: "rgba(0, 184, 148,0.8)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Financial asset damages",
      value: riskFile.calculated.ti_Fa,
      color: "rgba(99, 110, 114,0.8)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Reduction of economic performance",
      value: riskFile.calculated.ti_Fb,
      color: "rgba(99, 110, 114,0.6)",
      total: riskFile.calculated.ti,
    },
  ];

  return (
    <>
      <Box sx={{ width: "100%", textAlign: "center", mb: -4 }}>
        <Typography variant="h6">Impact Distribution</Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataGlobal}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={95}
            fill="#8884d8"
          >
            {dataGlobal.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Pie
            data={dataSpecific}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={105}
            outerRadius={120}
            fill="#82ca9d"
          >
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
