import { RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import {
  CASCADE_RESULT_SNAPSHOT,
  DVRiskCascade,
} from "../types/dataverse/DVRiskCascade";
import { RISKFILE_RESULT_FIELD } from "../types/dataverse/DVRiskFile";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
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
  [SCENARIOS.MAJOR]: {
    titleI18N: "2A.progress.major.title",
    titleDefault: "Major",
    color: "#FFE699",
    prefix: "m",
  },
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

export const unwrapScenario = (
  scenarioJSON: string,
  parameters: IntensityParameter[]
): IntensityParameter<string>[] => {
  try {
    const scenario = JSON.parse(scenarioJSON) as IntensityParameter<string>[];

    return scenario.map((p) => {
      const realParam = parameters.find((p2) => p.name === p2.name);

      if (realParam)
        return {
          ...p,
          description: realParam.description,
        };

      return p;
    });
  } catch {
    // Old HTML format
    const json = tableToJson(scenarioJSON);

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
      value: json[i] as unknown as string,
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

// export function scenariosEquals(a?: Scenarios, b?: Scenarios) {
//   // TODO
//   return false;
// }

export const getScenarioSuffix = (scenario: SCENARIOS): SCENARIO_SUFFIX => {
  if (scenario === SCENARIOS.CONSIDERABLE) return "_c";
  else if (scenario === SCENARIOS.MAJOR) return "_m";
  return "_e";
};

export const getScenarioParameter = (
  rf: SmallRisk,
  parameter: RISKFILE_RESULT_FIELD,
  scenario: SCENARIOS
): number | null => {
  if (!rf.results) return null;

  return rf.results[scenario][parameter];
};

const cascadeScenarios: { [key in SCENARIOS]: "C" | "M" | "E" } = {
  considerable: "C",
  major: "M",
  extreme: "E",
};

export type CASCADE_RESULT_FIELD =
  | "IP"
  | "IP50"
  | "CP_AVG"
  | "II"
  | "II_H"
  | "II_Ha"
  | "II_Hb"
  | "II_Hc"
  | "II_S"
  | "II_Sa"
  | "II_Sb"
  | "II_Sc"
  | "II_Sd"
  | "II_E"
  | "II_Ea"
  | "II_F"
  | "II_Fa"
  | "II_Fb";

export const getCascadeParameter = (
  cascade: DVRiskCascade,
  mainScenario: SCENARIOS,
  parameter: CASCADE_RESULT_FIELD
): number | null => {
  if (!cascade.results) return null;

  if (parameter === "IP" || parameter === "IP50")
    return cascade.results[
      `${parameter}_All2${cascadeScenarios[mainScenario]}`
    ];

  if (parameter === "CP_AVG")
    return cascade.results[
      `${parameter}_${cascadeScenarios[mainScenario]}2All`
    ];

  if (parameter.indexOf("II_") >= 0)
    return cascade.results[
      `II_${cascadeScenarios[mainScenario]}2All_${parameter.slice(
        3
      )}` as keyof CASCADE_RESULT_SNAPSHOT
    ];

  if (parameter === "II")
    return cascade.results[`II_${cascadeScenarios[mainScenario]}2All`];

  return null;
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

  return [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME][
    rs.indexOf(Math.max(...rs))
  ];
};
