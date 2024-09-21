/**
 * These function try to rescale the impact per category so as to
 * provide comparable and logical values.
 *
 * The magic numbers are chosen somewhat arbitrarily to provide
 * better visual representations
 */

import { DVRiskFile, RISKFILE_RESULT_FIELD } from "../types/dataverse/DVRiskFile";
import { DAMAGE_INDICATOR, IMPACT_CATEGORY } from "./Impact";
import { getScenarioParameter, SCENARIOS } from "./scenarios";
import { getTotalImpactAbsolute } from "./TotalImpact";

const BASE_CATEGORY_IMPACT = 15811388;

const getCategoryImpactAbsolute = (riskFile: DVRiskFile, category: IMPACT_CATEGORY, scenario: SCENARIOS) => {
  const totalImpactRelative = getScenarioParameter(riskFile, "TI", scenario) || 0;
  const totalImpactAbsolute = getTotalImpactAbsolute(totalImpactRelative);

  const categoryImpactRelative =
    (getScenarioParameter(riskFile, `TI_${category}a` as RISKFILE_RESULT_FIELD, scenario) || 0) +
    (getScenarioParameter(riskFile, `TI_${category}b` as RISKFILE_RESULT_FIELD, scenario) || 0) +
    (getScenarioParameter(riskFile, `TI_${category}c` as RISKFILE_RESULT_FIELD, scenario) || 0) +
    (getScenarioParameter(riskFile, `TI_${category}d` as RISKFILE_RESULT_FIELD, scenario) || 0);

  return (categoryImpactRelative * totalImpactAbsolute) / totalImpactRelative;
};

const rescaleImpact = (i: number) => {
  // return i;
  if (i < 1.5) return 0.5 * (i / 1.5);
  // if (i > 3.5) return 4.5 + 0.5 * ((i - 3.5) / 1.5);
  return 0.5 + (4.5 * (i - 1.5)) / 3.5;
};

export const getCategoryImpactRescaled = (riskFile: DVRiskFile, category: IMPACT_CATEGORY, scenario: SCENARIOS) => {
  const totalImpact = getCategoryImpactAbsolute(riskFile, category, scenario);

  if (totalImpact < BASE_CATEGORY_IMPACT) {
    return rescaleImpact(totalImpact / (2 * BASE_CATEGORY_IMPACT));
  }
  return rescaleImpact(Math.log10(totalImpact / 5) - 6);
};

export const getDamageIndicatorToCategoryImpactRatio = (
  riskFile: DVRiskFile,
  di: DAMAGE_INDICATOR,
  scenario: SCENARIOS
) => {
  const diImpact = getScenarioParameter(riskFile, `TI_${di}`, scenario) || 0;
  const categoryImpact =
    (getScenarioParameter(riskFile, `TI_${di[0]}a` as RISKFILE_RESULT_FIELD, scenario) || 0) +
    (getScenarioParameter(riskFile, `TI_${di[0]}b` as RISKFILE_RESULT_FIELD, scenario) || 0) +
    (getScenarioParameter(riskFile, `TI_${di[0]}c` as RISKFILE_RESULT_FIELD, scenario) || 0) +
    (getScenarioParameter(riskFile, `TI_${di[0]}d` as RISKFILE_RESULT_FIELD, scenario) || 0);

  return diImpact / categoryImpact;
};
