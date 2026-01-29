// These functions implement the probability statistics algorithms as described
// in the BNRA methodology document: Quantitative Model and Statistical Analysis
// under section Statistical Analysis - Technical Implementation - Impact Statistics

import { Risk, RiskEvent, Scenario } from "./types";

export type ProbabilityContributionStatistics = {
  id: string | null;
  risk: string;
  scenario: Scenario | null;
  contributionMean: number;
  contributionStd: number;
  contribution95Error: number;
};

export type TotalProbabilityStatistics = {
  sampleMean: number;
  sampleStd: number;
  relativeContributions: ProbabilityContributionStatistics[];
  relativeRootCauseContributions: ProbabilityContributionStatistics[];
};

export const NoStatistics = (): TotalProbabilityStatistics => ({
  sampleMean: 0,
  sampleStd: 1,
  relativeContributions: [],
  relativeRootCauseContributions: [],
});

export function countYearlyEvents(
  yearlyEvents: RiskEvent[],
  sampleRiskScenarioCounts: Record<string, number>[],
  sampleCascadeCounts: Record<string, Record<string, number>>[],
  sampleRootCauseCounts: Record<string, Record<string, number>>[],
) {
  const riskScenarioCounts: Record<string, number> = {};
  const cascadeCounts: Record<string, Record<string, number>> = {};
  const rootCauseCounts: Record<string, Record<string, number>> = {};

  for (const e of yearlyEvents) {
    // Step 1: Given a single event graph E_i^n of observation (year) n
    //         from the simulations above, the following variables may
    //         be defined:
    const riskScenarioAppears: Record<string, number> = {};
    const cascadeAppears: Record<string, Record<string, number>> = {};
    const rootCauseAppears: Record<string, Record<string, number>> = {};

    countEventTree(
      e,
      null,
      e,
      riskScenarioAppears,
      cascadeAppears,
      rootCauseAppears,
    );

    // Step 2: The following compound variables may be defined for
    //         each observation (year) n:
    addCounts(riskScenarioCounts, riskScenarioAppears);
    addDeepCounts(cascadeCounts, cascadeAppears);
    addDeepCounts(rootCauseCounts, rootCauseAppears);
  }

  sampleRiskScenarioCounts.push(riskScenarioCounts);
  sampleCascadeCounts.push(cascadeCounts);
  sampleRootCauseCounts.push(rootCauseCounts);
}

export function getProbabilityStatistics(
  sampleRiskScenarioCounts: Record<string, number>[],
  sampleCascadeCounts: Record<string, Record<string, number>>[],
  sampleRootCauseCounts: Record<string, Record<string, number>>[],
  riskCatalogue: Risk[],
): Record<string, Record<Scenario, TotalProbabilityStatistics>> {
  // Step 3: Then the empirical mean and variance of these variables
  //         can be used as estimators
  const statistics: Record<
    string,
    Record<Scenario, TotalProbabilityStatistics>
  > = {};

  const totalCascadeCounts: Record<string, Record<string, number>> = {};
  const totalRootCauseCounts: Record<string, Record<string, number>> = {};
  for (let n = 0; n < sampleCascadeCounts.length; n++) {
    addDeepCounts(totalCascadeCounts, sampleCascadeCounts[n]);
    addDeepCounts(totalRootCauseCounts, sampleRootCauseCounts[n]);
  }

  for (const risk of riskCatalogue) {
    statistics[risk.id] = {
      considerable: NoStatistics(),
      major: NoStatistics(),
      extreme: NoStatistics(),
    };

    for (const scenario of ["considerable", "major", "extreme"] as Scenario[]) {
      const s = statistics[risk.id][scenario];

      // Step 3.1: For the total yearly probability of a risk scenario
      s.sampleMean =
        sampleRiskScenarioCounts.reduce(
          (acc, count) => acc + (count[getRiskScenarioId(risk, scenario)] || 0),
          0,
        ) / sampleRiskScenarioCounts.length;
      s.sampleStd =
        sampleRiskScenarioCounts.reduce(
          (acc, count) =>
            acc +
            ((count[getRiskScenarioId(risk, scenario)] || 0) - s.sampleMean) **
              2,
          0,
        ) /
        (sampleRiskScenarioCounts.length - 1);

      const totalRiskCascadeCounts: Record<string, number> | undefined =
        totalCascadeCounts[getRiskScenarioId(risk, scenario)];
      const totalRiskRootCauseCounts: Record<string, number> | undefined =
        totalRootCauseCounts[getRiskScenarioId(risk, scenario)];

      if (
        totalRiskCascadeCounts?.[getRiskScenarioId(null, null)] !== undefined
      ) {
        s.relativeContributions.push({
          id: null,
          risk: "Direct Probability",
          scenario: null,
          contributionMean:
            totalRiskCascadeCounts[getRiskScenarioId(null, null)] /
            s.sampleMean /
            sampleCascadeCounts.length,
          contributionStd: 0,
          contribution95Error: 0,
        });
      }

      if (
        totalRiskRootCauseCounts?.[getRiskScenarioId(null, null)] !== undefined
      ) {
        s.relativeRootCauseContributions.push({
          id: null,
          risk: "Direct Probability",
          scenario: null,
          contributionMean:
            totalRiskRootCauseCounts[getRiskScenarioId(null, null)] /
            s.sampleMean /
            sampleRootCauseCounts.length,
          contributionStd: 0,
          contribution95Error: 0,
        });
      }

      for (const causeRisk of riskCatalogue) {
        for (const causeScenario of [
          "considerable",
          "major",
          "extreme",
        ] as Scenario[]) {
          if (
            totalRiskCascadeCounts?.[
              getRiskScenarioId(causeRisk, causeScenario)
            ] !== undefined
          ) {
            const contributionMean =
              totalCascadeCounts[getRiskScenarioId(risk, scenario)]?.[
                getRiskScenarioId(causeRisk, causeScenario)
              ] /
              s.sampleMean /
              sampleCascadeCounts.length;
            const contributionStd = getSampleStdContribution(
              sampleCascadeCounts,
              { risk: causeRisk, scenario: causeScenario },
              { risk, scenario },
              contributionMean,
            );

            s.relativeContributions.push({
              id: causeRisk.id,
              risk: causeRisk.name,
              scenario: causeScenario,
              contributionMean,
              contributionStd,
              contribution95Error:
                sampleCascadeCounts.length <= 0
                  ? 0
                  : (1.96 * contributionStd) /
                    Math.sqrt(sampleCascadeCounts.length),
            });
          }

          if (
            totalRiskRootCauseCounts?.[
              getRiskScenarioId(causeRisk, causeScenario)
            ] !== undefined
          ) {
            const contributionMean =
              totalRootCauseCounts[getRiskScenarioId(risk, scenario)]?.[
                getRiskScenarioId(causeRisk, causeScenario)
              ] /
              s.sampleMean /
              sampleRootCauseCounts.length;
            const contributionStd = getSampleStdContribution(
              sampleRootCauseCounts,
              { risk: causeRisk, scenario: causeScenario },
              { risk, scenario },
              contributionMean,
            );

            s.relativeRootCauseContributions.push({
              id: causeRisk.id,
              risk: causeRisk.name,
              scenario: causeScenario,
              contributionMean,
              contributionStd,
              contribution95Error:
                sampleRootCauseCounts.length <= 0
                  ? 0
                  : (1.96 * contributionStd) /
                    Math.sqrt(sampleRootCauseCounts.length),
            });
          }
        }
      }
    }
  }

  return statistics;
}

function getSampleStdContribution(
  contributions: Record<string, Record<string, number>>[],
  cause: { risk: Risk; scenario: Scenario },
  effect: { risk: Risk; scenario: Scenario },
  meanContribution: number,
): number {
  if (contributions.length <= 1) return 0;

  const variance =
    contributions.reduce(
      (acc, curr) =>
        acc +
        ((curr[getRiskScenarioId(effect.risk, effect.scenario)]?.[
          getRiskScenarioId(cause.risk, cause.scenario)
        ] || 0) -
          meanContribution) **
          2,
      0,
    ) /
    (contributions.length - 1);

  return Math.sqrt(variance);
}

function addCounts(A: Record<string, number>, B: Record<string, number>): void {
  for (const b in B) {
    if (!A[b]) {
      A[b] = 0;
    }

    A[b] += B[b];
  }
}

function addDeepCounts(
  A: Record<string, Record<string, number>>,
  B: Record<string, Record<string, number>>,
): void {
  for (const effect in B) {
    if (!A[effect]) {
      A[effect] = {};
    }

    for (const cause in B[effect]) {
      if (!A[effect][cause]) {
        A[effect][cause] = 0;
      }
      A[effect][cause] += B[effect][cause];
    }
  }
}

const getRiskScenarioId = (r: Risk | null, s: Scenario | null) =>
  `${r?.id || null}_${s || null}}`;
const getRiskEventId = (e: RiskEvent | null) =>
  getRiskScenarioId(e?.risk || null, e?.scenario || null);

function countEventTree(
  event: RiskEvent,
  cause: RiskEvent | null,
  rootCause: RiskEvent,
  riskScenarioAppears: Record<string, number>,
  cascadeAppears: Record<string, Record<string, number>>,
  rootCauseAppears: Record<string, Record<string, number>>,
): void {
  if (!riskScenarioAppears[getRiskEventId(event)]) {
    riskScenarioAppears[getRiskEventId(event)] = 1;
  }
  if (!cascadeAppears[getRiskEventId(event)]) {
    cascadeAppears[getRiskEventId(event)] = {};

    if (!cascadeAppears[getRiskEventId(event)][getRiskEventId(cause)]) {
      cascadeAppears[getRiskEventId(event)][getRiskEventId(cause)] = 1;
    }
  }
  if (!rootCauseAppears[getRiskEventId(event)]) {
    rootCauseAppears[getRiskEventId(event)] = {};

    if (!rootCauseAppears[getRiskEventId(event)][getRiskEventId(rootCause)]) {
      rootCauseAppears[getRiskEventId(event)][getRiskEventId(rootCause)] = 1;
    }
  }

  for (const triggeredEvent of event.triggeredEvents) {
    countEventTree(
      triggeredEvent,
      event,
      rootCause,
      riskScenarioAppears,
      cascadeAppears,
      rootCauseAppears,
    );
  }
}
