import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { ScenarioInput } from "../fields";
import { DPSlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";
import { ReactNode } from "react";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";

export default function DPSection({
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
  const handleChangeDPValue = (newValue: string | null) => {
    fieldsRef.cr4de_dp_quanti = newValue;
  };

  return (
    <Stack sx={{}} rowGap={2}>
      <Typography variant="h6">
        <Trans i18nKey="2A.dp.title">Direct Probability</Trans>
      </Typography>

      <Typography variant="body2">
        <Trans i18nKey="2A.dp.quanti.info.1">Explanation about filling in the direct probabilty value</Trans>
      </Typography>

      <Box component={Paper} sx={{ mx: 2, p: 2, mb: 4 }}>
        <Typography variant="subtitle2">
          <Trans i18nKey="2A.dp.quanti.dp.title">DP - Direct Probability</Trans>
        </Typography>

        <DPSlider
          initialValue={fieldsRef.cr4de_dp_quanti}
          error={inputErrors.indexOf("cr4de_dp_quanti") >= 0}
          onChange={handleChangeDPValue}
        />
      </Box>

      <Typography variant="body2">
        <Trans i18nKey="2A.dp.quali.info.1">Explanation about filling in the direct probabilty textbox</Trans>
      </Typography>

      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_dp_quali") >= 0}
        initialValue={fieldsRef.cr4de_dp_quali || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_dp_quali = newValue;
        }}
        debounceInterval={100}
        attachments={attachments}
        onOpenSourceDialog={onOpenSourceDialog}
        onReloadAttachments={onReloadAttachments}
      />
    </Stack>
  );
}