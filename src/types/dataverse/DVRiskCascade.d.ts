export interface DVRiskCascade<CauseType = undefined, EffectType = undefined> {
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
}
