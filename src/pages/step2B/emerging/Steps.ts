export enum STEPS {
  INTRODUCTION,
  CATALYSING_EFFECTS,
}

export type Step = {
  titleI18N: string;
  titleDefault: string;
  color?: string;
};

export const stepNames: { [key in STEPS]: Step } = {
  [STEPS.INTRODUCTION]: { titleI18N: "2B.progress.introduction.title", titleDefault: "Introduction" },
  [STEPS.CATALYSING_EFFECTS]: {
    titleI18N: "2B.progress.catalysingEffects.title",
    titleDefault: "Catalysing Effects",
    // color: "#FFE699",
  },
};
