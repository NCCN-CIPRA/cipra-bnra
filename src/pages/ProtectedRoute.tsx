import { Box } from "@mui/material";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { LoggedInUser } from "../hooks/useLoggedInUser";
import NCCNLoader from "../components/NCCNLoader";
import { BasePageContext } from "./BasePage";
import { UserRoles } from "../functions/authRoles";
import { ReactNode, useEffect } from "react";

export interface AuthPageContext extends BasePageContext {
  user: LoggedInUser;
}

export default function ProtectedRoute({
  children,
  allowedRole = "verified",
}: {
  children: ReactNode;
  allowedRole?: keyof UserRoles;
}) {
  const { user } = useOutletContext<BasePageContext>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (user === undefined) return;

    if (user === null || !user.roles.verified) {
      navigate(`/auth?returnUrl=${pathname}`);

      return;
    }

    if (!user.roles[allowedRole]) {
      navigate("/403");

      return;
    }
  }, [navigate, user, allowedRole, pathname]);

  if (!user?.roles[allowedRole]) {
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
        <NCCNLoader />
      </Box>
    );
  }

  return children;
}
