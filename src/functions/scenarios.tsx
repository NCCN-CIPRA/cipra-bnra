import { RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { IntensityParameter } from "./intensityParameters";
import tableToJson from "./tableToJson";

export enum SCENARIOS {
  CONSIDERABLE = "considerable",
  MAJOR = "major",
  EXTREME = "extreme",
}

export type SCENARIO_LETTER = "c" | "m" | "e";

export type SCENARIO_SUFFIX = "_c" | "_m" | "_e";

export interface Scenarios {
  considerable: IntensityParameter<string>[];
  major: IntensityParameter<string>[];
  extreme: IntensityParameter<string>[];
}

export const SCENARIO_PARAMS = {
  [SCENARIOS.CONSIDERABLE]: {
    titleI18N: "2A.progress.considerable.title",
    titleDefault: "Considerable",
    color: "#9DC3E6",
    prefix: "c",
  },
  [SCENARIOS.MAJOR]: { titleI18N: "2A.progress.major.title", titleDefault: "Major", color: "#FFE699", prefix: "m" },
  [SCENARIOS.EXTREME]: {
    titleI18N: "2A.progress.extreme.title",
    titleDefault: "Extreme",
    color: "#F47C7C",
    prefix: "e",
  },
};

const noScenarios = {
  considerable: [],
  major: [],
  extreme: [],
};

export const unwrapScenario = (scenario: string, parameters: IntensityParameter[]) => {
  try {
    return JSON.parse(scenario);
  } catch (e) {
    // Old HTML format
    const json = tableToJson(scenario);

    if (!json) return [];

    if (parameters.length <= 0)
      return [
        {
          name: "Capacity",
          description: "Actor capacity",
          value: json[0][0],
        },
      ];

    return parameters.map((p, i) => ({
      ...p,
      value: json[i],
    }));
  }
};

export function unwrap(
  parameters: IntensityParameter[],
  considerable: string | null,
  major: string | null,
  extreme: string | null
): Scenarios {
  if (!considerable || !major || !extreme) return noScenarios;

  return {
    considerable: unwrapScenario(considerable, parameters),
    major: unwrapScenario(major, parameters),
    extreme: unwrapScenario(extreme, parameters),
  };
}

export function wrap(scenario: IntensityParameter<string>[]): string {
  return JSON.stringify(scenario);
}

export function scenariosEquals(a?: Scenarios, b?: Scenarios) {
  // TODO
  return false;
}

export const getScenarioSuffix = (scenario: SCENARIOS): SCENARIO_SUFFIX => {
  if (scenario === SCENARIOS.CONSIDERABLE) return "_c";
  else if (scenario === SCENARIOS.MAJOR) return "_m";
  return "_e";
};

export const getScenarioLetter = (scenario: SCENARIOS): SCENARIO_LETTER => {
  if (scenario === SCENARIOS.CONSIDERABLE) return "c";
  else if (scenario === SCENARIOS.MAJOR) return "m";
  return "e";
};

export const getWorstCaseScenario = (calculation: RiskCalculation) => {
  const rs = [
    calculation.tp_c * calculation.ti_c,
    calculation.tp_m * calculation.ti_m,
    calculation.tp_e * calculation.ti_e,
  ];

  return [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME][rs.indexOf(Math.max(...rs))];
};
