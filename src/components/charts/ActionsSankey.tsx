import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
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
import {
  CauseRisksSummary,
  DVRiskSummary,
} from "../../types/dataverse/DVRiskSummary";
import { RiskFileQuantiResults } from "../../types/dataverse/DVRiskFile";

export type ActionSankeyNode = {
  name: string;
  cascade?: SankeyAction;
  otherActions?: SankeyAction[];
};

type SankeyAction = CauseRisksSummary & {
  parts?: {
    considerable?: number;
    major?: number;
    extreme?: number;
  };
};

const baseY = 50;

export function ActionsSankeyBox({
  riskSummary,
  riskSnapshot,
  scenario,
  results,
  width = "100%",
  height = "100%",
  onClick,
}: {
  riskSummary: DVRiskSummary;
  riskSnapshot: DVRiskSnapshot;
  scenario: SCENARIOS;
  results: RiskFileQuantiResults | null;
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
          riskSummary={riskSummary}
          riskSnapshot={riskSnapshot}
          scenario={scenario}
          results={results}
          tooltip={true}
          onClick={onClick}
        />
      </ResponsiveContainer>
    </>
  );
}

export default function ActionsSankey({
  riskSummary,
  riskSnapshot,
  scenario,
  results,
  width,
  height,
  tooltip = true,
  onClick,
}: {
  riskSummary: DVRiskSummary;
  riskSnapshot: DVRiskSnapshot;
  scenario: SCENARIOS;
  results: RiskFileQuantiResults | null;
  width?: number;
  height?: number;
  tooltip?: boolean;
  onClick: (id: string) => void;
}) {
  let actions: SankeyAction[] = [];
  console.log(results);
  if (!results && riskSummary.cr4de_causing_risks) {
    actions =
      typeof riskSummary.cr4de_causing_risks === "string"
        ? JSON.parse(riskSummary.cr4de_causing_risks)
        : riskSummary.cr4de_causing_risks;
  } else if (
    results &&
    (results[scenario].impactStatistics?.effectProbabilities?.length || 0) > 0
  ) {
    const sums =
      results[scenario].impactStatistics?.effectProbabilities.reduce(
        (acc, c) => ({
          ...acc,
          [c.id || ""]: {
            cause_risk_id: c.id || "",
            cause_risk_title: c.risk,
            cause_risk_p:
              (acc[c.id || ""]?.cause_risk_p || 0) + c.probabilityMean,
            parts: {
              ...(acc[c.id || ""]?.parts || {}),
              [c.scenario || "considerable"]: c.probabilityMean,
            },
          },
        }),
        {} as Record<string, SankeyAction>,
      ) || {};

    actions = Object.values(sums)
      .sort((a, b) => b.cause_risk_p - a.cause_risk_p)
      .reduce(
        (acc, c) => {
          if (acc.totalP > 0.8) {
            let lastCause = acc.causes[acc.causes.length - 1];
            if (!lastCause.other_causes) {
              lastCause = {
                cause_risk_id: "",
                cause_risk_title: "Other causes",
                cause_risk_p: 0,
                other_causes: [],
              };
              acc.causes.push(lastCause);
            }

            lastCause.other_causes!.push({
              ...c,
            });
            lastCause.cause_risk_p += c.cause_risk_p;

            return acc;
          }

          return {
            causes: [...acc.causes, c],
            totalP: acc.totalP + c.cause_risk_p,
          };
        },
        { causes: [] as CauseRisksSummary[], totalP: 0 },
      ).causes;
  } else {
    actions = [
      {
        cause_risk_id: "",
        cause_risk_title: "Direct Probability",
        cause_risk_p: 1,
      },
    ];
  }

  const nodes: ActionSankeyNode[] = [
    { name: `risk.${riskSnapshot.cr4de_hazard_id}.name` },
    ...actions.map((a) => ({
      name: a.cause_risk_title,
      cascade: a,
      otherActions: a.other_causes || undefined,
    })),
  ];

  const data: SankeyData & { nodes: ActionSankeyNode[] } = {
    nodes,
    links: actions.map((e, i: number) => ({
      source: i + 1,
      target: 0,
      value: Math.max(0.000000001, e.cause_risk_p),
    })),
  };

  let nodePadding = 0;
  if (data.nodes.length > 2) nodePadding = 100 / (data.nodes.length - 2);
  else if (data.nodes.length >= 1) nodePadding = 100;

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
        nodePadding={nodePadding}
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
          if (!payload.cascade?.cause_risk_id) return;

          if (onNavigate) return onNavigate(payload.cascade.cause_risk_id);
        }}
      >
        {payload.cascade?.parts && payload.cascade.cause_risk_id !== "" ? (
          <>
            <Rectangle
              x={x}
              y={totalCauses <= 2 ? baseY : y}
              width={width}
              height={
                ((totalCauses <= 2 ? 490 : height) *
                  (payload.cascade.parts.considerable || 0)) /
                payload.cascade.cause_risk_p
              }
              fill={SCENARIO_PARAMS["considerable"].color}
              fillOpacity="1"
              style={{ cursor: payload.cascade ? "pointer" : "default" }}
            />
            <Rectangle
              x={x}
              y={
                (totalCauses <= 2 ? baseY : y) +
                ((totalCauses <= 2 ? 490 : height) *
                  (payload.cascade.parts.considerable || 0)) /
                  payload.cascade.cause_risk_p
              }
              width={width}
              height={
                ((totalCauses <= 2 ? 490 : height) *
                  (payload.cascade.parts.major || 0)) /
                payload.cascade.cause_risk_p
              }
              fill={SCENARIO_PARAMS["major"].color}
              fillOpacity="1"
              style={{ cursor: payload.cascade ? "pointer" : "default" }}
            />
            <Rectangle
              x={x}
              y={
                (totalCauses <= 2 ? baseY : y) +
                ((totalCauses <= 2 ? 490 : height) *
                  ((payload.cascade.parts.considerable || 0) +
                    (payload.cascade.parts.major || 0))) /
                  payload.cascade.cause_risk_p
              }
              width={width}
              height={
                ((totalCauses <= 2 ? 490 : height) *
                  (payload.cascade.parts.extreme || 0)) /
                payload.cascade.cause_risk_p
              }
              fill={SCENARIO_PARAMS["extreme"].color}
              fillOpacity="1"
              style={{ cursor: payload.cascade ? "pointer" : "default" }}
            />
          </>
        ) : (
          <Rectangle
            x={x}
            y={totalCauses <= 2 ? baseY : y}
            width={width}
            height={totalCauses <= 2 ? 600 - 2 * baseY : height}
            fill={getCategoryColor("")}
            fillOpacity="1"
            style={{ cursor: payload.cascade ? "pointer" : "default" }}
          />
        )}
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
            If this actor group were to successfully carry out a malicious
            action, there is an estimated{" "}
            <b>{round(100 * p.cascade.cause_risk_p, 2)}%</b> chance it would be{" "}
            <i>{t(p.name)}</i>
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="subtitle1" color="inherit">
            <u>{t("Other causes")}:</u>
          </Typography>

          {p.otherActions.map((h) => (
            <Typography key={h.cause_risk_id} variant="body1" sx={{ mt: 1 }}>
              <b>{t(h.cause_risk_title)}</b>{" "}
              {t("analysis.action.other.explained", {
                percentage: round(100 * h.cause_risk_p, 2),
              })}
            </Typography>
          ))}
        </>
      )}
    </Box>
  );
};
