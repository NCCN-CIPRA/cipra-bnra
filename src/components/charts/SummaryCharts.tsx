import { Box, IconButton, Stack, Typography } from "@mui/material";
import ProbabilityBars from "./ProbabilityBars";
import getScaleString from "../../functions/getScaleString";
import { SCENARIOS, getScenarioParameter } from "../../functions/scenarios";
import { useCallback } from "react";
import FileSaver from "file-saver";
import { useGenerateImage } from "recharts-to-png";
import SaveIcon from "@mui/icons-material/Download";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Trans, useTranslation } from "react-i18next";
import { getCategoryImpactRescaled } from "../../functions/CategoryImpact";
import SummaryImpactChart, { pieWidth } from "./svg/SummaryImpactChart";

export default function SummaryCharts({
  riskFile,
  scenario,
  manmade = false,
  canDownload = false,
}: {
  riskFile: DVRiskFile;
  scenario: SCENARIOS;
  manmade?: boolean;
  canDownload?: boolean;
}) {
  const { t } = useTranslation();
  // const { user } = useOutletContext<AuthPageContext>();

  // useRecord<DVAnalysisRun>({
  //   table: DataTable.ANALYSIS_RUN,
  //   id: riskFile._cr4de_latest_calculation_value || "",
  //   onComplete: async (data) => {
  //     if (data.cr4de_results === null) return;
  //   },
  // });

  // useCurrentPng usage (isLoading is optional)
  const [getDivJpeg, { ref }] = useGenerateImage({
    type: "image/png",
    quality: 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDivJpeg]);

  const tp = getScenarioParameter(riskFile, "TP", scenario) || 0;

  const H = getCategoryImpactRescaled(riskFile, "H", scenario);
  const S = getCategoryImpactRescaled(riskFile, "S", scenario);
  const E = getCategoryImpactRescaled(riskFile, "E", scenario);
  const F = getCategoryImpactRescaled(riskFile, "F", scenario);

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        ref={ref}
        sx={{ p: 2, pb: 1, border: "1px solid #ddd", display: "inline-block" }}
      >
        <ProbabilityBars tp={tp} chartWidth={pieWidth} manmade={manmade} />
        <Stack direction="column" spacing={4} sx={{ mb: 4, width: pieWidth }}>
          <Stack direction="column">
            <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center" }}>
              <Trans i18nKey="learning.impact.h.title">Human Impact</Trans>
            </Typography>
            <SummaryImpactChart category="H" value={H} />
            <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
              {t(getScaleString(H))}
            </Typography>
          </Stack>
          <Stack direction="column">
            <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center" }}>
              <Trans i18nKey="learning.impact.s.title">Societal Impact</Trans>
            </Typography>
            <SummaryImpactChart category="S" value={S} />
            <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
              {t(getScaleString(S))}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="column" spacing={4} sx={{ mb: 1, width: pieWidth }}>
          <Stack direction="column">
            <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center" }}>
              <Trans i18nKey="learning.impact.e.title">
                Environmental Impact
              </Trans>
            </Typography>
            <SummaryImpactChart category="E" value={E} />
            <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
              {t(getScaleString(E))}
            </Typography>
          </Stack>
          <Stack direction="column">
            <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center" }}>
              <Trans i18nKey="learning.impact.f.title">Financial Impact</Trans>
            </Typography>
            <SummaryImpactChart category="F" value={F} />
            <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
              {t(getScaleString(F))}
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {canDownload && (
        <IconButton
          className="admin-button"
          sx={{ position: "absolute", top: 5, left: 5 }}
          onClick={handleDownload}
        >
          <SaveIcon />
        </IconButton>
      )}
    </Box>
  );
}
