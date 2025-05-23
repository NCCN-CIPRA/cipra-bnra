import { useContext, useEffect } from "react";
import AppContext from "../functions/AppContext";

export default function usePageTitle(pageTitle: string) {
  const ctx = useContext(AppContext);

  if (!ctx)
    throw new Error("usePageTitle must be used within AppContextProvider");

  const { setPageTitle } = ctx;

  useEffect(() => setPageTitle(pageTitle), [pageTitle, setPageTitle]);
}

export const usePageTitleValue = () => {
  const ctx = useContext(AppContext);
  if (!ctx)
    throw new Error("usePageTitle must be used within AppContextProvider");
  return ctx;
};
