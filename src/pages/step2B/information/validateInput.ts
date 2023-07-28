import { CascadeAnalysisInput } from "../../../functions/cascades";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import { CCInput } from "../standard/ClimateChangeAnalysis";

type Step2BError = [DVRiskCascade<DVRiskFile, DVRiskFile>, number, any];

type BaseCascadeAnalysisInput = {
  [K in keyof CascadeAnalysisInput]: any;
}[keyof CascadeAnalysisInput];

export interface Step2BErrors {
  causes?: Step2BError[];
  climateChange?: Step2BError;
  catalysingEffects?: Step2BError[];
}

export function causeAnalysisComplete(cascadeAnalysis: DVCascadeAnalysis) {
  return Object.keys(getCauseFieldsWithErrors(cascadeAnalysis)).length <= 0;
}

export function validateStep2B(
  cascades: DVRiskCascade<DVRiskFile>[],
  step2A: DVDirectAnalysis,
  step2B: DVCascadeAnalysis<DVRiskCascade<DVRiskFile>>[]
) {
  let errors: Step2BErrors = {
    causes: [],
    climateChange: undefined,
    catalysingEffects: [],
  };
  errors = cascades
    .sort((a, b) => {
      if (a.cr4de_cause_hazard.cr4de_subjective_importance !== b.cr4de_cause_hazard.cr4de_subjective_importance) {
        return a.cr4de_cause_hazard.cr4de_subjective_importance - b.cr4de_cause_hazard.cr4de_subjective_importance;
      }
      return a.cr4de_cause_hazard.cr4de_hazard_id.localeCompare(b.cr4de_cause_hazard.cr4de_hazard_id);
    })
    .reduce((e, c) => {
      const s = step2B.find((cascadeAnalysis) => c.cr4de_bnrariskcascadeid === cascadeAnalysis._cr4de_cascade_value);

      if (c.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.STANDARD) {
        if (!s)
          return {
            ...e,
            causes: [
              ...(e.causes || []),
              [c, cascades.filter((i) => i.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.STANDARD).indexOf(c), null],
            ],
          } as Step2BErrors;

        const fieldErrors = getCauseFieldsWithErrors(s);

        if (Object.keys(fieldErrors).length > 0) {
          return {
            ...e,
            causes: [
              ...(e.causes || []),
              [
                s.cr4de_cascade,
                step2B
                  .filter((i) => i.cr4de_cascade.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.STANDARD)
                  .indexOf(s),
                fieldErrors,
              ],
            ],
          } as Step2BErrors;
        }
      } else if (c.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING) {
        if (c.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0) {
          if (!s)
            return {
              ...e,
              climateChange: [c, 0, null],
            } as Step2BErrors;

          const climateChangeErrors = getCCFieldsWithErrors(step2A);

          if (Object.keys(climateChangeErrors).length > 0) {
            return { ...e, climateChange: [s.cr4de_cascade, 0, climateChangeErrors] as Step2BError };
          }
        } else {
          if (!s)
            return {
              ...e,
              catalysingEffects: [
                ...(e.catalysingEffects || []),
                [
                  c,
                  cascades
                    .filter(
                      (i) =>
                        i.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING &&
                        i.cr4de_cause_hazard.cr4de_title.indexOf("Climate") < 0
                    )
                    .indexOf(c),
                  null,
                ],
              ],
            } as Step2BErrors;

          const fieldErrors = getCatalysingFieldsWithErrors(s);

          if (Object.keys(fieldErrors).length > 0) {
            return {
              ...e,
              catalysingEffects: [
                ...(e.catalysingEffects || []),
                [
                  s.cr4de_cascade,
                  step2B
                    .filter(
                      (i) =>
                        i.cr4de_cascade.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING &&
                        i.cr4de_cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") < 0
                    )
                    .indexOf(s),
                  fieldErrors,
                ],
              ],
            } as Step2BErrors;
          }
        }
      }

      return e;
    }, errors as Step2BErrors);

  if (errors.causes && errors.causes.length <= 0) delete errors.causes;
  if (errors.catalysingEffects && errors.catalysingEffects.length <= 0) delete errors.catalysingEffects;
  if (!errors.climateChange) delete errors.climateChange;

  return errors;
}

export function validateStep2BMM(
  attacks: DVRiskCascade<unknown, DVRiskFile>[],
  catalysingEffects: DVRiskCascade<DVRiskFile>[],
  step2A: DVDirectAnalysis,
  step2B: DVCascadeAnalysis<DVRiskCascade<DVRiskFile, DVRiskFile>>[]
) {
  const errorsAttacks: Step2BErrors = attacks
    .sort((a, b) => {
      if (a.cr4de_effect_hazard.cr4de_subjective_importance !== b.cr4de_effect_hazard.cr4de_subjective_importance) {
        return a.cr4de_effect_hazard.cr4de_subjective_importance - b.cr4de_effect_hazard.cr4de_subjective_importance;
      }
      return a.cr4de_effect_hazard.cr4de_hazard_id.localeCompare(b.cr4de_effect_hazard.cr4de_hazard_id);
    })
    .reduce(
      (e, c) => {
        const s = step2B.find((cascadeAnalysis) => c.cr4de_bnrariskcascadeid === cascadeAnalysis._cr4de_cascade_value);

        if (!s)
          return {
            ...e,
            causes: [
              ...(e.causes || []),
              [c, attacks.filter((i) => i.cr4de_effect_hazard.cr4de_risk_type === RISK_TYPE.STANDARD).indexOf(c), null],
            ],
          } as Step2BErrors;

        const fieldErrors = getCauseFieldsWithErrors(s);

        if (Object.keys(fieldErrors).length > 0) {
          return {
            ...e,
            causes: [
              ...(e.causes || []),
              [
                s.cr4de_cascade,
                step2B
                  .filter((i) => i.cr4de_cascade.cr4de_effect_hazard.cr4de_risk_type === RISK_TYPE.STANDARD)
                  .indexOf(s),
                fieldErrors,
              ],
            ],
          } as Step2BErrors;
        }

        return e;
      },
      {
        causes: [],
        climateChange: undefined,
        catalysingEffects: [],
      } as Step2BErrors
    );

  const errorsCatalysing: Step2BErrors = catalysingEffects
    .sort((a, b) => {
      if (a.cr4de_cause_hazard.cr4de_subjective_importance !== b.cr4de_cause_hazard.cr4de_subjective_importance) {
        return a.cr4de_cause_hazard.cr4de_subjective_importance - b.cr4de_cause_hazard.cr4de_subjective_importance;
      }
      return a.cr4de_cause_hazard.cr4de_hazard_id.localeCompare(b.cr4de_cause_hazard.cr4de_hazard_id);
    })
    .reduce(
      (e, c) => {
        const s = step2B.find((cascadeAnalysis) => c.cr4de_bnrariskcascadeid === cascadeAnalysis._cr4de_cascade_value);

        if (c.cr4de_cause_hazard.cr4de_title.indexOf("Climate") < 0) {
          if (!s)
            return {
              ...e,
              catalysingEffects: [...(e.catalysingEffects || []), [c, catalysingEffects.indexOf(c), null]],
            } as Step2BErrors;

          const fieldErrors = getCatalysingFieldsWithErrors(s);

          if (Object.keys(fieldErrors).length > 0) {
            return {
              ...e,
              catalysingEffects: [
                ...(e.catalysingEffects || []),
                [
                  s.cr4de_cascade,
                  step2B
                    .filter(
                      (i) =>
                        i.cr4de_cascade.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING &&
                        i.cr4de_cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") < 0
                    )
                    .indexOf(s),
                  fieldErrors,
                ],
              ],
            } as Step2BErrors;
          }

          return e;
        } else {
          if (!s)
            return {
              ...e,
              climateChange: [c, 0, null],
            } as Step2BErrors;

          const climateChangeErrors = getCCFieldsWithErrors(step2A);

          if (Object.keys(climateChangeErrors).length > 0) {
            return { ...e, climateChange: [s.cr4de_cascade, 0, climateChangeErrors] as Step2BError };
          }

          return e;
        }
      },
      {
        causes: [],
        climateChange: undefined,
        catalysingEffects: [],
      } as Step2BErrors
    );

  const errors: Step2BErrors = {
    causes: errorsAttacks.causes,
    climateChange: undefined,
    catalysingEffects: errorsCatalysing.catalysingEffects,
  };
  console.log(errors);
  if (errors.causes && errors.causes.length <= 0) delete errors.causes;
  if (errors.catalysingEffects && errors.catalysingEffects.length <= 0) delete errors.catalysingEffects;
  if (!errors.climateChange) delete errors.climateChange;

  return errors;
}

export function validateStep2BEM(
  cascades: DVRiskCascade<unknown, DVRiskFile>[],
  step2A: DVDirectAnalysis,
  step2B: DVCascadeAnalysis<DVRiskCascade<unknown, DVRiskFile>>[]
) {
  let errors: Step2BErrors = {
    causes: [],
    climateChange: undefined,
    catalysingEffects: [],
  };
  errors = cascades
    .sort((a, b) => {
      if (a.cr4de_effect_hazard.cr4de_subjective_importance !== b.cr4de_effect_hazard.cr4de_subjective_importance) {
        return a.cr4de_effect_hazard.cr4de_subjective_importance - b.cr4de_effect_hazard.cr4de_subjective_importance;
      }
      return a.cr4de_effect_hazard.cr4de_hazard_id.localeCompare(b.cr4de_effect_hazard.cr4de_hazard_id);
    })
    .reduce((e, c) => {
      const s = step2B.find((cascadeAnalysis) => c.cr4de_bnrariskcascadeid === cascadeAnalysis._cr4de_cascade_value);

      if (!s)
        return {
          ...e,
          causes: [
            ...(e.causes || []),
            [c, cascades.filter((i) => i.cr4de_effect_hazard.cr4de_risk_type === RISK_TYPE.STANDARD).indexOf(c), null],
          ],
        } as Step2BErrors;

      const fieldErrors = getCatalysingFieldsWithErrors(s);

      if (Object.keys(fieldErrors).length > 0) {
        return {
          ...e,
          causes: [
            ...(e.causes || []),
            [
              s.cr4de_cascade,
              step2B
                .filter((i) => i.cr4de_cascade.cr4de_effect_hazard.cr4de_risk_type === RISK_TYPE.STANDARD)
                .indexOf(s),
              fieldErrors,
            ],
          ],
        } as Step2BErrors;
      }

      return e;
    }, errors as Step2BErrors);

  if (errors.causes && errors.causes.length <= 0) delete errors.causes;
  if (errors.catalysingEffects && errors.catalysingEffects.length <= 0) delete errors.catalysingEffects;
  if (!errors.climateChange) delete errors.climateChange;

  return errors;
}

export function getCCFieldsWithErrors(input: DVDirectAnalysis) {
  const fields: (keyof CCInput)[] = [
    "cr4de_dp50_quali",
    "cr4de_dp50_quanti_c",
    "cr4de_dp50_quanti_m",
    "cr4de_dp50_quanti_e",
  ];

  return fields.reduce((acc, f) => {
    if (input[f] === null || input[f] === "") {
      return {
        ...acc,
        [f]: null,
      };
    }

    return acc;
  }, {} as { [key in keyof DVDirectAnalysis]: any });
}

const CAUSE_FIELDS: (keyof DVCascadeAnalysis)[] = [
  "cr4de_c2c",
  "cr4de_c2m",
  "cr4de_c2e",
  "cr4de_m2c",
  "cr4de_m2m",
  "cr4de_m2e",
  "cr4de_e2c",
  "cr4de_e2m",
  "cr4de_e2e",
  "cr4de_quali_cascade",
];

export function getCauseFieldsWithErrors(input: DVCascadeAnalysis): { [key in keyof DVCascadeAnalysis]: any } {
  return CAUSE_FIELDS.reduce((acc, f) => {
    if (input[f] === null || input[f] === "") {
      return {
        ...acc,
        [f]: null,
      };
    }

    return acc;
  }, {} as { [key in keyof DVCascadeAnalysis]: any });
}

export function getCatalysingFieldsWithErrors(input: DVCascadeAnalysis): { [key in keyof DVCascadeAnalysis]: any } {
  if (input.cr4de_quali_cascade === null || input.cr4de_quali_cascade === "")
    return {
      cr4de_quali_cascade: null,
    } as { [key in keyof DVCascadeAnalysis]: any };

  return {} as { [key in keyof DVCascadeAnalysis]: any };
}
