import { RiskFileQuantiResults } from "../../types/dataverse/DVRiskFile";
import { AggregatedImpacts } from "../../types/simulation";
import { SCENARIOS } from "../scenarios";

export function aggregateCauseScenarioProbabilityContributions(
  results: RiskFileQuantiResults,
  causeRiskId: string | null,
  effectScenario: SCENARIOS | null,
) {
  if (effectScenario !== null)
    return aggregateCauseScenarioProbabilityContributionsSingleEffectScenario(
      results,
      causeRiskId,
      effectScenario,
    );

  // TODO: weigh scenarios according to ...
  return (
    (aggregateCauseScenarioProbabilityContributionsSingleEffectScenario(
      results,
      causeRiskId,
      SCENARIOS.CONSIDERABLE,
    ) +
      aggregateCauseScenarioProbabilityContributionsSingleEffectScenario(
        results,
        causeRiskId,
        SCENARIOS.MAJOR,
      ) +
      aggregateCauseScenarioProbabilityContributionsSingleEffectScenario(
        results,
        causeRiskId,
        SCENARIOS.EXTREME,
      )) /
    3
  );
}

function aggregateCauseScenarioProbabilityContributionsSingleEffectScenario(
  results: RiskFileQuantiResults,
  causeRiskId: string | null,
  effectScenario: SCENARIOS,
) {
  const scenarios =
    results[effectScenario].probabilityStatistics?.relativeContributions.filter(
      (contrib) => contrib.id == causeRiskId,
    ) || [];

  return scenarios.reduce((t, c) => t + c.contributionMean, 0);
}

export function aggregateEffectScenarioImpactContributions(
  results: RiskFileQuantiResults,
  effectRiskId: string | null,
  causeScenario: SCENARIOS | null,
  indicator: keyof AggregatedImpacts = "all",
) {
  if (causeScenario !== null)
    return aggregateEffectScenarioImpactContributionsSingleCauseScenario(
      results,
      effectRiskId,
      causeScenario,
      indicator,
    );

  // TODO: weigh scenarios according to ...
  return (
    (aggregateEffectScenarioImpactContributionsSingleCauseScenario(
      results,
      effectRiskId,
      SCENARIOS.CONSIDERABLE,
      indicator,
    ) +
      aggregateEffectScenarioImpactContributionsSingleCauseScenario(
        results,
        effectRiskId,
        SCENARIOS.MAJOR,
        indicator,
      ) +
      aggregateEffectScenarioImpactContributionsSingleCauseScenario(
        results,
        effectRiskId,
        SCENARIOS.EXTREME,
        indicator,
      )) /
    3
  );
}

function aggregateEffectScenarioImpactContributionsSingleCauseScenario(
  results: RiskFileQuantiResults,
  effectRiskId: string | null,
  causeScenario: SCENARIOS,
  indicator: keyof AggregatedImpacts = "all",
) {
  const scenarios =
    results[causeScenario].impactStatistics?.relativeContributions.filter(
      (contrib) => contrib.id == effectRiskId,
    ) || [];

  return scenarios.reduce((t, c) => t + c.contributionMean[indicator], 0);
}
