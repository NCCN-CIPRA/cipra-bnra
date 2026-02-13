import { ReactNode } from "react";
import {
  DVRiskSnapshot,
  RiskSnapshotResults,
} from "../../types/dataverse/DVRiskSnapshot";
import RiskDataAccordion from "./RiskDataAccordion";
import { Stack, Typography } from "@mui/material";
import { SCENARIOS } from "../../functions/scenarios";
import { DI_FIELD, DP_FIELD } from "../../types/dataverse/DVRiskFile";
import { RiskQualis, RiskScenarioQualis } from "../../types/dataverse/Riskfile";
import { MotivationScenarioSection } from "./MotivationScenarioSection";

export function MotivationSection({
  riskFile,
  quantiFields,
  qualiField,
  title,
  subtitle = null,
}: {
  riskFile: DVRiskSnapshot<unknown, RiskSnapshotResults, RiskQualis>;
  quantiFields: (DP_FIELD | DI_FIELD)[];
  qualiField: keyof RiskScenarioQualis;
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <RiskDataAccordion
      title={
        <Stack direction="row" alignItems="center">
          <Typography sx={{ flex: 1 }}>{title}</Typography>
          {subtitle}
        </Stack>
      }
    >
      <Stack direction="row" sx={{ width: "100%", justifyContent: "stretch" }}>
        <MotivationScenarioSection
          riskFile={riskFile}
          quantiFields={quantiFields}
          qualiField={qualiField}
          scenario={SCENARIOS.CONSIDERABLE}
        />
        <MotivationScenarioSection
          riskFile={riskFile}
          quantiFields={quantiFields}
          qualiField={qualiField}
          scenario={SCENARIOS.MAJOR}
        />
        <MotivationScenarioSection
          riskFile={riskFile}
          quantiFields={quantiFields}
          qualiField={qualiField}
          scenario={SCENARIOS.EXTREME}
        />
      </Stack>
    </RiskDataAccordion>
  );
}
