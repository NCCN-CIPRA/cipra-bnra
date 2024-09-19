import { RiskCalculation } from "../types/dataverse/DVAnalysisRun";
import { DAMAGE_INDICATOR, IMPACT_CATEGORY } from "./Impact";
import { getScenarioSuffix, SCENARIO_SUFFIX } from "./scenarios";

const BASE_TOTAL_IMPACT = 8 * 10 ** 8;

/**
 * ABSOLUTE IMPACT:
 *      Linear Scale from 0 to 16 * 10^10
 *
 * RELATIVE IMPACT:
 *      Logarithmic Scale with base 5 from 0 to 5
 */

export const getTotalImpactRelative = (calculation: RiskCalculation, scenarioSuffix: SCENARIO_SUFFIX) => {
  const totalImpactAbsolute = calculation[`ti${scenarioSuffix}`];

  if (totalImpactAbsolute < BASE_TOTAL_IMPACT) return totalImpactAbsolute / BASE_TOTAL_IMPACT;

  return 1 + Math.log10(totalImpactAbsolute / BASE_TOTAL_IMPACT) / Math.log10(5);
};

export const getTotalImpactAbsolute = (relativeImpact: number) => {
  if (relativeImpact <= 1) return relativeImpact * BASE_TOTAL_IMPACT;

  return BASE_TOTAL_IMPACT * Math.pow(5, relativeImpact - 1);
};

/**
 * @returns The impact attributable to the given damage indicator (0 - 5)
 */
export const getDamageIndicatorImpactRelative = (
  calculation: RiskCalculation,
  damageIndicator: DAMAGE_INDICATOR,
  scenarioSuffix: SCENARIO_SUFFIX
) => {
  const totalImpactAbsolute = calculation[`ti${scenarioSuffix}`];
  const totalImpactRelative = getTotalImpactRelative(calculation, scenarioSuffix);

  const damageIndicatorImpactAbsolute = calculation[`ti_${damageIndicator}${scenarioSuffix}`] || 0;

  return (totalImpactRelative * damageIndicatorImpactAbsolute) / totalImpactAbsolute;
};

// export const getDamageIndicatorImpactAbsolute = () => {
//     return (damageIndicatorImpactRelative * totalImpactAbsolute) / totalImpactRelative;
// };

export const getTotalCategoryImpactAbsolute = (
  calculation: RiskCalculation,
  category: IMPACT_CATEGORY,
  scenarioSuffix: SCENARIO_SUFFIX
) => {
  return (
    (calculation[`ti_${category}a${scenarioSuffix}`] || 0) +
    ((calculation[`ti_${category}b${scenarioSuffix}` as keyof RiskCalculation] as number) || 0) +
    ((calculation[`ti_${category}c${scenarioSuffix}` as keyof RiskCalculation] as number) || 0) +
    ((calculation[`ti_${category}d${scenarioSuffix}` as keyof RiskCalculation] as number) || 0)
  );
};

/**
 * @returns The impact attributable to the given impact category (0 - 5)
 *          i.e. the sum of all damage indicators of this category
 */
export const getCategoryImpactRelative = (
  calculation: RiskCalculation,
  category: IMPACT_CATEGORY,
  scenarioSuffix: SCENARIO_SUFFIX
) => {
  const totalImpactAbsolute = calculation[`ti${scenarioSuffix}`];
  const totalImpactRelative = getTotalImpactRelative(calculation, scenarioSuffix);

  const categoryImpactAbsolute = getTotalCategoryImpactAbsolute(calculation, category, scenarioSuffix);

  return (totalImpactRelative * categoryImpactAbsolute) / totalImpactAbsolute;
};

// export const getCategoryImpactAbsolute = () => {};
