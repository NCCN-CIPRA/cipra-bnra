import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, MobileStepper, Button, Typography } from "@mui/material";
import { DVValidation } from "../../types/dataverse/DVValidation";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { DVContact } from "../../types/dataverse/DVContact";

export default function FeedbackList({
  validations,
  field,
}: {
  validations: DVValidation<undefined, DVContact>[] | null;
  field: string;
}) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const fieldValidations = validations?.filter((v) => v[`cr4de_${field}_feedback` as keyof DVValidation] != null);

  if (fieldValidations == null) return null;

  const handleNext = () => setActiveStep((activeStep + 1) % fieldValidations.length);
  const handleBack = () => setActiveStep((activeStep - 1) % fieldValidations.length);

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
              __html: fieldValidations[activeStep][`cr4de_${field}_feedback` as keyof DVValidation] as string,
            }}
          />
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
