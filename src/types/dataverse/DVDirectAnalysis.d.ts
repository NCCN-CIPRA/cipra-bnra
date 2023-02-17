export interface DVDirectAnalysis<RiskFileType = undefined> {
  cr4de_bnradirectanalysisid: string;

  cr4de_expert: string;
  cr4de_risk_file: RiskFileType;
  _cr4de_risk_file_value: string;

  cr4de_dp_quali: string | null;
  cr4de_di_quali_h: string | null;
  cr4de_di_quali_s: string | null;
  cr4de_di_quali_e: string | null;
  cr4de_di_quali_f: string | null;

  cr4de_dp_quanti_c: string | null;
  cr4de_dp_quanti_m: string | null;
  cr4de_dp_quanti_e: string | null;

  cr4de_di_quanti_ha_c: string | null;
  cr4de_di_quanti_hb_c: string | null;
  cr4de_di_quanti_hc_c: string | null;
  cr4de_di_quanti_sa_c: string | null;
  cr4de_di_quanti_sb_c: string | null;
  cr4de_di_quanti_sc_c: string | null;
  cr4de_di_quanti_sd_c: string | null;
  cr4de_di_quanti_ea_c: string | null;
  cr4de_di_quanti_fa_c: string | null;
  cr4de_di_quanti_fb_c: string | null;

  cr4de_di_quanti_ha_m: string | null;
  cr4de_di_quanti_hb_m: string | null;
  cr4de_di_quanti_hc_m: string | null;
  cr4de_di_quanti_sa_m: string | null;
  cr4de_di_quanti_sb_m: string | null;
  cr4de_di_quanti_sc_m: string | null;
  cr4de_di_quanti_sd_m: string | null;
  cr4de_di_quanti_ea_m: string | null;
  cr4de_di_quanti_fa_m: string | null;
  cr4de_di_quanti_fb_m: string | null;

  cr4de_di_quanti_ha_e: string | null;
  cr4de_di_quanti_hb_e: string | null;
  cr4de_di_quanti_hc_e: string | null;
  cr4de_di_quanti_sa_e: string | null;
  cr4de_di_quanti_sb_e: string | null;
  cr4de_di_quanti_sc_e: string | null;
  cr4de_di_quanti_sd_e: string | null;
  cr4de_di_quanti_ea_e: string | null;
  cr4de_di_quanti_fa_e: string | null;
  cr4de_di_quanti_fb_e: string | null;

  cr4de_climate_change_quali: string | null;
  cr4de_climate_change_quanti_c: string | null;
  cr4de_climate_change_quanti_m: string | null;
  cr4de_climate_change_quanti_e: string | null;

  cr4de_cross_border_impact_quali: string | null;
}
