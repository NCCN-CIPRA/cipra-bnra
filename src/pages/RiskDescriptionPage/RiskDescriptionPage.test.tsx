import { QueryClient } from "@tanstack/react-query";
import { renderWithContext } from "../../test/test-utils";
import RiskDescriptionPage from "./RiskDescriptionPage";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS } from "../../functions/scenarios";
import { screen } from "@testing-library/react";

vi.mock("../../components/RiskFileTitle", () => ({
  default: ({ riskFile }: { riskFile: Partial<DVRiskFile> }) => (
    <div data-testid="risk-file-title">
      Risk File Title: {riskFile.cr4de_title}
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
    test("renders standard risks without crashing", () => {
      renderWithContext(<RiskDescriptionPage />, {
        outletContext: { user: null, riskSummary: mockRiskSummary },
        client: queryClient,
      });

      expect(screen.getByTestId("risk-file-title")).toBeInTheDocument();
    });
    test("renders emerging risks without crashing", () => {
      renderWithContext(<RiskDescriptionPage />, {
        outletContext: { user: null, riskSummary: mockEmergingRisk },
        client: queryClient,
      });

      expect(screen.getByTestId("risk-file-title")).toBeInTheDocument();
    });
    test("renders actor risks without crashing", () => {
      renderWithContext(<RiskDescriptionPage />, {
        outletContext: { user: null, riskSummary: mockManmadeRisk },
        client: queryClient,
      });

      expect(screen.getByTestId("risk-file-title")).toBeInTheDocument();
    });
  });
});
