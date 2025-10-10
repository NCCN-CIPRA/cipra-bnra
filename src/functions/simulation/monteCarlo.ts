import { addImpact } from "./math";
import {
  noImpact,
  Risk,
  RiskCascade,
  RiskEvent,
  Scenario,
  SimulationInput,
  SimulationOutput,
  SimulationRun,
} from "./types";

const INFO_OPS = "9458db5b-aa6c-ed11-9561-000d3adf7089";

const DEBUG = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debug = (...log: any[]) => {
  if (DEBUG) {
    console.log(...log);
  }
};

export default function runSimulation(
  input: SimulationInput,
  onFinishRun?: (runIndex: number) => void
): SimulationOutput {
  const output: SimulationOutput = { runs: [] };

  for (let runIndex = 0; runIndex < input.numberOfSimulations; runIndex++) {
    const run: SimulationRun = { events: [], totalImpact: { ...noImpact } };

    for (let day = 0; day < 365; day++) {
      // Simulate events for each day
      debug(`Day ${day} of run ${runIndex}`);
      for (const cascade of input.rootNode.risks) {
        const effectScenario = checkEffectTriggered(cascade, null);
        if (effectScenario) {
          debug("Trigger root event", cascade.effect.name, effectScenario);
          const event = triggerRiskEvent(cascade.effect, effectScenario, null);
          run.totalImpact = addImpact(run.totalImpact, event.totalImpact);
          run.events.push(event);
        }
      }
      for (const actor of input.rootNode.actors) {
        for (const attack of actor.attacks) {
          const effectScenario = checkEffectTriggered(attack, null);
          if (effectScenario) {
            debug(
              "Trigger attack event",
              "name" in attack.cause ? attack.cause.name : "",
              attack.effect.name,
              effectScenario
            );
            const actorEvent: RiskEvent = {
              risk: actor,
              scenario: attack.causeScenario as Scenario,
              source: null,
              triggeredEvents: [],
              totalImpact: { ...noImpact },
            };
            const attackEvent = triggerRiskEvent(
              attack.effect,
              effectScenario,
              actorEvent
            );
            actorEvent.totalImpact = attackEvent.totalImpact;
            actorEvent.triggeredEvents.push(attackEvent);

            run.totalImpact = addImpact(
              run.totalImpact,
              actorEvent.totalImpact
            );
            run.events.push(actorEvent);
          }
        }
      }
      onFinishRun?.(runIndex);
    }

    output.runs.push(run);
  }

  return output;
}

function checkEffectTriggered(
  cascade: RiskCascade,
  source: RiskEvent | null
): Scenario | null {
  if (source && hasBeenTriggered(cascade.effect, source)) {
    return null;
  }

  let i = Math.random();
  if (i < cascade.probabilities.extreme) {
    debug(
      "Trigger Extreme",
      cascade.effect.name,
      cascade,
      i,
      cascade.probabilities.extreme
    );
    return "extreme";
  }
  i = Math.random();
  if (i < cascade.probabilities.major) {
    debug(
      "Trigger Major",
      cascade.effect.name,
      cascade,
      i,
      cascade.probabilities.major
    );
    return "major";
  }
  i = Math.random();
  if (i < cascade.probabilities.considerable) {
    debug(
      "Trigger Considerable",
      cascade.effect.name,
      cascade,
      i,
      cascade.probabilities.considerable
    );
    return "considerable";
  }

  return null;
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
