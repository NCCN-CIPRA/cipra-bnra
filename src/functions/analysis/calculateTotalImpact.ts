import { CascadeCalculation, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS } from "../scenarios";

// const DAMAGE_INDICATORS = ["Ha", "Hb", "Hc", "Sa", "Sb", "Sc", "Sd", "Ea", "Fa", "Fb"];

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

const setII = (cascade: CascadeCalculation, scenario: SCENARIOS, ii: number) => {
  if (scenario === SCENARIOS.CONSIDERABLE) cascade.ii_c = ii;
  if (scenario === SCENARIOS.MAJOR) cascade.ii_m = ii;
  if (scenario === SCENARIOS.EXTREME) cascade.ii_e = ii;
};

const getCP = (cascade: CascadeCalculation, fromScenario: SCENARIOS, toScenario: SCENARIOS) => {
  if (fromScenario === SCENARIOS.CONSIDERABLE && toScenario === SCENARIOS.CONSIDERABLE) return cascade.c2c;
  if (fromScenario === SCENARIOS.CONSIDERABLE && toScenario === SCENARIOS.MAJOR) return cascade.c2m;
  if (fromScenario === SCENARIOS.CONSIDERABLE && toScenario === SCENARIOS.EXTREME) return cascade.c2e;
  if (fromScenario === SCENARIOS.MAJOR && toScenario === SCENARIOS.CONSIDERABLE) return cascade.m2c;
  if (fromScenario === SCENARIOS.MAJOR && toScenario === SCENARIOS.CONSIDERABLE) return cascade.m2m;
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
  risk.ti_c = calculateTotalImpactScenario(risk, SCENARIOS.CONSIDERABLE);
  risk.ti_m = calculateTotalImpactScenario(risk, SCENARIOS.MAJOR);
  risk.ti_e = calculateTotalImpactScenario(risk, SCENARIOS.EXTREME);

  risk.ti = risk.ti_c + risk.ti_m + risk.ti_e;
  if (risk.ti === 0) {
    risk.ti = 0.0000001;
  }
}

function calculateTotalImpactScenario(risk: RiskCalculation, scenario: SCENARIOS): number {
  return (
    getDI(risk, scenario) +
    risk.effects.reduce((iiTot, cascade) => {
      if (cascade.effect.ti <= 0) {
        calculateTotalImpact(cascade.effect);
      }

      const cp0 =
        (1 - getCP(cascade, scenario, SCENARIOS.CONSIDERABLE)) *
        (1 - getCP(cascade, scenario, SCENARIOS.MAJOR)) *
        (1 - getCP(cascade, scenario, SCENARIOS.EXTREME));
      const cpTot =
        getCP(cascade, scenario, SCENARIOS.CONSIDERABLE) +
          getCP(cascade, scenario, SCENARIOS.MAJOR) +
          getCP(cascade, scenario, SCENARIOS.EXTREME) || 0.0000001;

      setII(
        cascade,
        scenario,
        cascade.effect.ti_c * (1 - cp0) * (getCP(cascade, scenario, SCENARIOS.CONSIDERABLE) / cpTot) +
          cascade.effect.tp_m * (1 - cp0) * (getCP(cascade, scenario, SCENARIOS.MAJOR) / cpTot) +
          cascade.effect.tp_e * (1 - cp0) * (getCP(cascade, scenario, SCENARIOS.EXTREME) / cpTot)
      );

      cascade.ii = cascade.ii_c + cascade.ii_m + cascade.ii_e;

      return iiTot + getII(cascade, scenario);
    }, 0)
  );
}