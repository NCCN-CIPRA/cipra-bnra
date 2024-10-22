import { useState, useEffect } from "react";
import { DVContact } from "../types/dataverse/DVContact";
import { getAuthRoles, UserRoles } from "../functions/authRoles";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import useAPI from "./useAPI";

export interface LoggedInUser extends DVContact<DVParticipation[] | undefined> {
  viewer: boolean;
  roles: UserRoles;
  realRoles?: UserRoles;
}

export default function useLoggedInUser() {
  const api = useAPI();

  const [user, setUser] = useState<LoggedInUser | null | undefined>(undefined);
  const [participations, setParticipations] = useState<DVParticipation[] | null>(null);

  const setFakeRole = (role: string) => {
    if (user?.realRoles?.admin || user?.roles.admin) {
      setUser({
        ...user,
        roles: getAuthRoles(role),
      });
    }
  };

  const refreshUser = () => {
    const info = document.getElementById("user-information");

    if (!info) {
      setTimeout(refreshUser, 1000);
      return;
    }

    if (info && info.getAttribute("data-id") && info.getAttribute("data-id") !== "") {
      if (info.getAttribute("data-id") !== user?.contactid) {
        setUser({
          contactid: info?.getAttribute("data-id") || "",
          emailaddress1: info?.getAttribute("data-email") || "",
          firstname: info?.getAttribute("data-firstname") || "",
          lastname: info?.getAttribute("data-lastname") || "",
          admin: info?.hasAttribute("data-admin"),
          viewer: info?.hasAttribute("data-report-viewer"),
          participations: undefined,
          roles: getAuthRoles(info?.getAttribute("data-roles") || ""),
          realRoles: getAuthRoles(info?.getAttribute("data-roles") || ""),
        });

        api.getParticipants(`$filter=_cr4de_contact_value eq ${info?.getAttribute("data-id")}`).then((p) => {
          setUser({
            contactid: info?.getAttribute("data-id") || "",
            emailaddress1: info?.getAttribute("data-email") || "",
            firstname: info?.getAttribute("data-firstname") || "",
            lastname: info?.getAttribute("data-lastname") || "",
            admin: info?.hasAttribute("data-admin"),
            viewer: info?.hasAttribute("data-report-viewer"),
            roles: getAuthRoles(info?.getAttribute("data-roles") || ""),
            realRoles: getAuthRoles(info?.getAttribute("data-roles") || ""),
            participations: p,
          });
        });
      }
    } else {
      setUser(null);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(refreshUser, []);

  return { user, refreshUser, setFakeRole };
}
