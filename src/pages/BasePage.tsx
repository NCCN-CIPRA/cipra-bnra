import { useState } from "react";
import { CssBaseline, Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AppContextProvider } from "../functions/AppContext";
import SideDrawer from "../components/SideDrawer";
import TitleBar from "../components/TitleBar";
import BreadcrumbNavigation from "../components/BreadcrumbNavigation";
import useLoggedInUser, { LoggedInUser } from "../hooks/useLoggedInUser";
import satisfies from "../types/satisfies";
import { Environment } from "../types/global";

export interface BasePageContext {
  user: LoggedInUser | null | undefined;
  environment: Environment;
  refreshUser: () => void;
  setFakeRole: (role: string) => void;
  setEnvironment: (newEnv: Environment) => void;
}

const drawerWidth = 320;

export default function BasePage() {
  const { user, refreshUser, setFakeRole } = useLoggedInUser();
  const [environment, setEnvironment] = useState<Environment>(
    (localStorage.getItem("bnraEnv") as Environment) || Environment.PUBLIC
  );

  const [drawerOpen, setDrawerOpen] = useState(false);

  const setAndSaveEnvironment = (newEnv: Environment) => {
    setEnvironment(newEnv);
    localStorage.setItem("bnraEnv", newEnv);
  };

  return (
    <AppContextProvider>
      <CssBaseline />
      <TitleBar
        user={user}
        environment={environment}
        setFakeRole={setFakeRole}
        setEnvironment={setAndSaveEnvironment}
        onDrawerToggle={() => setDrawerOpen(!drawerOpen)}
      />
      <SideDrawer
        user={user}
        open={drawerOpen}
        width={drawerWidth}
        onClose={() => setDrawerOpen(false)}
      />
      {/* <Box sx={{ display: "flex", flexFlow: "column nowrap", minHeight: "100vh", mb: `${bottomBarHeight}px` }}> */}
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar />
        <BreadcrumbNavigation />
        <Outlet
          context={satisfies<BasePageContext>({
            user,
            environment,
            refreshUser,
            setFakeRole,
            setEnvironment: setAndSaveEnvironment,
          })}
        />
      </Box>
      {/* <Stack
          direction="row"
          sx={{
            justifyContent: "space-evenly",
            py: 2,
            backgroundColor: "white",
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <img
            alt="Nationaal Crisiscentrum"
            src="https://bnra.powerappsportals.com/logo_nccn.svg"
            style={{ height: 40 }}
          />
          <img alt="BNRA" src="https://bnra.powerappsportals.com/logo_text.png" style={{ height: 40 }} />
        </Stack> */}
      {/* </Box> */}
    </AppContextProvider>
  );
}
