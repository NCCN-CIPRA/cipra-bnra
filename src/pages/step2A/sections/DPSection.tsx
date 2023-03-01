import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { ScenarioInput } from "../fields";
import { DPSlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";

export default function DPSection({
  fieldsRef,
  inputErrors,
}: {
  fieldsRef: ScenarioInput;
  inputErrors: (keyof ScenarioInput)[];
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
        <Trans i18nKey="2A.dp.quali.info.1">Explanation about filling in the direct probabilty textbox</Trans>
      </Typography>

      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_dp_quali") >= 0}
        initialValue={fieldsRef.cr4de_dp_quali || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_dp_quali = newValue;
        }}
        debounceInterval={100}
      />
      <Typography variant="body2">
        <Trans i18nKey="2A.dp.quanti.info.1">Explanation about filling in the direct probabilty value</Trans>
      </Typography>

      <Box component={Paper} sx={{ mx: 2, p: 2 }}>
        <Typography variant="subtitle2">
          <Trans i18nKey="2A.dp.quanti.dp.title">DP - Direct Probability</Trans>
        </Typography>

        <DPSlider
          initialValue={fieldsRef.cr4de_dp_quanti}
          error={inputErrors.indexOf("cr4de_dp_quanti") >= 0}
          onChange={handleChangeDPValue}
        />
      </Box>
    </Stack>
  );
}
