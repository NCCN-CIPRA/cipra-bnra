import { useState } from "react";
import { DPRows, DPs } from "../../learning/QuantitativeScales/P";
import { Box, Stack, Typography, Slider, Alert } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Trans } from "react-i18next";
import { DirectImpactField } from "../../learning/QuantitativeScales/DI";

export function DPSlider({
  initialValue,
  error,
  onChange,
}: {
  initialValue: string | null;
  error?: boolean;
  onChange: (value: string | null) => void;
}) {
  const [value, setValue] = useState(initialValue ? parseInt(initialValue.replace("DP", ""), 10) : -1);

  const handleChangeValue = (event: Event, newValue: number | number[]) => {
    if (newValue < 0) {
      onChange(null);
    } else {
      const t = `DP${(newValue as number) + 1}`;

      onChange(t);
    }

    setValue(newValue as number);
  };

  return (
    <Box sx={{ mx: 2, mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, ml: -2 }}>
          <Typography>
            <Trans i18nKey="2A.error.quanti.required">
              Please make an estimation of the impact, even if you are unsure.
            </Trans>
          </Typography>
        </Alert>
      )}
      <Slider
        value={value}
        onChange={handleChangeValue}
        valueLabelDisplay="off"
        step={1}
        min={-1}
        max={4}
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
                  title={
                    <Stack sx={{ width: 500 }}>
                      {DPRows.map((r, ri) => (
                        <Stack key={r} direction="row">
                          <Typography variant="body2" sx={{ whiteSpace: "nowrap", mr: 1, fontWeight: "bold" }}>
                            <Trans i18nKey={r} />:{" "}
                          </Typography>
                          <Typography variant="caption">
                            <Trans i18nKey={DPs[value][ri]} />
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  }
                  PopperProps={{
                    sx: {
                      [`& .${tooltipClasses.tooltip}`]: {
                        maxWidth: "none",
                      },
                    },
                  }}
                >
                  <Typography variant="body2">DP{value + 1}</Typography>
                </Tooltip>
              ),
          }))}
      />
    </Box>
  );
}

export function DISlider({
  field,
  initialValue,
  error,
  onChange,
}: {
  field: DirectImpactField;
  initialValue: string | null;
  error?: boolean;
  onChange: (value: string | null, field: DirectImpactField) => void;
}) {
  const [value, setValue] = useState(
    initialValue ? parseInt(initialValue.replace(field.prefix, ""), 10) : field.min - 1
  );

  const handleChangeValue = (event: Event, newValue: number | number[]) => {
    if (newValue < field.min) {
      onChange(null, field);
    } else {
      const t = `${field.prefix}${newValue}`;

      onChange(t, field);
    }

    setValue(newValue as number);
  };

  return (
    <Box sx={{ mx: 2, mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, ml: -2 }}>
          <Typography>
            <Trans i18nKey="2A.error.quanti.required">
              Please make an estimation of the impact, even if you are unsure.
            </Trans>
          </Typography>
        </Alert>
      )}
      <Slider
        value={value}
        onChange={handleChangeValue}
        valueLabelDisplay="off"
        step={1}
        min={field.min - 1}
        max={field.max}
        marks={Array(field.max - field.min + 2)
          .fill(undefined)
          .map((_, i) => i + field.min - 1)
          .map((value) => ({
            value,
            label:
              value < field.min ? (
                <Typography variant="body2">
                  <Trans i18nKey="2A.slider.none">-</Trans>
                </Typography>
              ) : (
                <Tooltip
                  title={
                    <Stack direction="column">
                      <Stack direction="row" alignItems="center">
                        <Typography variant="body2" sx={{ whiteSpace: "nowrap", mr: 1, fontWeight: "bold" }}>
                          {`${field.prefix}${value}`}
                        </Typography>
                        <Typography variant="caption">
                          <Trans i18nKey={`learning.impact.${field.prefix}.${value}`} />
                        </Typography>
                      </Stack>
                      <Typography variant="caption">
                        <Trans i18nKey={field.unit} />
                      </Typography>
                    </Stack>
                  }
                  PopperProps={{
                    sx: {
                      [`& .${tooltipClasses.tooltip}`]: {
                        maxWidth: "none",
                      },
                    },
                  }}
                >
                  <Typography variant="body2">
                    <Trans i18nKey={`${field.prefix}${value}`} />
                  </Typography>
                </Tooltip>
              ),
          }))}
      />
    </Box>
  );
}
