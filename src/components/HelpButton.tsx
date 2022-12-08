import { IconButton, useTheme } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Joyride, { Step, STATUS, EVENTS, CallBackProps, ACTIONS } from "react-joyride";
import { useState } from "react";

export default ({ steps }: { steps: Step[] }) => {
  const theme = useTheme();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const handleCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

    // @ts-ignore-next-line
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
    } else if (status === STATUS.FINISHED) {
      setStepIndex(0);
      setRun(false);
    }
  };

  return (
    <>
      <IconButton sx={{ float: "right" }} onClick={() => setRun(true)}>
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
      />
    </>
  );
};
