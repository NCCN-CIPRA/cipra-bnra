import { CascadeCalculation, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS } from "../scenarios";

const DAMAGE_INDICATORS = ["Ha", "Hb", "Hc", "Sa", "Sb", "Sc", "Sd", "Ea", "Fa", "Fb"];

const INFO_OPS_FACTOR = 10;

const getScenarioSuffix = (scenario: SCENARIOS) => {
  if (scenario === SCENARIOS.CONSIDERABLE) return "_c";
  else if (scenario === SCENARIOS.MAJOR) return "_m";
  return "_e";
};

const getDI = (risk: RiskCalculation, scenario: SCENARIOS) => {
  if (scenario === SCENARIOS.CONSIDERABLE) return risk.di_c;
  if (scenario === SCENARIOS.MAJOR) return risk.di_m;
  return risk.di_e;
};

const getII = (cascade: CascadeCalculation, scenario: SCENARIOS) => {
  if (scenario === SCENARIOS.CONSIDERABLE) return cascade.ii_c;
  if (scenario === SCENARIOS.MAJOR) return cascade.ii_m;
  return cascade.ii_e;
};

const setIndirectImpacts = (
  cascade: CascadeCalculation,
  scenario: SCENARIOS,
  s2c: number,
  s2m: number,
  s2e: number
) => {
  let suffix = getScenarioSuffix(scenario);
  const factor =
    cascade.effect.riskTitle === "Information operations" || cascade.cause.riskTitle === "Information operations"
      ? INFO_OPS_FACTOR
      : 1;

  DAMAGE_INDICATORS.forEach((d) => {
    //@ts-expect-error
    cascade[`ii_${d}${suffix}` as keyof CascadeCalculation] =
      (s2c * (cascade.effect[`ti_${d}_c` as keyof RiskCalculation] as number) +
        s2m * (cascade.effect[`ti_${d}_m` as keyof RiskCalculation] as number) +
        s2e * (cascade.effect[`ti_${d}_e` as keyof RiskCalculation] as number)) /
      factor;
  });

  //@ts-expect-error
  cascade[`ii${suffix}` as keyof CascadeCalculation] =
    (s2c * (cascade.effect[`ti_c` as keyof RiskCalculation] as number) +
      s2m * (cascade.effect[`ti_m` as keyof RiskCalculation] as number) +
      s2e * (cascade.effect[`ti_e` as keyof RiskCalculation] as number)) /
    factor;
};

const getCP = (cascade: CascadeCalculation, fromScenario: SCENARIOS, toScenario: SCENARIOS) => {
  if (fromScenario === SCENARIOS.CONSIDERABLE && toScenario === SCENARIOS.CONSIDERABLE) return cascade.c2c;
  if (fromScenario === SCENARIOS.CONSIDERABLE && toScenario === SCENARIOS.MAJOR) return cascade.c2m;
  if (fromScenario === SCENARIOS.CONSIDERABLE && toScenario === SCENARIOS.EXTREME) return cascade.c2e;
  if (fromScenario === SCENARIOS.MAJOR && toScenario === SCENARIOS.CONSIDERABLE) return cascade.m2c;
  if (fromScenario === SCENARIOS.MAJOR && toScenario === SCENARIOS.MAJOR) return cascade.m2m;
  if (fromScenario === SCENARIOS.MAJOR && toScenario === SCENARIOS.EXTREME) return cascade.m2e;
  if (fromScenario === SCENARIOS.EXTREME && toScenario === SCENARIOS.CONSIDERABLE) return cascade.e2c;
  if (fromScenario === SCENARIOS.EXTREME && toScenario === SCENARIOS.MAJOR) return cascade.e2m;
  return cascade.e2e;
};

export const getEffectGraph = (risk: RiskCalculation) => {
  return {
    ...risk,
    effects: getEffectGraphRecurse(risk.effects, [risk.riskId]),
  };
};

export const getEffectGraphRecurse = (
  cascades: CascadeCalculation[],
  visitedRiskIds: string[] = []
): CascadeCalculation[] => {
  if (cascades.length <= 0) return [];

  const nextLevel: CascadeCalculation[] = [];
  const nextVisitedIds = [...visitedRiskIds, ...cascades.map((c) => c.effect.riskId)];

  cascades.forEach((c1) => {
    c1.effect.effects.forEach((c2) => {
      if (nextVisitedIds.indexOf(c2.effect.riskId) < 0) {
        nextLevel.push(c2);
      }
    });
  });

  const nextLevelEffects = getEffectGraphRecurse(nextLevel, nextVisitedIds);

  return cascades.map((c1) => ({
    ...c1,
    effect: {
      ...c1.effect,
      effects: c1.effect.effects.reduce((filteredEffects, c2) => {
        const nextLevelEffect = nextLevelEffects.find((c3) => c2.effect.riskId === c3.effect.riskId);

        if (!nextLevelEffect) return filteredEffects;

        return [...filteredEffects, { ...c2, effect: nextLevelEffect.effect }];
      }, [] as CascadeCalculation[]),
    },
  }));
};

export default function calculateTotalImpact(risk: RiskCalculation): void {
  calculateTotalImpactScenario(risk, SCENARIOS.CONSIDERABLE);
  calculateTotalImpactScenario(risk, SCENARIOS.MAJOR);
  calculateTotalImpactScenario(risk, SCENARIOS.EXTREME);
}

function calculateTotalImpactScenario(risk: RiskCalculation, scenario: SCENARIOS) {
  let suffix = getScenarioSuffix(scenario);

  //@ts-expect-error
  risk[`ti${suffix}` as keyof RiskCalculation] =
    getDI(risk, scenario) +
    risk.effects.reduce((iiTot, cascade) => {
      if (cascade.effect.ti <= 0) {
        calculateTotalImpact(cascade.effect);
      }

      // const cp0 =
      //   (1 - getCP(cascade, scenario, SCENARIOS.CONSIDERABLE)) *
      //   (1 - getCP(cascade, scenario, SCENARIOS.MAJOR)) *
      //   (1 - getCP(cascade, scenario, SCENARIOS.EXTREME));
      // const cpTot =
      //   getCP(cascade, scenario, SCENARIOS.CONSIDERABLE) +
      //     getCP(cascade, scenario, SCENARIOS.MAJOR) +
      //     getCP(cascade, scenario, SCENARIOS.EXTREME) || 0.0000001;

      // const s2c = (1 - cp0) * (getCP(cascade, scenario, SCENARIOS.CONSIDERABLE) / cpTot);
      // const s2m = (1 - cp0) * (getCP(cascade, scenario, SCENARIOS.MAJOR) / cpTot);
      // const s2e = (1 - cp0) * (getCP(cascade, scenario, SCENARIOS.EXTREME) / cpTot);

      setIndirectImpacts(
        cascade,
        scenario,
        getCP(cascade, scenario, SCENARIOS.CONSIDERABLE),
        getCP(cascade, scenario, SCENARIOS.MAJOR),
        getCP(cascade, scenario, SCENARIOS.EXTREME)
      );

      return iiTot + getII(cascade, scenario);
    }, 0);

  DAMAGE_INDICATORS.forEach((d) => {
    //@ts-expect-error
    risk[`ti_${d}${suffix}` as keyof RiskCalculation] =
      (risk[`di_${d}${suffix}` as keyof RiskCalculation] as number) +
      risk.effects.reduce((tot, cascade) => {
        return tot + (cascade[`ii_${d}${suffix}` as keyof CascadeCalculation] as number);
      }, 0);
  });

  risk.ti = -1;
}
