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
import TourTooltip from "../../../components/TourTooltip";

export default function StandardIdentificationTutorial({
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
            <Trans i18nKey="rfDescription.tutorial.1.1">
              This is the <i>Risk Description</i> page.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.tutorial.1.2">
              It contains some general information about the risk that was used
              as the basis for subsequent analyses by experts.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "#definition",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.s.tutorial.2.1">
              The base of each risk file is the definition. It determines the
              scope of the risk under study and in some cases it also specifies
              which elements fall outside the scope.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.s.tutorial.2.2">
              This section also specifies, if relevant, the differences between
              the risk studied and the other risks studied within the framework
              of this Belgian National Risk Assessment.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "#historical-events",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.s.tutorial.3.1">
              This section provides some examples of events related to the risk
              that occurred in Belgium or abroad.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.s.tutorial.3.2">
              It is by no means meant to be an exhaustive list.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "#scenarios",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.s.tutorial.4.1">
              Each risk of the BNRA is characterised using 3 intensity
              scenarios; a &#quot;<i>considerable</i>&#quot;, a &#quot;
              <i>major</i>&#quot; and an &#quot;<i>extreme</i>&#quot; scenario.
              These are built using risk-specific <b>intensity parameters</b>.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.s.tutorial.4.2">
              The <b>intensity parameters</b> are risk-specific factors that
              influence the development and consequences of the risk.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "#scenario-buttons",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.s.tutorial.4.3">
              The different scenario may be inspected using the buttons
              provided.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "#sources",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfDescription.s.tutorial.6.1">
              Every source that is referenced in the sections above can be found
              here.
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
