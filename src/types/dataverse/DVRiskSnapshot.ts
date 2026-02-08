import { IntensityParameter } from "../../functions/intensityParameters";
import { Scenarios, SCENARIOS } from "../../functions/scenarios";
import { SerializedRiskFileQuantiResults } from "./DVRiskFile";
import {
  parseRiskQualis,
  RISK_CATEGORY,
  RISK_TYPE,
  RiskQualis,
  RiskQualiType,
  SerializedRiskQualis,
} from "./Riskfile";

export type SerializedRiskSnapshotResults = string & {
  __json_seralized: RiskSnapshotResults;
};

export type SerializedRiskSnapshotScenarios = string & {
  __json_seralized: Scenarios;
};

export function serializeRiskSnapshotResults(
  quanti: RiskSnapshotResults,
): SerializedRiskSnapshotResults {
  return JSON.stringify(quanti) as SerializedRiskSnapshotResults;
}

export function serializeRiskSnapshotScenarios(
  scenarios: Scenarios,
): SerializedRiskSnapshotScenarios {
  return JSON.stringify(scenarios) as SerializedRiskSnapshotScenarios;
}

export function parseRiskSnapshot<T>(
  snapshot: DVRiskSnapshot<T, SerializedRiskSnapshotResults>,
): DVRiskSnapshot<T> {
  return {
    ...snapshot,
    cr4de_quanti: JSON.parse(snapshot.cr4de_quanti),
  };
}

export function parseRiskSnapshotQuali<T, S>(
  snapshot: DVRiskSnapshot<T, S, SerializedRiskQualis>,
): DVRiskSnapshot<T, S, RiskQualis> {
  return {
    ...snapshot,
    cr4de_quali: parseRiskQualis(snapshot.cr4de_quali),
  };
}

export function parseRiskSnapshotScenarios(
  scenarios: SerializedRiskSnapshotScenarios | null,
): Scenarios {
  return JSON.parse(scenarios || "") as Scenarios;
}

export type DVRiskSnapshotQuantiType =
  | unknown
  | SerializedRiskSnapshotResults
  | RiskSnapshotResults;

export type DVRiskSnapshot<
  RiskFileType = unknown,
  QuantiType extends DVRiskSnapshotQuantiType = RiskSnapshotResults,
  QualiType extends RiskQualiType = SerializedRiskQualis,
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
  cr4de_scenarios: SerializedRiskSnapshotScenarios | null;
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
  cr4de_quanti_results: SerializedRiskFileQuantiResults | null;
  cr4de_quali: QualiType;
};

export type RiskSnapshotScenarios = {
  [SCENARIOS.CONSIDERABLE]: IntensityParameter[];
  [SCENARIOS.MAJOR]: IntensityParameter[];
  [SCENARIOS.EXTREME]: IntensityParameter[];
};

export type RiskSnapshotResults = {
  [SCENARIOS.CONSIDERABLE]: RiskSnapshotScenarioResults;
  [SCENARIOS.MAJOR]: RiskSnapshotScenarioResults;
  [SCENARIOS.EXTREME]: RiskSnapshotScenarioResults;
};

export type RiskSnapshotScenarioResults = {
  tp: {
    // Deprecated
    yearly: {
      scale: number; // Total probability of the scenario on the tp scale (0 - 5)
    };

    scale5TP: number; // Total probability of the scenario on the tp scale (0 - 5.5)
    rpMonths: number | null; // Return period in months
  };
  tp50: {
    // Depreacted
    yearly: {
      scale: number; // Total probability of the scenario on the tp scale (0 - 5)
    };

    scale5TP: number; // Total probability of the scenario on the tp scale (0 - 5.5)
    rpMonths: number | null; // Return period in months
  };
  // Depreacted
  m: {
    p: number; // Absolute probability
    scale: number; // Motivation of the actor on the m scale (0 - 3)
    scaleTot: number; // Direct probability of the scenario on the tp scale (0 - 5)
  };
  dp: {
    // Deprecated
    scale: number; // Direct probability of the scenario on the dp scale (0 - 5)
    // Deprecated
    scaleTot: number; // Direct probability of the scenario on the tp scale (0 - 5)

    rpMonths: number | null; // Return period
    scale5TP: number; // Direct probability of the scenario on the old tp scale (0 - 5.5)
    scale5: number; // // Direct probability of the scenario on the old dp scale (0 - 5.5)
  };
  dp50: {
    // Deprecated
    scale: number; // Direct probability of the scenario on the dp scale (0 - 5)
    // Deprecated
    scaleTot: number; // Direct probability of the scenario on the tp scale (0 - 5)

    rpMonths: number | null; // Return period
    scale5TP: number; // Direct probability of the scenario on the old tp scale (0 - 5.5)
    scale5: number; // // Direct probability of the scenario on the old dp scale (0 - 5.5)
  };
  ti: {
    all: {
      // Deprecated
      scaleTot: number; // Total impact of the scenario on the ti scale (0 - 5)
      scale5TI: number; // Total impact of the scenario on the ti scale (0 - 5.5)
      euros: number; // Total impact on an absolute scale (€)
    };
    h: {
      // Deprecated
      scaleTot: number; // Total human impact of the scenario on the ti scale (0 - 5)
      scaleCat: number; // Total human impact of the scenario on the human impact category scale (0 - 5)

      scale5TI: number; // Total human impact of the scenario on the old ti scale (0 - 5.5)
      scale5Cat: number; // Total human impact of the scenario on the old human impact category scale (0 - 5.5)
      euros: number; // Total absolute human impact of the scenario in euros
    };
    ha: {
      // Deprecated
      scaleTot: number; // Total Ha impact of the scenario on the ti scale (0 - 5)
      // Deprecated
      scaleCatRel: number; // Percentage of H impact that is due to Ha (0 - 1)
      // Deprecated
      abs: number; // Total Ha impact on an absolute scale (€)

      scale5TI: number; // Total Ha impact of the scenario on the ti scale (0 - 5.5)
      scale5CatRel: number; // Percentage of H impact that is due to Ha (0 - 1)
      euros: number; // Total Ha impact on an absolute scale (€)
    };
    hb: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
      scale5TI: number;
      scale5CatRel: number;
      euros: number;
    };
    hc: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
      scale5TI: number;
      scale5CatRel: number;
      euros: number;
    };
    s: {
      scaleTot: number;
      scaleCat: number;

      scale5TI: number;
      scale5Cat: number;
      euros: number;
    };
    sa: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
      scale5TI: number;
      scale5CatRel: number;
      euros: number;
    };
    sb: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
      scale5TI: number;
      scale5CatRel: number;
      euros: number;
    };
    sc: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
      scale5TI: number;
      scale5CatRel: number;
      euros: number;
    };
    sd: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
      scale5TI: number;
      scale5CatRel: number;
      euros: number;
    };
    e: {
      scaleTot: number;
      scaleCat: number;

      scale5TI: number;
      scale5Cat: number;
      euros: number;
    };
    ea: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
      scale5TI: number;
      scale5CatRel: number;
      euros: number;
    };
    f: {
      scaleTot: number;
      scaleCat: number;

      scale5TI: number;
      scale5Cat: number;
      euros: number;
    };
    fa: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
      scale5TI: number;
      scale5CatRel: number;
      euros: number;
    };
    fb: {
      scaleTot: number;
      scaleCatRel: number;
      abs: number;
      scale5TI: number;
      scale5CatRel: number;
      euros: number;
    };
  };
  di: {
    all: {
      scaleTot: number;
    };
    ha: {
      // Number from 0 - 5.5 on the Ha scale -> Not available due to scaling factors
      // Calculate using diScale5|7FromEuros
      // scale: number;

      // Deprecated
      scaleTot: number; // Number from 0 - 5.5 on the total impact scale
      abs: number; // Absolute impact in €

      scale5TI: number; // Number from 0 - 5.5 on the old total impact scale
      scale5: number; // Number from 0 - 5.5 on the old Ha impact scale
      euros: number; // Direct Ha impact on an absolute scale (€)
    };
    hb: {
      scaleTot: number;
      abs: number; // Absolute impact in €

      scale5TI: number;
      scale5: number;
      euros: number;
    };
    hc: {
      scaleTot: number;
      abs: number; // Absolute impact in €

      scale5TI: number;
      scale5: number;
      euros: number;
    };
    sa: {
      scaleTot: number;
      abs: number; // Absolute impact in €

      scale5TI: number;
      scale5: number;
      euros: number;
    };
    sb: {
      scaleTot: number;
      abs: number; // Absolute impact in €

      scale5TI: number;
      scale5: number;
      euros: number;
    };
    sc: {
      scaleTot: number;
      abs: number; // Absolute impact in €

      scale5TI: number;
      scale5: number;
      euros: number;
    };
    sd: {
      scaleTot: number;
      abs: number; // Absolute impact in €

      scale5TI: number;
      scale5: number;
      euros: number;
    };
    ea: {
      scaleTot: number;
      abs: number; // Absolute impact in €

      scale5TI: number;
      scale5: number;
      euros: number;
    };
    fa: {
      scaleTot: number;
      abs: number; // Absolute impact in €

      scale5TI: number;
      scale5: number;
      euros: number;
    };
    fb: {
      scaleTot: number;
      abs: number; // Absolute impact in €

      scale5TI: number;
      scale5: number;
      euros: number;
    };
  };
};
