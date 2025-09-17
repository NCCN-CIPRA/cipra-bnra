import { SCENARIOS } from "../../functions/scenarios";
import {
  RISK_CATEGORY,
  RISK_TYPE,
  RiskFileEditableFields,
  UnparsedRiskFields,
} from "./Riskfile";

export type CauseRisksSummary = {
  cause_risk_id: string;
  cause_risk_title: string;
  cause_risk_p: number;
  other_causes?: {
    cause_risk_id: string;
    cause_risk_title: string;
    cause_risk_p: number;
  }[];
};

export type EffectRisksSummary = {
  effect_risk_id: string;
  effect_risk_title: string;
  effect_risk_i: number;
  other_effects?: {
    effect_risk_id: string;
    effect_risk_title: string;
    effect_risk_i: number;
  }[];
};

export type DVRiskSummary<RiskFileType = unknown, T = UnparsedRiskFields> = {
  cr4de_bnrariskfilesummaryid: string;

  // Bind value for update only
  "cr4de_risk_file@odata.bind": string | null | undefined;
  _cr4de_risk_file_value: string; // DVRiskFile
  cr4de_risk_file: RiskFileType | null;

  cr4de_hazard_id: string;
  cr4de_title: string;
  cr4de_risk_type: RISK_TYPE;
  cr4de_category: RISK_CATEGORY;
  cr4de_key_risk: boolean;

  cr4de_label_hilp: boolean;
  cr4de_label_cc: boolean;
  cr4de_label_cb: boolean;
  cr4de_label_impact:
    | "Human"
    | "Societal"
    | "Environmental"
    | "Financial"
    | null;

  cr4de_mrs: SCENARIOS;
  cr4de_summary_en: string;
  cr4de_summary_nl: string;
  cr4de_summary_fr: string;
  cr4de_summary_de: string;

  cr4de_mrs_p: number | null; // Total probability of the scenario on the tp scale (0 - 5)
  cr4de_mrs_i: number | null; // Total impact of the scenario on the ti scale (0 - 5)
  cr4de_mrs_h: number | null; // Total human impact of the scenario on the human impact category scale (0 - 5)
  cr4de_mrs_s: number | null;
  cr4de_mrs_e: number | null;
  cr4de_mrs_f: number | null;

  cr4de_causing_risks: string | CauseRisksSummary[] | null;
  cr4de_effect_risks: string | EffectRisksSummary[] | null;

  // createdon: string;
  // modifiedon: string;
} & RiskFileEditableFields<T>;
