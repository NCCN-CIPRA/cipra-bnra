import { Stack, Box, Typography, Paper } from "@mui/material";
import { Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts";
import { TEAL } from "./Colors";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { RiskCalculation } from "../../../types/RiskCalculation";
import { getAbsoluteImpact, getImpactScaleNumber } from "../../../functions/Impact";
import { CalculatedRisk } from "../../../types/CalculatedRisk";

export default function HistoryCard({ riskFile }: { riskFile: CalculatedRisk }) {
  const data = riskFile.calculated.reverse().map((c) => ({
    time: new Date(c.timestamp),
    risk: parseFloat(getImpactScaleNumber(c.tp * c.ti)),
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
