import { Box, Paper, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { DirectImpactField } from "../../learning/QuantitativeScales/DI";
import { Sa, Sb, Sc, Sd } from "../../learning/QuantitativeScales/S";
import { ScenarioInput } from "../fields";
import { DISlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";

export default function SSection({
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
        <Trans i18nKey="2A.s.title">Direct Societal Impact</Trans>
      </Typography>
      <Typography variant="body2">
        <Trans i18nKey="2A.s.quali.info.1">Explanation about filling in the direct societal impact textbox</Trans>
      </Typography>

      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_di_quali_s") >= 0}
        initialValue={fieldsRef.cr4de_di_quali_s || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_di_quali_s = newValue;
        }}
        debounceInterval={100}
      />

      <Typography variant="body2">
        <Trans i18nKey="2A.s.quanti.info.1">Explanation about filling in the direct societal impacts values</Trans>
      </Typography>

      <Box component={Paper} sx={{ mx: 2, p: 2 }}>
        <Typography variant="subtitle2">
          <Trans i18nKey="2A.s.quanti.sa.title">Sa - Supply shortfalls and unmet human needs</Trans>
        </Typography>

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
    </Stack>
  );
}
