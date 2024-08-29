import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { LoggedInUser } from "../hooks/useLoggedInUser";
import { DVContact } from "../types/dataverse/DVContact";
import NCCNLoader from "../components/NCCNLoader";
import satisfies from "../types/satisfies";
import { BasePageContext } from "./BasePage";

export interface AuthPageContext extends BasePageContext {
  user: LoggedInUser;
}

export default function AuthPage() {
  const basePageContext = useOutletContext<BasePageContext>();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any;

    if (basePageContext.user === undefined) {
      interval = setInterval(basePageContext.refreshUser, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [basePageContext.user, basePageContext.refreshUser]);

  if (basePageContext.user === undefined) {
    return (
      <Box sx={{ width: "100%", height: 500, alignItems: "center", justifyContent: "center", display: "flex" }}>
        <NCCNLoader />
      </Box>
    );
  }

  if (basePageContext.user === null) {
    navigate("/auth");

    return null;
  }

  return <Outlet context={satisfies<AuthPageContext>({ ...basePageContext, user: basePageContext.user })} />;
}
