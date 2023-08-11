import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import { DIRECT_ANALYSIS_QUANTI_FIELDS, DVDirectAnalysis } from "../types/dataverse/DVDirectAnalysis";
import { DVRiskFile, RISK_TYPE } from "../types/dataverse/DVRiskFile";
import { SCENARIOS, SCENARIO_PARAMS } from "./scenarios";

interface DIRECT_ANALYSIS_SECTION {
  name: string;
  label: string;
}

export const DIRECT_ANALYSIS_SECTIONS_STANDARD: DIRECT_ANALYSIS_SECTION[] = [
  {
    name: "dp",
    label: "Direct Probability",
  },
  {
    name: "h",
    label: "Human Impact",
  },
  {
    name: "s",
    label: "Societal Impact",
  },
  {
    name: "e",
    label: "Environmental Impact",
  },
  {
    name: "f",
    label: "Fincancial Impact",
  },
  {
    name: "cb",
    label: "Cross-border Effects",
  },
];

export const DIRECT_ANALYSIS_SECTIONS_MANMADE: DIRECT_ANALYSIS_SECTION[] = [
  {
    name: "dp",
    label: "Motivation",
  },
];

export const getDASections = (riskFile: DVRiskFile) => {
  if (riskFile.cr4de_risk_type === RISK_TYPE.STANDARD) {
    return DIRECT_ANALYSIS_SECTIONS_STANDARD;
  }
  if (riskFile.cr4de_risk_type === RISK_TYPE.MANMADE) {
    return DIRECT_ANALYSIS_SECTIONS_MANMADE;
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

function avg(n: number[]) {
  return Math.round((10 * n.reduce((tot, cur) => tot + cur, 0)) / n.length) / 10;
}

function std(n: number[]) {
  const average = avg(n);

  return Math.round((10 * n.reduce((varTot, cur) => varTot + Math.pow(cur - average, 2), 0)) / n.length) / 10.0 / 6;
}

export function getAverage(quantiInput: (string | null)[]) {
  const n = getQuantiNumbers(quantiInput);

  if (!n) return null;

  return `${n.prefix}${avg(n.numbers)}`;
}

export function getStd(quantiInput: (string | null)[]) {
  const n = getQuantiNumbers(quantiInput);

  if (!n) return null;

  return std(n.numbers);
}

export function getStats(quantiInput: (string | null)[]) {
  const n = getQuantiNumbers(quantiInput);

  if (!n) return null;

  return {
    min: `${n.prefix}${Math.min(...n.numbers)}`,
    max: `${n.prefix}${Math.max(...n.numbers)}`,
    avg: `${n.prefix}${avg(n.numbers)}`,
    std: std(n.numbers),
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

  return avg(stds.filter((s) => s !== null) as number[]);
}

export function getCADivergence(cascadeAnalyses: DVCascadeAnalysis[]) {
  const stds = ["c2c", "c2m", "c2e", "m2c", "m2m", "m2e", "e2c", "e2m", "e2e"].map((f) => {
    return getStd(cascadeAnalyses.map((ca) => ca[`cr4de_${f}` as keyof DVCascadeAnalysis] as string | null));
  });

  return avg(stds.filter((s) => s !== null) as number[]);
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

  if (parameter.name === "cb") {
    return [];
  }

  return DIRECT_ANALYSIS_QUANTI_FIELDS.filter((f) =>
    f.match(new RegExp(`cr4de_di_quanti_${parameter.name}.{1}_${SCENARIO_PARAMS[scenario].prefix}`, "g"))
  );
};
