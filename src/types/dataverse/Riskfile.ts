import { HistoricalEvent } from "../../functions/historicalEvents";
import { IntensityParameter } from "../../functions/intensityParameters";
import { Scenarios } from "../../functions/scenarios";

export enum RISK_TYPE {
  STANDARD = "Standard Risk",
  MANMADE = "Malicious Man-made Risk",
  EMERGING = "Emerging Risk",
}

export const RISK_TYPE_NAMES: { [key in RISK_TYPE]: string } = {
  [RISK_TYPE.STANDARD]: "Standard Risk",
  [RISK_TYPE.MANMADE]: "Malicious Actors",
  [RISK_TYPE.EMERGING]: "Emerging Risk",
};

export enum RISK_CATEGORY {
  CYBER = "Cyber",
  ECOTECH = "EcoTech",
  HEALTH = "Health",
  MANMADE = "Man-made",
  NATURE = "Nature",
  TRANSVERSAL = "Transversal",
  EMERGING = "Emerging Risk",
  TEST = "Test",
}

export const CATEGORY_NAMES: Partial<{ [key in RISK_CATEGORY]: string }> = {
  Cyber: "Cyber Risks",
  EcoTech: "Economic and Technological Risks",
  Health: "Health Risks",
  "Man-made": "Human-made Risks",
  Nature: "Natural Risks",
  Transversal: "Societal Risks",
  "Emerging Risk": "Emerging Risks",
};

export type RiskFileEditableFields<T = ParsedRiskFields> = {
  cr4de_definition: string | null;
  cr4de_horizon_analysis: string | null;
} & T;

export type ParsedRiskFields = {
  cr4de_historical_events: HistoricalEvent[] | null;
  cr4de_intensity_parameters: IntensityParameter[] | null;
  cr4de_scenarios: Scenarios | null;
};

export type UnparsedRiskFields = {
  cr4de_historical_events: string | null;
  cr4de_intensity_parameters: string | null;
  cr4de_scenario_considerable: SerializedScenario | null;
  cr4de_scenario_major: SerializedScenario | null;
  cr4de_scenario_extreme: SerializedScenario | null;
};

export type SerializedScenario = string & {
  __json_seralized: IntensityParameter<string>[];
};
