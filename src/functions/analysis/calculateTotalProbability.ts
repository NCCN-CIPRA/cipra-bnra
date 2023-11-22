import { CascadeCalculation, RiskCalculation } from "../../types/dataverse/DVAnalysisRun";
import { SCENARIOS } from "../scenarios";

const getDP = (risk: RiskCalculation, scenario: SCENARIOS) => {
  if (scenario === SCENARIOS.CONSIDERABLE) return risk.dp_c;
  if (scenario === SCENARIOS.MAJOR) return risk.dp_m;
  return risk.dp_e;
};

const getIP = (cascade: CascadeCalculation, scenario: SCENARIOS) => {
  if (scenario === SCENARIOS.CONSIDERABLE) return cascade.ip_c;
  if (scenario === SCENARIOS.MAJOR) return cascade.ip_m;
  return cascade.ip_e;
};

const setIP = (cascade: CascadeCalculation, scenario: SCENARIOS, ip: number) => {
  if (scenario === SCENARIOS.CONSIDERABLE) cascade.ip_c = ip;
  if (scenario === SCENARIOS.MAJOR) cascade.ip_m = ip;
  if (scenario === SCENARIOS.EXTREME) cascade.ip_e = ip;
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

export const getCausalGraph = (risk: RiskCalculation) => {
  return {
    ...risk,
    causes: getCausalGraphRecurse(risk.causes, [risk.riskId]),
  };
};

export const getCausalGraphRecurse = (
  cascades: CascadeCalculation[],
  visitedRiskIds: string[] = []
): CascadeCalculation[] => {
  if (cascades.length <= 0) return [];

  const nextLevel: CascadeCalculation[] = [];
  const nextVisitedIds = [...visitedRiskIds, ...cascades.map((c) => c.cause.riskId)];

  cascades.forEach((c1) => {
    c1.cause.causes.forEach((c2) => {
      if (nextVisitedIds.indexOf(c2.cause.riskId) < 0) {
        nextLevel.push(c2);
      }
    });
  });

  const nextLevelCauses = getCausalGraphRecurse(nextLevel, nextVisitedIds);

  return cascades.map((c1) => ({
    ...c1,
    cause: {
      ...c1.cause,
      causes: c1.cause.causes.reduce((filteredCauses, c2) => {
        const nextLevelCause = nextLevelCauses.find((c3) => c2.cause.riskId === c3.cause.riskId);

        if (!nextLevelCause) return filteredCauses;

        return [...filteredCauses, { ...c2, cause: nextLevelCause.cause }];
      }, [] as CascadeCalculation[]),
    },
  }));
};

export default function calculateTotalProbability(risk: RiskCalculation): void {
  risk.tp_c = calculateTotalProbabilityScenario(risk, SCENARIOS.CONSIDERABLE);
  risk.tp_m = calculateTotalProbabilityScenario(risk, SCENARIOS.MAJOR);
  risk.tp_e = calculateTotalProbabilityScenario(risk, SCENARIOS.EXTREME);

  risk.tp = risk.tp_c + risk.tp_m + risk.tp_e;
}

function calculateTotalProbabilityScenario(risk: RiskCalculation, scenario: SCENARIOS): number {
  return (
    getDP(risk, scenario) +
    risk.causes.reduce((ipTot, cascade) => {
      if (cascade.cause.tp <= 0) {
        calculateTotalProbability(cascade.cause);
      }

      setIP(
        cascade,
        scenario,
        cascade.cause.tp_c * getCP(cascade, SCENARIOS.CONSIDERABLE, scenario) +
          cascade.cause.tp_m * getCP(cascade, SCENARIOS.MAJOR, scenario) +
          cascade.cause.tp_e * getCP(cascade, SCENARIOS.EXTREME, scenario)
      );

      cascade.ip = cascade.ip_c + cascade.ip_m + cascade.ip_e;

      return ipTot + getIP(cascade, scenario);
    }, 0)
  );
}
