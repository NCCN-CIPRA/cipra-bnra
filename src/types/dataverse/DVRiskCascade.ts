import { RiskCatalogue } from "../../functions/riskfiles";
import { SCENARIOS } from "../../functions/scenarios";
import {
  DVCascadeSnapshot,
  SerializedCauseSnapshotResults,
  SerializedEffectSnapshotResults,
} from "./DVCascadeSnapshot";
import { DVRiskSnapshot } from "./DVRiskSnapshot";

export function parseCascadeSnapshot<R, S, T>(
  snapshot: DVCascadeSnapshot<
    R,
    S,
    T,
    SerializedCauseSnapshotResults,
    SerializedEffectSnapshotResults
  >
): DVCascadeSnapshot<R, S, T> {
  return {
    ...snapshot,
    cr4de_quanti_cause: JSON.parse(snapshot.cr4de_quanti_cause),
    cr4de_quanti_effect: JSON.parse(snapshot.cr4de_quanti_effect),
  };
}

export function linkCascadeSnapshot<T, C, E>(
  snapshot: DVCascadeSnapshot<T, unknown, unknown, C, E>,
  riskCatalogue: RiskCatalogue
): DVCascadeSnapshot<T, DVRiskSnapshot, DVRiskSnapshot, C, E> {
  return {
    ...snapshot,
    cr4de_cause_risk: riskCatalogue[snapshot._cr4de_cause_risk_value],
    cr4de_effect_risk: riskCatalogue[snapshot._cr4de_effect_risk_value],
  };
}

export interface DVRiskCascade<CauseType = unknown, EffectType = unknown> {
  cr4de_bnrariskcascadeid: string;

  cr4de_cause_hazard: CauseType;
  _cr4de_cause_hazard_value: string;
  cr4de_effect_hazard: EffectType;
  _cr4de_effect_hazard_value: string;

  cr4de_reason: string;

  cr4de_result_snapshot: string | null;
  results?: CASCADE_RESULT_SNAPSHOT | null;

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

  cr4de_quanti_input: SerializedCPMatrix | null;
}

export type SerializedCPMatrix = string & {
  __json_seralized: CPMatrixCauseRow;
};

export function serializeCPMatrix(
  quanti: CPMatrixCauseRow
): SerializedCPMatrix {
  return JSON.stringify(quanti) as SerializedCPMatrix;
}

export function parseCPMatrix(quanti: SerializedCPMatrix): CPMatrixCauseRow {
  return JSON.parse(quanti) as CPMatrixCauseRow;
}

export type CPMatrixCauseRow = {
  [SCENARIOS.CONSIDERABLE]: CPMatrixEffectRow;
  [SCENARIOS.MAJOR]: CPMatrixEffectRow;
  [SCENARIOS.EXTREME]: CPMatrixEffectRow;
};

export type CPMatrixEffectRow = {
  [SCENARIOS.CONSIDERABLE]: CPMatrixValue;
  [SCENARIOS.MAJOR]: CPMatrixValue;
  [SCENARIOS.EXTREME]: CPMatrixValue;
};

export type CPMatrixValue = {
  abs: number;
  scale7: number;
  scale3: number;
};

export const RISK_CASCADE_QUANTI_FIELDS: (keyof DVRiskCascade)[] = [
  "cr4de_c2c",
  "cr4de_c2m",
  "cr4de_c2e",

  "cr4de_m2c",
  "cr4de_m2m",
  "cr4de_m2e",

  "cr4de_e2c",
  "cr4de_e2m",
  "cr4de_e2e",

  "cr4de_c2c_cause",
  "cr4de_c2m_cause",
  "cr4de_c2e_cause",

  "cr4de_m2c_cause",
  "cr4de_m2m_cause",
  "cr4de_m2e_cause",

  "cr4de_e2c_cause",
  "cr4de_e2m_cause",
  "cr4de_e2e_cause",
];

export type CASCADE_RESULT_SNAPSHOT = {
  IP_All2C: number | null;
  IP_All2M: number | null;
  IP_All2E: number | null;

  IP50_All2C: number | null;
  IP50_All2M: number | null;
  IP50_All2E: number | null;

  CP_AVG_C2All: number | null;
  CP_AVG_M2All: number | null;
  CP_AVG_E2All: number | null;

  II_C2All: number | null; // Total impact of the cascade as a ratio to TI of the risk (0 - 1)
  II_M2All: number | null;
  II_E2All: number | null;

  II_C2All_H: number | null; // Total human impact of the cascade as a ratio to TI of the risk (0 - 1)
  II_M2All_H: number | null;
  II_E2All_H: number | null;
  II_C2All_Ha: number | null; // Total Ha impact of the cascade as a ratio to TI of the risk (0 - 1)
  II_M2All_Ha: number | null;
  II_E2All_Ha: number | null;
  II_C2All_Hb: number | null;
  II_M2All_Hb: number | null;
  II_E2All_Hb: number | null;
  II_C2All_Hc: number | null;
  II_M2All_Hc: number | null;
  II_E2All_Hc: number | null;

  II_C2All_S: number | null;
  II_M2All_S: number | null;
  II_E2All_S: number | null;
  II_C2All_Sa: number | null;
  II_M2All_Sa: number | null;
  II_E2All_Sa: number | null;
  II_C2All_Sb: number | null;
  II_M2All_Sb: number | null;
  II_E2All_Sb: number | null;
  II_C2All_Sc: number | null;
  II_M2All_Sc: number | null;
  II_E2All_Sc: number | null;
  II_C2All_Sd: number | null;
  II_M2All_Sd: number | null;
  II_E2All_Sd: number | null;

  II_C2All_E: number | null;
  II_M2All_E: number | null;
  II_E2All_E: number | null;
  II_C2All_Ea: number | null;
  II_M2All_Ea: number | null;
  II_E2All_Ea: number | null;

  II_C2All_F: number | null;
  II_M2All_F: number | null;
  II_E2All_F: number | null;
  II_C2All_Fa: number | null;
  II_M2All_Fa: number | null;
  II_E2All_Fa: number | null;
  II_C2All_Fb: number | null;
  II_M2All_Fb: number | null;
  II_E2All_Fb: number | null;
};
