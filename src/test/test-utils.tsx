import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
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
    client = queryClient,
    outletContext = {},
  }: {
    path?: string;
    client?: QueryClient;
    outletContext?: unknown;
  } = {}
) {
  const routerOptions = { element: ui, path };

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
