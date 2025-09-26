import { ReactNode } from "react";
import {
  DVRiskSnapshot,
  RiskSnapshotQualis,
  RiskSnapshotResults,
  RiskSnapshotScenarioQualis,
} from "../../types/dataverse/DVRiskSnapshot";
import RiskDataAccordion from "./RiskDataAccordion";
import { Stack, Typography } from "@mui/material";
import { SCENARIOS } from "../../functions/scenarios";
import { ScenarioSection } from "./ScenarioSection";
import { DI_FIELD, DP_FIELD } from "../../types/dataverse/DVRiskFile";

export function DirectSection({
  riskFile,
  quantiFields,
  qualiField,
  title,
  subtitle = null,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults, RiskSnapshotQualis>;
  quantiFields: (DP_FIELD | DI_FIELD)[];
  qualiField: keyof RiskSnapshotScenarioQualis;
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <RiskDataAccordion
      title={
        <Stack direction="row">
          <Typography sx={{ flex: 1 }}>{title}</Typography>
          {subtitle}
        </Stack>
      }
    >
      <Stack direction="row" sx={{ width: "100%", justifyContent: "stretch" }}>
        <ScenarioSection
          riskFile={riskFile}
          quantiFields={quantiFields}
          qualiField={qualiField}
          scenario={SCENARIOS.CONSIDERABLE}
        />
        <ScenarioSection
          riskFile={riskFile}
          quantiFields={quantiFields}
          qualiField={qualiField}
          scenario={SCENARIOS.MAJOR}
        />
        <ScenarioSection
          riskFile={riskFile}
          quantiFields={quantiFields}
          qualiField={qualiField}
          scenario={SCENARIOS.EXTREME}
        />
      </Stack>
    </RiskDataAccordion>
  );
}
