import { isParameter } from "typescript";
import { CascadeCalculation, RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import { DVRiskFile, RISKFILE_RESULT_FIELD } from "../types/dataverse/DVRiskFile";
import {
  CASCADE_RESULT_FIELD,
  getCascadeParameter,
  getScenarioLetter,
  getScenarioParameter,
  getScenarioSuffix,
  SCENARIO_SUFFIX,
  SCENARIOS,
} from "./scenarios";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";

export type Effect = {
  id: string | null;
  name: string;

  cp: number;

  ha: number;
  hb: number;
  hc: number;
  sa: number;
  sb: number;
  sc: number;
  sd: number;
  ea: number;
  fa: number;
  fb: number;
  h: number;
  s: number;
  e: number;
  f: number;
  i: number;
  quali?: string | null;
  quali_cause?: string | null;

  quali_h?: string | null;
  quali_s?: string | null;
  quali_e?: string | null;
  quali_f?: string | null;
};

export type IMPACT_CATEGORY = "H" | "S" | "E" | "F";
export type DAMAGE_INDICATOR = "Ha" | "Hb" | "Hc" | "Sa" | "Sb" | "Sc" | "Sd" | "Ea" | "Fa" | "Fb";

// in k€ = € 1 000
const scales: { [key: string]: number } = {
  "0": 0,
  "0.5": 5000,
  "1": 16000,
  "1.5": 50000,
  "2": 160000,
  "2.5": 500000,
  "3": 1600000,
  "3.5": 5000000,
  "4": 16000000,
  "4.5": 50000000,
  "5": 160000000,
  "5.5": 500000000,
};

export function getAbsoluteImpact(scaleString: string | null) {
  if (scaleString === null) return 0;

  return 1000 * scales[scaleString.slice(2)];
}

export function getAbsoluteImpactFromFloat(scaleFloat: number) {
  return 1600000 * Math.pow(10, scaleFloat);
}

export function getImpactScaleNumber(absoluteImpact: number) {
  if (absoluteImpact === 0) return "0";

  const diffs: [string, number][] = Object.entries(scales)
    .sort((a, b) => b[1] - a[1])
    .map((v) => [v[0], Math.abs(Math.log(1000 * v[1]) - Math.log(absoluteImpact))]);

  const minDiff = diffs.reduce((min, cur) => (min[1] >= cur[1] ? cur : min));

  return minDiff[0];
}

export function getImpactScaleFloat(absoluteImpact: number) {
  return Math.log10(absoluteImpact / 1600000);
}

export function getImpactScale(absoluteImpact: number, scalePrefix: string) {
  return `${scalePrefix}${getImpactScaleNumber(absoluteImpact)}`;
}

export function getMoneyString(impactNumber: number) {
  if (impactNumber < 1000000) {
    return `€ ${impactNumber.toLocaleString()}`;
  }
  if (impactNumber < 1000000000) {
    return `€ ${(Math.round(impactNumber / 10000) / 100).toLocaleString()}M`;
  }
  if (impactNumber < 1000000000000) {
    return `€ ${(Math.round(impactNumber / 10000000) / 100).toLocaleString()}B`;
  }

  return `€ ${(Math.round(impactNumber / 10000000000) / 100).toLocaleString()}T`;
}

const gsp = (rf: DVRiskFile, parameter: RISKFILE_RESULT_FIELD, scenario: SCENARIOS) =>
  getScenarioParameter(rf, parameter, scenario) || 0.00000001;

export function getDirectImpact(rf: DVRiskFile, scenario: SCENARIOS): Effect {
  const scenarioSuffix = getScenarioSuffix(scenario);

  return {
    id: null,
    name: "Direct Impact",

    cp: gsp(rf, "DP", scenario) / gsp(rf, "TP", scenario),

    ha: gsp(rf, "DI_Ha", scenario) / gsp(rf, "TI_Ha", scenario),
    hb: gsp(rf, "DI_Hb", scenario) / gsp(rf, "TI_Hb", scenario),
    hc: gsp(rf, "DI_Hc", scenario) / gsp(rf, "TI_Hc", scenario),
    sa: gsp(rf, "DI_Sa", scenario) / gsp(rf, "TI_Sa", scenario),
    sb: gsp(rf, "DI_Sb", scenario) / gsp(rf, "TI_Sb", scenario),
    sc: gsp(rf, "DI_Sc", scenario) / gsp(rf, "TI_Sc", scenario),
    sd: gsp(rf, "DI_Sd", scenario) / gsp(rf, "TI_Sd", scenario),
    ea: gsp(rf, "DI_Ea", scenario) / gsp(rf, "TI_Ea", scenario),
    fa: gsp(rf, "DI_Fa", scenario) / gsp(rf, "TI_Fa", scenario),
    fb: gsp(rf, "DI_Fb", scenario) / gsp(rf, "TI_Fb", scenario),

    h: gsp(rf, "DI_H", scenario) / gsp(rf, "TI_H", scenario),
    s: gsp(rf, "DI_S", scenario) / gsp(rf, "TI_S", scenario),
    e: gsp(rf, "DI_E", scenario) / gsp(rf, "TI_E", scenario),
    f: gsp(rf, "DI_F", scenario) / gsp(rf, "TI_F", scenario),

    i: gsp(rf, "DI", scenario) / gsp(rf, "TI", scenario),

    quali_h: rf[`cr4de_di_quali_h${scenarioSuffix}`],
    quali_s: rf[`cr4de_di_quali_s${scenarioSuffix}`],
    quali_e: rf[`cr4de_di_quali_e${scenarioSuffix}`],
    quali_f: rf[`cr4de_di_quali_f${scenarioSuffix}`],
  };
}

const gcp = (c: DVRiskCascade, parameter: CASCADE_RESULT_FIELD, scenario: SCENARIOS) =>
  getCascadeParameter(c, scenario, parameter) || 0.00000001;

export function getIndirectImpact(c: DVRiskCascade<SmallRisk, SmallRisk>, rf: DVRiskFile, scenario: SCENARIOS): Effect {
  const scenarioLetter = getScenarioLetter(scenario);

  return {
    id: c.cr4de_effect_hazard.cr4de_riskfilesid,
    name: c.cr4de_effect_hazard.cr4de_title,

    cp: gcp(c, "CP_AVG", scenario), //c[`${scenarioLetter}2c`] + c[`${scenarioLetter}2m`] + c[`${scenarioLetter}2e`],

    ha: gcp(c, "II_Ha", scenario) / gsp(rf, "TI_Ha", scenario),
    hb: gcp(c, "II_Hb", scenario) / gsp(rf, "TI_Hb", scenario),
    hc: gcp(c, "II_Hc", scenario) / gsp(rf, "TI_Hc", scenario),
    sa: gcp(c, "II_Sa", scenario) / gsp(rf, "TI_Sa", scenario),
    sb: gcp(c, "II_Sb", scenario) / gsp(rf, "TI_Sb", scenario),
    sc: gcp(c, "II_Sc", scenario) / gsp(rf, "TI_Sc", scenario),
    sd: gcp(c, "II_Sd", scenario) / gsp(rf, "TI_Sd", scenario),
    ea: gcp(c, "II_Ea", scenario) / gsp(rf, "TI_Ea", scenario),
    fa: gcp(c, "II_Fa", scenario) / gsp(rf, "TI_Fa", scenario),
    fb: gcp(c, "II_Fb", scenario) / gsp(rf, "TI_Fb", scenario),

    h: gcp(c, "II_H", scenario) / gsp(rf, "TI_H", scenario),
    s: gcp(c, "II_S", scenario) / gsp(rf, "TI_S", scenario),
    e: gcp(c, "II_E", scenario) / gsp(rf, "TI_E", scenario),
    f: gcp(c, "II_F", scenario) / gsp(rf, "TI_F", scenario),

    i: gcp(c, "II", scenario) / gsp(rf, "TI", scenario),

    quali: c.cr4de_quali || "",
    quali_cause: c.cr4de_quali_cause,
  };
}

// const unscaleImpact = (j: number) => {
//   if (j < 0.5) {
//     return (j * 1.5) / 0.5;
//   }

//   return ((j - 0.5) * 3.5) / 4.5 + 1.5;
// };

export const getDamageIndicatorAbsoluteScale = (
  calculation: RiskCalculation,
  di: DAMAGE_INDICATOR,
  scenarioSuffix: SCENARIO_SUFFIX
) => {
  const diImpact = calculation[`ti_${di}${scenarioSuffix}`] || 0;

  return Math.round(10 * getImpactScaleFloat(diImpact)) / 10;
};

// export const getImpactCategoryRatio = (riskFile: DVRiskFile, category: IMPACT_CATEGORY, scenario: SCENARIOS) => {
//   if (!riskFile.results || !riskFile.results[scenario]) return 0;

//   const ti = getTotalImpactFromRelative(riskFile.results[scenario].TI);
//   const tiCategory =
//     getAbsoluteImpactFromFloat(riskFile.results[scenario][`TI_${category}a_abs`] || 0) +
//     getAbsoluteImpactFromFloat(riskFile.results[scenario][`TI_${category}b_abs` as RISKFILE_RESULT_FIELD] || 0) +
//     getAbsoluteImpactFromFloat(riskFile.results[scenario][`TI_${category}c_abs` as RISKFILE_RESULT_FIELD] || 0) +
//     getAbsoluteImpactFromFloat(riskFile.results[scenario][`TI_${category}d_abs` as RISKFILE_RESULT_FIELD] || 0);

//   return tiCategory / ti;
// };
