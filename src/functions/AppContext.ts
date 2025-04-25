import { createContext } from "react";
import { Breadcrumb } from "../components/BreadcrumbNavigation";

const AppContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPageTitle: (_pageTitle: string): void => undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setBreadcrumbs: (_breadcrumbs: (Breadcrumb | null)[]): void => undefined,
});

export default AppContext;
