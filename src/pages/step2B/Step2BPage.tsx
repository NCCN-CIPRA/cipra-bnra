import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import usePageTitle from "../../hooks/usePageTitle";
import { DVCascadeAnalysis } from "../../types/dataverse/DVCascadeAnalysis";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import { useNavigate, useOutletContext, useParams, useSearchParams } from "react-router-dom";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useRecord from "../../hooks/useRecord";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import Standard from "./standard/Standard";
import { STEPS } from "./Steps";
import CircularProgress from "@mui/material/CircularProgress";
import { AuthPageContext } from "../AuthPage";
import SurveyDialog from "../../components/SurveyDialog";
import { FeedbackStep } from "../../types/dataverse/DVFeedback";
import FinishDialog from "./information/FinishDialog";
import { Step2BErrors, validateStep2B } from "./information/validateInput";
import { CrossFade } from "../../components/CrossFade";

type RouteParams = {
  step2A_id: string;
};

const transitionDelay = 500;

export default function ({}) {
  const { t } = useTranslation();
  const { user } = useOutletContext<AuthPageContext>();
  const routeParams = useParams() as RouteParams;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const api = useAPI();

  const [saveError, setSaveError] = useState(false);

  const [finishedDialogOpen, setFinishedDialogOpen] = useState(false);
  const [surveyDialogOpen, setSurveyDialogOpen] = useState(false);
  const [inputErrors, setInputErrors] = useState<Step2BErrors | null>(null);

  /**
   * Retrieve the direct analysis record from the database that is defined in the page url when the page loads
   */
  const {
    data: directAnalysis,
    isFetching: isFetchingDirectAnalysis,
    reloadData: reloadDirectAnalysis,
  } = useRecord<DVDirectAnalysis<DVRiskFile>>({
    table: DataTable.DIRECT_ANALYSIS,
    id: routeParams.step2A_id,
    query: "$expand=cr4de_risk_file",
  });

  const riskType = directAnalysis?.cr4de_risk_file.cr4de_risk_type;

  const handleTransitionTo = (newStep: STEPS, newIndex: number = 0) => {
    setSearchParams({
      step: newStep.toString(),
      index: newIndex.toString(),
    });
  };

  const handleFinish = async () => {
    if (!directAnalysis) return;

    setFinishedDialogOpen(true);
    setInputErrors(null);

    const step2B = await api.getCascadeAnalyses<DVCascadeAnalysis<DVRiskCascade<DVRiskFile>>>(
      `$orderby=createdon&$filter=_cr4de_expert_value eq ${user?.contactid} and _cr4de_risk_file_value eq ${directAnalysis._cr4de_risk_file_value}&$expand=cr4de_cascade($select=cr4de_cause_hazard;$expand=cr4de_cause_hazard($select=cr4de_title,cr4de_risk_type))`
    );

    setInputErrors(validateStep2B(directAnalysis, step2B));
  };

  usePageTitle(t("step2B.pageTitle", "BNRA 2023 - 2026 Risk Analysis B"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("step2B.breadcrumb", "Risk Analysis B"), url: "/overview" },
    directAnalysis ? { name: directAnalysis.cr4de_risk_file?.cr4de_title, url: "" } : null,
  ]);

  return (
    <>
      <Container sx={{ position: "relative" }}>
        <Dialog
          open={saveError}
          onClose={() => setSaveError(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography paragraph>
                <Trans i18nKey="2A.savingError.1">
                  An error occured while saving your input. Please check your internet connection.
                </Trans>
              </Typography>
              <Typography paragraph>
                <Trans i18nKey="2A.savingError.2">A new autosave will be attempted in 10 seconds.</Trans>
              </Typography>
              <Typography paragraph>
                <Trans i18nKey="2A.savingError.3">If the error keeps returning, please contact us.</Trans>
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveError(false)} autoFocus>
              <Trans i18nKey="button.ok">Ok</Trans>
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      <CrossFade
        components={[
          {
            in: !directAnalysis,
            component: (
              <Box sx={{ mt: 32, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            ),
          },
          {
            in: Boolean(directAnalysis && riskType === RISK_TYPE.STANDARD),
            component: directAnalysis && (
              <Standard
                directAnalysis={directAnalysis}
                isFetchingDirectAnalysis={isFetchingDirectAnalysis}
                reloadDirectAnalysis={reloadDirectAnalysis}
                onFinish={handleFinish}
              />
            ),
          },
        ]}
      />

      {directAnalysis && (
        <FinishDialog
          step2A={directAnalysis}
          finishedDialogOpen={finishedDialogOpen}
          inputErrors={inputErrors}
          setFinishedDialogOpen={setFinishedDialogOpen}
          setSurveyDialogOpen={setSurveyDialogOpen}
          onTransitionTo={handleTransitionTo}
        />
      )}

      {directAnalysis && (
        <SurveyDialog
          open={surveyDialogOpen}
          riskFile={directAnalysis?.cr4de_risk_file}
          step={FeedbackStep.STEP_2A}
          onClose={() => {
            setSurveyDialogOpen(false);
            navigate("/overview");
          }}
        />
      )}
    </>
  );
}
