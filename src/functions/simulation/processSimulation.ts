import { getRiskCatalogue } from "../riskfiles";
import { addImpact, aggregateImpacts, divideImpact } from "./math";
import {
  AggregatedImpacts,
  noAggregatedImpacts,
  RiskEvent,
  SimulationData,
  SimulationOutput,
  UnknownRiskSnapshot,
} from "./types";

function walkEventTree(
  event: RiskEvent,
  data: SimulationData,
  runIndex: number,
  rc: ReturnType<typeof getRiskCatalogue>
) {
  if (!data[event.risk.id]) {
    data[event.risk.id] = {
      risk: rc[event.risk.id],
      occurrences: [],
      causes: [],
      averageImpact: { ...noAggregatedImpacts },
      effects: [],
    };
  }

  data[event.risk.id].occurrences.push({ event, runIndex });

  for (const triggeredEvent of event.triggeredEvents) {
    walkEventTree(triggeredEvent, data, runIndex, rc);
  }
}

export function processSimulation(
  simulation: SimulationOutput,
  rc: ReturnType<typeof getRiskCatalogue>
) {
  const simulationData: SimulationData = {};

  simulation.runs.forEach((run, runIndex) => {
    for (const event of run.events) {
      walkEventTree(event, simulationData, runIndex, rc);
    }
  });

  const datas = Object.values(simulationData);

  datas.forEach((s) => {
    const causes = s.occurrences.reduce((acc, occ) => {
      if (!acc[occ.event.source?.risk.id || "None"]) {
        acc[occ.event.source?.risk.id || "None"] = {
          risk: occ.event.source ? rc[occ.event.source.risk.id] : null,
          occurrences: [],
        };
      }
      acc[occ.event.source?.risk.id || "None"].occurrences.push(occ);
      return acc;
    }, {} as Record<string, { risk: UnknownRiskSnapshot | null; occurrences: { event: RiskEvent; runIndex: number }[] }>);

    s.causes = Object.values(causes).sort(
      (a, b) => b.occurrences.length - a.occurrences.length
    );

    s.averageImpact = divideImpact(
      s.occurrences.reduce(
        (acc, occ) => addImpact(acc, aggregateImpacts(occ.event.totalImpact)),
        { ...noAggregatedImpacts } as AggregatedImpacts
      ),
      s.occurrences.length
    );

    const effects = s.occurrences.reduce((acc, occ) => {
      for (const triggeredEvent of occ.event.triggeredEvents) {
        if (!acc[triggeredEvent.risk.id]) {
          acc[triggeredEvent.risk.id] = {
            risk: rc[triggeredEvent.risk.id],
            occurrences: [],
            averageImpact: { ...noAggregatedImpacts },
          };
        }

        acc[triggeredEvent.risk.id].occurrences.push(occ);
        acc[triggeredEvent.risk.id].averageImpact = addImpact(
          acc[triggeredEvent.risk.id].averageImpact,
          aggregateImpacts(triggeredEvent.totalImpact)
        );
      }
      return acc;
    }, {} as Record<string, { risk: UnknownRiskSnapshot; occurrences: { event: RiskEvent; runIndex: number }[]; averageImpact: AggregatedImpacts }>);

    s.effects = Object.values(effects)
      .map((e) => ({
        ...e,
        averageImpact: divideImpact(e.averageImpact, s.occurrences.length),
      }))
      .sort((a, b) => b.averageImpact.all - a.averageImpact.all);
  });

  return datas.sort((a, b) => b.averageImpact.all - a.averageImpact.all);
}
