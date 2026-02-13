import {
  Layer,
  Rectangle,
  ResponsiveContainer,
  Sankey,
  Tooltip,
  TooltipContentProps,
} from "recharts";
import {
  DVRiskSummary,
  EffectRisksSummary,
} from "../../types/dataverse/DVRiskSummary";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import { LinkProps, NodeProps, SankeyData } from "recharts/types/chart/Sankey";
import { useTranslation } from "react-i18next";
import round from "../../functions/roundNumberString";
import getCategoryColor from "../../functions/getCategoryColor";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Box, Typography } from "@mui/material";
import { RiskFileQuantiResults } from "../../types/dataverse/DVRiskFile";
import {
  DAMAGE_INDICATOR,
  IMPACT_CATEGORY,
  IMPACT_CATEGORY_NAME,
} from "../../functions/Impact";
import { AggregatedImpacts } from "../../types/simulation";
import { iScale7FromEuros } from "../../functions/indicators/impact";
import { DAMAGE_INDICATOR_COLORS } from "../../functions/getImpactColor";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";

const baseY = 50;

export type EffectSankeyNode = {
  name: string;
  cascade?: SankeyEffect;
  otherEffects?: SankeyEffect[];
};

type SankeyEffect = EffectRisksSummary & {
  parts?: {
    considerable?: number;
    major?: number;
    extreme?: number;
  };
};

export function ImpactSankeyBox({
  riskSummary,
  riskSnapshot,
  scenario,
  results,
  width = "100%",
  height = "100%",
  focusedImpact = null,
  onClick,
}: {
  riskSummary: DVRiskSummary;
  riskSnapshot: DVRiskSnapshot;
  scenario: SCENARIOS;
  results: RiskFileQuantiResults | null;
  width?: number | string;
  height?: number | string;
  focusedImpact?: IMPACT_CATEGORY | DAMAGE_INDICATOR | null;
  onClick: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <Box
        sx={{ width: "100%", height: 30, pr: 0.5, mb: 2, textAlign: "right" }}
      >
        <Typography variant="h6">{t("Impact Breakdown")}</Typography>
      </Box>
      <ResponsiveContainer width={width} height={height}>
        <ImpactSankey
          riskSummary={riskSummary}
          riskSnapshot={riskSnapshot}
          scenario={scenario}
          results={results}
          tooltip={true}
          focusedImpact={focusedImpact}
          onClick={onClick}
        />
      </ResponsiveContainer>
    </>
  );
}

export default function ImpactSankey({
  riskSummary,
  riskSnapshot,
  scenario,
  results,
  width,
  height,
  tooltip = true,
  focusedImpact = null,
  onClick,
}: {
  riskSummary: DVRiskSummary;
  riskSnapshot: DVRiskSnapshot;
  scenario: SCENARIOS;
  results: RiskFileQuantiResults | null;
  width?: number;
  height?: number;
  tooltip?: boolean;
  focusedImpact?: IMPACT_CATEGORY | DAMAGE_INDICATOR | null;
  onClick: (id: string) => void;
}) {
  let effects: EffectRisksSummary[] = [];

  const isActor = riskSnapshot.cr4de_risk_type === RISK_TYPE.MANMADE;

  const impactKey: keyof AggregatedImpacts = focusedImpact
    ? (focusedImpact.toLowerCase() as keyof AggregatedImpacts)
    : "all";

  if (!results && riskSummary.cr4de_effect_risks) {
    effects =
      typeof riskSummary.cr4de_effect_risks === "string"
        ? JSON.parse(riskSummary.cr4de_effect_risks)
        : riskSummary.cr4de_effect_risks;
  } else if (results) {
    const sums =
      results[scenario].impactStatistics?.relativeContributions.reduce(
        (acc, c) => ({
          ...acc,
          [c.id || ""]: {
            effect_risk_id: c.id || "",
            effect_risk_title: c.risk,
            effect_risk_i:
              (acc[c.id || ""]?.effect_risk_i || 0) +
              c.contributionMean[impactKey],
            parts: {
              ...(acc[c.id || ""]?.parts || {}),
              [c.scenario || "considerable"]: c.contributionMean[impactKey],
            },
          },
        }),
        {} as Record<string, SankeyEffect>,
      ) || {};

    effects = Object.values(sums)
      .sort((a, b) => b.effect_risk_i - a.effect_risk_i)
      .reduce(
        (acc, e) => {
          if (acc.totalI > 0.8) {
            let lastEffect = acc.effects[acc.effects.length - 1];
            if (!lastEffect.other_effects) {
              lastEffect = {
                effect_risk_id: "",
                effect_risk_title: "Other effects",
                effect_risk_i: 0,
                other_effects: [],
              };
              acc.effects.push(lastEffect);
            }
            lastEffect.other_effects!.push({ ...e });
            lastEffect.effect_risk_i += e.effect_risk_i;
            return acc;
          }

          return {
            effects: [...acc.effects, e],
            totalI: acc.totalI + e.effect_risk_i,
          };
        },
        { effects: [] as EffectRisksSummary[], totalI: 0 },
      ).effects;
  }

  const otherEffectsName = isActor
    ? "Other malicious actions"
    : "Other effects";

  const nodes: EffectSankeyNode[] = [
    { name: `risk.${riskSnapshot.cr4de_hazard_id}.name` },
    ...effects.map((c) => ({
      name: c.other_effects ? otherEffectsName : c.effect_risk_title,
      cascade: c,
      otherEffects: c.other_effects || undefined,
    })),
  ];

  const data: SankeyData & { nodes: EffectSankeyNode[] } = {
    nodes,
    links: effects.map((e, i: number) => ({
      source: 0,
      target: i + 1,
      value: Math.max(0.000000001, e.effect_risk_i),
    })),
  };

  return (
    <Sankey
      width={width}
      height={height}
      data={data}
      node={(props: NodeProps & { payload: EffectSankeyNode }) => (
        <ISankeyNode
          {...props}
          totalEffects={data.nodes.length}
          totalI={
            results
              ? iScale7FromEuros(
                  results[scenario].impactStatistics?.sampleMedian[impactKey] ||
                    0,
                )
              : riskSnapshot.cr4de_quanti[scenario].ti.all.scaleTot
          }
          fontSize={14}
          focusedImpact={focusedImpact}
          onNavigate={onClick}
        />
      )}
      link={(props: LinkProps) => (
        <ISankeyLink {...props} totalEffects={data.nodes.length} />
      )}
      // Disable sorting  the nodes
      iterations={0}
      // More spacing between nodes
      nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
    >
      {tooltip && <Tooltip content={EffectTooltip} />}
    </Sankey>
  );
}

function ISankeyNode({
  index,
  payload,
  x,
  y,
  width,
  height,
  totalEffects,
  totalI,
  fontSize,
  focusedImpact,
  onNavigate,
}: NodeProps & {
  payload: EffectSankeyNode;
  totalEffects: number;
  totalI: number;
  fontSize: number;
  focusedImpact?: IMPACT_CATEGORY | DAMAGE_INDICATOR | null;
  onNavigate?: (riskId: string) => void;
}) {
  const { t } = useTranslation();

  if (payload.sourceNodes.length <= 0) {
    return (
      <Layer className="total-impact" key={`effectNode${index}`}>
        <Rectangle
          x={x}
          y={baseY}
          width={width}
          height={totalEffects <= 2 ? 490 : height}
          fill={
            focusedImpact
              ? DAMAGE_INDICATOR_COLORS[focusedImpact]
              : getCategoryColor("")
          }
          fillOpacity="1"
          z={-1}
        />
        <text
          textAnchor="middle"
          x={-y - (totalEffects <= 2 ? 490 : height) / 2 - 18}
          y={x + 30}
          fontSize={fontSize || "16"}
          stroke="#333"
          transform="rotate(270)"
        >
          {`${
            focusedImpact
              ? IMPACT_CATEGORY_NAME[focusedImpact as IMPACT_CATEGORY] ||
                focusedImpact
              : "Total"
          } Impact:`}
          <tspan dx={12}>{round(totalI, 2)}</tspan>
        </text>
      </Layer>
    );
  } else {
    return (
      <Layer
        className="impact-effect"
        key={`effectNode${index}`}
        onClick={() => {
          if (!payload.cascade?.effect_risk_id) return;

          if (onNavigate) return onNavigate(payload.cascade.effect_risk_id);
        }}
      >
        {payload.cascade?.parts && payload.cascade.effect_risk_id !== "" ? (
          <>
            <Rectangle
              x={x}
              y={totalEffects <= 2 ? baseY : y}
              width={width}
              height={
                ((totalEffects <= 2 ? 600 - 2 * baseY : height) *
                  (payload.cascade.parts.considerable || 0)) /
                payload.cascade.effect_risk_i
              }
              fill={SCENARIO_PARAMS["considerable"].color}
              fillOpacity="1"
              style={{ cursor: payload.cascade ? "pointer" : "default" }}
            />
            <Rectangle
              x={x}
              y={
                (totalEffects <= 2 ? baseY : y) +
                ((totalEffects <= 2 ? 600 - 2 * baseY : height) *
                  (payload.cascade.parts.considerable || 0)) /
                  payload.cascade.effect_risk_i
              }
              width={width}
              height={
                ((totalEffects <= 2 ? 600 - 2 * baseY : height) *
                  (payload.cascade.parts.major || 0)) /
                payload.cascade.effect_risk_i
              }
              fill={SCENARIO_PARAMS["major"].color}
              fillOpacity="1"
              style={{ cursor: payload.cascade ? "pointer" : "default" }}
            />
            <Rectangle
              x={x}
              y={
                (totalEffects <= 2 ? baseY : y) +
                ((totalEffects <= 2 ? 600 - 2 * baseY : height) *
                  ((payload.cascade.parts.considerable || 0) +
                    (payload.cascade.parts.major || 0))) /
                  payload.cascade.effect_risk_i
              }
              width={width}
              height={
                ((totalEffects <= 2 ? 600 - 2 * baseY : height) *
                  (payload.cascade.parts.extreme || 0)) /
                payload.cascade.effect_risk_i
              }
              fill={SCENARIO_PARAMS["extreme"].color}
              fillOpacity="1"
              style={{ cursor: payload.cascade ? "pointer" : "default" }}
            />
          </>
        ) : (
          <Rectangle
            x={x}
            y={totalEffects <= 2 ? baseY : y}
            width={width}
            height={totalEffects <= 2 ? 600 - 2 * baseY : height}
            fill={getCategoryColor("")}
            fillOpacity="1"
          />
        )}

        <text
          textAnchor="end"
          x={x - 6}
          y={y + height / 2 + 4}
          fontSize={fontSize ? fontSize - 2 : "14"}
          stroke="#333"
          cursor="default"
        >
          {t(payload.name)}
        </text>
      </Layer>
    );
  }
}

const ISankeyLink = (props: LinkProps & { totalEffects: number }) => {
  const {
    sourceRelativeY,
    sourceX,
    sourceY,
    sourceControlX,
    targetX,
    targetY,
    targetControlX,
    linkWidth,
    totalEffects,
  } = props;

  const shiftedSourceY =
    totalEffects <= 2
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
      strokeWidth={totalEffects <= 2 ? 600 - 2 * baseY : linkWidth}
      strokeOpacity="0.2"
      pointerEvents="none"
      // {...filterProps(others)}
    />
  );
};

const EffectTooltip = ({
  active,
  payload,
}: TooltipContentProps<ValueType, NameType>) => {
  const { t } = useTranslation();

  if (!payload || payload.length <= 0 || !active) return null;

  const p: EffectSankeyNode = payload[0].payload.payload;

  if (!p.cascade) return null;

  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.9)",
        p: 2,
        border: "1px solid #00000030",
      }}
    >
      {!p.otherEffects ? (
        <>
          <Typography variant="subtitle1" color="inherit">
            <u>{t(p.name)}</u>
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
            {t("analysis.effect.explained", {
              percentage: round(100 * p.cascade.effect_risk_i, 2),
            })}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="subtitle1" color="inherit">
            <u>{p.name}</u>
          </Typography>

          {p.otherEffects.map((h: EffectRisksSummary) => (
            <Typography
              key={h.effect_risk_title}
              variant="body1"
              sx={{ mt: 1 }}
            >
              <b>{t(h.effect_risk_title)}:</b>{" "}
              {t("analysis.effect.other.explained", {
                percentage: round(100 * h.effect_risk_i, 2),
              })}
            </Typography>
          ))}
        </>
      )}
    </Box>
  );
};
