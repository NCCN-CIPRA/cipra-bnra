export interface DVRiskFile {
  cr4de_riskfilesid: string;
  cr4de_hazard_id: string;

  cr4de_title: string;
  cr4de_risk_type: string;
  cr4de_risk_category: string;

  cr4de_definition: string | null;
  cr4de_historical_events: string | null;
  cr4de_intensity_parameters: string | null;
  cr4de_scenario_considerable: string | null;
  cr4de_scenario_major: string | null;
  cr4de_scenario_extreme: string | null;
  cr4de_horizon_analysis: string | null;
  cr4de_legal_bases: string | null;
  cr4de_roles_responsibilities: string | null;
  cr4de_existing_measures: string | null;
  cr4de_online_sources: string | null;

  cr4de_dp_quali: string | null;
  cr4de_dp_quanti_c: string | null;
  cr4de_dp_quanti_m: string | null;
  cr4de_dp_quanti_e: string | null;

  cr4de_di_quali_H_c: string | null;
  cr4de_di_quanti_Ha_c: string | null;
  cr4de_di_quanti_Hb_c: string | null;
  cr4de_di_quanti_Hc_c: string | null;
  cr4de_di_quali_S_c: string | null;
  cr4de_di_quanti_Sa_c: string | null;
  cr4de_di_quanti_Sb_c: string | null;
  cr4de_di_quanti_Sc_c: string | null;
  cr4de_di_quanti_Sd_c: string | null;
  cr4de_di_quali_E_c: string | null;
  cr4de_di_quanti_Ea_c: string | null;
  cr4de_di_quali_F_c: string | null;
  cr4de_di_quanti_Fa_c: string | null;
  cr4de_di_quanti_Fb_c: string | null;

  cr4de_di_quali_H_m: string | null;
  cr4de_di_quanti_Ha_m: string | null;
  cr4de_di_quanti_Hb_m: string | null;
  cr4de_di_quanti_Hc_m: string | null;
  cr4de_di_quali_S_m: string | null;
  cr4de_di_quanti_Sa_m: string | null;
  cr4de_di_quanti_Sb_m: string | null;
  cr4de_di_quanti_Sc_m: string | null;
  cr4de_di_quanti_Sd_m: string | null;
  cr4de_di_quali_E_m: string | null;
  cr4de_di_quanti_Ea_m: string | null;
  cr4de_di_quali_F_m: string | null;
  cr4de_di_quanti_Fa_m: string | null;
  cr4de_di_quanti_Fb_m: string | null;

  cr4de_di_quali_H_e: string | null;
  cr4de_di_quanti_Ha_e: string | null;
  cr4de_di_quanti_Hb_e: string | null;
  cr4de_di_quanti_Hc_e: string | null;
  cr4de_di_quali_S_e: string | null;
  cr4de_di_quanti_Sa_e: string | null;
  cr4de_di_quanti_Sb_e: string | null;
  cr4de_di_quanti_Sc_e: string | null;
  cr4de_di_quanti_Sd_e: string | null;
  cr4de_di_quali_E_e: string | null;
  cr4de_di_quanti_Ea_e: string | null;
  cr4de_di_quali_F_e: string | null;
  cr4de_di_quanti_Fa_e: string | null;
  cr4de_di_quanti_Fb_e: string | null;

  cr4de_climate_change_quali: string | null;
  cr4de_climate_change_quanti_c: string | null;
  cr4de_climate_change_quanti_m: string | null;
  cr4de_climate_change_quanti_e: string | null;

  cross_border_impact_quali: string | null;

  calculcated: string | null;
}
