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

export default function RiskEvolutionTutorial({
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
            <Trans i18nKey="rfEvolution.tutorial.1.1">
              This is the <i>Risk Evolution</i> page.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.1.2">
              It contains information about which emerging risks may or may not
              cause an evolution of the probability or impact of the considered
              risk in the future.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "body",
      placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.2.1">
              In every standard risks file you can find a climate change graph
              which only shows different probabilities (Total probability,
              Direct probability and Indirect probability) as climate change
              measures differences in probability between 2023 and 2050.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.2.2">
              The re-evaluation for 2050 of the direct probabilities for
              standard risks directly influenced by climate change, considers
              one single climate evolution trajectory described by:
            </Trans>
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="rfEvolution.tutorial.2.3">
                  either the most extreme shared socio-economic pathway of the
                  6th IPCC Assessment Report, the SSP5-8.5 trajectory, which
                  assumes an energy-intensive economy based on fossil fuels, or,
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="rfEvolution.tutorial.2.4">
                  alternatively, by the representative RCP5-8.5 concentration
                  pathway from the Fifth Assessment Report of the IPCC.
                </Trans>
              </Typography>
            </li>
          </ul>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.2.5">
              More information about each pathway may be found in the{" "}
              <i>Climate Change</i> risk file.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: "body",
      placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.3.1">
              Some risks will be <b>directly influenced</b> without being the
              result of another risk occurring, while others are only{" "}
              <b>indirectly influenced</b> by climate change, or in other words
              get influenced through other risks which do change under the
              influence of climate change.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.3.2">For example:</Trans>
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="rfEvolution.tutorial.3.3">
                  <u>Heatwaves</u>: No other risk in the risk catalogue can be
                  found that causes Heatwaves and which is also susceptible to
                  climate change. Heatwaves are only directly influenced by
                  climate change.
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="rfEvolution.tutorial.3.4">
                  <u>Dam failure</u>: It is not Climate Change which will
                  directly provoke dam failures. Instead, increased occurrences
                  of fluvial floods due to CC might indirectly influence the
                  occurrence of dam failures.
                </Trans>
              </Typography>
            </li>
          </ul>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.3.5">
              Only standard risks <b>directly influenced</b> by climate change
              underwent a reevaluation of their direct probability. But almost
              every risk is <b>indirectly influenced</b> by climate change,
              though sometimes only by a negligible amount.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: ".cc-chart",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.4.1">
              This chart shows how the total probability of all 3 scenarios of
              this risk are being influenced by climate change.
            </Trans>
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="rfEvolution.tutorial.4.2">
                  The top section shows the total probability (TP) of the
                  considered risk. This ‘Total probability’ consists of a
                  combination of the ‘Direct probability’ and the ‘Indirect
                  probabilities’.
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="rfEvolution.tutorial.4.3">
                  The ‘Direct probability’ can be found in the chart next to “No
                  underlying cause”. It is present when the considered standard
                  risk is directly influenced by climate change and absent when
                  it is not directly influenced by climate change.
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="rfEvolution.tutorial.4.4">
                  The ‘Indirect probabilities’ can (in part) be found in the
                  graph next to the different risk names.
                </Trans>
              </Typography>
            </li>
          </ul>
        </Box>
      ),
    },
    {
      target: ".cc-chart",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.5.1">
              <b>For the period 2023-2026</b> all types of probabilities (Total
              probability, Direct probability and Indirect probability) are
              always visualized for 3 scenarios:
            </Trans>
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="rfEvolution.tutorial.5.2">
                  Blue for the considerable scenario
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="rfEvolution.tutorial.5.3">
                  Yellow for the major scenario
                </Trans>
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Trans i18nKey="rfEvolution.tutorial.5.4">
                  Pink for the extreme scenario
                </Trans>
              </Typography>
            </li>
          </ul>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.5.5">
              The <b>yellow line</b> next to an indirect causing risk represents
              how much the occurrence of all intensity scenarios of that
              indirect causing risk contribute to the occurrence of the major
              considered risk.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.5.6">
              When considering the influence of climate change for 2050 we
              compare the probabilities for 2023 with those for 2050 and
              visualise increases in red and decreases in green. This is again
              done for types of probabilities (Total probability, Direct
              probability and Indirect probability).
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: ".cc-chart",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.6.1">
              A pop up will appear when you hover with your mouse over one of
              the different probability elements of the chart. This will show,
              for each of the 3 scenarios, the probability values for 2023 and
              2050 as well as a percentage expressing how much the probability
              changed over time.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.6.2">
              In the chart, the direct and indirect causes have been ranked,
              according to the average change they underwent due to climate
              change. The bigger the change the higher it will be visualized in
              the graph.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.6.3">
              Note that the causing risks which appear in the graph are not
              necessarily <b>important causes</b>, for the occurrence of the
              considered risk. These can be found in the Sankey diagrams of the
              considered risk for 2023 that can be found under the “Risk
              Analysis” tab.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: ".cc-quali",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.7.1">
              Below the Climate Change chart you can find a qualitative
              reasoning.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.7.2">
              In the case the concerned standard risk file is{" "}
              <b>directly influenced by climate change</b> – this qualitative
              reasoning holds a copy of the new generated qualitative input
              which you can find under the climate change risk file. This
              reasoning is then completed by an additional analysis of the
              climate change chart itself.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.7.3">
              In the case the concerned standard risk file is{" "}
              <b>NOT directly influenced by climate change</b> – this
              qualitative reasoning only consists of an analysis of the chart
              itself.
            </Trans>
          </Typography>
        </Box>
      ),
    },
    {
      target: ".catalyzing-effects",
      // placement: "center",
      content: (
        <Box sx={{ textAlign: "left" }}>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.8.1">
              Finally, a list of other emerging risks that may have a catalysing
              effect on this risk is provided.
            </Trans>
          </Typography>
          <Typography variant="body1" my={2}>
            <Trans i18nKey="rfEvolution.tutorial.8.2">
              You may click on these for more qualitative information about
              these catalysing effects.
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
