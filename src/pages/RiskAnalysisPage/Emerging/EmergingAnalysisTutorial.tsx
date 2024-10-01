import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import Joyride, { Step, ACTIONS, EVENTS, STATUS, CallBackProps, LIFECYCLE } from "react-joyride";
import { useState } from "react";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import TourTooltip from "../../../components/TourTooltip";

export default function EmergingAnalysisTutorial({
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
            Page Intro
          </Typography>
          {/* <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.tutorial.1.1">
              This is the <i>Risk Description</i> page.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.tutorial.1.2">
              It contains some general information about the risk that was used as the basis for subsequent analyses by
              experts.
            </Trans>
          </Typography> */}
        </Box>
      ),
    },
    {
      target: ".catalyzing",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Catalyzing Effects
          </Typography>
        </Box>
      ),
    },
    {
      target: ".catalyzing > .MuiBox-root",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Catalyzed Risk
          </Typography>
        </Box>
      ),
    },
  ];

  const handleTutorialCallback = (data: CallBackProps) => {
    const { action, index, status, type, lifecycle } = data;

    // @ts-ignore-next-line
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
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
        floaterProps={{
          styles: {
            floaterWithComponent: {
              maxWidth: 600,
            },
          },
        }}
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
        disableScrolling={stepIndex === 6}
      />
    </>
  );
}
