import { Box, Button, Divider, MobileStepper, Paper, Rating, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { DVContact } from "../../types/dataverse/DVContact";
import { DVFeedback } from "../../types/dataverse/DVFeedback";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { Trans } from "react-i18next";

export default function FeedbackList({ feedbacks }: { feedbacks: DVFeedback<DVContact>[] }) {
  const theme = useTheme();

  const [activeStep, setActiveStep] = useState(0);

  if (!feedbacks[activeStep]) return null;

  const handleNext = async () => {
    setActiveStep((activeStep + 1) % feedbacks.length);
  };
  const handleBack = async () => {
    setActiveStep((activeStep - 1) % feedbacks.length);
  };

  return (
    <Paper>
      <Box p={2} my={4}>
        <Typography variant="h6" color="primary" sx={{ flex: 1 }}>
          Expert Feedback
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {feedbacks.length <= 0 ? (
            <Typography variant="caption">No expert feedback received..</Typography>
          ) : (
            <>
              <Typography variant="subtitle2">{feedbacks[activeStep].cr4de_contact?.emailaddress1}</Typography>

              <Stack direction="column" spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ flex: 1 }} />
                  <Box sx={{ width: 160, display: "flex", mr: 5 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        transform: "translateX(-5px)",
                        width: "50px",
                        textAlign: "center",
                        display: "inline-block",
                      }}
                    >
                      <Trans i18nKey="feedback.dialog.dontagree">Do not agree</Trans>
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Typography
                      variant="caption"
                      sx={{
                        transform: "translateX(5px)",
                        width: "50px",
                        textAlign: "center",
                        display: "inline-block",
                      }}
                    >
                      <Trans i18nKey="feedback.dialog.agree">Totally agree</Trans>
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    <Trans i18nKey="feedback.dialog.q1">It was clear what was expected of me</Trans>
                  </Typography>
                  <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                    <Rating size="large" value={feedbacks[activeStep].cr4de_q1} onChange={(event, newValue) => {}} />
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    <Trans i18nKey="feedback.dialog.q2">
                      The subject was in line with my personal expertise and/or interests
                    </Trans>
                  </Typography>
                  <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                    <Rating size="large" value={feedbacks[activeStep].cr4de_q2} onChange={(event, newValue) => {}} />
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    <Trans i18nKey="feedback.dialog.q3">
                      I understand the necessity of this step in the BNRA process
                    </Trans>
                  </Typography>
                  <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                    <Rating size="large" value={feedbacks[activeStep].cr4de_q3} onChange={(event, newValue) => {}} />
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" sx={{ flex: 1 }}>
                    <Trans i18nKey="feedback.dialog.q4">
                      The time and/or effort required of me for this step was as expected
                    </Trans>
                  </Typography>
                  <Box sx={{ width: 160, mr: 5, textAlign: "center", pt: "5px" }}>
                    <Rating size="large" value={feedbacks[activeStep].cr4de_q4} onChange={(event, newValue) => {}} />
                  </Box>
                </Stack>
              </Stack>

              <Box sx={{ my: 4 }}>
                <Typography variant="body2">
                  {feedbacks[activeStep].cr4de_quali_validation || "No quali comment"}
                </Typography>
              </Box>

              <MobileStepper
                variant="dots"
                steps={feedbacks.length}
                position="static"
                activeStep={activeStep}
                sx={{ width: 400, flexGrow: 1, alignSelf: "center" }}
                nextButton={
                  <Button size="small" onClick={handleNext} disabled={activeStep >= feedbacks.length - 1}>
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
      </Box>
    </Paper>
  );
}
