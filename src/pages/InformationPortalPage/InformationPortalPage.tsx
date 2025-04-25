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
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Trans, useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import usePageTitle from "../../hooks/usePageTitle";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

export default function InformationPortalPage() {
  const { t } = useTranslation();

  usePageTitle(t("learning.title", "BNRA 2023 - 2026 Informatieportaal"));
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: t("learning.platform", "Informatieportaal"), url: "/learning" },
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
          backgroundImage:
            "url('https://bnra.powerappsportals.com/banner.png')",
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
        <Container
          sx={{
            display: "flex",
            alignItems: "flex-end",
            height: "100%",
            pb: 4,
          }}
        >
          <Stack direction="column">
            <img
              alt="bnra"
              src="https://bnra.powerappsportals.com/logo_text.png"
              style={{ width: 300, marginBottom: 20 }}
            />
            <Typography variant="subtitle1" paragraph>
              <Trans i18nKey="learning.title">
                Belgian National Risk Assessment 2023 - 2026
              </Trans>
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Box sx={{ bgcolor: "#fafafa", width: "100%", pt: 4, pb: 8 }}>
        <Container>
          <Box sx={{ py: 4, textAlign: "justify" }}>
            <Typography variant="subtitle2" paragraph>
              <Trans i18nKey="learning.welcome">
                Welkom op het BNRA informatieportaal
              </Trans>
            </Typography>
            <Typography variant="body1" paragraph>
              <Trans i18nKey="learning.welcome.text">
                Hier vindt je alle achtergrondinformatie en
                gebruikshandleidingen voor je deelname aan de
                <b>Belgische Nationale Risico Beoordeling 2023 - 2026 (BNRA)</b>
                . Deze website wordt aangeboden door het Nationaal Crisiscentrum
                (NCCN) van de FOD Binnenlandse Zaken. Vragen, suggesties of
                opmerkingen kunt u sturen naar het mailadres onder de
                contactgegevens.
              </Trans>
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 0,
                md: 2
              }} />
            <Grid
              size={{
                xs: 12,
                md: 4
              }}>
              <Item>
                <List
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader"
                      sx={{ borderBottom: "1px solid #eee" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ pt: 1, pb: 1 }}
                        color="primary"
                      >
                        <Trans i18nKey="learning.general.title">
                          General Information
                        </Trans>
                      </Typography>
                    </ListSubheader>
                  }
                >
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/general-introduction"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "learning.general.introduction",
                        "General Introduction"
                      )}
                    />
                  </ListItemButton>
                  {/* <ListItemButton component={RouterLink} to="/learning/risk-catalogue">
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("learning.general.riskCatalogue", "Risk Catalogue")} />
                  </ListItemButton> */}
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/quantitative-categories"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "learning.general.impact",
                        "Kwantitatieve Schalen"
                      )}
                    />
                  </ListItemButton>
                </List>
              </Item>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4
              }}>
              <Item>
                <List
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader"
                      sx={{ borderBottom: "1px solid #eee" }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ pt: 1, pb: 1 }}
                        color="primary"
                      >
                        <Trans i18nKey="learning.methodology.title">
                          Methodology
                        </Trans>
                      </Typography>
                    </ListSubheader>
                  }
                >
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-introduction"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "learning.methodology.introduction",
                        "Introduction"
                      )}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-risk-catalogue"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "learning.methodology.riskCatalogue",
                        "Risk Catalogue"
                      )}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-scenarios"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "learning.methodology.scenarios",
                        "Intensity Scenarios and Parameters"
                      )}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-risk-cascades"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "learning.methodology.riskCascades",
                        "Risk Cascades"
                      )}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-impact-probability"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "learning.methodology.impactProbability",
                        "Probability and Impact"
                      )}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-additional-elements"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "learning.methodology.additionalElements",
                        "Additional Elements"
                      )}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-use-cases"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("learning.methodology.useCases", "Use Cases")}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-actors"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "learning.methodology.actors",
                        "Malicious Actors (optional)"
                      )}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-emerging"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={t(
                        "learning.methodology.emerging",
                        "Emerging Risks (optional)"
                      )}
                    />
                  </ListItemButton>
                </List>
              </Item>
            </Grid>

            {/* <Grid xs={12} md={4}>
              <Item>
                <List
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="nested-list-subheader" sx={{ borderBottom: "1px solid #eee" }}>
                      <Typography variant="h6" sx={{ pt: 1, pb: 1 }} color="primary">
                        <Trans i18nKey="learning.tools.title">Tool Manuals</Trans>
                      </Typography>
                    </ListSubheader>
                  }
                >
                  <ListItemButton component={RouterLink} to="/learning/tools-validation">
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("learning.tools.validation", "Risk File Validation")} />
                  </ListItemButton>
                  <ListItemButton component={RouterLink} to="/learning/tools-analysisA">
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("learning.tools.analysisA", "Risk Analysis A")} />
                  </ListItemButton>
                  <ListItemButton component={RouterLink} to="/learning/tools-analysisA-standard" sx={{ ml: 3.5 }}>
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("learning.tools.analysisAStandard", "Standard Risks")} />
                  </ListItemButton>
                  <ListItemButton component={RouterLink} to="/learning/tools-analysisA-manmade" sx={{ ml: 3.5 }}>
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("learning.tools.analysisAManMade", "Malicious Actors")} />
                  </ListItemButton>
                  <ListItemButton component={RouterLink} to="/learning/tools-analysisB-standard" sx={{ ml: 3.5 }}>
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("learning.tools.analysisBStandard", "2B - Standard Risks")} />
                  </ListItemButton>
                  <ListItemButton component={RouterLink} to="/learning/tools-analysisB-manmade" sx={{ ml: 3.5 }}>
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("learning.tools.analysisBManMade", "2B - Malicious Actors")} />
                  </ListItemButton>
                  <ListItemButton component={RouterLink} to="/learning/tools-analysisB-emerging" sx={{ ml: 3.5 }}>
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("learning.tools.analysisBEmerging", "2B - Emerging Risks")} />
                  </ListItemButton>
                </List>
              </Item>
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
}
