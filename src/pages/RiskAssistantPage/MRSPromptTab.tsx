import {
  DVRiskFile,
  RiskFileQuantiResults,
} from "../../types/dataverse/DVRiskFile";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import { SCENARIOS } from "../../functions/scenarios";
import {
  returnPeriodMonthsFromYearlyEventRate,
  pTimeframeFromReturnPeriodMonths,
} from "../../functions/indicators/probability";
import {
  SectionConfig,
  SYSTEM_PROMPT,
  stripHTML,
  scenarioLines,
} from "./types";
import { writingPrompt } from "./Prompts";

// ─── Prompt builder ───────────────────────────────────────────────────────────

export function buildMRSPrompt(
  riskSummary: DVRiskSummary,
  riskFile: DVRiskFile<unknown, unknown, unknown, RiskFileQuantiResults>,
  results: RiskFileQuantiResults | null,
  config: SectionConfig,
): string {
  const mrs = (riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE) as SCENARIOS;
  const levels = [
    SCENARIOS.CONSIDERABLE,
    SCENARIOS.MAJOR,
    SCENARIOS.EXTREME,
  ] as const;

  const scenarioStats = levels
    .map((s) => {
      const p = results?.[s]?.probabilityStatistics?.sampleMean ?? null;
      const i = results?.[s]?.impactStatistics?.sampleMean?.all ?? null;
      const rp = p !== null ? returnPeriodMonthsFromYearlyEventRate(p) : null;
      const pYearly =
        rp !== null ? pTimeframeFromReturnPeriodMonths(rp, 12) : null;
      const totalRisk = p !== null && i !== null ? p * i : null;

      return [
        `  ${s.toUpperCase()}${s === mrs ? " ← Most Relevant Scenario" : ""}`,
        `    Yearly probability : ${pYearly !== null ? `${(pYearly * 100).toFixed(2)}%` : "(not yet calculated)"}`,
        `    Total impact       : ${i !== null ? `€ ${Math.round(i).toLocaleString("en-BE")}` : "(not yet calculated)"}`,
        `    Total risk (P × I) : ${totalRisk !== null ? `€ ${Math.round(totalRisk).toLocaleString("en-BE")}` : "(not yet calculated)"}`,
      ].join("\n");
    })
    .join("\n\n");

  const currentMRSText = stripHTML(riskFile.cr4de_mrs_scenario);

  return `SYSTEM:
${SYSTEM_PROMPT}
 
═══════════════════════════════════════════════════════
RISK FILE: ${riskSummary.cr4de_title}
═══════════════════════════════════════════════════════
 
DEFINITION:
${stripHTML(riskSummary.cr4de_definition)}
 
MOST RELEVANT SCENARIO: ${mrs.toUpperCase()}
 
QUANTITATIVE RESULTS PER SCENARIO:
${scenarioStats}
 
INTENSITY PARAMETERS — Considerable:
${scenarioLines(riskSummary.cr4de_scenario_considerable)}
 
INTENSITY PARAMETERS — Major:
${scenarioLines(riskSummary.cr4de_scenario_major)}
 
INTENSITY PARAMETERS — Extreme:
${scenarioLines(riskSummary.cr4de_scenario_extreme)}
${currentMRSText ? `\nCURRENT MRS DESCRIPTION (for reference/revision):\n${currentMRSText}\n` : ""}${
    config.extraContext
      ? `\nADDITIONAL ANALYST NOTES:\n${config.extraContext}\n`
      : ""
  }
───────────────────────────────────────────────────────
TASK:
Write a description of the Most Relevant Scenario (${mrs}) for this risk in 3 paragrpahs (~200 words). Describe concretely what the scenario entails based on the intensity parameters above. Use the quantitative results to contextualise its severity relative to the other scenarios but do not explicitely reference quantitative values, percentages or monetary amounts, as these are subject to small changes. An MRS description may be provided above, which was written for a previous iteration of the BNRA and may no longer be applicable. Treat it as a general template for what is expected.

The first paragraph should follow the pattern:

The [MOST RELEVANT SCENARIO NAME] scenario of a [RISK TITLE] was identified as the most relevant scenario. This means that it represents the highest amount of risk (probability x impact) of the three scenarios, as visualised in the risk matrix to the right.


${writingPrompt}
`;
}
