import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SCENARIOS } from "../../../functions/scenarios";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { useTranslation } from "react-i18next";
import { ContentType } from "recharts/types/component/Tooltip";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../../types/dataverse/DVRiskSnapshot";
import { categoryImpactScale5to7 } from "../../../functions/indicators/impact";

export default function ImpactBarChart({
  riskFile,
  scenario,
  width,
  height,
  maxScales,
  CustomTooltip,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults> | null;
  scenario: SCENARIOS;
  width?: number;
  height?: number;
  maxScales: number;
  CustomTooltip?: ContentType<ValueType, NameType>;
}) {
  const { t } = useTranslation();
  if (!riskFile) return null;

  const H =
    maxScales === 7
      ? categoryImpactScale5to7(riskFile.cr4de_quanti[scenario].ti.h.scaleCat)
      : riskFile.cr4de_quanti[scenario].ti.h.scaleCat;
  const S =
    maxScales === 7
      ? categoryImpactScale5to7(riskFile.cr4de_quanti[scenario].ti.s.scaleCat)
      : riskFile.cr4de_quanti[scenario].ti.s.scaleCat;
  const E =
    maxScales === 7
      ? categoryImpactScale5to7(riskFile.cr4de_quanti[scenario].ti.e.scaleCat)
      : riskFile.cr4de_quanti[scenario].ti.e.scaleCat;
  const F =
    maxScales === 7
      ? categoryImpactScale5to7(riskFile.cr4de_quanti[scenario].ti.f.scaleCat)
      : riskFile.cr4de_quanti[scenario].ti.f.scaleCat;

  const data = [
    {
      name: t("Human"),
      H: H,
      Ha: riskFile.cr4de_quanti[scenario].ti.ha.scaleCatRel * H,
      Hb: riskFile.cr4de_quanti[scenario].ti.hb.scaleCatRel * H,
      Hc: riskFile.cr4de_quanti[scenario].ti.hc.scaleCatRel * H,
      Ha_abs: riskFile.cr4de_quanti[scenario].ti.ha.abs,
      Hb_abs: riskFile.cr4de_quanti[scenario].ti.hb.abs,
      Hc_abs: riskFile.cr4de_quanti[scenario].ti.hc.abs,
    },
    {
      name: t("Societal"),
      S: S,
      Sa: riskFile.cr4de_quanti[scenario].ti.sa.scaleCatRel * S,
      Sb: riskFile.cr4de_quanti[scenario].ti.sb.scaleCatRel * S,
      Sc: riskFile.cr4de_quanti[scenario].ti.sc.scaleCatRel * S,
      Sd: riskFile.cr4de_quanti[scenario].ti.sd.scaleCatRel * S,
      Sa_abs: riskFile.cr4de_quanti[scenario].ti.sa.abs,
      Sb_abs: riskFile.cr4de_quanti[scenario].ti.sb.abs,
      Sc_abs: riskFile.cr4de_quanti[scenario].ti.sc.abs,
      Sd_abs: riskFile.cr4de_quanti[scenario].ti.sd.abs,
    },
    {
      name: t("Environmental"),
      E: E,
      Ea: riskFile.cr4de_quanti[scenario].ti.ea.scaleCatRel * E,
      Ea_abs: riskFile.cr4de_quanti[scenario].ti.ea.abs,
    },
    {
      name: t("Financial"),
      F: F,
      Fa: riskFile.cr4de_quanti[scenario].ti.fa.scaleCatRel * F,
      Fb: riskFile.cr4de_quanti[scenario].ti.fb.scaleCatRel * F,
      Fa_abs: riskFile.cr4de_quanti[scenario].ti.fa.abs,
      Fb_abs: riskFile.cr4de_quanti[scenario].ti.fb.abs,
    },
  ];

  if (width && height) {
    return (
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{
          top: 20,
          bottom: 125,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-90}
          dx={-5}
          dy={5}
          interval={0}
          textAnchor="end"
          fontSize={22}
        />
        <YAxis
          domain={[0, maxScales + 0.5]}
          ticks={Array(maxScales)
            .fill(null)
            .map((_, i) => i + 1)}
          width={10}
          fontSize={22}
        />
        {CustomTooltip && <Tooltip content={CustomTooltip} />}
        <Bar dataKey="Ha" stackId="a" fill="#de6148" />
        <Bar dataKey="Hb" stackId="a" fill="#f39d87" />
        <Bar dataKey="Hc" stackId="a" fill="#ffd7cc" />
        {/* <Bar dataKey="H" stackId="b" style={{ display: "none" }} /> */}
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
    );
  }

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
        <XAxis
          dataKey="name"
          angle={-90}
          dx={-5}
          dy={5}
          interval={0}
          textAnchor="end"
        />
        <YAxis
          domain={[0, maxScales + 0.5]}
          ticks={Array(maxScales)
            .fill(null)
            .map((_, i) => i + 1)}
          width={10}
        />
        <Tooltip content={CustomTooltip} />
        <Bar dataKey="Ha" stackId="a" fill="#de6148" />
        <Bar dataKey="Hb" stackId="a" fill="#f39d87" />
        <Bar dataKey="Hc" stackId="a" fill="#ffd7cc" />
        {/* <Bar dataKey="H" stackId="b" style={{ display: "none" }} /> */}
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
