import {
  Layer,
  Rectangle,
  ResponsiveContainer,
  Sankey,
  Tooltip,
  TooltipProps,
} from "recharts";
import { Box, Typography, Card, CardContent } from "@mui/material";
import getCategoryColor from "../../functions/getCategoryColor";
import { useNavigate } from "react-router-dom";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import {
  CascadeCalculation,
  RiskCalculation,
} from "../../types/dataverse/DVAnalysisRun";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

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
  onClick,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
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
        <text
          textAnchor="start"
          x={x + 15}
          y={y + height / 2}
          fontSize="14"
          stroke="#333"
        >
          {payload.name}
        </text>
        <text
          textAnchor="start"
          x={x + 15}
          y={y + height / 2 + 18}
          fontSize="12"
          stroke="#333"
          strokeOpacity="0.5"
        >
          {`${Math.round((100 * payload.value) / totalProbability)}%`}
        </text>
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
      stroke="rgb(0, 164, 154, 0.6)"
      fill="none"
      strokeWidth={totalNodes <= 2 ? 600 - 2 * baseY : linkWidth}
      strokeOpacity="0.2"
      // {...filterProps(others)}
    />
  );
};

export default function SankeyPerImpact({
  calculation,
  maxLinks = null,
  onClick = null,
}: {
  riskFile?: DVRiskFile | null;
  calculation: RiskCalculation | null;
  maxLinks?: number | null;
  onClick?: ((id: string) => void) | null;
}) {
  if (!calculation) return null;

  const causes = [
    {
      name: "Direct Probability",
      p: calculation.dp,
    },
    ...calculation.causes.map((c) => ({
      id: c.cause.riskId,
      name: c.cause.riskTitle,
      p: c.ip,
    })),
  ];

  const minP =
    maxLinks === null || causes.length <= maxLinks
      ? -1
      : causes.sort((a, b) => b.p - a.p)[
          Math.min(maxLinks - 1, causes.length - 1)
        ].p;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = [
    { name: calculation.riskTitle },
    ...causes.filter((c) => c.p >= minP),
  ];
  if (minP >= 0)
    nodes.push({
      name: "Other",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hidden: calculation.causes.filter((e: any) => e.ip < minP),
    });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((e: any) => e.ip < minP)
        .reduce((tot, e) => tot + e.ip, 0.000000001),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hidden: calculation.causes.filter((e: any) => e.ip < minP),
    });

  const data = {
    nodes,
    links,
  };

  const CustomTooltip = ({
    active,
    payload,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload) {
      if (payload[0].payload?.payload?.hidden) {
        return (
          <Card sx={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}>
            <CardContent>
              {payload[0].payload?.payload?.hidden
                .sort(
                  (a: CascadeCalculation, b: CascadeCalculation) => b.ip - a.ip
                )
                .slice(0, 10)
                .map((c: CascadeCalculation) => (
                  <Box key={c.cascadeId} sx={{ margin: 0, padding: 0 }}>
                    {`${c.cause.riskTitle}:`}{" "}
                    <b>{`${
                      Math.round((10000 * c.ip) / calculation.tp) / 100
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
              totalProbability={calculation.tp}
              totalNodes={data.nodes.length}
            />
          }
          link={<PSankeyLink totalNodes={data.nodes.length} />}
          nodePadding={
            data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0
          }
        >
          <Tooltip content={<CustomTooltip />} />
        </Sankey>
      </ResponsiveContainer>
    </>
  );
}
