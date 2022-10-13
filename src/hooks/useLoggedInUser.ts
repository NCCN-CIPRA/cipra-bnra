import { useState, useEffect } from "react";
import { DVContact } from "../types/dataverse/DVContact";

export default function useLoggedInUser() {
  const [user, setUser] = useState<DVContact | null | undefined>(undefined);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const info = document.getElementById("user-information");

    if (info && info.getAttribute("data-id") && info.getAttribute("data-id") !== "") {
      if (info.getAttribute("data-id") !== user?.contactid) {
        setUser({
          contactid: info?.getAttribute("data-id") || "",
          emailaddress1: info?.getAttribute("data-email") || "",
          firstname: info?.getAttribute("data-firstname") || "",
          lastname: info?.getAttribute("data-lastname") || "",
        });
      }
    } else {
      setUser(null);
    }
  });

  return { user };
}
