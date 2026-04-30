import { SCENARIOS } from "../../functions/scenarios";
import { IntensityParameter } from "../../functions/intensityParameters";
import { CPMatrix } from "../../types/dataverse/DVCascadeSnapshot";
import {
  RiskFileQuantiInput,
  RiskFileQuantiResults,
} from "../../types/dataverse/DVRiskFile";
import { AggregatedImpacts } from "../../types/simulation";
import { Indicator } from "../../functions/indicators/impact";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SectionKey =
  | "priming"
  | "mrs"
  | "probability"
  | "human"
  | "societal"
  | "environmental"
  | "financial"
  | "summary";

export type ToneOption = "formal" | "technical" | "accessible";

export interface CascadeOption {
  id: string;
  title: string;
  definition: string;
  cpMatrix?: string | null;
  rawCP?: Record<string, number | null>;
  qualiText?: string | null;
  contributionP?: number;
  contributionsByScenarioP?: Partial<Record<SCENARIOS, number>>;
  contributionH?: number;
  contributionS?: number;
  contributionE?: number;
  contributionF?: number;
  contributionAll?: number;
  _subResults?: RiskFileQuantiResults | null;
  contributionsByScenario?: Partial<Record<SCENARIOS, AggregatedImpacts>>;
  scenarioMrs?: SCENARIOS | null;
  scenarioConsiderable?: string | null;
  scenarioMajor?: string | null;
  scenarioExtreme?: string | null;
  defaultInclude: boolean;
}

export interface SectionConfig {
  includedCascadeIds: Set<string>;
  tone: ToneOption;
  wordCount: number;
  extraContext: string;
}

export const IMPACT_DI_KEYS: Record<
  ImpactKey,
  (keyof RiskFileQuantiInput[SCENARIOS]["di"])[]
> = {
  human: ["ha", "hb", "hc"],
  societal: ["sa", "sb", "sc", "sd"],
  environmental: ["ea"],
  financial: ["fa", "fb"],
};

export const defaultConfig = (cascades: CascadeOption[]): SectionConfig => ({
  includedCascadeIds: new Set(
    cascades.filter((x) => x.defaultInclude).map((c) => c.id),
  ),
  tone: "formal",
  wordCount: 200,
  extraContext: "",
});

// Add indicator mapping — used by buildImpactPrompt to know which sub-indicators to describe
export type ImpactKey = "human" | "societal" | "environmental" | "financial";

export const IMPACT_INDICATORS: Record<ImpactKey, Indicator[]> = {
  human: ["ha", "hb", "hc"],
  societal: ["sa", "sb", "sc", "sd"],
  environmental: ["ea"],
  financial: ["fa", "fb"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function stripHTML(html: string | null | undefined): string {
  return (html || "").replace(/<[^>]+>/g, "").trim();
}

export function parseJSON<T>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function scenarioLines(raw: string | null | undefined): string {
  const params = parseJSON<IntensityParameter[]>(raw);
  if (!params?.length) return "  (no parameters defined)";
  return params
    .map(
      (ip) =>
        `  • ${ip.name}: ${stripHTML(Array.isArray(ip.value) ? ip.value[0] : ip.value)}`,
    )
    .join("\n");
}

export function cpMatrixLines(
  raw: string | null | undefined,
  mrs: SCENARIOS,
  rawCP?: Record<string, number | null>,
): string {
  const causeScenarios = ["considerable", "major", "extreme"] as const;
  const effectScenario = mrs as "considerable" | "major" | "extreme";

  const m = parseJSON<CPMatrix>(raw);
  if (m) {
    return causeScenarios
      .map((cause) => {
        const val = m[cause]?.[effectScenario]?.scale7 ?? null;
        return `  ${cause.padEnd(12)} → ${effectScenario}: ${
          val !== null ? `${val}/7` : "(no data)"
        }`;
      })
      .join("\n");
  }

  if (rawCP) {
    const eff = effectScenario[0];
    return causeScenarios
      .map((cause) => {
        const key = `${cause[0]}2${eff}`;
        const val = rawCP[key];
        return `  ${cause.padEnd(12)} → ${effectScenario}: ${
          val !== null && val !== undefined
            ? `${val}/5 (raw expert estimate)`
            : "(no data)"
        }`;
      })
      .join("\n");
  }

  return "  (no data)";
}

export function extractSubContributors(
  subResults: RiskFileQuantiResults | null | undefined,
  scenario: SCENARIOS,
  impactKey: "h" | "s" | "e" | "f" | "all",
  topN = 5,
): { title: string; share: number }[] {
  const contribs =
    subResults?.[scenario]?.impactStatistics?.relativeContributions;
  if (!contribs?.length) return [];

  const byId = contribs.reduce<
    Record<string, { title: string; share: number }>
  >((acc, c) => {
    const id = c.id ?? "";
    const val = c.contributionMean[impactKey] ?? 0;
    if (!acc[id]) acc[id] = { title: c.risk ?? id, share: 0 };
    acc[id].share += val;
    return acc;
  }, {});

  return Object.values(byId)
    .sort((a, b) => b.share - a.share)
    .slice(0, topN)
    .filter((x) => x.share > 0);
}

export function extractProbabilitySubContributors(
  subResults: RiskFileQuantiResults | null | undefined,
  scenario: SCENARIOS,
  topN = 5,
): { title: string; share: number }[] {
  const contribs =
    subResults?.[scenario]?.probabilityStatistics?.relativeContributions;
  if (!contribs?.length) return [];

  const byId = contribs.reduce<
    Record<string, { title: string; share: number }>
  >((acc, c) => {
    const id = c.id ?? "";
    const val = c.contributionMean ?? 0;
    if (!acc[id]) acc[id] = { title: c.risk ?? id, share: 0 };
    acc[id].share += val;
    return acc;
  }, {});

  return Object.values(byId)
    .sort((a, b) => b.share - a.share)
    .slice(0, topN)
    .filter((x) => x.share > 0);
}

export const SYSTEM_PROMPT = `Please carefully integrate the data provided below and use it to complete the task described at the end:`;
