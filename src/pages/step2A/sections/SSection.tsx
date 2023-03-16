import { Box, Paper, Stack, Typography, Tooltip, IconButton, Alert } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { DirectImpactField } from "../../learning/QuantitativeScales/DI";
import { Sa, Sb, Sc, Sd } from "../../learning/QuantitativeScales/S";
import { ScenarioInput } from "../fields";
import { DISlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";
import { ReactNode, useState } from "react";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import CalculateIcon from "@mui/icons-material/Calculate";
import SaCalculator from "./SaCalculator";

export default function SSection({
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
  const { t } = useTranslation();

  const [SaCalculatorOpen, setSaCalculatorOpen] = useState(false);
  const [SaOverride, setSaOverride] = useState<string | undefined>(undefined);

  const handleChangeDIValue = (newValue: string | null, field: DirectImpactField) => {
    fieldsRef[`cr4de_di_quanti_${field.prefix.toLowerCase()}` as keyof ScenarioInput] = newValue;
  };

  return (
    <Stack sx={{}} rowGap={2}>
      <Typography variant="h6">
        <Trans i18nKey="2A.s.title">Direct Societal Impact</Trans>
      </Typography>
      <Typography variant="body2">
        <Trans i18nKey="2A.s.quanti.info.1">
          Please select a quantitative estimation below for each of the damage indicators for the direct societal impact
          of the current intensity scenarios.
        </Trans>
      </Typography>
      <Alert severity="warning">
        <Trans i18nKey="2A.s.quanti.info.2">
          In this step, you should only estimate the <b>direct</b> societal impact. For example, when estimating the
          direct impact of an <i>Earthquake</i>, the impact due to a possible <i>Failure of electricity supply</i>{" "}
          should not be considered. This possibility will be explored when estimating the conditional probabilities in
          the following phase.
        </Trans>
      </Alert>
      <Box component={Paper} sx={{ mx: 2, p: 2, mb: 4 }}>
        <Box sx={{ display: "flex" }}>
          <Typography variant="subtitle2" sx={{ flex: 1 }}>
            <Trans i18nKey="2A.s.quanti.sa.title">Sa - Supply shortfalls and unmet human needs</Trans>
          </Typography>
          <Tooltip title={t("button.di.calculator.tooltip", "Calculate the damage scale with weights")}>
            <IconButton onClick={() => setSaCalculatorOpen(true)}>
              <CalculateIcon />
            </IconButton>
          </Tooltip>
          <SaCalculator
            open={SaCalculatorOpen}
            onClose={() => setSaCalculatorOpen(false)}
            onApply={(newValue, qualiInput) => {
              handleChangeDIValue(newValue, Sa);
              setSaOverride(newValue);
              setSaCalculatorOpen(false);

              if (qualiInput) {
                fieldsRef.cr4de_di_quali_h += qualiInput;
              }
            }}
          />
        </Box>

        <DISlider
          field={Sa}
          initialValue={fieldsRef.cr4de_di_quanti_sa}
          error={inputErrors.indexOf("cr4de_di_quanti_sa") >= 0}
          onChange={handleChangeDIValue}
        />

        <Typography variant="subtitle2" sx={{ mt: 4 }}>
          <Trans i18nKey="2A.s.quanti.sb.title">Sb - Diminished public order and domestic security</Trans>
        </Typography>

        <DISlider
          field={Sb}
          initialValue={fieldsRef.cr4de_di_quanti_sb}
          error={inputErrors.indexOf("cr4de_di_quanti_sb") >= 0}
          onChange={handleChangeDIValue}
        />

        <Typography variant="subtitle2" sx={{ mt: 4 }}>
          <Trans i18nKey="2A.s.quanti.sc.title">Sc - Damage to the reputation of Belgium</Trans>
        </Typography>

        <DISlider
          field={Sc}
          initialValue={fieldsRef.cr4de_di_quanti_sc}
          error={inputErrors.indexOf("cr4de_di_quanti_sc") >= 0}
          onChange={handleChangeDIValue}
        />

        <Typography variant="subtitle2" sx={{ mt: 4 }}>
          <Trans i18nKey="2A.s.quanti.sd.title">
            Sd - Loss of confidence in or functioning of the State and/or its values
          </Trans>
        </Typography>

        <DISlider
          field={Sd}
          initialValue={fieldsRef.cr4de_di_quanti_sd}
          error={inputErrors.indexOf("cr4de_di_quanti_sd") >= 0}
          onChange={handleChangeDIValue}
        />
      </Box>
      <Typography variant="body2">
        <Trans i18nKey="2A.s.quali.info.1">
          Please use the field below to explain your reasoning for the quantitative estimations given in the previous
          section.
        </Trans>
      </Typography>{" "}
      <Typography variant="caption">
        <Trans i18nKey="2A.s.quali.info.2">
          Example: a <i>Fluvial flood</i> in itself will not cause a supply shortfall of electricity since this effect
          will be estimated in the next link of the risk chain (e.g. <i>Failure of Electricity Supply</i>). However an
          <i> Extreme fluvial flood</i> in itself might cause damage to the reputation of Belgium and loss of confidence
          in the state.
        </Trans>
      </Typography>
      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_di_quali_s") >= 0}
        initialValue={fieldsRef.cr4de_di_quali_s || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_di_quali_s = newValue;
        }}
        debounceInterval={100}
        attachments={attachments}
        onOpenSourceDialog={onOpenSourceDialog}
        onReloadAttachments={onReloadAttachments}
      />
    </Stack>
  );
}
