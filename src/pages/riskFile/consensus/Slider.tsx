import { useEffect, useState } from "react";
import { Box, Typography, Slider as MuiSlider, Alert } from "@mui/material";
import { getQuantiNumber } from "../../../functions/inputProcessing";
import { DPValueStack } from "../../learning/QuantitativeScales/P";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { MValueStack } from "../../learning/QuantitativeScales/M";
import { DIValueStack, DirectImpactField } from "../../learning/QuantitativeScales/DI";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { Ha, Hb, Hc } from "../../learning/QuantitativeScales/H";
import { Sa, Sb, Sc, Sd } from "../../learning/QuantitativeScales/S";
import { Ea } from "../../learning/QuantitativeScales/E";
import { Fa, Fb } from "../../learning/QuantitativeScales/F";

const prefixToField: { [prefix: string]: DirectImpactField } = {
  Ha: Ha,
  Hb: Hb,
  Hc: Hc,
  Sa: Sa,
  Sb: Sb,
  Sc: Sc,
  Sd: Sd,
  Ea: Ea,
  Fa: Fa,
  Fb: Fb,
};

const getValueStack = (prefix: string, value: number) => {
  if (prefix === "M") return <MValueStack value={value} />;
  else if (prefix === "DP") return <DPValueStack value={value} />;
  return <DIValueStack field={prefixToField[prefix]} value={value} />;
};

export function Slider({
  initialValue,
  name,
  spread,
  onChange,
}: {
  initialValue: string;
  name?: keyof DVDirectAnalysis;
  spread: number[];
  onChange: (newValue: string) => Promise<void>;
}) {
  const { prefix, number } = getQuantiNumber(initialValue);

  const [value, setValue] = useState(number);

  const handleChangeValue = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleChangeCommitted = (event: unknown, newValue: number | number[]) => {
    onChange(`${prefix}${newValue}`);
  };

  const max = 5.5;
  const spreadMin = (100 * spread[0]) / max;
  const spreadMax = (100 * spread[1]) / max;

  return (
    <Box
      sx={{
        mx: 2,
        mt: 2,
        "& .MuiSlider-track": {
          // display: "none"
          left: `${spreadMin}% !important`,
          width: `${spreadMax - spreadMin}% !important`,
          opacity: 0.6,
        },
      }}
    >
      <MuiSlider
        value={value}
        onChange={handleChangeValue}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="auto"
        step={0.5}
        min={0}
        max={5.5}
        valueLabelFormat={(value: number) => (
          <Typography variant="body2">
            {prefix}
            {value}
          </Typography>
        )}
        marks={Array(6)
          .fill(undefined)
          .map((_, i) => i)
          .map((value) => ({
            value,
            label: (
              <Tooltip
                title={getValueStack(prefix, value)}
                PopperProps={{
                  sx: {
                    [`& .${tooltipClasses.tooltip}`]: {
                      maxWidth: "none",
                    },
                  },
                }}
              >
                <Typography variant="body2">
                  {prefix}
                  {value}
                </Typography>
              </Tooltip>
            ),
          }))}
      />
    </Box>
  );
}
