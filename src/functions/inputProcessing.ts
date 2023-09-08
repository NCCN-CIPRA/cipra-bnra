import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../types/dataverse/DVDirectAnalysis";
import { DVRiskFile, RISK_TYPE } from "../types/dataverse/DVRiskFile";
import { SCENARIOS, SCENARIO_PARAMS } from "./scenarios";

interface DIRECT_ANALYSIS_SECTION {
  name: string;
  label: string;
}

export interface STATS {
  min: number;
  minLabel: string;
  max: number;
  maxLabel: string;
  avg: number;
  avgLabel: string;
  std: number;
}

export enum PARAMETER {
  DP,
  DP2050,
  H,
  S,
  E,
  F,
  CB,
}

export const DIRECT_ANALYSIS_SECTIONS_STANDARD: { [key in PARAMETER]: DIRECT_ANALYSIS_SECTION } = {
  [PARAMETER.DP]: {
    name: "dp",
    label: "Direct Probability",
  },
  [PARAMETER.DP2050]: {
    name: "dp50",
    label: "Direct Probability 2050",
  },
  [PARAMETER.H]: {
    name: "h",
    label: "Human Impact",
  },
  [PARAMETER.S]: {
    name: "s",
    label: "Societal Impact",
  },
  [PARAMETER.E]: {
    name: "e",
    label: "Environmental Impact",
  },
  [PARAMETER.F]: {
    name: "f",
    label: "Fincancial Impact",
  },
  [PARAMETER.CB]: {
    name: "cb",
    label: "Cross-border Effects",
  },
};

export const DIRECT_ANALYSIS_SECTIONS_MANMADE: Partial<{ [key in PARAMETER]: DIRECT_ANALYSIS_SECTION }> = {
  [PARAMETER.DP]: {
    name: "dp",
    label: "Motivation",
  },
};

export const getDASections = (riskFile: DVRiskFile) => {
  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD) {
    return [PARAMETER.DP, PARAMETER.H, PARAMETER.S, PARAMETER.E, PARAMETER.F, PARAMETER.CB].map(
      (p) => DIRECT_ANALYSIS_SECTIONS_STANDARD[p]
    ) as DIRECT_ANALYSIS_SECTION[];
  }
  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE) {
    return [DIRECT_ANALYSIS_SECTIONS_MANMADE[PARAMETER.DP]] as DIRECT_ANALYSIS_SECTION[];
  }
  return [] as DIRECT_ANALYSIS_SECTION[];
};

function getQuantiNumbers(quantiInput: (string | null)[]) {
  const good = quantiInput.filter((i) => i !== null) as string[];

  if (good.length <= 0) return null;

  const prefix = good[0].slice(0, good[0].search(/\d/));

  return {
    prefix,
    numbers: good.map((i) => parseInt(i.replace(prefix, ""), 10)),
  };
}

export function avg(n: number[], weights?: number[]) {
  const totalWeight = weights ? weights.reduce((tot, cur) => tot + cur) : n.length;

  return (
    Math.round(
      10 *
        n.reduce((tot, cur, i) => {
          if (weights) return tot + (cur * weights[i]) / totalWeight;
          return tot + cur / totalWeight;
        }, 0)
    ) / 10
  );
}

export function std(n: number[], weights?: number[]) {
  const average = avg(n, weights);

  const totalWeight = weights ? weights.reduce((tot, cur) => tot + cur) : n.length;

  return (
    Math.round(
      10 *
        Math.sqrt(
          n.reduce((varTot, cur, i) => {
            if (weights) {
              return varTot + Math.pow(weights[i] * (cur - average), 2);
            }

            return varTot + Math.pow(cur - average, 2);
          }, 0) / totalWeight
        )
    ) / 10.0
  );
}

export function getAverage(quantiInput: (string | null)[], weights?: number[]) {
  const n = getQuantiNumbers(quantiInput);

  if (!n) return null;

  return `${n.prefix}${avg(n.numbers, weights)}`;
}

export function getStd(quantiInput: (string | null)[], weights?: number[]) {
  const n = getQuantiNumbers(quantiInput);

  if (!n) return null;

  return std(n.numbers, weights);
}

export function getStats(quantiInput: (string | null)[], weights?: number[]): STATS | null {
  const n = getQuantiNumbers(quantiInput);

  if (!n) return null;

  const values = {
    min: Math.min(...n.numbers),
    max: Math.max(...n.numbers),
    avg: avg(n.numbers, weights),
    std: std(n.numbers, weights),
  };

  return {
    ...values,
    minLabel: `${n.prefix}${values.min}`,
    maxLabel: `${n.prefix}${values.max}`,
    avgLabel: `${n.prefix}${values.avg}`,
  };
}

export function getDADivergence(
  directAnalyses: DVDirectAnalysis[],
  scenario: SCENARIOS,
  section: DIRECT_ANALYSIS_SECTION
) {
  const fieldNames = getQuantiFieldNames(scenario, section);

  const stds = fieldNames.map((f) => {
    const stats = getStats(directAnalyses.map((da) => da[f] as string | null));

    if (stats === null) return null;

    return stats.std;
  });

  return Math.round((100 * avg(stds.filter((s) => s !== null) as number[])) / (section.name === "dp" ? 5 : 6)) / 100;
}

export function getCADivergence(cascadeAnalyses: DVCascadeAnalysis[]) {
  const stds = ["c2c", "c2m", "c2e", "m2c", "m2m", "m2e", "e2c", "e2m", "e2e"].map((f) => {
    return getStd(cascadeAnalyses.map((ca) => ca[`cr4de_${f}` as keyof DVCascadeAnalysis] as string | null));
  });

  return Math.round((100 * avg(stds.filter((s) => s !== null) as number[])) / 6) / 100;
}

export const getQualiFieldName = (scenario: SCENARIOS, parameter: DIRECT_ANALYSIS_SECTION): keyof DVDirectAnalysis => {
  if (parameter.name === "dp") {
    return `cr4de_dp_quali_${SCENARIO_PARAMS[scenario].prefix}` as keyof DVDirectAnalysis;
  }

  if (parameter.name === "cb") {
    return `cr4de_cross_border_impact_quali_${SCENARIO_PARAMS[scenario].prefix}` as keyof DVDirectAnalysis;
  }

  return `cr4de_di_quali_${parameter.name}_${SCENARIO_PARAMS[scenario].prefix}` as keyof DVDirectAnalysis;
};

export const getQuantiFieldNames = (
  scenario: SCENARIOS,
  parameter: DIRECT_ANALYSIS_SECTION
): (keyof DVDirectAnalysis)[] => {
  if (parameter.name === "dp") {
    return [`cr4de_dp_quanti_${SCENARIO_PARAMS[scenario].prefix}` as keyof DVDirectAnalysis];
  }

  if (parameter.name === "dp50") {
    return [`cr4de_dp50_quanti_${SCENARIO_PARAMS[scenario].prefix}` as keyof DVDirectAnalysis];
  }

  if (parameter.name === "cb") {
    return [];
  }

  return DIRECT_ANALYSIS_QUANTI_FIELDS.filter((f) =>
    f.match(new RegExp(`cr4de_di_quanti_${parameter.name}.{1}_${SCENARIO_PARAMS[scenario].prefix}`, "g"))
  );
};
