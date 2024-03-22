import { CascadeCalculation, RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";

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

export function getDirectImpact(c: RiskCalculation) {
  return {
    name: "Direct Impact",
    ha: c.di_Ha_c / c.ti_Ha_c,
    hb: c.di_Hb_c / c.ti_Hb_c,
    hc: c.di_Hc_c / c.ti_Hc_c,
    sa: c.di_Sa_c / c.ti_Sa_c,
    sb: c.di_Sb_c / c.ti_Sb_c,
    sc: c.di_Sc_c / c.ti_Sc_c,
    sd: c.di_Sd_c / c.ti_Sd_c,
    ea: c.di_Ea_c / c.ti_Ea_c,
    fa: c.di_Fa_c / c.ti_Fa_c,
    fb: c.di_Fb_c / c.ti_Fb_c,

    h: (c.di_Ha_c + c.di_Hb_c + c.di_Hc_c) / (c.ti_Ha_c + c.ti_Hb_c + c.ti_Hc_c),
    s: (c.di_Sa_c + c.di_Sb_c + c.di_Sc_c + c.di_Sd_c) / (c.ti_Sa_c + c.ti_Sb_c + c.ti_Sc_c + c.ti_Sd_c),
    e: c.di_Ea_c / c.ti_Ea_c,
    f: (c.di_Fa_c + c.di_Fb_c) / (c.ti_Fa_c + c.ti_Fb_c),

    quali: null,
  };
}

export function getIndirectImpact(c: CascadeCalculation, tot: RiskCalculation, cascade?: DVRiskCascade) {
  return {
    name: c.effect.riskTitle,
    ha: c.ii_Ha_c / tot.ti_Ha_c,
    hb: c.ii_Hb_c / tot.ti_Hb_c,
    hc: c.ii_Hc_c / tot.ti_Hc_c,
    sa: c.ii_Sa_c / tot.ti_Sa_c,
    sb: c.ii_Sb_c / tot.ti_Sb_c,
    sc: c.ii_Sc_c / tot.ti_Sc_c,
    sd: c.ii_Sd_c / tot.ti_Sd_c,
    ea: c.ii_Ea_c / tot.ti_Ea_c,
    fa: c.ii_Fa_c / tot.ti_Fa_c,
    fb: c.ii_Fb_c / tot.ti_Fb_c,

    h: (c.ii_Ha_c + c.ii_Hb_c + c.ii_Hc_c) / (tot.ti_Ha_c + tot.ti_Hb_c + tot.ti_Hc_c),
    s: (c.ii_Sa_c + c.ii_Sb_c + c.ii_Sc_c + c.ii_Sd_c) / (tot.ti_Sa_c + tot.ti_Sb_c + tot.ti_Sc_c + tot.ti_Sd_c),
    e: c.ii_Ea_c / tot.ti_Ea_c,
    f: (c.ii_Fa_c + c.ii_Fb_c) / (tot.ti_Fa_c + tot.ti_Fb_c),

    quali: (cascade && cascade.cr4de_quali) || "",
  };
}
