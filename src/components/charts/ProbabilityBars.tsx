import { Box, Typography } from "@mui/material";
import getScaleString from "../../functions/getScaleString";
import { useTranslation } from "react-i18next";
import { ProbabilityBarsChart } from "./svg/ProbabilityBarsChart";

export default function ProbabilityBars({
  tp,
  chartWidth,
  manmade = false,
}: {
  tp: number;
  chartWidth: number;
  manmade?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 4, width: chartWidth }}>
      <Typography variant="subtitle2" sx={{ mb: 0, textAlign: "center" }}>
        {manmade
          ? t("learning.motivation.text.title", "Motivation")
          : t("learning.probability.2.text.title", "Probability")}
      </Typography>
      <ProbabilityBarsChart tp={tp} chartWidth={chartWidth} manmade={manmade} />
      <Typography variant="h6" sx={{ mt: 1, textAlign: "center" }}>
        {t(getScaleString(tp))}
      </Typography>
    </Box>
  );
}
