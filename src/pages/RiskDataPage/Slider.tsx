import { useEffect, useState } from "react";
import { Box, Typography, Slider as MuiSlider, Alert } from "@mui/material";
import { getQuantiNumber } from "../../functions/inputProcessing";
import { DPValueStack } from "../learning/QuantitativeScales/P";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { MValueStack } from "../learning/QuantitativeScales/M";
import { DIValueStack, DirectImpactField } from "../learning/QuantitativeScales/DI";
import { Ha, Hb, Hc } from "../learning/QuantitativeScales/H";
import { Sa, Sb, Sc, Sd } from "../learning/QuantitativeScales/S";
import { Ea } from "../learning/QuantitativeScales/E";
import { Fa, Fb } from "../learning/QuantitativeScales/F";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";

const nameToPrefix = (name: string, type: RISK_TYPE) => {
  if (name.indexOf("_dp_") >= 0) {
    if (type === RISK_TYPE.STANDARD) return "DP";
    return "M";
  }

  const pLC = name.slice(-4, -2);
  return `${pLC[0].toUpperCase()}${pLC[1]}`;
};

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
  else if (prefix === "DP") return <DPValueStack value={value - 1} />;
  return <DIValueStack field={prefixToField[prefix]} value={value} />;
};

export function Slider({
  initialValue,
  name = "cr4de_dp_quanti_c",
  type = RISK_TYPE.STANDARD,
  spread,
  mx = 2,
  onChange,
}: {
  initialValue: string | null;
  name?: keyof DVRiskFile;
  type?: RISK_TYPE;
  spread: number[] | null;
  mx?: number;
  onChange: ((newValue: string) => Promise<void>) | null;
}) {
  let prefix: string, number: number;

  if (initialValue === null) {
    prefix = nameToPrefix(name, type);
    number = 0;
  } else {
    ({ prefix, number } = getQuantiNumber(initialValue));
  }

  const [value, setValue] = useState(number);

  const handleChangeValue = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleChangeCommitted = (event: unknown, newValue: number | number[]) => {
    if (onChange) onChange(`${prefix}${newValue}`);
  };

  const max = 5.5;
  const spreadMin = spread ? (100 * spread[0]) / max : 0;
  const spreadMax = spread ? (100 * spread[1]) / max : 0;

  return (
    <Box
      sx={{
        mx,
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
        onChange={onChange !== null ? handleChangeValue : undefined}
        onChangeCommitted={onChange !== null ? handleChangeCommitted : undefined}
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
