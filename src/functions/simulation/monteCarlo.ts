// These functions implement the Monte Carlo simulation algorithm as described
// in the BNRA methodology document: Quantitative Model and Statistical Analysis
// under section Statistical Analysis - Technical Implementation - Monte Carlo Simulation

import { LogLevel } from "react-virtuoso";
import { SCENARIOS } from "../scenarios";
import getImpactStatistics from "./impactStatistics";
import {
  Diagnostics,
  noAggregatedImpacts,
  Risk,
  RiskCascade,
  RiskEvent,
  RiskScenarioSimulationOutput,
  Scenario,
  SimulationInput,
  SimulationOutput2,
} from "./types";
import {
  countYearlyEvents,
  getProbabilityStatistics,
} from "./probabilityStatistics";

export function runSimulations(
  input: SimulationInput,
  onProgress: (level: number, m: string, i?: number) => void,
): SimulationOutput2 {
  const risks: RiskScenarioSimulationOutput[] = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const riskFilter = (_id: string) => {
    return true;
  };

  const diagnostics: Diagnostics = {
    riskScenarios: 0,
    simulationTime: 0,
    probabilityStatistics: {
      total: 0,
      yearSimulation: 0,
      counting: 0,
      averageEvents: 0,
      perRiskEvent: {},
    },
    impactStatisticsTime: 0,
  };
  let t = Date.now();

  onProgress(LogLevel.INFO, `Starting probability analysis`);

  const sampleRiskScenarioCounts: Record<string, number>[] = [];
  const sampleCascadeCounts: Record<string, Record<string, number>>[] = [];
  const sampleRootCauseCounts: Record<string, Record<string, number>>[] = [];

  let lastProgressUpdate = 0;

  for (let run = 0; run < input.options.numYears; run++) {
    t = Date.now();

    onProgress(
      LogLevel.DEBUG,
      `Starting year ${run + 1} / ${input.options.numYears}:`,
    );

    const yearlyEvents = simulateYear(
      input.riskCatalogue,
      input.cascadeCatalogue,
      riskFilter,
    );

    diagnostics.probabilityStatistics.averageEvents += yearlyEvents.length;
    diagnostics.probabilityStatistics.yearSimulation += Date.now() - t;
    t = Date.now();

    countYearlyEvents(
      yearlyEvents,
      sampleRiskScenarioCounts,
      sampleCascadeCounts,
      sampleRootCauseCounts,
    );

    if (run - lastProgressUpdate > input.options.numYears / 100) {
      onProgress(LogLevel.INFO, "", (100 * (run + 1)) / input.options.numYears);
      lastProgressUpdate = run;
    }

    diagnostics.probabilityStatistics.counting += Date.now() - t;
    t = Date.now();
  }
  diagnostics.probabilityStatistics.total =
    diagnostics.probabilityStatistics.yearSimulation +
    diagnostics.probabilityStatistics.counting;
  diagnostics.probabilityStatistics.averageEvents /= input.options.numYears;

  onProgress(LogLevel.DEBUG, `Calculating probability statistics`);

  const probabilityStatistics = getProbabilityStatistics(
    sampleRiskScenarioCounts,
    sampleCascadeCounts,
    sampleRootCauseCounts,
    input.riskCatalogue,
  );

  onProgress(LogLevel.INFO, `Starting impact analysis`);

  let i = 0;
  lastProgressUpdate = 0;

  for (const risk of input.riskCatalogue) {
    if (!riskFilter(risk.id)) continue;

    risks.push(
      ...[SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR, SCENARIOS.EXTREME].map(
        (scenario) => {
          onProgress(LogLevel.DEBUG, `Starting risk ${scenario} ${risk.name}:`);

          diagnostics.riskScenarios += 1;
          t = Date.now();

          const events = simulateRiskScenario(
            risk,
            scenario,
            input.riskCatalogue,
            input.cascadeCatalogue,
            input.options.numEvents,
          );

          diagnostics.simulationTime += Date.now() - t;
          t = Date.now();

          onProgress(LogLevel.DEBUG, `Calculating impact statistics`);

          const impactStatistics = getImpactStatistics(events);
          if (Number.isNaN(impactStatistics.sampleMedian.all)) {
            console.log(risk, impactStatistics);
          }

          diagnostics.impactStatisticsTime += Date.now() - t;
          t = Date.now();

          onProgress(LogLevel.DEBUG, `Finished risk ${scenario} ${risk.name}:`);

          if (i - lastProgressUpdate > (3 * input.riskCatalogue.length) / 100) {
            onProgress(
              LogLevel.INFO,
              "",
              (100 * (i + 1)) / (3 * input.riskCatalogue.length),
            );
            lastProgressUpdate = i;
          }
          i++;

          return {
            id: risk.id,
            name: risk.name,
            hazardId: risk.hazardId,
            category: risk.category,
            scenario,
            probabilityStatistics: probabilityStatistics[risk.id]?.[scenario],
            impactStatistics,
          };
        },
      ),
    );
  }

  diagnostics.simulationTime /= diagnostics.riskScenarios;
  diagnostics.impactStatisticsTime /= diagnostics.riskScenarios;

  onProgress(LogLevel.INFO, `Diagnostics: ${JSON.stringify(diagnostics)}`);

  return {
    risks,
  };
}

function simulateYear(
  riskCatalogue: Risk[],
  cascadeCatalogue: Record<string, RiskCascade>,
  filter: (id: string) => boolean,
): RiskEvent[] {
  const events: RiskEvent[] = [];

  for (let day = 0; day < 365; day++) {
    events.push(...simulateDay(riskCatalogue, cascadeCatalogue, filter));
  }

  return events;
}

function simulateDay(
  riskCatalogue: Risk[],
  cascadeCatalogue: Record<string, RiskCascade>,
  filter: (id: string) => boolean,
): RiskEvent[] {
  const rootEvents: RiskEvent[] = [];

  // Step 1: 	For each risk R in the risk catalogue, the following procedure is applied:
  for (const riskQ of riskCatalogue) {
    if (!filter(riskQ.id)) continue;
    // Find the cascade (if it exists) from null to Q
    const cascade = cascadeCatalogue[`${null}__${null}__${riskQ.id}`];

    if (!cascade) {
      console.error("Root cascade not found", riskQ);
    }

    // Step 1.1: The overall probability of any scenario occurring is calculated:
    const pAny =
      1 -
      (1 - cascade.probabilities.considerable) *
        (1 - cascade.probabilities.major) *
        (1 - cascade.probabilities.extreme);

    // Step 1.2: Draw a random variable U ~ Uniform(0,1). Continue only if U > pAny.
    const u = Math.random();
    if (u > pAny) continue;

    // Step 1.3: All probabilities are normalized
    const pTot =
      cascade.probabilities.considerable +
      cascade.probabilities.major +
      cascade.probabilities.extreme;
    const pS_c_norm = cascade.probabilities.considerable / pTot;
    const pS_m_norm = cascade.probabilities.major / pTot;
    // Calculation of this value is not necessary for the calculations, but added for completeness
    // const pS_e_norm = cascade.probabilities.extreme / pTot;

    // Step 1.4: An risk scenario is selected by sampling from the categorical distribution
    //           obtained from the normalized conditional probabilities above with a uniform
    //           random variable V ~ Uniform(0,1).
    const v = Math.random();
    let effectScenario: Scenario;
    if (v < pS_c_norm) {
      effectScenario = "considerable";
    } else if (v < pS_c_norm + pS_m_norm) {
      effectScenario = "major";
    } else {
      effectScenario = "extreme";
    }

    // Step 1.5: 	A zeroth-order event graph is constructed with the selected risk scenario R_S as a root node. This event graph is added to the array of event graphs for observation (year) n of the sample N.
    rootEvents.push(constructEventGraph(riskQ, effectScenario));
  }

  const dailyEvents = [];

  // Step 2: For each event graph with root node R_S in the array of event graphs of
  //         observation n, the following procedure is followed:
  for (const rootEvent of rootEvents) {
    const existingNodes: Risk[] = [rootEvent.risk];

    // Step 2.1: For each risk Q (!= R) in the risk catalogue, expand the event graph
    const firstOrderEffects = expandEventGraph(
      rootEvent,
      riskCatalogue,
      cascadeCatalogue,
      existingNodes,
    );

    // Step 2.2: For each node N_s added to the event graph in step 2.1.6, repeat step 2.1
    //         with N_s as the root node
    const nodesToProcess = [...firstOrderEffects];

    // Step 2.3: Repeat step 2.2 until no new nodes are added to the event graph
    while (nodesToProcess.length > 0) {
      const node = nodesToProcess.shift();

      if (!node) continue;

      const nthOrderEffects = expandEventGraph(
        node,
        riskCatalogue,
        cascadeCatalogue,
        existingNodes,
      );

      nodesToProcess.push(...nthOrderEffects);
    }

    if (rootEvent.risk.actor) {
      if (rootEvent.triggeredEvents.length > 0) {
        // Only add an actor event to the daily events if at least one attack was
        // succesfully executed this day.
        dailyEvents.push(rootEvent);
      }
    } else {
      dailyEvents.push(rootEvent);
    }
  }

  return dailyEvents;
}

export function simulateRiskScenario(
  risk: Risk,
  scenario: Scenario,
  riskCatalogue: Risk[],
  cascadeCatalogue: Record<string, RiskCascade>,
  runs: number,
): RiskEvent[] {
  const events: RiskEvent[] = [];

  for (let run = 0; run < runs; run++) {
    const existingNodes: Risk[] = [risk];

    // Step 1: A zeroth order event graph is constructed with R_s as a root node
    const rootNode = constructEventGraph(risk, scenario);

    let firstOrderEffects: RiskEvent[] = [];

    let i = 0;

    while (true) {
      i++;

      // Step 2: For each risk Q (!= R) in the risk catalogue, expand the event graph
      firstOrderEffects = expandEventGraph(
        rootNode,
        riskCatalogue,
        cascadeCatalogue,
        existingNodes,
      );

      // In case of actor risks, we are only interested in events that have resulted in a successfull
      // attack
      if (risk.actor) {
        if (firstOrderEffects.length > 0) {
          break;
        } else if (i >= 10000 && i % 10000 === 0) {
          console.log(i, risk, rootNode);
        }
      } else {
        break;
      }
    }

    // Step 3: For each node N_s added to the event graph in step 2, repeat step 2
    //         with N_s as the root node
    const nodesToProcess = [...firstOrderEffects];

    // Step 4: Repeat step 3 until no new nodes are added to the event graph
    while (nodesToProcess.length > 0) {
      const node = nodesToProcess.shift();

      if (!node) continue;

      const nthOrderEffects = expandEventGraph(
        node,
        riskCatalogue,
        cascadeCatalogue,
        existingNodes,
      );

      nodesToProcess.push(...nthOrderEffects);
    }

    events.push(rootNode);
  }

  return events;
}

// Step 1: A zeroth order event graph is constructed with R_s as a root node
export function constructEventGraph(risk: Risk, scenario: Scenario): RiskEvent {
  // Create a copy of the risk to avoid mutating the original
  const rootNode: RiskEvent = {
    risk,
    scenario,
    source: null,
    triggeredEvents: [],
    directImpact: { ...noAggregatedImpacts },
    totalImpact: { ...noAggregatedImpacts },
    impactContributions: {},
  };

  return rootNode;
}

// Step 2: For each risk Q (!= R) in the risk catalogue, expand the event graph
export function expandEventGraph(
  rootNode: RiskEvent,
  riskCatalogue: Risk[],
  cascadeCatalogue: Record<string, RiskCascade>,
  existingNodes: Risk[],
): RiskEvent[] {
  if (Object.keys(existingNodes).length > 100) {
    console.warn("More then 100 nodes in an event graph!");
    console.log("Existing nodes:", existingNodes);
    return [];
  }

  // Information Operations
  if (rootNode.risk.hazardId === "M13") {
    // Only allow effects of information operations if it is the true root
    // cause or if it is an actor attack
    if (rootNode.source !== null && !rootNode.source.risk.actor) {
      return [];
    }
  }

  for (const riskQ of riskCatalogue) {
    // Check if the risk is already in the event graph
    if (existingNodes.includes(riskQ)) {
      continue;
    }

    // Find the cascade (if it exists) from R_s to Q
    const cascade =
      cascadeCatalogue[
        `${rootNode.risk.id}__${rootNode.scenario}__${riskQ.id}`
      ];

    // Step 2.1: Only continue if there exists a conditional probability CP(R_s -> Q_{c|m|e}) > 0
    if (!cascade) continue;

    if (
      cascade.probabilities.considerable <= 0 &&
      cascade.probabilities.major <= 0 &&
      cascade.probabilities.extreme <= 0
    )
      continue;

    // Step 2.2: The overall probability of any effect scenario occurring is calculated:
    const pAny =
      1 -
      (1 - cascade.probabilities.considerable) *
        (1 - cascade.probabilities.major) *
        (1 - cascade.probabilities.extreme);

    // Step 2.3: Draw a random variable U ~ Uniform(0,1). Continue only if U > pAny.
    const u = Math.random();
    if (u > pAny) continue;

    // Step 2.4: All conditional probability are normalized
    const cpTot =
      cascade.probabilities.considerable +
      cascade.probabilities.major +
      cascade.probabilities.extreme;
    const cpS_c_norm = cascade.probabilities.considerable / cpTot;
    const cpS_m_norm = cascade.probabilities.major / cpTot;
    // Calculation of this value is not necessary for the calculations, but added for completeness
    // const cpS_e_norm = cascade.probabilities.extreme / cpTot;

    // Step 2.5: An effect scenario is selected by sampling from the categorical distribution
    //           obtained from the normalized conditional probabilities above with a uniform
    //           random variable V ~ Uniform(0,1).
    const v = Math.random();
    let effectScenario: Scenario;
    if (v < cpS_c_norm) {
      effectScenario = "considerable";
    } else if (v < cpS_c_norm + cpS_m_norm) {
      effectScenario = "major";
    } else {
      effectScenario = "extreme";
    }

    // Step 2.6: The selected effect scenario is added to the event graph linked to the root node
    const newEvent: RiskEvent = {
      risk: riskQ,
      scenario: effectScenario,
      source: rootNode,
      triggeredEvents: [],
      directImpact: { ...noAggregatedImpacts },
      totalImpact: { ...noAggregatedImpacts },
      impactContributions: {},
    };

    existingNodes.push(riskQ);

    rootNode.triggeredEvents.push(newEvent);
  }

  return rootNode.triggeredEvents;
}
