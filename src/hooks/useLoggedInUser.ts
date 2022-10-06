import { useState, useEffect } from "react";
import { DVContact } from "../types/dataverse/DVContact";
import useAPI from "./useAPI";

export default function useLoggedInUser() {
  const api = useAPI();
  const [user, setUser] = useState<DVContact | null | undefined>(undefined);

  useEffect(() => {
    if (user) return;

    const getUser = async () => {
      setUser(await api.getUser());
    };
    getUser();
  }, [api, setUser, user]);

  return { user };
}
