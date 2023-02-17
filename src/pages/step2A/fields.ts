import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

export const FIELDS: (keyof DVDirectAnalysis)[] = [
  "cr4de_dp_quali",
  "cr4de_dp_quanti_c",
  "cr4de_dp_quanti_m",
  "cr4de_dp_quanti_e",
  "cr4de_di_quali_h",
  "cr4de_di_quali_s",
  "cr4de_di_quali_e",
  "cr4de_di_quali_f",
  "cr4de_di_quanti_ha_c",
  "cr4de_di_quanti_hb_c",
  "cr4de_di_quanti_hc_c",
  "cr4de_di_quanti_sa_c",
  "cr4de_di_quanti_sb_c",
  "cr4de_di_quanti_sc_c",
  "cr4de_di_quanti_sd_c",
  "cr4de_di_quanti_ea_c",
  "cr4de_di_quanti_fa_c",
  "cr4de_di_quanti_fb_c",
  "cr4de_di_quanti_ha_m",
  "cr4de_di_quanti_hb_m",
  "cr4de_di_quanti_hc_m",
  "cr4de_di_quanti_sa_m",
  "cr4de_di_quanti_sb_m",
  "cr4de_di_quanti_sc_m",
  "cr4de_di_quanti_sd_m",
  "cr4de_di_quanti_ea_m",
  "cr4de_di_quanti_fa_m",
  "cr4de_di_quanti_fb_m",
  "cr4de_di_quanti_ha_e",
  "cr4de_di_quanti_hb_e",
  "cr4de_di_quanti_hc_e",
  "cr4de_di_quanti_sa_e",
  "cr4de_di_quanti_sb_e",
  "cr4de_di_quanti_sc_e",
  "cr4de_di_quanti_sd_e",
  "cr4de_di_quanti_ea_e",
  "cr4de_di_quanti_fa_e",
  "cr4de_di_quanti_fb_e",
  "cr4de_climate_change_quali",
  "cr4de_climate_change_quanti_c",
  "cr4de_climate_change_quanti_m",
  "cr4de_climate_change_quanti_e",
  "cr4de_cross_border_impact_quali",
];

export default function getDefaultFields(step2A: DVDirectAnalysis<DVRiskFile | undefined>) {
  return FIELDS.reduce(
    (acc, f) => ({
      ...acc,
      [f]: step2A[f] || null,
    }),
    {}
  );
}
