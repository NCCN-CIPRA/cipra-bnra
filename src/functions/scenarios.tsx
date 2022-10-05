import { IntensityParameter } from "./intensityParameters";
import tableToJson from "./tableToJson";

export interface Scenarios {
  considerable: IntensityParameter<string>[];
  major: IntensityParameter<string>[];
  extreme: IntensityParameter<string>[];
}

const noScenarios = {
  considerable: [],
  major: [],
  extreme: [],
};

export function unwrap(
  parameters: IntensityParameter[],
  considerable: string | null,
  major: string | null,
  extreme: string | null
): Scenarios {
  if (!considerable || !major || !extreme) return noScenarios;

  try {
    return {
      considerable: JSON.parse(considerable),
      major: JSON.parse(major),
      extreme: JSON.parse(extreme),
    };
  } catch (e) {
    // Old HTML format
    const jsonC = tableToJson(considerable);
    const jsonM = tableToJson(major);
    const jsonE = tableToJson(extreme);

    if (!jsonC || !jsonM || !jsonE) return noScenarios;

    return {
      considerable: parameters.map((p, i) => ({
        ...p,
        value: jsonC[0][i],
      })),
      major: parameters.map((p, i) => ({
        ...p,
        value: jsonM[0][i],
      })),
      extreme: parameters.map((p, i) => ({
        ...p,
        value: jsonE[0][i],
      })),
    };
  }
}

export function wrap(scenario: IntensityParameter<string>[]): string {
  return JSON.stringify(scenario);
}

export function scenariosEquals(a?: Scenarios, b?: Scenarios) {
  // TODO
  return false;
}
