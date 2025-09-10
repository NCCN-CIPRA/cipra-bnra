import { Layer, Rectangle, ResponsiveContainer, Sankey } from "recharts";
import getCategoryColor from "../../../functions/getCategoryColor";
import { SCENARIOS, getScenarioSuffix } from "../../../functions/scenarios";
import round from "../../../functions/roundNumberString";
import { useTranslation } from "react-i18next";
import { JSXElementConstructor } from "react";
import {
  DVRiskSummary,
  EffectRisksSummary,
} from "../../../types/dataverse/DVRiskSummary";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../../types/dataverse/DVRiskSnapshot";

const baseY = 50;

const ISankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  totalImpact,
  totalNodes,
  fontSize,
  CustomTooltip,
  onClick,
  onNavigate,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const { t } = useTranslation();

  if (payload.depth <= 0) {
    return (
      <Layer className="total-impact" key={`CustomNode${index}`}>
        <Rectangle
          x={x}
          y={baseY}
          width={width}
          height={totalNodes <= 2 ? 600 - 2 * baseY : height}
          fill={getCategoryColor(payload.category)}
          fillOpacity="1"
        />
        <text
          textAnchor="middle"
          x={-y - height / 2 - 18}
          y={x + 30}
          fontSize={fontSize || "16"}
          stroke="#333"
          transform="rotate(270)"
        >
          {`${t("Total Impact")}: ${round(totalImpact, 2)} / 5`}
        </text>
      </Layer>
    );
  } else {
    if (payload.value <= 0) return null;

    return (
      <Layer className="impact-effect" key={`CustomNode${index}`}>
        <Rectangle
          x={x}
          y={totalNodes <= 2 ? baseY : y}
          width={width}
          height={totalNodes <= 2 ? 600 - 2 * baseY : height}
          fill={getCategoryColor(payload.category)}
          fillOpacity="1"
          style={{ cursor: payload.id && "pointer" }}
          onClick={() => {
            if (!payload.id) return;

            if (onClick) return onClick(payload.id);

            if (onNavigate) onNavigate(payload.id);
          }}
        />
        {CustomTooltip ? (
          <CustomTooltip
            x={x}
            y={y}
            height={height}
            payload={payload}
            totalImpact={totalImpact}
            fontSize={fontSize}
            onClick={onClick}
          />
        ) : (
          <text
            textAnchor="end"
            x={x - 6}
            y={y + height / 2 + 4}
            fontSize={fontSize - 2 || "14"}
            stroke="#333"
            cursor="pointer"
          >
            {t(payload.name)}
          </text>
        )}
      </Layer>
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ISankeyLink = (props: any) => {
  const {
    sourceRelativeY,
    sourceX,
    sourceY,
    sourceControlX,
    targetX,
    targetY,
    targetControlX,
    linkWidth,
    totalNodes,
  } = props;

  const shiftedSourceY =
    totalNodes <= 2
      ? targetY
      : sourceRelativeY + sourceY + (baseY - (sourceY - linkWidth / 2));

  return (
    <path
      d={`
        M${sourceX},${shiftedSourceY}
        C${sourceControlX},${shiftedSourceY} ${targetControlX},${targetY} ${targetX},${targetY}
      `}
      stroke="rgb(102,200,194)"
      fill="none"
      strokeWidth={totalNodes <= 2 ? 600 - 2 * baseY : linkWidth}
      strokeOpacity="0.2"
      // {...filterProps(others)}
    />
  );
};

export default function ImpactSankeyChart({
  riskSummary = null,
  riskFile = null,
  scenario,
  debug = false,
  width = "100%",
  height = "100%",
  CustomTooltip,
  onClick = null,
  onNavigate,
}: {
  riskSummary: DVRiskSummary | null;
  riskFile?: DVRiskSnapshot<unknown, RiskSnapshotResults> | null;
  maxEffects?: number | null;
  minEffectPortion?: number | null;
  shownEffectPortion?: number | null;
  scenario: SCENARIOS;
  debug?: boolean;
  width?: number | string;
  height?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CustomTooltip?: JSXElementConstructor<any>;
  onClick?: ((id: string) => void) | null;
  onNavigate?: (id: string) => void;
}) {
  console.log(riskSummary, riskFile);
  if (!riskSummary || !riskFile) return null;

  const effects = JSON.parse(
    riskSummary.cr4de_effect_risks as string
  ) as EffectRisksSummary[];

  const scenarioSuffix: string = getScenarioSuffix(scenario);

  // const effects = getEffectsWithDI(riskFile, cascades, scenario);

  // let minI = 0;

  // if (maxEffects !== null) {
  //   minI =
  //     maxEffects === null || effects.length < maxEffects
  //       ? -1
  //       : effects.sort((a, b) => b.i - a.i)[
  //           Math.min(maxEffects - 1, effects.length - 1)
  //         ].i;
  // } else if (minEffectPortion !== null) {
  //   const Itot = effects.reduce((tot, e) => tot + e.i, 0.000000001);
  //   minI = minEffectPortion * Itot;
  // } else if (shownEffectPortion !== null) {
  //   const Itot = effects.reduce((tot, e) => tot + e.i, 0.000000001);

  //   let cumulI = 0;
  //   for (const e of effects.sort((a, b) => b.i - a.i)) {
  //     cumulI += e.i / Itot;

  //     if (cumulI >= shownEffectPortion) {
  //       minI = e.i;
  //       break;
  //     }
  //   }
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = [
    { name: `risk.${riskFile.cr4de_hazard_id}.name` },
    ...effects.map((c) => ({
      name: c.effect_risk_title,
      cascade: c,
      hidden: c.other_effects || undefined,
    })),
  ];
  // if (minI >= 0)
  //   nodes.push({
  //     name: "Other",
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     hidden: effects.filter((e: any) => e.i < minI),
  //   });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links: any[] = effects.map((e, i: number) => ({
    source: 0,
    target: i + 1,
    value: Math.max(0.000000001, e.effect_risk_i),
  }));
  // if (minI > 0)
  //   links.push({
  //     source: 0,
  //     target: nodes.length - 1,
  //     value: effects
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       .filter((e: any) => e.i < minI)
  //       .reduce((tot, e) => tot + e.i, 0.000000001),
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     hidden: effects.filter((e: any) => e.i < minI),
  //   });

  const data = {
    nodes,
    links,
  };

  if (typeof width === "string" || typeof height === "string") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={
            <ISankeyNode
              onClick={onClick}
              totalImpact={riskFile.cr4de_quanti[scenario].ti.all.scaleTot}
              totalNodes={data.nodes.length}
              showComponents={debug}
              scenarioSuffix={scenarioSuffix}
              CustomTooltip={CustomTooltip}
              onNavigate={onNavigate}
            />
          }
          link={<ISankeyLink totalNodes={data.nodes.length} />}
          nodePadding={
            data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0
          }
          iterations={0}
        ></Sankey>
      </ResponsiveContainer>
    );
  }

  return (
    <Sankey
      width={width as number}
      height={height as number}
      data={data}
      node={
        <ISankeyNode
          onClick={onClick}
          totalImpact={riskFile.cr4de_quanti[scenario].ti.all.scaleTot}
          totalNodes={data.nodes.length}
          showComponents={debug}
          scenarioSuffix={scenarioSuffix}
          fontSize={22}
          CustomTooltip={CustomTooltip}
          onNavigate={onNavigate}
        />
      }
      link={<ISankeyLink totalNodes={data.nodes.length} />}
      nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
      iterations={0}
    ></Sankey>
  );
}
