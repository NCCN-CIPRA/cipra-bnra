import { Box, Paper, Stack, Typography, Tooltip, IconButton, Alert, Button } from "@mui/material";
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
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";

export default function SSection({
  fieldsRef,
  inputErrors,
  attachments,
  effects,
  onOpenSourceDialog,
  onReloadAttachments,
  onOpenEffects,
}: {
  fieldsRef: ScenarioInput;
  inputErrors: (keyof ScenarioInput)[];
  attachments: DVAttachment<unknown, DVAttachment>[] | null;
  effects: DVRiskCascade<unknown, DVRiskFile>[] | null;
  onOpenSourceDialog: (existingSource?: DVAttachment) => void;
  onReloadAttachments: () => Promise<void>;
  onOpenEffects: () => void;
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
      <Typography variant="body2">
        <Trans i18nKey="2A.s.quanti.info.12">
          On entend par impact direct, les impacts d’un incident qui ne peuvent être attribués aux effets cascades
          (risques conséquents) dans le catalogue de risques de la BNRA.
        </Trans>
      </Typography>
      <Typography variant="body2">
        <Trans i18nKey="2A.s.quanti.info.13">
          Les indicateurs de l'échelle d'impact humain cherchent à évaluer les effets d’un risque :
        </Trans>
      </Typography>
      <ul>
        <li>
          <Typography variant="body2">
            <Trans i18nKey="2A.s.quanti.info.14">
              sur la population belge, par exemple par le biais de perturbations de la fourniture de biens essentiels
              (Sa), d'une atteinte à l'ordre public et la sécurité intérieure (Sb).
            </Trans>
          </Typography>
        </li>
        <li>
          <Typography variant="body2">
            <Trans i18nKey="2A.s.quanti.info.15">
              sur l'État par le biais d’une atteinte à la réputation de la Belgique à l'étranger (Sc) ou d’une perte de
              confiance en l'État et/ou de ses valeurs ou d’un disfonctionnement de l’Etat (Sd).
            </Trans>
          </Typography>
        </li>
      </ul>
      <Typography variant="body2">
        <Trans i18nKey="2A.s.quanti.info.17">
          Pour rappel, l’indicateur de dommages relatif à la perturbation de la fourniture de biens essentiels (Sa),
          utilise des coefficients de pondération. Pour vous aider à calculer la valeur finale de cet indicateur, nous
          avons mis à votre disposition un outil de calcul. Vous pouvez y accéder en cliquant sur le bouton en forme de
          calculatrice qui apparait à votre écran.
        </Trans>
      </Typography>
      <Alert severity="warning">
        <Box sx={{ mt: 0, mb: 1 }}>
          <Trans i18nKey="2A.s.quanti.info.2">
            In this step, you should only estimate the <b>direct</b> societal impact. For example, when estimating the
            direct impact of an <i>Earthquake</i>, the impact due to a possible <i>Failure of electricity supply</i>{" "}
            should not be considered. This possibility will be explored when estimating the conditional probabilities in
            the following phase.
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
            effects={effects || []}
            onClose={() => setSaCalculatorOpen(false)}
            onApply={(newValue, qualiInput) => {
              handleChangeDIValue(newValue, Sa);
              setSaOverride(newValue);
              setSaCalculatorOpen(false);

              if (qualiInput) {
                fieldsRef.cr4de_di_quali_s += qualiInput;
              }
            }}
          />
        </Box>

        <DISlider
          field={Sa}
          initialValue={fieldsRef.cr4de_di_quanti_sa}
          overrideValue={SaOverride}
          resetOverrideValue={() => setSaOverride(undefined)}
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
