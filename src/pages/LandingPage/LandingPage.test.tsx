// Routes.test.tsx
import { screen } from "@testing-library/react";
import LandingPage from "./LandingPage";
import { renderWithContext } from "../../test/test-utils";

describe("Routes", () => {
  test('renders landing page at "/"', () => {
    renderWithContext(<LandingPage />, { outletContext: { user: null } });
    expect(
      screen.getByText("Belgian National Risk Assessment")
    ).toBeInTheDocument();
  });
});
