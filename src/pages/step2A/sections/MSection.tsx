import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { ScenarioInput } from "../fields";
import { DPSlider, MSlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";
import { ReactNode } from "react";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";

export default function MSection({
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
        <Trans i18nKey="2A.m.title">Motivation</Trans>
      </Typography>

      <Typography variant="body2">
        <Trans i18nKey="2A.m.quanti.info.1">
          Please select a quantitative estimation below for the motivation of the current actor capabilities.
        </Trans>
      </Typography>
      {/* <Alert severity="warning">
        <Trans i18nKey="2A.dp.quanti.info.2">
          In this step, you should only estimate the <b>direct</b> probability. For example, when estimating the direct
          probability of a <i>Dam failure</i>, the possibility that a dam fails due to an earthquake should not be
          considered. This possibility will be explored when estimating the conditional probabilities in the following
          phase.
        </Trans>
      </Alert> */}

      <Box component={Paper} sx={{ mx: 2, p: 2, mb: 4 }} id="step2A-m-quantitative-box">
        <Typography variant="subtitle2">
          <Trans i18nKey="2A.m.quanti.dp.title">M - Motivation</Trans>
        </Typography>

        <MSlider
          initialValue={fieldsRef.cr4de_dp_quanti}
          error={inputErrors.indexOf("cr4de_dp_quanti") >= 0}
          onChange={handleChangeDPValue}
        />
      </Box>

      <Typography variant="body2">
        <Trans i18nKey="2A.m.quali.info.1">
          Please use the field below to explain your reasoning for the quantitative estimation given in the previous
          section.
        </Trans>
      </Typography>

      <QualiTextInputBox
        id="step2A-m-quali-box"
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
