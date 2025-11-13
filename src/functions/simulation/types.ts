import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { RISK_CATEGORY } from "../../types/dataverse/Riskfile";
import {
  BoxPlotData,
  CascadeContributionData,
  CascadeCountData,
  CauseProbabilityData,
  HistogramBinData,
} from "./statistics";

export type Scenario = "considerable" | "major" | "extreme";

export type UnknownRiskSnapshot = DVRiskSnapshot<unknown, unknown, unknown>;

export type RootNode = {
  id: null;
  risks: RiskCascade[];
  actors: Actor[];
};

export type Risk = {
  id: string;
  hazardId: string;
  name: string;
  category: RISK_CATEGORY;

  cascades: RiskCascade[];

  directImpact: Record<Scenario, Impact>;
};

export type Actor = {
  id: string;
  name: string;
  directImpact: undefined;

  attacks: RiskCascade[];
};

export type Impact = {
  ha: number;
  hb: number;
  hc: number;

  sa: number;
  sb: number;
  sc: number;
  sd: number;

  ea: number;

  fa: number;
  fb: number;
};

export type AggregatedImpacts = {
  all: number;
  h: number;
  s: number;
  e: number;
  f: number;
} & Impact;

export type RiskCascade = {
  cause: RootNode | Risk | Actor;
  // If null, this is a root node
  causeScenario: Scenario | null;

  effect: Risk;
  // The probability of each effect scenario occurring given the cause scenario
  probabilities: Record<Scenario, number>;
};

export type SimulationOptions = {
  filterRiskFileIds?: string[];
  filterScenarios?: Scenario[];
  minRuns: number;
  maxRuns: number;
  relStd: number;
};

export type SimulationInput = {
  rootNode: RootNode;

  options: SimulationOptions;
};

export type RiskEvent = {
  risk: Risk | Actor;
  scenario: Scenario;

  source: RiskEvent | null;

  triggeredEvents: RiskEvent[];
  totalImpact: Impact;
};

export type AggregatedRiskEvent = {
  id: string;
  name: string;
  scenario: Scenario;
  impacts: AggregatedImpacts[];
};

export type AverageRiskEvent = {
  risk: { id: string; name: string; directImpact: Impact };
  scenario: Scenario;

  triggeredEvents: AverageRiskEvent[];

  probability: number;
  totalImpact: Impact;
  allImpacts: AggregatedImpacts[];
  allImpactContributions: AggregatedImpacts[];
  directImpact: Impact[];
  directImpactContributions: AggregatedImpacts[];
};

export type RiskScenarioSimulationOutput = {
  id: string;
  hazardId: string;
  name: string;
  category: RISK_CATEGORY;
  scenario: Scenario;
  medianImpact: number;
  totalProbability: number;
  impact: HistogramBinData[];
  indicators: BoxPlotData[];
  cascadeContributions: CascadeContributionData[];
  cascadeCounts: CascadeCountData[];
  rootCauses: CauseProbabilityData[];
  firstOrderCauses: CauseProbabilityData[];
};

export type SimulationRun = {
  events: RiskEvent[];
  totalImpact: Impact;
};

export type SimulationOutput = {
  risks: RiskScenarioSimulationOutput[];
};

export type RiskData = {
  risk: UnknownRiskSnapshot;
  occurrences: {
    event: RiskEvent;
    runIndex: number;
  }[];
  causes: {
    risk: UnknownRiskSnapshot | null;
    occurrences: {
      event: RiskEvent;
      runIndex: number;
    }[];
  }[];
  averageImpact: AggregatedImpacts;
  effects: {
    risk: UnknownRiskSnapshot;
    occurrences: {
      event: RiskEvent;
      runIndex: number;
    }[];
    averageImpact: AggregatedImpacts;
  }[];
};

export type SimulationData = Record<string, RiskData>;

export const noImpact = {
  ha: 0,
  hb: 0,
  hc: 0,
  sa: 0,
  sb: 0,
  sc: 0,
  sd: 0,
  ea: 0,
  fa: 0,
  fb: 0,
};

export const noAggregatedImpacts = {
  ...noImpact,
  all: 0,
  h: 0,
  s: 0,
  e: 0,
  f: 0,
};
