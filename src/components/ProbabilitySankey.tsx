import { Layer, Rectangle, ResponsiveContainer, Sankey, Tooltip } from "recharts";
import { Box, Typography } from "@mui/material";
import getCategoryColor from "../functions/getCategoryColor";
import { useNavigate } from "react-router-dom";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { RiskCalculation } from "../types/dataverse/DVAnalysisRun";

const baseY = 50;

const PSankeyNode = ({ x, y, width, height, index, payload, containerWidth, totalProbability, totalNodes }: any) => {
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
  riskFile,
  calculation,
}: {
  riskFile: DVRiskFile | null;
  calculation: RiskCalculation | null;
}) {
  if (!riskFile || !calculation) return null;

  const data = {
    nodes: [
      { name: riskFile.cr4de_title, category: riskFile.cr4de_risk_category },
      { name: "Direct Probability" },
      ...calculation.causes
        .filter((c) => c.ip > 0)
        .map((c) => ({
          name: c.title,
          id: c.riskId,
        })),
    ],
    links: [
      ...(calculation.dp > 0 ? [{ source: 1, target: 0, value: calculation.dp }] : []),
      ...calculation.causes
        .filter((e) => e.ip > 0)
        .map((e: any, i: number) => ({
          source: i + 2,
          target: 0,
          value: e.ip,
        })),
    ],
  };

  return (
    <>
      <Box sx={{ width: "100%", mb: 2 }}>
        <Typography variant="h6">Probability Breakdown</Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          node={<PSankeyNode totalProbability={calculation.tp} totalNodes={data.nodes.length} />}
          link={<PSankeyLink totalNodes={data.nodes.length} />}
          nodePadding={data.nodes.length > 2 ? 100 / (data.nodes.length - 2) : 0}
        ></Sankey>
      </ResponsiveContainer>
    </>
  );
}
