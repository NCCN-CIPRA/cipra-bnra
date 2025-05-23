import { createContext, useState } from "react";

export interface Breadcrumb {
  name: string;
  url: string;
}

type AppContextType = {
  pageTitle: string | undefined;
  setPageTitle: (pageTitle: string) => void;
  breadcrumbs: (Breadcrumb | null)[];
  setBreadcrumbs: (crumbs: Breadcrumb[]) => void;
};

const AppContext = createContext<AppContextType | undefined>({
  pageTitle: "...",
  setPageTitle: () => {},
  breadcrumbs: [],
  setBreadcrumbs: () => {},
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pageTitle, setPageTitle] = useState("BNRA 2023 - 2026");
  const [breadcrumbs, setBreadcrumbs] = useState<(Breadcrumb | null)[]>([
    {
      name: "BNRA",
      url: "/",
    },
  ]);

  return (
    <AppContext.Provider
      value={{ pageTitle, setPageTitle, breadcrumbs, setBreadcrumbs }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
