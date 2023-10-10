import { Stack, Box, Typography, Paper, Tooltip } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { R2G, TEAL } from "./Colors";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVAnalysisRun, Quality, RiskCalculation } from "../../../types/dataverse/DVAnalysisRun";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";

const RADIAN = Math.PI / 180;
const data = [
  { name: "Bad", value: 80, color: R2G.RED },
  { name: "Fine", value: 45, color: R2G.YELLOW },
  { name: "Good", value: 25, color: R2G.GREEN },
];
const iR = 50;
const oR = 100;
const value = 50;

const needle = (
  value: number,
  data: any[],
  cx: number,
  cy: number,
  iR: number,
  oR: number,
  color: string | undefined
) => {
  let total = 0;

  data.forEach((v: { value: number }) => {
    total += v.value;
  });

  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 3;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + 5;
  const y0 = cy + 5;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return [
    <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
    <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />,
  ];
};

const getQualityScore = (quality: Quality, noAverages = 1) => {
  if (quality === Quality.CONSENSUS) {
    return 1;
  } else if (quality === Quality.AVERAGE) {
    return noAverages / (1 + noAverages);
  } else {
    return 0;
  }
};

export default function ScoreCard({
  riskFile,
  participants,
  calculation,
}: {
  riskFile: DVRiskFile;
  participants: DVParticipation[];
  calculation: RiskCalculation | null;
}) {
  let score: { da: number; causes: number; effects: number } = { da: 0, causes: 0, effects: 0 };
  const dasFinished = participants.filter((p) => p.cr4de_direct_analysis_finished).length;
  const casFinished = participants.filter((p) => p.cr4de_cascade_analysis_finished).length;

  if (!calculation)
    return <Stack component={Paper} sx={{ width: "100%", height: "100%", p: 2, position: "relative" }}></Stack>;

  score.da = getQualityScore(calculation.quality, dasFinished);

  score.causes =
    calculation.causes.reduce(
      (tot, cause) => tot + getQualityScore(cause.causeQuality, casFinished) * getQualityScore(cause.cascadeQuality),
      0
    ) / calculation.causes.length;

  score.effects =
    calculation.effects.reduce(
      (tot, effect) => tot + getQualityScore(effect.effectQuality) * getQualityScore(effect.cascadeQuality),
      0
    ) / calculation.effects.length;

  const totalScore = (score.da + score.causes + score.effects) / 3;

  return (
    <Stack component={Paper} sx={{ width: "100%", height: "100%", p: 2, position: "relative" }}>
      <Box sx={{ flex: 1, overflow: "hidden", mb: 4 }}>
        <ResponsiveContainer height="200%">
          <PieChart height={100} width={100}>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              innerRadius="50%"
              outerRadius="100%"
              fill={TEAL}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box
        sx={{
          position: "relative",
          transform: `rotate(${totalScore * 180}deg)`,
          transformOrigin: "50% calc(100% - 32px)",
        }}
      >
        <Tooltip
          title={
            <Stack>
              <Typography variant="subtitle1">{`Total Reliability Score: ${Math.round(totalScore * 100)}`}</Typography>
              <Typography variant="caption">{`Direct Analysis Score: ${Math.round(score.da * 100)}`}</Typography>
              <Typography variant="caption">{`Causes Score: ${Math.round(score.causes * 100)}`}</Typography>
              <Typography variant="caption">{`Effects Score: ${Math.round(score.effects * 100)}`}</Typography>
            </Stack>
          }
        >
          <Box
            sx={{
              position: "absolute",
              bottom: 27,
              left: "calc(50% - 80px)",
              width: 0,
              height: 0,
              borderBottom: "5px solid transparent",
              borderTop: "5px solid transparent",
              borderRight: `85px solid ${TEAL}`,
              borderBottomRightRadius: 5,
              borderTopRightRadius: 5,
              opacity: 0.8,
              transition: "opacity .3s ease",
              cursor: "pointer",
              "&:hover": {
                opacity: 1,
              },
            }}
          />
        </Tooltip>
      </Box>
      <Box sx={{ width: "100%", textAlign: "center" }}>
        <Typography variant="subtitle1">Analysis Reliability</Typography>
      </Box>
    </Stack>
  );
}
