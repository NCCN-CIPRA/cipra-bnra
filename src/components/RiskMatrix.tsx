import { useNavigate } from "react-router-dom";
import {
  ScatterChart,
  Scatter,
  Cell,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { scaleLog } from "d3-scale";
import { getImpactScale } from "../functions/Impact";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { Typography } from "@mui/material";
import getCategoryColor from "../functions/getCategoryColor";

const CustomTooltip = ({ active, payload }: TooltipProps<number, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          border: "1px solid #f5f5f5",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
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
          {payload[0].payload.name}
        </p>
        <p>
          <Typography variant="subtitle2">Probability</Typography>
          <Typography variant="caption">
            {" "}
            {Math.round(payload[0]?.value! * 10000) / 100}% change of occuring in the next 3 years
          </Typography>
        </p>
        <p>
          <Typography variant="subtitle2">Impact</Typography>
          <Typography variant="caption">{`${getImpactScale(payload[1]?.value! / 10, "")}/5`}</Typography>
        </p>
      </div>
    );
  }

  return null;
};

export default function RiskMatrix({ riskFiles }: { riskFiles: any[] | null }) {
  const navigate = useNavigate();

  if (!riskFiles) return null;

  const data = riskFiles
    .filter((rf) => rf.calculated.tp !== 0 || rf.calculated.ti !== 0)
    .map((rf) => ({
      id: rf.cr4de_riskfilesid,
      name: rf.cr4de_title,
      category: rf.cr4de_risk_category,
      x: rf.calculated.tp,
      y: rf.calculated.ti || 1,
      z: 1,
    }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        width={400}
        height={400}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="x"
          scale={scaleLog().base(3)}
          domain={[0.0003, 1]}
          ticks={[0.001, 0.003, 0.01, 0.03, 0.1, 0.3, 1]}
          tickFormatter={(v: number) => `${v * 100}%`}
          name="probability"
          unit=""
          label={{
            value: "Probability of occurence in the next 3 years",
            position: "bottom",
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          scale={scaleLog().base(10)}
          domain={[1600000, 50000000000]}
          ticks={[16000000, 160000000, 1600000000, 16000000000, 160000000000]}
          tickFormatter={(v: number) => getImpactScale(v, "")}
          name="impact"
          unit=""
          label={{
            value: "Expected impact of an event",
            position: "insideLeft",
            angle: -90,
            style: { textAnchor: "middle" },
          }}
        />
        <ZAxis type="number" range={[150]} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={CustomTooltip} />
        <Scatter name="BNRA Risk Matrix" data={data}>
          {data.map((d) => (
            <Cell
              key={d.name}
              fill={getCategoryColor(d.category)}
              radius={20}
              style={{ cursor: "pointer" }}
              onClick={(e) => navigate(`/reporting/${d.id}`)}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
