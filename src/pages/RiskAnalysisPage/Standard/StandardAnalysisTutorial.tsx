import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import Joyride, { Step, ACTIONS, EVENTS, STATUS, CallBackProps, LIFECYCLE } from "react-joyride";
import { useState } from "react";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import TourTooltip from "../../../components/TourTooltip";

export default function StandardAnalysisTutorial({
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
            <Trans i18nKey="rfAnalysis.tutorial.1.1">
              This is the <i>Risk Analysis</i> page.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfAnalysis.tutorial.1.2">
              It displays the consolidated results of the BNRA analysis process for this risk file.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: ".bnra-sankey",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfAnalysis.tutorial.2.1">
              This section visualises the quantitative results of the analyses and the subsequent risk calculations.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: ".sankey-probability",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfAnalysis.tutorial.3.1">On the left are the results of the probability analysis.</Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfAnalysis.tutorial.3.3">
              The causes displayed here should explain about 80% of the total probability of the risk. Any other
              potential cause can be found under "Other".{" "}
            </Trans>
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
            <Trans i18nKey="rfAnalysis.tutorial.3.2">
              The total probability is calculated as the sum of potential underlying causes (i.e. other risks in the
              risk catalogue) and the direct probability (i.e. internal causes that are not in the risk library).
            </Trans>
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
            <Trans i18nKey="rfAnalysis.tutorial.5.1">
              For each cause, experts were asked to estimate the strength of the link between these two risks, which is
              reflected in the size of the sankey leg.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfAnalysis.tutorial.5.2">
              You can hover over each cause (when this tutorial is finished) to get some more information about the
              link, or click on it to navigate to the respective risk file.
            </Trans>
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
      target: ".mrs",
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
      target: ".probability-assess",
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
