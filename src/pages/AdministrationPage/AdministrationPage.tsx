// import { useTranslation } from "react-i18next";

import { useNavigate, useParams } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import SnapshotTab from "./SnapshotTab";
import MoveDownSharpIcon from "@mui/icons-material/MoveDownSharp";
import RestoreIcon from "@mui/icons-material/Restore";
import RestoreTab from "./RestoreTab";
import SummariesTab from "./SummariesTab";

type UserManagementParams = {
  tabName: string;
};

export default function AdministrationPage() {
  const navigate = useNavigate();
  const { tabName } = useParams<UserManagementParams>();
  // const { user } = useOutletContext<AdminPageContext>();

  usePageTitle("User Management");
  useBreadcrumbs([
    { name: "BNRA", url: "/" },
    { name: "Administrative Functions", url: "/admin/functions" },
  ]);

  let tab = 0;
  switch (tabName) {
    case "snapshots":
      tab = 0;
      break;
    case "summaries":
      tab = 1;
      break;
    case "restore":
      tab = 2;
      break;
  }

  return (
    <>
      {tab === 0 && <SnapshotTab />}
      {tab === 1 && <SummariesTab />}
      {tab === 2 && <RestoreTab />}
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1201,
        }}
        elevation={3}
      >
        <BottomNavigation showLabels value={tab}>
          <BottomNavigationAction
            label="Create Snapshots"
            icon={<AcUnitIcon />}
            onClick={() => navigate(`/admin/functions/snapshots`)}
          />
          <BottomNavigationAction
            label="Update Summaries"
            icon={<MoveDownSharpIcon />}
            onClick={() => navigate(`/admin/functions/summaries`)}
          />
          <BottomNavigationAction
            label="Restore Backup"
            icon={<RestoreIcon />}
            onClick={() => navigate(`/admin/functions/restore`)}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
}
