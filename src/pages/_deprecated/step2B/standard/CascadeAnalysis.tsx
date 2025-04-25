import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Tooltip, Container, Alert, Typography, Stack, Button, Link, CircularProgress } from "@mui/material";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { SCENARIOS, unwrap as unwrapScenarios } from "../../../functions/scenarios";
import { unwrap as unwrapParameters } from "../../../functions/intensityParameters";
import { Trans, useTranslation } from "react-i18next";
import AutoHeight from "../../../components/AutoHeight";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { getCascadeField } from "../../../functions/cascades";
import CascadeMatrix from "../information/CascadeMatrix";
import QualiTextInputBox from "../../step2A/sections/QualiTextInputBox";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { FadedScenario, FullScenario } from "../information/Scenarios";
import { CrossFade, CrossFade2 } from "../../../components/CrossFade";
import CascadeSlider from "../information/CascadeSlider";
import InformationButton from "../information/InformationButton";
import useLazyRecords from "../../../hooks/useLazyRecords";
import AttachmentsDialog from "../information/AttachmentsDialog";
import CascadeTutorial from "../information/CascadeTutorial";

const TRANSITION_MS = 1000;
const TRANSITION_S = "1s";

export default function CascadeAnalysis({
  directAnalysis,
  cascadeAnalysis,
  cascade,

  index,
  count,

  quantiErrors,
  qualiError,

  reloadCascadeAnalysis,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  cascadeAnalysis: DVCascadeAnalysis | null;
  cascade: DVRiskCascade<DVRiskFile>;

  index: number;
  count: number;

  quantiErrors: boolean[] | null;
  qualiError: boolean;

  reloadCascadeAnalysis: () => Promise<unknown>;
}) {
  const { t } = useTranslation();

  const [visibleCascade, setVisibleCascade] = useState(1);
  const [cascade1, setCascade1] = useState<DVRiskCascade<DVRiskFile> | null>(cascade);
  const [cascade2, setCascade2] = useState<DVRiskCascade<DVRiskFile> | null>(null);

  const [runTutorial, setRunTutorial] = useState(false);

  useEffect(() => {
    if (visibleCascade === 1 && cascade !== null) {
      if (cascade !== cascade1) {
        setCascade2(cascade);
        setVisibleCascade(2);
      }
    } else {
      if (cascade !== cascade2) {
        setCascade1(cascade);
        setVisibleCascade(1);
      }
    }
  }, [cascade]);

  useEffect(() => {
    if (qualiError) {
      window.scrollTo({
        behavior: "smooth",
        top: window.scrollY + (document.getElementById("quali-input")?.getBoundingClientRect().top || 0),
      });
    }
  }, [qualiError]);

  return (
    <Box sx={{ mx: "123px", pb: 12 }}>
      <Container>
        <Stack direction="column" sx={{ mb: 6, ml: 0 }}>
          <Typography variant="h4">
            <Trans i18nKey="2B.causes.title">Cause</Trans>
          </Typography>
          <Typography variant="body2" paragraph sx={{ mt: 2 }}>
            <Trans i18nKey="2B.causes.intro.1">
              Cette page vous permet d'évaluer, pour chaque relation de cause à effet identifiée dans l'étape 1 de la
              BNRA, les probabilités conditionnelles entre les différents scénarios d'intensité des risques causaux et
              des risques conséquents.
            </Trans>
          </Typography>
          <Box sx={{ textAlign: "center", mt: 1, mb: 4 }}>
            <Button variant="contained" onClick={() => setRunTutorial(true)}>
              <Trans i18nKey="2B.introduction.button.tutorial.part">Show Tutorial for this page</Trans>
            </Button>
          </Box>
          <Typography variant="body2" paragraph>
            <Trans i18nKey="2B.causes.intro.2">
              Notez que chaque relation de cause à effet avec 3 scénarios d'intensité (considérable, majeure, extrême)
              nécessite 9 estimations de la probabilité conditionnelle.
            </Trans>
          </Typography>
          <Typography variant="body2" paragraph>
            <Trans i18nKey="2B.causes.intro.3">
              Veuillez sélectionner ci-dessous une estimation quantitative de la probabilité conditionnelle que le
              scénario d'intensité actuellement étudié se produise au cours de la période 2023-2026, en conséquence d'un
              autre risque de la BNRA.
            </Trans>
          </Typography>
          <Typography variant="body2" paragraph>
            <Trans i18nKey="2B.causes.intro.4">
              Vous pouvez naviguer entre les différents scénarios d'intensité soit en cliquant directement sur les
              scénarios d'intensité d'intérêt, soit en cliquant sur la flèche à droite des classes de probabilité
              conditionnelles.
            </Trans>
          </Typography>
          <Alert severity="info" sx={{ mt: 2, mb: 0 }}>
            <Typography variant="body2">
              <Trans i18nKey="2B.causes.info.1">
                Attention, il est nécessaire d'évaluer toutes les probabilités conditionnelles et de remplir tous les
                champs concernant chaque relation de cause à effet avant de pouvoir passer à l'étape suivante.
              </Trans>
            </Typography>
            <Typography variant="body2">
              <Trans i18nKey="2B.causes.info.2">
                Bien qu'il soit important pour nous de disposer d'une justification quant à la valeur quantitative que
                vous avez choisie, si vous ne souhaitez pas nous fournir de justification textuelle, nous vous invitons
                à cliquer sur le bouton PAS DE COMMENTAIRES.
              </Trans>
            </Typography>
          </Alert>
          <Alert severity="warning" sx={{ mt: 2, mb: 0 }}>
            <Typography variant="body2">
              <Trans i18nKey="2B.causes.warning.1">
                Dans cette étape, il convient d'estimer uniquement la probabilité conditionnelle.
              </Trans>
            </Typography>
            <Typography variant="body2">
              <Trans i18nKey="2B.causes.warning.2">
                Par exemple, lors de l'estimation de la probabilité conditionnelle d'une Dam failure suite à un
                tremblement de terre, il faut uniquement prendre en compte la possibilité d'une défaillance d'un barrage
                due à un tremblement de terre. Tous les autres éléments qui pourraient provoquer une rupture de barrage
                doivent être exclus.
              </Trans>
            </Typography>
          </Alert>
        </Stack>

        <Box sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", top: -72 }} id="cascade-title" />
        </Box>

        <CrossFade2
          components={[
            {
              in: visibleCascade === 1,
              component: cascade1 && (
                <AnalysisSection
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={
                    cascadeAnalysis?._cr4de_cascade_value === cascade1.cr4de_bnrariskcascadeid ? cascadeAnalysis : null
                  }
                  cascade={cascade1}
                  index={index}
                  count={count}
                  quantiErrors={quantiErrors}
                  qualiError={qualiError}
                  reloadCascadeAnalysis={reloadCascadeAnalysis}
                />
              ),
            },
            {
              in: visibleCascade === 2,
              component: cascade2 && (
                <AnalysisSection
                  directAnalysis={directAnalysis}
                  cascadeAnalysis={
                    cascadeAnalysis?._cr4de_cascade_value === cascade2.cr4de_bnrariskcascadeid ? cascadeAnalysis : null
                  }
                  cascade={cascade2}
                  index={index}
                  count={count}
                  quantiErrors={quantiErrors}
                  qualiError={qualiError}
                  reloadCascadeAnalysis={reloadCascadeAnalysis}
                />
              ),
            },
          ]}
        />
      </Container>

      <InformationButton
        showTutorial={true}
        riskFile={directAnalysis.cr4de_risk_file}
        onRunTutorial={() => setRunTutorial(true)}
      />

      <CascadeTutorial run={runTutorial} setRun={setRunTutorial} />
    </Box>
  );
}

const AnalysisSection = ({
  directAnalysis,
  cascadeAnalysis,
  cascade,

  index,
  count,

  quantiErrors,
  qualiError,

  reloadCascadeAnalysis,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  cascadeAnalysis: DVCascadeAnalysis | null;
  cascade: DVRiskCascade<DVRiskFile>;

  index: number;
  count: number;

  quantiErrors: boolean[] | null;
  qualiError: boolean;

  reloadCascadeAnalysis: () => Promise<unknown>;
}) => {
  const api = useAPI();
  const { t } = useTranslation();

  const [activeCauseScenario, setActiveCauseScenario] = useState(SCENARIOS.CONSIDERABLE);
  const [activeEffectScenario, setActiveEffectScenario] = useState(SCENARIOS.CONSIDERABLE);
  const [cp, setCP] = useState(-1);

  const [sourceDialogOpen, setSourceDialogOpen] = useState<string | null>(null);
  const [existingSource, setExistingSource] = useState<DVAttachment | undefined>(undefined);

  const { data: attachments, getData: loadAttachments } = useLazyRecords<DVAttachment<unknown, DVAttachment>>({
    table: DataTable.ATTACHMENT,
  });

  const cause = cascade.cr4de_cause_hazard;
  const effect = directAnalysis.cr4de_risk_file;

  const causeScenarios = unwrapScenarios(
    unwrapParameters(cause.cr4de_intensity_parameters),
    cause.cr4de_scenario_considerable,
    cause.cr4de_scenario_major,
    cause.cr4de_scenario_extreme
  );

  const effectScenarios = unwrapScenarios(
    unwrapParameters(effect.cr4de_intensity_parameters),
    effect.cr4de_scenario_considerable,
    effect.cr4de_scenario_major,
    effect.cr4de_scenario_extreme
  );

  useEffect(() => {
    if (cascadeAnalysis) {
      const cpx = cascadeAnalysis[getCascadeField(activeCauseScenario, activeEffectScenario)];

      setCP(cpx ? parseInt(cpx.replace("CP", ""), 10) : -1);

      if (attachments === null) {
        loadAttachments({
          query: `$filter=_cr4de_cascadeanalysis_value eq '${cascadeAnalysis.cr4de_bnracascadeanalysisid}'&$expand=cr4de_referencedSource`,
          saveOptions: true,
        });
      }
    }
  }, [cascadeAnalysis, activeCauseScenario, activeEffectScenario]);

  useEffect(() => {
    if (cascadeAnalysis && quantiErrors !== null) {
      if (cascadeAnalysis.cr4de_c2c === null) handleChangeScenario(SCENARIOS.CONSIDERABLE, SCENARIOS.CONSIDERABLE);
      else if (cascadeAnalysis.cr4de_c2m === null) handleChangeScenario(SCENARIOS.CONSIDERABLE, SCENARIOS.MAJOR);
      else if (cascadeAnalysis.cr4de_c2e === null) handleChangeScenario(SCENARIOS.CONSIDERABLE, SCENARIOS.EXTREME);
      else if (cascadeAnalysis.cr4de_m2c === null) handleChangeScenario(SCENARIOS.MAJOR, SCENARIOS.CONSIDERABLE);
      else if (cascadeAnalysis.cr4de_m2m === null) handleChangeScenario(SCENARIOS.MAJOR, SCENARIOS.MAJOR);
      else if (cascadeAnalysis.cr4de_m2e === null) handleChangeScenario(SCENARIOS.MAJOR, SCENARIOS.EXTREME);
      else if (cascadeAnalysis.cr4de_e2c === null) handleChangeScenario(SCENARIOS.EXTREME, SCENARIOS.CONSIDERABLE);
      else if (cascadeAnalysis.cr4de_e2m === null) handleChangeScenario(SCENARIOS.EXTREME, SCENARIOS.MAJOR);
      else if (cascadeAnalysis.cr4de_e2e === null) handleChangeScenario(SCENARIOS.EXTREME, SCENARIOS.EXTREME);
      window.scrollTo({
        behavior: "smooth",
        top: window.scrollY + (document.getElementById("cascade-title")?.getBoundingClientRect().top || 0),
      });
    }
  }, [quantiErrors]);

  const handleChangeScenario = (causeScenario: SCENARIOS | null, effectScenario: SCENARIOS | null) => {
    if (causeScenario) setActiveCauseScenario(causeScenario);
    if (effectScenario) setActiveEffectScenario(effectScenario);
  };

  const handleNextScenario = () => {
    if (activeCauseScenario === SCENARIOS.CONSIDERABLE) {
      setActiveCauseScenario(SCENARIOS.MAJOR);
    } else if (activeCauseScenario === SCENARIOS.MAJOR) {
      setActiveCauseScenario(SCENARIOS.EXTREME);
    } else if (activeCauseScenario === SCENARIOS.EXTREME) {
      setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
      if (activeEffectScenario === SCENARIOS.CONSIDERABLE) {
        setActiveEffectScenario(SCENARIOS.MAJOR);
      } else if (activeEffectScenario === SCENARIOS.MAJOR) {
        setActiveEffectScenario(SCENARIOS.EXTREME);
      }
    }
  };

  const handlePreviousScenario = () => {
    if (activeCauseScenario === SCENARIOS.CONSIDERABLE) {
      setActiveCauseScenario(SCENARIOS.EXTREME);
      if (activeEffectScenario === SCENARIOS.MAJOR) {
        setActiveEffectScenario(SCENARIOS.CONSIDERABLE);
      } else if (activeEffectScenario === SCENARIOS.EXTREME) {
        setActiveEffectScenario(SCENARIOS.MAJOR);
      }
    } else if (activeCauseScenario === SCENARIOS.MAJOR) {
      setActiveCauseScenario(SCENARIOS.CONSIDERABLE);
    } else if (activeCauseScenario === SCENARIOS.EXTREME) {
      setActiveCauseScenario(SCENARIOS.MAJOR);
    }
  };

  const handleSave = async () => {
    if (!cascadeAnalysis) return;

    await api.updateCascadeAnalysis(cascadeAnalysis.cr4de_bnracascadeanalysisid, {
      [getCascadeField(activeCauseScenario, activeEffectScenario)]: cp >= 0 ? `CP${cp}` : null,
    });

    reloadCascadeAnalysis();
  };

  const handleOpenSourceDialog = (existingSource?: DVAttachment) => {
    setSourceDialogOpen("cr4de_quali_cascade");
    setExistingSource(existingSource);
  };

  return (
    <Stack direction="column" sx={{ position: "relative", pb: 12 }}>
      <Typography variant="h6" sx={{ mb: 4 }} id="cascade-title-text">
        <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
          <Link to={`/learning/risk/${cause.cr4de_riskfilesid}`} component={RouterLink} target="_blank">
            {cause.cr4de_title}
          </Link>
        </Tooltip>{" "}
        <Trans i18nKey="2B.causes.description">causes a</Trans>{" "}
        <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
          <Link to={`/learning/risk/${effect.cr4de_riskfilesid}`} component={RouterLink} target="_blank">
            {effect.cr4de_title}
          </Link>
        </Tooltip>{" "}
        ({index + 1}/{count})
      </Typography>

      {quantiErrors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography>
            <Trans i18nKey="2B.doneButton.completeAnalysis">
              Please select a value for each cascade before continuing
            </Trans>
          </Typography>
        </Alert>
      )}

      <Box id="analysis-box">
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              transition: `all ${TRANSITION_S} ease`,
              left: activeCauseScenario === SCENARIOS.CONSIDERABLE ? "calc(50% - 57.5px)" : "-131px",
              top: activeCauseScenario === SCENARIOS.EXTREME ? "90px" : "0px",
              opacity: activeCauseScenario === SCENARIOS.CONSIDERABLE ? 0 : 1,
            }}
            onClick={() => handleChangeScenario(SCENARIOS.CONSIDERABLE, null)}
          >
            <FadedScenario scenario={SCENARIOS.CONSIDERABLE} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              transition: `all ${TRANSITION_S} ease`,
              left:
                (activeCauseScenario === SCENARIOS.CONSIDERABLE && "calc(100% + 16px)") ||
                (activeCauseScenario === SCENARIOS.MAJOR && "calc(50% - 57.5px)") ||
                "-131px",
              opacity: activeCauseScenario === SCENARIOS.MAJOR ? 0 : 1,
            }}
            onClick={() => handleChangeScenario(SCENARIOS.MAJOR, null)}
          >
            <FadedScenario scenario={SCENARIOS.MAJOR} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              transition: `all ${TRANSITION_S} ease`,
              right: activeCauseScenario === SCENARIOS.EXTREME ? "calc(50% - 57.5px)" : "-131px",
              top: activeCauseScenario === SCENARIOS.CONSIDERABLE ? "90px" : "0px",
              opacity: activeCauseScenario === SCENARIOS.EXTREME ? 0 : 1,
            }}
            onClick={() => handleChangeScenario(SCENARIOS.EXTREME, null)}
          >
            <FadedScenario scenario={SCENARIOS.EXTREME} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: activeCauseScenario === SCENARIOS.CONSIDERABLE ? "0px" : "-131px",
              width: activeCauseScenario === SCENARIOS.CONSIDERABLE ? "100%" : 115,
              transition: `all ${TRANSITION_S} ease`,
              pointerEvents: activeEffectScenario === SCENARIOS.CONSIDERABLE ? "all" : "none",
            }}
          >
            <FullScenario
              riskType={cause.cr4de_risk_type}
              title={cause.cr4de_title}
              scenario={SCENARIOS.CONSIDERABLE}
              parameters={causeScenarios.considerable}
              visible={activeCauseScenario === SCENARIOS.CONSIDERABLE}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left:
                (activeCauseScenario === SCENARIOS.EXTREME && "-131px") ||
                (activeCauseScenario === SCENARIOS.MAJOR && "0px") ||
                "calc(100% + 16px)",
              width: activeCauseScenario === SCENARIOS.MAJOR ? "100%" : 115,
              transition: `all ${TRANSITION_S} ease`,
              pointerEvents: activeEffectScenario === SCENARIOS.MAJOR ? "all" : "none",
            }}
          >
            <FullScenario
              riskType={cause.cr4de_risk_type}
              title={cause.cr4de_title}
              scenario={SCENARIOS.MAJOR}
              parameters={causeScenarios.major}
              visible={activeCauseScenario === SCENARIOS.MAJOR}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: (activeCauseScenario === SCENARIOS.EXTREME && "0px") || "calc(100% + 16px)",
              width: activeCauseScenario === SCENARIOS.EXTREME ? "100%" : 115,
              transition: `all ${TRANSITION_S} ease`,
              pointerEvents: activeEffectScenario === SCENARIOS.EXTREME ? "all" : "none",
            }}
          >
            <FullScenario
              riskType={cause.cr4de_risk_type}
              title={cause.cr4de_title}
              scenario={SCENARIOS.EXTREME}
              parameters={causeScenarios.extreme}
              visible={activeCauseScenario === SCENARIOS.EXTREME}
            />
          </Box>
          <Box id="cause-scenario" sx={{ pointerEvents: "none" }}>
            <AutoHeight toggle={activeCauseScenario} toggle2={cascade} duration={TRANSITION_S}>
              <FullScenario
                riskType={cause.cr4de_risk_type}
                title={cause.cr4de_title}
                scenario={activeCauseScenario}
                parameters={causeScenarios[activeCauseScenario]}
                visible={true}
              />
            </AutoHeight>
          </Box>
        </Box>

        <CascadeSlider
          cp={cp}
          setCP={setCP}
          showPreviousButton={
            activeCauseScenario !== SCENARIOS.CONSIDERABLE || activeEffectScenario !== SCENARIOS.CONSIDERABLE
          }
          showNextButton={activeCauseScenario !== SCENARIOS.EXTREME || activeEffectScenario !== SCENARIOS.EXTREME}
          onNextScenario={handleNextScenario}
          onPreviousScenario={handlePreviousScenario}
          onSave={handleSave}
        />

        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              transition: `all ${TRANSITION_S} ease`,
              left: activeEffectScenario === SCENARIOS.CONSIDERABLE ? "calc(50% - 57.5px)" : "-131px",
              top: activeEffectScenario === SCENARIOS.EXTREME ? "90px" : "0px",
              opacity: activeEffectScenario === SCENARIOS.CONSIDERABLE ? 0 : 1,
            }}
            onClick={() => handleChangeScenario(null, SCENARIOS.CONSIDERABLE)}
          >
            <FadedScenario scenario={SCENARIOS.CONSIDERABLE} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              transition: `all ${TRANSITION_S} ease`,
              left:
                (activeEffectScenario === SCENARIOS.CONSIDERABLE && "calc(100% + 16px)") ||
                (activeEffectScenario === SCENARIOS.MAJOR && "calc(50% - 57.5px)") ||
                "-131px",
              opacity: activeEffectScenario === SCENARIOS.MAJOR ? 0 : 1,
            }}
            onClick={() => handleChangeScenario(null, SCENARIOS.MAJOR)}
          >
            <FadedScenario scenario={SCENARIOS.MAJOR} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              transition: `all ${TRANSITION_S} ease`,
              right: activeEffectScenario === SCENARIOS.EXTREME ? "calc(50% - 57.5px)" : "-131px",
              top: activeEffectScenario === SCENARIOS.CONSIDERABLE ? "90px" : "0px",
              opacity: activeEffectScenario === SCENARIOS.EXTREME ? 0 : 1,
            }}
            onClick={() => handleChangeScenario(null, SCENARIOS.EXTREME)}
          >
            <FadedScenario scenario={SCENARIOS.EXTREME} />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: activeEffectScenario === SCENARIOS.CONSIDERABLE ? "0px" : "-131px",
              width: activeEffectScenario === SCENARIOS.CONSIDERABLE ? "100%" : 115,
              transition: `all ${TRANSITION_S} ease`,
              pointerEvents: activeEffectScenario === SCENARIOS.CONSIDERABLE ? "all" : "none",
            }}
          >
            <FullScenario
              riskType={effect.cr4de_risk_type}
              title={effect.cr4de_title}
              scenario={SCENARIOS.CONSIDERABLE}
              parameters={effectScenarios.considerable}
              visible={activeEffectScenario === SCENARIOS.CONSIDERABLE}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left:
                (activeEffectScenario === SCENARIOS.EXTREME && "-131px") ||
                (activeEffectScenario === SCENARIOS.MAJOR && "0px") ||
                "calc(100% + 16px)",
              width: activeEffectScenario === SCENARIOS.MAJOR ? "100%" : 115,
              transition: `all ${TRANSITION_S} ease`,
              pointerEvents: activeEffectScenario === SCENARIOS.MAJOR ? "all" : "none",
            }}
          >
            <FullScenario
              riskType={effect.cr4de_risk_type}
              title={effect.cr4de_title}
              scenario={SCENARIOS.MAJOR}
              parameters={effectScenarios.major}
              visible={activeEffectScenario === SCENARIOS.MAJOR}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: (activeEffectScenario === SCENARIOS.EXTREME && "0px") || "calc(100% + 16px)",
              width: activeEffectScenario === SCENARIOS.EXTREME ? "100%" : 115,
              transition: `all ${TRANSITION_S} ease`,
              pointerEvents: activeEffectScenario === SCENARIOS.EXTREME ? "all" : "none",
            }}
          >
            <FullScenario
              riskType={effect.cr4de_risk_type}
              title={effect.cr4de_title}
              scenario={SCENARIOS.EXTREME}
              parameters={effectScenarios.extreme}
              visible={activeEffectScenario === SCENARIOS.EXTREME}
            />
          </Box>
          <Box id="effect-scenario" sx={{ pointerEvents: "none" }}>
            <AutoHeight toggle={activeEffectScenario} toggle2={cascade} duration={TRANSITION_S}>
              <FullScenario
                riskType={effect.cr4de_risk_type}
                title={effect.cr4de_title}
                scenario={activeEffectScenario}
                parameters={effectScenarios[activeEffectScenario]}
                visible={true}
              />
            </AutoHeight>
          </Box>
        </Box>
      </Box>

      <Stack direction="column" sx={{ marginTop: 10 }}>
        <Typography variant="body2" paragraph>
          <Trans i18nKey="2B.causes.summary.1">
            Dans le tableau ci-dessous, vous trouverez, pour chaque lien de cause à effet, un aperçu de l’ensemble de
            vos évaluation quantitatives. Cet aperçu se met à jour automatiquement. Il vous permet de vérifier la
            cohérence de vos évaluations.
          </Trans>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.causes.summary.2">
                In de kolomen: Controleer of de opgegeven CPx waardes voor éénzelfde intensiteitsscenario van het
                gevolgrisico (bv. grootschalig gevolgrisico) <b>gelijk blijven of toenemen</b> met de toenemende
                intensiteit van het scenario van het oorzaakrisico (van boven naar beneden: aanzienlijk --&gt;
                grootschalig --&gt; extreem oorzaakrisico).
              </Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2" paragraph>
              <Trans i18nKey="2B.causes.summary.4">
                In de rijen: Controleer of de opgegeven CPx waardes voor éénzelfde intensiteitsscenario van het
                oorzaakrisico (bv. extreem oorzaakrisico) <b>gelijk blijven of afnemen</b> met de toenemende intensiteit
                van het scenario van het gevolgrisico (van links naar rechts: aanzienlijk --&gt; grootschalig --&gt;
                extreem gevolgrisico).
              </Trans>
            </Typography>
          </li>
        </ul>
      </Stack>

      <Box sx={{ margin: "auto", marginTop: 4, maxWidth: 600, width: "100%" }} id="cascade-summary-matrix">
        {cascadeAnalysis && (
          <CascadeMatrix
            cause={cause}
            effect={effect}
            cascadeAnalysis={cascadeAnalysis}
            onChangeScenario={(...opts) => {
              handleChangeScenario(...opts);

              window.scrollTo({
                behavior: "smooth",
                top: window.scrollY + (document.getElementById("cascade-title")?.getBoundingClientRect().top || 0),
              });
            }}
          />
        )}
      </Box>

      <Stack direction="column" sx={{ marginTop: 10 }}>
        <Typography variant="body2" paragraph>
          <Trans i18nKey="2B.causes.quali.1">
            Veuillez utiliser le champ ci-dessous pour développer votre raisonnement concernant l'estimation
            quantitative donnée dans la section précédente. Vous pouvez par exemple justifier ces valeurs en citant des
            faits historiques ou les résultats d'études. Si possible, ajoutez des références bibliographiques pour
            étayer vos arguments.
          </Trans>
        </Typography>
        <Typography variant="body2" paragraph>
          <Trans i18nKey="2B.causes.quali.2">
            Attention, ce champ doit être complété une seule fois pour chaque relation de cause à effet. Vous pouvez
            ajouter des précisions concernant les 9 estimations de la probabilité conditionnelle dans le même champ
            textuel.
          </Trans>
        </Typography>
      </Stack>

      <Box sx={{ marginTop: 2, marginBottom: 3 }}>
        {cascadeAnalysis && (
          <QualiTextInputBox
            id="quali-input"
            initialValue={cascadeAnalysis.cr4de_quali_cascade || ""}
            error={qualiError}
            onSave={async (v) => {
              if (!cascadeAnalysis) return;

              await api.updateCascadeAnalysis(cascadeAnalysis.cr4de_bnracascadeanalysisid, {
                cr4de_quali_cascade: !v || v === "" ? null : v,
              });

              reloadCascadeAnalysis();
            }}
            debounceInterval={500}
            attachments={attachments}
            onOpenSourceDialog={handleOpenSourceDialog}
            onReloadAttachments={loadAttachments}
          />
        )}
      </Box>

      {directAnalysis && cascadeAnalysis && (
        <AttachmentsDialog
          field={sourceDialogOpen ?? ""}
          riskFile={directAnalysis.cr4de_risk_file}
          cascadeAnalysis={cascadeAnalysis}
          open={sourceDialogOpen !== null}
          existingSource={existingSource}
          onClose={() => setSourceDialogOpen(null)}
          onSaved={() => loadAttachments()}
        />
      )}
    </Stack>
  );
};
