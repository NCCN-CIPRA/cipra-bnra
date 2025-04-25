import { Scenarios } from "../../functions/scenarios";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";

export enum IMPACT_FIELDS {
  Ha = "Ha",
  Hb = "Hb",
  Hc = "Hc",
  Sa = "Sa",
  Sb = "Sb",
  Sc = "Sc",
  Sd = "Sd",
  Ea = "Ea",
  Fa = "Fa",
  Fb = "Fb",
}

export interface ScenarioInput {
  cr4de_dp_quali: string | null;
  cr4de_dp_quanti: string | null;

  cr4de_di_quali_h: string | null;
  cr4de_di_quanti_ha: string | null;
  cr4de_di_quanti_hb: string | null;
  cr4de_di_quanti_hc: string | null;

  cr4de_di_quali_s: string | null;
  cr4de_di_quanti_sa: string | null;
  cr4de_di_quanti_sb: string | null;
  cr4de_di_quanti_sc: string | null;
  cr4de_di_quanti_sd: string | null;

  cr4de_di_quali_e: string | null;
  cr4de_di_quanti_ea: string | null;

  cr4de_di_quali_f: string | null;
  cr4de_di_quanti_fa: string | null;
  cr4de_di_quanti_fb: string | null;

  cr4de_cross_border_impact_quali: string | null;
}

export interface ScenarioInputs {
  considerable: ScenarioInput;
  major: ScenarioInput;
  extreme: ScenarioInput;
}

export const SCENARIO_SUFFIX: { [key in keyof Scenarios]: string } = {
  considerable: "_c",
  major: "_m",
  extreme: "_e",
};

export function getTrueInputs(scenarioInputs: ScenarioInput, scenario: keyof Scenarios): Partial<DVDirectAnalysis> {
  return Object.keys(scenarioInputs).reduce(
    (trueInputs, scenarioField) => ({
      ...trueInputs,
      [`${scenarioField}${SCENARIO_SUFFIX[scenario]}` as keyof DVDirectAnalysis]:
        scenarioInputs[scenarioField as keyof ScenarioInput],
    }),
    {}
  );
}

export function getScenarioInputs(directAnalysis: DVDirectAnalysis<unknown>, scenario: keyof Scenarios): ScenarioInput {
  let suffix = "";

  if (scenario === "considerable") suffix = "_c";
  else if (scenario === "major") suffix = "_m";
  else suffix = "_e";

  return Object.keys(directAnalysis).reduce((scenarioInputs, directAnalysisField) => {
    if (!directAnalysisField.endsWith(suffix) || directAnalysisField.indexOf("dp50") >= 0) return scenarioInputs;

    return {
      ...scenarioInputs,
      [directAnalysisField.slice(0, -2) as keyof ScenarioInput]:
        directAnalysis[directAnalysisField as keyof DVDirectAnalysis],
    };
  }, {}) as ScenarioInput;
}

// DEPRECATED:

// export const FIELDS: (keyof DVDirectAnalysis)[] = [
//   "cr4de_dp_quali",
//   "cr4de_dp_quanti_c",
//   "cr4de_dp_quanti_m",
//   "cr4de_dp_quanti_e",
//   "cr4de_di_quali_h",
//   "cr4de_di_quali_s",
//   "cr4de_di_quali_e",
//   "cr4de_di_quali_f",
//   "cr4de_di_quanti_ha_c",
//   "cr4de_di_quanti_hb_c",
//   "cr4de_di_quanti_hc_c",
//   "cr4de_di_quanti_sa_c",
//   "cr4de_di_quanti_sb_c",
//   "cr4de_di_quanti_sc_c",
//   "cr4de_di_quanti_sd_c",
//   "cr4de_di_quanti_ea_c",
//   "cr4de_di_quanti_fa_c",
//   "cr4de_di_quanti_fb_c",
//   "cr4de_di_quanti_ha_m",
//   "cr4de_di_quanti_hb_m",
//   "cr4de_di_quanti_hc_m",
//   "cr4de_di_quanti_sa_m",
//   "cr4de_di_quanti_sb_m",
//   "cr4de_di_quanti_sc_m",
//   "cr4de_di_quanti_sd_m",
//   "cr4de_di_quanti_ea_m",
//   "cr4de_di_quanti_fa_m",
//   "cr4de_di_quanti_fb_m",
//   "cr4de_di_quanti_ha_e",
//   "cr4de_di_quanti_hb_e",
//   "cr4de_di_quanti_hc_e",
//   "cr4de_di_quanti_sa_e",
//   "cr4de_di_quanti_sb_e",
//   "cr4de_di_quanti_sc_e",
//   "cr4de_di_quanti_sd_e",
//   "cr4de_di_quanti_ea_e",
//   "cr4de_di_quanti_fa_e",
//   "cr4de_di_quanti_fb_e",
//   "cr4de_climate_change_quali",
//   "cr4de_climate_change_quanti_c",
//   "cr4de_climate_change_quanti_m",
//   "cr4de_climate_change_quanti_e",
//   "cr4de_cross_border_impact_quali",
// ];

// export default function getDefaultFields(step2A: DVDirectAnalysis<DVRiskFile | undefined>) {
//   return FIELDS.reduce(
//     (acc, f) => ({
//       ...acc,
//       [f]: step2A[f] || null,
//     }),
//     {}
//   );
// }

// export const getScenarioField = (fieldId: string, scenario: keyof Scenarios): keyof DVDirectAnalysis => {
//   if (scenario === "considerable") return `cr4de_quanti_${fieldId}_c` as keyof DVDirectAnalysis;
//   if (scenario === "major") return `cr4de_quanti_${fieldId}_m` as keyof DVDirectAnalysis;
//   return `cr4de_quanti_${fieldId}_e` as keyof DVDirectAnalysis;
// };
