import { screen } from "@testing-library/react";
import { renderWithContext } from "../../test/test-utils";
import RiskFileSummaryPage from "./RiskFileSummaryPage";
import { QueryClient } from "@tanstack/react-query";
import { vi } from "vitest";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS } from "../../functions/scenarios";

vi.mock("../../functions/translations", () => ({
  getLanguage: (lang: string) => (lang === "en" ? "en" : "nl"),
}));

vi.mock("../../components/RiskFileTitle", () => ({
  default: ({ riskFile }: { riskFile: Partial<DVRiskFile> }) => (
    <div data-testid="risk-file-title">
      Risk File Title: {riskFile.cr4de_title}
    </div>
  ),
}));

vi.mock("../../components/charts/SummaryCharts.new", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ riskSummary, scenario, manmade, canDownload }: any) => (
    <div data-testid="summary-charts">
      <div data-testid="chart-risk-id">
        {riskSummary._cr4de_risk_file_value}
      </div>
      <div data-testid="chart-scenario">{scenario}</div>
      <div data-testid="chart-manmade">{manmade ? "true" : "false"}</div>
      <div data-testid="chart-can-download">
        {canDownload ? "true" : "false"}
      </div>
    </div>
  ),
}));

vi.mock("../../components/BNRASpeedDial", () => ({
  default: ({ offset }: { offset: { x: number; y: number } }) => (
    <div data-testid="bnra-speed-dial" data-offset={JSON.stringify(offset)}>
      Speed Dial
    </div>
  ),
}));

// Sample test data
const mockRiskSummary = {
  _cr4de_risk_file_value: "risk1",
  cr4de_hazard_id: "H001",
  cr4de_title: "Earthquake Risk",
  cr4de_risk_type: RISK_TYPE.STANDARD,
  cr4de_mrs: SCENARIOS.MAJOR,
  cr4de_summary_en:
    "<p>This is the English summary of the earthquake risk.</p>",
  cr4de_summary_nl:
    "<p>Dit is de Nederlandse samenvatting van het aardbevingsrisico.</p>",
};

const mockEmergingRisk = {
  ...mockRiskSummary,
  _cr4de_risk_file_value: "emerging1",
  cr4de_title: "Emerging Technology Risk",
  cr4de_risk_type: RISK_TYPE.EMERGING,
};

const mockManmadeRisk = {
  ...mockRiskSummary,
  _cr4de_risk_file_value: "manmade1",
  cr4de_title: "Cyber Attack Risk",
  cr4de_risk_type: RISK_TYPE.MANMADE,
  cr4de_mrs: SCENARIOS.CONSIDERABLE,
};

const mockInternalUser = {
  roles: { internal: true, verified: true },
};

const mockExternalUser = {
  roles: { internal: false, verified: true },
};

describe("RiskFileSummaryPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  describe("Initial Rendering", () => {
    test("renders without crashing", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: null, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      expect(screen.getByTestId("risk-file-title")).toBeInTheDocument();
    });

    test("renders main container with correct styling", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: null, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      const container = screen
        .getByTestId("risk-file-title")
        .closest(".MuiContainer-root");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Risk File Title", () => {
    test("displays RiskFileTitle component with correct risk file", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: null, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      const titleComponent = screen.getByTestId("risk-file-title");
      expect(titleComponent).toBeInTheDocument();
      expect(titleComponent).toHaveTextContent(
        "Risk File Title: Earthquake Risk"
      );
    });
  });

  describe("Summary Text Display", () => {
    test("displays English summary when language is English", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: null, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      const summaryBox = screen.getByTestId("summary-text");
      expect(summaryBox).toBeInTheDocument();

      const htmlContent = summaryBox.querySelector(".htmleditor");
      expect(htmlContent).toHaveTextContent(
        "This is the English summary of the earthquake risk."
      );
    });

    test("displays correct styling for summary text", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: null, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      const htmlEditor = document.querySelector(".htmleditor");
      expect(htmlEditor).toBeInTheDocument();
    });

    test("handles missing summary gracefully", () => {
      const riskWithoutSummary = {
        ...mockRiskSummary,
        cr4de_summary_en: undefined,
        cr4de_summary_nl: undefined,
      };

      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: null, riskSummary: riskWithoutSummary },
        client: queryClient,
      });

      const summaryBox = screen.getByTestId("summary-text");
      expect(summaryBox).toBeInTheDocument();
    });
  });

  describe("Summary Charts Display", () => {
    test("displays summary charts for standard risk types", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockInternalUser, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      const chartsComponent = screen.getByTestId("summary-charts");
      expect(chartsComponent).toBeInTheDocument();
      expect(screen.getByTestId("chart-risk-id")).toHaveTextContent("risk1");
      expect(screen.getByTestId("chart-scenario")).toHaveTextContent(
        SCENARIOS.MAJOR
      );
      expect(screen.getByTestId("chart-manmade")).toHaveTextContent("false");
      expect(screen.getByTestId("chart-can-download")).toHaveTextContent(
        "true"
      );
    });

    test("displays summary charts for manmade risk types with correct parameters", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockExternalUser, riskSummary: mockManmadeRisk },
        client: queryClient,
      });

      const chartsComponent = screen.getByTestId("summary-charts");
      expect(chartsComponent).toBeInTheDocument();
      expect(screen.getByTestId("chart-manmade")).toHaveTextContent("true");
      expect(screen.getByTestId("chart-scenario")).toHaveTextContent(
        SCENARIOS.CONSIDERABLE
      );
      expect(screen.getByTestId("chart-can-download")).toHaveTextContent(
        "false"
      );
    });

    test("does not display summary charts for emerging risk types", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: {
          user: mockInternalUser,
          riskSummary: mockEmergingRisk,
        },
        client: queryClient,
      });

      expect(screen.queryByTestId("summary-charts")).not.toBeInTheDocument();
    });

    test("uses default scenario when mrs is not provided", () => {
      const riskWithoutMrs = {
        ...mockRiskSummary,
        cr4de_mrs: undefined,
      };

      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockInternalUser, riskSummary: riskWithoutMrs },
        client: queryClient,
      });

      expect(screen.getByTestId("chart-scenario")).toHaveTextContent(
        SCENARIOS.MAJOR
      );
    });
  });

  describe("User-based Chart Permissions", () => {
    test("allows download for internal users", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockInternalUser, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      expect(screen.getByTestId("chart-can-download")).toHaveTextContent(
        "true"
      );
    });

    test("does not allow download for external users", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockExternalUser, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      expect(screen.getByTestId("chart-can-download")).toHaveTextContent(
        "false"
      );
    });

    test("does not allow download when user is null", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: null, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      expect(screen.getByTestId("chart-can-download")).toHaveTextContent(
        "false"
      );
    });

    test("does not allow download when user roles are undefined", () => {
      const userWithoutRoles = { roles: {} };

      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: userWithoutRoles, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      expect(screen.getByTestId("chart-can-download")).toHaveTextContent(
        "false"
      );
    });
  });

  describe("BNRASpeedDial Component", () => {
    test("displays speed dial when user is logged in", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockInternalUser, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      const speedDial = screen.getByTestId("bnra-speed-dial");
      expect(speedDial).toBeInTheDocument();
      expect(speedDial).toHaveAttribute(
        "data-offset",
        JSON.stringify({ x: 0, y: 56 })
      );
    });

    test("does not display speed dial when user is null", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: null, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      expect(screen.queryByTestId("bnra-speed-dial")).not.toBeInTheDocument();
    });

    test("speed dial has correct positioning styles", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockInternalUser, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      const speedDialContainer =
        screen.getByTestId("bnra-speed-dial").parentElement;
      expect(speedDialContainer).toHaveStyle({
        position: "fixed",
        bottom: "96px",
        right: "40px",
      });
    });
  });

  describe("Layout and Structure", () => {
    test("displays content in correct stack layout", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockInternalUser, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      const summaryText = screen.getByTestId("summary-text");
      const summaryCharts = screen.getByTestId("summary-charts");

      expect(summaryText).toBeInTheDocument();
      expect(summaryCharts).toBeInTheDocument();
    });

    test("summary text takes flex: 1", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockInternalUser, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      const summaryTextBox = screen.getByTestId("summary-text");
      expect(summaryTextBox).toHaveStyle({ flex: "1" });
    });
  });

  describe("Language Support", () => {
    test("uses translation hook correctly", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: null, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      // Component should render without errors, indicating translation hook works
      expect(screen.getByTestId("risk-file-title")).toBeInTheDocument();
    });
  });

  describe("Different Risk Types", () => {
    test("handles standard risk types correctly", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockInternalUser, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      expect(screen.getByTestId("summary-charts")).toBeInTheDocument();
      expect(screen.getByTestId("chart-manmade")).toHaveTextContent("false");
    });

    test("handles manmade risk types correctly", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockInternalUser, riskSummary: mockManmadeRisk },
        client: queryClient,
      });

      expect(screen.getByTestId("summary-charts")).toBeInTheDocument();
      expect(screen.getByTestId("chart-manmade")).toHaveTextContent("true");
    });

    test("handles emerging risk types correctly by hiding charts", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: {
          user: mockInternalUser,
          riskSummary: mockEmergingRisk,
        },
        client: queryClient,
      });

      expect(screen.queryByTestId("summary-charts")).not.toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    test("handles malformed risk summary data", () => {
      const malformedRiskSummary = {
        // Missing required fields
        _cr4de_risk_file_value: "risk1",
      };

      expect(() => {
        renderWithContext(<RiskFileSummaryPage />, {
          outletContext: { user: null, riskSummary: malformedRiskSummary },
          client: queryClient,
        });
      }).not.toThrow();
    });
  });

  describe("Integration", () => {
    test("renders complete page layout", () => {
      renderWithContext(<RiskFileSummaryPage />, {
        outletContext: { user: mockInternalUser, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      // Check all major components are present
      expect(screen.getByTestId("risk-file-title")).toBeInTheDocument();
      expect(screen.getByTestId("summary-text")).toBeInTheDocument();
      expect(screen.getByTestId("summary-charts")).toBeInTheDocument();
      expect(screen.getByTestId("bnra-speed-dial")).toBeInTheDocument();
    });
  });
});
