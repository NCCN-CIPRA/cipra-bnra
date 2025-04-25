import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import Joyride, {
  Step,
  ACTIONS,
  EVENTS,
  STATUS,
  CallBackProps,
} from "react-joyride";
import { useState } from "react";
import TourTooltip from "../../../components/TourTooltip";

export default function MMAnalysisTutorial({
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
      target: ".bnra-sankey",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Quantitative Results Overview
          </Typography>
        </Box>
      ),
    },
    {
      target: ".sankey-actions",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Probability Sankey
          </Typography>
        </Box>
      ),
    },
    {
      target: ".total-probability",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Total probability
          </Typography>
        </Box>
      ),
    },
    {
      target: ".probability-cause",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Probability sankey cause
          </Typography>
        </Box>
      ),
    },
    {
      target: ".sankey-impact",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Impact Sankey
          </Typography>
        </Box>
      ),
    },
    {
      target: ".total-impact",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Total impact
          </Typography>
        </Box>
      ),
    },
    {
      target: ".impact-effect",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Impact Sankey Effect
          </Typography>
        </Box>
      ),
    },
    {
      target: ".sankey-charts",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Center Charts
          </Typography>
        </Box>
      ),
    },
    {
      target: ".sankey-probability-bars",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Probability Bars
          </Typography>
        </Box>
      ),
    },
    {
      target: ".sankey-scenarios",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Sankey scenario buttons
          </Typography>
        </Box>
      ),
    },
    {
      target: ".category-impacts",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Impact per category/damage indicators
          </Typography>
        </Box>
      ),
    },
    {
      target: ".mrag",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Most relevant scenario
          </Typography>
        </Box>
      ),
    },
    {
      target: ".actions-assess",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Probability assessment
          </Typography>
        </Box>
      ),
    },
    {
      target: ".impact-assess",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Impact assessment
          </Typography>
        </Box>
      ),
    },
    {
      target: ".cb-impact",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            Cross border impact
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
