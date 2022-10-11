import { useRef, useState, useEffect } from "react";
import { DVContact } from "../types/dataverse/DVContact";
import useAPI from "./useAPI";

export default function useLoggedInUser() {
  const api = useAPI();
  const isFetching = useRef<Boolean>(false);
  const [user, setUser] = useState<DVContact | null | undefined>(undefined);

  useEffect(() => {
    if (user || isFetching.current) return;

    const getUser = async () => {
      setUser(await api.getUser());
    };

    getUser();
    isFetching.current = true;
  }, [api, setUser, user, isFetching]);

  return { user };
}
