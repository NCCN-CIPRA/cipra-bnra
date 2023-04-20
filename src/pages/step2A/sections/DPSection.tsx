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
  onOpenCauses,
}: {
  fieldsRef: ScenarioInput;
  inputErrors: (keyof ScenarioInput)[];
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  onOpenSourceDialog: (existingSource?: DVAttachment) => void;
  onReloadAttachments: () => Promise<void>;
  onOpenCauses: () => void;
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
        <Trans i18nKey="2A.dp.quanti.info.1">
          Please select a quantitative estimation below for the direct probability of the current intensity scenarios.
        </Trans>
      </Typography>
      <Alert severity="warning">
        <Box sx={{ mt: 0, mb: 1 }}>
          <Trans i18nKey="2A.dp.quanti.info.2">
            In this step, you should only estimate the <b>direct</b> probability. For example, when estimating the
            direct probability of a <i>Dam failure</i>, the possibility that a dam fails due to an earthquake should not
            be considered. This possibility will be explored when estimating the conditional probabilities in the
            following phase.
          </Trans>
        </Box>
        <Box sx={{ mt: 0, mb: 1 }}>
          <Trans i18nKey="2A.dp.quanti.info.3">
            Bijvoorbeeld, bij het inschatten van de directe waarschijnlijkheid van een <i>Dam failure</i> moet de
            mogelijkheid dat een dam faalt ten gevolge van een aardbeving buiten beschouwing worden gelaten. Dit zal
            worden ingeschat in fase 2B van de BNRA. Hier dient gekeken te worden naar alle elementen die bijvoorbeeld
            een dam failure kunnen veroorzaken, en die niet werden opgenomen als mogelijke oorzaken in de BNRA.
          </Trans>
        </Box>
        <Box sx={{ mt: 0, mb: 1 }}>
          <Trans i18nKey="2A.dp.quanti.info.4">
            Door op de knop <i>TOON POTENTIËLE OORZAKEN</i> te klikken, kunt u de risico's in de BNRA-catalogus
            weergeven die in stap 1 zijn geïdentificeerd als oorzaken van het te beoordelen risico en die daarom{" "}
            <b>niet</b> moeten worden opgenomen in de inschatting van de directe waarschijnlijkheids.
          </Trans>
        </Box>
        <Box sx={{ marginLeft: -1 }}>
          <Button color="warning" onClick={onOpenCauses}>
            <Trans i18nKey="button.showCauses">Show Potential Causes</Trans>
          </Button>
        </Box>
      </Alert>

      <Box component={Paper} sx={{ mx: 2, p: 2, mb: 4 }} id="step2A-dp-quantitative-box">
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
        <Trans i18nKey="2A.dp.quali.info.1">
          Please use the field below to explain your reasoning for the quantitative estimation given in the previous
          section.
        </Trans>
      </Typography>

      <QualiTextInputBox
        id="step2A-dp-quali-box"
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
