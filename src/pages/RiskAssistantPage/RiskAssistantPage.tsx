import { useState, useMemo } from "react";
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Stack,
  Paper,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import DeselectIcon from "@mui/icons-material/Deselect";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import RiskFileTitle from "../../components/RiskFileTitle";
import useAPI, { DataTable } from "../../hooks/useAPI";
import {
  DVRiskFile,
  RiskFileQuantiResults,
} from "../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";
import { SCENARIOS } from "../../functions/scenarios";
import {
  pScale7FromReturnPeriodMonths,
  returnPeriodMonthsFromYearlyEventRate,
  pTimeframeFromReturnPeriodMonths,
} from "../../functions/indicators/probability";
import { AggregatedImpacts, noAggregatedImpacts } from "../../types/simulation";
import { IntensityParameter } from "../../functions/intensityParameters";
import { CPMatrix } from "../../types/dataverse/DVCascadeSnapshot";
import { addImpact } from "../../functions/simulation/math";
import { basePrompt, techPrompt, writingPrompt } from "./Prompts";
import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripHTML(html: string | null | undefined): string {
  return (html || "").replace(/<[^>]+>/g, "").trim();
}

function parseJSON<T>(raw: string | null | undefined): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function scenarioLines(raw: string | null | undefined): string {
  const params = parseJSON<IntensityParameter[]>(raw);
  if (!params?.length) return "  (no parameters defined)";
  return params
    .map(
      (ip) =>
        `  • ${ip.name}: ${stripHTML(Array.isArray(ip.value) ? ip.value[0] : ip.value)}`,
    )
    .join("\n");
}

/**
 * Fixed CP matrix serialiser.
 * The original RiskAssistantPage had a bug where all 9 cells
 * read from m.considerable.considerable.abs — this uses the correct cell.
 */
function cpMatrixLines(raw: string | null | undefined): string {
  const m = parseJSON<CPMatrix>(raw);
  if (!m) return "  (no data)";
  const levels = ["considerable", "major", "extreme"] as const;
  return levels
    .flatMap((cause) =>
      levels.map((effect) => {
        const val = m[cause]?.[effect]?.abs ?? 0;
        return `  ${cause.padEnd(12)} → ${effect.padEnd(12)}: ${(val * 100).toFixed(1)}%`;
      }),
    )
    .join("\n");
}

// ─── Types ───────────────────────────────────────────────────────────────────

type SectionKey =
  | "priming"
  | "mrs"
  | "probability"
  | "human"
  | "societal"
  | "environmental"
  | "financial";

type ToneOption = "formal" | "technical" | "accessible";

interface CascadeOption {
  id: string;
  title: string;
  definition: string;
  cpMatrix?: string | null; // only on cause cascades
  qualiText?: string | null; // qualitative justification text on the cascade
  contributionP?: number; // share of total probability (0–1)
  contributionH?: number; // share of human impact (0–1)
  contributionS?: number;
  contributionE?: number;
  contributionF?: number;
  contributionAll?: number; // share of total impact (0–1)
}

interface SectionConfig {
  includedCascadeIds: Set<string>;
  tone: ToneOption;
  wordCount: number;
  extraContext: string;
}

const defaultConfig = (cascades: CascadeOption[]): SectionConfig => ({
  includedCascadeIds: new Set(cascades.map((c) => c.id)),
  tone: "formal",
  wordCount: 200,
  extraContext: "",
});

// ─── Prompt Builders ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Please carefully integrate the data provided below and use it to complete the task described at the end:`;

function buildMRSPrompt(
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
      const isMRS = s === mrs;

      return [
        `  ${s.toUpperCase()}${isMRS ? " ← Most Relevant Scenario" : ""}`,
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
${
  currentMRSText
    ? `\nCURRENT MRS DESCRIPTION (for reference/revision):\n${currentMRSText}\n`
    : ""
}${
    config.extraContext
      ? `\nADDITIONAL ANALYST NOTES:\n${config.extraContext}\n`
      : ""
  }
───────────────────────────────────────────────────────
TASK:
Write a description of the Most Relevant Scenario (${mrs}) for this risk (~${config.wordCount} words, ${config.tone} tone). Describe concretely what the scenario entails based on the intensity parameters above. Use the quantitative results to contextualise its severity relative to the other scenarios but do not explicitely reference quantitative values, percentages or monetary amounts, as these are subject to small changes. An MRS description may be provided above, which was written for a previous iteration of the BNRA and may no longer be applicable. Treat it as a general template for what is expected.

${writingPrompt}
`;
}

function buildProbabilityPrompt(
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
  // Sort by contribution descending so most important causes appear first in the prompt
  const sorted = [...selected].sort(
    (a, b) => (b.contributionP ?? 0) - (a.contributionP ?? 0),
  );

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

CAUSE RISKS (${sorted.length} included, ordered by contribution):
${
  sorted.length === 0
    ? "  (no cause risks selected)"
    : sorted
        .map(
          (c, i) => `
${i + 1}. ${c.title}
   Contribution to total probability: ${
     c.contributionP !== undefined
       ? `${(c.contributionP * 100).toFixed(1)}%`
       : "(not yet calculated)"
   }
   Definition: ${c.definition}

   Conditional probability matrix (cause scenario → effect scenario):
${cpMatrixLines(c.cpMatrix)}
${
  c.qualiText
    ? `\n   Expert qualitative justification:\n   ${c.qualiText.replace(/\n/g, "\n   ")}`
    : ""
}`,
        )
        .join("\n")
}
${config.extraContext ? `\nADDITIONAL ANALYST NOTES:\n${config.extraContext}\n` : ""}
───────────────────────────────────────────────────────
TASK:
Write a probability assessment section (~${config.wordCount} words, ${config.tone} tone) that:
1. Opens with the probability score and its practical meaning (yearly chance, return period).
2. Discusses the most significant cause risks and how strongly they drive overall probability, using the conditional probability matrices.
3. Incorporates expert qualitative justifications where available.
4. Acknowledges any uncertainties or data gaps.
Do not use headers or bullet points — write as flowing analytical prose.`;
}

function buildImpactPrompt(
  impactKey: "human" | "societal" | "environmental" | "financial",
  riskSummary: any,
  riskFile: any,
  _results: RiskFileQuantiResults | null,
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
  const sorted = [...selected].sort(
    (a, b) =>
      ((b[contribKey] as number) ?? 0) - ((a[contribKey] as number) ?? 0),
  );

  const totalEffectShare = sorted.reduce(
    (sum, e) => sum + ((e[contribKey] as number) ?? 0),
    0,
  );
  const directShare = Math.max(0, 1 - totalEffectShare);

  return `SYSTEM:
${SYSTEM_PROMPT}

═══════════════════════════════════════════════════════
${impactLabel.toUpperCase()} IMPACT ASSESSMENT: ${riskSummary.cr4de_title}
Most Relevant Scenario: ${scenario.toUpperCase()}
═══════════════════════════════════════════════════════

IMPACT BREAKDOWN:
  • Direct ${impactLabel.toLowerCase()} impact (from this risk itself): ${(directShare * 100).toFixed(1)}%
  • Indirect ${impactLabel.toLowerCase()} impact (via triggered effect risks): ${(totalEffectShare * 100).toFixed(1)}%

EFFECT RISKS (${sorted.length} included, ordered by ${impactLabel.toLowerCase()} impact contribution):
${
  sorted.length === 0
    ? "  (no effect risks selected)"
    : sorted
        .map(
          (e, i) => `
${i + 1}. ${e.title}
   Contribution to ${impactLabel.toLowerCase()} impact : ${
     (e[contribKey] as number) !== undefined
       ? `${((e[contribKey] as number) * 100).toFixed(1)}%`
       : "(not yet calculated)"
   }
   Contribution to total impact     : ${
     e.contributionAll !== undefined
       ? `${(e.contributionAll * 100).toFixed(1)}%`
       : "(not yet calculated)"
   }
   Definition: ${e.definition}
${
  e.qualiText
    ? `\n   Expert qualitative justification:\n   ${e.qualiText.replace(/\n/g, "\n   ")}`
    : ""
}`,
        )
        .join("\n")
}
${config.extraContext ? `\nADDITIONAL ANALYST NOTES:\n${config.extraContext}\n` : ""}
───────────────────────────────────────────────────────
TASK:
Write a ${impactLabel.toLowerCase()} impact assessment section (~${config.wordCount} words, ${config.tone} tone) that:
1. Describes the direct ${impactLabel.toLowerCase()} consequences of the scenario itself.
2. Explains how triggered effect risks amplify the total ${impactLabel.toLowerCase()} impact, with reference to their relative contributions.
3. Draws on the qualitative expert justifications for the most significant cascades.
4. Notes any important uncertainties.
Do not use headers or bullet points — write as flowing analytical prose.`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Tooltip title={copied ? "Copied!" : "Copy prompt to clipboard"}>
      <IconButton
        onClick={handleCopy}
        size="small"
        color={copied ? "success" : "default"}
      >
        {copied ? (
          <CheckIcon fontSize="small" />
        ) : (
          <ContentCopyIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}

function CascadeSelector({
  label,
  cascades,
  selectedIds,
  onToggle,
  onSelectAll,
  onDeselectAll,
  contributionLabel,
}: {
  label: string;
  cascades: CascadeOption[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  contributionLabel: (c: CascadeOption) => string | null;
}) {
  if (cascades.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontStyle: "italic" }}
      >
        No {label.toLowerCase()} found.
      </Typography>
    );
  }
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 0.5,
        }}
      >
        <Typography variant="subtitle2">{label}</Typography>
        <Box>
          <Tooltip title="Select all">
            <IconButton size="small" onClick={onSelectAll}>
              <SelectAllIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Deselect all">
            <IconButton size="small" onClick={onDeselectAll}>
              <DeselectIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <FormGroup>
        {cascades.map((c) => {
          const contrib = contributionLabel(c);
          return (
            <FormControlLabel
              key={c.id}
              sx={{ alignItems: "flex-start", mb: 0.25 }}
              control={
                <Checkbox
                  checked={selectedIds.has(c.id)}
                  onChange={() => onToggle(c.id)}
                  size="small"
                  sx={{ pt: 0.25 }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" lineHeight={1.3}>
                    {c.title}
                  </Typography>
                  {contrib && (
                    <Typography variant="caption" color="text.secondary">
                      {contrib}
                    </Typography>
                  )}
                </Box>
              }
            />
          );
        })}
      </FormGroup>
    </Box>
  );
}

function ConfigPanel({
  config,
  onChange,
  cascades,
  cascadeLabel,
  contributionLabel,
}: {
  config: SectionConfig;
  onChange: (update: Partial<SectionConfig>) => void;
  cascades: CascadeOption[];
  cascadeLabel: string;
  contributionLabel: (c: CascadeOption) => string | null;
}) {
  const toggleCascade = (id: string) => {
    const next = new Set(config.includedCascadeIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange({ includedCascadeIds: next });
  };

  return (
    <Stack spacing={2.5}>
      {cascades.length > 0 && (
        <>
          <CascadeSelector
            label={cascadeLabel}
            cascades={cascades}
            selectedIds={config.includedCascadeIds}
            onToggle={toggleCascade}
            onSelectAll={() =>
              onChange({
                includedCascadeIds: new Set(cascades.map((c) => c.id)),
              })
            }
            onDeselectAll={() => onChange({ includedCascadeIds: new Set() })}
            contributionLabel={contributionLabel}
          />
          <Divider />
        </>
      )}

      <FormControl size="small" fullWidth>
        <InputLabel>Tone</InputLabel>
        <Select
          value={config.tone}
          label="Tone"
          onChange={(e) => onChange({ tone: e.target.value as ToneOption })}
        >
          <MenuItem value="formal">Formal</MenuItem>
          <MenuItem value="technical">Technical</MenuItem>
          <MenuItem value="accessible">Accessible</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" fullWidth>
        <InputLabel>Target length</InputLabel>
        <Select
          value={config.wordCount}
          label="Target length"
          onChange={(e) => onChange({ wordCount: Number(e.target.value) })}
        >
          <MenuItem value={100}>~100 words</MenuItem>
          <MenuItem value={200}>~200 words</MenuItem>
          <MenuItem value={350}>~350 words</MenuItem>
          <MenuItem value={500}>~500 words</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Analyst notes"
        placeholder="Add context, caveats, or specific points the AI should address..."
        multiline
        minRows={4}
        size="small"
        value={config.extraContext}
        onChange={(e) => onChange({ extraContext: e.target.value })}
      />
    </Stack>
  );
}

function PromptPanel({ prompt }: { prompt: string }) {
  return (
    <Paper
      variant="outlined"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "grey.50",
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Generated Prompt
        </Typography>
        <CopyButton text={prompt} />
      </Box>
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflow: "auto",
          fontFamily: '"Roboto Mono", "Courier New", monospace',
          fontSize: "0.76rem",
          lineHeight: 1.75,
          whiteSpace: "pre-wrap",
          color: "text.primary",
        }}
      >
        {prompt}
      </Box>
    </Paper>
  );
}

// ─── Section definitions ──────────────────────────────────────────────────────

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "priming", label: "Base Priming" },
  { key: "mrs", label: "MRS Overview" },
  { key: "probability", label: "Probability" },
  { key: "human", label: "Human Impact" },
  { key: "societal", label: "Societal Impact" },
  { key: "environmental", label: "Environmental Impact" },
  { key: "financial", label: "Financial Impact" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RiskAssistantPage() {
  const { riskSummary, riskFile, results } =
    useOutletContext<RiskFilePageContext>();
  const api = useAPI();

  const [activeTab, setActiveTab] = useState<SectionKey>("priming");
  const [primingLevel, setPrimingLevel] = useState<"base" | "tech">("base");
  const [configs, setConfigs] = useState<
    Partial<Record<SectionKey, SectionConfig>>
  >({});

  // ── Data fetching ──────────────────────────────────────────────────────────

  const { data: causeCascades = [], isLoading: loadingCauses } = useQuery({
    queryKey: [
      DataTable.RISK_CASCADE,
      riskSummary._cr4de_risk_file_value,
      "causes",
    ],
    queryFn: () =>
      api.getRiskCascades(
        `$filter=_cr4de_effect_hazard_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_cause_hazard`,
      ),
  });

  const { data: effectCascades = [], isLoading: loadingEffects } = useQuery({
    queryKey: [
      DataTable.RISK_CASCADE,
      riskSummary._cr4de_risk_file_value,
      "effects",
    ],
    queryFn: () =>
      api.getRiskCascades(
        `$filter=_cr4de_cause_hazard_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_effect_hazard`,
      ),
  });

  const scenario = (riskFile?.cr4de_mrs || SCENARIOS.CONSIDERABLE) as SCENARIOS;

  // ── Contribution maps from simulation results ──────────────────────────────

  const probabilityContributions = useMemo<Record<string, number>>(() => {
    return (
      results?.[scenario]?.probabilityStatistics?.relativeContributions.reduce(
        (acc, c) => ({
          ...acc,
          [c.id || ""]: (acc[c.id || ""] || 0) + c.contributionMean,
        }),
        {} as Record<string, number>,
      ) ?? {}
    );
  }, [results, scenario]);

  const impactContributions = useMemo<Record<string, AggregatedImpacts>>(() => {
    return (
      results?.[scenario]?.impactStatistics?.relativeContributions.reduce(
        (acc, c) => ({
          ...acc,
          [c.id || ""]: addImpact(
            acc[c.id || ""] ?? noAggregatedImpacts,
            c.contributionMean,
          ),
        }),
        {} as Record<string, AggregatedImpacts>,
      ) ?? {}
    );
  }, [results, scenario]);

  // ── Process cascades into CascadeOption ───────────────────────────────────

  const processedCauses = useMemo<CascadeOption[]>(() => {
    return (causeCascades as DVRiskCascade<DVRiskFile, unknown>[])
      .filter(
        (c) =>
          (c.cr4de_cause_hazard as DVRiskFile)?.cr4de_risk_type !==
          RISK_TYPE.EMERGING,
      )
      .map((c) => {
        const cause = c.cr4de_cause_hazard as DVRiskFile;
        // TODO: Replace cr4de_riskfileId with the correct PK field name for your DVRiskFile type
        const id: string =
          (cause as any).cr4de_riskfileId ??
          (c as any)._cr4de_cause_hazard_value;
        return {
          id,
          title: cause.cr4de_title ?? "(unknown)",
          definition: stripHTML(cause.cr4de_definition),
          cpMatrix: (c as any).cr4de_quanti_input ?? null,
          // TODO: Verify the qualitative field name on cascade objects (e.g. cr4de_quali_p)
          qualiText: stripHTML((c as any).cr4de_quali_p),
          contributionP: probabilityContributions[id],
        };
      });
  }, [causeCascades, probabilityContributions]);

  const processedEffects = useMemo<CascadeOption[]>(() => {
    return (effectCascades as DVRiskCascade<unknown, DVRiskFile>[])
      .filter(
        (c) =>
          (c.cr4de_effect_hazard as DVRiskFile)?.cr4de_risk_type !==
          RISK_TYPE.EMERGING,
      )
      .map((c) => {
        const effect = c.cr4de_effect_hazard as DVRiskFile;
        const id: string =
          (effect as any).cr4de_riskfileId ??
          (c as any)._cr4de_effect_hazard_value;
        const contrib = impactContributions[id];
        return {
          id,
          title: effect.cr4de_title ?? "(unknown)",
          definition: stripHTML(effect.cr4de_definition),
          // TODO: Verify qualitative field names for impact cascades
          qualiText: stripHTML(
            (c as any).cr4de_quali_h ??
              (c as any).cr4de_quali_s ??
              (c as any).cr4de_quali_e ??
              (c as any).cr4de_quali_f,
          ),
          contributionH: contrib?.h,
          contributionS: contrib?.s,
          contributionE: contrib?.e,
          contributionF: contrib?.f,
          contributionAll: contrib?.all,
        };
      });
  }, [effectCascades, impactContributions]);

  // ── Active section data ────────────────────────────────────────────────────

  const activeCascades = useMemo<CascadeOption[]>(() => {
    if (activeTab === "probability") return processedCauses;
    if (["human", "societal", "environmental", "financial"].includes(activeTab))
      return processedEffects;
    return [];
  }, [activeTab, processedCauses, processedEffects]);

  const activeConfig = useMemo<SectionConfig>(() => {
    return configs[activeTab] ?? defaultConfig(activeCascades);
  }, [activeTab, activeCascades, configs]);

  const updateConfig = (update: Partial<SectionConfig>) =>
    setConfigs((prev) => ({
      ...prev,
      [activeTab]: { ...activeConfig, ...update },
    }));

  // ── Contribution label helper per section ─────────────────────────────────

  const contributionLabel = useMemo(
    () =>
      (c: CascadeOption): string | null => {
        if (activeTab === "probability" && c.contributionP !== undefined)
          return `${(c.contributionP * 100).toFixed(1)}% of total probability`;
        const key = activeTab as
          | "human"
          | "societal"
          | "environmental"
          | "financial";
        const letter = key[0] as "h" | "s" | "e" | "f";
        const val = c[
          `contribution${letter.toUpperCase()}` as keyof CascadeOption
        ] as number | undefined;
        if (val !== undefined)
          return `${(val * 100).toFixed(1)}% of ${key} impact`;
        return null;
      },
    [activeTab],
  );

  // ── Prompt generation ─────────────────────────────────────────────────────

  const activePrompt = useMemo(() => {
    switch (activeTab) {
      case "priming": {
        const selected = primingLevel === "tech" ? techPrompt : basePrompt;
        return activeConfig.extraContext
          ? `${selected}\n\n───────────────────────────────────────────────────────\nADDITIONAL ANALYST NOTES:\n${activeConfig.extraContext}`
          : selected;
      }
      case "mrs":
        return riskFile
          ? buildMRSPrompt(riskSummary, riskFile, results, activeConfig)
          : "";
      case "probability":
        return buildProbabilityPrompt(
          riskSummary,
          riskFile,
          results,
          processedCauses,
          activeConfig,
        );
      case "human":
      case "societal":
      case "environmental":
      case "financial":
        return buildImpactPrompt(
          activeTab,
          riskSummary,
          riskFile,
          results,
          processedEffects,
          activeConfig,
        );
    }
  }, [
    activeTab,
    primingLevel,
    riskSummary,
    riskFile,
    results,
    processedCauses,
    processedEffects,
    activeConfig,
  ]);

  const cascadeLabel =
    activeTab === "probability"
      ? "Cause risks"
      : ["human", "societal", "environmental", "financial"].includes(activeTab)
        ? "Effect risks"
        : "";

  const isPrimingTab = activeTab === "priming";
  const isLoading = loadingCauses || loadingEffects;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Container maxWidth="xl" sx={{ mt: 2, pb: 8 }}>
      <RiskFileTitle riskSummary={riskSummary} />

      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="body2" color="text.secondary" maxWidth={720}>
          Generate section-specific AI prompts for the risk analysis. Select
          which cascading risks to include, adjust tone and length, add analyst
          notes, then copy the prompt into your AI assistant of choice. Prompts
          include quantitative results, scenario parameters, conditional
          probability matrices, and expert qualitative justifications.
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v: SectionKey) => setActiveTab(v)}
          textColor="primary"
          indicatorColor="primary"
        >
          {SECTIONS.map((s) => (
            <Tab key={s.key} value={s.key} label={s.label} />
          ))}
        </Tabs>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          height: "calc(100vh - 340px)",
          minHeight: 520,
        }}
      >
        {/* Left: Configuration */}
        <Paper
          variant="outlined"
          sx={{
            width: 290,
            flexShrink: 0,
            p: 2.5,
            overflow: "auto",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Configuration
          </Typography>
          {isPrimingTab ? (
            <Stack spacing={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Prompt level</InputLabel>
                <Select
                  value={primingLevel}
                  label="Prompt level"
                  onChange={(e) =>
                    setPrimingLevel(e.target.value as "base" | "tech")
                  }
                >
                  <MenuItem value="base">Basic / high-level</MenuItem>
                  <MenuItem value="tech">Technical</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Append analyst notes"
                placeholder="Any additional context to append to the base prompt..."
                multiline
                minRows={6}
                size="small"
                value={activeConfig.extraContext}
                onChange={(e) => updateConfig({ extraContext: e.target.value })}
              />
            </Stack>
          ) : isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <ConfigPanel
              config={activeConfig}
              onChange={updateConfig}
              cascades={activeCascades}
              cascadeLabel={cascadeLabel}
              contributionLabel={contributionLabel}
            />
          )}
        </Paper>

        {/* Right: Generated prompt */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <PromptPanel prompt={activePrompt} />
        </Box>
      </Box>
    </Container>
  );
}
