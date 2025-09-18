import * as React from "react";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import { GridRenderCellParams, GridValidRowModel } from "@mui/x-data-grid";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import { Indicators } from "../../types/global";
import round from "../../functions/roundNumberString";
import { Typography } from "@mui/material";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";

interface ProgressBarProps {
  value: number;
}

const Center = styled("div")({
  height: "100%",
  display: "flex",
  alignItems: "center",
});

const Element = styled("div")(() => ({
  border: `1px solid #eee`,
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: 26,
  borderRadius: 2,
}));

const Value = styled("div")({
  position: "absolute",
  lineHeight: "24px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
});

const Bar = styled("div")({
  height: "100%",
  "&.low": {
    backgroundColor: "#f44336",
  },
  "&.medium": {
    backgroundColor: "#efbb5aa3",
  },
  "&.high": {
    backgroundColor: "#088208a3",
  },
});

const ProgressBar = React.memo(function ProgressBar(props: ProgressBarProps) {
  const { indicators } = useOutletContext<BasePageContext>();

  const maxScale = indicators === Indicators.V1 ? 5 : 7;
  const { value } = props;
  const valueInPercent = (100 * value) / maxScale;

  return (
    <Element>
      <Value>
        {round(value, 2)} / {maxScale}
      </Value>
      <Bar
        className={clsx({
          low: valueInPercent > 80,
          medium: valueInPercent >= 20 && valueInPercent <= 80,
          high: valueInPercent < 20,
        })}
        style={{ maxWidth: `${valueInPercent}%` }}
      />
    </Element>
  );
});

export function renderProgress(
  params: GridRenderCellParams<GridValidRowModel, number, unknown>
) {
  if (params.value == null) {
    return "";
  }
  if (params.row.cr4de_risk_type === RISK_TYPE.EMERGING)
    return (
      <Typography
        sx={{
          borderRadius: "50%",
          width: 30,
          minWidth: 30,
          height: 50,
          lineHeight: 50,
          pointerEvents: "none",
          ml: 8.5,
        }}
      >
        -
      </Typography>
    );

  return (
    <Center>
      <ProgressBar value={params.value} />
    </Center>
  );
}
