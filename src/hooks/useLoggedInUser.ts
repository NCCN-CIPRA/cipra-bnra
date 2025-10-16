import { useState, useEffect } from "react";
import { DVContact } from "../types/dataverse/DVContact";
import { getAuthRoles, UserRoles } from "../functions/authRoles";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import useAPI, { DataTable } from "./useAPI";
import { useQuery } from "@tanstack/react-query";

export interface LoggedInUser extends DVContact<DVParticipation[] | undefined> {
  viewer: boolean;
  roles: UserRoles;
  realRoles?: UserRoles;
  participations: DVParticipation[];
}

export default function useLoggedInUser() {
  const api = useAPI();

  const [user, setUser] = useState<LoggedInUser | null | undefined>(undefined);

  const { data: participations } = useQuery({
    queryKey: [DataTable.PARTICIPATION, user?.contactid],
    queryFn: () =>
      api.getParticipants(`$filter=_cr4de_contact_value eq ${user?.contactid}`),
    enabled: user !== null && user !== undefined,
  });

  const setFakeRole = (role: string) => {
    if (user?.realRoles?.admin || user?.roles.admin) {
      setUser({
        ...user,
        roles: getAuthRoles(role, false),
      });
    }
  };

  const refreshUser = () => {
    const info = document.getElementById("user-information");

    if (!info) {
      setTimeout(refreshUser, 1000);
      return;
    }

    if (
      info &&
      info.getAttribute("data-id") &&
      info.getAttribute("data-id") !== ""
    ) {
      if (info.getAttribute("data-id") !== user?.contactid) {
        setUser({
          contactid: info?.getAttribute("data-id") || "",
          emailaddress1: info?.getAttribute("data-email") || "",
          firstname: info?.getAttribute("data-firstname") || "",
          lastname: info?.getAttribute("data-lastname") || "",
          admin: info?.hasAttribute("data-admin"),
          viewer: info?.hasAttribute("data-report-viewer"),
          participations: participations || [],
          roles: getAuthRoles(
            info?.getAttribute("data-roles") || "",
            participations && participations.length > 0
          ),
          realRoles: getAuthRoles(
            info?.getAttribute("data-roles") || "",
            participations && participations.length > 0
          ),
          createdon: "",
          cr4de_permissions: "",
        });
      }
    } else {
      setUser(null);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshUser, []);

  useEffect(() => {
    if (!user || !participations) return;

    setUser({
      ...user,
      roles: {
        ...user.roles,
        expert: user.roles.expert || participations.length > 0,
      },
      realRoles: {
        ...(user.realRoles || user.roles),
        expert: user.realRoles?.expert || participations.length > 0,
      },
      participations,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participations]);

  return { user, refreshUser, setFakeRole };
}
