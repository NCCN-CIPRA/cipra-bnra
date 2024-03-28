import { CascadeCalculation, RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../types/dataverse/DVRiskFile";

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

export function getDirectImpact(c: RiskCalculation, rf: DVRiskFile, scenarioSuffix: "_c" | "_m" | "_e") {
  return {
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
  scenarioSuffix: "_c" | "_m" | "_e",
  cascade?: DVRiskCascade
) {
  return {
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
