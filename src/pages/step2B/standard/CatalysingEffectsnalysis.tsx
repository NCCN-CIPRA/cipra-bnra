import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Tooltip, Container, Alert, Typography, Stack, Link } from "@mui/material";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { Trans, useTranslation } from "react-i18next";
import { DVCascadeAnalysis } from "../../../types/dataverse/DVCascadeAnalysis";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import QualiTextInputBox from "../../step2A/sections/QualiTextInputBox";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import InformationButton from "../information/InformationButton";
import AttachmentsDialog from "../information/AttachmentsDialog";
import useLazyRecords from "../../../hooks/useLazyRecords";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";

const TRANSITION_MS = 1000;
const TRANSITION_S = "1s";

export default function CatalysingEffectsAnalysis({
  directAnalysis,
  cascadeAnalysis,
  cause,
  effect,

  index,
  count,

  qualiError,

  reloadCascadeAnalysis,
}: {
  directAnalysis: DVDirectAnalysis<DVRiskFile>;
  cascadeAnalysis: DVCascadeAnalysis | null;
  cause: DVRiskFile;
  effect: DVRiskFile;

  index: number;
  count: number;

  qualiError: boolean;

  reloadCascadeAnalysis: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const api = useAPI();

  const [sourceDialogOpen, setSourceDialogOpen] = useState<string | null>(null);
  const [existingSource, setExistingSource] = useState<DVAttachment | undefined>(undefined);

  const { data: attachments, getData: loadAttachments } = useLazyRecords<DVAttachment<unknown, DVAttachment>>({
    table: DataTable.ATTACHMENT,
  });

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
    <Box>
      <Container>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4">
            <Trans i18nKey="2B.catalysingEffects.title">Catalysing Effects</Trans>
          </Typography>
        </Box>
      </Container>
      <Box sx={{ mx: "123px", pb: 12 }}>
        <Container>
          <Stack direction="column">
            <Typography variant="body2" paragraph sx={{ mt: 2 }}>
              <Trans i18nKey="2B.catalysing.intro.1">
                Cette page vous permet d'évaluer l'effet catalyseur des risques émergents sur le risque standard étudié.
                Cette évaluation vous est demandée pour tous les risques émergents identifiés précédemment lors de
                l'étape 1 comme ayant un effet catalyseur sur le risque standard étudié.
              </Trans>
            </Typography>
            <Alert severity="info" sx={{ mt: 2, mb: 6 }}>
              <Typography variant="body2">
                <Trans i18nKey="2B.catalysing.info.1">
                  Attention, il est nécessaire de remplir tous les champs textuels pour clôturer cette étape 2B. Bien
                  qu'il soit important pour nous de disposer d'une explication quant aux effets des risques émergents
                  sur le risque standard étudié, si vous ne souhaitez pas nous fournir de justification textuelle, nous
                  vous invitons à cliquer sur le bouton PAS DE COMMENTAIRE.
                </Trans>
              </Typography>
            </Alert>
            <Typography variant="h6" sx={{ mb: 4 }}>
              <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
                <Link to={`/learning/risk/${cause.cr4de_riskfilesid}`} component={RouterLink} target="_blank">
                  {cause.cr4de_title}
                </Link>
              </Tooltip>{" "}
              <Trans i18nKey="2B.catalysing.description">has a catalysing effect on</Trans>{" "}
              <Tooltip title={t("2B.cause.openRiskFile", "Click to open the risk file for this risk in a new tab")}>
                <Link to={`/learning/risk/${effect.cr4de_riskfilesid}`} component={RouterLink} target="_blank">
                  {effect.cr4de_title}
                </Link>
              </Tooltip>{" "}
              ({index + 1}/{count})
            </Typography>

            <Stack direction="column" sx={{ marginTop: 2 }}>
              <Typography variant="body2" paragraph>
                <Trans i18nKey="2B.catalysing.quali.1">
                  Veuillez décrire dans le champ textuel ci-dessous comment le risque standard étudié peut être affecté
                  par chaque risque émergent en tenant compte de l'analyse d'horizon validée par les experts évaluant
                  ces risques émergents.{" "}
                </Trans>
              </Typography>
              <Typography variant="body2">
                <Trans i18nKey="2B.catalysing.quali.2">Par exemple, décrivez :</Trans>
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    <Trans i18nKey="2B.catalysing.quali.3.1">
                      comment et dans quelle mesure l'évolution des risques émergents peut influencer la probabilité
                      d'occurrence directe de ce risque évalué.{" "}
                    </Trans>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <Trans i18nKey="2B.catalysing.quali.3.2">
                      comment et dans quelle mesure l'évolution des risques émergents peut influencer les impacts de ce
                      risque évalué.{" "}
                    </Trans>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <Trans i18nKey="2B.catalysing.quali.3.3">...</Trans>
                  </Typography>
                </li>
              </ul>
              <Typography variant="body2" paragraph>
                <Trans i18nKey="2B.catalysing.quali.4">
                  Afin d'évaluer au mieux les effets catalyseurs des risques émergents sur le risque standard évalué,
                  vous pouvez consulter via le bouton ci-dessous les estimations que vous avez réalisées lors de l'étape
                  2A.
                </Trans>
              </Typography>
              <Typography variant="body2" paragraph>
                <Trans i18nKey="2B.catalysing.quali.5">
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
          </Stack>
        </Container>
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

      <InformationButton showTutorial={false} riskFile={directAnalysis.cr4de_risk_file} />
    </Box>
  );
}
