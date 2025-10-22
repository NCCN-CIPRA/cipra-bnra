import { iScale7FromEuros } from "../indicators/impact";
import { SCENARIOS } from "../scenarios";
import { addImpact, aggregateImpacts } from "./math";
import {
  AverageRiskEvent,
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

// function updateImpactValues(
//   mean: AggregatedImpacts,
//   M2: AggregatedImpacts,
//   count: number,
//   newValue: AggregatedImpacts
// ) {
//   for (const field of Object.keys(mean) as (keyof AggregatedImpacts)[]) {
//     const delta = newValue[field] - mean[field];
//     mean[field] += delta / count;

//     const delta2 = newValue[field] - mean[field];
//     M2[field] += delta * delta2;
//   }
// }

function addEventToAverages(event: RiskEvent, averages: AverageRiskEvent) {
  averages.probability += 1;
  averages.totalImpact = addImpact(averages.totalImpact, event.totalImpact);

  for (const triggeredEvent of event.triggeredEvents) {
    let existingEffect: AverageRiskEvent | undefined =
      averages.triggeredEvents.find(
        (e) =>
          e.risk.id === triggeredEvent.risk.id &&
          e.scenario === triggeredEvent.scenario
      );

    if (!existingEffect) {
      existingEffect = {
        risk: { id: triggeredEvent.risk.id, name: triggeredEvent.risk.name },
        scenario: triggeredEvent.scenario,
        triggeredEvents: [],
        probability: 0,
        totalImpact: { ...noImpact },
        allImpacts: [],
      };
      averages.triggeredEvents.push(existingEffect);
    }
    existingEffect.allImpacts.push(aggregateImpacts(event.totalImpact));

    addEventToAverages(triggeredEvent, existingEffect);
  }
}

export function runPerRiskSimulations(
  input: SimulationInput,
  onProgress: (m: string, i?: number) => void
): SimulationOutput {
  const runs = [] as SimulationRun[];
  const cvs = [] as number[];
  const counts = [] as number[];
  const means = [] as number[];

  const averageRisks: Record<string, Record<SCENARIOS, AverageRiskEvent>> = {};

  for (let i = 0; i < input.rootNode.risks.length; i++) {
    const risk = input.rootNode.risks[i];

    if (
      input.options.filterRiskFileIds &&
      input.options.filterRiskFileIds.indexOf(risk.effect.id) < 0
    )
      continue;

    const averageEvents = [
      SCENARIOS.CONSIDERABLE,
      SCENARIOS.MAJOR,
      SCENARIOS.EXTREME,
    ]
      .filter(
        (s) =>
          !input.options.filterScenarios ||
          input.options.filterScenarios.indexOf(s) >= 0
      )
      .reduce((acc, scenario) => {
        // const impacts = [] as AggregatedImpacts[];

        const averageEvent: AverageRiskEvent = {
          risk: { id: risk.effect.id, name: risk.effect.name },
          scenario,
          triggeredEvents: [],
          probability: 0,
          totalImpact: { ...noImpact },
          allImpacts: [],
        };

        // onProgress(`Starting risk ${i + 1}`);
        let count = 0;
        // const M2 = { ...noAggregatedImpacts };
        let mean = 0;
        let M2 = 0;

        let cv = -1;
        while (count < input.options.maxRuns) {
          count += 1;

          // const effectScenario = checkEffectTriggered(risk, null, false);

          if (scenario) {
            const event = triggerRiskEvent(risk.effect, scenario, null);
            addEventToAverages(event, averageEvent);
            // runs.push(event);

            // updateImpactValues(
            //   mean,
            //   M2,
            //   count,
            //   aggregateImpacts(event.totalImpact)
            // );
            const aggregatedImpact = aggregateImpacts(event.totalImpact).all;
            const logImpact =
              aggregatedImpact > 0 ? iScale7FromEuros(aggregatedImpact) : 0;
            const delta = logImpact - mean;
            mean += delta / count;
            const delta2 = logImpact - mean;
            M2 += delta * delta2;

            const variance = M2 / (count - 1);
            const std = Math.sqrt(variance);
            cv = std; // Math.abs(mean);

            averageEvent.allImpacts.push(aggregateImpacts(event.totalImpact));

            if (count > input.options.minRuns && cv < input.options.relStd) {
              break;
            }
            // onProgress(`Run ${count} - ${cv}`, count);

            // if (
            //   count > 10 &&
            //   Object.values(M2).every((m2) => m2 / (count - 1) < MAX_STD)
            // ) {
            //   let stdMax = 0;
            //   let fieldMax = "ha";
            //   for (const e of Object.entries(M2)) {
            //     const std = e[1] / (count - 1);
            //     if (std > stdMax) {
            //       stdMax = std;
            //       fieldMax = e[0];
            //     }
            //   }
            //   onProgress(
            //     `${risk.effect.name} reached sigma ${
            //       Math.round(10000 * stdMax) / 10000
            //     } after ${count} runs (worst field was ${fieldMax}).`
            //   );
            //   break;
            // } else {
            // onProgress(`Run ${count} - ${M2.all / mean.all}`);
            // }
          }
        }

        cvs.push(cv);
        counts.push(count);
        means.push(mean);

        onProgress(`Finished risk ${scenario} ${risk.effect.name}:`);
        onProgress(
          `    logMean = ${mean}, error = ±${
            Math.round(100 * cv) / 100
          }, simulations = ${count}`
        );
        // onProgress(`Finished risk ${i + 1} with ${count} runs`);

        // if (count >= MAX_RUNS) {
        //   let stdMax = 0;
        //   let fieldMax = "ha";
        //   for (const e of Object.entries(M2)) {
        //     const std = e[1] / (count - 1);
        //     if (std > stdMax) {
        //       stdMax = std;
        //       fieldMax = e[0];
        //     }
        //   }
        //   onProgress(
        //     `${
        //       risk.effect.name
        //     } did not converge. Worst field was ${fieldMax} with sigma ${
        //       Math.round(10000 * stdMax) / 10000
        //     }.`
        //   );
        // }

        return {
          ...acc,
          [scenario]: averageEvent,
        };
      }, {} as Record<SCENARIOS, AverageRiskEvent>);

    averageRisks[risk.effect.id] = averageEvents;

    // break;
  }

  console.log(averageRisks);

  return {
    runs,
    other: { averageRisks },
  };
}

export default function runSimulation() {
  // input: SimulationInput,
  // onFinishRun?: (runIndex: number) => void
  // ): SimulationOutput {
  // const output: SimulationOutput = { runs: [] };
  // const statistics = {
  //   logMeans: [] as AggregatedImpacts[],
  //   meanVar: [] as AggregatedImpacts[],
  //   logMedian: [] as AggregatedImpacts[],
  //   medianVar: [] as AggregatedImpacts[],
  // };
  // // For each possible root risk, simulate days until "input.numberOfSimulation" events of the
  // // risk have happened
  // for (let i = 0; i < input.rootNode.risks.length; i += 1) {
  //   const cascade = input.rootNode.risks[i];
  //   const riskRun = {
  //     events: [],
  //     totalImpact: { ...noAggregatedImpacts },
  //     days: 0,
  //   };
  //   while (
  //     riskRun.events.length < input.numberOfSimulations &&
  //     riskRun.days < input.maxDays
  //   ) {
  //     const effectScenario = checkEffectTriggered(cascade, null);
  //     if (effectScenario) {
  //       const event = triggerRiskEvent(cascade.effect, effectScenario, null);
  //       riskRun.events.push(event);
  //       riskRun.totalImpact = addImpact(riskRun.totalImpact, event.totalImpact);
  //     }
  //     riskRun.days += 1;
  //   }
  //   output.runs.push(riskRun);
  //   onFinishRun?.(i + 1);
  //   break;
  // }
  // for (let runIndex = 0; runIndex < input.numberOfSimulations; runIndex++) {
  //   const run: SimulationRun = { events: [], totalImpact: { ...noImpact } };
  //   for (let day = 0; day < 365; day++) {
  //     // Simulate events for each day
  //     debug(`Day ${day} of run ${runIndex}`);
  //     for (const cascade of input.rootNode.risks) {
  //       const effectScenario = checkEffectTriggered(cascade, null);
  //       if (effectScenario) {
  //         debug("Trigger root event", cascade.effect.name, effectScenario);
  //         const event = triggerRiskEvent(cascade.effect, effectScenario, null);
  //         run.totalImpact = addImpact(run.totalImpact, event.totalImpact);
  //         run.events.push(event);
  //       }
  //     }
  //     for (const actor of input.rootNode.actors) {
  //       for (const attack of actor.attacks) {
  //         const effectScenario = checkEffectTriggered(attack, null);
  //         if (effectScenario) {
  //           debug(
  //             "Trigger attack event",
  //             "name" in attack.cause ? attack.cause.name : "",
  //             attack.effect.name,
  //             effectScenario
  //           );
  //           const actorEvent: RiskEvent = {
  //             risk: actor,
  //             scenario: attack.causeScenario as Scenario,
  //             source: null,
  //             triggeredEvents: [],
  //             totalImpact: { ...noImpact },
  //           };
  //           const attackEvent = triggerRiskEvent(
  //             attack.effect,
  //             effectScenario,
  //             actorEvent
  //           );
  //           actorEvent.totalImpact = attackEvent.totalImpact;
  //           actorEvent.triggeredEvents.push(attackEvent);
  //           run.totalImpact = addImpact(
  //             run.totalImpact,
  //             actorEvent.totalImpact
  //           );
  //           run.events.push(actorEvent);
  //         }
  //       }
  //     }
  //     onFinishRun?.(runIndex);
  //   }
  //   output.runs.push(run);
  // }
  // return output;
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
