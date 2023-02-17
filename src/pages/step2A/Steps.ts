export enum STEPS {
  QUALI_P,
  QUALI_I_H,
  QUALI_I_S,
  QUALI_I_E,
  QUALI_I_F,
  QUALI_CB,
  QUANTI_C,
  QUANTI_M,
  QUANTI_E,
  REVIEW,
}

export const stepNames: { [key in STEPS]: string } = {
  [STEPS.QUALI_P]: "2A.qualiP.title",
  [STEPS.QUALI_I_H]: "2A.qualiIH.title",
  [STEPS.QUALI_I_S]: "2A.qualiIS.title",
  [STEPS.QUALI_I_E]: "2A.qualiIE.title",
  [STEPS.QUALI_I_F]: "2A.qualiIF.title",
  [STEPS.QUALI_CB]: "2A.qualiCB.title",
  [STEPS.QUANTI_C]: "2A.quantiC.title",
  [STEPS.QUANTI_M]: "2A.quantiM.title",
  [STEPS.QUANTI_E]: "2A.quantiE.title",
  [STEPS.REVIEW]: "2A.review.title",
};

export const hasDrawer = {
  [STEPS.QUALI_P]: true,
  [STEPS.QUALI_I_H]: true,
  [STEPS.QUALI_I_S]: true,
  [STEPS.QUALI_I_E]: true,
  [STEPS.QUALI_I_F]: true,
  [STEPS.QUALI_CB]: false,
  [STEPS.QUANTI_C]: true,
  [STEPS.QUANTI_M]: true,
  [STEPS.QUANTI_E]: true,
  [STEPS.REVIEW]: false,
};
