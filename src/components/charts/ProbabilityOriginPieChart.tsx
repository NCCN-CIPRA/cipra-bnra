import { PieChart, Pie, Cell, Tooltip, TooltipProps } from "recharts";
import { Typography } from "@mui/material";

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
            % of total probability
          </Typography>
        </p>
      </div>
    );
  }

  return null;
};

export default function ProbabilityOriginPieChart({
  causes,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  causes: any[];
}) {
  const dataGlobal = causes.map((c) => ({
    name: c.name,
    value: c.p,
    total: c.total,
    // color: "rgba(214, 48, 49,1.0)",
  }));

  return (
    <PieChart
      width={150}
      height={150}
      style={{ float: "right", margin: 10, marginLeft: 80 }}
    >
      <Pie
        data={dataGlobal}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
      >
        {dataGlobal.map((d) => (
          <Cell key={d.name} />
        ))}
      </Pie>
      <Tooltip content={CustomTooltip} />
    </PieChart>
  );
}
