import { Box, Typography, useTheme } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import Joyride, {
  Step,
  ACTIONS,
  EVENTS,
  STATUS,
  CallBackProps,
} from "react-joyride";
import { useState } from "react";
import TourTooltip from "../../components/TourTooltip";

export default function RiskFileSummaryTutorial({
  run,
  setRun,
}: // setStep,
// handleSetSpeeddialOpen,
{
  run: boolean;
  setRun: (r: boolean) => void;
  // setStep: (step: STEPS) => void;
  // handleSetSpeeddialOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [stepIndex, setStepIndex] = useState(0);

  const stepsTutorial: Step[] = [
    {
      target: "body",
      placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfSummary.tutorial.1.1">
              This is the first page of the risk file: The Risk File Summary.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfSummary.tutorial.1.2">
              It contains a very high-level overview of the risk file.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: ".MuiBottomNavigation-root",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfSummary.tutorial.2.1">
              From here, you may use the bottom navigation bar to explore the
              more in-depth sections of the risk file.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "#summary-text",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfSummary.tutorial.3.1">
              These sections contain a highly processed and summarized version
              of the respective pages of the risk file, which are accessible
              using the bottom navigation bar.
            </Trans>
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="hazardCatalogue.tutorial.3.2">
                  The Risk Description (i.e. definition, scenario parameters,
                  ...)
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="hazardCatalogue.tutorial.3.3">
                  The Risk Analysis (i.e. qualitative and quantitative results)
                </Trans>
              </Typography>
            </li>
          </ul>
        </Box>
      ),
    },
    {
      target: "#summary-charts",
      placement: "left",
      content: (
        <Box sx={{ textAlign: "left", maxWidth: 600 }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="hazardCatalogue.tutorial.4.1">
              On the right is a summary of the quantitative results, i.e. the
              probability and impact of the most relevant scenario of the risk.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="hazardCatalogue.tutorial.4.2">
              These parameters are all logarithmically scaled between 1 and 5,
              where each number corresponds to a qualitative value (Very Low,
              Low, Medium, High and Very High).
            </Trans>
          </Typography>
        </Box>
      ),
    },
  ];

  const handleTutorialCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)
    ) {
      // Update state to advance the tour
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if (status === STATUS.SKIPPED) {
      setRun(false);
      setStepIndex(-1);
    } else if (status === STATUS.FINISHED) {
      setStepIndex(0);
      setRun(false);
    }
  };

  return (
    <>
      <Joyride
        steps={stepsTutorial}
        run={run}
        stepIndex={stepIndex}
        continuous
        showSkipButton
        styles={{
          options: {
            primaryColor: theme.palette.primary.main,
            zIndex: 5000,
          },
        }}
        // floaterProps={{
        //   styles: {
        //     floaterWithComponent: {
        //       maxWidth: 600,
        //     },
        //   },
        // }}
        callback={handleTutorialCallback}
        scrollOffset={500}
        // disableScrolling={true},
        locale={{
          back: t("button.back", "Back"),
          last: t("button.last", "Exit"),
          close: t("button.close", "Exit"),
          next: t("button.next", "Next"),
          skip: t("button.skip", "Skip"),
        }}
        tooltipComponent={TourTooltip}
        disableScrolling={stepIndex === 1}
      />
    </>
  );
}
