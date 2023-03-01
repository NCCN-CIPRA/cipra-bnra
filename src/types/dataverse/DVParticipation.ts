export interface DVParticipation<
  ContactType = undefined,
  RiskFileType = undefined,
  ValidationType = undefined,
  DirectAnalysisType = undefined,
  CascadeAnalysisType = undefined
> {
  cr4de_bnraparticipationid: string;

  _cr4de_contact_value: string;
  cr4de_contact: ContactType;

  cr4de_role: string;

  _cr4de_risk_file_value: string | null;
  cr4de_risk_file: RiskFileType;

  _cr4de_validation_value: string | null;
  cr4de_validation: ValidationType;
  cr4de_validation_finished: boolean | null;
  cr4de_validation_finished_on: Date | null;

  _cr4de_direct_analysis_value: string | null;
  cr4de_direct_analysis: DirectAnalysisType;
  cr4de_direct_analysis_finished: boolean | null;

  _cr4de_cascade_analysis_value: string | null;
  cr4de_cascade_analysis: CascadeAnalysisType;
  cr4de_cascade_analysis_finished: boolean | null;
}
