export interface DVRiskCascade<CauseType = string, EffectType = string> {
  cr4de_bnrariskcascadeid: string;

  cr4de_cause_hazard: CauseType;
  _cr4de_cause_hazard_value: string;
  cr4de_effect_hazard: EffectType;
  _cr4de_effect_hazard_value: string;

  cr4de_reason: string;

  cr4de_c2c: string;
  cr4de_c2m: string;
  cr4de_c2e: string;
  cr4de_m2c: string;
  cr4de_m2m: string;
  cr4de_m2e: string;
  cr4de_e2c: string;
  cr4de_e2m: string;
  cr4de_e2e: string;
}
