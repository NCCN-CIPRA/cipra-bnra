import {
  Box,
  Container,
  ListItemIcon,
  Stack,
  Typography,
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Trans, useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

export default function LearningOverviewPage({}) {
  const { t } = useTranslation();

  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Information Portal", url: "" },
  ]);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(128, 180, 180, 0.33)",
          backgroundImage: "url('https://bnra.powerappsportals.com/banner.png')",
          backgroundSize: "auto 800px",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: -10,
          opacity: 0.6,
        }}
      />
      <Box
        sx={{
          mt: -2,
          width: "100%",
          height: 300,
          backgroundColor: "transparent",
        }}
      >
        <Container sx={{ display: "flex", alignItems: "flex-end", height: "100%", pb: 4 }}>
          <Stack direction="column">
            <img
              alt="bnra"
              src="https://bnra.powerappsportals.com/logo_text.png"
              style={{ width: 300, marginBottom: 20 }}
            />
            <Typography variant="subtitle1" paragraph>
              <Trans i18nKey="learning.title">Belgian National Risk Assessment 2023 - 2026</Trans>
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Box sx={{ bgcolor: "#fafafa", width: "100%", pt: 4, pb: 8 }}>
        <Container>
          <Box sx={{ py: 4, textAlign: "justify" }}>
            <Typography variant="subtitle2" paragraph>
              <Trans i18nKey="learning.welcome">Welkom op het BNRA informatieportaal</Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.welcome.text">
                Hier vindt je alle achtergrondinformatie en gebruikshandleidingen voor je deelname aan de Belgische
                Nationale Risico Beoordeling 2023 - 2026 (BNRA). Deze website wordt aangeboden door het Nationaal
                Crisiscentrum (NCCN) van de FOD Binnenlandse Zaken. Vragen, suggesties of opmerkingen kunt u sturen naar
                het mailadres onder de contactgegevens.
              </Trans>
            </Typography>
          </Box>

          <Stack direction="row" justifyContent="space-evenly">
            <List
              sx={{ width: 400, bgcolor: "background.paper" }}
              component={Paper}
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader" sx={{ borderBottom: "1px solid #eee" }}>
                  <Typography variant="h6" sx={{ pt: 2, pb: 2 }} color="primary">
                    <Trans i18nKey="learning.methodology.title">Methodology</Trans>
                  </Typography>
                </ListSubheader>
              }
            >
              <ListItemButton component={RouterLink} to="/learning/methodology/introduction">
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={t("learning.methodology.general", "General Introduction")} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 5 }} component={RouterLink} to="/learning/methodology/standard">
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={t("learning.methodology.standardRisks", "Standard Risks")} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 5 }} component={RouterLink} to="/learning/methodology/actors">
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={t("learning.methodology.actors", "Malicious Actors")} />
              </ListItemButton>
              <ListItemButton sx={{ pl: 5 }} component={RouterLink} to="/learning/methodology/emerging">
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={t("learning.methodology.emerging", "Emerging Risks")} />
              </ListItemButton>
              <ListItemButton component={RouterLink} to="/learning/methodology/impact">
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={t("learning.methodology.impact", "Impact Categories and Damage Indicators")} />
              </ListItemButton>
              <ListItemButton component={RouterLink} to="/learning/methodology/evaluation">
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={t("learning.methodology.evaluation", "Quantitative Evaluation")} />
              </ListItemButton>
            </List>

            <List
              sx={{ width: 400, bgcolor: "background.paper" }}
              component={Paper}
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader" sx={{ borderBottom: "1px solid #eee" }}>
                  <Typography variant="h6" sx={{ pt: 2, pb: 2 }} color="primary">
                    <Trans i18nKey="learning.tools.title">Tool Manuals</Trans>
                  </Typography>
                </ListSubheader>
              }
            >
              <ListItemButton component={RouterLink} to="/learning/tools/validation">
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={t("learning.tools.validation", "Risk File Validation")} />
              </ListItemButton>
              <ListItemButton component={RouterLink} to="/learning/tools/analysisA">
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={t("learning.tools.analysisA", "Risk Analysis A")} />
              </ListItemButton>
              <ListItemButton component={RouterLink} to="/learning/tools/analysisB">
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={t("learning.tools.analysisB", "Risk Analysis B")} />
              </ListItemButton>
              <ListItemButton component={RouterLink} to="/learning/tools/consensus">
                <ListItemIcon sx={{ minWidth: "32px" }}>
                  <ChevronRightIcon />
                </ListItemIcon>
                <ListItemText primary={t("learning.tools.consensus", "Consensus")} />
              </ListItemButton>
            </List>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
