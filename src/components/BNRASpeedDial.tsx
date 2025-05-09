import {
  Dialog,
  DialogTitle,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
} from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../pages/BasePage";
import { useState } from "react";
import NCCNLoader from "./NCCNLoader";

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
  exportAction?: (onProgress?: (message: string) => void) => Promise<void>;
}) {
  const { user } = useOutletContext<BasePageContext>();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFeedback, setExportFeedback] = useState("");

  const [runTutorial, setRunTutorial] = useState(false);

  if (
    HelpComponent &&
    !exportAction &&
    !(user && user.roles.analist && editAction)
  ) {
    return (
      <>
        <Fab
          sx={{
            position: "fixed",
            bottom: 16 + offset.y,
            right: 16 + offset.x,
          }}
          color="primary"
          onClick={() => setRunTutorial(true)}
        >
          <QuestionMarkIcon />
        </Fab>
        {HelpComponent && (
          <HelpComponent run={runTutorial} setRun={setRunTutorial} />
        )}
      </>
    );
  }

  return (
    <>
      <Dialog open={isExporting}>
        <DialogTitle>Exporting Risk File...</DialogTitle>
        <Stack
          direction="column"
          sx={{ alignItems: "center", padding: 2, width: 400 }}
        >
          <NCCNLoader />
          <Typography variant="body2">{exportFeedback}</Typography>
        </Stack>
      </Dialog>
      <SpeedDial
        ariaLabel="BNRA Speeddial"
        sx={{ position: "fixed", bottom: 16 + offset.y, right: 16 + offset.x }}
        icon={<SpeedDialIcon />}
      >
        {HelpComponent && (
          <SpeedDialAction
            icon={<QuestionMarkIcon />}
            slotProps={{
              tooltip: {
                title: "Help",
              },
            }}
            onClick={() => setRunTutorial(true)}
          />
        )}
        {user && exportAction && (
          <SpeedDialAction
            icon={isExporting ? <HourglassTopIcon /> : <PrintIcon />}
            slotProps={{
              tooltip: {
                title: "Export PDF",
              },
              fab: {
                disabled: isExporting,
              },
            }}
            onClick={async () => {
              if (isExporting) return;

              setIsExporting(true);

              await exportAction((message) => setExportFeedback(message));

              setIsExporting(false);
            }}
          />
        )}
        {user && user.roles.analist && editAction && (
          <SpeedDialAction
            icon={<EditIcon />}
            slotProps={{
              tooltip: {
                title: "Edit Page",
              },
            }}
            onClick={editAction}
          />
        )}
      </SpeedDial>
      {HelpComponent && (
        <HelpComponent run={runTutorial} setRun={setRunTutorial} />
      )}
    </>
  );
}
