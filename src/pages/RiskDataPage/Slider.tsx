import {
  Box,
  Slider as MuiSlider,
  SliderThumb,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Indicators } from "../../types/global";
import {
  getReturnPeriodYearsIntervalStringDPScale5,
  getReturnPeriodYearsIntervalStringPScale7,
} from "../../functions/indicators/probability";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import {
  getImpactStringDIScale5,
  getImpactStringIScale7,
} from "../../functions/indicators/impact";
import {
  getIntervalStringMScale3,
  getIntervalStringMScale7,
} from "../../functions/indicators/motivation";

function getTooltipTitle(
  prefix: string,
  value: number,
  indicators: Indicators,
) {
  if (prefix === "DP") {
    const rpInterval =
      indicators === Indicators.V1
        ? getReturnPeriodYearsIntervalStringDPScale5(value)
        : getReturnPeriodYearsIntervalStringPScale7(value);

    if (rpInterval === null)
      return "This estimation indicates that the scenario is impossible";

    return `This estimation represents a return period for this scenario of ${rpInterval}.`;
  } else if (prefix === "M") {
    return `This estimation indicates that there is a probability ${
      indicators === Indicators.V1
        ? getIntervalStringMScale3(value)
        : getIntervalStringMScale7(value)
    } of at least one successfull attack in the following 3 years`;
  } else {
    const impactString =
      indicators === Indicators.V1
        ? getImpactStringDIScale5(value, prefix)
        : getImpactStringIScale7(value, prefix);

    return `This estimation represents the following expected impact: ${impactString}.`;
  }
}

export function Slider({
  initialValue,
  prefix,
  maxScale = 5,
  compareValue = null,
  onChange = null,
}: {
  initialValue: number;
  prefix: string;
  maxScale: number;
  compareValue?: number | null;
  onChange?: ((newValue: number) => unknown) | null;
}) {
  const { indicators } = useOutletContext<BasePageContext>();
  const [value, setValue] = useState(initialValue);

  const handleChangeValue = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleChangeCommitted = (_event: unknown, newValue: number) => {
    if (onChange) onChange(newValue);
  };

  const comparePos = (compareVal: number) => {
    return Math.round((100 * compareVal) / (maxScale + 0.5));
  };

  return (
    <Box sx={{ position: "relative" }}>
      <MuiSlider
        value={value}
        onChange={onChange !== null ? handleChangeValue : undefined}
        onChangeCommitted={
          onChange !== null ? handleChangeCommitted : undefined
        }
        valueLabelDisplay="auto"
        step={0.5}
        min={0}
        max={maxScale + 0.5}
        valueLabelFormat={(value: number) => (
          <Stack direction="column" alignItems="flex-start">
            <Typography variant="subtitle2">
              {prefix}
              {value}
            </Typography>
            <Typography variant="body2">
              {getTooltipTitle(prefix, value, indicators)}
            </Typography>
          </Stack>
        )}
        marks={Array(maxScale + 1)
          .fill(undefined)
          .map((_, i) => i)
          .map((value) => ({
            value,
            label: (
              <Tooltip title={getTooltipTitle(prefix, value, indicators)}>
                <Typography variant="body2">
                  {prefix}
                  {value}
                </Typography>
              </Tooltip>
            ),
          }))}
      />
      {compareValue !== null && compareValue !== value && (
        <Tooltip
          title={`This value was changed. The original value (compared to the public environment) was ${prefix}${compareValue}`}
        >
          <SliderThumb
            style={{
              opacity: 0.3,
              top: 5,
              left: `calc(${comparePos(compareValue)}% - 9px)`,
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
}
