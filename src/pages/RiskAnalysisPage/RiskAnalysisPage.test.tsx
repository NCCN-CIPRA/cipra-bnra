import { QueryClient } from "@tanstack/react-query";
import { renderWithContext } from "../../test/test-utils";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { SCENARIOS } from "../../functions/scenarios";
import { screen } from "@testing-library/react";
import RiskAnalysisPage from "./RiskAnalysisPage";
import * as Standard from "./Standard/Standard";
import { Cascades } from "../../functions/cascades";
import * as Emerging from "./Emerging/Emerging";
import * as ManMade from "./ManMade/ManMade";
import { createElement } from "react";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import {
  causeRisksSummaryMock,
  effectRisksSummaryMock,
  quantiScenariosMock,
} from "../../test/mocks";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

vi.mock("recharts", async (importOriginal) => {
  const originalModule = (await importOriginal()) as Record<string, unknown>;
  return {
    ...originalModule,
    ResponsiveContainer: () => createElement("div"),
  };
});

vi.mock("../../components/RiskFileTitle", () => ({
  default: ({ riskFile }: { riskFile: Partial<DVRiskFile> }) => (
    <div data-testid="risk-file-title">
      Risk File Title: {riskFile.cr4de_title}
    </div>
  ),
}));

const StandardSpy = vi.spyOn(Standard, "default");
const EmergingSpy = vi.spyOn(Emerging, "default");
const ManMadeSpy = vi.spyOn(ManMade, "default");

// Sample test data
const mockRiskSummary: Partial<DVRiskSummary> = {
  _cr4de_risk_file_value: "risk1",
  cr4de_hazard_id: "H001",
  cr4de_title: "Earthquake Risk",
  cr4de_risk_type: RISK_TYPE.STANDARD,
  cr4de_mrs: SCENARIOS.MAJOR,
  cr4de_causing_risks: JSON.stringify([causeRisksSummaryMock]),
  cr4de_effect_risks: JSON.stringify([effectRisksSummaryMock]),
};

const mockSnapshot: Partial<DVRiskSnapshot> = {
  _cr4de_risk_file_value: "risk1",
  cr4de_hazard_id: "H001",
  cr4de_title: "Earthquake Risk",
  cr4de_risk_type: RISK_TYPE.STANDARD,
  cr4de_mrs: SCENARIOS.MAJOR,
  cr4de_quanti: quantiScenariosMock,
};

const mockEmergingRiskSummary: Partial<DVRiskSummary> = {
  ...mockRiskSummary,
  _cr4de_risk_file_value: "emerging1",
  cr4de_title: "Emerging Technology Risk",
  cr4de_risk_type: RISK_TYPE.EMERGING,
};

const mockEmergingSnapshot: Partial<DVRiskSnapshot> = {
  ...mockSnapshot,
  _cr4de_risk_file_value: "emerging1",
  cr4de_title: "Emerging Technology Risk",
  cr4de_risk_type: RISK_TYPE.EMERGING,
  cr4de_quanti: quantiScenariosMock,
};

const mockManmadeRiskSummary: Partial<DVRiskSummary> = {
  ...mockRiskSummary,
  _cr4de_risk_file_value: "manmade1",
  cr4de_title: "Cyber Attack Risk",
  cr4de_risk_type: RISK_TYPE.MANMADE,
  cr4de_mrs: SCENARIOS.CONSIDERABLE,
};

const mockManmadeSnapshot: Partial<DVRiskSnapshot> = {
  ...mockSnapshot,
  _cr4de_risk_file_value: "manmade1",
  cr4de_title: "Cyber Attack Risk",
  cr4de_risk_type: RISK_TYPE.MANMADE,
  cr4de_quanti: quantiScenariosMock,
};

const cascadesMock: Cascades = {
  all: [],
  catalyzingEffects: [],
  causes: [],
  climateChange: null,
  effects: [],
};

describe("RiskFileSummaryPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    StandardSpy.mockClear();
    EmergingSpy.mockClear();
    ManMadeSpy.mockClear();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  describe("Initial Rendering", () => {
    test("renders standard risks without crashing", () => {
      renderWithContext(<RiskAnalysisPage />, {
        outletContext: {
          user: null,
          riskSummary: mockRiskSummary,
          riskSnapshot: mockSnapshot,
          cascades: cascadesMock,
        },
        client: queryClient,
      });

      expect(screen.getByTestId("risk-file-title")).toBeInTheDocument();
      expect(StandardSpy).toHaveBeenCalled();
      expect(EmergingSpy).not.toHaveBeenCalled();
      expect(ManMadeSpy).not.toHaveBeenCalled();
    });
    test("renders emerging risks without crashing", () => {
      renderWithContext(<RiskAnalysisPage />, {
        outletContext: {
          user: null,
          riskSummary: mockEmergingRiskSummary,
          riskSnapshot: mockEmergingSnapshot,
          cascades: cascadesMock,
        },
        client: queryClient,
      });

      expect(screen.getByTestId("risk-file-title")).toBeInTheDocument();
      expect(EmergingSpy).toHaveBeenCalled();
      expect(StandardSpy).not.toHaveBeenCalled();
      expect(ManMadeSpy).not.toHaveBeenCalled();
    });
    test("renders actor risks without crashing", () => {
      renderWithContext(<RiskAnalysisPage />, {
        outletContext: {
          user: null,
          riskSummary: mockManmadeRiskSummary,
          riskSnapshot: mockManmadeSnapshot,
          cascades: cascadesMock,
        },
        client: queryClient,
      });

      expect(screen.getByTestId("risk-file-title")).toBeInTheDocument();
      expect(ManMadeSpy).toHaveBeenCalled();
      expect(EmergingSpy).not.toHaveBeenCalled();
      expect(StandardSpy).not.toHaveBeenCalled();
    });
  });
});
