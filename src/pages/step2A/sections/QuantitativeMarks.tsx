import { useEffect, useState } from "react";
import { DPRows, DPs, DPValueStack } from "../../learning/QuantitativeScales/P";
import { Box, Stack, Typography, Slider, Alert } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Trans } from "react-i18next";
import { DirectImpactField, DIValueStack } from "../../learning/QuantitativeScales/DI";
import { MValueStack } from "../../learning/QuantitativeScales/M";

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
            <Trans i18nKey="2A.error.p.quanti.required">
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
                    DP{value + 1}
                  </Typography>
                </Tooltip>
              ),
          }))}
      />
    </Box>
  );
}

export function MSlider({
  initialValue,
  error,
  onChange,
}: {
  initialValue: string | null;
  error?: boolean;
  onChange: (value: string | null) => void;
}) {
  const [value, setValue] = useState(initialValue ? parseInt(initialValue.replace("M", ""), 10) : -1);

  const handleChangeValue = (event: Event, newValue: number | number[]) => {
    if (newValue < 0) {
      onChange(null);
    } else {
      const t = `M${(newValue as number) + 1}`;

      onChange(t);
    }

    setValue(newValue as number);
  };

  return (
    <Box sx={{ mx: 2, mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, ml: -2 }}>
          <Typography>
            <Trans i18nKey="2A.m.error.quanti.required">
              Please make an estimation of the motivation, even if you are unsure.
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
        max={3}
        valueLabelFormat={(value: number) => <MValueStack value={value} />}
        marks={Array(5)
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
                  title={<MValueStack value={value} />}
                  PopperProps={{
                    sx: {
                      [`& .${tooltipClasses.tooltip}`]: {
                        maxWidth: "none",
                      },
                    },
                  }}
                >
                  <Typography id={`step2A-m-mark-${value}`} variant="body2">
                    M{value}
                  </Typography>
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
  overrideValue,
  resetOverrideValue,
  error,
  onChange,
}: {
  field: DirectImpactField;
  initialValue: string | null;
  overrideValue?: string;
  resetOverrideValue?: () => void;
  error?: boolean;
  onChange: (value: string | null, field: DirectImpactField) => void;
}) {
  const parseValue = (scale: string | null | undefined) => (scale ? parseInt(scale.replace(field.prefix, ""), 10) : -1);

  const [value, setValue] = useState(parseValue(initialValue));

  const handleChangeValue = (event: unknown, newValue: number | number[]) => {
    if (newValue < 0) {
      onChange(null, field);
    } else {
      const t = `${field.prefix}${newValue}`;

      onChange(t, field);
    }

    setValue(newValue as number);
  };

  useEffect(() => {
    if (overrideValue) {
      setValue(parseValue(overrideValue));
      if (resetOverrideValue) resetOverrideValue();
    }
  }, [overrideValue]);

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
        valueLabelDisplay="auto"
        step={1}
        min={-1}
        max={field.intervals.length - 1}
        valueLabelFormat={(value: number) => <DIValueStack field={field} value={value} />}
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
                  title={<DIValueStack field={field} value={value} />}
                  PopperProps={{
                    sx: {
                      [`& .${tooltipClasses.tooltip}`]: {
                        maxWidth: "none",
                      },
                    },
                  }}
                >
                  <Typography variant="body2">{`${field.prefix}${value}`}</Typography>
                </Tooltip>
              ),
          }))}
      />
    </Box>
  );
}
