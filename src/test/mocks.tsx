export const riskSnapshotScenarioResultsMock = {
  tp: {
    yearly: {
      scale: 1,
    },
  },
  tp50: {
    yearly: {
      scale: 1, // Total probability of the scenario on the tp scale (0 - 5)
    },
  },
  dp: {
    yearly: {
      scale: 1, // Total probability of the scenario on the tp scale (0 - 5)
    },
  },
  dp50: {
    yearly: {
      scale: 1, // Total probability of the scenario on the tp scale (0 - 5)
    },
  },
  ti: {
    all: {
      scaleTot: 1, // Total impact of the scenario on the ti scale (0 - 5)
    },
    h: {
      scaleTot: 1, // Total human impact of the scenario on the ti scale (0 - 5)
      scaleCat: 1, // Total human impact of the scenario on the human impact category scale (0 - 5)
    },
    ha: {
      scaleTot: 1, // Total Ha impact of the scenario on the ti scale (0 - 5)
      scaleCatRel: 1, // Percentage of H impact that is due to Ha (0 - 1)
      abs: 1, // Total Ha impact on an absolute scale (€)
    },
    hb: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
    },
    hc: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
    },
    s: {
      scaleTot: 1,
      scaleCat: 1,
    },
    sa: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
    },
    sb: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
    },
    sc: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
    },
    sd: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
    },
    e: {
      scaleTot: 1,
      scaleCat: 1,
    },
    ea: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
    },
    f: {
      scaleTot: 1,
      scaleCat: 1,
    },
    fa: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
    },
    fb: {
      scaleTot: 1,
      scaleCatRel: 1,
      abs: 1,
    },
  },
  di: {
    all: { scale: 1 },
    ha: { scale: 1 },
    hb: { scale: 1 },
    hc: { scale: 1 },
    sa: { scale: 1 },
    sb: { scale: 1 },
    sc: { scale: 1 },
    sd: { scale: 1 },
    ea: { scale: 1 },
    fa: { scale: 1 },
    fb: { scale: 1 },
  },
};

export const quantiScenariosMock = {
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
