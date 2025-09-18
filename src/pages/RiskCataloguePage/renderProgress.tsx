import * as React from "react";
import clsx from "clsx";
import { styled } from "@mui/material/styles";
import { GridRenderCellParams, GridValidRowModel } from "@mui/x-data-grid";

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
  const { value } = props;
  const valueInPercent = (100 * value) / 5;

  return (
    <Element>
      <Value>{value} / 5</Value>
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

  return (
    <Center>
      <ProgressBar value={params.value} />
    </Center>
  );
}
