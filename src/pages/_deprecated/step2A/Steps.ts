export enum STEPS {
  INTRODUCTION,
  CONSIDERABLE,
  MAJOR,
  EXTREME,
  REVIEW,
}

export type Step = {
  titleI18N: string;
  titleDefault: string;
  color?: string;
};

export const stepNames: { [key in STEPS]: Step } = {
  [STEPS.INTRODUCTION]: { titleI18N: "2A.progress.introduction.title", titleDefault: "Introduction" },
  [STEPS.CONSIDERABLE]: {
    titleI18N: "2A.progress.considerable.title",
    titleDefault: "Considerable",
    color: "#9DC3E6",
  },
  [STEPS.MAJOR]: { titleI18N: "2A.progress.major.title", titleDefault: "Major", color: "#FFE699" },
  [STEPS.EXTREME]: { titleI18N: "2A.progress.extreme.title", titleDefault: "Extreme", color: "#F47C7C" },
  [STEPS.REVIEW]: { titleI18N: "2A.progress.review.title", titleDefault: "Review" },
};
