import { useContext, useEffect } from "react";
import AppContext from "../functions/AppContext";
import { Breadcrumb } from "../components/BreadcrumbNavigation";

export default function useBreadcrumbs(breadcrumbs: (Breadcrumb | null)[] | null) {
  const { setBreadcrumbs } = useContext(AppContext);

  // We do this to properly compare equality of breadcrumbs
  const breadcrumbsString = JSON.stringify(breadcrumbs);

  useEffect(() => setBreadcrumbs(JSON.parse(breadcrumbsString)), [breadcrumbsString, setBreadcrumbs]);
}
