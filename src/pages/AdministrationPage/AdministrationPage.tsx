// import { useTranslation } from "react-i18next";

import { useNavigate, useParams } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import SnapshotTab from "./SnapshotTab";
import MigrationTab from "./MigrationTab";
import MoveDownSharpIcon from "@mui/icons-material/MoveDownSharp";
import CalculateIcon from "@mui/icons-material/Calculate";
import SimulationTab from "./SimulationTab";

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
    case "migrate":
      tab = 1;
      break;
    case "simulate":
      tab = 2;
      break;
  }

  return (
    <>
      {tab === 0 && <SnapshotTab />}
      {tab === 1 && <MigrationTab />}
      {tab === 2 && <SimulationTab />}
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
            label="Snapshots"
            icon={<AcUnitIcon />}
            onClick={() => navigate(`/admin/functions/snapshots`)}
          />
          <BottomNavigationAction
            label="Migrate Risk Files"
            icon={<MoveDownSharpIcon />}
            onClick={() => navigate(`/admin/functions/migrate`)}
          />
          <BottomNavigationAction
            label="Risk Simulator"
            icon={<CalculateIcon />}
            onClick={() => navigate(`/admin/functions/simulate`)}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
}
