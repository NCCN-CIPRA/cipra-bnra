import { Box, IconButton, Paper, Stack, Typography, Tooltip, Button } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { DirectImpactField } from "../../learning/QuantitativeScales/DI";
import { Ha, Hb, Hc } from "../../learning/QuantitativeScales/H";
import { ScenarioInput } from "../fields";
import { DISlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";
import { ReactNode, useState } from "react";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import CalculateIcon from "@mui/icons-material/Calculate";
import HbCalculator from "./HbCalculator";
import { Alert } from "@mui/lab";

export default function HSection({
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
  const { t } = useTranslation();

  const [HbCalculatorOpen, setHbCalculatorOpen] = useState(false);
  const [HbOverride, setHbOverride] = useState<string | undefined>(undefined);

  const handleChangeDIValue = (newValue: string | null, field: DirectImpactField) => {
    fieldsRef[`cr4de_di_quanti_${field.prefix.toLowerCase()}` as keyof ScenarioInput] = newValue;
  };

  return (
    <Stack sx={{}} rowGap={2}>
      <Typography variant="h6">
        <Trans i18nKey="2A.h.title">Direct Human Impact</Trans>
      </Typography>
      <Typography variant="body2">
        <Trans i18nKey="2A.h.quanti.info.1">
          Please select a quantitative estimation below for each of the damage indicators for the direct human impact of
          the current intensity scenarios.
        </Trans>
      </Typography>
      <Alert severity="warning">
        <Trans i18nKey="2A.h.quanti.info.2">
          In this step, you should only estimate the <b>direct</b> human impact. For example, when estimating the direct
          impact of an <i>Earthquake</i>, the impact due to a possible <i>Dam failure</i> should not be considered. This
          possibility will be explored when estimating the conditional probabilities in the following phase.
        </Trans>
        <Box sx={{ marginLeft: -1 }}>
          <Button color="warning" onClick={onOpenEffects}>
            <Trans i18nKey="button.showConsequences">Show Potential Consequences</Trans>
          </Button>
        </Box>
      </Alert>
      <Box component={Paper} sx={{ mx: 2, p: 2, mb: 4 }} id="step2A-h-quantitative-box">
        <Typography variant="subtitle2">
          <Trans i18nKey="2A.h.quanti.ha.title">Ha - Fatalities</Trans>
        </Typography>

        <DISlider
          field={Ha}
          initialValue={fieldsRef.cr4de_di_quanti_ha}
          error={inputErrors.indexOf("cr4de_di_quanti_ha") >= 0}
          onChange={handleChangeDIValue}
        />

        <Box sx={{ mt: 4, display: "flex" }}>
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            <Trans i18nKey="2A.h.quanti.hb.title">Hb - Injured / sick people</Trans>
          </Typography>
          <Tooltip title={t("button.di.calculator.tooltip", "Calculate the damage scale with weights")}>
            <IconButton onClick={() => setHbCalculatorOpen(true)} id="step2A-hb-calculator-button">
              <CalculateIcon />
            </IconButton>
          </Tooltip>
          <HbCalculator
            open={HbCalculatorOpen}
            onClose={() => setHbCalculatorOpen(false)}
            onApply={(newValue, qualiInput) => {
              handleChangeDIValue(newValue, Hb);
              setHbOverride(newValue);
              setHbCalculatorOpen(false);

              if (qualiInput) {
                fieldsRef.cr4de_di_quali_h += qualiInput;
              }
            }}
          />
        </Box>

        <DISlider
          field={Hb}
          initialValue={fieldsRef.cr4de_di_quanti_hb}
          overrideValue={HbOverride}
          resetOverrideValue={() => setHbOverride(undefined)}
          error={inputErrors.indexOf("cr4de_di_quanti_hb") >= 0}
          onChange={handleChangeDIValue}
        />

        <Typography variant="subtitle2" sx={{ mt: 4 }}>
          <Trans i18nKey="2A.h.quanti.hc.title">Hc - People in need of assistance</Trans>
        </Typography>

        <DISlider
          field={Hc}
          initialValue={fieldsRef.cr4de_di_quanti_hc}
          error={inputErrors.indexOf("cr4de_di_quanti_hc") >= 0}
          onChange={handleChangeDIValue}
        />
      </Box>
      <Typography variant="body2">
        <Trans i18nKey="2A.h.quali.info.1">
          Please use the field below to explain your reasoning for the quantitative estimations given in the previous
          section.
        </Trans>
      </Typography>{" "}
      <Typography variant="caption">
        <Trans i18nKey="2A.h.quali.info.2">
          Example: <i>Heatwaves</i> cause dehydration, heat stroke and exhaustion, which have a significant negative
          impact on health. They lead to increased mortality and morbidity, especially in vulnerable groups (young
          children and the elderly). For a considerable scenario, we can expect between 1000 and 1500 people to die
          (mainly aged 85 years or more).
        </Trans>
      </Typography>
      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_di_quali_h") >= 0}
        initialValue={fieldsRef.cr4de_di_quali_h || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_di_quali_h = newValue;
        }}
        debounceInterval={100}
        attachments={attachments}
        onOpenSourceDialog={onOpenSourceDialog}
        onReloadAttachments={onReloadAttachments}
      />
    </Stack>
  );
}
