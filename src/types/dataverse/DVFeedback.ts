export interface DVFeedback<ContactType = undefined, RiskFileType = undefined> {
  cr4de_bnrafeedbackid: string;

  cr4de_contact: ContactType;
  _cr4de_expert_value: string;
  cr4de_risk_file: RiskFileType;
  _cr4de_risk_file_value: string;

  cr4de_q1: number | null;
  cr4de_q2: number | null;
  cr4de_q3: number | null;
  cr4de_q4: number | null;
  cr4de_quali_validation: string | null;
}
