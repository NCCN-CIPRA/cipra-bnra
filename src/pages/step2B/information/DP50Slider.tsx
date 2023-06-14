import { useEffect, useState } from "react";
import { DPRows, DPs, DPValueStack } from "../../learning/QuantitativeScales/P2050";
import { Box, Stack, Typography, Slider, Alert } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Trans, useTranslation } from "react-i18next";
import TornadoIcon from "@mui/icons-material/Tornado";

export function DP50Slider({
  id,
  DPValue,
  initialDP50Value,
  error,
  onChange,
}: {
  id: string;
  DPValue: string;
  initialDP50Value: string | null;
  error?: boolean | null;
  onChange: (value: string | null) => void;
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState(parseInt((initialDP50Value || "-1").replace("DP", ""), 10));
  const dp = parseInt(DPValue.replace("DP", ""), 10) - 1;

  const handleChangeValue = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) return;

    if (newValue < 0) {
      onChange(null);
    } else {
      const t = `DP${newValue}`;

      onChange(t);
    }

    setValue(newValue);
  };

  return (
    <Box id={`DP50-slider-${id}`} sx={{ mx: 2, mt: 3, position: "relative" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, ml: -2 }}>
          <Typography>
            <Trans i18nKey="2B.error.p2050.quanti.required">
              Please make an estimation of the probability, even if you are unsure.
            </Trans>
          </Typography>
        </Alert>
      )}
      <Tooltip title={t("2B.DP50.originalValue", "The original DP value selected in the previous step.")}>
        <Box
          sx={{
            position: "absolute",
            top: error ? 53 : -18,
            left: `calc(${(dp + 2) * 16.67}% - 15px)`,
            width: 30,
            height: 30,
          }}
          className="original-dp-value"
        >
          <TornadoIcon color="secondary" sx={{ fontSize: 30 }} />
        </Box>
      </Tooltip>
      <Slider
        value={value}
        onChange={handleChangeValue}
        valueLabelDisplay="auto"
        disableSwap
        step={1}
        min={-1}
        max={5}
        valueLabelFormat={(value: number) => <DPValueStack value={value} />}
        marks={Array(7)
          .fill(undefined)
          .map((_, i) => i - 1)
          .map((value) => ({
            value,
            label:
              value < 0 ? (
                <Typography variant="body2">
                  <Trans i18nKey="2A.slider.none">-</Trans>
                </Typography>
              ) : (
                <Tooltip
                  title={<DPValueStack value={value} />}
                  PopperProps={{
                    sx: {
                      [`& .${tooltipClasses.tooltip}`]: {
                        maxWidth: "none",
                      },
                    },
                  }}
                >
                  <Typography id={`step2A-dp-mark-${value}`} variant="body2">
                    DP2050-{value}
                  </Typography>
                </Tooltip>
              ),
          }))}
      />
    </Box>
  );
}
