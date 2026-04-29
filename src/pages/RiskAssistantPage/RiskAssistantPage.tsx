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
import { AggregatedImpacts, noAggregatedImpacts } from "../../types/simulation";
import { addImpact } from "../../functions/simulation/math";

import {
  SectionKey,
  ToneOption,
  CascadeOption,
  SectionConfig,
  defaultConfig,
  stripHTML,
} from "./types";
import { BasePromptConfig, buildBasePrompt } from "./BasePromptTab";
import { buildMRSPrompt } from "./MRSPromptTab";
import { buildImpactPrompt } from "./ImpactPromptTab";
import { buildProbabilityPrompt } from "./ProbabilityPromptTab";
import { buildSummaryPrompt } from "./SummaryPromptTab";

// ─── Shared UI components ─────────────────────────────────────────────────────

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
  { key: "summary", label: "Risk Summary" }, // ← new
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

  const causeRiskFileIds = useMemo(
    () =>
      (causeCascades as DVRiskCascade<DVRiskFile, unknown>[])
        .map((c) => {
          const cause = c.cr4de_cause_hazard as DVRiskFile;
          return (
            (cause as any).cr4de_riskfileId ??
            (c as any)._cr4de_cause_hazard_value
          );
        })
        .filter(Boolean) as string[],
    [causeCascades],
  );

  const { data: causeRiskResults = {}, isLoading: loadingCauseResults } =
    useQuery({
      queryKey: [DataTable.RISK_FILE, "cause-sub-results", causeRiskFileIds],
      enabled: causeRiskFileIds.length > 0,
      queryFn: async () => {
        const files = await api.getRiskFiles<DVRiskFile>(
          `$filter=${causeRiskFileIds
            .map((id) => `cr4de_riskfilesid eq ${id}`)
            .join(" or ")}` +
            `&$select=cr4de_riskfilesid,cr4de_title,cr4de_quanti_results,` +
            `cr4de_mrs,cr4de_scenario_considerable,cr4de_scenario_major,cr4de_scenario_extreme`,
        );
        return Object.fromEntries(
          files.map((f) => [
            (f as any).cr4de_riskfilesid,
            {
              results: JSON.parse(
                (f as any).cr4de_quanti_results ?? "null",
              ) as RiskFileQuantiResults | null,
              mrs: (f as any).cr4de_mrs as SCENARIOS | null,
              scenarioConsiderable:
                (f as any).cr4de_scenario_considerable ?? null,
              scenarioMajor: (f as any).cr4de_scenario_major ?? null,
              scenarioExtreme: (f as any).cr4de_scenario_extreme ?? null,
            },
          ]),
        );
      },
    });

  const effectRiskFileIds = useMemo(
    () =>
      (effectCascades as DVRiskCascade<unknown, DVRiskFile>[])
        .map((c) => {
          const effect = c.cr4de_effect_hazard as DVRiskFile;
          return (
            (effect as any).cr4de_riskfileId ??
            (c as any)._cr4de_effect_hazard_value
          );
        })
        .filter(Boolean) as string[],
    [effectCascades],
  );

  const { data: effectRiskResults = {} } = useQuery({
    queryKey: [DataTable.RISK_FILE, "effect-sub-results", effectRiskFileIds],
    enabled: effectRiskFileIds.length > 0,
    queryFn: async () => {
      const files = await api.getRiskFiles<DVRiskFile>(
        `$filter=${effectRiskFileIds
          .map((id) => `cr4de_riskfilesid eq ${id}`)
          .join(" or ")}` +
          `&$select=cr4de_riskfilesid,cr4de_title,cr4de_quanti_results,` +
          `cr4de_mrs,cr4de_scenario_considerable,cr4de_scenario_major,cr4de_scenario_extreme`,
      );

      return Object.fromEntries(
        files.map((f) => {
          return [
            (f as any).cr4de_riskfilesid,
            {
              results: JSON.parse(
                (f as any).cr4de_quanti_results ?? "null",
              ) as RiskFileQuantiResults | null,
              mrs: (f as any).cr4de_mrs as SCENARIOS | null,
              scenarioConsiderable: f.cr4de_scenario_considerable ?? "{}",
              scenarioMajor: f.cr4de_scenario_major ?? "{}",
              scenarioExtreme: f.cr4de_scenario_extreme ?? "{}",
            },
          ];
        }),
      );
    },
  });

  const scenario = (riskFile?.cr4de_mrs || SCENARIOS.CONSIDERABLE) as SCENARIOS;

  // ── Contribution maps ──────────────────────────────────────────────────────

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

  // Per-scenario probability contributions (all three scenarios, not just MRS)
  const probabilityContributionsByScenario = useMemo<
    Record<string, Partial<Record<SCENARIOS, number>>>
  >(() => {
    const out: Record<string, Partial<Record<SCENARIOS | "", number>>> = {};

    const contribs =
      results?.[scenario]?.probabilityStatistics?.relativeContributions ?? [];
    for (const c of contribs) {
      const id = c.id ?? "";
      if (!out[id]) out[id] = {};
      out[id][c.scenario || ""] = c.contributionMean;
    }

    return out;
  }, [results]);

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

  // Per-scenario impact contributions (all three scenarios, not just MRS)
  const impactContributionsByScenario = useMemo<
    Record<string, Partial<Record<SCENARIOS, AggregatedImpacts>>>
  >(() => {
    const out: Record<
      string,
      Partial<Record<SCENARIOS | "", AggregatedImpacts>>
    > = {};

    const contribs =
      results?.[scenario]?.impactStatistics?.relativeContributions ?? [];
    for (const c of contribs) {
      const id = c.id ?? "";
      if (!out[id]) out[id] = {};
      out[id][c.scenario || ""] = c.contributionMean;
    }

    return out;
  }, [results]);

  // ── Process cascades ───────────────────────────────────────────────────────

  const processedCauses = useMemo<CascadeOption[]>(() => {
    return (causeCascades as DVRiskCascade<DVRiskFile, unknown>[])
      .filter(
        (c) =>
          (c.cr4de_cause_hazard as DVRiskFile)?.cr4de_risk_type !==
          RISK_TYPE.EMERGING,
      )
      .map((c) => {
        const cause = c.cr4de_cause_hazard as DVRiskFile;
        const id: string =
          (cause as any).cr4de_riskfileId ??
          (c as any)._cr4de_cause_hazard_value;
        const causeData = causeRiskResults[id] ?? {};

        const rawCP: Record<string, number | null> = {
          c2c: (c as any).cr4de_c2c ?? null,
          m2c: (c as any).cr4de_m2c ?? null,
          e2c: (c as any).cr4de_e2c ?? null,
          c2m: (c as any).cr4de_c2m ?? null,
          m2m: (c as any).cr4de_m2m ?? null,
          e2m: (c as any).cr4de_e2m ?? null,
          c2e: (c as any).cr4de_c2e ?? null,
          m2e: (c as any).cr4de_m2e ?? null,
          e2e: (c as any).cr4de_e2e ?? null,
        };

        return {
          id,
          title: cause.cr4de_title ?? "(unknown)",
          definition: stripHTML(cause.cr4de_definition),
          cpMatrix: (c as any).cr4de_quanti_input ?? null,
          rawCP,
          qualiText: stripHTML((c as any).cr4de_quali),
          contributionP: probabilityContributions[id] ?? 0,
          contributionsByScenarioP:
            probabilityContributionsByScenario[id] ?? {},
          _subResults: causeData.results ?? null,
          scenarioMrs: causeData.mrs ?? null,
          scenarioConsiderable: causeData.scenarioConsiderable ?? null,
          scenarioMajor: causeData.scenarioMajor ?? null,
          scenarioExtreme: causeData.scenarioExtreme ?? null,
          defaultInclude: true,
        };
      })
      .sort((a, b) => (b.contributionP ?? 0) - (a.contributionP ?? 0));
  }, [causeCascades, probabilityContributions, causeRiskResults]);

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
        const effectData = effectRiskResults[id] ?? {};

        return {
          id,
          title: effect.cr4de_title ?? "(unknown)",
          definition: stripHTML(effect.cr4de_definition),
          qualiText: stripHTML((c as any).cr4de_quali),
          contributionH: contrib?.h ?? 0,
          contributionS: contrib?.s ?? 0,
          contributionE: contrib?.e ?? 0,
          contributionF: contrib?.f ?? 0,
          contributionAll: contrib?.all ?? 0,
          contributionsByScenario: impactContributionsByScenario[id] ?? {},
          _subResults: effectData.results ?? null,
          // Scenario fields
          scenarioMrs: effectData.mrs ?? null,
          scenarioConsiderable: effectData.scenarioConsiderable ?? null,
          scenarioMajor: effectData.scenarioMajor ?? null,
          scenarioExtreme: effectData.scenarioExtreme ?? null,
          defaultInclude: true,
        };
      });
  }, [
    effectCascades,
    impactContributions,
    impactContributionsByScenario,
    effectRiskResults,
  ]);

  // ── Active section data ────────────────────────────────────────────────────

  const activeCascades = useMemo<CascadeOption[]>(() => {
    if (activeTab === "probability")
      return processedCauses.map((x) => ({
        ...x,
        defaultInclude: (x.contributionP || 0) > 0.1,
      }));
    if (
      ["human", "societal", "environmental", "financial"].includes(activeTab)
    ) {
      const sortKey: keyof CascadeOption =
        activeTab === "human"
          ? "contributionH"
          : activeTab === "societal"
            ? "contributionS"
            : activeTab === "environmental"
              ? "contributionE"
              : "contributionF";
      return [...processedEffects]
        .sort(
          (a, b) =>
            ((b[sortKey] as number) ?? 0) - ((a[sortKey] as number) ?? 0),
        )
        .map((x) => ({
          ...x,
          defaultInclude: ((x[sortKey] as number) ?? 0) > 0.1,
        }));
    }
    return [];
  }, [activeTab, processedCauses, processedEffects]);

  const activeConfig = useMemo<SectionConfig>(
    () => configs[activeTab] ?? defaultConfig(activeCascades),
    [activeTab, activeCascades, configs],
  );

  const updateConfig = (update: Partial<SectionConfig>) =>
    setConfigs((prev) => ({
      ...prev,
      [activeTab]: { ...activeConfig, ...update },
    }));

  // ── Contribution label ─────────────────────────────────────────────────────

  const contributionLabel = useMemo(
    () =>
      (c: CascadeOption): string | null => {
        if (activeTab === "probability")
          return `${((c.contributionP ?? 0) * 100).toFixed(1)}% of total probability`;
        if (
          ["human", "societal", "environmental", "financial"].includes(
            activeTab,
          )
        ) {
          const letter = activeTab[0].toUpperCase() as "H" | "S" | "E" | "F";
          const val = c[`contribution${letter}` as keyof CascadeOption] as
            | number
            | undefined;
          return val !== undefined
            ? `${(val * 100).toFixed(1)}% of ${activeTab} impact`
            : null;
        }
        return null;
      },
    [activeTab],
  );

  // ── Prompt generation ──────────────────────────────────────────────────────

  const activePrompt = useMemo(() => {
    switch (activeTab) {
      case "priming":
        return buildBasePrompt(primingLevel, activeConfig.extraContext);
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
          activeCascades,
          activeConfig,
        );
      case "summary":
        return riskFile
          ? buildSummaryPrompt(riskSummary, riskFile, results, activeConfig)
          : "";
    }
  }, [
    activeTab,
    primingLevel,
    riskSummary,
    riskFile,
    results,
    processedCauses,
    activeCascades,
    activeConfig,
  ]);

  const cascadeLabel =
    activeTab === "probability"
      ? "Cause risks"
      : ["human", "societal", "environmental", "financial"].includes(activeTab)
        ? "Effect risks"
        : "";

  const isPrimingTab = activeTab === "priming";
  const isLoading = loadingCauses || loadingEffects || loadingCauseResults;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Container maxWidth="xl" sx={{ mt: 2, pb: 8 }}>
      <RiskFileTitle riskSummary={riskSummary} />

      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="body2" color="text.secondary" maxWidth={720}>
          Generate section-specific AI prompts for the risk analysis. Select
          which cascading risks to include, adjust tone and length, add analyst
          notes, then copy the prompt into your AI assistant of choice.
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
        <Paper
          variant="outlined"
          sx={{ width: 290, flexShrink: 0, p: 2.5, overflow: "auto" }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Configuration
          </Typography>
          {isPrimingTab ? (
            <BasePromptConfig
              level={primingLevel}
              onLevelChange={setPrimingLevel}
              config={activeConfig}
              onConfigChange={updateConfig}
            />
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

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <PromptPanel prompt={activePrompt} />
        </Box>
      </Box>
    </Container>
  );
}
