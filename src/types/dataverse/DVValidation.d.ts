export interface DVValidation<RiskFileType = undefined, ContactType = undefined> {
  cr4de_bnravalidationid: string;

  cr4de_expert: ContactType;
  _cr4de_expert_value: string;
  cr4de_RiskFile: RiskFileType;
  _cr4de_RiskFile_value: string;

  cr4de_definition_feedback?: string;
  cr4de_historical_events_feedback?: string;
  cr4de_intensity_parameters_feedback?: string;
  cr4de_scenarios_feedback?: string;
  cr4de_horizon_analysis_feedback?: string;
  cr4de_causes_feedback?: string;
  cr4de_effects_feedback?: string;
  cr4de_catalysing_effects_feedback?: string;
}
