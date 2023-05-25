export interface DirectAnalysisEditableFields {
  cr4de_dp_quali_c: string | null;
  cr4de_dp_quanti_c: string | null;
  cr4de_dp_quali_m: string | null;
  cr4de_dp_quanti_m: string | null;
  cr4de_dp_quali_e: string | null;
  cr4de_dp_quanti_e: string | null;

  cr4de_di_quali_h_c: string | null;
  cr4de_di_quanti_ha_c: string | null;
  cr4de_di_quanti_hb_c: string | null;
  cr4de_di_quanti_hc_c: string | null;
  cr4de_di_quali_s_c: string | null;
  cr4de_di_quanti_sa_c: string | null;
  cr4de_di_quanti_sb_c: string | null;
  cr4de_di_quanti_sc_c: string | null;
  cr4de_di_quanti_sd_c: string | null;
  cr4de_di_quali_e_c: string | null;
  cr4de_di_quanti_ea_c: string | null;
  cr4de_di_quali_f_c: string | null;
  cr4de_di_quanti_fa_c: string | null;
  cr4de_di_quanti_fb_c: string | null;

  cr4de_di_quali_h_m: string | null;
  cr4de_di_quanti_ha_m: string | null;
  cr4de_di_quanti_hb_m: string | null;
  cr4de_di_quanti_hc_m: string | null;
  cr4de_di_quali_s_m: string | null;
  cr4de_di_quanti_sa_m: string | null;
  cr4de_di_quanti_sb_m: string | null;
  cr4de_di_quanti_sc_m: string | null;
  cr4de_di_quanti_sd_m: string | null;
  cr4de_di_quali_e_m: string | null;
  cr4de_di_quanti_ea_m: string | null;
  cr4de_di_quali_f_m: string | null;
  cr4de_di_quanti_fa_m: string | null;
  cr4de_di_quanti_fb_m: string | null;

  cr4de_di_quali_h_e: string | null;
  cr4de_di_quanti_ha_e: string | null;
  cr4de_di_quanti_hb_e: string | null;
  cr4de_di_quanti_hc_e: string | null;
  cr4de_di_quali_s_e: string | null;
  cr4de_di_quanti_sa_e: string | null;
  cr4de_di_quanti_sb_e: string | null;
  cr4de_di_quanti_sc_e: string | null;
  cr4de_di_quanti_sd_e: string | null;
  cr4de_di_quali_e_e: string | null;
  cr4de_di_quanti_ea_e: string | null;
  cr4de_di_quali_f_e: string | null;
  cr4de_di_quanti_fa_e: string | null;
  cr4de_di_quanti_fb_e: string | null;

  cr4de_cross_border_impact_quali_c: string | null;
  cr4de_cross_border_impact_quali_m: string | null;
  cr4de_cross_border_impact_quali_e: string | null;
}

export interface DVDirectAnalysis<RiskFileType = undefined> extends DirectAnalysisEditableFields {
  cr4de_bnradirectanalysisid: string;

  cr4de_expert: string;
  cr4de_risk_file: RiskFileType;
  _cr4de_risk_file_value: string;

  createdon: Date;
  modifiedon: Date;
}

export const DIRECT_ANALYSIS_EDITABLE_FIELDS: (keyof DirectAnalysisEditableFields)[] = [
  "cr4de_dp_quali_c",
  "cr4de_dp_quanti_c",
  "cr4de_dp_quali_m",
  "cr4de_dp_quanti_m",
  "cr4de_dp_quali_e",
  "cr4de_dp_quanti_e",

  "cr4de_di_quali_h_c",
  "cr4de_di_quanti_ha_c",
  "cr4de_di_quanti_hb_c",
  "cr4de_di_quanti_hc_c",
  "cr4de_di_quali_s_c",
  "cr4de_di_quanti_sa_c",
  "cr4de_di_quanti_sb_c",
  "cr4de_di_quanti_sc_c",
  "cr4de_di_quanti_sd_c",
  "cr4de_di_quali_e_c",
  "cr4de_di_quanti_ea_c",
  "cr4de_di_quali_f_c",
  "cr4de_di_quanti_fa_c",
  "cr4de_di_quanti_fb_c",

  "cr4de_di_quali_h_m",
  "cr4de_di_quanti_ha_m",
  "cr4de_di_quanti_hb_m",
  "cr4de_di_quanti_hc_m",
  "cr4de_di_quali_s_m",
  "cr4de_di_quanti_sa_m",
  "cr4de_di_quanti_sb_m",
  "cr4de_di_quanti_sc_m",
  "cr4de_di_quanti_sd_m",
  "cr4de_di_quali_e_m",
  "cr4de_di_quanti_ea_m",
  "cr4de_di_quali_f_m",
  "cr4de_di_quanti_fa_m",
  "cr4de_di_quanti_fb_m",

  "cr4de_di_quali_h_e",
  "cr4de_di_quanti_ha_e",
  "cr4de_di_quanti_hb_e",
  "cr4de_di_quanti_hc_e",
  "cr4de_di_quali_s_e",
  "cr4de_di_quanti_sa_e",
  "cr4de_di_quanti_sb_e",
  "cr4de_di_quanti_sc_e",
  "cr4de_di_quanti_sd_e",
  "cr4de_di_quali_e_e",
  "cr4de_di_quanti_ea_e",
  "cr4de_di_quali_f_e",
  "cr4de_di_quanti_fa_e",
  "cr4de_di_quanti_fb_e",

  "cr4de_cross_border_impact_quali_c",
  "cr4de_cross_border_impact_quali_m",
  "cr4de_cross_border_impact_quali_e",
];
