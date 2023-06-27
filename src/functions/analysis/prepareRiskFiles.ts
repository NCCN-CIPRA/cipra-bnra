import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Quality, RiskCalculation } from "../../types/RiskCalculation";
import { getAbsoluteImpact } from "../Impact";
import { getAbsoluteProbability } from "../Probability";

interface OtherHazard {
  cr4de_title: string;
}

interface Metrics {
  consensus: number;
  average: number;
  missing: number;
  total: number;
}

function getBestValueRF(
  field: keyof DVRiskFile & keyof DVDirectAnalysis,
  riskFile: DVRiskFile,
  directAnalyses: DVDirectAnalysis[],
  absoluteValueGetter: (field: string) => number,
  metrics: Metrics
) {
  metrics.total++;

  if (riskFile[field] != null) {
    metrics.consensus++;
    return absoluteValueGetter(riskFile[field] as string);
  }

  // FIXME: check if participations are finished (direct_analysis_finished)
  const validDAs = directAnalyses.filter((da) => da[field] != null);

  if (validDAs.length > 0) {
    metrics.average++;
    return validDAs.reduce((tot, da) => tot + absoluteValueGetter(da[field] as string), 0) / validDAs.length;
  }

  metrics.missing++;
  return 0;
}

function getBestValueRC(
  field: keyof DVRiskCascade & keyof DVCascadeAnalysis,
  cascade: DVRiskCascade,
  cascadeAnalyses: DVCascadeAnalysis[],
  absoluteValueGetter: (field: string) => number,
  metrics: Metrics
) {
  metrics.total++;

  if (cascade[field] != null) {
    metrics.consensus++;
    return absoluteValueGetter(cascade[field] as string);
  }

  // FIXME: check if participations are finished (direct_analysis_finished)
  const validCAs = cascadeAnalyses.filter((ca) => ca[field] != null);

  if (validCAs.length > 0) {
    metrics.average++;
    return validCAs.reduce((tot, ca) => tot + absoluteValueGetter(ca[field] as string), 0) / validCAs.length;
  }

  metrics.missing++;
  return 0;
}

export default async function prepareRiskFiles(
  riskFiles: DVRiskFile[],
  cascades: DVRiskCascade<OtherHazard, OtherHazard>[],
  directAnalyses: DVDirectAnalysis[],
  cascadeAnalyses: DVCascadeAnalysis[]
): Promise<[RiskCalculation[], Metrics, Metrics]> {
  const daDict: { [key: string]: DVDirectAnalysis[] } = directAnalyses.reduce((acc, da) => {
    if (!acc[da._cr4de_risk_file_value]) {
      return {
        ...acc,
        [da._cr4de_risk_file_value]: [da],
      };
    }
    return {
      ...acc,
      [da._cr4de_risk_file_value]: [...acc[da._cr4de_risk_file_value], da],
    };
  }, {} as { [key: string]: DVDirectAnalysis[] });

  const caDict: { [key: string]: DVCascadeAnalysis[] } = cascadeAnalyses.reduce((acc, ca) => {
    if (!acc[ca._cr4de_cascade_value]) {
      return {
        ...acc,
        [ca._cr4de_cascade_value]: [ca],
      };
    }
    return {
      ...acc,
      [ca._cr4de_cascade_value]: [...acc[ca._cr4de_cascade_value], ca],
    };
  }, {} as { [key: string]: DVCascadeAnalysis[] });

  const daMetrics: Metrics = { consensus: 0, average: 0, missing: 0, total: 0 };
  const caMetrics = { consensus: 0, average: 0, missing: 0, total: 0 };

  return new Promise((resolve) => {
    const calculations: RiskCalculation[] = riskFiles.map((rf) => {
      const oldMetrics = { ...daMetrics };

      const c = {
        riskId: rf.cr4de_riskfilesid,

        timestamp: Date.now(),
        quality: Quality.CONSENSUS,

        // Initialize known fields
        dp_c: getBestValueRF(
          "cr4de_dp_quanti_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteProbability,
          daMetrics
        ),
        dp_m: getBestValueRF(
          "cr4de_dp_quanti_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteProbability,
          daMetrics
        ),
        dp_e: getBestValueRF(
          "cr4de_dp_quanti_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteProbability,
          daMetrics
        ),

        di_Ha_c: getBestValueRF(
          "cr4de_di_quanti_ha_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Hb_c: getBestValueRF(
          "cr4de_di_quanti_hb_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Hc_c: getBestValueRF(
          "cr4de_di_quanti_hc_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sa_c: getBestValueRF(
          "cr4de_di_quanti_sa_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sb_c: getBestValueRF(
          "cr4de_di_quanti_sb_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sc_c: getBestValueRF(
          "cr4de_di_quanti_sc_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sd_c: getBestValueRF(
          "cr4de_di_quanti_sd_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Ea_c: getBestValueRF(
          "cr4de_di_quanti_ea_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Fa_c: getBestValueRF(
          "cr4de_di_quanti_fa_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Fb_c: getBestValueRF(
          "cr4de_di_quanti_fb_c",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),

        di_Ha_m: getBestValueRF(
          "cr4de_di_quanti_ha_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Hb_m: getBestValueRF(
          "cr4de_di_quanti_hb_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Hc_m: getBestValueRF(
          "cr4de_di_quanti_hc_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sa_m: getBestValueRF(
          "cr4de_di_quanti_sa_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sb_m: getBestValueRF(
          "cr4de_di_quanti_sb_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sc_m: getBestValueRF(
          "cr4de_di_quanti_sc_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sd_m: getBestValueRF(
          "cr4de_di_quanti_sd_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Ea_m: getBestValueRF(
          "cr4de_di_quanti_ea_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Fa_m: getBestValueRF(
          "cr4de_di_quanti_fa_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Fb_m: getBestValueRF(
          "cr4de_di_quanti_fb_m",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),

        di_Ha_e: getBestValueRF(
          "cr4de_di_quanti_ha_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Hb_e: getBestValueRF(
          "cr4de_di_quanti_hb_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Hc_e: getBestValueRF(
          "cr4de_di_quanti_hc_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sa_e: getBestValueRF(
          "cr4de_di_quanti_sa_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sb_e: getBestValueRF(
          "cr4de_di_quanti_sb_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sc_e: getBestValueRF(
          "cr4de_di_quanti_sc_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Sd_e: getBestValueRF(
          "cr4de_di_quanti_sd_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Ea_e: getBestValueRF(
          "cr4de_di_quanti_ea_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Fa_e: getBestValueRF(
          "cr4de_di_quanti_fa_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),
        di_Fb_e: getBestValueRF(
          "cr4de_di_quanti_fb_e",
          rf,
          daDict[rf.cr4de_riskfilesid] || [],
          getAbsoluteImpact,
          daMetrics
        ),

        // Initialize unknown fields
        dp: 0,

        ip_c: 0,
        ip_m: 0,
        ip_e: 0,

        ip: 0,

        tp_c: 0,
        tp_m: 0,
        tp_e: 0,

        tp: 0,

        rp_c: 0,
        rp_m: 0,
        rp_e: 0,

        di_Ha: 0,
        di_Hb: 0,
        di_Hc: 0,
        di_Sa: 0,
        di_Sb: 0,
        di_Sc: 0,
        di_Sd: 0,
        di_Ea: 0,
        di_Fa: 0,
        di_Fb: 0,

        di_c: 0,
        di_m: 0,
        di_e: 0,

        di: 0,

        ii_Ha_c: 0,
        ii_Hb_c: 0,
        ii_Hc_c: 0,
        ii_Sa_c: 0,
        ii_Sb_c: 0,
        ii_Sc_c: 0,
        ii_Sd_c: 0,
        ii_Ea_c: 0,
        ii_Fa_c: 0,
        ii_Fb_c: 0,

        ii_Ha_m: 0,
        ii_Hb_m: 0,
        ii_Hc_m: 0,
        ii_Sa_m: 0,
        ii_Sb_m: 0,
        ii_Sc_m: 0,
        ii_Sd_m: 0,
        ii_Ea_m: 0,
        ii_Fa_m: 0,
        ii_Fb_m: 0,

        ii_Ha_e: 0,
        ii_Hb_e: 0,
        ii_Hc_e: 0,
        ii_Sa_e: 0,
        ii_Sb_e: 0,
        ii_Sc_e: 0,
        ii_Sd_e: 0,
        ii_Ea_e: 0,
        ii_Fa_e: 0,
        ii_Fb_e: 0,

        ii_Ha: 0,
        ii_Hb: 0,
        ii_Hc: 0,
        ii_Sa: 0,
        ii_Sb: 0,
        ii_Sc: 0,
        ii_Sd: 0,
        ii_Ea: 0,
        ii_Fa: 0,
        ii_Fb: 0,

        ii_c: 0,
        ii_m: 0,
        ii_e: 0,

        ii: 0,

        ti_Ha_c: 0,
        ti_Hb_c: 0,
        ti_Hc_c: 0,
        ti_Sa_c: 0,
        ti_Sb_c: 0,
        ti_Sc_c: 0,
        ti_Sd_c: 0,
        ti_Ea_c: 0,
        ti_Fa_c: 0,
        ti_Fb_c: 0,

        ti_Ha_m: 0,
        ti_Hb_m: 0,
        ti_Hc_m: 0,
        ti_Sa_m: 0,
        ti_Sb_m: 0,
        ti_Sc_m: 0,
        ti_Sd_m: 0,
        ti_Ea_m: 0,
        ti_Fa_m: 0,
        ti_Fb_m: 0,

        ti_Ha_e: 0,
        ti_Hb_e: 0,
        ti_Hc_e: 0,
        ti_Sa_e: 0,
        ti_Sb_e: 0,
        ti_Sc_e: 0,
        ti_Sd_e: 0,
        ti_Ea_e: 0,
        ti_Fa_e: 0,
        ti_Fb_e: 0,

        ti_Ha: 0,
        ti_Hb: 0,
        ti_Hc: 0,
        ti_Sa: 0,
        ti_Sb: 0,
        ti_Sc: 0,
        ti_Sd: 0,
        ti_Ea: 0,
        ti_Fa: 0,
        ti_Fb: 0,

        ti_c: 0,
        ti_m: 0,
        ti_e: 0,

        ti: 0,

        r: 0,

        causes: [],
        effects: [],
      };

      if (daMetrics.missing > oldMetrics.missing) c.quality = Quality.MISSING;
      else if (daMetrics.average > oldMetrics.average) c.quality = Quality.AVERAGE;

      return c;
    });

    // Create a lookup table so we can easily find a calculation by the id of its risk file
    const calculationsDict: { [key: string]: RiskCalculation } = calculations.reduce(
      (dict, calculation) => ({
        ...dict,
        [calculation.riskId]: calculation,
      }),
      {}
    );

    // Create links between the risk file calculation objects according to the risk cascades
    cascades.forEach((c) => {
      const cause = calculationsDict[c._cr4de_cause_hazard_value];
      const effect = calculationsDict[c._cr4de_effect_hazard_value];

      if (!cause || !effect) return;

      let oldMetrics = { ...caMetrics };

      cause.effects.push({
        risk: effect,
        riskId: c._cr4de_effect_hazard_value,

        quality: Quality.CONSENSUS,

        title: c.cr4de_effect_hazard.cr4de_title,

        cascadeId: c.cr4de_bnrariskcascadeid,

        c2c: getBestValueRC("cr4de_c2c", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        c2m: getBestValueRC("cr4de_c2m", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        c2e: getBestValueRC("cr4de_c2e", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        m2c: getBestValueRC("cr4de_m2c", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        m2m: getBestValueRC("cr4de_m2m", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        m2e: getBestValueRC("cr4de_m2e", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        e2c: getBestValueRC("cr4de_e2c", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        e2m: getBestValueRC("cr4de_e2m", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        e2e: getBestValueRC("cr4de_e2e", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),

        ii_Ha_c: 0,
        ii_Hb_c: 0,
        ii_Hc_c: 0,
        ii_Sa_c: 0,
        ii_Sb_c: 0,
        ii_Sc_c: 0,
        ii_Sd_c: 0,
        ii_Ea_c: 0,
        ii_Fa_c: 0,
        ii_Fb_c: 0,

        ii_Ha_m: 0,
        ii_Hb_m: 0,
        ii_Hc_m: 0,
        ii_Sa_m: 0,
        ii_Sb_m: 0,
        ii_Sc_m: 0,
        ii_Sd_m: 0,
        ii_Ea_m: 0,
        ii_Fa_m: 0,
        ii_Fb_m: 0,

        ii_Ha_e: 0,
        ii_Hb_e: 0,
        ii_Hc_e: 0,
        ii_Sa_e: 0,
        ii_Sb_e: 0,
        ii_Sc_e: 0,
        ii_Sd_e: 0,
        ii_Ea_e: 0,
        ii_Fa_e: 0,
        ii_Fb_e: 0,

        ii_Ha: 0,
        ii_Hb: 0,
        ii_Hc: 0,
        ii_Sa: 0,
        ii_Sb: 0,
        ii_Sc: 0,
        ii_Sd: 0,
        ii_Ea: 0,
        ii_Fa: 0,
        ii_Fb: 0,

        ii: 0,
      });

      if (caMetrics.missing > oldMetrics.missing) cause.effects[cause.effects.length - 1].quality = Quality.MISSING;
      else if (caMetrics.average > oldMetrics.average)
        cause.effects[cause.effects.length - 1].quality = Quality.AVERAGE;

      oldMetrics = { ...caMetrics };

      effect.causes.push({
        risk: cause,
        riskId: c._cr4de_cause_hazard_value,

        quality: Quality.CONSENSUS,

        title: c.cr4de_cause_hazard.cr4de_title,

        cascadeId: c.cr4de_bnrariskcascadeid,

        c2c: getBestValueRC("cr4de_c2c", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        c2m: getBestValueRC("cr4de_c2m", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        c2e: getBestValueRC("cr4de_c2e", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        m2c: getBestValueRC("cr4de_m2c", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        m2m: getBestValueRC("cr4de_m2m", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        m2e: getBestValueRC("cr4de_m2e", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        e2c: getBestValueRC("cr4de_e2c", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        e2m: getBestValueRC("cr4de_e2m", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),
        e2e: getBestValueRC("cr4de_e2e", c, caDict[c.cr4de_bnrariskcascadeid] || [], getAbsoluteProbability, caMetrics),

        ip_c: 0,
        ip_m: 0,
        ip_e: 0,

        ip: 0,
      });

      if (caMetrics.missing > oldMetrics.missing) effect.causes[effect.causes.length - 1].quality = Quality.MISSING;
      else if (caMetrics.average > oldMetrics.average)
        effect.causes[effect.causes.length - 1].quality = Quality.AVERAGE;
    });

    return resolve([calculations, daMetrics, caMetrics]);
  });
}
