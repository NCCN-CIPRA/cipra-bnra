import { useContext, useEffect } from "react";
import AppContext from "../functions/AppContext";

export default function usePageTitle(pageTitle: string) {
  const { setPageTitle } = useContext(AppContext);

  useEffect(() => setPageTitle(pageTitle), [pageTitle, setPageTitle]);
}
