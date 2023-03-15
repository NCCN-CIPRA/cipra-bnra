export interface ValidationEditableFields {
  cr4de_definition_feedback: string | null;
  cr4de_historical_events_feedback: string | null;
  cr4de_intensity_parameters_feedback: string | null;
  cr4de_scenarios_feedback: string | null;
  cr4de_horizon_analysis_feedback: string | null;
  cr4de_causes_feedback: string | null;
  cr4de_effects_feedback: string | null;
  cr4de_catalysing_effects_feedback: string | null;
}

export interface ValidationResponseEditableFields {
  cr4de_definition_feedback_response: string | null;
  cr4de_historical_events_feedback_response: string | null;
  cr4de_intensity_parameters_feedback_response: string | null;
  cr4de_scenarios_feedback_response: string | null;
  cr4de_horizon_analysis_feedback_response: string | null;
  cr4de_causes_feedback_response: string | null;
  cr4de_effects_feedback_response: string | null;
  cr4de_catalysing_effects_feedback_response: string | null;
}

export const VALIDATION_EDITABLE_FIELDS: (keyof ValidationEditableFields)[] = [
  "cr4de_definition_feedback",
  "cr4de_historical_events_feedback",
  "cr4de_intensity_parameters_feedback",
  "cr4de_scenarios_feedback",
  "cr4de_horizon_analysis_feedback",
  "cr4de_causes_feedback",
  "cr4de_effects_feedback",
  "cr4de_catalysing_effects_feedback",
];

export interface DVValidation<RiskFileType = unknown, ContactType = unknown>
  extends ValidationEditableFields,
    ValidationResponseEditableFields {
  cr4de_bnravalidationid: string;

  cr4de_expert: ContactType;
  _cr4de_expert_value: string;
  cr4de_RiskFile: RiskFileType;
  _cr4de_RiskFile_value: string;

  cr4de_finished: boolean;

  createdon: Date;
  modifiedon: Date;
}
