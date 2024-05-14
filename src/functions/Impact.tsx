import { CascadeCalculation, RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";
import { SCENARIO_SUFFIX } from "./scenarios";

export type Effect = {
  id: string | null;
  name: string;
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
  quali?: string | null;
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

export function getImpactScaleNumber(absoluteImpact: number) {
  if (absoluteImpact === 0) return "0";

  const diffs: [string, number][] = Object.entries(scales)
    .sort((a, b) => b[1] - a[1])
    .map((v) => [v[0], Math.abs(Math.log(1000 * v[1]) - Math.log(absoluteImpact))]);

  const minDiff = diffs.reduce((min, cur) => (min[1] >= cur[1] ? cur : min));

  return minDiff[0];
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

export function getDirectImpact(c: RiskCalculation, rf: DVRiskFile, scenarioSuffix: SCENARIO_SUFFIX): Effect {
  return {
    id: null,
    name: "Direct Impact",
    ha: c[`di_Ha${scenarioSuffix}`] / c[`ti_Ha${scenarioSuffix}`],
    hb: c[`di_Hb${scenarioSuffix}`] / c[`ti_Hb${scenarioSuffix}`],
    hc: c[`di_Hc${scenarioSuffix}`] / c[`ti_Hc${scenarioSuffix}`],
    sa: c[`di_Sa${scenarioSuffix}`] / c[`ti_Sa${scenarioSuffix}`],
    sb: c[`di_Sb${scenarioSuffix}`] / c[`ti_Sb${scenarioSuffix}`],
    sc: c[`di_Sc${scenarioSuffix}`] / c[`ti_Sc${scenarioSuffix}`],
    sd: c[`di_Sd${scenarioSuffix}`] / c[`ti_Sd${scenarioSuffix}`],
    ea: c[`di_Ea${scenarioSuffix}`] / c[`ti_Ea${scenarioSuffix}`],
    fa: c[`di_Fa${scenarioSuffix}`] / c[`ti_Fa${scenarioSuffix}`],
    fb: c[`di_Fb${scenarioSuffix}`] / c[`ti_Fb${scenarioSuffix}`],

    h:
      (c[`di_Ha${scenarioSuffix}`] + c[`di_Hb${scenarioSuffix}`] + c[`di_Hc${scenarioSuffix}`]) /
      (c[`ti_Ha${scenarioSuffix}`] + c[`ti_Hb${scenarioSuffix}`] + c[`ti_Hc${scenarioSuffix}`]),
    s:
      (c[`di_Sa${scenarioSuffix}`] +
        c[`di_Sb${scenarioSuffix}`] +
        c[`di_Sc${scenarioSuffix}`] +
        c[`di_Sd${scenarioSuffix}`]) /
      (c[`ti_Sa${scenarioSuffix}`] +
        c[`ti_Sb${scenarioSuffix}`] +
        c[`ti_Sc${scenarioSuffix}`] +
        c[`ti_Sd${scenarioSuffix}`]),
    e: c[`di_Ea${scenarioSuffix}`] / c[`ti_Ea${scenarioSuffix}`],
    f:
      (c[`di_Fa${scenarioSuffix}`] + c[`di_Fb${scenarioSuffix}`]) /
      (c[`ti_Fa${scenarioSuffix}`] + c[`ti_Fb${scenarioSuffix}`]),

    quali_h: rf[`cr4de_di_quali_h${scenarioSuffix}`],
    quali_s: rf[`cr4de_di_quali_s${scenarioSuffix}`],
    quali_e: rf[`cr4de_di_quali_e${scenarioSuffix}`],
    quali_f: rf[`cr4de_di_quali_f${scenarioSuffix}`],
  };
}

export function getIndirectImpact(
  c: CascadeCalculation,
  tot: RiskCalculation,
  scenarioSuffix: SCENARIO_SUFFIX,
  cascade?: DVRiskCascade
): Effect {
  return {
    id: c.effect.riskId,
    name: c.effect.riskTitle,
    ha: c[`ii_Ha${scenarioSuffix}`] / tot[`ti_Ha${scenarioSuffix}`],
    hb: c[`ii_Hb${scenarioSuffix}`] / tot[`ti_Hb${scenarioSuffix}`],
    hc: c[`ii_Hc${scenarioSuffix}`] / tot[`ti_Hc${scenarioSuffix}`],
    sa: c[`ii_Sa${scenarioSuffix}`] / tot[`ti_Sa${scenarioSuffix}`],
    sb: c[`ii_Sb${scenarioSuffix}`] / tot[`ti_Sb${scenarioSuffix}`],
    sc: c[`ii_Sc${scenarioSuffix}`] / tot[`ti_Sc${scenarioSuffix}`],
    sd: c[`ii_Sd${scenarioSuffix}`] / tot[`ti_Sd${scenarioSuffix}`],
    ea: c[`ii_Ea${scenarioSuffix}`] / tot[`ti_Ea${scenarioSuffix}`],
    fa: c[`ii_Fa${scenarioSuffix}`] / tot[`ti_Fa${scenarioSuffix}`],
    fb: c[`ii_Fb${scenarioSuffix}`] / tot[`ti_Fb${scenarioSuffix}`],

    h:
      (c[`ii_Ha${scenarioSuffix}`] + c[`ii_Hb${scenarioSuffix}`] + c[`ii_Hc${scenarioSuffix}`]) /
      (tot[`ti_Ha${scenarioSuffix}`] + tot[`ti_Hb${scenarioSuffix}`] + tot[`ti_Hc${scenarioSuffix}`]),
    s:
      (c[`ii_Sa${scenarioSuffix}`] +
        c[`ii_Sb${scenarioSuffix}`] +
        c[`ii_Sc${scenarioSuffix}`] +
        c[`ii_Sd${scenarioSuffix}`]) /
      (tot[`ti_Sa${scenarioSuffix}`] +
        tot[`ti_Sb${scenarioSuffix}`] +
        tot[`ti_Sc${scenarioSuffix}`] +
        tot[`ti_Sd${scenarioSuffix}`]),
    e: c[`ii_Ea${scenarioSuffix}`] / tot[`ti_Ea${scenarioSuffix}`],
    f:
      (c[`ii_Fa${scenarioSuffix}`] + c[`ii_Fb${scenarioSuffix}`]) /
      (tot[`ti_Fa${scenarioSuffix}`] + tot[`ti_Fb${scenarioSuffix}`]),

    quali: (cascade && cascade.cr4de_quali) || "",
  };
}

export const getTotalImpactRelativeScale = (calculation: RiskCalculation, scenarioSuffix: SCENARIO_SUFFIX) => {
  const baseImpact = 800000000;
  const ti = calculation[`ti${scenarioSuffix}`];

  if (ti < baseImpact) return ti / baseImpact;

  return 1 + Math.log10(ti / baseImpact) / Math.log10(5);
};

const rescaleImpact = (i: number) => {
  // return i;
  if (i < 1.5) return 0.5 * (i / 1.5);
  // if (i > 3.5) return 4.5 + 0.5 * ((i - 3.5) / 1.5);
  return 0.5 + (4.5 * (i - 1.5)) / 3.5;
};

export const getCategoryImpact = (
  calculation: RiskCalculation,
  category: IMPACT_CATEGORY,
  scenarioSuffix: SCENARIO_SUFFIX
) => {
  return (
    (calculation[`ti_${category}a${scenarioSuffix}`] || 0) +
    ((calculation[`ti_${category}b${scenarioSuffix}` as keyof RiskCalculation] as number) || 0) +
    ((calculation[`ti_${category}c${scenarioSuffix}` as keyof RiskCalculation] as number) || 0) +
    ((calculation[`ti_${category}d${scenarioSuffix}` as keyof RiskCalculation] as number) || 0)
  );
};

export const getCategoryImpactRelativeScale = (
  calculation: RiskCalculation,
  category: IMPACT_CATEGORY,
  scenarioSuffix: SCENARIO_SUFFIX
) => {
  const totalImpact = getCategoryImpact(calculation, category, scenarioSuffix);

  if (totalImpact < 15811388) {
    return rescaleImpact(totalImpact / (2 * 15811388));
  }
  return rescaleImpact(Math.log10(Math.max(1, totalImpact) / 5) - 6);
};

export const getDamageIndicatorRelativeScale = (
  calculation: RiskCalculation,
  di: DAMAGE_INDICATOR,
  scenarioSuffix: SCENARIO_SUFFIX
) => {
  const totalImpact = getCategoryImpact(calculation, di[0] as IMPACT_CATEGORY, scenarioSuffix);
  const diImpact = calculation[`ti_${di}${scenarioSuffix}`] || 0;

  const ratio = diImpact / totalImpact;
  return (
    Math.round(10 * ratio * getCategoryImpactRelativeScale(calculation, di[0] as IMPACT_CATEGORY, scenarioSuffix)) / 10
  );
};
