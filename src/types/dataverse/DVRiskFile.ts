import { SCENARIOS } from "../../functions/scenarios";
import { DiscussionRequired } from "../DiscussionRequired";
import { DVAnalysisRun } from "./DVAnalysisRun";

export enum RISK_TYPE {
  STANDARD = "Standard Risk",
  MANMADE = "Malicious Man-made Risk",
  EMERGING = "Emerging Risk",
}

export enum RISK_CATEGORY {
  CYBER = "Cyber",
  ECOTECH = "EcoTech",
  HEALTH = "Health",
  MANMADE = "Man-made",
  NATURE = "Nature",
  TRANSVERSAL = "Transversal",
  EMERGING = "Emerging Risk",
  TEST = "Test",
}

export const CATEGORY_NAMES: Partial<{ [key in RISK_CATEGORY]: string }> = {
  Cyber: "Cyber Risks",
  EcoTech: "Economic and Technological Risks",
  Health: "Health Risks",
  "Man-made": "Man-made Risks and Malicious Actors",
  Nature: "Natural Risks",
  Transversal: "Societal Risks",
  "Emerging Risk": "Emerging Risks",
};

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
  cr4de_risk_category: RISK_CATEGORY;
  cr4de_key_risk: boolean;

  cr4de_label_hilp: boolean | null;
  cr4de_label_cc: boolean | null;
  cr4de_label_cb: boolean | null;
  cr4de_label_impact: "Human" | "Societal" | "Environmental" | "Financial" | null;

  cr4de_mrs: SCENARIOS | null;
  cr4de_mrs_summary: string | null;
  cr4de_mrs_summary_nl: string | null;
  cr4de_mrs_summary_fr: string | null;
  cr4de_mrs_summary_de: string | null;
  cr4de_mrs_scenario: string | null;
  cr4de_mrs_disclaimer: string | null;
  cr4de_mrs_probability: string | null;
  cr4de_mrs_impact_h: string | null;
  cr4de_mrs_impact_s: string | null;
  cr4de_mrs_impact_e: string | null;
  cr4de_mrs_impact_f: string | null;
  cr4de_mrs_actions: string | null;
  cr4de_mrs_mm_impact: string | null;
  cr4de_mrs_cc: string | null;

  cr4de_subjective_importance: number;

  cr4de_dp_quali: string | null;
  cr4de_dp_quali_c: string | null;
  cr4de_dp_quali_m: string | null;
  cr4de_dp_quali_e: string | null;
  cr4de_di_quali_h: string | null;
  cr4de_di_quali_s: string | null;
  cr4de_di_quali_e: string | null;
  cr4de_di_quali_f: string | null;

  cr4de_di_quali_h_c: string | null;
  cr4de_di_quali_s_c: string | null;
  cr4de_di_quali_e_c: string | null;
  cr4de_di_quali_f_c: string | null;
  cr4de_di_quali_h_m: string | null;
  cr4de_di_quali_s_m: string | null;
  cr4de_di_quali_e_m: string | null;
  cr4de_di_quali_f_m: string | null;
  cr4de_di_quali_h_e: string | null;
  cr4de_di_quali_s_e: string | null;
  cr4de_di_quali_e_e: string | null;
  cr4de_di_quali_f_e: string | null;

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

  cr4de_cross_border_impact_quali_c: string | null;
  cr4de_cross_border_impact_quali_m: string | null;
  cr4de_cross_border_impact_quali_e: string | null;

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

  cr4de_result_snapshot: string | null;
  results?: RESULT_SNAPSHOT | null;

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

export type RISKFILE_RESULT_FIELD =
  | "TP"
  | "TP50"
  | "TI" // Total Impact of the risk in relative scale (0 - 5)
  | "TI_H" // Total human impact of the risk as a ratio to TI (0 - 1)
  | "TI_Ha" // Total Ha impact of the risk as a ratio to TI (0 - 1)
  | "TI_Hb" // Etc...
  | "TI_Hc"
  | "TI_S"
  | "TI_Sa"
  | "TI_Sb"
  | "TI_Sc"
  | "TI_Sd"
  | "TI_E"
  | "TI_Ea"
  | "TI_F"
  | "TI_Fa"
  | "TI_Fb"
  | "TI_Ha_abs"
  | "TI_Hb_abs"
  | "TI_Hc_abs"
  | "TI_Sa_abs"
  | "TI_Sb_abs"
  | "TI_Sc_abs"
  | "TI_Sd_abs"
  | "TI_Ea_abs"
  | "TI_Fa_abs"
  | "TI_Fb_abs"
  | "DP"
  | "DP50"
  | "DI"
  | "DI_H"
  | "DI_Ha"
  | "DI_Hb"
  | "DI_Hc"
  | "DI_S"
  | "DI_Sa"
  | "DI_Sb"
  | "DI_Sc"
  | "DI_Sd"
  | "DI_E"
  | "DI_Ea"
  | "DI_F"
  | "DI_Fa"
  | "DI_Fb";

export type RESULT_SNAPSHOT = {
  [key in SCENARIOS]: { [key in RISKFILE_RESULT_FIELD]: number };
};
