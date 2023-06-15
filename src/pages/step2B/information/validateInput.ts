import { CascadeAnalysisInput } from "../../../functions/cascades";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
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

export function validateStep2B(
  step2A: CCInput | null,
  step2B: BaseCascadeAnalysisInput[] | null,
  currentCascade: DVRiskCascade | null,
  lastInput: BaseCascadeAnalysisInput | null,
  causes: DVRiskCascade<DVRiskFile>[] | null,
  climateChange: DVRiskCascade<DVRiskFile> | null,
  catalysingEffects: DVRiskCascade<DVRiskFile>[] | null
) {
  if (causes === null || catalysingEffects === null || step2A === null || step2B === null) return null;

  const errors: { causes?: any; climateChange?: any; catalysingEffects?: any } = {};

  const causeErrors = causes.reduce((e, cause, i) => {
    const input =
      currentCascade && currentCascade.cr4de_bnrariskcascadeid === cause.cr4de_bnrariskcascadeid
        ? lastInput
        : step2B.find((s) => s._cr4de_cascade_value === cause.cr4de_bnrariskcascadeid);

    if (!input) return [...e, [cause, i, null]] as Step2BError[];
    else {
      const fieldErrors = getInputFieldsWithErrors(input);

      if (Object.keys(fieldErrors).length > 0) {
        return [...e, [cause, i, fieldErrors]] as Step2BError[];
      }
    }

    return e;
  }, [] as Step2BError[]);

  if (Object.keys(causeErrors).length > 0) {
    errors.causes = causeErrors;
  }

  if (climateChange) {
    const climateChangeErrors = getInputFieldsWithErrorsCC(step2A);

    if (Object.keys(climateChangeErrors).length > 0) {
      errors.climateChange = [climateChange, 0, climateChangeErrors];
    }
  }

  const catalysingErrors = catalysingEffects.reduce((e, ce, i) => {
    const input =
      currentCascade && currentCascade.cr4de_bnrariskcascadeid === ce.cr4de_bnrariskcascadeid
        ? lastInput
        : step2B.find((s) => s._cr4de_cascade_value === ce.cr4de_bnrariskcascadeid);

    if (!input) return [...e, [ce, i, null]] as Step2BError[];
    else {
      if (input.cr4de_quali_cascade === null || input.cr4de_quali_cascade === "") {
        return [
          ...e,
          [
            ce,
            i,
            {
              cr4de_quali_cascade: null,
            },
          ],
        ] as Step2BError[];
      }
    }

    return e;
  }, [] as Step2BError[]);
  if (Object.keys(catalysingErrors).length > 0) {
    errors.catalysingEffects = catalysingErrors;
  }

  return errors;
}

export function getInputFieldsWithErrorsCC(input: CCInput) {
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
  }, {});
}

function getInputFieldsWithErrors(input: CascadeAnalysisInput) {
  const fields: (keyof CascadeAnalysisInput)[] = [
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

  return fields.reduce((acc, f) => {
    if (input[f] === null || input[f] === "") {
      return {
        ...acc,
        [f]: null,
      };
    }

    return acc;
  }, {});
}
