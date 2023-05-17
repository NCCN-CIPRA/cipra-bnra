import { DVCascadeAnalysis } from "../types/dataverse/DVCascadeAnalysis";
import { SCENARIOS } from "./scenarios";

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

export function getCascadeField(causeScenario: SCENARIOS, effectScenario: SCENARIOS): keyof CascadeAnalysisInput {
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
