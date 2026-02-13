// These functions implement the impact statistics algorithms as described
// in the BNRA methodology document: Quantitative Model and Statistical Analysis
// under section Statistical Analysis - Technical Implementation - Impact Statistics

import { eurosFromIScale7, iScale7FromEuros } from "../indicators/impact";
import {
  addImpact,
  aggregateImpacts,
  divideImpact,
  divideImpacts,
  multiplyImpact,
  powImpact,
  round,
  roundImpact,
  subtractImpacts,
} from "./math";
import {
  AggregatedImpacts,
  EffectStatistics,
  Impact,
  ImpactContributionStatistics,
  noAggregatedImpacts,
  noImpact,
  RiskEvent,
  TotalImpactStatistics,
  BoxPlotData,
  HistogramBinData,
} from "../../types/simulation";

export default function getImpactStatistics(
  events: RiskEvent[],
): TotalImpactStatistics {
  // if (events[0].risk.actor) {
  //   console.log(events);
  // }
  for (const n of events) {
    // Step 1: Given an event graph n of risk scenario R_S, the impact
    //         of said observation is calculated as follows
    calculateTotalEventImpact(n);
  }

  // Step 2: Some well-known statistics may then be obtained from the
  //         full sample.
  const mainStatistics = getSampleStatistics(events);

  // Step 3: Given an event graph n of the risk scenario R_S, the relative
  //         contributions of the direct impact and each first-order
  //         cascading risk scenario to the total impact is calculated
  //         as follows
  const allFirstOrderEffects = getAllFirstOrderEffects(events);
  for (const n of events) {
    calculateAbsoluteImpactContributions(n, allFirstOrderEffects);
  }

  // Step 4: The sample mean and standard deviation for the relative
  //         contributions calculated in Step 3 are then obtained.
  const contributionStatistics = getImpactContributionStatistics(
    events,
    allFirstOrderEffects,
  );

  return {
    ...mainStatistics,
    ...contributionStatistics,
    histogram: getImpactHistogram(
      events.map((e) => e.totalImpact),
      "all",
    ),
    boxplots: getIndicatorBoxplots(events.map((e) => e.totalImpact)),
  };
}

// Step 1: Given an event graph n of risk scenario R_S, the total impact may
//         be obtained as follows
function calculateTotalEventImpact(n: RiskEvent): void {
  // Step 1.1: The direct impact of R_S is obtained by selecting a value
  //           for each damage indicator as follows
  calculateDirectImpact(n);

  // Step 1.2: Aggregated impacts may be obtained:
  n.directImpact = aggregateImpacts(n.directImpact);

  // Step 1.2: Recursively apply step 1 for all first-order effect
  //           scenarios Q_y in the event graph of R_S

  // Step 1.1b: the direct impact of said risk scenario is obtained by
  //            selecting a value for each damage indicator as follows
  for (const triggeredEvent of n.triggeredEvents) {
    calculateTotalEventImpact(triggeredEvent);

    // Step 1.3: The total impact of n can then be calculated by summing
    //           the direct impacts of R_S and the total impact of each
    //           first-order effect Q_y:
    n.totalImpact = addImpact(n.totalImpact, triggeredEvent.totalImpact);
  }

  // Step 1.3: The total impact of n can then be calculated by summing
  //           the direct impacts of R_S and the total impact of each
  //           first-order effect Q_y:
  n.totalImpact = addImpact(n.directImpact, n.totalImpact);
}

// Step 1.1: For each risk scenario Q_y in the event graph, the direct impact
//           of said risk scenario is obtained by selecting a value of each
//           damage indicator as follows
function calculateDirectImpact(event: RiskEvent): void {
  if (!event.risk.directImpact) {
    event.directImpact = { ...noAggregatedImpacts };
  } else {
    for (const indicator of Object.keys(
      event.risk.directImpact.considerable,
    ) as (keyof Impact)[]) {
      if (event.risk.directImpact[event.scenario][indicator] <= 0) {
        event.directImpact[indicator] = 0;
        continue;
      }

      // Step 1.1.1: Given the estimation of the direct impact I_(x,direct),
      //             a value is drawn V ~ Normal(x,1), giving an observed
      //             impact of I_(V,direct).
      const estimation = iScale7FromEuros(
        event.risk.directImpact[event.scenario][indicator],
      );

      const v = gaussianRandom(0, 0.255);
      const observedImpact = Math.max(0, estimation + v);

      // Step 1.1.2: The absolute impact of the event for indicator I is
      //             calculated in monetary terms by equivalence to the
      //             indicator Fa:
      const observedEurosImpact = eurosFromIScale7(observedImpact);

      event.directImpact[indicator] = observedEurosImpact;
    }
  }
}

// Step 2: Some well-known statistics may then be obtained from the
//         full sample.
function getSampleStatistics(events: RiskEvent[]): {
  sampleMedian: AggregatedImpacts;
  sampleMean: AggregatedImpacts;
  sampleStd: AggregatedImpacts;
  sampleMeanStd: AggregatedImpacts;
} {
  // Step 2.1: The median value is used for each impact indicator to
  //           reduce the effect of outliers.
  const sampleMedian = roundImpact(getSampleMedian(events), 0);
  const sampleMean = roundImpact(getSampleMean(events), 0);

  return {
    sampleMedian: sampleMedian,
    sampleMean: sampleMean,
    // Step 2.2: The sample variance (and corresponding standard deviation)
    //           is given by
    sampleStd: roundImpact(getSampleStd(events, sampleMedian), 1),
    sampleMeanStd: roundImpact(getSampleStd(events, sampleMean), 1),
  };
}

// Step 2.1: The median value is used for each impact indicator to
//           reduce the effect of outliers.
function getSampleMedian(events: RiskEvent[]): AggregatedImpacts {
  const medianImpacts: AggregatedImpacts = { ...noAggregatedImpacts };

  for (const indicator of Object.keys(
    noAggregatedImpacts,
  ) as (keyof AggregatedImpacts)[]) {
    const impacts = events
      .map((e) => e.totalImpact[indicator])
      .sort((a, b) => a - b);

    const mid = Math.floor(impacts.length / 2);

    let median: number;
    if (impacts.length % 2 === 0) {
      median = (impacts[mid - 1] + impacts[mid]) / 2;
    } else {
      median = impacts[mid];
    }

    medianImpacts[indicator] = median;
  }

  return medianImpacts;
}

// Step 2.1: The median value is used for each impact indicator to
//           reduce the effect of outliers.
function getSampleMean(events: RiskEvent[]): AggregatedImpacts {
  return divideImpact(
    events.reduce((acc, e) => addImpact(acc, e.totalImpact), {
      ...noAggregatedImpacts,
    }),
    events.length,
  );
}

// Step 2.2: The sample variance (and corresponding standard deviation)
//           is given by
function getSampleStd(
  events: RiskEvent[],
  sampleMedian: AggregatedImpacts,
): AggregatedImpacts {
  const stdImpacts: AggregatedImpacts = { ...noAggregatedImpacts };

  for (const indicator of Object.keys(
    noAggregatedImpacts,
  ) as (keyof AggregatedImpacts)[]) {
    const variance =
      (1 / (events.length - 1)) *
      events.reduce((acc, e) => {
        return (
          acc + Math.pow(e.totalImpact[indicator] - sampleMedian[indicator], 2)
        );
      }, 0);

    stdImpacts[indicator] = Math.sqrt(variance);
  }

  return stdImpacts;
}

// Step 3: Given an event graph n of the risk scenario R_S, the relative
//         contributions of the direct impact and each first-order
//         cascading risk scenario to the total impact is calculated
//         as follows
function calculateAbsoluteImpactContributions(
  n: RiskEvent,
  allFirstOrderEffects: Record<string, RiskEvent>,
): void {
  // Step 3.1: The relative contribution of the direct impact is found using:
  n.impactContributions["direct"] =
    n.totalImpact.all <= 0 ? { ...noAggregatedImpacts } : n.directImpact;

  for (const effect of Object.values(allFirstOrderEffects)) {
    const firstOrderEffect = n.triggeredEvents.find(
      (tE) => tE.risk.id === effect.risk.id && tE.scenario === effect.scenario,
    );

    if (firstOrderEffect === undefined) continue;

    // Step 3.2: The relative contribution of a first-order cascading risk Q_y
    //           is found using:
    n.impactContributions[`${effect.risk.id}__${effect.scenario}`] =
      n.totalImpact.all <= 0
        ? { ...noAggregatedImpacts }
        : firstOrderEffect.totalImpact;
  }
}

function getAllFirstOrderEffects(
  events: RiskEvent[],
): Record<string, RiskEvent> {
  const firstOrderEffects: Record<string, RiskEvent> = {};

  for (const event of events) {
    for (const triggeredEvent of event.triggeredEvents) {
      firstOrderEffects[
        `${triggeredEvent.risk.id}__${triggeredEvent.scenario}`
      ] = triggeredEvent;
    }
  }

  return firstOrderEffects;
}

function getSampleMeanContribution(
  contributions: AggregatedImpacts[],
): AggregatedImpacts {
  if (contributions.length <= 0) return { ...noAggregatedImpacts };

  return divideImpact(
    contributions.reduce((acc, curr) => addImpact(acc, curr), {
      ...noAggregatedImpacts,
    }),
    contributions.length,
  );
}

function getSampleContributionVariance(
  contributions: AggregatedImpacts[],
  meanContribution: AggregatedImpacts,
): AggregatedImpacts {
  if (contributions.length <= 1) return { ...noAggregatedImpacts };

  const variance = divideImpact(
    contributions.reduce(
      (acc, curr) => {
        return addImpact(
          acc,
          powImpact(subtractImpacts(curr, meanContribution), 2),
        );
      },
      { ...noAggregatedImpacts },
    ),
    contributions.length - 1,
  );

  return variance;
}

function getImpactContributionStatistics(
  events: RiskEvent[],
  allFirstOrderEffects: Record<string, RiskEvent>,
): {
  relativeContributions: ImpactContributionStatistics[];
  effectProbabilities: EffectStatistics[];
} {
  const impactContributions: ImpactContributionStatistics[] = [];

  const meanImpact = divideImpact(
    events.reduce((acc, e) => addImpact(acc, e.totalImpact), {
      ...noAggregatedImpacts,
    }),
    events.length,
  );
  const varianceImpact = powImpact(getSampleStd(events, meanImpact), 2);

  const diAbsoluteContributions = events.map((e) => e.directImpact);
  const meanDIAbsoluteContribution = getSampleMeanContribution(
    diAbsoluteContributions,
  );
  const meanDIContribution = divideImpacts(
    meanDIAbsoluteContribution,
    meanImpact,
  );

  const varDIAbsoluteContribution = getSampleContributionVariance(
    diAbsoluteContributions,
    meanDIAbsoluteContribution,
  );
  const stdDIContribution = powImpact(
    divideImpacts(varDIAbsoluteContribution, varianceImpact),
    1 / 2,
  );

  impactContributions.push({
    id: null,
    risk: "Direct Impact",
    scenario: null,
    contributionMean: roundImpact(meanDIContribution, 4),
    contributionStd: roundImpact(stdDIContribution, 4),
    contribution95Error: roundImpact(
      events.length <= 0
        ? { ...noAggregatedImpacts }
        : multiplyImpact(
            divideImpact(stdDIContribution, Math.sqrt(events.length)),
            1.96,
          ),
      4,
    ),
  });

  for (const firstOrderEffect of Object.values(allFirstOrderEffects)) {
    const contributions = events.map(
      (e) =>
        e.impactContributions[
          `${firstOrderEffect.risk.id}__${firstOrderEffect.scenario}`
        ] || noAggregatedImpacts,
    );

    // Calculate the mean of the relative contributions
    const meanAbsoluteContribution = getSampleMeanContribution(contributions);
    const meanContribution = divideImpacts(
      meanAbsoluteContribution,
      meanImpact,
    );

    const varAbsoluteContributions = getSampleContributionVariance(
      contributions,
      meanAbsoluteContribution,
    );
    const stdContributions = powImpact(
      divideImpacts(varAbsoluteContributions, varianceImpact),
      1 / 2,
    );

    const error95Contribution =
      events.length <= 0
        ? { ...noAggregatedImpacts }
        : multiplyImpact(
            divideImpact(stdContributions, Math.sqrt(events.length)),
            1.96,
          );

    impactContributions.push({
      id: firstOrderEffect.risk.id,
      risk: firstOrderEffect.risk.name,
      scenario: firstOrderEffect.scenario,
      contributionMean: roundImpact(meanContribution, 4),
      contributionStd: roundImpact(stdContributions, 4),
      contribution95Error: roundImpact(error95Contribution, 4),
    });
  }

  const firstOrderEffectCounts: Record<string, [RiskEvent, number]> = {};

  for (const rootEvent of events) {
    for (const firstOrderEffect of rootEvent.triggeredEvents) {
      if (
        !firstOrderEffectCounts[
          `${firstOrderEffect.risk.id}__${firstOrderEffect.scenario}`
        ]
      ) {
        firstOrderEffectCounts[
          `${firstOrderEffect.risk.id}__${firstOrderEffect.scenario}`
        ] = [firstOrderEffect, 0];
      }
      firstOrderEffectCounts[
        `${firstOrderEffect.risk.id}__${firstOrderEffect.scenario}`
      ][1] += 1;
    }
  }
  const totalEffectCount = Object.values(firstOrderEffectCounts).reduce(
    (a, b) => a + b[1],
    0,
  );

  return {
    relativeContributions: impactContributions,
    effectProbabilities: Object.values(firstOrderEffectCounts).map(
      ([effect, count]) => ({
        id: effect.risk.id,
        risk: effect.risk.name,
        scenario: effect.scenario,
        probabilityMean: round(count / totalEffectCount, 4),
        probabilityStd: 0,
        probability95Error: 0,
      }),
    ),
  };
}

// Standard Normal variate using Box-Muller transform.
export function gaussianRandom(mean = 0, stdev = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

export function normalPDF(x: number, mean: number, std: number): number {
  const m = std * Math.sqrt(2 * Math.PI);
  const e = Math.exp(-((x - mean) ** 2) / (2 * Math.pow(std, 2)));

  return e / m;
}

export function getImpactHistogram(
  impacts: AggregatedImpacts[],
  indicator: keyof AggregatedImpacts,
  binWidth: number = 0.5,
  maxScale: number = 8,
): HistogramBinData[] {
  const bins = Math.ceil(maxScale / binWidth) + 1;

  const data = new Array(bins).fill(null).map((_, i) => ({
    x: i / 2,
    name: `TI${i / 2}`,
    count: 0,
    p: 0,
    error: 0,
    min: i <= 0 ? 0 : eurosFromIScale7(i / 2 - binWidth / 2),
    max: i >= bins - 1 ? Infinity : eurosFromIScale7(i / 2 + binWidth / 2),
  }));

  impacts.forEach((impact) => {
    for (const bin of data) {
      if (impact[indicator] >= bin.min && impact[indicator] < bin.max) {
        bin.count += 1;
        bin.p += 1 / impacts.length;
        break;
      }
    }
  });

  return data.map((d) => ({
    x: d.x,
    name: d.name,
    count: d.count,
    p: round(d.p, 4),
    min: d.min,
    max: d.max,
    stdError: round(Math.sqrt(d.count) / (impacts.length * binWidth), 4),
  }));
}

export function getIndicatorBoxplots(
  impacts: AggregatedImpacts[],
): BoxPlotData[] {
  return (["all", ...Object.keys(noImpact)] as (keyof AggregatedImpacts)[]).map(
    (indicator) => {
      const sortedImpacts = impacts
        .map((a) => a[indicator])
        .sort((a, b) => a - b);

      const min = iScale7FromEuros(sortedImpacts[0], undefined, 10);
      const lowerQuartile = iScale7FromEuros(
        sortedImpacts[Math.round(0.25 * sortedImpacts.length)],
        undefined,
        10,
      );
      const median = iScale7FromEuros(
        sortedImpacts[Math.round(0.5 * sortedImpacts.length)],
        undefined,
        10,
      );
      const upperQuartile = iScale7FromEuros(
        sortedImpacts[Math.round(0.75 * sortedImpacts.length)],
        undefined,
        10,
      );
      const max = iScale7FromEuros(
        sortedImpacts[sortedImpacts.length - 1],
        undefined,
        10,
      );

      return {
        name: indicator,
        raw: {
          min: round(min, 2),
          lowerQuartile: round(lowerQuartile, 2),
          median: round(median, 2),
          upperQuartile: round(upperQuartile, 2),
          max: round(max, 2),
        },
        min: round(min, 2),
        bottomWhisker: round(lowerQuartile - min, 2),
        bottomBox: round(median - lowerQuartile, 2),
        topBox: round(upperQuartile - median, 2),
        topWhisker: round(max - upperQuartile, 2),
      };
    },
  );
}
