import React, { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import {
  Paper,
  Stack,
  Skeleton,
  Box,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  Backdrop,
  CircularProgress,
  StepButton,
} from "@mui/material";
import {
  CONSENSUS_TYPE,
  DVRiskFile,
  RISK_TYPE,
} from "../types/dataverse/DVRiskFile";
import getCategoryColor from "../functions/getCategoryColor";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import { useNavigate, useOutletContext } from "react-router-dom";
import useAPI from "../hooks/useAPI";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { AuthPageContext } from "../pages/AuthPage";

export interface FinishableRiskFile extends DVRiskFile {
  finished?: boolean;
}

function EmergingRisks2AIcon() {
  return (
    <Box
      sx={{
        backgroundColor: "rgb(0, 164, 154)",
        borderRadius: "50%",
        width: 24,
        height: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SkipNextIcon sx={{ color: "white", fontSize: 20 }} />
    </Box>
  );
}

function RiskFileList({
  participations,
}: {
  participations: DVParticipation<undefined, DVRiskFile>[] | null;
  finishedTooltip?: string;
}) {
  const { user } = useOutletContext<AuthPageContext>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const api = useAPI();

  const [isLoading, setIsLoading] = useState(false);

  const handleClick =
    (p: DVParticipation<undefined, DVRiskFile>) => async () => {
      if (!participations) return;

      if (p.cr4de_risk_file.cr4de_consensus_type !== null) {
        navigate(`/consensus/${p._cr4de_risk_file_value}`);
      } else if (
        p.cr4de_risk_file.cr4de_step2b_enabled &&
        p.cr4de_direct_analysis_finished &&
        p._cr4de_direct_analysis_value !== null
      ) {
        navigate(`/step2B/${p._cr4de_direct_analysis_value}`);
      } else if (
        p.cr4de_risk_file.cr4de_step2b_enabled &&
        p.cr4de_risk_file.cr4de_risk_type === RISK_TYPE.EMERGING
      ) {
        if (p._cr4de_direct_analysis_value === null) {
          setIsLoading(true);

          const newDirectAnalysis = await api.createDirectAnalysis({
            "cr4de_expert@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${p._cr4de_contact_value})`,
            "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${p._cr4de_risk_file_value})`,
          });

          await api.updateParticipant(p.cr4de_bnraparticipationid, {
            "cr4de_direct_analysis@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnravalidations(${newDirectAnalysis.id})`,
          });

          navigate(`/step2B/${newDirectAnalysis.id}`);

          setIsLoading(false);
        } else {
          navigate(`/step2B/${p._cr4de_direct_analysis_value}`);
        }
      } else if (p.cr4de_risk_file.cr4de_step2a_enabled) {
        if (p.cr4de_risk_file.cr4de_risk_type === "Emerging Risk") {
          window.alert(
            t(
              "riskFile.steps.2A.emerging",
              "The Analysis A step is not available for Emerging Risks. We will contact you when the Analysis B step becomes available."
            )
          );
        } else if (p._cr4de_direct_analysis_value === null) {
          setIsLoading(true);

          const newDirectAnalysis = await api.createDirectAnalysis({
            "cr4de_expert@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${p._cr4de_contact_value})`,
            "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${p._cr4de_risk_file_value})`,
          });

          await api.updateParticipant(p.cr4de_bnraparticipationid, {
            "cr4de_direct_analysis@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnravalidations(${newDirectAnalysis.id})`,
          });

          navigate(`/step2A/${newDirectAnalysis.id}`);

          setIsLoading(false);
        } else {
          navigate(`/step2A/${p._cr4de_direct_analysis_value}`);
        }
      } else {
        if (p._cr4de_validation_value === null) {
          setIsLoading(true);

          const newValidation = await api.createValidation({
            "cr4de_expert@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${p._cr4de_contact_value})`,
            "cr4de_RiskFile@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${p._cr4de_risk_file_value})`,
          });

          await api.updateParticipant(p.cr4de_bnraparticipationid, {
            "cr4de_validation@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnravalidations(${newValidation.id})`,
          });

          navigate(`/validation/${newValidation.id}`);

          setIsLoading(false);
        } else {
          navigate(`/validation/${p._cr4de_validation_value}`);
        }
      }
    };

  const getValidationTooltip = (p: DVParticipation<unknown, DVRiskFile>) => {
    if (
      p.cr4de_risk_file.cr4de_step2a_enabled ||
      (p.cr4de_risk_file.cr4de_validation_silent_procedure_until &&
        new Date(p.cr4de_risk_file.cr4de_validation_silent_procedure_until) <
          new Date())
    )
      return t(
        "riskFile.steps.1.finished",
        "The validation step has been finalized."
      );
    else if (
      p.cr4de_risk_file.cr4de_validation_silent_procedure_until &&
      new Date(p.cr4de_risk_file.cr4de_validation_silent_procedure_until) >=
        new Date()
    )
      return t(
        "riskFile.steps.1.silenceProcedure",
        "A silence procedure is ongoing for this risk file"
      );
    else if (p.cr4de_validation_finished)
      return t(
        "riskFile.steps.1.complete",
        "You have completed the validation step for this Risk File."
      );
    else
      return t(
        "riskFile.steps.1.progress",
        "The validation step can now be completed."
      );
  };

  const getStep2ATooltip = (p: DVParticipation<unknown, DVRiskFile>) => {
    if (p.cr4de_risk_file.cr4de_risk_type === "Emerging Risk") {
      return t(
        "riskFile.steps.2A.notNeeded",
        'Step 2A is skipped for "Emerging Risks"'
      );
    } else if (p.cr4de_risk_file.cr4de_step2a_enabled) {
      if (p.cr4de_direct_analysis_finished)
        return t(
          "riskFile.steps.2A.complete",
          "You have completed step 2A for this Risk File."
        );
      else
        return t("riskFile.steps.2A.progress", "Step 2A can now be completed.");
    } else {
      return t(
        "riskFile.steps.2A.notyet",
        "This step cannot be started yet, we will contact you when it becomes available"
      );
    }
  };

  const getStep2BTooltip = (p: DVParticipation<unknown, DVRiskFile>) => {
    if (p.cr4de_risk_file.cr4de_step2b_enabled) {
      if (p.cr4de_risk_file.cr4de_risk_type === "Emerging Risk") {
        if (p.cr4de_cascade_analysis_finished)
          return t(
            "riskFile.steps.EM.2B.complete",
            "You have completed step 2 for this Risk File."
          );
        else
          return t(
            "riskFile.steps.EM.2B.progress",
            "Step 2 can now be completed."
          );
      }
      if (p.cr4de_cascade_analysis_finished)
        return t(
          "riskFile.steps.2B.complete",
          "You have completed step 2B for this Risk File."
        );
      else
        return t("riskFile.steps.2B.progress", "Step 2B can now be completed.");
    } else {
      return t(
        "riskFile.steps.2B.notyet",
        "This step cannot be started yet, we will contact you when it becomes available"
      );
    }
  };

  const getStep3Tooltip = (p: DVParticipation<unknown, DVRiskFile>) => {
    if (p.cr4de_risk_file.cr4de_consensus_date) {
      if (new Date(p.cr4de_risk_file.cr4de_consensus_date) < new Date()) {
        if (p.cr4de_risk_file.cr4de_consensus_type === CONSENSUS_TYPE.MEETING) {
          return t("riskFile.steps.3.meeting", "Awaiting consensus meeting.");
        } else {
          return t(
            "riskFile.steps.3.silence",
            "A silence procedure is ongoing for this risk file."
          );
        }
      }
      return t(
        "riskFile.steps.3.complete",
        "The consensus step for this risk file has been completed."
      );
    }
    return t(
      "riskFile.steps.3.notyet",
      "This step cannot be started yet, we will contact you when it becomes available"
    );
  };

  const getActiveStep = (p: DVParticipation<unknown, DVRiskFile>) => {
    if (p.cr4de_risk_file.cr4de_consensus_type !== null) {
      return 3;
    }
    if (
      p.cr4de_risk_file.cr4de_step2b_enabled &&
      (p.cr4de_risk_file.cr4de_risk_type === RISK_TYPE.EMERGING ||
        p.cr4de_direct_analysis_finished)
    ) {
      return 2;
    }
    if (p.cr4de_risk_file.cr4de_step2a_enabled) {
      return 1;
    }
    return 0;
  };

  return (
    <>
      <Backdrop
        open={isLoading}
        sx={{
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={30} />
      </Backdrop>
      <Paper>
        <List sx={{ width: "100%", bgcolor: "background.paper", mb: 10 }}>
          {participations &&
            (participations.length <= 0 ? (
              <ListItem>
                <ListItemText
                  primary={t(
                    "overview.noRisks",
                    "No risks have currently been assigned to you"
                  )}
                />
              </ListItem>
            ) : (
              participations.map((p) => (
                <ListItem key={p.cr4de_bnraparticipationid} disablePadding>
                  <ListItemButton onClick={handleClick(p)}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          fontSize: 13,
                          bgcolor: getCategoryColor(
                            p.cr4de_risk_file.cr4de_risk_category
                          ),
                        }}
                      >
                        {p.cr4de_risk_file.cr4de_hazard_id}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={p.cr4de_risk_file.cr4de_title}
                      secondary={t(p.cr4de_risk_file.cr4de_risk_type)}
                      sx={{ flex: 1 }}
                    />
                    <ListItemText sx={{ width: "550px", flexGrow: 0 }}>
                      <Stepper
                        activeStep={getActiveStep(p)}
                        alternativeLabel
                        sx={{ width: "550px" }}
                      >
                        <Step completed={Boolean(p._cr4de_validation_value)}>
                          <Tooltip title={getValidationTooltip(p)}>
                            <StepButton
                              disabled={false}
                              onClick={(e) => {
                                if (p._cr4de_validation_value) {
                                  e.stopPropagation();
                                  navigate(
                                    `/validation/${p._cr4de_validation_value}`
                                  );
                                }
                              }}
                            >
                              <StepLabel>
                                <Trans i18nKey="riskFile.steps.1.name">
                                  Identification
                                </Trans>
                              </StepLabel>
                            </StepButton>
                          </Tooltip>
                        </Step>
                        <Step
                          completed={Boolean(
                            p.cr4de_direct_analysis_finished ||
                              (p.cr4de_risk_file.cr4de_risk_type ===
                                "Emerging Risk" &&
                                p.cr4de_risk_file.cr4de_step2b_enabled)
                          )}
                        >
                          <Tooltip title={getStep2ATooltip(p)}>
                            <StepButton
                              disabled={false}
                              icon={
                                p.cr4de_risk_file.cr4de_risk_type ===
                                "Emerging Risk" ? (
                                  <EmergingRisks2AIcon />
                                ) : (
                                  "2A"
                                )
                              }
                              onClick={async (e) => {
                                if (p._cr4de_direct_analysis_value) {
                                  e.stopPropagation();
                                  navigate(
                                    `/step2A/${p._cr4de_direct_analysis_value}`
                                  );
                                } else if (user?.admin) {
                                  e.stopPropagation();
                                  setIsLoading(true);

                                  const newDirectAnalysis =
                                    await api.createDirectAnalysis({
                                      "cr4de_expert@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${p._cr4de_contact_value})`,
                                      "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${p._cr4de_risk_file_value})`,
                                    });

                                  await api.updateParticipant(
                                    p.cr4de_bnraparticipationid,
                                    {
                                      "cr4de_direct_analysis@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_bnravalidations(${newDirectAnalysis.id})`,
                                    }
                                  );

                                  navigate(`/step2A/${newDirectAnalysis.id}`);

                                  setIsLoading(false);
                                }
                              }}
                            >
                              <StepLabel>
                                {p.cr4de_risk_file.cr4de_risk_type ===
                                "Emerging Risk" ? (
                                  "-"
                                ) : (
                                  <Trans i18nKey="riskFile.steps.2A.name">
                                    Analysis A
                                  </Trans>
                                )}
                              </StepLabel>
                            </StepButton>
                          </Tooltip>
                        </Step>
                        <Step
                          completed={Boolean(p.cr4de_cascade_analysis_finished)}
                        >
                          <Tooltip title={getStep2BTooltip(p)}>
                            <StepButton
                              disabled={false}
                              icon={
                                p.cr4de_risk_file.cr4de_risk_type ===
                                "Emerging Risk"
                                  ? "2"
                                  : "2B"
                              }
                              onClick={(e) => {
                                if (
                                  p._cr4de_direct_analysis_value &&
                                  p.cr4de_risk_file.cr4de_step2b_enabled &&
                                  p.cr4de_direct_analysis_finished
                                ) {
                                  e.stopPropagation();
                                  navigate(
                                    `/step2B/${p._cr4de_direct_analysis_value}`
                                  );
                                }
                              }}
                            >
                              <StepLabel>
                                {p.cr4de_risk_file.cr4de_risk_type ===
                                "Emerging Risk" ? (
                                  <Trans i18nKey="riskFile.EM.steps.2B.name">
                                    Analysis
                                  </Trans>
                                ) : (
                                  <Trans i18nKey="riskFile.steps.2B.name">
                                    Analysis B
                                  </Trans>
                                )}
                              </StepLabel>
                            </StepButton>
                          </Tooltip>
                        </Step>
                        <Step
                          completed={Boolean(
                            p.cr4de_risk_file.cr4de_consensus_date &&
                              new Date(p.cr4de_risk_file.cr4de_consensus_date) >
                                new Date()
                          )}
                        >
                          <Tooltip title={getStep3Tooltip(p)}>
                            <StepButton
                              disabled={false}
                              icon={"3"}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/consensus/${p._cr4de_risk_file_value}`
                                );
                              }}
                            >
                              <StepLabel>
                                <Trans i18nKey="riskFile.steps.3.name">
                                  Consensus
                                </Trans>
                              </StepLabel>
                            </StepButton>
                          </Tooltip>
                        </Step>
                      </Stepper>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              ))
            ))}
          {!participations &&
            [1, 2, 3].map((i) => (
              <ListItem key={i}>
                <Stack direction="row" sx={{ flex: 1 }}>
                  <Skeleton
                    variant="circular"
                    width={42}
                    height={42}
                    sx={{ mr: "14px" }}
                  ></Skeleton>
                  <Stack direction="column" sx={{ flex: 1, maxWidth: 300 }}>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                    ></Skeleton>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "0.7rem" }}
                    ></Skeleton>
                  </Stack>
                </Stack>
              </ListItem>
            ))}
        </List>
      </Paper>
    </>
  );
}

export default React.memo(RiskFileList);
