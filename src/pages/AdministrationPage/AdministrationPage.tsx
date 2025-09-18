// import { useTranslation } from "react-i18next";

import { useNavigate, useParams } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import SnapshotTab from "./SnapshotTab";

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
    case "bulk":
      tab = 1;
      break;
  }

  return (
    <>
      {tab === 0 && <SnapshotTab />}
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
            onClick={() => navigate(`/admin/users`)}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
}
