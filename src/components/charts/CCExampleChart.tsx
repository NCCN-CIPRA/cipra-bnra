import { useTranslation } from "react-i18next";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceArea,
} from "recharts";

function norm(x: number) {
  return Math.pow(Math.E, -Math.pow(x, 2) / 2) / Math.sqrt(2 * Math.PI);
}

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
  p: norm(i - 4),
  p2050: norm(i - 5),
  i,
}));

const EvolutionArrow = ({
  viewBox,
}: {
  viewBox: { x: number; y: number; width: number; height: number };
  offset: number;
}) => {
  const l = viewBox.x;

  const b = viewBox.height + viewBox.y;

  const coor = (x: number, y: number) =>
    `${l + viewBox.width * (x / 9)} ${b - viewBox.height * (y / 0.5)}`;

  return (
    <>
      <text
        x={l + viewBox.width * (4.5 / 9)}
        y={b - viewBox.height * 0.85}
        textAnchor="middle"
      >
        Shift in expected impact due to climate change
      </text>
      <polygon
        points={`${coor(3.9, norm(0) * 0.95)} ${coor(
          4.9,
          norm(0) * 0.95
        )} ${coor(4.9, norm(0) * 0.97)} ${coor(5.1, norm(0) * 0.94)} ${coor(
          4.9,
          norm(0) * 0.91
        )} ${coor(4.9, norm(0) * 0.93)} ${coor(3.9, norm(0) * 0.93)}`}
        fill="url(#evolutionArrow)"
      />
    </>
  );
};

export default function CCExampleChart() {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 30,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          //   label="Impact of scenario"
          offset={50}
          dataKey="i"
          //   ticks={[1, 4, 7]}
          tickFormatter={(v: number) => {
            if (v === 5) return t("considerable");
            if (v === 6) return t("major");
            if (v === 7) return t("extreme");
            return "";
          }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 0.5]}
          label={{
            value: t("learning.probability.2.text.title", "Probability"),
            style: { textAnchor: "middle" },
            angle: -90,
            position: "left",
            offset: -20,
          }}
          ticks={[0, 0.5]}
          tickFormatter={(v) => {
            if (v === 0) return t("Low");
            if (v === 0.5) return t("High");
            return "";
          }}
        />
        {/* <Tooltip />
        <Legend /> */}
        <defs>
          <linearGradient id="pColor" x1="0" y1="0" x2="1" y2="0">
            <stop offset={4.5 / 9} stopColor="#00000000" stopOpacity={1} />
            <stop offset={4.5 / 9} stopColor="#00A49A" stopOpacity={1} />
            <stop offset={5.5 / 9} stopColor="#00A49A" stopOpacity={1} />
            <stop offset={5.5 / 9} stopColor="#ffdf1c" stopOpacity={1} />
            <stop offset={6.5 / 9} stopColor="#ffdf1c" stopOpacity={1} />
            <stop offset={6.5 / 9} stopColor="#f0492e " stopOpacity={1} />
          </linearGradient>
          <linearGradient id="p2050Color" x1="0" y1="0" x2="1" y2="0">
            <stop offset={4.5 / 9} stopColor="#00000000" stopOpacity={1} />
            <stop offset={4.5 / 9} stopColor="#00A49A" stopOpacity={1} />
            <stop offset={5.5 / 9} stopColor="#00A49A" stopOpacity={1} />
            <stop offset={5.5 / 9} stopColor="#ffdf1c" stopOpacity={1} />
            <stop offset={6.5 / 9} stopColor="#ffdf1c" stopOpacity={1} />
            <stop offset={6.5 / 9} stopColor="#f0492e " stopOpacity={1} />
          </linearGradient>
          <linearGradient id="evolutionArrow" x1="0" y1="0" x2="1" y2="0">
            <stop offset={0} stopColor="#00A49A" stopOpacity={0.8} />
            <stop offset={0.5} stopColor="#ffdf1c" stopOpacity={0.8} />
            <stop offset={1} stopColor="#f0492e " stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <Area
          type="natural"
          dataKey="p"
          stroke="#00000090"
          strokeWidth={2}
          fill="url(#pColor)"
        ></Area>
        <Area
          type="natural"
          dataKey="p2050"
          stroke="#00000090"
          strokeWidth={2}
          fill="url(#p2050Color)"
        />
        <ReferenceArea
          x1={0}
          y1={0}
          x2={9}
          y2={0.5}
          label={EvolutionArrow}
          fill="none"
        />
        {/* <ReferenceArea x1={2001} x2={2003} shape={<EvolutionArrow />} label="an important period" /> */}
      </AreaChart>
    </ResponsiveContainer>
  );
}
