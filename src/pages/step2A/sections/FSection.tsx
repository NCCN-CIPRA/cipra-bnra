import { Alert, Box, Paper, Stack, Typography, Button } from "@mui/material";
import { Trans } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { DirectImpactField } from "../../learning/QuantitativeScales/DI";
import { Fa, Fb } from "../../learning/QuantitativeScales/F";
import { ScenarioInput } from "../fields";
import { DISlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";
import { ReactNode } from "react";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";

export default function FSection({
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
        <Trans i18nKey="2A.f.title">Direct Financial Impact</Trans>
      </Typography>
      <Typography variant="body2">
        <Trans i18nKey="2A.f.quanti.info.1">
          Please select a quantitative estimation below for each of the damage indicators for the direct financial
          impact of the current intensity scenarios.
        </Trans>
      </Typography>
      <Alert severity="warning">
        <Box sx={{ mt: 0, mb: 1 }}>
          <Trans i18nKey="2A.f.quanti.info.2">
            In this step, you should only estimate the <b>direct</b> financial impact. For example, when estimating the
            direct impact of an <i>Earthquake</i>, the financial impact due to a possible
            <i>Failure of electricity supply</i> should not be considered. This possibility will be explored when
            estimating the conditional probabilities in the following phase.
          </Trans>
        </Box>
        <Box sx={{ mt: 0, mb: 1 }}>
          <Trans i18nKey="2A.h.quanti.info.3">
            En cliquant sur le bouton <i>MONTRER LES CONSÉQUENCES POSSIBLES</i>, vous pouvez afficher les risques du
            catalogue de la BNRA qui ont été identifiés lors de l’étape 1 comme étant des conséquences du risque à
            évaluer et qui ne doivent dès lors, pas être pris en compte dans l’estimation de l’impact humain direct.
          </Trans>
        </Box>
        <Box sx={{ marginLeft: -1 }}>
          <Button color="warning" onClick={onOpenEffects}>
            <Trans i18nKey="button.showConsequences">Show Potential Consequences</Trans>
          </Button>
        </Box>
      </Alert>
      <Box component={Paper} sx={{ mx: 2, p: 2, mb: 4 }}>
        <Typography variant="subtitle2">
          <Trans i18nKey="2A.f.quanti.fa.title">Fa - Financial asset damages</Trans>
        </Typography>

        <DISlider
          field={Fa}
          initialValue={fieldsRef.cr4de_di_quanti_fa}
          error={inputErrors.indexOf("cr4de_di_quanti_fa") >= 0}
          onChange={handleChangeDIValue}
        />

        <Typography variant="subtitle2" sx={{ mt: 4 }}>
          <Trans i18nKey="2A.f.quanti.fb.title">Fb - Reduction of economic performance</Trans>
        </Typography>

        <DISlider
          field={Fb}
          initialValue={fieldsRef.cr4de_di_quanti_fb}
          error={inputErrors.indexOf("cr4de_di_quanti_fb") >= 0}
          onChange={handleChangeDIValue}
        />
      </Box>
      <Typography variant="body2">
        <Trans i18nKey="2A.f.quali.info.1">
          Please use the field below to explain your reasoning for the quantitative estimations given in the previous
          section.
        </Trans>
      </Typography>{" "}
      <Typography variant="caption">
        <Trans i18nKey="2A.f.quali.info.2">
          Example: a <i>Fluvial flood</i> may cause financial asset damage, if this is not covered in a next link of the
          risk chain. The financial impact of a bridge collapsing will be estimated in the risk file
          <i>Bridge Failure</i>. The causal effect between flood and collapsing of a bridge (e.g. a certain intensity of
          bridge failure will take place as an effect of a flood) will be estimated through conditional probabilities in
          step 2B. During a <i>Failure of electricity supply</i> several organisations with a profit motive will be
          affected and have zero output during the power outage.
        </Trans>
      </Typography>
      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_di_quali_f") >= 0}
        initialValue={fieldsRef.cr4de_di_quali_f || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_di_quali_f = newValue;
        }}
        debounceInterval={100}
        attachments={attachments}
        onOpenSourceDialog={onOpenSourceDialog}
        onReloadAttachments={onReloadAttachments}
      />
    </Stack>
  );
}
