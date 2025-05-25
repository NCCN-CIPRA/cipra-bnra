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

export default function HazardCatalogueTutorial({
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
            <Trans i18nKey="hazardCatalogue.tutorial.1.1">
              This page is shows the full &#quot;Risk Catalogue&#quot; of the
              BNRA.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: ".MuiTableRow-root:nth-child(2)",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="hazardCatalogue.tutorial.2.1">
              Each line contains some high-level information about a risk of the
              BNRA.
            </Trans>
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="hazardCatalogue.tutorial.2.2">
                  An identification code
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="hazardCatalogue.tutorial.2.3">
                  The name of the risk
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="hazardCatalogue.tutorial.2.4">
                  The category to which the risk belongs (cyber, emerging,
                  health, man-made, natural, societal or ecotech)
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="hazardCatalogue.tutorial.2.5">
                  The most relevant scenario of the risk (considerable, major or
                  extreme)
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="hazardCatalogue.tutorial.2.6">
                  The total probability and impact of the risk
                </Trans>
              </Typography>
            </li>
          </ul>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="hazardCatalogue.tutorial.2.7">
              You can click on any line to go to the corresponding risk file.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "#search-bar",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left", maxWidth: 600 }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="hazardCatalogue.tutorial.3.1">
              You may use the search bar to quickly filter the risk catalogue.
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
        // disableScrolling={stepIndex === 5 || stepIndex === 6}
      />
    </>
  );
}
