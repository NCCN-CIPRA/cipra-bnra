import { eurosFromIScale7, iScale7FromEuros } from "../indicators/impact";
import {
  AggregatedImpacts,
  AggregatedRiskEvent,
  noImpact,
  RiskCascade,
  RiskEvent,
  RiskScenarioSimulationOutput,
  RootNode,
  Scenario,
} from "./types";

export function getMedianImpact(
  impacts: AggregatedImpacts[],
  indicator: keyof AggregatedImpacts
) {
  const sorted = impacts.map((i) => i[indicator]).sort((a, b) => b - a);

  return sorted[Math.round(sorted.length / 2)];
}

export type HistogramBinData = {
  name: string;
  count: number;
  p: number;
  min: number;
  max: number;
  stdError: number;
};

export function getImpactHistogram(
  impacts: AggregatedImpacts[],
  indicator: keyof AggregatedImpacts,
  binWidth: number = 0.5,
  maxScale: number = 8
): HistogramBinData[] {
  const bins = Math.ceil(maxScale / binWidth) + 1;

  const data = new Array(bins).fill(null).map((_, i) => ({
    name: `TI${i / 2}`,
    count: 0,
    p: 0,
    error: 0,
    min: i <= 0 ? 0 : eurosFromIScale7(i / 2 - binWidth),
    max: i >= bins - 1 ? Infinity : eurosFromIScale7(i / 2 + binWidth),
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
    name: d.name,
    count: d.count,
    p: Math.round(1000 * d.p) / 1000,
    min: d.min,
    max: d.max,
    stdError: Math.sqrt(d.count) / (impacts.length * binWidth),
  }));
}

export type BoxPlotData = {
  name: keyof AggregatedImpacts;
  raw: {
    min: number;
    lowerQuartile: number;
    median: number;
    upperQuartile: number;
    max: number;
  };
  min: number;
  bottomWhisker: number;
  bottomBox: number;
  topBox: number;
  topWhisker: number;
};

export function getIndicatorBoxplots(
  impacts: AggregatedImpacts[]
): BoxPlotData[] {
  return (["all", ...Object.keys(noImpact)] as (keyof AggregatedImpacts)[]).map(
    (indicator) => {
      const sortedImpacts = impacts
        .map((a) => a[indicator])
        .sort((a, b) => a - b);

      const min = iScale7FromEuros(sortedImpacts[0]);
      const lowerQuartile = iScale7FromEuros(
        sortedImpacts[Math.round(0.25 * sortedImpacts.length)]
      );
      const median = iScale7FromEuros(
        sortedImpacts[Math.round(0.5 * sortedImpacts.length)]
      );
      const upperQuartile = iScale7FromEuros(
        sortedImpacts[Math.round(0.75 * sortedImpacts.length)]
      );
      const max = iScale7FromEuros(sortedImpacts[sortedImpacts.length - 1]);

      return {
        name: indicator,
        raw: {
          min,
          lowerQuartile,
          median,
          upperQuartile,
          max,
        },
        min,
        bottomWhisker: lowerQuartile - min,
        bottomBox: median - lowerQuartile,
        topBox: upperQuartile - median,
        topWhisker: max - upperQuartile,
      };
    }
  );
}

export type CascadeContributionData = {
  name: string;
  scenario: Scenario | null;
  averageImpactContribution: number;
  stdError: number[];
};

export function getCascadeContributions(
  totalRuns: number,
  directImpact: AggregatedImpacts,
  triggeredEvents: AggregatedRiskEvent[],
  indicator: keyof AggregatedImpacts,
  paretoCutoff: number = 0.8
): CascadeContributionData[] {
  const effectsWithDI = [
    {
      name: "Direct Impact",
      scenario: null,
      expectedImpact: directImpact[indicator],
      std: 0,
    },
    ...triggeredEvents.map((event) => {
      const triggerProbability = event.impacts.length / totalRuns;
      const conditionalMean =
        event.impacts.reduce((sum, i) => sum + i[indicator], 0) /
        event.impacts.length;
      const expectedImpact = triggerProbability * conditionalMean;

      const sampleMean =
        event.impacts.reduce((sum, i) => sum + i[indicator], 0) / totalRuns;
      const standardError = Math.sqrt(
        [
          ...new Array(totalRuns - event.impacts.length).fill(0),
          ...event.impacts.map((impact) => impact[indicator]),
        ].reduce(
          (sum, i) => sum + Math.pow(i - sampleMean, 2) / (totalRuns - 1),
          0
        )
      );

      return {
        name: event.name,
        scenario: event.scenario,
        expectedImpact,
        std: standardError,
      };
    }),
  ];

  const totalExpectedImpact = effectsWithDI.reduce(
    (sum, i) => sum + i.expectedImpact,
    0
  );

  const data = effectsWithDI
    .map((i) => ({
      name: i.name,
      scenario: i.scenario,
      averageImpactContribution: i.expectedImpact / totalExpectedImpact,
      stdError: [
        (0.675 * i.std) / Math.sqrt(totalRuns) / totalExpectedImpact,
        (0.675 * i.std) / Math.sqrt(totalRuns) / totalExpectedImpact,
      ],
    }))
    .sort((a, b) => b.averageImpactContribution - a.averageImpactContribution);

  return data.reduce((pareto, d) => {
    if (
      pareto.reduce((t, di) => t + di.averageImpactContribution, 0) >
      paretoCutoff
    )
      return pareto;

    return [...pareto, d];
  }, [] as typeof data);
}

export type CascadeCountData = {
  id: string;
  name: string;
  scenario: Scenario;
  count: number;
  p: number;
};

export type CascadeEffectCount = Record<
  string,
  Partial<Record<Scenario, CascadeCountData>>
>;

export function getCascadeEffectCounts(
  events: RiskEvent[]
): CascadeCountData[] {
  const counts: CascadeEffectCount = {};

  for (const event of events) {
    walkEventTree(event, counts);
  }

  return Object.values(counts)
    .reduce(
      (all, scenarios) => [
        ...all,
        ...Object.values(scenarios).reduce(
          (allScenarios, scenario) => [
            ...allScenarios,
            {
              ...scenario,
              p: scenario.count / events.length,
            },
          ],
          [] as CascadeCountData[]
        ),
      ],
      [] as CascadeCountData[]
    )
    .sort((a, b) => b.count - a.count);
}

function walkEventTree(event: RiskEvent, counts: CascadeEffectCount) {
  if (!counts[event.risk.id]) {
    counts[event.risk.id] = {};
  }

  if (!counts[event.risk.id][event.scenario]) {
    counts[event.risk.id][event.scenario] = {
      id: event.risk.id,
      name: event.risk.name,
      scenario: event.scenario,
      count: 0,
      p: 0,
    };
  }

  counts[event.risk.id][event.scenario]!.count += 1;

  for (const triggeredEvent of event.triggeredEvents) {
    walkEventTree(triggeredEvent, counts);
  }
}

export function getTotalProbability(
  rootCascade: RiskCascade,
  effectScenario: Scenario,
  rootNode: RootNode,
  outputs: RiskScenarioSimulationOutput[]
): number {
  return outputs.reduce((totalP, output) => {
    const cascade = output.cascadeCounts.find(
      (c) => c.id === rootCascade.effect.id && c.scenario === effectScenario
    );

    const rootCause = rootNode.risks.find((c) => c.effect.id === output.id);

    if (!cascade || !rootCause) return totalP;

    return (totalP += cascade.p * rootCause.probabilities[output.scenario]);
  }, 0);
}
