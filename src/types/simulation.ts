import { RISK_CATEGORY } from "./dataverse/Riskfile";

export type Scenario = "considerable" | "major" | "extreme";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export type Risk = {
  id: string;
  hazardId: string;
  name: string;
  category: RISK_CATEGORY;
  actor: boolean;

  directImpact: Record<Scenario, Impact>;
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
  cause: null | Risk;
  // If null, this is a root node
  causeScenario: Scenario | null;

  effect: Risk;
  // The probability of each effect scenario occurring given the cause scenario
  probabilities: Record<Scenario, number>;
};

export type SimulationOptions = {
  filterRiskFileIds?: string[];
  filterScenarios?: Scenario[];
  numYears: number;
  numEvents: number;
  relStd: number;
};

export type SimulationInput = {
  riskCatalogue: Risk[];
  cascadeCatalogue: Record<string, RiskCascade>;

  options: SimulationOptions;
};

export type RiskEvent = {
  risk: Risk;
  scenario: Scenario;

  source: RiskEvent | null;

  triggeredEvents: RiskEvent[];
  directImpact: AggregatedImpacts;
  totalImpact: AggregatedImpacts;
  impactContributions: Record<string, AggregatedImpacts>;
};

export type ImpactContributionStatistics = {
  id: string | null;
  risk: string;
  scenario: Scenario | null;
  contributionMean: AggregatedImpacts;
  contributionStd: AggregatedImpacts;
  contribution95Error: AggregatedImpacts;
};

export type EffectStatistics = {
  id: string | null;
  risk: string;
  scenario: Scenario | null;
  probabilityMean: number;
  probabilityStd: number;
  probability95Error: number;
};

export type HistogramBinData = {
  x: number;
  name: string;
  count: number;
  p: number;
  min: number;
  max: number;
  stdError: number;
};

export type BoxPlotData = {
  name: keyof AggregatedImpacts;
  raw: {
    min: number;
    lowerQuartile: number;
    median: number;
    upperQuartile: number;
    max: number;
  };
  min: number;
  bottomWhisker: number;
  bottomBox: number;
  topBox: number;
  topWhisker: number;
};

export type TotalImpactStatistics = {
  sampleMedian: AggregatedImpacts;
  sampleStd: AggregatedImpacts;
  relativeContributions: ImpactContributionStatistics[];
  effectProbabilities: EffectStatistics[];
  histogram: HistogramBinData[];
  boxplots: BoxPlotData[];
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

export type ProbabilityContributionStatistics = {
  id: string | null;
  risk: string;
  scenario: Scenario | null;
  contributionMean: number;
  contributionStd: number;
  contribution95Error: number;
};

export type TotalProbabilityStatistics = {
  sampleMean: number;
  sampleStd: number;
  relativeContributions: ProbabilityContributionStatistics[];
  relativeRootCauseContributions: ProbabilityContributionStatistics[];
};

export type RiskScenarioSimulationOutput = {
  id: string;
  hazardId: string;
  name: string;
  category: RISK_CATEGORY;
  scenario: Scenario;
  probabilityStatistics: TotalProbabilityStatistics;
  impactStatistics: TotalImpactStatistics;
};

export type SimulationRun = {
  events: RiskEvent[];
  totalImpact: Impact;
};

export type SimulationOutput = {
  risks: RiskScenarioSimulationOutput[];
};

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

export type Diagnostics = {
  riskScenarios: number;
  simulationTime: number;
  probabilityStatistics: {
    total: number;
    yearSimulation: number;
    counting: number;
    averageEvents: number;
    perRiskEvent: Record<string, number>;
  };
  impactStatisticsTime: number;
};
