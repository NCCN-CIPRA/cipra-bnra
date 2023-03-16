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
        <Trans i18nKey="2A.cb.quali.info.1">
          Cross-border impact is identified by the Reporting Guidelines on Disaster Risk Management, Art. 6(1)d of
          Decision No 1313/2013/EU as:
        </Trans>
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: "italic", px: 2 }}>
        <Trans i18nKey="2A.cb.quali.info.2">
          ``Impacts resulting from risks generated in a neighbouring country or countries impacts that spill over into a
          neighbouring country or countries impacts affecting two or more countries simultaneously.´´
        </Trans>
      </Typography>
      <Typography variant="body2">
        <Trans i18nKey="2A.cb.quali.info.3">
          Please indicate below if a cross-border impact is possible for this hazard and why.
        </Trans>
      </Typography>
      <Typography variant="caption">
        <Trans i18nKey="2A.cb.quali.info.4">
          Example: A <i>Nuclear Plant Incident</i> on Belgian soil may have an impact on the neighbouring countries
          because some plants are close to the French, Dutch or German border and any released nuclear agents may easily
          spread across international borders.
        </Trans>
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
