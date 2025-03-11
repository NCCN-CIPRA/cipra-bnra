import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import Joyride, { Step, ACTIONS, EVENTS, STATUS, CallBackProps, LIFECYCLE } from "react-joyride";
import { useState } from "react";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import TourTooltip from "../../../components/TourTooltip";

export default function AttackTutorial({ run, setRun }: { run: boolean; setRun: (r: boolean) => void }) {
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
            <Trans i18nKey="2B.tutorial.MM.attacks.1.1">
              Tijdens dit onderdeel wordt u gevraagd de voorwaardelijke kansen in te schatten dat een mogelijk
              oorzaakrisico aanleiding zal geven tot het risico onder beschouwing.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.1.2">
              We gaan er dus van uit dat het oorzaakrisico reeds heeft plaatsgevonden en zoeken de kans dat het
              gevolgrisico daardoor ook zal plaatsvinden.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.1.3">
              Deze kans is uiteraard afhankelijk van het intensiteitsscenario (bv. een extreme sneeuwstorm zou vaker
              aanleiding kunnen geven tot een elektriciteitspanne dan een sneeuwstorm van het aanzienlijk scenario).
              Daarom moet voor elke koppel intensiteitsscenario's een aparte inschatting gemaakt worden.
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: "#quicknav-drawer > div",
      placement: "left",
      content: (
        <Box sx={{ textAlign: "left", maxWidth: 600 }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.3.1">
              Om snel tussen verschillende risicocascades te navigeren, kan u deze navigatiebalk gebruiken
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: "#cascade-title-text",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.2.1">
              De titel toont een tekstuele beschrijven van de risicocascade waarvoor een inschatting gevraagd wordt.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.2.2">
              Door te klikken op de naam van een risico's zal de desbetreffende risicofiche geopend worden in een nieuw
              tabblad.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.2.3">
              Achter de titel staat hoever u reeds gevorderd bent in de lijst van risicocascades.
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: "#analysis-box",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.4.1">
              De inschattingen van de voorwaardelijke kansen tussen scenario's kunnen hier ingegeven te worden.
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: "#cause-scenario",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.5.1">
              Dit is de beschrijving van het veroorzakende risicoscenario dat virtueel heeft plaatsgevonden.
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: "#effect-scenario",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.6.3">En hier wordt het mogelijke gevolgscenario beschreven.</Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: "#cpx-slider",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.7.1">
              Met deze slider kan je een CPx waarde kiezen die overeenstemt met een bepaald bereik van voorwaardelijke
              kansen
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: ".next-button",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.8.1">
              Als je een waarde gekozen hebt, kan je op een van deze knoppen drukken om naar het volgende scenario te
              gaan.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.8.2">
              De <b>VOLGENDE</b> knop onderaan de pagina doet hetzelfde.
            </Trans>
          </Typography>
        </Box>
      ),
      disableBeacon: true,
    },
    {
      target: "#cascade-summary-matrix",
      placement: "top",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.9.1">
              Deze tabel toon een overzicht van alle waardes die u gekozen hebt voor de huidige cascade
            </Trans>
          </Typography>
        </Box>
      ),
      disableOverlay: true,
      disableBeacon: true,
    },
    {
      target: "#quali-input",
      placement: "bottom",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="2B.tutorial.MM.attacks.10.1">
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

    if (
      (action === ACTIONS.NEXT && index === 0 && lifecycle === LIFECYCLE.COMPLETE) ||
      (action === ACTIONS.PREV && index === 2 && lifecycle === LIFECYCLE.COMPLETE)
    ) {
      if (!document.getElementById("quicknav-drawer")?.classList.contains("open")) {
        setRun(false);
        document.getElementById("quicknav-drawer-button")?.click();

        setTimeout(() => {
          setRun(true);
          setStepIndex(1);
        }, 400);
      }
    }

    if (action === ACTIONS.PREV && index === 1 && lifecycle === LIFECYCLE.COMPLETE) {
      if (document.getElementById("quicknav-drawer")?.classList.contains("open")) {
        setRun(false);
        document.getElementById("quicknav-drawer-button")?.click();

        setTimeout(() => {
          setRun(true);
          setStepIndex(0);
        }, 400);
      }
    }

    if (action === ACTIONS.NEXT && index === 1 && lifecycle === LIFECYCLE.COMPLETE) {
      setRun(false);

      if (document.getElementById("quicknav-drawer")?.classList.contains("open")) {
        document.getElementById("quicknav-drawer-button")?.click();
      }

      window.scrollTo({
        behavior: "smooth",
        top: window.scrollY + (document.getElementById("cascade-title")?.getBoundingClientRect().top || 0) - 120,
      });

      setTimeout(() => {
        setRun(true);
        setStepIndex(2);
      }, 300);
    }

    if (action === ACTIONS.NEXT && index === 4 && lifecycle === LIFECYCLE.COMPLETE) {
      setRun(false);

      window.scrollTo({
        behavior: "smooth",
        top: window.scrollY + (document.getElementById("effect-scenario")?.getBoundingClientRect().top || 0) - 450,
      });

      setTimeout(() => {
        setRun(true);
        setStepIndex(5);
      }, 300);
    }

    if (action === ACTIONS.PREV && index === 5 && lifecycle === LIFECYCLE.COMPLETE) {
      setRun(false);

      window.scrollTo({
        behavior: "smooth",
        top: window.scrollY + (document.getElementById("cascade-title")?.getBoundingClientRect().top || 0) - 120,
      });

      setTimeout(() => {
        setRun(true);
        setStepIndex(4);
      }, 300);
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
        disableScrolling={stepIndex <= 7}
      />
    </>
  );
}
