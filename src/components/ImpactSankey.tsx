import { ResponsiveContainer, Sankey, Tooltip } from "recharts";
import { Box, Typography } from "@mui/material";

export default function ImpactSankey({ riskFile }: { riskFile: any }) {
  if (!riskFile) return null;
  console.log(riskFile);
  const data = {
    nodes: [
      { name: riskFile.cr4de_title },
      { name: "Direct Impact" },
      ...riskFile.calculated.effects
        .filter(
          (e: any, i: number) =>
            e.ii_Ha + e.ii_Hb + e.ii_Hc + e.ii_Sa + e.ii_Sb + e.ii_Sc + e.ii_Sd + e.ii_Ea + e.ii_Fa + e.ii_Fb > 0
        )
        .map((e: any) => ({
          name: e.title,
        })),
    ],
    links: [
      { source: 0, target: 1, value: riskFile.calculated.di },
      ...riskFile.calculated.effects
        .filter(
          (e: any, i: number) =>
            e.ii_Ha + e.ii_Hb + e.ii_Hc + e.ii_Sa + e.ii_Sb + e.ii_Sc + e.ii_Sd + e.ii_Ea + e.ii_Fa + e.ii_Fb > 0
        )
        .map((e: any, i: number) => ({
          source: 0,
          target: i + 2,
          value: Math.round(
            e.ii_Ha + e.ii_Hb + e.ii_Hc + e.ii_Sa + e.ii_Sb + e.ii_Sc + e.ii_Sd + e.ii_Ea + e.ii_Fa + e.ii_Fb
          ),
        })),
    ],
  };

  return (
    <>
      <Box sx={{ width: "100%", mb: 2, textAlign: "right" }}>
        <Typography variant="h6">Impact Breakdown</Typography>
      </Box>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey data={data}>
          <Tooltip />
        </Sankey>
      </ResponsiveContainer>
    </>
  );
}
