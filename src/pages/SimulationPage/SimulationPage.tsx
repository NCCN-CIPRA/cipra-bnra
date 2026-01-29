// import { useTranslation } from "react-i18next";

import { useNavigate, useParams } from "react-router-dom";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import RiskEventTab from "./RiskEventTab";
import SimulationTab from "./SimulationTab";
import HubIcon from "@mui/icons-material/Hub";

type UserManagementParams = {
  tabName: string;
};

export default function SimulationPage() {
  const navigate = useNavigate();
  const { tabName } = useParams<UserManagementParams>();
  // const { user } = useOutletContext<AdminPageContext>();

  usePageTitle("User Management");
  useBreadcrumbs([
    { name: "BNRA", url: "/" },
    { name: "Simulations", url: "/admin/simulations" },
  ]);

  let tab = 0;
  switch (tabName) {
    case "simulate":
      tab = 0;
      break;
    case "events":
      tab = 1;
      break;
  }

  return (
    <>
      {tab === 0 && <SimulationTab />}
      {tab === 1 && <RiskEventTab />}
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
            label="Risk Simulator"
            icon={<CalculateIcon />}
            onClick={() => navigate(`/admin/simulation/simulate`)}
          />
          <BottomNavigationAction
            label="Risk Events"
            icon={<HubIcon />}
            onClick={() => navigate(`/admin/simulation/events`)}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
}
