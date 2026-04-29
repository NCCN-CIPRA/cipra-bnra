import { SCENARIOS } from "../../functions/scenarios";
import {
  pScale7FromReturnPeriodMonths,
  returnPeriodMonthsFromYearlyEventRate,
} from "../../functions/indicators/probability";
import { RiskFileQuantiResults } from "../../types/dataverse/DVRiskFile";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import {
  SYSTEM_PROMPT,
  SectionConfig,
  scenarioLines,
  stripHTML,
} from "./types";
import { iScale7FromEuros } from "../../functions/indicators/impact";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a raw mean impact value to a 7-point scale score.
 * TODO: replace with the correct function from your indicators module
 * e.g. iScale7FromEuros, iScale7FromValue, etc.
 */
function impactScale7(value: number | null | undefined): string {
  if (value === null || value === undefined) return "(not yet calculated)";

  return String(Math.round(10 * iScale7FromEuros(value)) / 10);
}

function probScale7(meanP: number | null | undefined): string {
  if (!meanP) return "(not yet calculated)";
  const rp = returnPeriodMonthsFromYearlyEventRate(meanP);
  return String(pScale7FromReturnPeriodMonths(rp));
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

export function buildSummaryPrompt(
  riskSummary: DVRiskSummary,
  riskFile: any,
  results: RiskFileQuantiResults | null,
  config: SectionConfig,
): string {
  const mrs = (riskFile?.cr4de_mrs || SCENARIOS.CONSIDERABLE) as SCENARIOS;

  // ── Scale scores for the accompanying charts ────────────────────────────────

  const pMean = results?.[mrs]?.probabilityStatistics?.sampleMean ?? null;
  const iMeanH = results?.[mrs]?.impactStatistics?.sampleMean?.h ?? null;
  const iMeanS = results?.[mrs]?.impactStatistics?.sampleMean?.s ?? null;
  const iMeanE = results?.[mrs]?.impactStatistics?.sampleMean?.e ?? null;
  const iMeanF = results?.[mrs]?.impactStatistics?.sampleMean?.f ?? null;

  // ── MRS scenario parameters ─────────────────────────────────────────────────

  const mrsScenarioRaw =
    mrs === SCENARIOS.CONSIDERABLE
      ? riskSummary.cr4de_scenario_considerable
      : mrs === SCENARIOS.MAJOR
        ? riskSummary.cr4de_scenario_major
        : riskSummary.cr4de_scenario_extreme;

  // ── Analysis source fields ──────────────────────────────────────────────────

  const mrsScenarioText = stripHTML(riskFile?.cr4de_mrs_scenario);
  const mrsProbabilityText = stripHTML(riskFile?.cr4de_mrs_probability);
  const mrsImpactH = stripHTML(riskFile?.cr4de_mrs_impact_h);
  const mrsImpactS = stripHTML(riskFile?.cr4de_mrs_impact_s);
  const mrsImpactE = stripHTML(riskFile?.cr4de_mrs_impact_e);
  const mrsImpactF = stripHTML(riskFile?.cr4de_mrs_impact_f);
  const mrsCB = stripHTML(riskFile?.cr4de_mrs_cb);
  const mrsDisclaimer = stripHTML(riskFile?.cr4de_mrs_disclaimer);

  return `SYSTEM:
${SYSTEM_PROMPT}

═══════════════════════════════════════════════════════
RISK SUMMARY: ${riskSummary.cr4de_title}
Most Relevant Scenario: ${mrs.toUpperCase()}
═══════════════════════════════════════════════════════

━━━ SOURCE DATA FOR "DESCRIPTION" SECTION ━━━━━━━━━━━━

DEFINITION:
${stripHTML(riskSummary.cr4de_definition)}

MRS INTENSITY PARAMETERS (${mrs.toUpperCase()}):
${scenarioLines(mrsScenarioRaw)}

MRS SCENARIO DESCRIPTION:
${mrsScenarioText || "(not yet written)"}

━━━ SOURCE DATA FOR "ANALYSIS" SECTION ━━━━━━━━━━━━━━━

QUANTITATIVE SCALE SCORES (shown as charts on the website — reference only the most prominent values):
  • Probability          : ${probScale7(pMean)}/7
  • Human impact         : ${impactScale7(iMeanH)}/7
  • Societal impact      : ${impactScale7(iMeanS)}/7
  • Environmental impact : ${impactScale7(iMeanE)}/7
  • Financial impact     : ${impactScale7(iMeanF)}/7

PROBABILITY ASSESSMENT:
${mrsProbabilityText || "(not yet written)"}

HUMAN IMPACT ASSESSMENT:
${mrsImpactH || "(not yet written)"}

SOCIETAL IMPACT ASSESSMENT:
${mrsImpactS || "(not yet written)"}

ENVIRONMENTAL IMPACT ASSESSMENT:
${mrsImpactE || "(not yet written)"}

FINANCIAL IMPACT ASSESSMENT:
${mrsImpactF || "(not yet written)"}

CROSS-BORDER IMPACT ASSESSMENT:
${mrsCB || "(not yet written)"}
${mrsDisclaimer ? `\nKNOWN INCONSISTENCIES / DISCLAIMER:\n${mrsDisclaimer}\n` : ""}${
    config.extraContext
      ? `\nADDITIONAL ANALYST NOTES:\n${config.extraContext}\n`
      : ""
  }
───────────────────────────────────────────────────────
TASK:
Write a concise risk summary consisting of exactly two sections. Each section must be between 100 and 250 words. Use the section titles exactly as shown below, in bold.

**Description**

Write a factual description of this risk focused exclusively on the Most Relevant Scenario (${mrs.toUpperCase()}). Base this section only on the definition and the MRS intensity parameters above — do not draw on any assessment, probability, or impact content. Describe concretely what the scenario entails: what happens, at what scale, under what conditions. Write in the third person, present tense, as if describing a real situation to a non-specialist reader.

**Analysis**

Write an integrated analytical summary of the risk's overall significance, based solely on the assessment texts provided above (scenario description, probability, impact categories, cross-border). Synthesise across dimensions rather than summarising each one in turn. Reference the quantitative scale scores only where they are most striking or relevant (e.g. a notably high financial impact or very low probability) — do not list all five scores. If a disclaimer is present, briefly acknowledge it. Do not introduce any information not found in the source texts above.

WRITING RULES:
- The two bold section titles (**Description** and **Analysis**) are the only formatting — no bullet points, sub-headers, or markdown anywhere else.
- Write as flowing, coherent prose throughout.
- Maintain a ${config.tone} tone.
- Do not cross-reference between sections (the description must stand alone without any analysis).`;
}
