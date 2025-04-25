export enum STEPS {
  INTRODUCTION,
  CAUSES,
  CLIMATE_CHANGE,
  CATALYSING_EFFECTS,
}

export type Step = {
  titleI18N: string;
  titleDefault: string;
  color?: string;
};

export const stepNames: { [key in STEPS]: Step } = {
  [STEPS.INTRODUCTION]: { titleI18N: "2B.progress.introduction.title", titleDefault: "Introduction" },
  [STEPS.CAUSES]: {
    titleI18N: "2B.progress.causes.title",
    titleDefault: "Causes",
    // color: "#9DC3E6",
  },
  [STEPS.CLIMATE_CHANGE]: {
    titleI18N: "2B.progress.climateChange.title",
    titleDefault: "Climate Change",
    // color: "#FFE699",
  },
  [STEPS.CATALYSING_EFFECTS]: {
    titleI18N: "2B.progress.catalysingEffects.title",
    titleDefault: "Catalysing Effects",
    // color: "#FFE699",
  },
};

export const manmadeStepNames: { [key in STEPS]: Step } = {
  ...stepNames,
  [STEPS.CAUSES]: {
    titleI18N: "2B.progress.potentialAttacks.title",
    titleDefault: "Potential Attack Scenarios",
    // color: "#9DC3E6",
  },
};

export const emergingStepNames: { [key in STEPS]: Step } = {
  ...stepNames,
  [STEPS.CAUSES]: {
    titleI18N: "2B.progress.catalyzedRisks.title",
    titleDefault: "Catalyzed Risks",
    // color: "#9DC3E6",
  },
};
