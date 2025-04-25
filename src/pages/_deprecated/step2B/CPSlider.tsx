import { useEffect, useState } from "react";
import { DPRows, DPs, DPValueStack } from "../learning/QuantitativeScales/P";
import { Box, Stack, Typography, Slider, Alert } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Trans } from "react-i18next";

export default function CPSlider({
  initialValue,
  error,
  onChange,
}: {
  initialValue: string | null;
  error?: boolean;
  onChange: (value: string | null) => void;
}) {
  const [value, setValue] = useState(initialValue ? parseInt(initialValue.replace("CP", ""), 10) : -1);

  const handleChangeValue = (event: Event, newValue: number | number[]) => {
    if (newValue < 0) {
      onChange(null);
    } else {
      const t = `CP${(newValue as number) + 1}`;

      onChange(t);
    }

    setValue(newValue as number);
  };

  return (
    <Box sx={{ mx: 2, mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, ml: -2 }}>
          <Typography>
            <Trans i18nKey="2B.error.cp.quanti.required">
              Please make an estimation of the probability, even if you are unsure.
            </Trans>
          </Typography>
        </Alert>
      )}
      <Slider
        value={value}
        onChange={handleChangeValue}
        valueLabelDisplay="auto"
        step={1}
        min={-1}
        max={4}
        valueLabelFormat={(value: number) => <DPValueStack value={value} />}
        marks={Array(6)
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
                    CP{value + 1}
                  </Typography>
                </Tooltip>
              ),
          }))}
      />
    </Box>
  );
}
