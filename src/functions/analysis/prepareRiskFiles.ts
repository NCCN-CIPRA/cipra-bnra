import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { RiskCalculation } from "../../types/RiskCalculation";
import { getAbsoluteImpact } from "../Impact";
import { getAbsoluteProbability } from "../Probability";

interface OtherHazard {
  cr4de_title: string;
}

export default async function prepareRiskFiles(
  riskFiles: DVRiskFile[],
  cascades: DVRiskCascade<OtherHazard, OtherHazard>[]
): Promise<RiskCalculation[]> {
  return new Promise((resolve) => {
    const calculations: RiskCalculation[] = riskFiles.map((rf) => ({
      riskId: rf.cr4de_riskfilesid,

      // Initialize known fields
      dp_c: getAbsoluteProbability(rf.cr4de_dp_quanti_c),
      dp_m: getAbsoluteProbability(rf.cr4de_dp_quanti_m),
      dp_e: getAbsoluteProbability(rf.cr4de_dp_quanti_e),

      di_Ha_c: getAbsoluteImpact(rf.cr4de_di_quanti_ha_c),
      di_Hb_c: getAbsoluteImpact(rf.cr4de_di_quanti_hb_c),
      di_Hc_c: getAbsoluteImpact(rf.cr4de_di_quanti_hc_c),
      di_Sa_c: getAbsoluteImpact(rf.cr4de_di_quanti_sa_c),
      di_Sb_c: getAbsoluteImpact(rf.cr4de_di_quanti_sb_c),
      di_Sc_c: getAbsoluteImpact(rf.cr4de_di_quanti_sc_c),
      di_Sd_c: getAbsoluteImpact(rf.cr4de_di_quanti_sd_c),
      di_Ea_c: getAbsoluteImpact(rf.cr4de_di_quanti_ea_c),
      di_Fa_c: getAbsoluteImpact(rf.cr4de_di_quanti_fa_c),
      di_Fb_c: getAbsoluteImpact(rf.cr4de_di_quanti_fb_c),

      di_Ha_m: getAbsoluteImpact(rf.cr4de_di_quanti_ha_m),
      di_Hb_m: getAbsoluteImpact(rf.cr4de_di_quanti_hb_m),
      di_Hc_m: getAbsoluteImpact(rf.cr4de_di_quanti_hc_m),
      di_Sa_m: getAbsoluteImpact(rf.cr4de_di_quanti_sa_m),
      di_Sb_m: getAbsoluteImpact(rf.cr4de_di_quanti_sb_m),
      di_Sc_m: getAbsoluteImpact(rf.cr4de_di_quanti_sc_m),
      di_Sd_m: getAbsoluteImpact(rf.cr4de_di_quanti_sd_m),
      di_Ea_m: getAbsoluteImpact(rf.cr4de_di_quanti_ea_m),
      di_Fa_m: getAbsoluteImpact(rf.cr4de_di_quanti_fa_m),
      di_Fb_m: getAbsoluteImpact(rf.cr4de_di_quanti_fb_m),

      di_Ha_e: getAbsoluteImpact(rf.cr4de_di_quanti_ha_e),
      di_Hb_e: getAbsoluteImpact(rf.cr4de_di_quanti_hb_e),
      di_Hc_e: getAbsoluteImpact(rf.cr4de_di_quanti_hc_e),
      di_Sa_e: getAbsoluteImpact(rf.cr4de_di_quanti_sa_e),
      di_Sb_e: getAbsoluteImpact(rf.cr4de_di_quanti_sb_e),
      di_Sc_e: getAbsoluteImpact(rf.cr4de_di_quanti_sc_e),
      di_Sd_e: getAbsoluteImpact(rf.cr4de_di_quanti_sd_e),
      di_Ea_e: getAbsoluteImpact(rf.cr4de_di_quanti_ea_e),
      di_Fa_e: getAbsoluteImpact(rf.cr4de_di_quanti_fa_e),
      di_Fb_e: getAbsoluteImpact(rf.cr4de_di_quanti_fb_e),

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
    }));

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

      cause.effects.push({
        risk: effect,
        riskId: c._cr4de_effect_hazard_value,

        title: c.cr4de_effect_hazard.cr4de_title,

        cascadeId: c.cr4de_bnrariskcascadeid,

        c2c: getAbsoluteProbability(c.cr4de_c2c),
        c2m: getAbsoluteProbability(c.cr4de_c2m),
        c2e: getAbsoluteProbability(c.cr4de_c2e),
        m2c: getAbsoluteProbability(c.cr4de_m2c),
        m2m: getAbsoluteProbability(c.cr4de_m2m),
        m2e: getAbsoluteProbability(c.cr4de_m2e),
        e2c: getAbsoluteProbability(c.cr4de_e2c),
        e2m: getAbsoluteProbability(c.cr4de_e2m),
        e2e: getAbsoluteProbability(c.cr4de_e2e),

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

      effect.causes.push({
        risk: cause,
        riskId: c._cr4de_cause_hazard_value,

        title: c.cr4de_cause_hazard.cr4de_title,

        cascadeId: c.cr4de_bnrariskcascadeid,

        c2c: getAbsoluteProbability(c.cr4de_c2c),
        c2m: getAbsoluteProbability(c.cr4de_c2m),
        c2e: getAbsoluteProbability(c.cr4de_c2e),
        m2c: getAbsoluteProbability(c.cr4de_m2c),
        m2m: getAbsoluteProbability(c.cr4de_m2m),
        m2e: getAbsoluteProbability(c.cr4de_m2e),
        e2c: getAbsoluteProbability(c.cr4de_e2c),
        e2m: getAbsoluteProbability(c.cr4de_e2m),
        e2e: getAbsoluteProbability(c.cr4de_e2e),

        ip_c: 0,
        ip_m: 0,
        ip_e: 0,

        ip: 0,
      });
    });

    return resolve(calculations);
  });
}
