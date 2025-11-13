import { SCENARIOS } from "../scenarios";
import { addImpact, aggregateImpacts } from "./math";
import {
  getCascadeContributions,
  getCascadeEffectCounts,
  getRootCauses,
  getImpactHistogram,
  getIndicatorBoxplots,
  getMedianImpact,
  getTotalProbability,
  getFirstOrderCauses,
} from "./statistics";
import {
  AggregatedRiskEvent,
  Risk,
  RiskCascade,
  RiskEvent,
  RiskScenarioSimulationOutput,
  Scenario,
  SimulationInput,
  SimulationOutput,
} from "./types";

const INFO_OPS = "9458db5b-aa6c-ed11-9561-000d3adf7089";

const DEBUG = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debug = (...log: any[]) => {
  if (DEBUG) {
    console.log(...log);
  }
};

export function aggregateFirstOrderCascades(events: RiskEvent[]) {
  const knownCascades: AggregatedRiskEvent[] = [];

  for (const event of events) {
    for (const cascade of event.triggeredEvents) {
      let existingCascade = knownCascades.find(
        (c) => c.id === cascade.risk.id && c.scenario === cascade.scenario
      );

      if (!existingCascade) {
        existingCascade = {
          id: cascade.risk.id,
          name: cascade.risk.name,
          scenario: cascade.scenario,
          impacts: [],
        };

        knownCascades.push(existingCascade);
      }

      existingCascade.impacts.push(aggregateImpacts(cascade.totalImpact));
    }
  }

  return knownCascades;
}

export function simulateRiskScenario(
  risk: Risk,
  scenario: SCENARIOS,
  runs: number
): RiskScenarioSimulationOutput {
  const events: RiskEvent[] = [];

  for (let count = 0; count < runs; count += 1) {
    const event = triggerRiskEvent(risk, scenario, null);
    events.push(event);
  }

  const aggregatedImpacts = events.map((e) => aggregateImpacts(e.totalImpact));

  return {
    id: risk.id,
    hazardId: risk.hazardId,
    name: risk.name,
    category: risk.category,
    scenario,
    medianImpact: getMedianImpact(aggregatedImpacts, "all"),
    totalProbability: 0,
    impact: getImpactHistogram(aggregatedImpacts, "all"),
    indicators: getIndicatorBoxplots(aggregatedImpacts),
    cascadeContributions: getCascadeContributions(
      runs,
      aggregateImpacts(risk.directImpact[scenario]),
      aggregateFirstOrderCascades(events),
      "all"
    ),
    cascadeCounts: getCascadeEffectCounts(events),
    rootCauses: [],
    firstOrderCauses: [],
  };
}

export function runSimulations(
  input: SimulationInput,
  onProgress: (m: string, i?: number) => void
): SimulationOutput {
  const risks: RiskScenarioSimulationOutput[] = [];

  for (let i = 0; i < input.rootNode.risks.length; i++) {
    const risk = input.rootNode.risks[i];

    [SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].forEach(
      (scenario) => {
        risks.push(
          simulateRiskScenario(risk.effect, scenario, input.options.maxRuns)
        );
        onProgress(`Finished risk ${scenario} ${risk.effect.name}:`);
      }
    );
  }

  for (const risk of risks) {
    const rootCascade = input.rootNode.risks.find(
      (c) => c.effect.id === risk.id
    );

    if (!rootCascade) continue;

    risk.totalProbability = getTotalProbability(
      rootCascade,
      risk.scenario,
      input.rootNode,
      risks
    );
    risk.rootCauses = getRootCauses(
      rootCascade.effect,
      risk.scenario,
      input.rootNode,
      risks
    );
    risk.firstOrderCauses = getFirstOrderCauses(
      rootCascade.effect,
      risk.scenario,
      input.rootNode,
      risks
    );
  }

  return {
    risks,
  };
}

function checkEffectTriggered(
  cascade: RiskCascade,
  source: RiskEvent | null,
  allowNone: boolean = true
): Scenario | null {
  // Don't trigger if the effect has already been trigger upstream the risk chain
  // TODO: check how often this happens. Shouldn't really happen as it is not realistic?
  if (source && hasBeenTriggered(cascade.effect, source)) {
    return null;
  }

  // Check if any cascade happens
  const pAny =
    1 -
    (1 - cascade.probabilities.considerable) *
      (1 - cascade.probabilities.major) *
      (1 - cascade.probabilities.extreme);

  if (allowNone && Math.random() >= pAny) return null;

  // Add all probabilities for normalization to 1
  const pTot =
    cascade.probabilities.considerable +
    cascade.probabilities.major +
    cascade.probabilities.extreme;

  const p = Math.random();

  // Select on of the cascades according to the normalized probabilities
  if (p < cascade.probabilities.extreme / pTot) {
    debug(
      "Trigger Extreme",
      cascade.effect.name,
      cascade,
      p,
      cascade.probabilities.extreme
    );
    return "extreme";
  } else if (p < cascade.probabilities.major / pTot) {
    debug(
      "Trigger Major",
      cascade.effect.name,
      cascade,
      p,
      cascade.probabilities.major
    );
    return "major";
  } else {
    debug(
      "Trigger Considerable",
      cascade.effect.name,
      cascade,
      p,
      cascade.probabilities.considerable
    );
    return "considerable";
  }
}

function hasBeenTriggered(risk: Risk, event: RiskEvent): boolean {
  let source: RiskEvent | null = event;
  while (source) {
    if (source.risk.id === risk.id) {
      return true;
    }
    source = source.source;
  }

  return false;
}

function triggerRiskEvent(
  risk: Risk,
  scenario: Scenario,
  source: RiskEvent | null,
  depth: number = 0
): RiskEvent {
  const event: RiskEvent = {
    risk,
    scenario,
    source,

    totalImpact: { ...risk.directImpact[scenario] },
    triggeredEvents: [],
  };

  if (risk.id === INFO_OPS) {
    return event;
  }

  if (depth > 50) {
    console.warn("Max cascade depth reached");
    console.log(event);
    throw new Error("Max cascade depth reached");
  }

  for (const cascade of risk.cascades) {
    if (cascade.causeScenario !== scenario) continue;

    const effectScenario = checkEffectTriggered(cascade, source);
    if (effectScenario) {
      const triggeredEvent = triggerRiskEvent(
        cascade.effect,
        effectScenario,
        event,
        depth + 1
      );
      event.totalImpact = addImpact(
        event.totalImpact,
        triggeredEvent.totalImpact
      );
      event.triggeredEvents.push(triggeredEvent);
    }
  }

  return event;
}
