import {
  Layer,
  Rectangle,
  ResponsiveContainer,
  Sankey,
  Tooltip,
  TooltipContentProps,
} from "recharts";
import {
  CascadeSnapshots,
  getEffectsSummaries,
} from "../../functions/cascades";
import { EffectRisksSummary } from "../../types/dataverse/DVRiskSummary";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { SCENARIOS } from "../../functions/scenarios";
import { LinkProps, NodeProps, SankeyData } from "recharts/types/chart/Sankey";
import { useTranslation } from "react-i18next";
import round from "../../functions/roundNumberString";
import getCategoryColor from "../../functions/getCategoryColor";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Box, Typography } from "@mui/material";

const baseY = 50;

export type EffectSankeyNode = {
  name: string;
  cascade?: EffectRisksSummary;
  otherEffects?: EffectRisksSummary[];
};

export function ImpactSankeyBox({
  riskSnapshot,
  cascades,
  scenario,
  width = "100%",
  height = "100%",
  onClick,
}: {
  riskSnapshot: DVRiskSnapshot;
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>;
  scenario: SCENARIOS;
  width?: number | string;
  height?: number | string;
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
          riskSnapshot={riskSnapshot}
          cascades={cascades}
          scenario={scenario}
          tooltip={true}
          onClick={onClick}
        />
      </ResponsiveContainer>
    </>
  );
}

export default function ImpactSankey({
  riskSnapshot,
  cascades,
  scenario,
  width,
  height,
  tooltip = true,
  onClick,
}: {
  riskSnapshot: DVRiskSnapshot;
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>;
  scenario: SCENARIOS;
  width?: number;
  height?: number;
  tooltip?: boolean;
  onClick: (id: string) => void;
}) {
  const effects = getEffectsSummaries(riskSnapshot, cascades, scenario, true);

  const nodes: EffectSankeyNode[] = [
    { name: `risk.${riskSnapshot.cr4de_hazard_id}.name` },
    ...effects.map((c) => ({
      name: c.effect_risk_title,
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
          totalI={riskSnapshot.cr4de_quanti[scenario].ti.all.scaleTot}
          fontSize={14}
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
  onNavigate,
}: NodeProps & {
  payload: EffectSankeyNode;
  totalEffects: number;
  totalI: number;
  fontSize: number;
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
          height={totalEffects <= 2 ? 600 - 2 * baseY : height}
          fill={getCategoryColor("")}
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
          {`${t("Total Impact")}: ${round(totalI, 2)} / 5`}
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
        <Rectangle
          x={x}
          y={totalEffects <= 2 ? baseY : y}
          width={width}
          height={totalEffects <= 2 ? 600 - 2 * baseY : height}
          fill={getCategoryColor("")}
          fillOpacity="1"
        />

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
            {t(p.name)}
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
            {t("Other effects")}:
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
