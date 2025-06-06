export interface DVAttachment<
  ContactType = unknown,
  SourceType = unknown,
  RiskFileType = unknown
> {
  cr4de_bnraattachmentid: string;

  _cr4de_owner_value: string;
  cr4de_owner: ContactType;

  cr4de_name: string;
  cr4de_reference: number;

  cr4de_field: string | null;

  cr4de_url: string | null;
  cr4de_referencedSource: SourceType | null;
  _cr4de_referencedSource_value: string | null;

  _cr4de_risk_file_value: string | null;
  cr4de_risk_file: RiskFileType | null;
  _cr4de_validation_value: string | null;
  _cr4de_direct_analysis_value: string | null;
  _cr4de_cascade_analysis_value: string | null;

  createdon: string;
}
