import { Stack, Box, Typography, Paper } from "@mui/material";
import { Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { TEAL } from "./Colors";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { getAbsoluteImpact, getImpactScaleNumber } from "../../../functions/Impact";
import { DVAnalysisRun, RiskAnalysisResults } from "../../../types/dataverse/DVAnalysisRun";

export default function HistoryCard({
  riskFile,
  calculations,
}: {
  riskFile: DVRiskFile;
  calculations: RiskAnalysisResults[] | null;
}) {
  if (!calculations)
    return <Stack component={Paper} sx={{ width: "100%", height: "100%", p: 2, position: "relative" }}></Stack>;

  const data = calculations.reverse().map((c) => ({
    time: new Date(c.cr4de_results.timestamp),
    risk: parseFloat(getImpactScaleNumber(c.cr4de_results.tp * c.cr4de_results.ti)),
  }));

  return (
    <Stack component={Paper} sx={{ width: "100%", height: "100%", p: 2 }}>
      <Box sx={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart width={300} height={100} data={data}>
            <Line type="monotone" dataKey="risk" stroke={TEAL} strokeWidth={2} />
            <Tooltip
              labelFormatter={(l, p) =>
                p && p[0]
                  ? `${p[0].payload.time.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}`
                  : ""
              }
              formatter={(v, n, p) => [`${v} / 5`, "Total Risk"]}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Typography variant="subtitle1">Total Risk Evolution</Typography>
      </Box>
    </Stack>
  );
}
