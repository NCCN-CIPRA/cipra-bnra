import { useEffect, useState } from "react";
import { DPRows, DPs, DPValueStack } from "../../learning/QuantitativeScales/P";
import { Box, Stack, Typography, Slider, Alert } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Trans } from "react-i18next";

import "./DP50Slider.css";

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
  error?: boolean;
  onChange: (value: string | null) => void;
}) {
  const [value, setValue] = useState(parseInt((initialDP50Value || DPValue).replace("DP", ""), 10) - 1);
  const dp = parseInt(DPValue.replace("DP", ""), 10) - 1;

  const handleChangeValue = (event: Event, newValues: number | number[]) => {
    if (!Array.isArray(newValues)) return;

    let newValue;
    if (newValues[0] !== dp) newValue = newValues[0];
    else newValue = newValues[1];

    const t = `DP${(newValue as number) + 1}`;

    onChange(t);

    setValue(newValue);
  };

  useEffect(() => {
    if (dp > value) {
      document.querySelector(".MuiSlider-thumb[data-index='0']");
    } else {
    }
  }, [value]);

  return (
    <Box id={`DP50-slider-${id}`} sx={{ mx: 2, mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, ml: -2 }}>
          <Typography>
            <Trans i18nKey="2A.error.p.quanti.required">
              Please make an estimation of the probability, even if you are unsure.
            </Trans>
          </Typography>
        </Alert>
      )}
      <Slider
        value={dp > value ? [value, dp] : [dp, value]}
        onChange={handleChangeValue}
        valueLabelDisplay="auto"
        disableSwap
        step={1}
        min={0}
        max={4}
        valueLabelFormat={(value: number) => <DPValueStack value={value} />}
        marks={Array(6)
          .fill(undefined)
          .map((_, i) => i - 1)
          .map((value) => ({
            value,
            label: (
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
                  DP{value + 1}
                </Typography>
              </Tooltip>
            ),
          }))}
      />
    </Box>
  );
}
