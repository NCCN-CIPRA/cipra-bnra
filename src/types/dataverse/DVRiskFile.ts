import { DiscussionRequired } from "../DiscussionRequired";
import { DVAnalysisRun } from "./DVAnalysisRun";

export enum RISK_TYPE {
  STANDARD = "Standard Risk",
  MANMADE = "Malicious Man-made Risk",
  EMERGING = "Emerging Risk",
}

export enum CONSENSUS_TYPE {
  MEETING = 0,
  SILENCE = 1,
  NONE = 2,
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

export interface DiscussionsRequired {
  dp_c: DiscussionRequired;
  dp_m: DiscussionRequired;
  dp_e: DiscussionRequired;

  h_c: DiscussionRequired;
  s_c: DiscussionRequired;
  e_c: DiscussionRequired;
  f_c: DiscussionRequired;

  h_m: DiscussionRequired;
  s_m: DiscussionRequired;
  e_m: DiscussionRequired;
  f_m: DiscussionRequired;

  h_e: DiscussionRequired;
  s_e: DiscussionRequired;
  e_e: DiscussionRequired;
  f_e: DiscussionRequired;

  cb: DiscussionRequired;
}

export interface DVRiskFile<CalculationType = unknown> extends RiskFileEditableFields {
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
  cr4de_consensus_type: CONSENSUS_TYPE | null;
  cr4de_consensus_date: Date | null;
  cr4de_discussion_required: DiscussionsRequired | null;

  cr4de_is_test: boolean | null;

  cr4de_latest_calculation: CalculationType | null;
  _cr4de_latest_calculation_value: string | null;

  createdon: string;
  modifiedon: string;
}

export const RISK_FILE_QUANTI_FIELDS: (keyof DVRiskFile)[] = [
  "cr4de_dp_quanti_c",
  "cr4de_dp_quanti_m",
  "cr4de_dp_quanti_e",

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

  "cr4de_climate_change_quanti_c",
  "cr4de_climate_change_quanti_m",
  "cr4de_climate_change_quanti_e",
];
