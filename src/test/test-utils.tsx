import React, { isValidElement } from "react";
import { render } from "@testing-library/react";
import {
  MemoryRouter,
  Outlet,
  Route,
  RouteObject,
  RouterProvider,
  Routes,
  createMemoryRouter,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "../theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 500000,
      retry: false,
    },
  },
});

export function renderWithContext(
  ui: React.ReactElement,
  {
    path = "/",
    routes = [],
    client = queryClient,
    outletContext = {},
  }: {
    path?: string;
    routes?: RouteObject[];
    client?: QueryClient;
    outletContext?: any;
  } = {}
) {
  const routerOptions = { element: ui, path };

  const router = createMemoryRouter([{ ...routerOptions }, ...routes], {
    initialEntries: [routerOptions.path],
    initialIndex: 1,
  });

  return render(
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[routerOptions.path]} initialIndex={1}>
          <Routes>
            <Route path="/" element={<Outlet context={outletContext} />}>
              <Route index element={ui} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
