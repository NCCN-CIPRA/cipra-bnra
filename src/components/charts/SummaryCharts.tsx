import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import ProbabilityBars from "./ProbabilityBars";
import { Cell, Pie, PieChart } from "recharts";
import getScaleString from "../../functions/getScaleString";
import { DVAnalysisRun, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS, getScenarioParameter, getScenarioSuffix } from "../../functions/scenarios";
import { getTotalProbabilityRelativeScale } from "../../functions/Probability";
import { IMPACT_CATEGORY } from "../../functions/Impact";
import { IMPACT_COLOR_SCALES } from "../../functions/getImpactColor";
import { useCallback } from "react";
import FileSaver from "file-saver";
import { useCurrentPng, useGenerateImage } from "recharts-to-png";
import { useOutletContext } from "react-router-dom";
import { AuthPageContext } from "../../pages/AuthPage";
import SaveIcon from "@mui/icons-material/Download";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Trans, useTranslation } from "react-i18next";
import useRecord from "../../hooks/useRecord";
import { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import { getCategoryImpactRescaled } from "../../functions/CategoryImpact";

const RADIAN = Math.PI / 180;
const data = [
  { name: "1", value: 1, color: "red" },
  { name: "2", value: 1, color: "orange" },
  { name: "3", value: 1, color: "yellow" },
  { name: "4", value: 1, color: "green" },
  { name: "5", value: 1, color: "blue" },
];
const pieWidth = 200;
const pieHeight = 100;
const piePadding = 5;
const cx = pieWidth / 2 - piePadding;
const cy = pieHeight - piePadding;
const oR = Math.min(pieHeight, pieWidth / 2);
const iR = oR / 2;
const value = 2.5;

const getBars = (impact: IMPACT_CATEGORY) => [
  { name: "1", value: 1, color: IMPACT_COLOR_SCALES[impact][0] },
  { name: "2", value: 1, color: IMPACT_COLOR_SCALES[impact][1] },
  { name: "3", value: 1, color: IMPACT_COLOR_SCALES[impact][2] },
  { name: "4", value: 1, color: IMPACT_COLOR_SCALES[impact][3] },
  { name: "5", value: 1, color: IMPACT_COLOR_SCALES[impact][4] },
];

const needle = (value: number, data: any[], cx: number, cy: number, iR: number, oR: number, color: string) => {
  let total = 0;
  data.forEach((v) => {
    total += v.value;
  });
  const ang = 180.0 * (1 - value / total);
  const length = (iR + 2 * oR) / 4;
  const sin = Math.sin(-RADIAN * ang);
  const cos = Math.cos(-RADIAN * ang);
  const r = 5;
  const x0 = cx + piePadding;
  const y0 = cy + r;
  const xba = x0 + r * sin;
  const yba = y0 - r * cos;
  const xbb = x0 - r * sin;
  const ybb = y0 + r * cos;
  const xp = x0 + length * cos;
  const yp = y0 + length * sin;

  return (
    <>
      <circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />,
      <path d={`M${x0} ${y0} L${xp} ${yp} L${x0} ${y0}`} stroke={color} strokeWidth={3} fill={color} />,
    </>
  );
};

export default function SummaryCharts({
  riskFile,
  scenario,
  manmade = false,
}: {
  riskFile: DVRiskFile;
  scenario: SCENARIOS;
  manmade?: boolean;
}) {
  const { t } = useTranslation();
  const { user } = useOutletContext<AuthPageContext>();

  useRecord<DVAnalysisRun>({
    table: DataTable.ANALYSIS_RUN,
    id: riskFile._cr4de_latest_calculation_value || "",
    onComplete: async (data) => {
      if (data.cr4de_results === null) return;
    },
  });

  // useCurrentPng usage (isLoading is optional)
  const [getDivJpeg, { ref, isLoading }] = useGenerateImage({
    type: "image/png",
    quality: 1,
    options: { scale: 4 } as any,
  });

  // Can also pass in options for html2canvas
  // const [getPng, { ref }] = useCurrentPng({ backgroundColor: '#000' });

  const handleDownload = useCallback(async () => {
    const png = await getDivJpeg();

    // Verify that png is not undefined
    if (png) {
      // Download with FileSaver
      FileSaver.saveAs(png, `${riskFile.cr4de_hazard_id}-summary.png`);
    }
  }, [getDivJpeg]);

  const scenarioSuffix = getScenarioSuffix(scenario);

  const tp = getScenarioParameter(riskFile, "TP", scenario) || 0;

  const H = getCategoryImpactRescaled(riskFile, "H", scenario);
  const S = getCategoryImpactRescaled(riskFile, "S", scenario);
  const E = getCategoryImpactRescaled(riskFile, "E", scenario);
  const F = getCategoryImpactRescaled(riskFile, "F", scenario);

  return (
    <Box sx={{ position: "relative" }}>
      <Box ref={ref} sx={{ p: 2, pb: 1, border: "1px solid #ddd", display: "inline-block" }}>
        <ProbabilityBars tp={tp} chartWidth={pieWidth} manmade={manmade} />
        <Stack direction="column" spacing={4} sx={{ mb: 4, width: pieWidth }}>
          <Stack direction="column">
            <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center" }}>
              <Trans i18nKey="learning.impact.h.title">Human Impact</Trans>
            </Typography>
            <PieChart width={pieWidth} height={pieHeight}>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={getBars("H")}
                cx={cx}
                cy={cy}
                innerRadius={iR}
                outerRadius={oR}
                fill="#8884d8"
                stroke="none"
                paddingAngle={1}
              >
                {getBars("H").map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {needle(H, data, cx, cy, iR, oR, "#555")}
            </PieChart>
            <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
              {t(getScaleString(H))}
            </Typography>
          </Stack>
          <Stack direction="column">
            <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center" }}>
              <Trans i18nKey="learning.impact.s.title">Societal Impact</Trans>
            </Typography>
            <PieChart width={pieWidth} height={pieHeight}>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={getBars("H")}
                cx={cx}
                cy={cy}
                innerRadius={iR}
                outerRadius={oR}
                fill="#8884d8"
                stroke="none"
                paddingAngle={1}
              >
                {getBars("S").map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {needle(S, data, cx, cy, iR, oR, "#555")}
            </PieChart>
            <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
              {t(getScaleString(S))}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="column" spacing={4} sx={{ mb: 1, width: pieWidth }}>
          <Stack direction="column">
            <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center" }}>
              <Trans i18nKey="learning.impact.e.title">Environmental Impact</Trans>
            </Typography>
            <PieChart width={pieWidth} height={pieHeight} style={{}}>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={getBars("H")}
                cx={cx}
                cy={cy}
                innerRadius={iR}
                outerRadius={oR}
                fill="#8884d8"
                stroke="none"
                paddingAngle={1}
              >
                {getBars("E").map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {needle(E, data, cx, cy, iR, oR, "#555")}
            </PieChart>
            <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
              {t(getScaleString(E))}
            </Typography>
          </Stack>
          <Stack direction="column">
            <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center" }}>
              <Trans i18nKey="learning.impact.f.title">Financial Impact</Trans>
            </Typography>
            <PieChart width={pieWidth} height={pieHeight}>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={getBars("F")}
                cx={cx}
                cy={cy}
                innerRadius={iR}
                outerRadius={oR}
                fill="#8884d8"
                stroke="none"
                paddingAngle={1}
              >
                {getBars("F").map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {needle(F, data, cx, cy, iR, oR, "#555")}
            </PieChart>
            <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
              {t(getScaleString(F))}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {user && user.roles.internal && (
        <IconButton sx={{ position: "absolute", top: 5, left: 5 }} onClick={handleDownload}>
          <SaveIcon />
        </IconButton>
      )}
    </Box>
  );
}
