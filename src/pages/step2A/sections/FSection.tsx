import { Box, Paper, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { DirectImpactField } from "../../learning/QuantitativeScales/DI";
import { Fa, Fb } from "../../learning/QuantitativeScales/F";
import { ScenarioInput } from "../fields";
import { DISlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";

export default function FSection({
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
        <Trans i18nKey="2A.f.title">Direct Financial Impact</Trans>
      </Typography>

      <Typography variant="body2">
        <Trans i18nKey="2A.f.quanti.info.1">Explanation about filling in the direct financial impacts values</Trans>
      </Typography>

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
        <Trans i18nKey="2A.f.quali.info.1">Explanation about filling in the direct financial impact textbox</Trans>
      </Typography>

      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_di_quali_f") >= 0}
        initialValue={fieldsRef.cr4de_di_quali_f || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_di_quali_f = newValue;
        }}
        debounceInterval={100}
      />
    </Stack>
  );
}
