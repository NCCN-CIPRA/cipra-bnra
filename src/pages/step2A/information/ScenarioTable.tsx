import { Grid, Paper, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { ScenarioInput, ScenarioInputs } from "../fields";
import { NO_COMMENT } from "../sections/QualiTextInputBox";
import { STEPS, stepNames } from "../Steps";

export interface ScenariosInput {
  [STEPS.CONSIDERABLE]: string | null | undefined;
  [STEPS.MAJOR]: string | null | undefined;
  [STEPS.EXTREME]: string | null | undefined;
}

const QualiGridItem = ({ input }: { input: string | null }) => {
  if (input === NO_COMMENT) {
    return (
      <Grid item xs={4} sx={{ px: 1, pt: 2, borderRight: "1px solid #eee" }}>
        <Typography variant="body2" paragraph>
          <Trans i18nKey="2A.review.noComment">No Comment</Trans>
        </Typography>
      </Grid>
    );
  }

  return (
    <Grid
      item
      xs={4}
      sx={{ px: 1, borderRight: "1px solid #eee" }}
      dangerouslySetInnerHTML={{
        __html: input || "<p>(No input)</p>",
      }}
    />
  );
};

export default function ScenarioTable({ inputs, fields }: { inputs: ScenarioInputs; fields: (keyof ScenarioInput)[] }) {
  return (
    <Stack direction="column" component={Paper} sx={{ overflow: "hidden", mt: 2, mb: 8 }}>
      <Grid container direction="row">
        <Grid
          item
          xs={4}
          sx={{ backgroundColor: stepNames[STEPS.CONSIDERABLE].color, p: 1, borderRight: "1px solid #eee" }}
        >
          <Typography variant="subtitle2">
            <Trans i18nKey={stepNames[STEPS.CONSIDERABLE].titleI18N}>
              {stepNames[STEPS.CONSIDERABLE].titleDefault}
            </Trans>
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ backgroundColor: stepNames[STEPS.MAJOR].color, p: 1, borderRight: "1px solid #eee" }}>
          <Typography variant="subtitle2">
            <Trans i18nKey={stepNames[STEPS.MAJOR].titleI18N}>{stepNames[STEPS.MAJOR].titleDefault}</Trans>
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ backgroundColor: stepNames[STEPS.EXTREME].color, p: 1 }}>
          <Typography variant="subtitle2">
            <Trans i18nKey={stepNames[STEPS.EXTREME].titleI18N}>{stepNames[STEPS.EXTREME].titleDefault}</Trans>
          </Typography>
        </Grid>
      </Grid>
      {fields.map((field) =>
        field.indexOf("quali") >= 0 ? (
          <Grid container direction="row" sx={{ borderTop: "1px solid #eee" }}>
            <QualiGridItem input={inputs.considerable[field]} />
            <QualiGridItem input={inputs.major[field]} />
            <QualiGridItem input={inputs.extreme[field]} />
          </Grid>
        ) : (
          <Grid container direction="row" sx={{ borderTop: "1px solid #eee" }}>
            <Grid item xs={4} sx={{ p: 1, borderRight: "1px solid #eee", textAlign: "center" }}>
              <Typography variant="body2">{inputs.considerable[field] || "(No input)"}</Typography>
            </Grid>
            <Grid item xs={4} sx={{ p: 1, borderRight: "1px solid #eee", textAlign: "center" }}>
              <Typography variant="body2">{inputs.major[field] || "(No input)"}</Typography>
            </Grid>
            <Grid item xs={4} sx={{ p: 1, borderRight: "1px solid #eee", textAlign: "center" }}>
              <Typography variant="body2">{inputs.extreme[field] || "(No input)"}</Typography>
            </Grid>
          </Grid>
        )
      )}
    </Stack>
  );
}
