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
import { ContentType } from "recharts/types/component/Tooltip";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../../types/dataverse/DVRiskSnapshot";
import {
  categoryImpactScale5to7,
  ImpactColor,
  iScale7FromEuros,
} from "../../../functions/indicators/impact";
import { RiskFileQuantiResults } from "../../../types/dataverse/DVRiskFile";
import { DAMAGE_INDICATOR, IMPACT_CATEGORY } from "../../../functions/Impact";

export default function ImpactBarChart({
  riskFile,
  scenario,
  results,
  width,
  height,
  maxScales,
  CustomTooltip,
  focusedImpact = null,
  onClickBar,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults> | null;
  scenario: SCENARIOS;
  results?: RiskFileQuantiResults | null;
  width?: number;
  height?: number;
  maxScales: number;
  CustomTooltip?: ContentType<ValueType, NameType>;
  focusedImpact?: IMPACT_CATEGORY | DAMAGE_INDICATOR | null;
  onClickBar?: (impact: IMPACT_CATEGORY | DAMAGE_INDICATOR) => void;
}) {
  if (!riskFile) return null;

  let H =
    maxScales === 7
      ? categoryImpactScale5to7(riskFile.cr4de_quanti[scenario].ti.h.scaleCat)
      : riskFile.cr4de_quanti[scenario].ti.h.scaleCat;
  let S =
    maxScales === 7
      ? categoryImpactScale5to7(riskFile.cr4de_quanti[scenario].ti.s.scaleCat)
      : riskFile.cr4de_quanti[scenario].ti.s.scaleCat;
  let E =
    maxScales === 7
      ? categoryImpactScale5to7(riskFile.cr4de_quanti[scenario].ti.e.scaleCat)
      : riskFile.cr4de_quanti[scenario].ti.e.scaleCat;
  let F =
    maxScales === 7
      ? categoryImpactScale5to7(riskFile.cr4de_quanti[scenario].ti.f.scaleCat)
      : riskFile.cr4de_quanti[scenario].ti.f.scaleCat;

  if (results) {
    H = iScale7FromEuros(
      results[scenario].impactStatistics?.sampleMedian.h || 0,
    );
    S = iScale7FromEuros(
      results[scenario].impactStatistics?.sampleMedian.s || 0,
    );
    E = iScale7FromEuros(
      results[scenario].impactStatistics?.sampleMedian.e || 0,
    );
    F = iScale7FromEuros(
      results[scenario].impactStatistics?.sampleMedian.f || 0,
    );
  }

  const data = [
    {
      name: "Ha",
      value: results
        ? iScale7FromEuros(
            results[scenario].impactStatistics?.sampleMedian.ha || 0,
          )
        : riskFile.cr4de_quanti[scenario].ti.ha.scaleCatRel * H,
      fill: ImpactColor.Ha,
      opacity:
        !focusedImpact || focusedImpact === "Ha" || focusedImpact === "H"
          ? 1
          : 0.2,
    },
    {
      name: "Hb",
      label: "Human",
      value: results
        ? iScale7FromEuros(
            results[scenario].impactStatistics?.sampleMedian.hb || 0,
          )
        : riskFile.cr4de_quanti[scenario].ti.hb.scaleCatRel * H,
      fill: ImpactColor.Hb,
      opacity:
        !focusedImpact || focusedImpact === "Hb" || focusedImpact === "H"
          ? 1
          : 0.2,
    },
    {
      name: "Hc",
      value: results
        ? iScale7FromEuros(
            results[scenario].impactStatistics?.sampleMedian.hc || 0,
          )
        : riskFile.cr4de_quanti[scenario].ti.hc.scaleCatRel * H,
      fill: ImpactColor.Hc,
      opacity:
        !focusedImpact || focusedImpact === "Hc" || focusedImpact === "H"
          ? 1
          : 0.2,
    },
    {
      name: "",
      value: 0,
    },
    {
      name: "Sa",
      value: results
        ? iScale7FromEuros(
            results[scenario].impactStatistics?.sampleMedian.sa || 0,
          )
        : riskFile.cr4de_quanti[scenario].ti.sa.scaleCatRel * S,
      fill: ImpactColor.Sa,
      opacity:
        !focusedImpact || focusedImpact === "Sa" || focusedImpact === "S"
          ? 1
          : 0.2,
    },
    {
      name: "Sb",
      label: "Societal",
      tickOffset: 0.5,
      value: results
        ? iScale7FromEuros(
            results[scenario].impactStatistics?.sampleMedian.sb || 0,
          )
        : riskFile.cr4de_quanti[scenario].ti.sb.scaleCatRel * S,
      fill: ImpactColor.Sb,
      opacity:
        !focusedImpact || focusedImpact === "Sb" || focusedImpact === "S"
          ? 1
          : 0.2,
    },
    {
      name: "Sc",
      value: results
        ? iScale7FromEuros(
            results[scenario].impactStatistics?.sampleMedian.sc || 0,
          )
        : riskFile.cr4de_quanti[scenario].ti.sc.scaleCatRel * S,
      fill: ImpactColor.Sc,
      opacity:
        !focusedImpact || focusedImpact === "Sc" || focusedImpact === "S"
          ? 1
          : 0.2,
    },
    {
      name: "Sd",
      value: results
        ? iScale7FromEuros(
            results[scenario].impactStatistics?.sampleMedian.sd || 0,
          )
        : riskFile.cr4de_quanti[scenario].ti.sd.scaleCatRel * S,
      fill: ImpactColor.Sd,
      opacity:
        !focusedImpact || focusedImpact === "Sd" || focusedImpact === "S"
          ? 1
          : 0.2,
    },
    {
      name: "",
      value: 0,
    },
    {
      name: "Ea",
      label: "Environmental",
      value: results
        ? iScale7FromEuros(
            results[scenario].impactStatistics?.sampleMedian.ea || 0,
          )
        : riskFile.cr4de_quanti[scenario].ti.ea.scaleCatRel * E,
      fill: ImpactColor.Ea,
      opacity:
        !focusedImpact || focusedImpact === "Ea" || focusedImpact === "E"
          ? 1
          : 0.2,
    },
    {
      name: "",
      value: 0,
    },
    {
      name: "Fa",
      label: "Financial",
      value: results
        ? iScale7FromEuros(
            results[scenario].impactStatistics?.sampleMedian.fa || 0,
          )
        : riskFile.cr4de_quanti[scenario].ti.fa.scaleCatRel * F,
      fill: ImpactColor.Fa,
      opacity:
        !focusedImpact || focusedImpact === "Fa" || focusedImpact === "F"
          ? 1
          : 0.2,
    },
    {
      name: "Fb",
      value: results
        ? iScale7FromEuros(
            results[scenario].impactStatistics?.sampleMedian.fb || 0,
          )
        : riskFile.cr4de_quanti[scenario].ti.fb.scaleCatRel * F,
      fill: ImpactColor.Fb,
      opacity:
        !focusedImpact || focusedImpact === "Fb" || focusedImpact === "F"
          ? 1
          : 0.2,
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
          // interval={0}
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
          tickLine={false}
          tickFormatter={(value) => {
            if (value === "Hb") return "Human";
            if (value === "Sb") return "Societal";
            if (value === "Ea") return "Environmental";
            if (value === "Fa") return "Financial";
            return "";
          }}
        />
        <YAxis
          domain={[0, maxScales + 0.5]}
          ticks={Array(maxScales)
            .fill(null)
            .map((_, i) => i + 1)}
          width={10}
        />
        <Tooltip
          wrapperStyle={{
            zIndex: 100000,
            backgroundColor: "rgba(34, 41, 47, 0.1)",
          }}
          content={CustomTooltip}
        />
        <Bar
          dataKey="value"
          // stackId="a"
          // fill="#de6148"
          onClick={(p) => {
            if (!onClickBar || !p.name) return;

            if (
              focusedImpact &&
              (focusedImpact === p.name[0] || focusedImpact === p.name)
            )
              onClickBar(p.name as DAMAGE_INDICATOR);
            else onClickBar(p.name[0] as IMPACT_CATEGORY);
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
