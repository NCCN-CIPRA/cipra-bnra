import { Grid, Paper, Stack, Typography } from "@mui/material";
import { Trans } from "react-i18next";
import { ScenarioInput, ScenarioInputs } from "../fields";
import { NO_COMMENT } from "../sections/QualiTextInputBox";
import { STEPS, stepNames } from "../Steps";
import { DPValueStack } from "../../learning/QuantitativeScales/P";
import { DIValueStack, DirectImpactField } from "../../learning/QuantitativeScales/DI";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { MValueStack } from "../../learning/QuantitativeScales/M";

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

const QuantiGridItem = ({
  inputs,
  field,
  manmade = false,
}: {
  inputs: ScenarioInput;
  field: keyof ScenarioInput | DirectImpactField;
  manmade?: Boolean;
}) => {
  if (typeof field === "object") {
    const fieldName = `cr4de_di_quanti_${field.prefix.toLowerCase()}` as keyof ScenarioInput;

    if (inputs[fieldName]) {
      return (
        <Grid item xs={4} sx={{ p: 1, borderRight: "1px solid #eee", textAlign: "center" }}>
          <Tooltip
            title={<DIValueStack field={field} value={parseInt(inputs[fieldName]?.slice(2) || "0", 10)} />}
            PopperProps={{
              sx: {
                [`& .${tooltipClasses.tooltip}`]: {
                  maxWidth: "none",
                },
              },
            }}
          >
            <Typography variant="body2">{inputs[fieldName] || "(No input)"}</Typography>
          </Tooltip>
        </Grid>
      );
    }

    return (
      <Grid item xs={4} sx={{ p: 1, borderRight: "1px solid #eee", textAlign: "center" }}>
        <Typography variant="body2">{inputs[fieldName] || "(No input)"}</Typography>
      </Grid>
    );
  }

  if (inputs[field]) {
    const ValueStack = manmade ? (
      <MValueStack value={parseInt(inputs[field]?.slice(1) || "1", 10)} />
    ) : (
      <DPValueStack value={parseInt(inputs[field]?.slice(2) || "1", 10) - 1} />
    );

    return (
      <Grid item xs={4} sx={{ p: 1, borderRight: "1px solid #eee", textAlign: "center" }}>
        <Tooltip
          title={ValueStack}
          PopperProps={{
            sx: {
              [`& .${tooltipClasses.tooltip}`]: {
                maxWidth: "none",
              },
            },
          }}
        >
          <Typography variant="body2">{inputs[field] || "(No input)"}</Typography>
        </Tooltip>
      </Grid>
    );
  }

  return (
    <Grid item xs={4} sx={{ p: 1, borderRight: "1px solid #eee", textAlign: "center" }}>
      <Typography variant="body2">{inputs[field] || "(No input)"}</Typography>
    </Grid>
  );
};

export default function ScenarioTable({
  inputs,
  fields,
  manmade = false,
}: {
  inputs: ScenarioInputs;
  fields: (keyof ScenarioInput | DirectImpactField)[];
  manmade?: Boolean;
}) {
  console.log(inputs);
  return (
    <Stack direction="column" component={Paper} sx={{ overflow: "hidden", mt: 2, mb: 8 }}>
      <Grid container direction="row">
        <Grid
          item
          xs={4}
          sx={{
            backgroundColor: stepNames[STEPS.CONSIDERABLE].color,
            p: 1,
            borderRight: "1px solid #eee",
            color: "white",
          }}
        >
          <Typography variant="subtitle2">
            <Trans i18nKey={stepNames[STEPS.CONSIDERABLE].titleI18N}>
              {stepNames[STEPS.CONSIDERABLE].titleDefault}
            </Trans>
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          sx={{ backgroundColor: stepNames[STEPS.MAJOR].color, p: 1, borderRight: "1px solid #eee", color: "white" }}
        >
          <Typography variant="subtitle2">
            <Trans i18nKey={stepNames[STEPS.MAJOR].titleI18N}>{stepNames[STEPS.MAJOR].titleDefault}</Trans>
          </Typography>
        </Grid>
        <Grid item xs={4} sx={{ backgroundColor: stepNames[STEPS.EXTREME].color, p: 1, color: "white" }}>
          <Typography variant="subtitle2">
            <Trans i18nKey={stepNames[STEPS.EXTREME].titleI18N}>{stepNames[STEPS.EXTREME].titleDefault}</Trans>
          </Typography>
        </Grid>
      </Grid>
      {fields.map((field) =>
        typeof field === "string" && field.indexOf("quali") >= 0 ? (
          <Grid container direction="row" sx={{ borderTop: "1px solid #eee" }}>
            <QualiGridItem input={inputs.considerable[field]} />
            <QualiGridItem input={inputs.major[field]} />
            <QualiGridItem input={inputs.extreme[field]} />
          </Grid>
        ) : (
          <Grid container direction="row" sx={{ borderTop: "1px solid #eee" }}>
            <QuantiGridItem inputs={inputs.considerable} field={field} manmade={manmade} />
            <QuantiGridItem inputs={inputs.major} field={field} manmade={manmade} />
            <QuantiGridItem inputs={inputs.extreme} field={field} manmade={manmade} />
          </Grid>
        )
      )}
    </Stack>
  );
}
