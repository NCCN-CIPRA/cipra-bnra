import { SCENARIOS } from "../../functions/scenarios";

export type SerializedCauseSnapshotResults = string & {
  __json_seralized: CauseSnapshotResults;
};

export function serializeCauseSnapshotResults(
  quanti: CauseSnapshotResults
): SerializedCauseSnapshotResults {
  return JSON.stringify(quanti) as SerializedCauseSnapshotResults;
}

export type SerializedEffectSnapshotResults = string & {
  __json_seralized: EffectSnapshotResults;
};

export function serializeEffectSnapshotResults(
  quanti: EffectSnapshotResults
): SerializedEffectSnapshotResults {
  return JSON.stringify(quanti) as SerializedEffectSnapshotResults;
}

type DVCascadeSnapshotCauseResultType =
  | unknown
  | SerializedCauseSnapshotResults
  | CauseSnapshotResults;
type DVCascadeSnapshotEffectResultType =
  | unknown
  | SerializedEffectSnapshotResults
  | EffectSnapshotResults;

export interface DVCascadeSnapshot<
  CascadeType = unknown,
  CauseType = unknown,
  EffectType = unknown,
  CauseResultType extends DVCascadeSnapshotCauseResultType = CauseSnapshotResults,
  EffectResultType extends DVCascadeSnapshotEffectResultType = EffectSnapshotResults
> {
  cr4de_bnrariskcascadesnapshotid: string;

  "cr4de_risk_cascade@odata.bind": unknown;
  _cr4de_risk_cascade_value: string; // DVRiskCascade
  cr4de_risk_cascade: CascadeType;

  "cr4de_cause_risk@odata.bind": unknown;
  _cr4de_cause_risk_value: string;
  cr4de_cause_risk: CauseType;

  "cr4de_effect_risk@odata.bind": unknown;
  _cr4de_effect_risk_value: string;
  cr4de_effect_risk: EffectType;

  cr4de_quanti_cause: CauseResultType;
  cr4de_quanti_effect: EffectResultType;

  // Qualitative input given by the experts on the causing risk
  cr4de_quali_cause: string | null;
  // Qualitative input given by the experts on the effect risk
  cr4de_quali: string | null;
  // Consolidated description of the catalyzing effect for the BE Report
  cr4de_description: string | null;
}

export type CauseSnapshotResults = {
  [SCENARIOS.CONSIDERABLE]: CauseSnapshotScenarioResults;
  [SCENARIOS.MAJOR]: CauseSnapshotScenarioResults;
  [SCENARIOS.EXTREME]: CauseSnapshotScenarioResults;
};

export type CPMatrixRow = {
  [SCENARIOS.CONSIDERABLE]: string;
  [SCENARIOS.MAJOR]: string;
  [SCENARIOS.EXTREME]: string;
};

export type CauseSnapshotScenarioResults = {
  cp: {
    matrix: CPMatrixRow;
  };
  ip: {
    yearly: {
      scale: number; // Indirect probability of the cascade causing the scenario on the tp scale (0 - 5)
    };
  };
  ip50: {
    yearly: {
      scale: number; // Indirect probability of the cascade causing the scenario in 2050 on the tp scale (0 - 5)
    };
  };
};

export type EffectSnapshotResults = {
  [SCENARIOS.CONSIDERABLE]: EffectSnapshotScenarioResults;
  [SCENARIOS.MAJOR]: EffectSnapshotScenarioResults;
  [SCENARIOS.EXTREME]: EffectSnapshotScenarioResults;
};

export type EffectSnapshotScenarioResults = {
  cp: {
    avg: number;
    matrix: CPMatrixRow;
  };
  ii: {
    all: {
      scale: number; // Indirect impact of the cascade cause by the scenario on the ti scale (0 - 5)
    };
    h: {
      scale: number;
    };
    ha: {
      scale: number;
    };
    hb: {
      scale: number;
    };
    hc: {
      scale: number;
    };
    s: {
      scale: number;
    };
    sa: {
      scale: number;
    };
    sb: {
      scale: number;
    };
    sc: {
      scale: number;
    };
    sd: {
      scale: number;
    };
    e: {
      scale: number;
    };
    ea: {
      scale: number;
    };
    f: {
      scale: number;
    };
    fa: {
      scale: number;
    };
    fb: {
      scale: number;
    };
  };
};
