import {
  Layer,
  Rectangle,
  ResponsiveContainer,
  Sankey,
  Tooltip,
  TooltipContentProps,
} from "recharts";
import { CascadeSnapshots, getCauseSummaries } from "../../functions/cascades";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { CauseRisksSummary } from "../../types/dataverse/DVRiskSummary";
import { LinkProps, NodeProps, SankeyData } from "recharts/types/chart/Sankey";
import { SCENARIO_PARAMS, SCENARIOS } from "../../functions/scenarios";
import round from "../../functions/roundNumberString";
import getCategoryColor from "../../functions/getCategoryColor";
import { useTranslation } from "react-i18next";
import { Box, Typography } from "@mui/material";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { RiskFileQuantiResults } from "../../types/dataverse/DVRiskFile";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../../pages/BasePage";
import { Indicators } from "../../types/global";
import {
  pScale7FromReturnPeriodMonths,
  pScale7to5,
  returnPeriodMonthsFromYearlyEventRate,
} from "../../functions/indicators/probability";

export type CauseSankeyNode = {
  name: string;
  cascade?: SankeyCause;
  otherCauses?: SankeyCause[];
};

type SankeyCause = CauseRisksSummary & {
  parts?: {
    considerable?: number;
    major?: number;
    extreme?: number;
  };
};

const baseY = 50;

export function ProbabilitySankeyBox({
  riskSnapshot,
  cascades,
  scenario,
  results,
  width = "100%",
  height = "100%",
  onClick,
}: {
  riskSnapshot: DVRiskSnapshot;
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>;
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
        <Typography variant="h6">{t("Probability Breakdown")}</Typography>
      </Box>
      <ResponsiveContainer width={width} height={height}>
        <ProbabilitySankey
          riskSnapshot={riskSnapshot}
          cascades={cascades}
          scenario={scenario}
          results={results}
          tooltip={true}
          onClick={onClick}
        />
      </ResponsiveContainer>
    </>
  );
}

export default function ProbabilitySankey({
  riskSnapshot,
  cascades,
  scenario,
  results,
  width,
  height,
  tooltip = true,
  onClick,
}: {
  riskSnapshot: DVRiskSnapshot;
  cascades: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>;
  scenario: SCENARIOS;
  results?: RiskFileQuantiResults | null;
  width?: number;
  height?: number;
  tooltip?: boolean;
  onClick: (id: string) => void;
}) {
  let causes: SankeyCause[] = [];

  if (!results) {
    causes = getCauseSummaries(riskSnapshot, cascades, scenario, true);
  } else if (
    (results[scenario].probabilityStatistics?.relativeContributions?.length ||
      0) > 0
  ) {
    const sums =
      results[scenario].probabilityStatistics?.relativeContributions.reduce(
        (acc, c) => ({
          ...acc,
          [c.id || ""]: {
            cause_risk_id: c.id || "",
            cause_risk_title: c.risk,
            cause_risk_p:
              (acc[c.id || ""]?.cause_risk_p || 0) + c.contributionMean,
            parts: {
              ...(acc[c.id || ""]?.parts || {}),
              [c.scenario || "considerable"]: c.contributionMean,
            },
          },
        }),
        {} as Record<string, SankeyCause>,
      ) || {};

    causes = Object.values(sums)
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
    causes = [
      {
        cause_risk_id: "",
        cause_risk_title: "Direct Probability",
        cause_risk_p: 1,
      },
    ];
  }

  const nodes: CauseSankeyNode[] = [
    { name: `risk.${riskSnapshot.cr4de_hazard_id}.name` },
    ...causes.map((c) => ({
      name: c.cause_risk_title,
      cascade: c,
      otherCauses: c.other_causes || undefined,
    })),
  ];

  const data: SankeyData & { nodes: CauseSankeyNode[] } = {
    nodes,
    links: causes.map((e, i: number) => ({
      source: i + 1,
      target: 0,
      value: Math.max(0.000000001, e.cause_risk_p),
    })),
  };

  return (
    <Sankey
      width={width}
      height={height}
      data={data}
      node={(props: NodeProps & { payload: CauseSankeyNode }) => (
        <PSankeyNode
          {...props}
          totalCauses={data.nodes.length}
          totalP={
            results
              ? pScale7FromReturnPeriodMonths(
                  returnPeriodMonthsFromYearlyEventRate(
                    results[scenario].probabilityStatistics?.sampleMean || 0,
                  ),
                )
              : riskSnapshot.cr4de_quanti[scenario].tp.yearly.scale
          }
          fontSize={14}
          onNavigate={onClick}
        />
      )}
      link={(props: LinkProps) => (
        <PSankeyLink {...props} totalCauses={data.nodes.length} />
      )}
      // Disable sorting  the nodes
      iterations={0}
      // More spacing between nodes
      nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
    >
      {tooltip && <Tooltip content={CauseTooltip} />}
    </Sankey>
  );
}

function PSankeyNode({
  index,
  payload,
  x,
  y,
  width,
  height,
  totalCauses,
  totalP,
  fontSize,
  onNavigate,
}: NodeProps & {
  payload: CauseSankeyNode;
  totalCauses: number;
  totalP: number;
  fontSize: number;
  onNavigate?: (riskId: string) => void;
}) {
  const { indicators } = useOutletContext<BasePageContext>();
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
        <text
          textAnchor="middle"
          x={-y - height / 2 - 18}
          y={x - 15}
          fontSize={fontSize || "16"}
          stroke="#333"
          transform="rotate(270)"
        >
          {`${t("Total Probability")}:  ${
            indicators === Indicators.V1
              ? round(pScale7to5(totalP), 2)
              : round(totalP, 2)
          } / ${indicators === Indicators.V1 ? 5 : 7}`}
        </text>
      </Layer>
    );
  } else {
    return (
      <Layer
        className="probability-cause"
        key={`CustomNode${index}`}
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
                ((totalCauses <= 2 ? 600 - 2 * baseY : height) *
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
                ((totalCauses <= 2 ? 600 - 2 * baseY : height) *
                  (payload.cascade.parts.considerable || 0)) /
                  payload.cascade.cause_risk_p
              }
              width={width}
              height={
                ((totalCauses <= 2 ? 600 - 2 * baseY : height) *
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
                ((totalCauses <= 2 ? 600 - 2 * baseY : height) *
                  ((payload.cascade.parts.considerable || 0) +
                    (payload.cascade.parts.major || 0))) /
                  payload.cascade.cause_risk_p
              }
              width={width}
              height={
                ((totalCauses <= 2 ? 600 - 2 * baseY : height) *
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

function PSankeyLink(props: LinkProps & { totalCauses: number }) {
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

const CauseTooltip = ({
  active,
  payload,
}: TooltipContentProps<ValueType, NameType>) => {
  const { t } = useTranslation();

  if (!payload || payload.length <= 0 || !active) return null;

  const p: CauseSankeyNode = payload[0].payload.payload;

  if (!p.cascade) return null;

  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.9)",
        p: 2,
        border: "1px solid #00000030",
      }}
    >
      {!p.otherCauses ? (
        <>
          <Typography variant="subtitle1" color="inherit">
            <u>{t(p.name)}</u>
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
            {t("analysis.cause.explained", {
              percentage: round(100 * p.cascade.cause_risk_p, 2),
            })}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="subtitle1" color="inherit">
            <u>{t("Other causes")}</u>:
          </Typography>

          {p.otherCauses.map((h: CauseRisksSummary) => (
            <Typography
              key={`${h.cause_risk_title}-${p.cascade?.cause_risk_id}`}
              variant="body1"
              sx={{ mt: 1 }}
            >
              <b>{t(h.cause_risk_title)}:</b>{" "}
              {t("analysis.cause.other.explained", {
                percentage: round(100 * h.cause_risk_p, 2),
              })}
            </Typography>
          ))}
        </>
      )}
    </Box>
  );
};
