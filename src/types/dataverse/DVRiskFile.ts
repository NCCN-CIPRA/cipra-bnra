export enum RISK_TYPE {
  STANDARD = "Standard Risk",
  MANMADE = "Malicious Man-made Risk",
  EMERGING = "Emerging Risk",
}

export interface RiskFileEditableFields {
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
}

export interface DVRiskFile extends RiskFileEditableFields {
  cr4de_riskfilesid: string;
  cr4de_hazard_id: string;

  cr4de_title: string;
  cr4de_risk_type: RISK_TYPE;
  cr4de_risk_category: string;

  cr4de_subjective_importance: number;

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

  cr4de_validations_processed: boolean | null;
  cr4de_validation_silent_procedure_until: Date | null;

  cr4de_step2a_enabled: boolean | null;
  cr4de_step2a_enabled_on: Date | null;
  cr4de_step2b_enabled: boolean | null;
  cr4de_step2b_enabled_on: Date | null;

  cr4de_is_test: boolean | null;
}
