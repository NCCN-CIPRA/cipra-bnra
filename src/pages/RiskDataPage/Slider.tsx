import { Box, Slider as MuiSlider, Tooltip, Typography } from "@mui/material";

export function Slider({
  value,
  prefix,
  maxScale = 5,
}: {
  value: number;
  prefix: string;
  maxScale: number;
}) {
  // const [value] = useState(initialValue);

  //   const handleChangeValue = (_event: Event, newValue: number | number[]) => {
  //     setValue(newValue as number);
  //   };

  //   const handleChangeCommitted = (
  //     _event: unknown,
  //     newValue: number | number[]
  //   ) => {
  //     if (onChange) onChange(`${prefix}${newValue}`);
  //   };

  //   const max = 5.5;
  //   const spreadMin = spread ? (100 * spread[0]) / max : 0;
  //   const spreadMax = spread ? (100 * spread[1]) / max : 0;

  return (
    <Box
      sx={
        {
          // mx,
          // mt: 2,
          // "& .MuiSlider-track": {
          //   // display: "none"
          //   left: `${spreadMin}% !important`,
          //   width: `${spreadMax - spreadMin}% !important`,
          //   opacity: 0.6,
          // },
        }
      }
    >
      <MuiSlider
        value={value}
        // onChange={onChange !== null ? handleChangeValue : undefined}
        // onChangeCommitted={
        //   onChange !== null ? handleChangeCommitted : undefined
        // }
        valueLabelDisplay="auto"
        step={0.5}
        min={0}
        max={maxScale + 0.5}
        valueLabelFormat={(value: number) => (
          <Typography variant="body2">
            {prefix}
            {value}
          </Typography>
        )}
        marks={Array(maxScale + 1)
          .fill(undefined)
          .map((_, i) => i)
          .map((value) => ({
            value,
            label: (
              <Tooltip
                //   title={getValueStack(prefix, value)}
                title={value}
                // PopperProps={{
                //   sx: {
                //     [`& .${tooltipClasses.tooltip}`]: {
                //       maxWidth: "none",
                //     },
                //   },
                // }}
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
