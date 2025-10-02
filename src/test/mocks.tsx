import {
  RiskSnapshotResults,
  RiskSnapshotScenarioResults,
} from "../types/dataverse/DVRiskSnapshot";

export const riskSnapshotScenarioResultsMock: RiskSnapshotScenarioResults = {
  tp: {
    yearly: {
      scale: 1,
    },
    rpMonths: 1,
    scale5TP: 1,
  },
  tp50: {
    yearly: {
      scale: 1, // Total probability of the scenario on the tp scale (0 - 5)
    },
    rpMonths: 1,
    scale5TP: 1,
  },
  m: {
    p: 1,
    scale: 1,
    scaleTot: 1,
  },
  dp: {
    scaleTot: 1,
    rpMonths: 1,
    scale: 1,
    scale5: 1,
    scale5TP: 1,
  },
  dp50: {
    scaleTot: 1,
    rpMonths: 1,
    scale: 1,
    scale5: 1,
    scale5TP: 1,
  },
  ti: {
    all: {
      scaleTot: 1, // Total impact of the scenario on the ti scale (0 - 5)
      euros: 1,
      scale5TI: 1,
    },
    h: {
      scaleTot: 1, // Total human impact of the scenario on the ti scale (0 - 5)
      scaleCat: 1, // Total human impact of the scenario on the human impact category scale (0 - 5)
      euros: 1,
      scale5Cat: 1,
      scale5TI: 1,
    },
    ha: {
      scaleTot: 1, // Total Ha impact of the scenario on the ti scale (0 - 5)
      scaleCatRel: 1, // Percentage of H impact that is due to Ha (0 - 1)
      abs: 1, // Total Ha impact on an absolute scale (€)
      euros: 1,
      scale5CatRel: 1,
      scale5TI: 1,
    },
    hb: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
      euros: 1,
      scale5CatRel: 1,
      scale5TI: 1,
    },
    hc: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
      euros: 1,
      scale5CatRel: 1,
      scale5TI: 1,
    },
    s: {
      scaleTot: 1,
      scaleCat: 1,
      euros: 1,
      scale5Cat: 1,
      scale5TI: 1,
    },
    sa: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
      euros: 1,
      scale5CatRel: 1,
      scale5TI: 1,
    },
    sb: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
      euros: 1,
      scale5CatRel: 1,
      scale5TI: 1,
    },
    sc: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
      euros: 1,
      scale5CatRel: 1,
      scale5TI: 1,
    },
    sd: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
      euros: 1,
      scale5CatRel: 1,
      scale5TI: 1,
    },
    e: {
      scaleTot: 1,
      scaleCat: 1,
      euros: 1,
      scale5Cat: 1,
      scale5TI: 1,
    },
    ea: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
      euros: 1,
      scale5CatRel: 1,
      scale5TI: 1,
    },
    f: {
      scaleTot: 1,
      scaleCat: 1,
      euros: 1,
      scale5Cat: 1,
      scale5TI: 1,
    },
    fa: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
      euros: 1,
      scale5CatRel: 1,
      scale5TI: 1,
    },
    fb: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
      euros: 1,
      scale5CatRel: 1,
      scale5TI: 1,
    },
  },
  di: {
    all: { scaleTot: 1 },
    ha: { scaleTot: 1, abs: 1, euros: 1, scale5: 1, scale5TI: 1 },
    hb: { scaleTot: 1, abs: 1, euros: 1, scale5: 1, scale5TI: 1 },
    hc: { scaleTot: 1, abs: 1, euros: 1, scale5: 1, scale5TI: 1 },
    sa: { scaleTot: 1, abs: 1, euros: 1, scale5: 1, scale5TI: 1 },
    sb: { scaleTot: 1, abs: 1, euros: 1, scale5: 1, scale5TI: 1 },
    sc: { scaleTot: 1, abs: 1, euros: 1, scale5: 1, scale5TI: 1 },
    sd: { scaleTot: 1, abs: 1, euros: 1, scale5: 1, scale5TI: 1 },
    ea: { scaleTot: 1, abs: 1, euros: 1, scale5: 1, scale5TI: 1 },
    fa: { scaleTot: 1, abs: 1, euros: 1, scale5: 1, scale5TI: 1 },
    fb: { scaleTot: 1, abs: 1, euros: 1, scale5: 1, scale5TI: 1 },
  },
};

export const quantiScenariosMock: RiskSnapshotResults = {
  considerable: riskSnapshotScenarioResultsMock,
  major: riskSnapshotScenarioResultsMock,
  extreme: riskSnapshotScenarioResultsMock,
};

export const causeRisksSummaryMock = {
  cause_risk_id: "",
  cause_risk_title: "",
  cause_risk_p: 1,
  other_causes: [
    {
      cause_risk_id: "",
      cause_risk_title: "",
      cause_risk_p: 1,
    },
  ],
};

export const effectRisksSummaryMock = {
  effect_risk_id: "",
  effect_risk_title: "",
  effect_risk_i: 1,
  other_effects: [
    {
      effect_risk_id: "",
      effect_risk_title: "",
      effect_risk_i: 1,
    },
  ],
};
