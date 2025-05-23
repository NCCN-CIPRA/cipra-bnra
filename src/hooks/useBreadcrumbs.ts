import { useContext, useEffect } from "react";
import AppContext, { Breadcrumb } from "../functions/AppContext";

export default function useBreadcrumbs(
  breadcrumbs: (Breadcrumb | null)[] | null
) {
  const ctx = useContext(AppContext);

  if (!ctx)
    throw new Error("useBreadcrumbs must be used within AppContextProvider");

  const { setBreadcrumbs } = ctx;

  // We do this to properly compare equality of breadcrumbs
  const breadcrumbsString = JSON.stringify(breadcrumbs);

  useEffect(
    () => setBreadcrumbs(JSON.parse(breadcrumbsString)),
    [breadcrumbsString, setBreadcrumbs]
  );
}

export const useBreadcrumbsValue = () => {
  const ctx = useContext(AppContext);
  if (!ctx)
    throw new Error("useBreadcrumbs must be used within AppContextProvider");
  return ctx;
};
