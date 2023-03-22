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

const unwrapScenario = (scenario: string, parameters: IntensityParameter[]) => {
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
