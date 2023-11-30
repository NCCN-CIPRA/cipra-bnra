import { Layer, Rectangle, ResponsiveContainer, Sankey, Tooltip } from "recharts";
import { Box, Typography } from "@mui/material";
import getCategoryColor from "../functions/getCategoryColor";
import { useNavigate } from "react-router-dom";
import { RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";

const baseY = 50;

const ISankeyNode = ({
  x,
  y,
  width,
  height,
  index,
  payload,
  containerWidth,
  totalImpact,
  totalNodes,
  onClick,
}: any) => {
  const navigate = useNavigate();

  if (payload.depth <= 0) {
    return (
      <Layer key={`CustomNode${index}`}>
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
    if (payload.value <= 0) return null;

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
        <text textAnchor="end" x={x - 6} y={y + height / 2} fontSize="14" stroke="#333">
          {payload.name}
        </text>
        <text textAnchor="end" x={x - 6} y={y + height / 2 + 18} fontSize="12" stroke="#333" strokeOpacity="0.5">
          {`${Math.round((100 * payload.value) / totalImpact)}%`}
        </text>
      </Layer>
    );
  }
};

const ISankeyLink = (props: any) => {
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

  const shiftedSourceY = totalNodes <= 2 ? targetY : sourceRelativeY + sourceY + (baseY - (sourceY - linkWidth / 2));

  return (
    <path
      d={`
        M${sourceX},${shiftedSourceY}
        C${sourceControlX},${shiftedSourceY} ${targetControlX},${targetY} ${targetX},${targetY}
      `}
      stroke="rgb(0, 164, 154, 0.6)"
      fill="none"
      strokeWidth={totalNodes <= 2 ? 600 - 2 * baseY : linkWidth}
      strokeOpacity="0.2"
      // {...filterProps(others)}
    />
  );
};

export default function ImpactSankey({
  riskFile = null,
  calculation,
  maxEffects = null,
  onClick = null,
}: {
  riskFile?: DVRiskFile | null;
  calculation: RiskCalculation | null;
  maxEffects?: number | null;
  onClick?: ((id: string) => void) | null;
}) {
  if (!calculation) return null;

  const effects = [
    {
      name: "Direct Impact",
      i: calculation.di,
    },
    ...calculation.effects.map((c) => ({
      id: c.effect.riskId,
      name: c.effect.riskTitle,
      i: c.ii,
    })),
  ];

  let minI =
    maxEffects === null || effects.length < maxEffects
      ? -1
      : effects.sort((a, b) => b.i - a.i)[Math.min(maxEffects - 1, effects.length - 1)].i;

  const nodes = [{ name: calculation.riskTitle }, ...effects.filter((c) => c.i >= minI)];
  if (minI >= 0) nodes.push({ name: "Other" });

  const links = effects
    .filter((e) => e.i >= minI)
    .map((e, i: number) => ({
      source: 0,
      target: i + 1,
      value: Math.max(0.000000001, e.i),
    }));
  if (minI > 0)
    links.push({
      source: 0,
      target: nodes.length - 1,
      value: calculation.effects.filter((e: any, i: number) => e.ii < minI).reduce((tot, e) => tot + e.ii, 0.000000001),
    });

  const data = {
    nodes,
    links,
  };

  return (
    <>
      <Box sx={{ width: "100%", mb: 2, textAlign: "right" }}>
        <Typography variant="h6">Impact Breakdown</Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={<ISankeyNode onClick={onClick} totalImpact={calculation.ti} totalNodes={data.nodes.length} />}
          link={<ISankeyLink totalNodes={data.nodes.length} />}
          nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
        ></Sankey>
      </ResponsiveContainer>
    </>
  );
}
