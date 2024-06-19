import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import useLoggedInUser, { LoggedInUser } from "../hooks/useLoggedInUser";
import { DVContact } from "../types/dataverse/DVContact";
import NCCNLoader from "../components/NCCNLoader";

export interface AuthPageContext {
  user: LoggedInUser;
}

export default function AuthPage() {
  const { user, refreshUser } = useLoggedInUser();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any;

    if (user === undefined) {
      interval = setInterval(refreshUser, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [user, refreshUser]);

  if (user === undefined) {
    return (
      <Box sx={{ width: "100%", height: 500, alignItems: "center", justifyContent: "center", display: "flex" }}>
        <NCCNLoader />
      </Box>
    );
  }

  if (user === null) {
    navigate("/auth");
  }

  return <Outlet context={{ user }} />;
}
