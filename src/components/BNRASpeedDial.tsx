import { Fab, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../pages/BasePage";
import { useState } from "react";

export default function BNRASpeedDial({
  offset = { x: 0, y: 0 },
  HelpComponent,
  editAction,
  exportAction,
}: {
  offset?: { x: number; y: number };
  HelpComponent?: React.ComponentType<{
    run: boolean;
    setRun: (r: boolean) => void;
    // setStep: (step: STEPS) => void;
    // handleSetSpeeddialOpen: (open: boolean) => void;
  }>;
  editAction?: () => void;
  exportAction?: () => void;
}) {
  const { user } = useOutletContext<BasePageContext>();

  const [runTutorial, setRunTutorial] = useState(false);

  if (HelpComponent && !(user && user.roles.internal && exportAction) && !(user && user.roles.analist && editAction)) {
    return (
      <>
        <Fab
          sx={{ position: "fixed", bottom: 16 + offset.y, right: 16 + offset.x }}
          color="primary"
          onClick={() => setRunTutorial(true)}
        >
          <QuestionMarkIcon />
        </Fab>
        {HelpComponent && <HelpComponent run={runTutorial} setRun={setRunTutorial} />}
      </>
    );
  }

  return (
    <>
      <SpeedDial
        ariaLabel="BNRA Speeddial"
        sx={{ position: "fixed", bottom: 16 + offset.y, right: 16 + offset.x }}
        icon={<SpeedDialIcon />}
      >
        {HelpComponent && (
          <SpeedDialAction icon={<QuestionMarkIcon />} tooltipTitle={"Help"} onClick={() => setRunTutorial(true)} />
        )}
        {user && user.roles.internal && exportAction && (
          <SpeedDialAction icon={<PrintIcon />} tooltipTitle={"Export PDF"} onClick={exportAction} />
        )}
        {user && user.roles.analist && editAction && (
          <SpeedDialAction icon={<EditIcon />} tooltipTitle={"Edit Page"} onClick={editAction} />
        )}
      </SpeedDial>
      {HelpComponent && <HelpComponent run={runTutorial} setRun={setRunTutorial} />}
    </>
  );
}
