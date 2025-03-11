import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import Joyride, { Step, ACTIONS, EVENTS, STATUS, CallBackProps, LIFECYCLE } from "react-joyride";
import { useState } from "react";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import TourTooltip from "../../../components/TourTooltip";

export default function CCTutorial({ run, setRun }: { run: boolean; setRun: (r: boolean) => void }) {
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
            <Trans i18nKey="2B.tutorial.climateChange.1.1">
              Tijdens dit onderdeel wordt u gevraagd de gewijzigde directe waarschijnlijkheid in te schatten van het
              risico onder beschouwing ten gevolge van klimaatverandering.
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: "#cc-title",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.climateChange.2.1">
              Door te klikken op de titel zal de risicofiche voor klimaatverandering geopend worden in een nieuw
              tabblad.
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: "#considerable-scenario",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.climateChange.21.1">
              Voor elk intensiteitsscenario moet een nieuwe waarde opgegeven worden.
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: ".original-dp-value",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.climateChange.3.1">
              Deze pijl geeft de door u opgeven waarde voor DP in analysestap A weer.
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: ".MuiSlider-thumb",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.climateChange.4.1">
              Door deze knop te verslepen, kan u de waarde voor DP2050 instellen
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: "#quali-input",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2BS.tutorial.climateChange.10.1">
              Ten slotte kan u in dit tekstveld een kwalitatieve verklaring opgeven voor de eerder gekozen waardes.
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
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
        // floaterProps={{
        //   styles: {
        //     floaterWithComponent: {
        //       maxWidth: 600,
        //     },
        //   },
        // }}
        callback={handleTutorialCallback}
        scrollOffset={100}
        // disableScrolling={true},
        locale={{
          back: t("button.back", "Back"),
          last: t("button.last", "Exit"),
          close: t("button.close", "Exit"),
          next: t("button.next", "Next"),
          skip: t("button.skip", "Skip"),
        }}
        tooltipComponent={TourTooltip}
        // disableScrolling={stepIndex <= 7}
      />
    </>
  );
}
