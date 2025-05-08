import { SCENARIOS } from "../../functions/scenarios";
import { RISK_CATEGORY, RISK_TYPE, RiskFileEditableFields } from "./Riskfile";

export interface DVRiskSummary extends RiskFileEditableFields {
  cr4de_risksummaryid: string;

  cr4de_riskfile_id: string;

  cr4de_hazard_id: string;
  cr4de_title: string;
  cr4de_risk_type: RISK_TYPE;
  cr4de_risk_category: RISK_CATEGORY;
  cr4de_key_risk: boolean;

  cr4de_label_hilp: boolean | null;
  cr4de_label_cc: boolean | null;
  cr4de_label_cb: boolean | null;
  cr4de_label_impact:
    | "Human"
    | "Societal"
    | "Environmental"
    | "Financial"
    | null;

  cr4de_mrs: SCENARIOS | null;
  cr4de_mrs_summary: string | null;
  cr4de_mrs_summary_nl: string | null;
  cr4de_mrs_summary_fr: string | null;
  cr4de_mrs_summary_de: string | null;

  createdon: string;
  modifiedon: string;
}
