import { Alert, Box, Paper, Stack, Typography, Button } from "@mui/material";
import { ForwardedRef, ReactNode, Ref, RefObject } from "react";
import { Trans } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DirectImpactField } from "../../learning/QuantitativeScales/DI";
import { Ea } from "../../learning/QuantitativeScales/E";
import { Ha, Hb, Hc } from "../../learning/QuantitativeScales/H";
import { ScenarioInput } from "../fields";
import { DISlider, DPSlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";

export default function ESection({
  fieldsRef,
  inputErrors,
  attachments,
  onOpenSourceDialog,
  onReloadAttachments,
  onOpenEffects,
}: {
  fieldsRef: ScenarioInput;
  inputErrors: (keyof ScenarioInput)[];
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  onOpenSourceDialog: (existingSource?: DVAttachment) => void;
  onReloadAttachments: () => Promise<void>;
  onOpenEffects: () => void;
}) {
  const handleChangeDIValue = (newValue: string | null, field: DirectImpactField) => {
    fieldsRef[`cr4de_di_quanti_${field.prefix.toLowerCase()}` as keyof ScenarioInput] = newValue;
  };

  return (
    <Stack sx={{}} rowGap={2}>
      <Typography variant="h6">
        <Trans i18nKey="2A.e.title">Direct Environmental Impact</Trans>
      </Typography>
      <Typography variant="body2">
        <Trans i18nKey="2A.e.quanti.info.1">
          Please select a quantitative estimation below for each of the damage indicators for the direct environmental
          impact of the current intensity scenarios.
        </Trans>
      </Typography>
      <Alert severity="warning">
        <Trans i18nKey="2A.e.quanti.info.2">
          In this step, you should only estimate the <b>direct</b> environmental impact. For example, when estimating
          the direct impact of an <i>Earthquake</i>, the environmental impact due to a possible <i>Dam failure</i>
          should not be considered. This possibility will be explored when estimating the conditional probabilities in
          the following phase.
        </Trans>
        <Box sx={{ marginLeft: -1 }}>
          <Button color="warning" onClick={onOpenEffects}>
            <Trans i18nKey="button.showConsequences">Show Potential Consequences</Trans>
          </Button>
        </Box>
      </Alert>
      <Box component={Paper} sx={{ mx: 2, p: 2, mb: 4 }}>
        <Typography variant="subtitle2">
          <Trans i18nKey="2A.e.quanti.ea.title">Ea - Damaged ecosystems</Trans>
        </Typography>

        <DISlider
          field={Ea}
          initialValue={fieldsRef.cr4de_di_quanti_ea}
          error={inputErrors.indexOf("cr4de_di_quanti_ea") >= 0}
          onChange={handleChangeDIValue}
        />
      </Box>
      <Typography variant="body2">
        <Trans i18nKey="2A.e.quali.info.1">
          Please use the field below to explain your reasoning for the quantitative estimations given in the previous
          section.
        </Trans>
      </Typography>{" "}
      <Typography variant="caption">
        <Trans i18nKey="2A.e.quali.info.2">
          Example: an <i>Incident in a SEVESO installation</i> might have a direct impact on the surrounding area,
          albeit very limited. The next link in the risk chain (e.g. <i>Release of Chemical Agents</i>) will have a more
          clear environmental impact. <i>Chronic pollution of soil</i> will have a very clear environmental impact and
          will damage ecosystems for a specific timeperiod
        </Trans>
      </Typography>
      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_di_quali_e") >= 0}
        initialValue={fieldsRef.cr4de_di_quali_e || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_di_quali_e = newValue;
        }}
        debounceInterval={100}
        attachments={attachments}
        onOpenSourceDialog={onOpenSourceDialog}
        onReloadAttachments={onReloadAttachments}
      />
    </Stack>
  );
}
