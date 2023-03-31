export interface DVParticipation<
  ContactType = unknown,
  RiskFileType = unknown,
  ValidationType = unknown,
  DirectAnalysisType = unknown
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
  cr4de_direct_analysis_finished_on: Date | null;

  cr4de_cascade_analysis_finished: boolean | null;
  cr4de_cascade_analysis_finished_on: Date | null;

  createdon: Date;
}
