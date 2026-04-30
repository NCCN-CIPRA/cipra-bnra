import {
  getIntervalStringQuantiScale7,
  Indicator,
  iScale7FromEuros,
} from "../../functions/indicators/impact";
import { SCENARIOS } from "../../functions/scenarios";
import {
  RiskFileQuantiInput,
  RiskFileQuantiResults,
} from "../../types/dataverse/DVRiskFile";
import { RiskQualis } from "../../types/dataverse/Riskfile";
import { writingPrompt } from "./Prompts";
import {
  CascadeOption,
  SectionConfig,
  SYSTEM_PROMPT,
  extractSubContributors,
  ImpactKey,
  IMPACT_INDICATORS,
  scenarioLines,
  IMPACT_DI_KEYS,
  stripHTML,
} from "./types";

function buildEffectScenarioLines(
  e: CascadeOption,
  impactLetter: "h" | "s" | "e" | "f",
  impactLabel: string,
  parentScenario: SCENARIOS,
): string {
  const allScenarios = [
    SCENARIOS.CONSIDERABLE,
    SCENARIOS.MAJOR,
    SCENARIOS.EXTREME,
  ] as const;

  // Get contribution for this impact dimension per scenario, sort descending
  const ranked = allScenarios
    .map((s) => ({
      scenario: s,
      share: ((e.contributionsByScenario?.[s] as any)?.[impactLetter] ??
        0) as number,
      raw:
        s === SCENARIOS.CONSIDERABLE
          ? e.scenarioConsiderable
          : s === SCENARIOS.MAJOR
            ? e.scenarioMajor
            : e.scenarioExtreme,
    }))
    .sort((a, b) => b.share - a.share)
    .filter((x) => x.share >= 0.1); // drop anything below 10%

  // If nothing passes the threshold (e.g. no quanti data yet), fall back to MRS only
  if (ranked.length === 0) {
    const mrs = e.scenarioMrs ?? parentScenario;
    const raw =
      mrs === SCENARIOS.CONSIDERABLE
        ? e.scenarioConsiderable
        : mrs === SCENARIOS.MAJOR
          ? e.scenarioMajor
          : e.scenarioExtreme;
    return (
      `\n   Scenarios (no contribution data — showing MRS only):\n` +
      `   ${mrs.toUpperCase()} (MRS)\n` +
      scenarioLines(raw)
        .split("\n")
        .map((l) => `   ${l}`)
        .join("\n")
    );
  }

  const blocks = ranked.map(({ scenario, share, raw }) => {
    const isMrs = scenario === (e.scenarioMrs ?? parentScenario);
    const header = `   ${scenario.toUpperCase()}${isMrs ? " (MRS)" : ""} — ${(share * 100).toFixed(1)}% of ${impactLabel} impact`;
    const params = scenarioLines(raw)
      .split("\n")
      .map((l) => `     ${l}`)
      .join("\n");

    const subContribs = extractSubContributors(
      e._subResults,
      scenario,
      impactLetter,
      5,
    );
    const subLines =
      subContribs.length > 0
        ? "\n" +
          subContribs
            .map((s) => `       – ${s.title}: ${(s.share * 100).toFixed(1)}%`)
            .join("\n")
        : " (no data)";

    return `${header}\n${params}\n     Top internal contributors:${subLines}`;
  });

  return `\n   Relevant effect scenarios (sorted by ${impactLabel} contribution):\n${blocks.join("\n\n")}`;
}

function buildDirectImpactEntry(
  riskFile: any,
  impactKey: ImpactKey,
  impactLetter: "h" | "s" | "e" | "f",
  impactLabel: string,
  directShare: number,
  parentScenario: SCENARIOS,
  entryIndex: number,
): string | null {
  if (directShare < 0.1) return null;

  const quantiInput = JSON.parse(riskFile?.cr4de_quanti) as RiskFileQuantiInput;
  const qualis = JSON.parse(riskFile?.cr4de_quali) as RiskQualis;
  const diKeys = IMPACT_DI_KEYS[impactKey];

  const qualiText = stripHTML(qualis?.[parentScenario]?.[impactLetter] ?? null);

  const quantiBlock = diKeys
    .map((k) => {
      const val = quantiInput[parentScenario].di[k];

      if (!val || val.scale7 === 0) return null;
      const indicator = k as Indicator; // e.g. "HA" → check Indicator type
      try {
        const range = getIntervalStringQuantiScale7(
          val.scale7,
          indicator as any,
        );
        return `     • ${indicator} (scale ${val.scale7}/7): ${range}`;
      } catch {
        return `     • ${indicator} (scale ${val.scale7}/7)`;
      }
    })
    .filter(Boolean)
    .join("\n");

  const qualiBlock = qualiText
    ? `\n     Expert qualitative justification:\n     ${qualiText.replace(/\n/g, "\n     ")}`
    : "";

  return `
${entryIndex}. Direct ${impactLabel.toLowerCase()} impact
   Contribution to ${impactLabel.toLowerCase()} impact (overall): ${(directShare * 100).toFixed(1)}%
${quantiBlock}
${qualiBlock}`;
}

// ─── Indicator header block ───────────────────────────────────────────────────

function buildIndicatorLines(
  impactKey: ImpactKey,
  scenario: SCENARIOS,
  results: RiskFileQuantiResults | null,
): string {
  const indicators = IMPACT_INDICATORS[impactKey];

  return indicators
    .map((indicator) => {
      const scale7: number | null = iScale7FromEuros(
        (results?.[scenario]?.impactStatistics as any)?.sampleMean?.[
          indicator
        ] ?? 0,
      );

      if (scale7 === null) return `  ${indicator}: (no data)`;

      const intervalStr = getIntervalStringQuantiScale7(
        scale7,
        indicator as Indicator,
      );
      return `  ${indicator} (scale ${scale7}/7): ${intervalStr}`;
    })
    .join("\n");
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

export function buildImpactPrompt(
  impactKey: ImpactKey,
  riskSummary: any,
  riskFile: any,
  results: RiskFileQuantiResults | null,
  effects: CascadeOption[],
  config: SectionConfig,
): string {
  const scenario = (riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE) as SCENARIOS;
  const impactLetter = impactKey[0] as "h" | "s" | "e" | "f";
  const impactLabel = {
    h: "Human",
    s: "Societal",
    e: "Environmental",
    f: "Financial",
  }[impactLetter];
  const contribKey =
    `contribution${impactLetter.toUpperCase()}` as keyof CascadeOption;

  const selected = effects.filter((e) => config.includedCascadeIds.has(e.id));

  const totalEffectShare = effects.reduce(
    (sum, e) => sum + ((e[contribKey] as number) ?? 0),
    0,
  );
  const directShare = Math.max(0, 1 - totalEffectShare);

  // Direct impact entry — rendered first if it meets the threshold, numbered
  // relative to its position so the cascade entries follow on naturally
  const directEntry = buildDirectImpactEntry(
    riskFile,
    impactKey,
    impactLetter,
    impactLabel,
    directShare,
    scenario,
    1, // always entry 1 when shown — cascades follow
  );
  const cascadeOffset = directEntry ? 1 : 0; // shift cascade numbering if direct is present

  const cascadeEntries =
    selected.length === 0
      ? "  (no effect risks selected)"
      : selected
          .map((e, i) => {
            const subContribs = extractSubContributors(
              e._subResults,
              scenario,
              impactLetter,
              5,
            );
            const subContribLines =
              subContribs.length > 0
                ? `\n   Top internal contributors to ${impactLabel.toLowerCase()} impact:\n` +
                  subContribs
                    .map(
                      (s) =>
                        `     – ${s.title}: ${(s.share * 100).toFixed(1)}%`,
                    )
                    .join("\n")
                : "";

            const effectScenarioDesc = buildEffectScenarioLines(
              e,
              impactLetter,
              impactLabel,
              scenario,
            );

            return `
${i + 1 + cascadeOffset}. ${e.title}
   Contribution to ${impactLabel.toLowerCase()} impact (overall): ${(e[contribKey] as number) > 0 ? `${((e[contribKey] as number) * 100).toFixed(1)}%` : "(not yet calculated)"}
   Contribution to total impact (overall): ${(e.contributionAll ?? 0) > 0 ? `${((e.contributionAll ?? 0) * 100).toFixed(1)}%` : "(not yet calculated)"}${effectScenarioDesc}${subContribLines}
   Definition: ${e.definition}
${e.qualiText ? `\n   Expert qualitative justification:\n   ${e.qualiText.replace(/\n/g, "\n   ")}` : ""}`;
          })
          .join("\n");

  return `SYSTEM:
${SYSTEM_PROMPT}

═══════════════════════════════════════════════════════
${impactLabel.toUpperCase()} IMPACT ASSESSMENT: ${riskSummary.cr4de_title}
Most Relevant Scenario: ${scenario.toUpperCase()}
═══════════════════════════════════════════════════════

${impactLabel.toUpperCase()} IMPACT INDICATORS (MRS scale scores & ranges):
${buildIndicatorLines(impactKey, scenario, results)}

IMPACT BREAKDOWN:
  • Direct ${impactLabel.toLowerCase()} impact (from this risk itself): ${(directShare * 100).toFixed(1)}%
  • Indirect ${impactLabel.toLowerCase()} impact (via triggered effect risks): ${(totalEffectShare * 100).toFixed(1)}%

RELEVANT EFFECT RISKS AND DIRECT IMPACT (${selected.length}/${effects.length} included, ordered by ${impactLabel.toLowerCase()} impact contribution):
${directEntry ?? ""}
${cascadeEntries}
${config.extraContext ? `\nADDITIONAL ANALYST NOTES:\n${config.extraContext}\n` : ""}
───────────────────────────────────────────────────────
TASK:
Write a ${impactLabel.toLowerCase()} impact assessment section (~${config.wordCount} words, ${config.tone} tone) structured as follows:

STRUCTURE:
- Open with 1–2 sentences describing the most important total ${impactLabel.toLowerCase()} impacts of the scenario itself, without a heading.
- Then cover each significant effect risk as a numbered entry in this exact format:

  [Effect risk title]

  [One or two paragraphs of analytical prose describing how this effect risk is triggered, why its ${impactLabel.toLowerCase()} contribution is significant or limited, and any relevant scenario- or context-specific nuance. Entries with a higher contribution % should get more attention and more explanation.]

- After the last significant entry, if any effect risks were omitted because their contribution falls within the margin of error or is statistically negligible, close with a single sentence to that effect (e.g. "Other effect risks fall within the margin of error and are not considered statistically relevant."). Do not list them by name.

WRITING RULES:
- Use only the effect risk title as the entry header and put it in bold.
- Write each entry as flowing analytical prose. No bullet points or sub-headers within entries.
- Ground the narrative in the indicator ranges, scenario parameters, and internal contributor breakdowns provided above, but do not mechanically repeat the numbers — use them to inform the qualitative judgement.
- Reference the scenario breakdown (considerable / major / extreme) where it adds meaningful nuance (e.g. if an effect is only relevant under extreme conditions).
- Incorporate expert qualitative justifications where available.
- Maintain a consistent ${config.tone} tone throughout.
- ${writingPrompt}`;
}
