export interface DVCascadeAnalysis<RiskCascadeType = unknown, RiskFileType = unknown, ExpertType = unknown> {
  cr4de_bnracascadeanalysisid: string;

  cr4de_expert: ExpertType;
  _cr4de_expert_value: string;
  cr4de_risk_file: RiskFileType;
  _cr4de_risk_file_value: string;
  cr4de_cascade: RiskCascadeType;
  _cr4de_cascade_value: string;

  cr4de_c2c: string | null;
  cr4de_c2m: string | null;
  cr4de_c2e: string | null;
  cr4de_m2c: string | null;
  cr4de_m2m: string | null;
  cr4de_m2e: string | null;
  cr4de_e2c: string | null;
  cr4de_e2m: string | null;
  cr4de_e2e: string | null;

  cr4de_quali_cascade: string | null;

  cr4de_quality: number | null;
}

export const CASCADE_ANALYSIS_QUANTI_FIELDS: (keyof DVCascadeAnalysis)[] = [
  "cr4de_c2c",
  "cr4de_c2m",
  "cr4de_c2e",

  "cr4de_m2c",
  "cr4de_m2m",
  "cr4de_m2e",

  "cr4de_e2c",
  "cr4de_e2m",
  "cr4de_e2e",
];
