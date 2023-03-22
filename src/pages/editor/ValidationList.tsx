import { MutableRefObject, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  MobileStepper,
  Button,
  Typography,
  Stack,
  Stepper,
  Step,
  StepButton,
  StepLabel,
  StepIconProps,
  setRef,
} from "@mui/material";
import {
  DVValidation,
  ValidationEditableFields,
  ValidationResponseEditableFields,
} from "../../types/dataverse/DVValidation";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { DVContact } from "../../types/dataverse/DVContact";
import TextInputBox from "../../components/TextInputBox";
import useAPI from "../../hooks/useAPI";
import { styled } from "@mui/material/styles";

const StepIconRoot = styled("div")<{ ownerState: { active?: boolean; completed?: boolean; error?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.completed && {
      color: theme.palette.primary.main,
    }),
    ...(ownerState.error && {
      color: theme.palette.error.main,
    }),

    ...(ownerState.active
      ? {
          "& .QontoStepIcon-circle": {
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "currentColor",
          },
        }
      : {
          "& .QontoStepIcon-circle": {
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "currentColor",
          },
        }),
  })
);

function StepIcon(props: StepIconProps) {
  const { active, completed, error, className } = props;

  return (
    <StepIconRoot ownerState={{ active, completed, error }} className={className}>
      <div className="QontoStepIcon-circle" />
    </StepIconRoot>
  );
}

export default function ValidationList({
  validations,
  field,
  feedbackRefs,
  reloadValidations,
}: {
  validations: DVValidation<undefined, DVContact>[] | null;
  field: string;
  feedbackRefs: MutableRefObject<Partial<DVValidation<unknown, unknown>>[]>;
  reloadValidations: () => Promise<void>;
}) {
  const theme = useTheme();
  const api = useAPI();

  const fieldValidations = validations?.filter(
    (v) => v[`cr4de_${field}_feedback` as keyof ValidationEditableFields] != null
  );

  const [activeStep, setActiveStep] = useState(0);
  const [response, setResponse] = useState<string | null>(
    fieldValidations
      ? fieldValidations[activeStep][`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields]
      : null
  );
  const [refreshResponseBox, setRefreshResponseBox] = useState(false);

  useEffect(() => {
    if (!fieldValidations) return;

    setResponse(
      fieldValidations[activeStep][`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields]
    );
  }, [validations, field, activeStep]);

  useEffect(() => {
    if (refreshResponseBox) setRefreshResponseBox(false);
  }, [refreshResponseBox]);

  if (fieldValidations == null) return null;

  const handleNext = async () => {
    handleSaveResponse();
    setRefreshResponseBox(true);
    setActiveStep((activeStep + 1) % fieldValidations.length);
  };
  const handleBack = async () => {
    handleSaveResponse();
    setRefreshResponseBox(true);
    setActiveStep((activeStep - 1) % fieldValidations.length);
  };
  const handleMove = async (step: number) => {
    handleSaveResponse();
    setRefreshResponseBox(true);
    setActiveStep(step);
  };

  const handleSaveResponse = async () => {
    if (!fieldValidations) return;

    const feedbackRef = feedbackRefs.current.find(
      (r) => r.cr4de_bnravalidationid === fieldValidations[activeStep].cr4de_bnravalidationid
    );

    if (feedbackRef) {
      await api.updateValidation(fieldValidations[activeStep].cr4de_bnravalidationid, {
        [`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields]: response,
      });
      await reloadValidations();

      delete feedbackRef[`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields];
    }
  };

  const handleUpdateResponse = (newValue: string | null | undefined) => {
    if (!fieldValidations) return;

    setResponse(newValue || null);

    const feedbackRef = feedbackRefs.current.find(
      (r) => r.cr4de_bnravalidationid === fieldValidations[activeStep].cr4de_bnravalidationid
    );

    if (feedbackRef) {
      feedbackRef[`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields] = newValue;
    } else {
      feedbackRefs.current.push({
        cr4de_bnravalidationid: fieldValidations[activeStep].cr4de_bnravalidationid,
        [`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields]: newValue,
      });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", mx: 1 }}>
      <Typography variant="subtitle2" color="primary">
        Expert validations
      </Typography>
      {fieldValidations.length <= 0 ? (
        <Typography variant="caption">No expert feedback received..</Typography>
      ) : (
        <>
          <Typography variant="caption">{fieldValidations[activeStep]?.cr4de_expert.emailaddress1} wrote:</Typography>
          <Box
            width="100%"
            dangerouslySetInnerHTML={{
              __html: fieldValidations[activeStep][
                `cr4de_${field}_feedback` as keyof ValidationEditableFields
              ] as string,
            }}
          />
          {!refreshResponseBox && (
            <TextInputBox
              id={`${fieldValidations[activeStep].cr4de_bnravalidationid}_${field}`}
              limitedOptions
              initialValue={
                fieldValidations[activeStep][
                  `cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields
                ]
              }
              onSave={handleSaveResponse}
              setUpdatedValue={handleUpdateResponse}
            />
          )}
          <Stack direction="row" justifyContent="space-between" width="500px" sx={{ margin: "auto" }}>
            <Button size="small" onClick={handleBack} disabled={activeStep <= 0}>
              {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
            <Stepper nonLinear activeStep={activeStep}>
              {fieldValidations.map((v, i) => (
                <Step
                  key={v.cr4de_bnravalidationid}
                  completed={v[`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields] !== null}
                >
                  <StepButton sx={{ p: 0 }} onClick={() => handleMove(i)}>
                    <StepLabel
                      StepIconComponent={StepIcon}
                      error={v[`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields] === null}
                    ></StepLabel>
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <Button size="small" onClick={handleNext} disabled={activeStep >= fieldValidations.length - 1}>
              Next
              {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}
