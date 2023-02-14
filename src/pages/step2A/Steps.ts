export enum STEPS {
  QUALI_P,
  QUALI_I_H,
  QUALI_I_S,
  QUALI_I_E,
  QUALI_I_F,
  QUALI_CB,
  // QUALI_CC,
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
  // [STEPS.QUALI_CC]: "2A.qualiCC.title",
  [STEPS.QUANTI_C]: "2A.quantiC.title",
  [STEPS.QUANTI_M]: "2A.quantiM.title",
  [STEPS.QUANTI_E]: "2A.quantiE.title",
  [STEPS.REVIEW]: "2A.review.title",
};
