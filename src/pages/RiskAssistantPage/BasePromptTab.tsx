import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { basePrompt, techPrompt } from "./Prompts";
import { SectionConfig } from "./types";

// ─── Prompt builder ───────────────────────────────────────────────────────────

export function buildBasePrompt(
  level: "base" | "tech",
  extraContext: string,
): string {
  const selected = level === "tech" ? techPrompt : basePrompt;
  return extraContext
    ? `${selected}\n\n───────────────────────────────────────────────────────\nADDITIONAL ANALYST NOTES:\n${extraContext}`
    : selected;
}

// ─── Config panel ─────────────────────────────────────────────────────────────

interface BasePromptConfigProps {
  level: "base" | "tech";
  onLevelChange: (level: "base" | "tech") => void;
  config: SectionConfig;
  onConfigChange: (update: Partial<SectionConfig>) => void;
}

export function BasePromptConfig({
  level,
  onLevelChange,
  config,
  onConfigChange,
}: BasePromptConfigProps) {
  return (
    <Stack spacing={2}>
      <FormControl size="small" fullWidth>
        <InputLabel>Prompt level</InputLabel>
        <Select
          value={level}
          label="Prompt level"
          onChange={(e) => onLevelChange(e.target.value as "base" | "tech")}
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
        value={config.extraContext}
        onChange={(e) => onConfigChange({ extraContext: e.target.value })}
      />
    </Stack>
  );
}
