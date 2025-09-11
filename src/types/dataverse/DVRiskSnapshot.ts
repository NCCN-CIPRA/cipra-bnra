import { SCENARIOS } from "../../functions/scenarios";
import { RISK_CATEGORY, RISK_TYPE } from "./Riskfile";

export type SerializedRiskSnapshotResults = string & {
  __json_seralized: RiskSnapshotResults;
};

export function serializeRiskSnapshotResults(
  quanti: RiskSnapshotResults
): SerializedRiskSnapshotResults {
  return JSON.stringify(quanti) as SerializedRiskSnapshotResults;
}

export function parseRiskSnapshot<T>(
  snapshot: DVRiskSnapshot<T, SerializedRiskSnapshotResults>
): DVRiskSnapshot<T> {
  return {
    ...snapshot,
    cr4de_quanti: JSON.parse(snapshot.cr4de_quanti),
  };
}

export type DVRiskSnapshotQuantiType =
  | unknown
  | SerializedRiskSnapshotResults
  | RiskSnapshotResults;

export type DVRiskSnapshot<
  RiskFileType = unknown,
  QuantiType extends DVRiskSnapshotQuantiType = RiskSnapshotResults
> = {
  cr4de_bnrariskfilesnapshotid: string;

  // Bind value for update only
  "cr4de_risk_file@odata.bind": string | null | undefined;
  _cr4de_risk_file_value: string; // DVRiskFile
  cr4de_risk_file: RiskFileType; // DVRiskFile

  cr4de_hazard_id: string;
  cr4de_title: string;
  cr4de_risk_type: RISK_TYPE;
  cr4de_category: RISK_CATEGORY;

  cr4de_definition: string;
  cr4de_horizon_analysis: string | null;
  cr4de_historical_events: string | null;
  cr4de_intensity_parameters: string | null;
  cr4de_scenarios: string | null;
  cr4de_mrs: SCENARIOS | null;

  cr4de_quali_scenario_mrs: string | null;
  cr4de_quali_disclaimer_mrs: string | null;
  cr4de_quali_p_mrs: string | null;
  cr4de_quali_h_mrs: string | null;
  cr4de_quali_s_mrs: string | null;
  cr4de_quali_e_mrs: string | null;
  cr4de_quali_f_mrs: string | null;
  cr4de_quali_actions_mrs: string | null;
  cr4de_quali_mm_mrs: string | null;
  cr4de_quali_cb_mrs: string | null;
  cr4de_quali_cc_mrs: string | null;

  cr4de_quanti: QuantiType;
};

export type RiskSnapshotResults = {
  [SCENARIOS.CONSIDERABLE]: RiskSnapshotScenarioResults;
  [SCENARIOS.MAJOR]: RiskSnapshotScenarioResults;
  [SCENARIOS.EXTREME]: RiskSnapshotScenarioResults;
};

export type RiskSnapshotScenarioResults = {
  tp: {
    yearly: {
      scale: number; // Total probability of the scenario on the tp scale (0 - 5)
    };
  };
  tp50: {
    yearly: {
      scale: number; // Total probability of the scenario on the tp scale (0 - 5)
    };
  };
  dp: {
    yearly: {
      scale: number; // Total probability of the scenario on the tp scale (0 - 5)
    };
  };
  dp50: {
    yearly: {
      scale: number; // Total probability of the scenario on the tp scale (0 - 5)
    };
  };
  ti: {
    all: {
      scaleTot: number; // Total impact of the scenario on the ti scale (0 - 5)
    };
    h: {
      scaleTot: number; // Total human impact of the scenario on the ti scale (0 - 5)
      scaleCat: number; // Total human impact of the scenario on the human impact category scale (0 - 5)
    };
    ha: {
      scaleTot: number; // Total Ha impact of the scenario on the ti scale (0 - 5)
      scaleCatRel: number; // Percentage of H impact that is due to Ha (0 - 1)
      abs: number; // Total Ha impact on an absolute scale (€)
    };
    hb: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
    };
    hc: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
    };
    s: {
      scaleTot: number;
      scaleCat: number;
    };
    sa: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
    };
    sb: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
    };
    sc: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
    };
    sd: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
    };
    e: {
      scaleTot: number;
      scaleCat: number;
    };
    ea: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
    };
    f: {
      scaleTot: number;
      scaleCat: number;
    };
    fa: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
    };
    fb: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
    };
  };
  di: {
    all: {
      scaleTot: number;
    };
    ha: {
      // Number from 0 - 5.5 on the Ha scale -> Not available due to scaling factors
      // scale: number;
      // Number from 0 - 5.5 on the total impact scale
      scaleTot: number;
    };
    hb: { scaleTot: number };
    hc: { scaleTot: number };
    sa: { scaleTot: number };
    sb: { scaleTot: number };
    sc: { scaleTot: number };
    sd: { scaleTot: number };
    ea: { scaleTot: number };
    fa: { scaleTot: number };
    fb: { scaleTot: number };
  };
};
