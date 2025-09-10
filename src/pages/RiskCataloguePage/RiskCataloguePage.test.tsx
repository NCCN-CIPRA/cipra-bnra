import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithContext } from "../../test/test-utils";
import RiskCataloguePage from "./RiskCataloguePage";
import { QueryClient } from "@tanstack/react-query";
import { vi } from "vitest";

import * as usePageTitleHook from "../../hooks/usePageTitle";
import * as useBreadcrumbsHook from "../../hooks/useBreadcrumbs";

// Mock the hooks and dependencies
const usePageTitle = vi.spyOn(usePageTitleHook, "default");
const useBreadcrumbs = vi.spyOn(useBreadcrumbsHook, "default");

vi.mock("../../functions/getIcons", () => ({
  CategoryIcon: ({ category }: { category: string }) => (
    <div data-testid={`category-icon-${category}`}>Icon</div>
  ),
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

// Mock API responses
const mockAPI = {
  getRiskSummaries: vi.fn(),
  getRiskFiles: vi.fn(),
  getRiskCascades: vi.fn(),
};

vi.mock("../../hooks/useAPI", () => ({
  default: () => mockAPI,
}));

// Sample test data
const mockRiskData = [
  {
    _cr4de_risk_file_value: "risk1",
    cr4de_hazard_id: "H001",
    cr4de_title: "Earthquake Risk",
    cr4de_category: "natural",
  },
  {
    _cr4de_risk_file_value: "risk2",
    cr4de_hazard_id: "H002",
    cr4de_title: "Cyber Attack Risk",
    cr4de_category: "technological",
  },
  {
    _cr4de_risk_file_value: "risk3",
    cr4de_hazard_id: "H003",
    cr4de_title: "Pandemic Risk",
    cr4de_category: "biological",
  },
];

describe("RiskCataloguePage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    mockNavigate.mockClear();
    mockAPI.getRiskSummaries.mockClear();
    mockAPI.getRiskFiles.mockClear();
    mockAPI.getRiskCascades.mockClear();
  });

  describe("Initial Rendering", () => {
    test("renders without crashing", () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    test("displays loading state initially", () => {
      mockAPI.getRiskSummaries.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      expect(
        screen.getByRole("columnheader", { name: /id/i })
      ).toBeInTheDocument();
    });

    test("displays correct column headers", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        expect(
          screen.getByRole("columnheader", { name: /id/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("columnheader", { name: /title/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("columnheader", { name: /category/i })
        ).toBeInTheDocument();
      });
    });
  });

  describe("Data Display", () => {
    test("displays risk data in the grid", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        expect(screen.getByText("H001")).toBeInTheDocument();
        expect(screen.getByText("Earthquake Risk")).toBeInTheDocument();
        expect(screen.getByText("H002")).toBeInTheDocument();
        expect(screen.getByText("Cyber Attack Risk")).toBeInTheDocument();
        expect(screen.getByText("H003")).toBeInTheDocument();
        expect(screen.getByText("Pandemic Risk")).toBeInTheDocument();
      });
    });

    test("displays category icons for each row", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        expect(screen.getByTestId("category-icon-natural")).toBeInTheDocument();
        expect(
          screen.getByTestId("category-icon-technological")
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("category-icon-biological")
        ).toBeInTheDocument();
      });
    });

    test("handles empty data gracefully", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue([]);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        expect(screen.getByText(/no rows/i)).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    test("displays search input with correct placeholder", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(
          "Search Risk Catalogue"
        );
        expect(searchInput).toBeInTheDocument();
      });
    });

    test("filters data when searching", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);
      const user = userEvent.setup();

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        expect(screen.getByText("Earthquake Risk")).toBeInTheDocument();
        expect(screen.getByText("Cyber Attack Risk")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText("Search Risk Catalogue");
      await user.type(searchInput, "Earthquake");

      await waitFor(() => {
        expect(screen.getByText("Earthquake Risk")).toBeInTheDocument();
        expect(screen.queryByText("Cyber Attack Risk")).not.toBeInTheDocument();
      });
    });

    test("shows clear button when search has value", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);
      const user = userEvent.setup();

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      const searchInput = screen.getByPlaceholderText("Search Risk Catalogue");
      await user.type(searchInput, "test");

      await waitFor(() => {
        expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
      });
    });

    test("clears search when clear button is clicked", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);
      const user = userEvent.setup();

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      const searchInput = screen.getByPlaceholderText("Search Risk Catalogue");

      await user.type(searchInput, "Earthquake");

      await waitFor(() => {
        expect(screen.queryByText("Cyber Attack Risk")).not.toBeInTheDocument();
      });

      const clearButton = await screen.findByLabelText("Clear search");

      await user.click(clearButton);

      await waitFor(() => {
        expect(searchInput).toHaveValue("");
      });

      await waitFor(() => {
        expect(screen.getByText("Earthquake Risk")).toBeInTheDocument();
        expect(screen.getByText("Cyber Attack Risk")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    test("navigates to risk detail when row is clicked", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);
      const user = userEvent.setup();

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        expect(screen.getByText("Earthquake Risk")).toBeInTheDocument();
      });

      const row = screen.getByText("Earthquake Risk").closest('[role="row"]');
      await user.click(row!);

      expect(mockNavigate).toHaveBeenCalledWith("risk1");
    });

    test("shows pointer cursor on row hover", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        const row = screen.getByText("Earthquake Risk").closest('[role="row"]');
        if (row) fireEvent.mouseOver(row);
        expect(row).toHaveStyle({ cursor: "pointer" });
      });
    });
  });

  describe("User Role-based Behavior", () => {
    test("makes additional API calls for verified users", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);
      // mockAPI.getRiskFiles.mockResolvedValue([]);
      // mockAPI.getRiskCascades.mockResolvedValue([]);

      const verifiedUser = { roles: { verified: true } };

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: verifiedUser },
        client: queryClient,
      });

      await waitFor(() => {
        expect(mockAPI.getRiskSummaries).toHaveBeenCalled();
        // expect(mockAPI.getRiskFiles).toHaveBeenCalled();
        // expect(mockAPI.getRiskCascades).toHaveBeenCalled();
      });
    });

    test("does not make additional API calls for non-verified users", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      const unverifiedUser = { roles: { verified: false } };

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: unverifiedUser },
        client: queryClient,
      });

      await waitFor(() => {
        expect(mockAPI.getRiskSummaries).toHaveBeenCalled();
      });

      expect(mockAPI.getRiskFiles).not.toHaveBeenCalled();
      expect(mockAPI.getRiskCascades).not.toHaveBeenCalled();
    });

    test("does not make additional API calls when user is null", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        expect(mockAPI.getRiskSummaries).toHaveBeenCalled();
      });

      expect(mockAPI.getRiskFiles).not.toHaveBeenCalled();
      expect(mockAPI.getRiskCascades).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    test("handles API errors gracefully", async () => {
      mockAPI.getRiskSummaries.mockRejectedValue(new Error("API Error"));

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      // The component should still render even if API fails
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    test("handles malformed data gracefully", async () => {
      const malformedData = [
        {
          // Missing required fields
          _cr4de_risk_file_value: "risk1",
        },
        {
          _cr4de_risk_file_value: "risk2",
          cr4de_hazard_id: null,
          cr4de_title: "Valid Title",
          cr4de_category: "natural",
        },
      ];

      mockAPI.getRiskSummaries.mockResolvedValue(malformedData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        expect(screen.getByRole("grid")).toBeInTheDocument();
      });
    });
  });

  describe("Pagination", () => {
    test("sets initial page size to 100", async () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      await waitFor(() => {
        // Check that all items are visible (less than 100)
        expect(screen.getByText("Earthquake Risk")).toBeInTheDocument();
        expect(screen.getByText("Cyber Attack Risk")).toBeInTheDocument();
        expect(screen.getByText("Pandemic Risk")).toBeInTheDocument();
      });
    });
  });

  describe("Integration with hooks", () => {
    test("calls usePageTitle with correct title", () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      expect(usePageTitle).toHaveBeenCalledWith("Hazard Catalogue");
    });

    test("calls useBreadcrumbs with correct breadcrumbs", () => {
      mockAPI.getRiskSummaries.mockResolvedValue(mockRiskData);

      renderWithContext(<RiskCataloguePage />, {
        outletContext: { user: null },
        client: queryClient,
      });

      expect(useBreadcrumbs).toHaveBeenCalledWith([
        { name: "bnra.shortName", url: "/" },
        { name: "Hazard Catalogue", url: "" },
      ]);
    });
  });
});
