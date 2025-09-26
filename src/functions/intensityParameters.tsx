export interface IntensityParameter<ValueType = undefined> {
  name: string;
  description: string;
  value: ValueType;
}

export function unwrap(parameters: string | null): IntensityParameter[] {
  if (!parameters) return [];

  return JSON.parse(parameters);
}

export function wrap(parameters: IntensityParameter[]): string {
  return JSON.stringify(parameters);
}
