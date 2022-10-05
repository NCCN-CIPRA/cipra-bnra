import tableToJson from "./tableToJson";

export interface IntensityParameter<ValueType = undefined> {
  name: string;
  description: string;
  value: ValueType;
}

export function unwrap(parameters: string | null): IntensityParameter[] {
  if (!parameters) return [];

  try {
    return JSON.parse(parameters);
  } catch (e) {
    // Old HTML format
    const json = tableToJson(parameters);

    if (!json) return [];

    return json?.map((event) => ({
      name: event[0],
      description: event[1],
      value: undefined,
    }));
  }
}

export function wrap(parameters: IntensityParameter[]): string {
  return JSON.stringify(parameters);
}

export function equals(a?: IntensityParameter[], b?: IntensityParameter[]) {
  // TODO
  return false;
}
