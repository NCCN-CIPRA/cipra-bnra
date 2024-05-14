import { Layer, Rectangle, ResponsiveContainer, Sankey, TooltipProps } from "recharts";
import { Box, Typography, Card, CardContent, Tooltip } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { useNavigate } from "react-router-dom";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { CascadeCalculation, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { SCENARIOS, Scenarios, getScenarioSuffix } from "../../functions/scenarios";
import { getYearlyProbability } from "../../functions/Probability";

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
          {`${Math.round(10000 * getYearlyProbability(totalProbability)) / 100}% / year (${
            Math.round(100000 * totalProbability) / 1000
          }% / day)`}
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

        {showComponents ? (
          <Tooltip
            title={
              <Box sx={{}}>
                {payload.cascade && (
                  <>
                    <Typography color="inherit">{payload.name}</Typography>

                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      IP(all&rarr;{scenarioLetter}):{" "}
                      {Math.round(1000000 * payload.cascade[`ip_${scenarioLetter}`]) / 10000}% / day
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      TP(c): {Math.round(1000000 * payload.cascade.cause.tp_c) / 10000}% / day
                    </Typography>
                    <Typography variant="subtitle2">
                      CP(c&rarr;{scenarioLetter}): {Math.round(10000 * payload.cascade[`c2${scenarioLetter}`]) / 100}%
                    </Typography>
                    <Typography variant="subtitle2">
                      IP(c&rarr;{scenarioLetter}):{" "}
                      {Math.round(1000000 * payload.cascade.cause.tp_c * payload.cascade[`c2${scenarioLetter}`]) /
                        10000}
                      % / day
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      TP(m): {Math.round(1000000 * payload.cascade.cause.tp_m) / 10000}% / day
                    </Typography>
                    <Typography variant="subtitle2">
                      CP(m&rarr;{scenarioLetter}): {Math.round(10000 * payload.cascade[`m2${scenarioLetter}`]) / 100}%
                    </Typography>
                    <Typography variant="subtitle2">
                      IP(m&rarr;{scenarioLetter}):{" "}
                      {Math.round(1000000 * payload.cascade.cause.tp_m * payload.cascade[`m2${scenarioLetter}`]) /
                        10000}
                      % / day
                    </Typography>

                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      TP(e): {Math.round(1000000 * payload.cascade.cause.tp_e) / 10000}% / day
                    </Typography>
                    <Typography variant="subtitle2">
                      CP(e&rarr;{scenarioLetter}): {Math.round(10000 * payload.cascade[`e2${scenarioLetter}`]) / 100}%
                    </Typography>
                    <Typography variant="subtitle2">
                      IP(e&rarr;{scenarioLetter}):{" "}
                      {Math.round(1000000 * payload.cascade.cause.tp_e * payload.cascade[`e2${scenarioLetter}`]) /
                        10000}
                      % / day
                    </Typography>
                  </>
                )}
                {payload.hidden && (
                  <>
                    <Typography color="inherit">Other causes:</Typography>

                    {payload.hidden.map((h: any) => (
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        {h.cause.riskTitle} IP(all&rarr;{scenarioLetter}): {Math.round(1000000 * h.ip) / 10000}% / day
                      </Typography>
                    ))}
                  </>
                )}
                {!payload.cascade && !payload.hidden && (
                  <>
                    <Typography color="inherit">{payload.name}</Typography>

                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      DP({scenarioLetter}): {Math.round(1000000 * payload.p) / 10000}% / day
                    </Typography>
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
        ) : (
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
        )}
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

export default function ProbabilitySankey({
  riskFile = null,
  calculation,
  maxCauses = null,
  minCausePortion = null,
  shownCausePortion = null,
  scenario,
  debug = false,
  manmade = false,
  onClick = null,
}: {
  riskFile?: DVRiskFile | null;
  calculation: RiskCalculation | null;
  maxCauses?: number | null;
  minCausePortion?: number | null;
  shownCausePortion?: number | null;
  scenario: SCENARIOS;
  debug?: boolean;
  manmade?: boolean;
  onClick?: ((id: string) => void) | null;
}) {
  if (!calculation) return null;

  const scenarioSuffix: string = getScenarioSuffix(scenario);

  const causes = [
    {
      name: manmade ? "Motivation" : "Direct Probability",
      p: calculation[`dp${scenarioSuffix}` as keyof RiskCalculation] as number,
    },
    ...(manmade
      ? []
      : calculation.causes.map((c) => ({
          id: c.cause.riskId,
          name: c.cause.riskTitle,
          p: c[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number,
          cascade: c,
        }))),
  ];

  let minP = 0;

  if (manmade) {
    minP = -1;
  } else if (maxCauses !== null) {
    minP =
      maxCauses === null || causes.length <= maxCauses
        ? -1
        : causes.sort((a, b) => b.p - a.p)[Math.min(maxCauses - 1, causes.length - 1)].p;
  } else if (minCausePortion !== null) {
    const Ptot = causes.reduce((tot, c) => tot + c.p, 0.000000001);
    minP = minCausePortion * Ptot;
  } else if (shownCausePortion !== null) {
    const Ptot = causes.reduce((tot, c) => tot + c.p, 0.000000001);

    let cumulP = 0;
    for (let c of causes.sort((a, b) => b.p - a.p)) {
      cumulP += c.p / Ptot;

      if (cumulP >= shownCausePortion) {
        minP = c.p;
        break;
      }
    }
  }

  const nodes: any[] = [{ name: calculation.riskTitle }, ...causes.filter((c) => c.p >= minP)];
  if (minP >= 0 && !manmade)
    nodes.push({
      name: "Other",
      hidden: calculation.causes.filter(
        (e: any, i: number) => (e[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number) < minP
      ),
    });

  const links: any[] = causes
    .filter((e) => e.p >= minP)
    .map((e, i: number) => ({
      source: i + 1,
      target: 0,
      value: Math.max(0.000000001, e.p),
    }));
  if (minP > 0)
    links.push({
      source: nodes.length - 1,
      target: 0,
      value: calculation.causes
        .filter((e: any, i: number) => (e[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number) < minP)
        .reduce((tot, e) => tot + (e[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number), 0.000000001),
      hidden: calculation.causes.filter(
        (e: any, i: number) => (e[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number) < minP
      ),
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
        <Typography variant="h6">Probability Breakdown</Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={
            <PSankeyNode
              onClick={onClick}
              totalProbability={calculation[`tp${scenarioSuffix}` as keyof RiskCalculation] as number}
              totalNodes={data.nodes.length}
              showComponents={debug}
              scenarioSuffix={scenarioSuffix}
            />
          }
          link={<PSankeyLink totalNodes={data.nodes.length} />}
          nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
        ></Sankey>
      </ResponsiveContainer>
    </>
  );
}
