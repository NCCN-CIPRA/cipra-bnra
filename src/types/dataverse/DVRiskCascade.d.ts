export interface DVRiskCascade<CauseType = unknown, EffectType = unknown> {
  cr4de_bnrariskcascadeid: string;

  cr4de_cause_hazard: CauseType;
  _cr4de_cause_hazard_value: string;
  cr4de_effect_hazard: EffectType;
  _cr4de_effect_hazard_value: string;

  cr4de_reason: string;

  cr4de_c2c: string | null;
  cr4de_c2m: string | null;
  cr4de_c2e: string | null;
  cr4de_m2c: string | null;
  cr4de_m2m: string | null;
  cr4de_m2e: string | null;
  cr4de_e2c: string | null;
  cr4de_e2m: string | null;
  cr4de_e2e: string | null;

  // Qualitative input given by the experts on the causing risk
  cr4de_quali_cause: string | null;
  // Qualitative input given by the experts on the effect risk
  cr4de_quali: string | null;

  cr4de_c2c_cause: string | null;
  cr4de_c2m_cause: string | null;
  cr4de_c2e_cause: string | null;
  cr4de_m2c_cause: string | null;
  cr4de_m2m_cause: string | null;
  cr4de_m2e_cause: string | null;
  cr4de_e2c_cause: string | null;
  cr4de_e2m_cause: string | null;
  cr4de_e2e_cause: string | null;

  cr4de_discussion_required: string | null;

  cr4de_discussion_required_cause: string | null;

  cr4de_damp: boolean | null;

  // Consolidated description of the catalyzing effect for the BE Report
  cr4de_description: string | null;
}
