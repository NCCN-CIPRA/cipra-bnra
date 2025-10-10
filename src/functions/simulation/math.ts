import { AggregatedImpacts, Impact } from "./types";

export function addImpact<
  T = Impact | AggregatedImpacts,
  S = Impact | AggregatedImpacts
>(a: T, b: S): T & S {
  const result = { ...a, ...b } as T & S;

  for (const key in b) {
    (result[key] as number) =
      ((result[key] as number) || 0) + (b[key] as number);
  }

  return result;
}

export function divideImpact<T = Impact | AggregatedImpacts>(
  impact: T,
  divisor: number
) {
  if (divisor === 0) throw new Error("Division by zero in divideImpact");

  const result = { ...impact };

  for (const key in result) {
    (result[key] as number) += (result[key] as number) / divisor;
  }

  return result;
}

export function aggregateImpacts(impact: Impact): Impact & AggregatedImpacts {
  return {
    ...impact,
    all:
      impact.ha +
      impact.hb +
      impact.hc +
      impact.sa +
      impact.sb +
      impact.sc +
      impact.sd +
      impact.ea +
      impact.fa +
      impact.fb,
    h: impact.ha + impact.hb + impact.hc,
    s: impact.sa + impact.sb + impact.sc + impact.sd,
    e: impact.ea,
    f: impact.fa + impact.fb,
  };
}
