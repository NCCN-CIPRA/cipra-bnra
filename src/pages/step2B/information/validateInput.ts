import { CascadeAnalysisInput } from "../../../functions/cascades";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile, RISK_TYPE } from "../../../types/dataverse/DVRiskFile";
import { CCInput } from "../standard/ClimateChangeAnalysis";

type Step2BError = [DVRiskCascade<DVRiskFile>, number, any];

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

export function validateStep2B(step2A: DVDirectAnalysis, step2B: DVCascadeAnalysis<DVRiskCascade<DVRiskFile>>[]) {
  let errors: Step2BErrors = {
    causes: [],
    climateChange: undefined,
    catalysingEffects: [],
  };

  const cascadesDone: any = {};

  errors = step2B.reduce((e, s) => {
    if (cascadesDone[s.cr4de_cascade.cr4de_bnrariskcascadeid]) return e;

    cascadesDone[s.cr4de_cascade.cr4de_bnrariskcascadeid] = true;

    if (s.cr4de_cascade.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.STANDARD) {
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
    } else if (s.cr4de_cascade.cr4de_cause_hazard.cr4de_risk_type === RISK_TYPE.EMERGING) {
      if (s.cr4de_cascade.cr4de_cause_hazard.cr4de_title.indexOf("Climate") >= 0) {
        const climateChangeErrors = getCCFieldsWithErrors(step2A);

        if (Object.keys(climateChangeErrors).length > 0) {
          return { ...e, climateChange: [s.cr4de_cascade, 0, climateChangeErrors] as Step2BError };
        }
      } else {
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
