import { IconButton, useTheme } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Joyride, {
  Step,
  STATUS,
  EVENTS,
  CallBackProps,
  ACTIONS,
} from "react-joyride";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TourTooltip from "./TourTooltip";

export default function HelpButton({
  id,
  steps,
}: {
  id?: string;
  steps: Step[];
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const handleCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)
    ) {
      // Update state to advance the tour
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if (status === STATUS.FINISHED) {
      setStepIndex(0);
      setRun(false);
    }
  };

  return (
    <>
      <IconButton
        id={id}
        sx={{ float: "right", mt: "-8px" }}
        onClick={() => setRun(true)}
      >
        <InfoOutlinedIcon color="primary" />
      </IconButton>
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous
        styles={{
          options: {
            primaryColor: theme.palette.primary.main,
          },
        }}
        callback={handleCallback}
        scrollOffset={72}
        locale={{
          back: t("button.back", "Back"),
          last: t("button.last", "Exit"),
          close: t("button.close", "Exit"),
          next: t("button.next", "Next"),
          skip: t("button.skip", "Skip"),
        }}
        tooltipComponent={TourTooltip}
      />
    </>
  );
}
