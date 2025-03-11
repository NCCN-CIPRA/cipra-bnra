import { Box, IconButton, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import Joyride, { Step, ACTIONS, EVENTS, STATUS, CallBackProps } from "react-joyride";
import theme from "../../theme";
import { useState } from "react";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import TourTooltip from "../../components/TourTooltip";

export default function ValidationTutorial() {
  const { t } = useTranslation();

  const [run, setRun] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);

  const stepsTutorial: Step[] = [
    {
      target: "body",
      placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.intro.part1">
              Welcome to the <b>BNRA 2023 - 2026 Risk File Validation Application</b>, the first step in the risk
              analysis process!
            </Trans>
          </Typography>
          <Typography variant="body1">
            <Trans i18nKey="validation.tutorial.show">
              Would you like to follow a small tutorial explaining how to use the application?
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
      locale: { next: t("button.yes", "Yes"), skip: t("button.no", "No") },
    },
    {
      target: "body",
      placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.1.1">
              This page contains the <b>preliminary risk file</b> written by NCCN analists.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.1.2">
              The goal of this phase is the <b>validation and correction</b> (if needed) of the information in the
              preliminary risk file according to your topical expertise.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.1.3">
              Because the risk files will serve as the common basis for all of the following analytical phases, it is of
              utmost importance that the information they hold is correct and complete.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#definition-container",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.2.1">Each risk file is divided into several sections.</Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.2.2">
              For each section, we kindly ask you to carefully consider its existing contents proposed by NCCN analists.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 800 } },
    },
    {
      target: "#definition-help-button",
      placement: "bottom-end",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.3.1">
              For more background information on the purpose of a section, you can click this button.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#definition-container .attachment-expand-button",
      placement: "top-end",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.4.1">
              Any sources that were used by NCCN Analists can be consulted by clicking this button.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "#defintion-feedback",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.5.1">
              This input box should be used to provide any corrections, remarks, elaborations etc. on the content of the
              section.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.5.2">
              All input may be provided in the language you feel most comfortable with.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#definition-container .add-attachment-button",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.5.3">
              Press this button to add your own source material if it is available.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#save-button",
      disableScrolling: true,
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.6.1">
              Your changes are saved automatically every few seconds, but you can click this button to save manually.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#save-and-exit-button",
      disableScrolling: true,
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.7.1">
              When you are finished or would like to continue another time, click this button to return to the list of
              risks and save your progress.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#tutorialButton",
      disableScrolling: true,
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="validation.tutorial.8.1">Press this button to replay the tutorial.</Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
  ];

  const stepsSkip: Step[] = [
    {
      disableBeacon: true,
      target: "#tutorialButton",
      disableScrolling: true,
      placement: "top-end",
      content: (
        <Typography variant="body1">
          <Trans i18nKey="validation.tutorial.change">If you change your mind, just click this button.</Trans>
        </Typography>
      ),
      styles: { options: { width: 600 } },
    },
  ];

  const handleTutorialCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

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

    if (action === "update" && index === 3) {
      setTimeout(() => {
        (
          document.querySelectorAll("#definition-container .attachment-expand-button")[0] as HTMLElement | null
        )?.click();
      }, 2000);
    } else if (type === EVENTS.STEP_AFTER && index === 3) {
      (document.querySelectorAll("#definition-container .attachment-expand-button")[0] as HTMLElement | null)?.click();
    }
  };

  const handleSkipCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    // @ts-ignore-next-line
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND, STATUS.SKIPPED, STATUS.FINISHED].includes(type)) {
      // Update state to advance the tour
      setStepIndex(0);
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
            zIndex: 1500,
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
      />
      <Joyride
        steps={stepsSkip}
        scrollToFirstStep={false}
        disableScrolling={true}
        disableScrollParentFix={true}
        run={stepIndex === -1}
        styles={{
          options: {
            primaryColor: theme.palette.primary.main,
          },
        }}
        callback={handleSkipCallback}
        locale={{
          back: t("button.back", "Back"),
          last: t("button.last", "Exit"),
          close: t("button.close", "Exit"),
          next: t("button.next", "Next"),
          skip: null,
        }}
        tooltipComponent={TourTooltip}
      />

      <IconButton id="tutorialButton" sx={{ position: "fixed", bottom: 60, left: 8 }} onClick={() => setRun(true)}>
        <LiveHelpIcon color="primary" />
      </IconButton>
    </>
  );
}
