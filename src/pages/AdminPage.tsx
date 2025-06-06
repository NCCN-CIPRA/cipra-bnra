import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { BasePageContext } from "./BasePage";
import { LoggedInUser } from "../hooks/useLoggedInUser";

export interface AdminPageContext extends BasePageContext {
  user: LoggedInUser;
}

export default function AdminPage() {
  const { user, refreshUser } = useOutletContext<BasePageContext>();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (user === undefined) {
      interval = setInterval(refreshUser, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
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
