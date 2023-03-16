import { MutableRefObject, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, MobileStepper, Button, Typography } from "@mui/material";
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

export default function ValidationList({
  validations,
  field,
  feedbackRefs,
}: {
  validations: DVValidation<undefined, DVContact>[] | null;
  field: string;
  feedbackRefs: MutableRefObject<Partial<DVValidation<unknown, unknown>>[]>;
}) {
  const theme = useTheme();
  const api = useAPI();

  const [activeStep, setActiveStep] = useState(0);
  const [response, setResponse] = useState<string | null>(
    validations
      ? validations[activeStep][`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields]
      : null
  );
  const [refreshResponseBox, setRefreshResponseBox] = useState(false);

  useEffect(() => {
    if (!validations) return;

    setResponse(validations[activeStep][`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields]);
  }, [validations, field, activeStep]);

  useEffect(() => {
    if (refreshResponseBox) setRefreshResponseBox(false);
  }, [refreshResponseBox]);

  const fieldValidations = validations?.filter(
    (v) => v[`cr4de_${field}_feedback` as keyof ValidationEditableFields] != null
  );

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

  const handleSaveResponse = async () => {
    if (!validations) return;

    const feedbackRef = feedbackRefs.current.find(
      (r) => r.cr4de_bnravalidationid === validations[activeStep].cr4de_bnravalidationid
    );

    if (
      feedbackRef &&
      response !== feedbackRef[`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields]
    ) {
      api.updateValidation(validations[activeStep].cr4de_bnravalidationid, {
        [`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields]: response,
      });

      delete feedbackRef[`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields];
    }
  };

  const handleUpdateResponse = (newValue: string | null | undefined) => {
    if (!validations) return;

    setResponse(newValue || null);

    const feedbackRef = feedbackRefs.current.find(
      (r) => r.cr4de_bnravalidationid === validations[activeStep].cr4de_bnravalidationid
    );

    if (feedbackRef) {
      feedbackRef[`cr4de_${field}_feedback_response` as keyof ValidationResponseEditableFields] = newValue;
    } else {
      feedbackRefs.current.push({
        cr4de_bnravalidationid: validations[activeStep].cr4de_bnravalidationid,
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
          <MobileStepper
            variant="dots"
            steps={fieldValidations.length}
            position="static"
            activeStep={activeStep}
            sx={{ width: 400, flexGrow: 1, alignSelf: "center" }}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={activeStep >= fieldValidations.length - 1}>
                Next
                {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep <= 0}>
                {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                Back
              </Button>
            }
          />
        </>
      )}
    </Box>
  );
}
