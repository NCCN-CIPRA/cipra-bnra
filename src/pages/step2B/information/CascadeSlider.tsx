import { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Tooltip,
  Paper,
  Fade,
  Container,
  Drawer,
  Slider,
  Alert,
  Typography,
  tooltipClasses,
  Stack,
  Button,
  Slide,
  IconButton,
  Link,
} from "@mui/material";
import { SliderThumb } from "@mui/material/Slider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Trans, useTranslation } from "react-i18next";
import { CP } from "../../learning/QuantitativeScales/CP";

interface AirbnbThumbComponentProps extends React.HTMLAttributes<unknown> {}

function ArrowThumbComponent(props: AirbnbThumbComponentProps) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <KeyboardArrowDownIcon sx={{ color: "white" }} />
    </SliderThumb>
  );
}

function preventHorizontalKeyboardNavigation(event: React.KeyboardEvent) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
  }
}

export default function CascadeSlider({
  cp,
  setCP,
  showPreviousButton,
  showNextButton,
  onNextScenario,
  onPreviousScenario,
  onSave,
}: {
  cp: number;
  setCP: (newCP: number) => void;
  showPreviousButton: boolean;
  showNextButton: boolean;
  onNextScenario: () => void;
  onPreviousScenario: () => void;
  onSave: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Stack
      direction="row"
      sx={{
        height: 200,
        my: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "calc(50% - 300px)",
          right: "calc(50% - 230px)",
        }}
        id="cpx-slider"
      />
      <Typography
        variant="subtitle2"
        sx={{
          position: "absolute",
          width: 300,
          left: "calc(50% - 350px)",
          textAlign: "right",
        }}
      >
        <Trans i18nKey="2B.cp.title">Kans dat de cascade zich voordoet:</Trans>
      </Typography>
      <Box
        sx={{
          position: "absolute",
          width: 64,
          left: "calc(50% - 370px)",
        }}
      >
        <Tooltip title={t("2B.doneButton.back", "Go back")}>
          <span>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon sx={{ marginLeft: "8px", marginRight: "-4px" }} />}
              sx={{
                padding: "9px 5px",
                minWidth: "auto",
                borderRadius: "19px",
                opacity: showPreviousButton ? 1 : 0,
                transition: "opacity .5s ease",
              }}
              onClick={onPreviousScenario}
            />
          </span>
        </Tooltip>
      </Box>
      <Box
        sx={{
          position: "absolute",
          width: 300,
          right: "calc(50% - 200px)",
          textAlign: "right",
        }}
      >
        <Tooltip
          title={
            cp < 0
              ? t("2B.doneButton.selectValue", "Please select a value before continuing")
              : t("2B.doneButton.continue", "Continue")
          }
        >
          <span>
            <Button
              variant="outlined"
              startIcon={<ArrowForwardIcon sx={{ marginLeft: "8px", marginRight: "-4px" }} />}
              sx={{ padding: "9px 5px", minWidth: "auto", borderRadius: "19px", opacity: showNextButton ? 1 : 0 }}
              disabled={cp < 0}
              onClick={onNextScenario}
              className="next-button"
            />
          </span>
        </Tooltip>
      </Box>
      <Slider
        sx={{
          '& input[type="range"]': {
            WebkitAppearance: "slider-vertical",
          },
          "& .MuiSlider-rail": {
            width: 8,
            top: "-2%",
          },
          "& .MuiSlider-track": {
            width: 4,
            border: "4px solid #fafafa",
            bottom: "-4% !important",
          },
          "& .MuiSlider-thumb": {
            width: 26,
            height: 26,
          },
        }}
        orientation="vertical"
        value={5 - cp}
        onChange={(e, v) => {
          setCP(5 - (v as number));
        }}
        onChangeCommitted={() => {
          onSave();
        }}
        min={0}
        max={6}
        aria-label="Conditional Probability"
        valueLabelDisplay="off"
        onKeyDown={preventHorizontalKeyboardNavigation}
        track="inverted"
        components={{ Thumb: ArrowThumbComponent }}
        marks={Array(7)
          .fill(undefined)
          .map((_, value) => ({
            value: value,
            label:
              value >= 6 ? (
                <Typography variant="body2">
                  <Trans i18nKey="2A.slider.none">-</Trans>
                </Typography>
              ) : (
                <Typography id={`step2A-dp-mark-${5 - value}`} variant="body2">
                  <b>CP{5 - value}:</b> {t(CP.intervals[5 - value][0], CP.intervals[5 - value][1])}
                </Typography>
              ),
          }))}
      />
    </Stack>
  );
}
