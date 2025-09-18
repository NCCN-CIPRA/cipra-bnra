import { Layer, Rectangle, ResponsiveContainer, Sankey } from "recharts";
import getCategoryColor from "../../../functions/getCategoryColor";
import { SCENARIOS } from "../../../functions/scenarios";
import round from "../../../functions/roundNumberString";
import { useTranslation } from "react-i18next";
import { JSXElementConstructor } from "react";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../../types/dataverse/DVRiskSnapshot";
import {
  CauseRisksSummary,
  DVRiskSummary,
} from "../../../types/dataverse/DVRiskSummary";

const baseY = 50;

const PSankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  totalProbability,
  totalNodes,
  fontSize,
  CustomTooltip,
  onClick,
  onNavigate,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const { t } = useTranslation();

  if (payload.depth > 0) {
    return (
      <Layer
        className="total-probability"
        key={`CustomNode${index}`}
        height="50px"
      >
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
          y={x - 15}
          fontSize={fontSize || "16"}
          stroke="#333"
          transform="rotate(270)"
        >
          {`${t("Total Probability")}:  ${round(totalProbability, 2)} / 5`}
        </text>
      </Layer>
    );
  } else {
    return (
      <Layer className="probability-cause" key={`CustomNode${index}`}>
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
            totalProbability={totalProbability}
            fontSize={fontSize}
            onClick={onClick}
          />
        ) : (
          <text
            textAnchor="start"
            x={x + 15}
            y={y + height / 2}
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
const PSankeyLink = (props: any) => {
  const {
    targetRelativeY,
    sourceX,
    sourceY,
    sourceControlX,
    targetX,
    targetY,
    targetControlX,
    linkWidth,
    totalNodes,
  } = props;

  const shiftedTargetY =
    totalNodes <= 2
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
      strokeWidth={totalNodes <= 2 ? 600 - 2 * baseY : linkWidth}
      strokeOpacity="0.2"
      // {...filterProps(others)}
    />
  );
};

export default function ProbabilitySankyChart({
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
  maxCauses?: number | null;
  minCausePortion?: number | null;
  shownCausePortion?: number | null;
  scenario: SCENARIOS;
  debug?: boolean;
  manmade?: boolean;
  width?: number | string;
  height?: number | string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CustomTooltip?: JSXElementConstructor<any>;
  onClick?: ((id: string) => void) | null;
  onNavigate?: (id: string) => void;
}) {
  if (!riskSummary || !riskFile) return null;

  const causes = JSON.parse(
    riskSummary.cr4de_causing_risks as string
  ) as CauseRisksSummary[];

  // let minP = 0;

  // if (maxCauses !== null) {
  //   minP =
  //     maxCauses === null || causes.length <= maxCauses
  //       ? -1
  //       : causes.sort((a, b) => b.p - a.p)[
  //           Math.min(maxCauses - 1, causes.length - 1)
  //         ].p;
  // } else if (minCausePortion !== null) {
  //   const Ptot = causes.reduce((tot, c) => tot + c.p, 0.000000001);
  //   minP = minCausePortion * Ptot;
  // } else if (shownCausePortion !== null) {
  //   const Ptot = causes.reduce((tot, c) => tot + c.p, 0.000000001);

  //   let cumulP = 0;
  //   for (const c of causes.sort((a, b) => b.p - a.p)) {
  //     cumulP += c.p / Ptot;

  //     if (cumulP >= shownCausePortion) {
  //       minP = c.p;
  //       break;
  //     }
  //   }
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = [
    { name: `risk.${riskFile.cr4de_hazard_id}.name` },
    ...causes.map((c) => ({
      name: c.cause_risk_title,
      cascade: c,
      hidden: c.other_causes || undefined,
    })),
  ];
  // console.log(nodes);
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const otherCauses = causes.filter((c: any) => c.p < minP);

  // if (minP >= 0 && otherCauses.length > 0) {
  //   nodes.push({
  //     name: "Other",
  //     hidden: otherCauses,
  //   });
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links: any[] = causes.map((e, i: number) => ({
    source: i + 1,
    target: 0,
    value: Math.max(0.000000001, e.cause_risk_p),
  }));
  // if (minP > 0 && otherCauses.length > 0)
  //   links.push({
  //     source: nodes.length - 1,
  //     target: 0,
  //     value: causes
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       .filter((e: any) => e.p < minP)
  //       .reduce((tot, e) => tot + e.p, 0.000000001),
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     hidden: causes.filter((e: any) => e.p < minP),
  //   });

  const data = {
    nodes,
    links,
  };

  if (typeof width === "string" || typeof height === "string") {
    return (
      <ResponsiveContainer width={width} height={height}>
        <Sankey
          data={data}
          node={
            <PSankeyNode
              onClick={onClick}
              totalProbability={riskFile.cr4de_quanti[scenario].tp.yearly.scale}
              totalNodes={data.nodes.length}
              showComponents={debug}
              scenarioSuffix={scenario}
              CustomTooltip={CustomTooltip}
              onNavigate={onNavigate}
            />
          }
          link={<PSankeyLink totalNodes={data.nodes.length} />}
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
        <PSankeyNode
          onClick={onClick}
          totalProbability={riskFile.cr4de_quanti[scenario].tp.yearly.scale}
          totalNodes={data.nodes.length}
          showComponents={debug}
          scenarioSuffix={scenario}
          fontSize={22}
          CustomTooltip={CustomTooltip}
          onNavigate={onNavigate}
        />
      }
      link={<PSankeyLink totalNodes={data.nodes.length} />}
      nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
      iterations={0}
    ></Sankey>
  );
}
