import { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Tooltip,
  Paper,
  Fade,
  Container,
  Drawer,
  Slider,
  Alert,
  Typography,
  tooltipClasses,
  Stack,
  Button,
  Slide,
  IconButton,
  Link,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { useTheme } from "@mui/material/styles";
import { SCENARIOS, SCENARIO_PARAMS, Scenarios, unwrap as unwrapScenarios } from "../../../functions/scenarios";
import { IntensityParameter, unwrap as unwrapParameters } from "../../../functions/intensityParameters";
import { Trans, useTranslation } from "react-i18next";
import { SliderThumb } from "@mui/material/Slider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CP, CPValueStack } from "../../learning/QuantitativeScales/CP";
import DoneIcon from "@mui/icons-material/Done";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AnimateHeight from "react-animate-height";
import AutoHeight from "../../../components/AutoHeight";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import useRecords from "../../../hooks/useRecords";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { DVContact } from "../../../types/dataverse/DVContact";
import TextInputBox from "../../../components/TextInputBox";
import { CascadeAnalysisInput, getCascadeField } from "../../../functions/cascades";
import CascadeMatrix from "../information/CascadeMatrix";
import QualiTextInputBox from "../../step2A/sections/QualiTextInputBox";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import InformationButton from "../information/InformationButton";
import { CrossFade2 } from "../../../components/CrossFade";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import useLazyRecords from "../../../hooks/useLazyRecords";
import AttachmentsDialog from "../information/AttachmentsDialog";

const TRANSITION_MS = 1000;
const TRANSITION_S = "1s";

export default function CatalysingEffectsAnalysis({
  directAnalysis,
  cascadeAnalysis,
  cascade,

  index,
  count,

  qualiError,

  reloadCascadeAnalysis,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  cascadeAnalysis: DVCascadeAnalysis | null;
  cascade: DVRiskCascade<unknown, DVRiskFile>;

  index: number;
  count: number;

  qualiError: boolean;

  reloadCascadeAnalysis: () => Promise<unknown>;
}) {
  const [visibleCascade, setVisibleCascade] = useState(1);
  const [cascade1, setCascade1] = useState<DVRiskCascade<unknown, DVRiskFile> | null>(cascade);
  const [cascade2, setCascade2] = useState<DVRiskCascade<unknown, DVRiskFile> | null>(null);

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

  return (
    <Box>
      <Container>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">
            <Trans i18nKey="2B.EM.catalysingEffects.title">Catalysing Effects</Trans>
          </Typography>
        </Box>
      </Container>
      <Box sx={{ mx: "123px", pb: 12 }}>
        <Container>
          <Stack direction="column">
            <Typography variant="body2" paragraph sx={{ mt: 2 }}>
              <Trans i18nKey="2B.EM.catalysing.intro.1">
                Cette page vous permet d'évaluer l'effet catalyseur des risques émergents sur le risque standard étudié.
                Cette évaluation vous est demandée pour tous les risques émergents identifiés précédemment lors de
                l'étape 1 comme ayant un effet catalyseur sur le risque standard étudié.
              </Trans>
            </Typography>
            <Alert severity="info" sx={{ mt: 2, mb: 6 }}>
              <Typography variant="body2">
                <Trans i18nKey="2B.EM.catalysing.info.1">
                  Attention, il est nécessaire de remplir tous les champs textuels pour clôturer cette étape 2B. Bien
                  qu'il soit important pour nous de disposer d'une explication quant aux effets des risques émergents
                  sur le risque standard étudié, si vous ne souhaitez pas nous fournir de justification textuelle, nous
                  vous invitons à cliquer sur le bouton PAS DE COMMENTAIRE.
                </Trans>
              </Typography>
            </Alert>

            <CrossFade2
              components={[
                {
                  in: visibleCascade === 1,
                  component: cascade1 && (
                    <AnalysisSection
                      directAnalysis={directAnalysis}
                      cascadeAnalysis={
                        cascadeAnalysis?._cr4de_cascade_value === cascade1.cr4de_bnrariskcascadeid
                          ? cascadeAnalysis
                          : null
                      }
                      cascade={cascade1}
                      index={index}
                      count={count}
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
                        cascadeAnalysis?._cr4de_cascade_value === cascade2.cr4de_bnrariskcascadeid
                          ? cascadeAnalysis
                          : null
                      }
                      cascade={cascade2}
                      index={index}
                      count={count}
                      qualiError={qualiError}
                      reloadCascadeAnalysis={reloadCascadeAnalysis}
                    />
                  ),
                },
              ]}
            />
          </Stack>
        </Container>
      </Box>

      <InformationButton showTutorial={false} riskFile={directAnalysis.cr4de_risk_file} />
    </Box>
  );
}

function AnalysisSection({
  directAnalysis,
  cascadeAnalysis,
  cascade,

  index,
  count,

  qualiError,

  reloadCascadeAnalysis,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  cascadeAnalysis: DVCascadeAnalysis | null;
  cascade: DVRiskCascade<unknown, DVRiskFile>;

  index: number;
  count: number;

  qualiError: boolean;

  reloadCascadeAnalysis: () => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const api = useAPI();

  const [sourceDialogOpen, setSourceDialogOpen] = useState<string | null>(null);
  const [existingSource, setExistingSource] = useState<DVAttachment | undefined>(undefined);

  const { data: attachments, getData: loadAttachments } = useLazyRecords<DVAttachment<unknown, DVAttachment>>({
    table: DataTable.ATTACHMENT,
  });

  const cause = directAnalysis.cr4de_risk_file;
  const effect = cascade.cr4de_effect_hazard;

  useEffect(() => {
    if (cascadeAnalysis && attachments === null) {
      loadAttachments({
        query: `$filter=_cr4de_cascadeanalysis_value eq '${cascadeAnalysis.cr4de_bnracascadeanalysisid}'&$expand=cr4de_referencedSource`,
        saveOptions: true,
      });
    }
  }, [cascadeAnalysis]);

  useEffect(() => {
    if (qualiError) {
      window.scrollTo({
        behavior: "smooth",
        top: window.scrollY + (document.getElementById("quali-input")?.getBoundingClientRect().top || 0),
      });
    }
  }, [qualiError]);

  const handleOpenSourceDialog = (existingSource?: DVAttachment) => {
    setSourceDialogOpen("cr4de_quali_cascade");
    setExistingSource(existingSource);
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 4 }}>
        <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
          <Link to={`/learning/risk/${cause.cr4de_riskfilesid}`} component={RouterLink} target="_blank">
            {cause.cr4de_title}
          </Link>
        </Tooltip>{" "}
        <Trans i18nKey="2B.EM.catalysing.description">has a catalysing effect on</Trans>{" "}
        <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
          <Link to={`/learning/risk/${effect.cr4de_riskfilesid}`} component={RouterLink} target="_blank">
            {effect.cr4de_title}
          </Link>
        </Tooltip>{" "}
        ({index + 1}/{count})
      </Typography>

      <Stack direction="column" sx={{ marginTop: 2 }}>
        <Typography variant="body2" paragraph>
          <Trans i18nKey="2B.EM.catalysing.quali.1">
            Veuillez décrire dans le champ textuel ci-dessous comment le risque standard étudié peut être affecté par
            chaque risque émergent en tenant compte de l'analyse d'horizon validée par les experts évaluant ces risques
            émergents.{" "}
          </Trans>
        </Typography>
        <Typography variant="body2">
          <Trans i18nKey="2B.EM.catalysing.quali.2">Par exemple, décrivez :</Trans>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              <Trans i18nKey="2B.EM.catalysing.quali.3.1">
                comment et dans quelle mesure l'évolution des risques émergents peut influencer la probabilité
                d'occurrence directe de ce risque évalué.{" "}
              </Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <Trans i18nKey="2B.EM.catalysing.quali.3.2">
                comment et dans quelle mesure l'évolution des risques émergents peut influencer les impacts de ce risque
                évalué.{" "}
              </Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <Trans i18nKey="2B.EM.catalysing.quali.3.21">
                hoe en in welke mate de ontwikkeling van het bestudeerde opkomende risico, de evolutie van potentieel
                gekatalyseerde standaard risico’s kan beïnvloeden.
              </Trans>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <Trans i18nKey="2B.EM.catalysing.quali.3.3">...</Trans>
            </Typography>
          </li>
        </ul>
        <Typography variant="body2" paragraph>
          <Trans i18nKey="2B.EM.catalysing.quali.5">
            Vous pouvez par exemple justifier les effets catalyeurs des risques émergents en citant les résultats
            d'études. Si possible, ajoutez des références bibliographiques pour étayer vos arguments.
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
    </>
  );
}
