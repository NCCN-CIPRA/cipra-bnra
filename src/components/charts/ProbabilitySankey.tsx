import { Layer, Rectangle, ResponsiveContainer, Sankey, Tooltip, TooltipProps } from "recharts";
import { Box, Typography, Card, CardContent } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { useNavigate } from "react-router-dom";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { CascadeCalculation, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { SCENARIOS, Scenarios } from "../../functions/scenarios";

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
  onClick,
}: any) => {
  const navigate = useNavigate();

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
          fontSize="12"
          stroke="#333"
          transform="rotate(270)"
        >
          {`${Math.round(100000 * totalProbability) / 1000} % chance of occurence within 3 years`}
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
        <text textAnchor="start" x={x + 15} y={y + height / 2} fontSize="14" stroke="#333">
          {payload.name}
        </text>
        <text textAnchor="start" x={x + 15} y={y + height / 2 + 18} fontSize="12" stroke="#333" strokeOpacity="0.5">
          {`${Math.round((100 * payload.value) / totalProbability)}%`}
        </text>
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
  scenario = null,
  onClick = null,
}: {
  riskFile?: DVRiskFile | null;
  calculation: RiskCalculation | null;
  maxCauses?: number | null;
  minCausePortion?: number | null;
  shownCausePortion?: number | null;
  scenario?: SCENARIOS | null;
  onClick?: ((id: string) => void) | null;
}) {
  if (!calculation) return null;

  let scenarioSuffix: string;
  if (!scenario) {
    const rs = [
      calculation.tp_c * calculation.ti_c,
      calculation.tp_m * calculation.ti_m,
      calculation.tp_e * calculation.ti_e,
    ];

    const s = ["c", "m", "e"][rs.indexOf(Math.max(...rs))];
    scenarioSuffix = "_" + s;
  } else if (scenario === SCENARIOS.CONSIDERABLE) {
    scenarioSuffix = "_c";
  } else if (scenario === SCENARIOS.MAJOR) {
    scenarioSuffix = "_m";
  } else {
    scenarioSuffix = "_e";
  }

  const causes = [
    {
      name: "Direct Probability",
      p: calculation[`dp${scenarioSuffix}` as keyof RiskCalculation] as number,
    },
    ...calculation.causes.map((c) => ({
      id: c.cause.riskId,
      name: c.cause.riskTitle,
      p: c[`ip${scenarioSuffix}` as keyof CascadeCalculation] as number,
    })),
  ];

  let minP = 0;

  if (maxCauses !== null) {
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
  if (minP >= 0)
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
            />
          }
          link={<PSankeyLink totalNodes={data.nodes.length} />}
          nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
        >
          <Tooltip content={<CustomTooltip />} />
        </Sankey>
      </ResponsiveContainer>
    </>
  );
}
