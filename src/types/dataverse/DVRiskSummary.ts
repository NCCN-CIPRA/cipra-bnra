import { SCENARIOS } from "../../functions/scenarios";
import { RISK_CATEGORY, RISK_TYPE, RiskFileEditableFields } from "./Riskfile";

export type CauseRisksSummary = {
  cause_risk_id: string;
  cause_risk_title: string;
  cause_risk_p: string;
}[];

export type EffectRisksSummary = {
  effect_risk_id: string;
  effect_risk_title: string;
  effect_risk_i: string;
}[];

export interface DVRiskSummary<RiskFileType = unknown>
  extends RiskFileEditableFields {
  cr4de_bnrariskfilesummaryid: string;

  _cr4de_risk_file_value: string | null;
  cr4de_risk_file: RiskFileType | null;

  cr4de_hazard_id: string;
  cr4de_title: string;
  cr4de_risk_type: RISK_TYPE;
  cr4de_category: RISK_CATEGORY;
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
  cr4de_summary_en: string | null;
  cr4de_summary_nl: string | null;
  cr4de_summary_fr: string | null;
  cr4de_summary_de: string | null;

  cr4de_mrs_p: number | null;
  cr4de_mrs_h: number | null;
  cr4de_mrs_s: number | null;
  cr4de_mrs_e: number | null;
  cr4de_mrs_f: number | null;

  cr4de_causing_risks: string | CauseRisksSummary;
  cr4de_effect_risks: string | EffectRisksSummary;

  createdon: string;
  modifiedon: string;
}
