import { SCENARIOS } from "../../functions/scenarios";
import { RESULT_SNAPSHOT, RISK_CATEGORY } from "./DVRiskFile";

export interface SmallRisk {
  cr4de_riskfilesid: string;
  cr4de_hazard_id: string;

  cr4de_title: string;
  cr4de_risk_type: string;
  cr4de_risk_category: RISK_CATEGORY;

  cr4de_definition: string | null;

  cr4de_mrs: SCENARIOS | null;
  cr4de_label_hilp: boolean | null;
  cr4de_label_cc: boolean | null;
  cr4de_label_cb: boolean | null;
  cr4de_label_impact:
    | "Human"
    | "Societal"
    | "Environmental"
    | "Financial"
    | null;
  cr4de_result_snapshot: string | null;

  results?: RESULT_SNAPSHOT | null;
}

export const getResultSnapshot = (
  riskFile: SmallRisk
): RESULT_SNAPSHOT | null => {
  if (
    riskFile.cr4de_result_snapshot == null ||
    riskFile.cr4de_result_snapshot === ""
  )
    return null;

  return JSON.parse(riskFile.cr4de_result_snapshot);
};
