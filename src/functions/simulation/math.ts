import { AggregatedImpacts, Impact } from "../../types/simulation";

export function round(n: number, digits: number) {
  const f = Math.pow(10, digits);
  return Math.round(n * f) / f;
}

export function roundImpact<T = Impact | AggregatedImpacts>(
  n: T,
  digits: number,
) {
  const f = Math.pow(10, digits);

  const result = { ...n };

  for (const key in n) {
    (result[key] as number) = Math.round((n[key] as number) * f) / f;
  }

  return result;
}

export function addImpact<T = Impact | AggregatedImpacts>(a: T, b: T): T {
  const result = { ...a };

  for (const key in a) {
    (result[key] as number) = (a[key] as number) + (b[key] as number);
  }

  return result;
}

export function negImpact<T = Impact | AggregatedImpacts>(a: T): T {
  const result = { ...a } as T;

  for (const key in a) {
    (result[key] as number) = -(result[key] as number);
  }

  return result;
}

export function subtractImpacts<T = Impact | AggregatedImpacts>(a: T, b: T): T {
  return addImpact(a, negImpact(b));
}

export function multiplyImpact<T = Impact | AggregatedImpacts>(
  impact: T,
  multiplicator: number,
) {
  const result = { ...impact };

  for (const key in result) {
    (result[key] as number) = (result[key] as number) * multiplicator;
  }

  return result;
}

export function divideImpact<T = Impact | AggregatedImpacts>(
  impact: T,
  divisor: number,
) {
  if (divisor === 0) throw new Error("Division by zero in divideImpact");

  return multiplyImpact(impact, 1 / divisor);
}

export function divideImpacts<T = Impact | AggregatedImpacts>(
  impact: T,
  divisor: T,
) {
  const result = { ...impact };

  for (const key in impact) {
    if (divisor[key] === 0) {
      (result[key] as number) = 0;
    } else {
      (result[key] as number) =
        (impact[key] as number) / (divisor[key] as number);
    }
  }

  return result;
}

export function powImpact<T = Impact | AggregatedImpacts>(
  impact: T,
  exponent: number,
) {
  const result = { ...impact };

  for (const key in result) {
    (result[key] as number) = Math.pow(result[key] as number, exponent);
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
