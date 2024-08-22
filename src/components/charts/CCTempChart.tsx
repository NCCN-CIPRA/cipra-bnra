import { ViewKanbanTwoTone } from "@mui/icons-material";
import { Box, Button, Card, CardActionArea, CardActions, CardContent, Typography } from "@mui/material";
import FileSaver from "file-saver";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  Polygon,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import { useCurrentPng } from "recharts-to-png";

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
  offset,
}: {
  viewBox: { x: number; y: number; width: number; height: number };
  offset: number;
}) => {
  const { t } = useTranslation();
  const l = viewBox.x;
  const b = viewBox.height + viewBox.y;
  const coor = (x: number, y: number) => `${l + viewBox.width * (x / 9)} ${b - viewBox.height * (y / 0.5)}`;

  return (
    <>
      <text x={l + viewBox.width * (4.5 / 9)} y={b - viewBox.height * 0.85} textAnchor="middle">
        {t("cchart.increase", "Increase in mean temperature")}
      </text>
      <polygon
        points={`${coor(3.9, norm(0) * 0.95)} ${coor(4.9, norm(0) * 0.95)} ${coor(4.9, norm(0) * 0.97)} ${coor(
          5.1,
          norm(0) * 0.94
        )} ${coor(4.9, norm(0) * 0.91)} ${coor(4.9, norm(0) * 0.93)} ${coor(3.9, norm(0) * 0.93)}`}
        fill="url(#evolutionArrow)"
      />
    </>
  );
};

const LCLabel = ({
  viewBox,
  offset,
}: {
  viewBox: { x: number; y: number; width: number; height: number };
  offset: number;
}) => {
  const { t } = useTranslation();
  const l = viewBox.x;
  const b = viewBox.height + viewBox.y;

  return (
    <>
      <text x={l + viewBox.width * (1 / 9)} y={b - viewBox.height * 0.2} font-size="15" dy="0" textAnchor="center">
        <tspan x={l + viewBox.width * (1 / 9)} dy="-2.4em" text-anchor="middle">
          {t("ccchart.lessColdWeath.1", "Less")}
        </tspan>
        <tspan x={l + viewBox.width * (1 / 9)} dy="1.2em" text-anchor="middle" fill="#00A49A" fontWeight="bold">
          {t("ccchart.lessColdWeath.2", "cold")}
        </tspan>
        {t("ccchart.lessColdWeath.3", "weather") !== "-" && (
          <tspan x={l + viewBox.width * (1 / 9)} dy="1.2em" text-anchor="middle">
            {t("ccchart.lessColdWeath.3", "weather")}
          </tspan>
        )}
      </text>
      <path
        id="arrow-line"
        marker-end="url(#head)"
        stroke-width="2"
        fill="none"
        stroke="#00000090"
        d={`M ${l + viewBox.width * (1 / 9)} ${b - viewBox.height * 0.2 + 10} Q ${l + viewBox.width * (1 / 9)} ${
          b -
          viewBox.height * 0.2 +
          10 +
          (b - viewBox.height * (norm(1.5 - 4) / 0.5) - 10 - (b - viewBox.height * 0.2 + 10)) / 2
        } ${l + viewBox.width * (1.5 / 9)} ${b - viewBox.height * (norm(1.5 - 4) / 0.5) - 10}`}
      />
    </>
  );
};

const NCLabel = ({
  viewBox,
  offset,
}: {
  viewBox: { x: number; y: number; width: number; height: number };
  offset: number;
}) => {
  const { t } = useTranslation();
  const l = viewBox.x;
  const b = viewBox.height + viewBox.y;

  return (
    <>
      <text
        x={l + viewBox.width * (4 / 9)}
        y={b - viewBox.height * (norm(3.5 - 5) / 0.5)}
        font-size="15"
        dy="0"
        textAnchor="center"
      >
        <tspan x={l + viewBox.width * (4 / 9) + 20} dy="-0.2em" text-anchor="middle">
          {t("ccchart.newClimate.1", "New")}
        </tspan>
        <tspan x={l + viewBox.width * (4 / 9) + 20} dy="1.2em" text-anchor="middle">
          {t("ccchart.newClimate.2", "climate")}
        </tspan>
      </text>
      <path
        id="arrow-line"
        marker-end="url(#head)"
        stroke-width="2"
        fill="none"
        stroke="#00000090"
        d={`M ${l + viewBox.width * (4 / 9) - 10} ${b - viewBox.height * (norm(3.5 - 5) / 0.5)}  ${
          l + viewBox.width * (3.5 / 9) + 15
        } ${b - viewBox.height * (norm(3.5 - 5) / 0.5)}`}
      />
    </>
  );
};

const PCLabel = ({
  viewBox,
  offset,
}: {
  viewBox: { x: number; y: number; width: number; height: number };
  offset: number;
}) => {
  const { t } = useTranslation();
  const l = viewBox.x;
  const b = viewBox.height + viewBox.y;

  return (
    <>
      <text
        x={l + viewBox.width * (2 / 9)}
        y={b - viewBox.height * (norm(3 - 4) / 0.5)}
        font-size="15"
        dy="0"
        textAnchor="center"
      >
        <tspan x={l + viewBox.width * (2 / 9) - 30} dy="-0.2em" text-anchor="middle">
          {t("ccchart.previousClimate.1", "Previous")}
        </tspan>
        <tspan x={l + viewBox.width * (2 / 9) - 30} dy="1.2em" text-anchor="middle">
          {t("ccchart.previousClimate.2", "climate")}
        </tspan>
      </text>
      <path
        id="arrow-line"
        marker-end="url(#head)"
        stroke-width="2"
        fill="none"
        stroke="#00000090"
        d={`M ${l + viewBox.width * (2 / 9) + 10} ${b - viewBox.height * (norm(3 - 4) / 0.5)}  ${
          l + viewBox.width * (3 / 9) - 15
        } ${b - viewBox.height * (norm(3 - 4) / 0.5)}`}
      />
    </>
  );
};

const MHLabel = ({
  viewBox,
  offset,
}: {
  viewBox: { x: number; y: number; width: number; height: number };
  offset: number;
}) => {
  const { t } = useTranslation();
  const l = viewBox.x;
  const b = viewBox.height + viewBox.y;

  return (
    <>
      <text x={l + viewBox.width * (6.5 / 9)} y={b - viewBox.height * 0.65} font-size="15" dy="0" textAnchor="center">
        <tspan x={l + viewBox.width * (6.5 / 9)} dy="-2.4em" text-anchor="middle">
          {t("ccchart.moreHotWeather.1", "More")}
        </tspan>
        <tspan x={l + viewBox.width * (6.5 / 9)} dy="1.2em" text-anchor="middle" fill="#ffdf1c" fontWeight="bold">
          {t("ccchart.moreHotWeather.2", "hot")}
        </tspan>
        {t("ccchart.moreHotWeather.3", "weather") !== "-" && (
          <tspan x={l + viewBox.width * (6.5 / 9)} dy="1.2em" text-anchor="middle">
            {t("ccchart.moreHotWeather.3", "weather")}
          </tspan>
        )}
      </text>
      <path
        id="arrow-line"
        marker-end="url(#head)"
        stroke-width="2"
        fill="none"
        stroke="#00000090"
        d={`M ${l + viewBox.width * (6.5 / 9)} ${b - viewBox.height * 0.65 + 10} Q ${l + viewBox.width * (6.5 / 9)} ${
          b -
          viewBox.height * (norm(6 - 5) / 0.5) -
          (b - viewBox.height * (norm(6 - 5) / 0.5) - (b - viewBox.height * 0.65 + 10)) / 2
        } ${l + viewBox.width * (6 / 9) + 10} ${b - viewBox.height * (norm(6 - 5) / 0.5) - 10}`}
      />
    </>
  );
};

const MRHLabel = ({
  viewBox,
  offset,
}: {
  viewBox: { x: number; y: number; width: number; height: number };
  offset: number;
}) => {
  const { t } = useTranslation();
  const l = viewBox.x;
  const b = viewBox.height + viewBox.y;

  return (
    <>
      <text x={l + viewBox.width * (7.5 / 9)} y={b - viewBox.height * 0.25} font-size="15" dy="0" textAnchor="center">
        <tspan x={l + viewBox.width * (7.5 / 9)} dy="-2.4em" text-anchor="middle">
          {t("ccchart.moreRecordHotWeather.1", "More")}
        </tspan>
        <tspan x={l + viewBox.width * (7.5 / 9)} dy="1.2em" text-anchor="middle" fill="#f0492e" fontWeight="bold">
          {t("ccchart.moreRecordHotWeather.2", "record hot")}
        </tspan>
        {t("ccchart.moreRecordHotWeather.3", "weather") !== "-" && (
          <tspan x={l + viewBox.width * (7.5 / 9)} dy="1.2em" text-anchor="middle">
            {t("ccchart.moreRecordHotWeather.3", "weather")}
          </tspan>
        )}
      </text>
      <path
        id="arrow-line"
        marker-end="url(#head)"
        stroke-width="2"
        fill="none"
        stroke="#00000090"
        d={`M ${l + viewBox.width * (7.5 / 9)} ${b - viewBox.height * 0.25 + 10} Q ${l + viewBox.width * (7.5 / 9)} ${
          b -
          viewBox.height * (norm(7 - 5) / 0.5) -
          (b - viewBox.height * (norm(7 - 5) / 0.5) - (b - viewBox.height * 0.25 + 10)) / 2
        } ${l + viewBox.width * (7 / 9) + 10} ${b - viewBox.height * (norm(7 - 5) / 0.5) - 10}`}
      />
    </>
  );
};

export default function CCTempChart({}) {
  const { t } = useTranslation();
  const [getPng, { ref, isLoading }] = useCurrentPng({ backgroundColor: "white", scale: 4 });

  const exportPNG = async () => {
    const png = await getPng();

    // Verify that png is not undefined
    if (png) {
      // Download with FileSaver
      FileSaver.saveAs(png, "climate-change.png");
    }
  };

  return (
    <Card sx={{ width: "100%", my: 8, p: 2 }}>
      <CardContent sx={{ width: "100%", aspectRatio: "2" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            ref={ref}
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis
              dataKey="i"
              //   ticks={[1, 4, 7]}
              tickFormatter={(v: number) => {
                if (v === 1) return t("Cold");
                if (v === 4) return t("Average");
                if (v === 7) return t("Hot");
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
                <stop offset={2 / 9} stopColor="#00A49A" stopOpacity={1} />
                <stop offset={2 / 9} stopColor="#00000000" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="p2050Color" x1="0" y1="0" x2="1" y2="0">
                <stop offset={5.5 / 9} stopColor="#00000000" stopOpacity={1} />
                <stop offset={5.5 / 9} stopColor="#ffdf1c" stopOpacity={1} />
                <stop offset={6.5 / 9} stopColor="#ffdf1c" stopOpacity={1} />
                <stop offset={6.5 / 9} stopColor="#f0492e " stopOpacity={1} />
              </linearGradient>
              <linearGradient id="evolutionArrow" x1="0" y1="0" x2="1" y2="0">
                <stop offset={0} stopColor="#00A49A" stopOpacity={0.8} />
                <stop offset={0.5} stopColor="#ffdf1c" stopOpacity={0.8} />
                <stop offset={1} stopColor="#f0492e " stopOpacity={0.8} />
              </linearGradient>
              <marker id="head" orient="auto" markerWidth="3" markerHeight="4" refX="0.1" refY="2">
                <path d="M0,0 V4 L2,2 Z" fill="black" />
              </marker>
            </defs>
            <Area type="natural" dataKey="p" stroke="#00000090" strokeWidth={2} fill="url(#pColor)"></Area>
            <Area type="natural" dataKey="p2050" stroke="#00000090" strokeWidth={2} fill="url(#p2050Color)" />
            <ReferenceArea x1={0} y1={0} x2={9} y2={0.5} label={EvolutionArrow} fill="none" />
            <ReferenceArea x1={0} y1={0} x2={9} y2={0.5} label={PCLabel} fill="none" />
            <ReferenceArea x1={0} y1={0} x2={9} y2={0.5} label={NCLabel} fill="none" />
            <ReferenceArea x1={0} y1={0} x2={9} y2={0.5} label={LCLabel} fill="none" />
            <ReferenceArea x1={0} y1={0} x2={9} y2={0.5} label={MHLabel} fill="none" />
            <ReferenceArea x1={0} y1={0} x2={9} y2={0.5} label={MRHLabel} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={exportPNG}>
          Save as PNG
        </Button>
      </CardActions>
    </Card>
  );
}
