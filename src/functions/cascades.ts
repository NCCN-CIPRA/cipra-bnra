import { CascadeCalculation } from "../types/dataverse/DVAnalysisRun";
import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import { DVRiskCascade } from "../types/dataverse/DVRiskCascade";
import { DVRiskFile, RISK_TYPE } from "../types/dataverse/DVRiskFile";
import { SmallRisk } from "../types/dataverse/DVSmallRisk";
import {
  SCENARIOS,
  SCENARIO_LETTER,
  getCascadeParameter,
  getScenarioParameter,
} from "./scenarios";

export type CASCADE_LETTER =
  | "c2c"
  | "c2m"
  | "c2e"
  | "m2c"
  | "m2m"
  | "m2e"
  | "e2c"
  | "e2m"
  | "e2e";

export interface CascadeAnalysisInput {
  cr4de_c2c: number | null;
  cr4de_c2m: number | null;
  cr4de_c2e: number | null;
  cr4de_m2c: number | null;
  cr4de_m2m: number | null;
  cr4de_m2e: number | null;
  cr4de_e2c: number | null;
  cr4de_e2m: number | null;
  cr4de_e2e: number | null;

  cr4de_quali_cascade: string | null;
}

export type Cascades = {
  all: DVRiskCascade<SmallRisk, SmallRisk>[];
  causes: DVRiskCascade<SmallRisk, SmallRisk>[];
  effects: DVRiskCascade<SmallRisk, SmallRisk>[];
  catalyzingEffects: DVRiskCascade<SmallRisk, SmallRisk>[];
  climateChange: DVRiskCascade<SmallRisk, SmallRisk> | null;
};

export function getCauses(
  riskFile: SmallRisk,
  cascades: DVRiskCascade[],
  hazardCatalogue: { [id: string]: SmallRisk }
): DVRiskCascade<SmallRisk, SmallRisk>[] {
  return cascades
    .filter(
      (c) =>
        c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
        (hazardCatalogue[c._cr4de_cause_hazard_value].cr4de_risk_type ===
          RISK_TYPE.STANDARD ||
          hazardCatalogue[c._cr4de_cause_hazard_value].cr4de_risk_type ===
            RISK_TYPE.MANMADE)
    )
    .map((c) => ({
      ...c,
      cr4de_cause_hazard: hazardCatalogue[c._cr4de_cause_hazard_value],
      cr4de_effect_hazard: hazardCatalogue[c._cr4de_effect_hazard_value],
    }));
}

export function getCausesWithDP(
  riskFile: DVRiskFile,
  cascades: Cascades,
  scenario: SCENARIOS
) {
  return [
    {
      name: "2A.dp.title",
      p: getScenarioParameter(riskFile, "DP", scenario) || 0,
    },
    ...cascades.causes.map((c) => ({
      id: c.cr4de_cause_hazard.cr4de_riskfilesid,
      name: `risk.${c.cr4de_cause_hazard.cr4de_hazard_id}.name`,
      p: getCascadeParameter(c, scenario, "IP") || 0,
      cascade: c,
    })),
  ];
}

export function getEffects(
  riskFile: SmallRisk,
  cascades: DVRiskCascade[],
  hazardCatalogue: { [id: string]: SmallRisk }
): DVRiskCascade<SmallRisk, SmallRisk>[] {
  return cascades
    .filter((c) => c._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid)
    .map((c) => ({
      ...c,
      cr4de_cause_hazard: hazardCatalogue[c._cr4de_cause_hazard_value],
      cr4de_effect_hazard: hazardCatalogue[c._cr4de_effect_hazard_value],
    }));
}

export function getEffectsWithDI(
  riskFile: DVRiskFile,
  cascades: Cascades,
  scenario: SCENARIOS
) {
  return [
    {
      name: "Direct Impact",
      i: getScenarioParameter(riskFile, "DI", scenario) || 0,
      iH:
        (getScenarioParameter(riskFile, "DI_Ha", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Hb", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Hc", scenario) || 0),
      iS:
        (getScenarioParameter(riskFile, "DI_Sa", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Sb", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Sc", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Sd", scenario) || 0),
      iE: getScenarioParameter(riskFile, "DI_Ea", scenario) || 0,
      iF:
        (getScenarioParameter(riskFile, "DI_Fa", scenario) || 0) +
        (getScenarioParameter(riskFile, "DI_Fb", scenario) || 0),
    },
    ...cascades.effects.map((e) => ({
      id: e.cr4de_effect_hazard.cr4de_riskfilesid,
      name: `risk.${e.cr4de_effect_hazard.cr4de_hazard_id}.name`,
      i: getCascadeParameter(e, scenario, "II") || 0,
      iH:
        (getCascadeParameter(e, scenario, "II_Ha") || 0) +
        (getCascadeParameter(e, scenario, "II_Hb") || 0) +
        (getCascadeParameter(e, scenario, "II_Hc") || 0),
      iS:
        (getCascadeParameter(e, scenario, "II_Sa") || 0) +
        (getCascadeParameter(e, scenario, "II_Sb") || 0) +
        (getCascadeParameter(e, scenario, "II_Sc") || 0) +
        (getCascadeParameter(e, scenario, "II_Sd") || 0),
      iE: getCascadeParameter(e, scenario, "II_Ea") || 0,
      iF:
        (getCascadeParameter(e, scenario, "II_Fa") || 0) +
        (getCascadeParameter(e, scenario, "II_Fb") || 0),
      cascade: e,
    })),
  ];
}

export function getCatalyzingEffects<T extends DVRiskCascade>(
  riskFile: SmallRisk,
  cascades: T[],
  hazardCatalogue: { [id: string]: SmallRisk },
  includeClimateChange: boolean = true
): T[] {
  return cascades.filter(
    (c) =>
      c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
      hazardCatalogue[c._cr4de_cause_hazard_value].cr4de_risk_type ===
        RISK_TYPE.EMERGING &&
      (includeClimateChange ||
        hazardCatalogue[c._cr4de_cause_hazard_value].cr4de_title.indexOf(
          "Climate"
        ) < 0)
  );
}

export function getClimateChange<T extends DVRiskCascade>(
  riskFile: SmallRisk,
  cascades: T[],
  hazardCatalogue: { [id: string]: SmallRisk }
): T | null {
  return (
    cascades.find(
      (c) =>
        c._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid &&
        hazardCatalogue[c._cr4de_cause_hazard_value].cr4de_risk_type ===
          RISK_TYPE.EMERGING &&
        hazardCatalogue[c._cr4de_cause_hazard_value].cr4de_title.indexOf(
          "Climate"
        ) >= 0
    ) || null
  );
}

export function getCascadeField(
  causeScenario: SCENARIOS,
  effectScenario: SCENARIOS
): keyof CascadeAnalysisInput {
  if (causeScenario === SCENARIOS.CONSIDERABLE) {
    if (effectScenario === SCENARIOS.CONSIDERABLE) {
      return "cr4de_c2c";
    } else if (effectScenario === SCENARIOS.MAJOR) {
      return "cr4de_c2m";
    } else {
      return "cr4de_c2e";
    }
  } else if (causeScenario === SCENARIOS.MAJOR) {
    if (effectScenario === SCENARIOS.CONSIDERABLE) {
      return "cr4de_m2c";
    } else if (effectScenario === SCENARIOS.MAJOR) {
      return "cr4de_m2m";
    } else {
      return "cr4de_m2e";
    }
  } else {
    if (effectScenario === SCENARIOS.CONSIDERABLE) {
      return "cr4de_e2c";
    } else if (effectScenario === SCENARIOS.MAJOR) {
      return "cr4de_e2m";
    } else {
      return "cr4de_e2e";
    }
  }
}

export function getCascadeInput(ca: DVCascadeAnalysis): CascadeAnalysisInput {
  return {
    cr4de_c2c: ca.cr4de_c2c ? parseInt(ca.cr4de_c2c.slice(2), 10) : null,
    cr4de_c2m: ca.cr4de_c2m ? parseInt(ca.cr4de_c2m.slice(2), 10) : null,
    cr4de_c2e: ca.cr4de_c2e ? parseInt(ca.cr4de_c2e.slice(2), 10) : null,
    cr4de_m2c: ca.cr4de_m2c ? parseInt(ca.cr4de_m2c.slice(2), 10) : null,
    cr4de_m2m: ca.cr4de_m2m ? parseInt(ca.cr4de_m2m.slice(2), 10) : null,
    cr4de_m2e: ca.cr4de_m2e ? parseInt(ca.cr4de_m2e.slice(2), 10) : null,
    cr4de_e2c: ca.cr4de_e2c ? parseInt(ca.cr4de_e2c.slice(2), 10) : null,
    cr4de_e2m: ca.cr4de_e2m ? parseInt(ca.cr4de_e2m.slice(2), 10) : null,
    cr4de_e2e: ca.cr4de_e2e ? parseInt(ca.cr4de_e2e.slice(2), 10) : null,

    cr4de_quali_cascade: ca.cr4de_quali_cascade,
  };
}

export const getAverageCP = (
  causeScenario: SCENARIO_LETTER,
  effect: CascadeCalculation
): number => {
  const ii_s2c = effect[`${causeScenario}2c`] * effect.effect.ti_c;
  const ii_s2m = effect[`${causeScenario}2m`] * effect.effect.ti_m;
  const ii_s2e = effect[`${causeScenario}2e`] * effect.effect.ti_e;

  const ii_tot = 0.0001 + ii_s2c + ii_s2m + ii_s2e;

  return (
    (effect[`${causeScenario}2c`] * ii_s2c +
      effect[`${causeScenario}2m`] * ii_s2m +
      effect[`${causeScenario}2e`] * ii_s2e) /
    ii_tot
  );
};

export const getCascades =
  (
    riskFile: DVRiskFile,
    cs: { [riskId: string]: Cascades },
    hc: { [id: string]: SmallRisk }
  ) =>
  (rcResult: DVRiskCascade<SmallRisk, SmallRisk>[]) => {
    const causes = getCauses(riskFile, rcResult, hc);
    const effects = getEffects(riskFile, rcResult, hc);
    const catalyzingEffects = getCatalyzingEffects(
      riskFile,
      rcResult,
      hc,
      false
    );
    const climateChange = getClimateChange(riskFile, rcResult, hc);

    return {
      ...cs,
      [riskFile.cr4de_riskfilesid]: {
        all: [...causes, ...effects, ...catalyzingEffects],
        causes,
        effects,
        catalyzingEffects,
        climateChange,
      },
    };
  };
