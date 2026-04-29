import {
  scenarioLines,
  extractProbabilitySubContributors,
  CascadeOption,
  SectionConfig,
  SYSTEM_PROMPT,
} from "./types";
import { SCENARIOS } from "../../functions/scenarios";
import { RiskFileQuantiResults } from "../../types/dataverse/DVRiskFile";
import {
  pScale7FromReturnPeriodMonths,
  returnPeriodMonthsFromYearlyEventRate,
  pTimeframeFromReturnPeriodMonths,
} from "../../functions/indicators/probability";
import { writingPrompt } from "./Prompts";

// ─── Per-scenario cause block ─────────────────────────────────────────────────

function buildCauseScenarioLines(c: CascadeOption): string {
  const allScenarios = [
    SCENARIOS.CONSIDERABLE,
    SCENARIOS.MAJOR,
    SCENARIOS.EXTREME,
  ] as const;

  const ranked = allScenarios
    .map((s) => ({
      scenario: s,
      share: c.contributionsByScenarioP?.[s] ?? 0,
      raw:
        s === "considerable"
          ? c.scenarioConsiderable
          : s === "major"
            ? c.scenarioMajor
            : c.scenarioExtreme,
    }))
    .sort((a, b) => b.share - a.share)
    .filter((x) => x.share / (c.contributionP || 1) >= 0.1); // drop anything below 10%

  if (ranked.length === 0)
    return "\n   Scenarios: (no conditional probability data available)";

  const blocks = ranked.map(({ scenario, share, raw }) => {
    const header = `     ${scenario.toUpperCase()} cause\n       - ${(share * 100).toFixed(1)}% of total probability\n       - ${((share / (c.contributionP || 1)) * 100).toFixed(1)}% of cause probability`;
    const params = scenarioLines(raw)
      .split("\n")
      .map((l) => `     ${l}`)
      .join("\n");

    const subContribs = extractProbabilitySubContributors(
      c._subResults,
      scenario,
      5,
    );
    const subLines =
      subContribs.length > 0
        ? "\n" +
          subContribs
            .map((s) => `       – ${s.title}: ${(s.share * 100).toFixed(1)}%`)
            .join("\n")
        : " (no data)";

    return `${header}\n${params}\n     Top internal probability contributors:${subLines}`;
  });

  return `\n   Relevant cause scenarios (sorted by total probability contribution):\n${blocks.join("\n\n")}`;
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

export function buildProbabilityPrompt(
  riskSummary: any,
  riskFile: any,
  results: RiskFileQuantiResults | null,
  causes: CascadeOption[],
  config: SectionConfig,
): string {
  const scenario = (riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE) as SCENARIOS;
  const meanP = results?.[scenario]?.probabilityStatistics?.sampleMean ?? 0;
  const rp = returnPeriodMonthsFromYearlyEventRate(meanP);
  const p7 = pScale7FromReturnPeriodMonths(rp);
  const pYearly = pTimeframeFromReturnPeriodMonths(rp, 12);

  const selected = causes.filter((c) => config.includedCascadeIds.has(c.id));

  const scenarioRaw =
    scenario === SCENARIOS.CONSIDERABLE
      ? riskSummary.cr4de_scenario_considerable
      : scenario === SCENARIOS.MAJOR
        ? riskSummary.cr4de_scenario_major
        : riskSummary.cr4de_scenario_extreme;

  return `SYSTEM:
${SYSTEM_PROMPT}

═══════════════════════════════════════════════════════
PROBABILITY ASSESSMENT: ${riskSummary.cr4de_title}
Most Relevant Scenario: ${scenario.toUpperCase()}
═══════════════════════════════════════════════════════

QUANTITATIVE RESULTS:
  • Probability scale score : ${p7}/7
  • Estimated yearly probability : ${(pYearly * 100).toFixed(1)}%
  • Return period : ~${Math.round(rp)} months

MRS INTENSITY PARAMETERS:
${scenarioLines(scenarioRaw)}

MOST RELEVANT CAUSE RISKS (${selected.length} / ${causes.length} included, ordered by contribution):
${
  selected.length === 0
    ? "  (no cause risks selected)"
    : selected
        .map((c, i) => {
          const scenarioBlock = buildCauseScenarioLines(c);
          return `
${i + 1}. ${c.title}
   Contribution to total probability: ${(c.contributionP ?? 0) > 0 ? `${((c.contributionP ?? 0) * 100).toFixed(1)}%` : "(not yet calculated)"}${scenarioBlock}
   Definition: ${c.definition}
${c.qualiText ? `\n   Expert qualitative justification:\n   ${c.qualiText.replace(/\n/g, "\n   ")}` : ""}`;
        })
        .join("\n")
}
${config.extraContext ? `\nADDITIONAL ANALYST NOTES:\n${config.extraContext}\n` : ""}
───────────────────────────────────────────────────────
TASK:
Write a probability assessment section (~${config.wordCount} words, ${config.tone} tone) structured as follows:

STRUCTURE:
- Open with 1–2 sentences stating the overall probability score, its practical meaning (yearly chance, return period), and whether probability is primarily driven by autonomous likelihood or by cascading causes.
- Then cover each significant cause risk as a numbered entry in this exact format:

  [Cause risk title]

  [One or two paragraphs of analytical prose describing how this cause contributes to the overall probability, which of its scenarios are most relevant (based on the conditional probability values), and any relevant nuance from the expert justification or sub-contributor breakdown. Entries with a higher contribution % should get more attention and more explanation.]

- After the last significant entry, if any cause risks were omitted because their contribution is negligible or within the margin of error, close with a single sentence to that effect (e.g. "Other cause risks fall within the margin of error and are not considered statistically relevant."). Do not list them by name.

WRITING RULES:
- Use only the cause risk title as the entry header and put in bold.
- Write each entry as flowing analytical prose. No bullet points or sub-headers within entries.
- Ground the narrative in the conditional probability values and scenario parameters provided above, but do not mechanically repeat the numbers — use them to inform the qualitative judgement.
- Reference specific cause scenarios (considerable / major / extreme) where the CP values differ meaningfully.
- Incorporate expert qualitative justifications where available.
- Maintain a consistent ${config.tone} tone throughout.
- ${writingPrompt}`;
}
