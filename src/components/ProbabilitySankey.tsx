import { ResponsiveContainer, Sankey, Tooltip } from "recharts";
import { Box, Typography } from "@mui/material";

export default function ProbabilitySankey({ riskFile }: { riskFile: any }) {
  if (!riskFile) return null;

  const data = {
    nodes: [
      { name: riskFile.cr4de_title },
      { name: "Direct Probability" },
      ...riskFile.calculated.causes
        .filter((c: any, i: number) => c.ip > 0)
        .map((c: any) => ({
          name: c.title,
        })),
    ],
    links: [
      { source: 1, target: 0, value: Math.round(10000 * riskFile.calculated.dp) / 100 },
      ...riskFile.calculated.causes
        .filter((e: any, i: number) => e.ip > 0)
        .map((e: any, i: number) => ({
          source: i + 2,
          target: 0,
          value: Math.round(10000 * e.ip) / 100,
        })),
    ],
  };

  return (
    <>
      <Box sx={{ width: "100%", mb: 2 }}>
        <Typography variant="h6">Probability Breakdown</Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey data={data}>
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    </>
  );
}
