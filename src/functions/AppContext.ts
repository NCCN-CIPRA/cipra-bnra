import { createContext } from "react";
import { Breadcrumb } from "../components/BreadcrumbNavigation";

const AppContext = createContext({
  setPageTitle: (pageTitle: string): void => undefined,
  setBreadcrumbs: (breadcrumbs: (Breadcrumb | null)[]): void => undefined,
});

export default AppContext;
