import { Layer, Rectangle, ResponsiveContainer, Sankey, TooltipProps } from "recharts";
import { Box, Typography, Card, CardContent, Tooltip } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { useNavigate } from "react-router-dom";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { CascadeCalculation, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { SCENARIOS, Scenarios, getScenarioLetter, getScenarioSuffix } from "../../functions/scenarios";
import { getYearlyProbability } from "../../functions/Probability";
import round from "../../functions/roundNumberString";
import { getAverageCP } from "../../functions/cascades";

const baseY = 50;

const PSankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
  totalProbability,
  totalNodes,
  scenarioSuffix,
  showComponents,
  onClick,
}: any) => {
  const navigate = useNavigate();
  const scenarioLetter = scenarioSuffix[1];

  if (payload.depth > 0) {
    return (
      <Layer key={`CustomNode${index}`} height="50px">
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
          Total Probability:{" "}
          {`${round(100 * getYearlyProbability(totalProbability))}% / year (${round(
            100 * totalProbability,
            3
          )}% / day)`}
        </text>
      </Layer>
    );
  } else {
    return (
      <Layer key={`CustomNode${index}`}>
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

            navigate(`/reporting/${payload.id}`);
          }}
        />

        <Tooltip
          title={
            <Box sx={{}}>
              {payload.cascade && (
                <>
                  <Typography color="inherit">{payload.name}</Typography>

                  {showComponents && (
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      CP: {round(100 * payload.cpAvg, 2)}% / event
                    </Typography>
                  )}
                  <Typography variant="subtitle1" sx={{ mt: 0 }}>
                    Relative Preference: {round((100 * payload.cpAvg) / totalProbability, 2)}%
                  </Typography>
                </>
              )}
              {payload.hidden && (
                <>
                  <Typography color="inherit">Other actions:</Typography>

                  {payload.hidden.map((h: any) => (
                    <>
                      <Typography key={h.name} variant="subtitle2" sx={{ mt: 1 }}>
                        {h.name}
                      </Typography>
                      {showComponents && (
                        <Typography key={h.name} variant="subtitle1" sx={{ mt: 0, ml: 1 }}>
                          CP: {round(100 * h.cpAvg, 2)}% / event
                        </Typography>
                      )}
                      <Typography variant="subtitle1" sx={{ mt: 0, ml: 1 }}>
                        Relative Preference: {round((100 * h.cpAvg) / totalProbability, 2)}%
                      </Typography>
                    </>
                  ))}
                </>
              )}
            </Box>
          }
        >
          <text
            textAnchor="start"
            x={x + 15}
            y={y + height / 2}
            fontSize="14"
            stroke="#333"
            cursor="pointer"
            onClick={() => {
              if (!payload.id) return;

              if (onClick) return onClick(payload.id);

              navigate(`/reporting/${payload.id}`);
            }}
          >
            {payload.name}
          </text>
        </Tooltip>
        {/* <text textAnchor="start" x={x + 15} y={y + height / 2 + 18} fontSize="12" stroke="#333" strokeOpacity="0.5">
          {`${Math.round((100 * payload.value) / totalProbability)}%`}
        </text> */}
      </Layer>
    );
  }
};

const PSankeyLink = (props: any) => {
  const {
    index,
    targetRelativeY,
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

  const shiftedTargetY = totalNodes <= 2 ? sourceY : targetRelativeY + targetY + (baseY - (targetY - linkWidth / 2));

  return (
    <path
      d={`
        M${sourceX},${sourceY}
        C${sourceControlX},${sourceY} ${targetControlX},${shiftedTargetY} ${targetX},${shiftedTargetY}
      `}
      stroke="rgb(0, 164, 154, 0.6)"
      fill="none"
      strokeWidth={totalNodes <= 2 ? 600 - 2 * baseY : linkWidth}
      strokeOpacity="0.2"
      // {...filterProps(others)}
    />
  );
};

export default function ActionsSankey({
  riskFile = null,
  calculation,
  maxActions = null,
  minActionPortion = null,
  shownActionPortion = null,
  scenario,
  debug = false,
  manmade = false,
  onClick = null,
}: {
  riskFile?: DVRiskFile | null;
  calculation: RiskCalculation | null;
  maxActions?: number | null;
  minActionPortion?: number | null;
  shownActionPortion?: number | null;
  scenario: SCENARIOS;
  debug?: boolean;
  manmade?: boolean;
  onClick?: ((id: string) => void) | null;
}) {
  if (!calculation) return null;

  const scenarioLetter = getScenarioLetter(scenario);
  const scenarioSuffix: string = getScenarioSuffix(scenario);

  const actions = calculation.effects
    .map((e) => ({
      id: e.effect.riskId,
      name: e.effect.riskTitle,
      cascade: e,
      cpAvg: getAverageCP(scenarioLetter, e),
    }))
    .sort((a, b) => b.cpAvg - a.cpAvg);

  let minP = 0;
  const totP = actions.reduce((p, e) => p + e.cpAvg, 0.00000001);

  if (maxActions !== null) {
    minP = actions[Math.min(maxActions - 1, actions.length - 1)].cpAvg;
  } else if (minActionPortion !== null) {
    minP = minActionPortion * totP;
  } else if (shownActionPortion !== null) {
    let cumulP = 0;
    for (let c of actions) {
      cumulP += c.cpAvg / totP;

      if (cumulP >= shownActionPortion) {
        minP = c.cpAvg;
        break;
      }
    }
  }

  const nodes: any[] = [{ name: calculation.riskTitle }, ...actions.filter((c) => c.cpAvg >= minP)];
  const otherActions = actions.filter((e) => e.cpAvg < minP);

  if (minP >= 0 && otherActions.length > 0) {
    nodes.push({
      name: "Other Actions",
      hidden: otherActions,
    });
  }

  const links: any[] = actions
    .filter((e) => e.cpAvg >= minP)
    .map((e, i: number) => ({
      source: i + 1,
      target: 0,
      value: Math.max(0.000000001, e.cpAvg),
    }));
  if (minP > 0 && otherActions.length > 0)
    links.push({
      source: nodes.length - 1,
      target: 0,
      value: actions.filter((e) => e.cpAvg < minP).reduce((tot, e) => tot + e.cpAvg, 0.000000001),
      hidden: actions.filter((e) => e.cpAvg < minP),
    });

  const data = {
    nodes,
    links,
  };

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload) {
      if (payload[0].payload?.payload?.hidden) {
        return (
          <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
            <CardContent>
              {payload[0].payload?.payload?.hidden
                .sort(
                  (a: CascadeCalculation, b: CascadeCalculation) =>
                    (b[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number) -
                    (a[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number)
                )
                .slice(0, 10)
                .map((c: CascadeCalculation) => (
                  <Box sx={{ margin: 0, padding: 0 }}>
                    {`${c.cause.riskTitle}:`}{" "}
                    <b>{`${
                      Math.round(
                        (10000 * (c[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number)) /
                          (calculation[`tp${scenarioSuffix}` as keyof RiskCalculation] as number)
                      ) / 100
                    }%`}</b>
                  </Box>
                ))}
            </CardContent>
          </Card>
        );
      }
    }

    return null;
  };

  return (
    <>
      <Box sx={{ width: "100%", mb: 2 }}>
        <Typography variant="h6">Preferred Malicious Actions</Typography>
      </Box>
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
            />
          }
          link={<PSankeyLink totalNodes={data.nodes.length} />}
          nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
          iterations={0}
        ></Sankey>
      </ResponsiveContainer>
    </>
  );
}