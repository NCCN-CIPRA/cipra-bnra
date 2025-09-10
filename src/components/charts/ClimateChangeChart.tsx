import { TooltipProps } from "recharts";
import { SCENARIOS } from "../../functions/scenarios";
import round from "../../functions/roundNumberString";
import { NameType } from "recharts/types/component/DefaultTooltipContent";
import { Box, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import ClimateChangeChartSvg from "./svg/ClimateChangeChart";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";

const getPercentage = (orig: number, n: number) => {
  if (Math.round(100 * orig) / 100 <= 0) return "100%";

  return round((100 * Math.round(100 * n)) / Math.round(100 * orig));
};

const CustomTooltip = ({ active, payload }: TooltipProps<number, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          border: "1px solid #ccc",
          padding: 1,
          bgcolor: "rgba(255,255,255,0.9)",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ textDecoration: "underline", mb: 1 }}
        >
          Effects of Climate Change
        </Typography>
        <Stack direction="column" rowGap={0.5}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Stack direction="row" sx={{ color: (payload[0] as any).fill }}>
            <Typography
              variant="body2"
              sx={{ width: 230, flex: 1, fontWeight: "bold" }}
            >
              Considerable Scenario
            </Typography>
            <Typography
              variant="body2"
              sx={{
                width: 50,
                mr: "88px",
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              {round(payload[0].value as number)} / 5
            </Typography>
          </Stack>
          {Math.round(100 * (payload[3].value as number)) / 100 > 0 && (
            <Stack
              direction="row"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              sx={{ ml: 2, mb: 1, color: (payload[3] as any).fill }}
            >
              <Typography variant="body2" sx={{ flex: 1, fontWeight: "bold" }}>
                <Trans i18nKey="ccchart.probability">Probability in 2050</Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}
              >
                {round(
                  (payload[0].value as number) + (payload[3].value as number)
                )}{" "}
                / 5
              </Typography>
              <Typography
                variant="caption"
                sx={{ ml: 1, width: 80, fontWeight: "bold", textAlign: "left" }}
              >
                (+
                {getPercentage(
                  payload[0].value as number,
                  payload[3].value as number
                )}
                %)
              </Typography>
            </Stack>
          )}
          {Math.round(100 * (payload[6].value as number)) / 100 > 0 && (
            <Stack
              direction="row"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              sx={{ ml: 2, mb: 1, color: (payload[6] as any).fill }}
            >
              <Typography variant="body2" sx={{ flex: 1, fontWeight: "bold" }}>
                <Trans i18nKey="ccchart.probability">Probability in 2050</Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}
              >
                {round(
                  (payload[0].value as number) - (payload[6].value as number)
                )}{" "}
                / 5
              </Typography>
              <Typography
                variant="caption"
                sx={{ ml: 1, width: 80, fontWeight: "bold", textAlign: "left" }}
              >
                (-
                {getPercentage(
                  payload[0].value as number,
                  payload[6].value as number
                )}
                %)
              </Typography>
            </Stack>
          )}
          {Math.round(100 * (payload[3].value as number)) / 100 <= 0 &&
            Math.round(100 * (payload[6].value as number)) / 100 <= 0 && (
              <Stack
                direction="row"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sx={{ ml: 2, mb: 1, color: (payload[0] as any).fill }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, fontWeight: "bold" }}
                >
                  <Trans i18nKey="ccchart.nochange">No change in 2050</Trans>
                </Typography>
              </Stack>
            )}

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Stack direction="row" sx={{ color: (payload[1] as any).fill }}>
            <Typography variant="body2" sx={{ flex: 1, fontWeight: "bold" }}>
              Major Scenario
            </Typography>
            <Typography
              variant="body2"
              sx={{
                width: 50,
                mr: "88px",
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              {round(payload[1].value as number)} / 5
            </Typography>
          </Stack>
          {Math.round(100 * (payload[4].value as number)) / 100 > 0 && (
            <Stack
              direction="row"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              sx={{ ml: 2, mb: 1, color: (payload[4] as any).fill }}
            >
              <Typography variant="body2" sx={{ flex: 1, fontWeight: "bold" }}>
                <Trans i18nKey="ccchart.probability">Probability in 2050</Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}
              >
                {round(
                  (payload[1].value as number) + (payload[4].value as number)
                )}{" "}
                / 5
              </Typography>
              <Typography
                variant="caption"
                sx={{ ml: 1, width: 80, fontWeight: "bold", textAlign: "left" }}
              >
                (+
                {getPercentage(
                  payload[1].value as number,
                  payload[4].value as number
                )}
                %)
              </Typography>
            </Stack>
          )}
          {Math.round(100 * (payload[7].value as number)) / 100 > 0 && (
            <Stack
              direction="row"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              sx={{ ml: 2, mb: 1, color: (payload[7] as any).fill }}
            >
              <Typography variant="body2" sx={{ flex: 1, fontWeight: "bold" }}>
                <Trans i18nKey="ccchart.probability">Probability in 2050</Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}
              >
                {round(
                  (payload[1].value as number) - (payload[7].value as number)
                )}{" "}
                / 5
              </Typography>
              <Typography
                variant="caption"
                sx={{ ml: 1, width: 80, fontWeight: "bold", textAlign: "left" }}
              >
                (-
                {getPercentage(
                  payload[1].value as number,
                  payload[7].value as number
                )}
                %)
              </Typography>
            </Stack>
          )}
          {Math.round(100 * (payload[4].value as number)) / 100 <= 0 &&
            Math.round(100 * (payload[7].value as number)) / 100 <= 0 && (
              <Stack
                direction="row"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sx={{ ml: 2, mb: 1, color: (payload[0] as any).fill }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, fontWeight: "bold" }}
                >
                  <Trans i18nKey="ccchart.nochange">No change in 2050</Trans>
                </Typography>
              </Stack>
            )}

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Stack direction="row" sx={{ color: (payload[2] as any).fill }}>
            <Typography variant="body2" sx={{ flex: 1, fontWeight: "bold" }}>
              Extreme Scenario
            </Typography>
            <Typography
              variant="body2"
              sx={{
                width: 50,
                mr: "88px",
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              {round(payload[2].value as number)} / 5
            </Typography>
          </Stack>
          {Math.round(100 * (payload[5].value as number)) / 100 > 0 && (
            <Stack
              direction="row"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              sx={{ ml: 2, mb: 1, color: (payload[5] as any).fill }}
            >
              <Typography variant="body2" sx={{ flex: 1, fontWeight: "bold" }}>
                <Trans i18nKey="ccchart.probability">Probability in 2050</Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}
              >
                {round(
                  (payload[2].value as number) + (payload[5].value as number)
                )}{" "}
                / 5
              </Typography>
              <Typography
                variant="caption"
                sx={{ ml: 1, width: 80, fontWeight: "bold", textAlign: "left" }}
              >
                (+
                {getPercentage(
                  payload[2].value as number,
                  payload[5].value as number
                )}
                %)
              </Typography>
            </Stack>
          )}
          {Math.round(100 * (payload[8].value as number)) / 100 > 0 && (
            <Stack
              direction="row"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              sx={{ ml: 2, mb: 1, color: (payload[8] as any).fill }}
            >
              <Typography variant="body2" sx={{ flex: 1, fontWeight: "bold" }}>
                <Trans i18nKey="ccchart.probability">Probability in 2050</Trans>
              </Typography>
              <Typography
                variant="body2"
                sx={{ width: 50, fontWeight: "bold", textAlign: "right" }}
              >
                {round(
                  (payload[2].value as number) - (payload[8].value as number)
                )}{" "}
                / 5
              </Typography>
              <Typography
                variant="caption"
                sx={{ ml: 1, width: 80, fontWeight: "bold", textAlign: "left" }}
              >
                (-
                {getPercentage(
                  payload[2].value as number,
                  payload[8].value as number
                )}
                %)
              </Typography>
            </Stack>
          )}
          {Math.round(100 * (payload[5].value as number)) / 100 <= 0 &&
            Math.round(100 * (payload[8].value as number)) / 100 <= 0 && (
              <Stack
                direction="row"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                sx={{ ml: 2, mb: 1, color: (payload[0] as any).fill }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, fontWeight: "bold" }}
                >
                  <Trans i18nKey="ccchart.nochange">No change in 2050</Trans>
                </Typography>
              </Stack>
            )}
        </Stack>
      </Box>
    );
  }

  return null;
};

export default function ClimateChangeChart(props: {
  riskFile: DVRiskSnapshot;
  causes: DVCascadeSnapshot<unknown, DVRiskSnapshot>[];
  scenario: SCENARIOS;
  width?: number;
  height?: number;
  fontSize?: string;
  xLabelDy?: number;
}) {
  return <ClimateChangeChartSvg {...props} CustomTooltip={CustomTooltip} />;
}
