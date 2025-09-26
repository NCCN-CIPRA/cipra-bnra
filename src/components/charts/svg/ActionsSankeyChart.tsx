import { Layer, Rectangle, ResponsiveContainer, Sankey } from "recharts";
import getCategoryColor from "../../../functions/getCategoryColor";
import { SCENARIOS, getScenarioSuffix } from "../../../functions/scenarios";
import round from "../../../functions/roundNumberString";
import { useTranslation } from "react-i18next";
import { CascadeSnapshots } from "../../../functions/cascades";
import { JSXElementConstructor } from "react";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";

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
          fontSize="16"
          stroke="#333"
          transform="rotate(270)"
        >
          {`${t("Preferred Malicious Actions")}:  ${round(
            totalProbability,
            2
          )} / 5`}
        </text>
        {/* <text
          textAnchor="middle"
          x={-y - height / 2 - 18}
          y={x - 15}
          fontSize="16"
          stroke="#333"
          transform="rotate(270)"
        >
          Total Probability:{" "}
          {`${round(100 * getYearlyProbability(totalProbability))}% / year (${round(
            100 * totalProbability,
            3
          )}% / day)`}
        </text> */}
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

export default function ActionsSankeyChart({
  riskFile = null,
  cascades = null,
  maxActions = null,
  minActionPortion = null,
  shownActionPortion = null,
  scenario,
  debug = false,
  width = "100%",
  height = "100%",
  CustomTooltip,
  onClick = null,
  onNavigate,
}: {
  riskFile?: DVRiskSnapshot | null;
  cascades?: CascadeSnapshots<DVRiskSnapshot, DVRiskSnapshot> | null;
  maxActions?: number | null;
  minActionPortion?: number | null;
  shownActionPortion?: number | null;
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
  if (!riskFile || !cascades) return null;

  const scenarioSuffix: string = getScenarioSuffix(scenario);

  const actions = cascades.effects
    .map((e) => ({
      id: e.cr4de_effect_risk._cr4de_risk_file_value,
      name: `risk.${e.cr4de_effect_risk.cr4de_hazard_id}.name`,
      cascade: e,
      cp: e.cr4de_quanti_cp[scenario].avg,
    }))
    .sort((a, b) => b.cp - a.cp);

  let minP = 0;
  const totP = actions.reduce((p, e) => p + e.cp, 0.00000001);

  if (maxActions !== null) {
    minP = actions[Math.min(maxActions - 1, actions.length - 1)].cp;
  } else if (minActionPortion !== null) {
    minP = minActionPortion * totP;
  } else if (shownActionPortion !== null) {
    let cumulP = 0;
    for (const c of actions) {
      cumulP += c.cp / totP;

      if (cumulP >= shownActionPortion) {
        minP = c.cp;
        break;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = [
    { name: `risk.${riskFile.cr4de_hazard_id}.name` },
    ...actions.filter((c) => c.cp >= minP),
  ];
  const otherActions = actions.filter((e) => e.cp < minP);

  if (minP >= 0 && otherActions.length > 0) {
    nodes.push({
      name: "Other Actions",
      hidden: otherActions,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const links: any[] = actions
    .filter((e) => e.cp >= minP)
    .map((e, i: number) => ({
      source: i + 1,
      target: 0,
      value: Math.max(0.000000001, e.cp),
    }));
  if (minP > 0 && otherActions.length > 0)
    links.push({
      source: nodes.length - 1,
      target: 0,
      value: actions
        .filter((e) => e.cp < minP)
        .reduce((tot, e) => tot + e.cp, 0.000000001),
      hidden: actions.filter((e) => e.cp < minP),
    });

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
            <PSankeyNode
              onClick={onClick}
              totalProbability={totP}
              totalNodes={data.nodes.length}
              showComponents={debug}
              scenarioSuffix={scenarioSuffix}
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
          totalProbability={totP}
          totalNodes={data.nodes.length}
          showComponents={debug}
          scenarioSuffix={scenarioSuffix}
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
