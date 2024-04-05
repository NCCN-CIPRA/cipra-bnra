import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import useLoggedInUser from "../hooks/useLoggedInUser";
import { DVContact } from "../types/dataverse/DVContact";

export interface AuthPageContext {
  user: DVContact;
}

export default function AdminPage() {
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
        <CircularProgress />
      </Box>
    );
  }

  if (user === null || !user.admin) {
    navigate("/auth");
  }

  return <Outlet context={{ user }} />;
}
