import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import Joyride, { Step, ACTIONS, EVENTS, STATUS, CallBackProps, LIFECYCLE } from "react-joyride";
import { useState } from "react";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import TourTooltip from "../../../components/TourTooltip";
import { STEPS } from "../Steps";

export default function Step2ATutorial({
  run,
  setRun,
  setStep,
}: {
  run: boolean;
  setRun: (r: boolean) => void;
  setStep: (step: STEPS) => void;
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
            <Trans i18nKey="2A.tutorial.1.1">
              Welcome to the tutorial for step "Analysis A" in the BNRA Risk Analysis Application.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#step2A-progress-bar",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.2.1">This step is divided into 5 sections:</Trans>
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="2A.tutorial.2.2">An introduction page</Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="2A.tutorial.2.3">3 analysis pages, 1 for each scenario of intensity</Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="2A.tutorial.2.4">A review page to check and compare your inputs</Trans>
              </Typography>
            </li>
          </ul>
        </Box>
      ),
      styles: { options: { width: 800 } },
    },
    {
      target: "#step2A-next-buttons",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.3.1">
              The <b>NEXT</b> button will save your input on the current page and navigate to the next section.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.3.2">
              The <b>SAVE & EXIT</b> button will save your input and navigate to the <i>My Risks</i> page. You may use
              this button to pause your analysis and continue at a later time.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "body",
      placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.4.1">This section shows the considerable scenario.</Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "#step2A-scenario-description",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.5.1">
              The scenario description that was proposed in the validation phase is shown in this box.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#step2A-scenario-description-scroll",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.5.3">
              This box will stay visible at the top of the page when you scroll down for easy reference during analysis.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#step2A-scenario-description-collapse",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.6.1">
              If the box takes up too much of your screen, you may click here to collapse it.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#step2A-dp-quantitative-box",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.7.1">
              The sliders allow you to input your estimations for different parameters. This one is for the{" "}
              <b>direct</b> probability.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#step2A-dp-mark-1",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.8.1">
              If you hover over the scales, the corresponding threshold values are shown.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
      disableOverlay: true,
    },
    {
      target: "#step2A-dp-quali-box",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.9.1">
              These textboxes should be used to explain the reasoning for the quantitative estimation above.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#step2A-h-quantitative-box",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.10.1">
              The impact scales usually have multiple damage indicators, in this case 3.
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "#step2A-hb-calculator",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.11.1">
              Some damage indicators require a more complex calculation with weights for different types of damage. To
              help you with this calculation, a calculator is provided which can be accessed by clicking this button
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
    {
      target: "body",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2A.tutorial.12.1">
              Some damage indicators require a more complex calculation with weights for different types of damage. To
              help you with this calculation, a calculator is provided which can be accessed by clicking this button
            </Trans>
          </Typography>
        </Box>
      ),
      styles: { options: { width: 600 } },
    },
  ];

  const handleTutorialCallback = (data: CallBackProps) => {
    const { action, index, status, type, lifecycle } = data;
    console.log(data);
    if (action === ACTIONS.NEXT && index === 2 && lifecycle === LIFECYCLE.COMPLETE) {
      setStep(STEPS.CONSIDERABLE);
      setRun(false);

      setTimeout(() => {
        setRun(true);
        setStepIndex(3);
      }, 1000);

      return;
    }

    if (action === ACTIONS.NEXT && index === 4 && lifecycle === LIFECYCLE.COMPLETE) {
      window.scrollTo({
        top: 1000,
        behavior: "smooth",
      });

      setRun(false);

      setTimeout(() => {
        setRun(true);
        setStepIndex(5);
      }, 1000);

      return;
    }

    if (action === ACTIONS.NEXT && index === 6 && lifecycle === LIFECYCLE.COMPLETE) {
      const collapseButton = document.getElementById("step2A-scenario-description-collapse")?.parentElement
        ?.parentElement;

      if (collapseButton) collapseButton.click();
    }

    if (action === ACTIONS.NEXT && index === 8 && lifecycle === LIFECYCLE.COMPLETE) {
      const dpMark = document.getElementById("step2A-dp-mark-1");

      if (dpMark) {
        const e = new Event("mouseover");
        dpMark.dispatchEvent(e);
      }
    }

    if (action === ACTIONS.NEXT && index === 11 && lifecycle === LIFECYCLE.COMPLETE) {
      const calculatorButton = document.getElementById("step2A-hb-calculator");

      if (calculatorButton) calculatorButton.click();
    }

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
        disableScrolling={stepIndex === 5 || stepIndex === 6}
      />
    </>
  );
}
