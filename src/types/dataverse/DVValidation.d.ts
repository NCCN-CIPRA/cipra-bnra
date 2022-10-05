export interface DVValidation<RiskFileType = string> {
  cr4de_bnravalidationid: string;

  cr4de_expert: string;
  cr4de_RiskFile: RiskFileType;

  cr4de_definition_feedback?: string;
  cr4de_historical_events_feedback?: string;
  cr4de_intensity_parameters_feedback?: string;
  cr4de_scenarios_feedback?: string;
  cr4de_horizon_analysis_feedback?: string;
  cr4de_causes_feedback?: string;
  cr4de_effects_feedback?: string;
  cr4de_catalysing_effects_feedback?: string;
}
