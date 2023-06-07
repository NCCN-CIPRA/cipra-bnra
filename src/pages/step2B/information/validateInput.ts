import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";

type Step2BError = [DVRiskCascade<DVRiskFile>, number, any];

export interface Step2BErrors {
  causes?: Step2BError[];
  climateChange?: Step2BError;
  catalysingEffects?: Step2BError[];
}

export function validateStep2B(
  step2A: DVDirectAnalysis | null,
  step2B: DVCascadeAnalysis[] | null,
  causes: DVRiskCascade<DVRiskFile>[] | null,
  climateChange: DVRiskCascade<DVRiskFile> | null,
  catalysingEffects: DVRiskCascade<DVRiskFile>[] | null
) {
  if (causes === null || catalysingEffects === null || step2A === null || step2B === null) return null;

  const errors: { causes?: any; climateChange?: any; catalysingEffects?: any } = {};

  const causeErrors = causes.reduce((e, cause, i) => {
    const input = step2B.find((s) => s._cr4de_cascade_value === cause.cr4de_bnrariskcascadeid);

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
    const input = step2B.find((s) => s._cr4de_cascade_value === ce.cr4de_bnrariskcascadeid);

    if (!input) return [...e, [ce, i, null]] as Step2BError[];
    else {
      const fieldErrors = getInputFieldsWithErrors(input);

      if (Object.keys(fieldErrors).length > 0) {
        return [...e, [ce, i, fieldErrors]] as Step2BError[];
      }
    }

    return e;
  }, [] as Step2BError[]);
  if (Object.keys(catalysingErrors).length > 0) {
    errors.catalysingEffects = catalysingErrors;
  }

  return errors;
}

function getInputFieldsWithErrorsCC(input: DVDirectAnalysis) {
  const fields: (keyof DVDirectAnalysis)[] = [
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

function getInputFieldsWithErrors(input: DVCascadeAnalysis) {
  const fields: (keyof DVCascadeAnalysis)[] = [
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
