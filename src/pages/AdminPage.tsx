import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { DVContact } from "../types/dataverse/DVContact";
import { BasePageContext } from "./BasePage";

export interface AuthPageContext {
  user: DVContact;
}

export default function AdminPage() {
  const { user, refreshUser } = useOutletContext<BasePageContext>();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timer;

    if (user === undefined) {
      interval = setInterval(refreshUser, 1000);
    }

    return () => interval && clearInterval(interval);
  }, [user, refreshUser]);

  if (user === undefined) {
    return (
      <Box
        sx={{
          width: "100%",
          height: 500,
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user === null || !user.roles.admin) {
    navigate("/auth");
  }

  return <Outlet context={{ user }} />;
}
