import { Box, Paper, Stack, Typography } from "@mui/material";
import { ForwardedRef, Ref, RefObject } from "react";
import { Trans } from "react-i18next";
import TextInputBox from "../../../components/TextInputBox";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { ScenarioInput } from "../fields";
import { DPSlider } from "./QuantitativeMarks";
import QualiTextInputBox from "./QualiTextInputBox";

export default function CBSection({
  fieldsRef,
  inputErrors,
}: {
  fieldsRef: ScenarioInput;
  inputErrors: (keyof ScenarioInput)[];
}) {
  return (
    <Stack sx={{}} rowGap={2}>
      <Typography variant="h6">
        <Trans i18nKey="2A.cb.title">Cross-border Impact</Trans>
      </Typography>
      <Typography variant="body2">
        <Trans i18nKey="2A.cb.quali.info.1">Explanation about filling in the cross-border impact textbox</Trans>
      </Typography>

      <QualiTextInputBox
        error={inputErrors.indexOf("cr4de_cross_border_impact_quali") >= 0}
        initialValue={fieldsRef.cr4de_cross_border_impact_quali || ""}
        onSave={(newValue) => {
          if (!fieldsRef) return null;
          fieldsRef.cr4de_cross_border_impact_quali = newValue;
        }}
        debounceInterval={100}
      />
    </Stack>
  );
}
