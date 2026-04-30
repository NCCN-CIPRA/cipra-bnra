import {
  Layer,
  Rectangle,
  ResponsiveContainer,
  Sankey,
  Tooltip,
  TooltipContentProps,
} from "recharts";
import {
  DVRiskSnapshot,
  parseRiskSnapshot,
} from "../../types/dataverse/DVRiskSnapshot";
import {
  CauseRisksSummary,
  DVRiskSummary,
} from "../../types/dataverse/DVRiskSummary";
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
import { Environment, Indicators } from "../../types/global";
import {
  pScale7FromReturnPeriodMonths,
  pScale7to5,
  returnPeriodMonthsFromYearlyEventRate,
} from "../../functions/indicators/probability";
import { ATTACK_RISKS } from "../../types/dataverse/Riskfile";
import { useQuery } from "@tanstack/react-query";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { parseCascadeSnapshot } from "../../types/dataverse/DVRiskCascade";
import { CascadeSnapshots, getCausesWithDPNew } from "../../functions/cascades";

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
  width?: number | `${number}%`;
  height?: number | `${number}%`;
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

export default function ProbabilitySankey({
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
  results?: RiskFileQuantiResults | null;
  width?: number;
  height?: number;
  tooltip?: boolean;
  onClick: (id: string) => void;
}) {
  const { user, environment } = useOutletContext<BasePageContext>();
  const api = useAPI();

  const { data: publicSnapshots } = useQuery({
    queryKey: [DataTable.RISK_SNAPSHOT],
    queryFn: () => api.getRiskSnapshots(),
    enabled: Boolean(
      user && user.roles.verified && environment === Environment.PUBLIC,
    ),
    select: (data) => data.map((d) => parseRiskSnapshot(d)),
  });
  const { data: publicCauses } = useQuery({
    queryKey: [
      DataTable.CASCADE_SNAPSHOT,
      "causes",
      riskSummary._cr4de_risk_file_value,
    ],
    queryFn: () =>
      api.getCascadeSnapshots(
        `$filter=_cr4de_effect_risk_value eq ${riskSummary._cr4de_risk_file_value}`,
      ),
    enabled: Boolean(
      user &&
      user.roles.verified &&
      environment === Environment.PUBLIC &&
      publicSnapshots !== undefined &&
      riskSnapshot,
    ),
    select: (data) =>
      data.map((d) => ({
        ...parseCascadeSnapshot(d),
        cr4de_cause_risk: publicSnapshots!.find(
          (ps) => ps._cr4de_risk_file_value === d._cr4de_cause_risk_value,
        ) as DVRiskSnapshot,
        cr4de_effect_risk: riskSnapshot,
      })),
  });

  const isAction =
    ATTACK_RISKS.indexOf(riskSnapshot._cr4de_risk_file_value) >= 0;

  let causes: SankeyCause[] = [];

  if (!results && riskSummary.cr4de_causing_risks) {
    if (scenario === riskSummary.cr4de_mrs) {
      causes =
        typeof riskSummary.cr4de_causing_risks === "string"
          ? JSON.parse(riskSummary.cr4de_causing_risks)
          : riskSummary.cr4de_causing_risks;
    } else if (publicCauses !== undefined) {
      const rawCauses = getCausesWithDPNew(
        riskSnapshot,
        {} as CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot>,
        scenario,
        publicCauses,
      ).sort((a, b) => b.p - a.p);

      let minP = 0;
      let cumulP = 0;

      const Ptot = rawCauses.reduce((tot, e) => tot + e.p, 0.000000001);

      for (const c of rawCauses) {
        cumulP += c.p / Ptot;

        if (cumulP >= 0.805) {
          minP = c.p;
          break;
        }
      }

      const selectedCauses = rawCauses
        .filter((c) => c.p >= minP)
        .map((c) => ({
          cause_risk_id: "id" in c ? c.id : "",
          cause_risk_title: "id" in c ? c.name : "No underlying cause",
          cause_risk_p: c.p / Ptot,
        }));
      const otherCauses =
        selectedCauses.length < rawCauses.length
          ? [
              {
                cause_risk_id: "",
                cause_risk_title: "Other causes",
                cause_risk_p:
                  rawCauses
                    .filter((c) => c.p < minP)
                    .reduce((otherP, c) => otherP + c.p, 0) / Ptot,
                other_causes: rawCauses
                  .filter((c) => c.p < minP)
                  .map((c) => ({
                    cause_risk_id: "id" in c ? c.id : "",
                    cause_risk_title:
                      "id" in c ? c.name : "No underlying cause",
                    cause_risk_p: c.p / Ptot,
                  })),
              },
            ]
          : [];

      causes = [...selectedCauses, ...otherCauses];
    }
  } else if (
    results &&
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
        cause_risk_title: isAction ? "Other actors" : "Direct Probability",
        cause_risk_p: 1,
      },
    ];
  }

  const nodes: CauseSankeyNode[] = [
    { name: `risk.${riskSnapshot.cr4de_hazard_id}.name` },
    ...causes.map((c) => ({
      name:
        c.cause_risk_id === "" && c.other_causes === undefined
          ? isAction
            ? "Other actors"
            : "Direct Probability"
          : c.cause_risk_title,
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

  let nodePadding = 0;
  if (data.nodes.length > 2) nodePadding = 100 / (data.nodes.length - 2);
  else if (data.nodes.length >= 1) nodePadding = 100;

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
      nodePadding={nodePadding}
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
      <Layer className="total-probability" key={`causeNode${index}`}>
        <Rectangle
          x={x}
          y={baseY}
          width={width}
          height={totalCauses <= 2 ? 490 : height}
          fill={getCategoryColor("")}
          fillOpacity="1"
        />
        <text
          textAnchor="middle"
          x={-y - (totalCauses <= 2 ? 490 : height) / 2 - 18}
          y={x - 15}
          fontSize={fontSize || "16"}
          stroke="#333"
          transform="rotate(270)"
        >
          {`${t("Total Probability")}:`}{" "}
          <tspan dx={12}>
            {`${
              indicators === Indicators.V1
                ? round(pScale7to5(totalP), 2)
                : round(totalP, 2)
            }`}
          </tspan>
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
            height={totalCauses <= 2 ? 490 : height}
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
          {payload.name.indexOf(".") >= 0 ? t(payload.name) : payload.name}
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
      ? sourceY - 5
      : targetRelativeY + targetY + (baseY - (targetY - linkWidth / 2));
  const shiftedSourceY = totalCauses <= 2 ? shiftedTargetY : sourceY;

  return (
    <path
      d={`
        M${sourceX},${shiftedSourceY}
        C${sourceControlX},${shiftedSourceY} ${targetControlX},${shiftedTargetY} ${targetX},${shiftedTargetY}
      `}
      stroke="rgb(102,200,194)"
      fill="none"
      strokeWidth={totalCauses <= 2 ? 490 : linkWidth}
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
