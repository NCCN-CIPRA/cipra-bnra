import { Box, Paper, Stack, Typography } from "@mui/material";
import { ForwardedRef, Ref, RefObject } from "react";
import { Trans } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { DirectImpactField } from "../../learning/QuantitativeScales/DI";
import { Ea } from "../../learning/QuantitativeScales/E";
import { Ha, Hb, Hc } from "../../learning/QuantitativeScales/H";
import { ScenarioInput } from "../fields";
import { DISlider, DPSlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";

export default function ESection({
  fieldsRef,
  inputErrors,
}: {
  fieldsRef: ScenarioInput;
  inputErrors: (keyof ScenarioInput)[];
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
        <Trans i18nKey="2A.e.quanti.info.1">Explanation about filling in the direct environmental impacts values</Trans>
      </Typography>

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
        <Trans i18nKey="2A.e.quali.info.1">Explanation about filling in the direct environmental impact textbox</Trans>
      </Typography>

      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_di_quali_e") >= 0}
        initialValue={fieldsRef.cr4de_di_quali_e || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_di_quali_e = newValue;
        }}
        debounceInterval={100}
      />
    </Stack>
  );
}
