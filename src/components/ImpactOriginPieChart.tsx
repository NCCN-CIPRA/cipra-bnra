import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, TooltipProps } from "recharts";
import { Box, Typography } from "@mui/material";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    console.log(payload);
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
            {Math.round((payload[0]!.value! / payload[0]!.payload.total!) * 10000) / 100}% of total impact
          </Typography>
        </p>
      </div>
    );
  }

  return null;
};

export default function ImpactOriginPieChart({ riskFile }: { riskFile: any }) {
  if (!riskFile) return null;

  const dataGlobal = [
    {
      name: "Direct Impact",
      value: riskFile.calculated.di,
      color: "rgba(214, 48, 49,1.0)",
      total: riskFile.calculated.ti,
    },
    {
      name: "Indirect Impact",
      value: riskFile.calculated.ii,
      color: "rgba(108, 92, 231,1.0)",
      total: riskFile.calculated.ti,
    },
  ];

  return (
    <>
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Typography variant="h6">Impact Origin</Typography>
      </Box>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={dataGlobal} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
            {dataGlobal.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip content={CustomTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
