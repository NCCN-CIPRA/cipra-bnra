export interface DVAttachment {
  cr4de_bnraattachmentid: string;

  _cr4de_owner_value: string;
  cr4de_owner: string;

  cr4de_name: string;
  cr4de_reference: number;

  cr4de_field: string | null;

  cr4de_url: string | null;

  cr4de_risk_file: string | null;
  cr4de_validation: string | null;
  cr4de_direct_analysis: string | null;
  cr4de_cascade_analysis: string | null;
}
