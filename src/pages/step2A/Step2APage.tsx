import { useState, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import usePageTitle from "../../hooks/usePageTitle";
import useRecord from "../../hooks/useRecord";
import { DVDirectAnalysis } from "../../types/dataverse/DVDirectAnalysis";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { Box, Button, Paper, Fade, Container, Typography, Drawer, Alert } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import Progress from "./Progress";
import InformationButton from "./InformationButton";
import TextInputBox from "../../components/TextInputBox";
import useLazyRecords from "../../hooks/useLazyRecords";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import openInNewTab from "../../functions/openInNewTab";
import Stack from "@mui/material/Stack";
import { hasDrawer, STEPS } from "./Steps";
import CausesSidebar from "./CausesSidebar";
import EffectsSidebar from "./EffectsSidebar";
import QuantitativeAnalysis from "./QuantitativeAnalysis";
import getDefaultFields from "./fields";
import QualitativeAnalysis from "./QualitativeAnalysis";
import SavingOverlay from "./SavingOverlay";
import Review from "./Review";

type RouteParams = {
  step2A_id: string;
};

const transitionDelay = 500;

const DRAWER_WIDTH = 360;

export default function Step2APage() {
  const { t } = useTranslation();
  const params = useParams() as RouteParams;
  const navigate = useNavigate();
  const api = useAPI();
  const { user } = useLoggedInUser();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fade, setFade] = useState(true);
  const [step, setStep] = useState<STEPS | null>(null);
  const [inputFields, setInputFields] = useState<Partial<DVDirectAnalysis> | null>(null);

  const {
    data: causes,
    loading: loadingCauses,
    getData: loadCauses,
  } = useLazyRecords<DVRiskCascade<DVRiskFile>>({
    table: DataTable.RISK_CASCADE,
    transformResult: (result: DVRiskCascade<DVRiskFile>[]) => {
      return result.sort((a, b) => a.cr4de_cause_hazard.cr4de_title.localeCompare(b.cr4de_cause_hazard.cr4de_title));
    },
  });
  const {
    data: effects,
    loading: loadingEffects,
    getData: loadEffects,
  } = useLazyRecords<DVRiskCascade<undefined, DVRiskFile>>({
    table: DataTable.RISK_CASCADE,
    transformResult: (result: DVRiskCascade<undefined, DVRiskFile>[]) => {
      return result.sort((a, b) => a.cr4de_effect_hazard.cr4de_title.localeCompare(b.cr4de_effect_hazard.cr4de_title));
    },
  });

  // useEffect(() => {
  //   api.getContacts("$filter=emailaddress1 eq 'laurie.phillips@economie.fgov.be'").then((cs) => {
  //     api.deleteContact(cs[0].contactid);
  //   });
  // }, []);

  /**
   * Retrieve the step 2A record from the database that is defined in the page url when the page loads
   */
  const { data: step2A } = useRecord<DVDirectAnalysis<DVRiskFile>>({
    table: DataTable.DIRECT_ANALYSIS,
    id: params.step2A_id,
    query: "$expand=cr4de_risk_file",
    onComplete: async (step2A) => {
      loadCauses({
        query: `$filter=_cr4de_effect_hazard_value eq ${step2A._cr4de_risk_file_value}&$expand=cr4de_cause_hazard($select=cr4de_title)`,
      });
      loadEffects({
        query: `$filter=_cr4de_cause_hazard_value eq ${step2A._cr4de_risk_file_value}&$expand=cr4de_effect_hazard($select=cr4de_title)`,
      });
      setInputFields(getDefaultFields(step2A));
    },
  });

  const handleSave = async () => {
    if (!step2A || !inputFields || isSaving) return;

    setIsSaving(true);

    try {
      await api.updateDirectAnalysis(step2A.cr4de_bnradirectanalysisid, inputFields);

      setIsSaving(false);
      setSaveError(false);
    } catch (e) {
      setSaveError(true);

      setIsSaving(false);
      throw e;
    }
  };

  const handleUpdateField = (fieldName: keyof DVRiskFile) => (newValue: string | null) => {
    setInputFields({
      ...inputFields,
      [fieldName]: newValue,
    });
  };

  usePageTitle(t("step2A.pageTitle", "BNRA 2023 - 2026 Risk Analysis (Direct Analysis)"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("step2A.breadcrumb", "Risk Analysis A"), url: "/overview" },
    step2A ? { name: step2A.cr4de_risk_file.cr4de_title, url: "" } : null,
  ]);

  const transitionTo = (newStep: STEPS) => {
    setFade(false);
    const timer = setTimeout(() => {
      setStep(newStep);
      setFade(true);
      window.scrollTo(0, 0);
    }, transitionDelay);

    return () => clearTimeout(timer);
  };

  const next = async () => {
    await handleSave();

    if (step === STEPS.REVIEW) {
      // TODO: Save and exit
    } else {
      transitionTo(step !== null ? step + 1 : STEPS.QUALI_P);
    }
  };

  const previous = async () => {
    await handleSave();

    if (step === null || step === STEPS.QUALI_P) {
      // TODO: Save and exit
    } else {
      transitionTo(step - 1);
    }
  };

  useEffect(() => {
    if (step === null && inputFields !== null) {
      transitionTo(STEPS.REVIEW);
    }
  }, [step, inputFields]);

  const drawerWidth = step && hasDrawer[step] ? DRAWER_WIDTH : 0;

  return (
    <>
      <Container>
        {saveError && (
          <Box style={{ marginRight: drawerWidth, marginTop: 32, marginBottom: -32 }}>
            <Alert severity="error" onClose={() => setSaveError(false)}>
              <Typography paragraph variant="body2">
                <Trans i18nKey="2A.savingError.1">
                  An error occured while saving your input. Please check your internet connection and try again.
                </Trans>
              </Typography>
              <Typography paragraph variant="body2">
                <Trans i18nKey="2A.savingError.2">If the error keeps returning, please contact us.</Trans>
              </Typography>
            </Alert>
          </Box>
        )}
        <SavingOverlay visible={isSaving} drawerWidth={drawerWidth} />
        <Fade in={fade} timeout={transitionDelay}>
          <Box sx={{ mt: 8, mb: 16 }}>
            {step === null && (
              <Box sx={{ mt: 32, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            )}
            {inputFields && step === STEPS.QUALI_P && (
              <>
                <Box style={{ marginRight: drawerWidth, position: "relative" }}>
                  <Box sx={{ mb: 2, ml: 1 }}>
                    <Typography variant="h6">
                      <Trans i18nKey="2A.qualiP.title">Direct Probability</Trans>
                    </Typography>
                  </Box>
                  <Stack sx={{ mb: 4, ml: 1 }} rowGap={2}>
                    <Typography variant="body2">
                      <Trans i18nKey="2A.qualiP.info.1">Explanation about filling in the direct probability</Trans>
                    </Typography>
                    <Typography variant="body2">
                      <Trans i18nKey="2A.qualiP.info.2">Do not take into account the causes on the right</Trans>
                    </Typography>
                    <QualitativeAnalysis
                      initialValue={inputFields.cr4de_dp_quali || ""}
                      handleUpdateValue={handleUpdateField("cr4de_dp_quali")}
                    />
                  </Stack>
                </Box>
                <CausesSidebar width={drawerWidth} loading={loadingCauses} causes={causes} />
              </>
            )}
            {inputFields && step === STEPS.QUALI_I_H && (
              <>
                <Box style={{ marginRight: drawerWidth }}>
                  <Box sx={{ mb: 2, ml: 1 }}>
                    <Typography variant="h6">
                      <Trans i18nKey="2A.qualiIH.title">Direct Impact - Human Impact</Trans>
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 4, ml: 1 }}>
                    <Typography variant="body2">
                      <Trans i18nKey="2A.qualiIH.info.1">Explanation about filling in the direct human impact</Trans>
                    </Typography>
                  </Box>
                  <QualitativeAnalysis
                    initialValue={inputFields.cr4de_di_quali_h || ""}
                    handleUpdateValue={handleUpdateField("cr4de_di_quali_h")}
                  />
                </Box>
                <EffectsSidebar width={drawerWidth} loading={loadingEffects} effects={effects} />
              </>
            )}
            {inputFields && step === STEPS.QUALI_I_S && (
              <>
                <Box style={{ marginRight: drawerWidth }}>
                  <Box sx={{ mb: 2, ml: 1 }}>
                    <Typography variant="h6">
                      <Trans i18nKey="2A.qualiIS.title">Direct Impact - Societal Impact</Trans>
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 4, ml: 1 }}>
                    <Typography variant="body2">
                      <Trans i18nKey="2A.qualiIS.info.1">Explanation about filling in the direct societal impact</Trans>
                    </Typography>
                  </Box>
                  <QualitativeAnalysis
                    initialValue={inputFields.cr4de_di_quali_s || ""}
                    handleUpdateValue={handleUpdateField("cr4de_di_quali_s")}
                  />
                </Box>
                <EffectsSidebar width={drawerWidth} loading={loadingEffects} effects={effects} />
              </>
            )}
            {inputFields && step === STEPS.QUALI_I_E && (
              <>
                <Box style={{ marginRight: drawerWidth }}>
                  <Box sx={{ mb: 2, ml: 1 }}>
                    <Typography variant="h6">
                      <Trans i18nKey="2A.qualiIE.title">Direct Impact - Environmental Impact</Trans>
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 4, ml: 1 }}>
                    <Typography variant="body2">
                      <Trans i18nKey="2A.qualiIE.info.1">
                        Explanation about filling in the direct environmental impact
                      </Trans>
                    </Typography>
                  </Box>
                  <QualitativeAnalysis
                    initialValue={inputFields.cr4de_di_quali_e || ""}
                    handleUpdateValue={handleUpdateField("cr4de_di_quali_e")}
                  />
                </Box>
                <EffectsSidebar width={drawerWidth} loading={loadingEffects} effects={effects} />
              </>
            )}
            {inputFields && step === STEPS.QUALI_I_F && (
              <>
                <Box style={{ marginRight: drawerWidth }}>
                  <Box sx={{ mb: 2, ml: 1 }}>
                    <Typography variant="h6">
                      <Trans i18nKey="2A.qualiIF.title">Direct Impact - Financial Impact</Trans>
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 4, ml: 1 }}>
                    <Typography variant="body2">
                      <Trans i18nKey="2A.qualiIF.info.1">
                        Explanation about filling in the direct financial impact
                      </Trans>
                    </Typography>
                  </Box>
                  <QualitativeAnalysis
                    initialValue={inputFields.cr4de_di_quali_f || ""}
                    handleUpdateValue={handleUpdateField("cr4de_di_quali_f")}
                  />
                </Box>
                <EffectsSidebar width={drawerWidth} loading={loadingEffects} effects={effects} />
              </>
            )}
            {inputFields && step === STEPS.QUALI_CB && (
              <>
                <Box style={{ marginRight: drawerWidth }}>
                  <Box sx={{ mb: 2, ml: 1 }}>
                    <Typography variant="h6">
                      <Trans i18nKey="2A.qualiCB.title">Cross-border Impact</Trans>
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 4, ml: 1 }}>
                    <Typography variant="body2">
                      <Trans i18nKey="2A.qualiCB.info.1">
                        Explanation about filling in the potential cross-border impact
                      </Trans>
                    </Typography>
                  </Box>
                  <QualitativeAnalysis
                    initialValue={inputFields.cr4de_cross_border_impact_quali || ""}
                    handleUpdateValue={handleUpdateField("cr4de_cross_border_impact_quali")}
                  />
                </Box>
                <EffectsSidebar width={drawerWidth} loading={loadingEffects} effects={effects} />
              </>
            )}
            {inputFields && step === STEPS.QUANTI_C && step2A?.cr4de_risk_file && (
              <Box>
                <Box sx={{ mb: 2, ml: 1 }}>
                  <Typography variant="h6">
                    <Trans i18nKey="2A.quantiC.title">Quantitative Analysis - Considerable Scenario</Trans>
                  </Typography>
                </Box>
                <QuantitativeAnalysis riskFile={step2A.cr4de_risk_file} scenarioName="considerable" />
              </Box>
            )}
            {inputFields && step === STEPS.QUANTI_M && step2A?.cr4de_risk_file && (
              <Box>
                <Box sx={{ mb: 2, ml: 1 }}>
                  <Typography variant="h6">
                    <Trans i18nKey="2A.quantiM.title">Quantitative Analysis - Major Scenario</Trans>
                  </Typography>
                </Box>
                <QuantitativeAnalysis riskFile={step2A.cr4de_risk_file} scenarioName="major" />
              </Box>
            )}
            {inputFields && step === STEPS.QUANTI_E && step2A?.cr4de_risk_file && (
              <Box>
                <Box sx={{ mb: 2, ml: 1 }}>
                  <Typography variant="h6">
                    <Trans i18nKey="2A.quantiE.title">Quantitative Analysis - Extreme Scenario</Trans>
                  </Typography>
                </Box>
                <QuantitativeAnalysis riskFile={step2A.cr4de_risk_file} scenarioName="extreme" />
              </Box>
            )}
            {inputFields && step === STEPS.REVIEW && (
              <Box>
                <Box sx={{ mb: 2, ml: 1 }}>
                  <Typography variant="h6">
                    <Trans i18nKey="2A.review.title">Review your answers</Trans>
                  </Typography>
                </Box>
                <Review input={inputFields} />
              </Box>
            )}
          </Box>
        </Fade>
      </Container>
      <InformationButton riskFile={step2A?.cr4de_risk_file} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          p: 1,
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1001,
        }}
        component={Paper}
        elevation={5}
      >
        <Button id="back-button" disabled={isSaving} color="secondary" onClick={previous}>
          <Trans i18nKey="button.back">Back</Trans>
        </Button>

        <Progress currentStep={step || 0} />

        <Button id="next-button" disabled={isSaving} color="primary" sx={{ mr: 1 }} onClick={next}>
          <Trans i18nKey="button.next">Next</Trans>
        </Button>
      </Box>
    </>
  );
}
