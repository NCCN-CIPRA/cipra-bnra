import { Box, Paper, Stack, Typography } from "@mui/material";
import { ForwardedRef, Ref, RefObject } from "react";
import { Trans } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { ScenarioInput } from "../fields";
import { DPSlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";
import { ReactNode } from "react";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";

export default function CBSection({
  fieldsRef,
  inputErrors,
  attachments,
  onOpenSourceDialog,
  onReloadAttachments,
}: {
  fieldsRef: ScenarioInput;
  inputErrors: (keyof ScenarioInput)[];
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  onOpenSourceDialog: (existingSource?: DVAttachment) => void;
  onReloadAttachments: () => Promise<void>;
}) {
  return (
    <Stack sx={{}} rowGap={2}>
      <Typography variant="h6">
        <Trans i18nKey="2A.cb.title">Cross-border Impact</Trans>
      </Typography>
      <Typography variant="body2">
        <Trans i18nKey="2A.cb.quali.info.1">Explanation about filling in the cross-border impact textbox</Trans>
      </Typography>

      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_cross_border_impact_quali") >= 0}
        initialValue={fieldsRef.cr4de_cross_border_impact_quali || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_cross_border_impact_quali = newValue;
        }}
        debounceInterval={100}
        attachments={attachments}
        onOpenSourceDialog={onOpenSourceDialog}
        onReloadAttachments={onReloadAttachments}
      />
    </Stack>
  );
}
