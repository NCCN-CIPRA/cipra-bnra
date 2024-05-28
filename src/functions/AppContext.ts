import { createContext } from "react";
import { Breadcrumb } from "../components/BreadcrumbNavigation";

const AppContext = createContext({
  setPageTitle: (pageTitle: string): void => undefined,
  setBreadcrumbs: (breadcrumbs: (Breadcrumb | null)[]): void => undefined,
  setBottomBarHeight: (bottomBarHeigh: number): void => undefined,
});

export default AppContext;
