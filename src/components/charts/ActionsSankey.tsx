import { CascadeSnapshots } from "../../functions/cascades";
import { SCENARIOS } from "../../functions/scenarios";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { LinkProps, NodeProps, SankeyData } from "recharts/types/chart/Sankey";
import {
  Layer,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  TooltipContentProps,
  Sankey,
} from "recharts";
import { useTranslation } from "react-i18next";
import getCategoryColor from "../../functions/getCategoryColor";
import round from "../../functions/roundNumberString";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { Box, Typography } from "@mui/material";

export type ActionRisksSummary = {
  id: string;
  name: string;
  p: number;
};

export type ActionSankeyNode = {
  name: string;
  cascade?: ActionRisksSummary;
  otherActions?: ActionRisksSummary[];
};

const baseY = 50;

export function ActionsSankeyBox({
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
        sx={{ width: "100%", height: 30, pl: 0.5, mb: 2, textAlign: "left" }}
      >
        <Typography variant="h6">{t("Preferred Malicious Actions")}</Typography>
      </Box>
      <ResponsiveContainer width={width} height={height}>
        <ActionsSankey
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

export default function ActionsSankey({
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
  const totCP = cascades.effects.reduce(
    (p, e) => p + e.cr4de_quanti_effect[scenario].cp.avg,
    0.00000001
  );

  const actions: ActionRisksSummary[] = cascades.effects
    .map((e) => ({
      id: e.cr4de_effect_risk._cr4de_risk_file_value,
      name: `risk.${e.cr4de_effect_risk.cr4de_hazard_id}.name`,
      p: e.cr4de_quanti_effect[scenario].cp.avg / totCP,
    }))
    .sort((a, b) => b.p - a.p);

  let minP = 0;

  let cumulP = 0;
  for (const c of actions) {
    cumulP += c.p;

    if (cumulP >= 0.8) {
      minP = c.p;
      break;
    }
  }

  const nodes: ActionSankeyNode[] = [
    { name: `risk.${riskSnapshot.cr4de_hazard_id}.name` },
    ...actions
      .filter((c) => c.p >= minP)
      .map((a) => ({ name: a.name, cascade: a })),
  ];
  const otherActions = actions.filter((e) => e.p < minP);

  if (minP >= 0 && otherActions.length > 0) {
    nodes.push({
      name: "Other Actions",
      cascade: {
        id: "",
        name: "Other Actions",
        p: otherActions.reduce((t, a) => t + a.p, 0.00001),
      },
      otherActions: otherActions,
    });
  }

  const data: SankeyData & { nodes: ActionSankeyNode[] } = {
    nodes,
    links: actions
      .filter((e) => e.p >= minP)
      .map((e, i: number) => ({
        source: i + 1,
        target: 0,
        value: Math.max(0.000000001, e.p),
      })),
  };
  if (minP > 0 && otherActions.length > 0)
    data.links.push({
      source: nodes.length - 1,
      target: 0,
      value: actions
        .filter((e) => e.p < minP)
        .reduce((tot, e) => tot + e.p, 0.000000001),
    });

  return (
    <ResponsiveContainer width={width} height={height}>
      <Sankey
        width={width}
        height={height}
        data={data}
        node={(props: NodeProps & { payload: ActionSankeyNode }) => (
          <ASankeyNode
            {...props}
            totalCauses={data.nodes.length}
            // totalP={riskSnapshot.cr4de_quanti[scenario].tp.yearly.scale}
            fontSize={14}
            onNavigate={onClick}
          />
        )}
        link={(props: LinkProps) => (
          <ASankeyLink {...props} totalCauses={data.nodes.length - 1} />
        )}
        // Disable sorting  the nodes
        iterations={0}
        // More spacing between nodes
        nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
      >
        {tooltip && <Tooltip content={ActionTooltip} />}
      </Sankey>
    </ResponsiveContainer>
  );
}

function ASankeyNode({
  index,
  payload,
  x,
  y,
  width,
  height,
  totalCauses,
  fontSize,
  onNavigate,
}: NodeProps & {
  payload: ActionSankeyNode;
  totalCauses: number;
  fontSize: number;
  onNavigate?: (riskId: string) => void;
}) {
  const { t } = useTranslation();

  if (payload.targetNodes.length <= 0) {
    return (
      <Layer
        className="total-probability"
        key={`causeNode${index}`}
        height="50px"
      >
        <Rectangle
          x={x}
          y={baseY}
          width={width}
          height={totalCauses <= 2 ? 600 - 2 * baseY : height}
          fill={getCategoryColor("")}
          fillOpacity="1"
        />
      </Layer>
    );
  } else {
    return (
      <Layer
        className="probability-cause"
        key={`causeNode${index}`}
        onClick={() => {
          if (!payload.cascade?.id) return;

          if (onNavigate) return onNavigate(payload.cascade.id);
        }}
      >
        <Rectangle
          x={x}
          y={totalCauses <= 2 ? baseY : y}
          width={width}
          height={totalCauses <= 2 ? 600 - 2 * baseY : height}
          fill={getCategoryColor("")}
          fillOpacity="1"
          style={{ cursor: payload.cascade ? "pointer" : "default" }}
        />
        <text
          textAnchor="start"
          x={x + 15}
          y={y + height / 2}
          fontSize={fontSize ? fontSize - 2 : "14"}
          stroke="#333"
          cursor="pointer"
        >
          {t(payload.name)}
        </text>
      </Layer>
    );
  }
}

function ASankeyLink(props: LinkProps & { totalCauses: number }) {
  const {
    targetRelativeY,
    sourceX,
    sourceY,
    sourceControlX,
    targetX,
    targetY,
    targetControlX,
    linkWidth,
    totalCauses,
  } = props;

  const shiftedTargetY =
    totalCauses <= 2
      ? sourceY
      : targetRelativeY + targetY + (baseY - (targetY - linkWidth / 2));

  return (
    <path
      d={`
        M${sourceX},${sourceY}
        C${sourceControlX},${sourceY} ${targetControlX},${shiftedTargetY} ${targetX},${shiftedTargetY}
      `}
      stroke="rgb(102,200,194)"
      fill="none"
      strokeWidth={totalCauses <= 2 ? 600 - 2 * baseY : linkWidth}
      strokeOpacity="0.2"
      pointerEvents="none"
      // {...filterProps(others)}
    />
  );
}

const ActionTooltip = ({
  active,
  payload,
}: TooltipContentProps<ValueType, NameType>) => {
  const { t } = useTranslation();

  if (!payload || payload.length <= 0 || !active) return null;

  const p: ActionSankeyNode = payload[0].payload.payload;

  if (!p.cascade) return null;

  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.9)",
        p: 2,
        border: "1px solid #00000030",
      }}
    >
      {!p.otherActions ? (
        <>
          <Typography variant="subtitle1" color="inherit">
            <u>{t(p.name)}</u>
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
            {t("analysis.cause.explained", {
              percentage: round(100 * p.cascade.p, 2),
            })}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="subtitle1" color="inherit">
            <u>{t("Other causes")}:</u>
          </Typography>

          {p.otherActions.map((h) => (
            <Typography key={h.name} variant="body1" sx={{ mt: 1 }}>
              <b>{t(h.name)}:</b>{" "}
              {t("analysis.action.other.explained", {
                percentage: round(100 * h.p, 2),
              })}
            </Typography>
          ))}
        </>
      )}
    </Box>
  );
};
