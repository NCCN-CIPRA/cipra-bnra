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
              This portal explains how the Belgian National Risk Analysis works,
              from the concepts behind it to the technical methodology. Start
              anywhere, go as deep as you like.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Item>
                <List
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader"
                      sx={{ borderBottom: "1px solid #eee" }}
                    >
                      <Typography variant="h6" sx={{ pt: 1 }} color="primary">
                        BNRA Basics
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ pb: 1 }}
                        color="secondary"
                      >
                        Start here, no prior knowledge needed
                      </Typography>
                    </ListSubheader>
                  }
                >
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/what-is-the-bnra"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"What is the BNRA?"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/what-is-a-risk"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"What is a risk?"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/how-do-we-measure-impact"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"How do we measure impact?"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/how-do-we-measure-probability"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"How do we measure probability?"} />
                  </ListItemButton>
                </List>
              </Item>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Item>
                <List
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader"
                      sx={{ borderBottom: "1px solid #eee" }}
                    >
                      <Typography variant="h6" sx={{ pt: 1 }} color="primary">
                        Risk Structure
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ pb: 1 }}
                        color="secondary"
                      >
                        How risks are defined and organised
                      </Typography>
                    </ListSubheader>
                  }
                >
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/risk-catalogue"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"The risk catalogue"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/intensity-scenarios"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Intensity scenarios"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/risk-cascades"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Risk cascades"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/malicious-actors"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Malicious actors"} />
                  </ListItemButton>
                </List>
              </Item>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Item>
                <List
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader"
                      sx={{ borderBottom: "1px solid #eee" }}
                    >
                      <Typography variant="h6" sx={{ pt: 1 }} color="primary">
                        Methodology in depth
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ pb: 1 }}
                        color="secondary"
                      >
                        For experts and technical readers
                      </Typography>
                    </ListSubheader>
                  }
                >
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/impact-and-probability-scales"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Impact & probability scales"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/cascade-probabilities"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Cascade probabilities"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/monte-carlo-simulation"
                    sx={{ pointerEvents: "none", opacity: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Monte Carlo simulation"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/aggregation-and-reporting"
                    sx={{ pointerEvents: "none", opacity: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Aggregation and reporting"} />
                  </ListItemButton>
                </List>
              </Item>
            </Grid>
          </Grid>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
              sx={{ pointerEvents: "none", opacity: 0.5 }}
            >
              <Item>
                <List
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader"
                      sx={{ borderBottom: "1px solid #eee" }}
                    >
                      <Typography variant="h6" sx={{ pt: 1 }} color="primary">
                        For participating experts
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ pb: 1 }}
                        color="secondary"
                      >
                        Your role, your contribution, and how the process works
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
                    <ListItemText primary={"How does participation work?"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/quantitative-categories"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"What is expected of you?"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/quantitative-categories"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"How is your input used?"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/quantitative-categories"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Consensus and validation process"}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/quantitative-categories"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Using the BNRA application"} />
                  </ListItemButton>
                </List>
              </Item>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Item>
                <List
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader"
                      sx={{ borderBottom: "1px solid #eee" }}
                    >
                      <Typography variant="h6" sx={{ pt: 1 }} color="primary">
                        Resources for risk practitioners
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ pb: 1 }}
                        color="secondary"
                      >
                        Tools and references for use in your own analyses
                      </Typography>
                    </ListSubheader>
                  }
                >
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-introduction"
                    sx={{ pointerEvents: "none", opacity: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Best practices for governemental risk analysis"}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-introduction"
                    sx={{ pointerEvents: "none", opacity: "0.5" }}
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        "Best practices for (critical) entity risk analysis"
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-risk-catalogue"
                    sx={{ pointerEvents: "none", opacity: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Probability and cascade scales"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-scenarios"
                    sx={{ pointerEvents: "none", opacity: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Impact scales"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/methodology-scenarios"
                    sx={{ pointerEvents: "none", opacity: "0.5" }}
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Quantitative tools"} />
                  </ListItemButton>
                </List>
              </Item>
            </Grid>
          </Grid>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid
              size={{
                xs: 12,
              }}
              sx={{ pointerEvents: "none", opacity: 0.5 }}
            >
              <Item>
                <List
                  aria-labelledby="nested-list-subheader"
                  subheader={
                    <ListSubheader
                      component="div"
                      id="nested-list-subheader"
                      sx={{ borderBottom: "1px solid #eee" }}
                    >
                      <Typography variant="h6" sx={{ pt: 1 }} color="primary">
                        Publications
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ pb: 1 }}
                        color="secondary"
                      >
                        All public documents produced within the context of the
                        BNRA in one place
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
                      primary={
                        "Standardized indicators of probability and impact, version 2026"
                      }
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/general-introduction"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Risk Guide 2023 - 2026"} />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/general-introduction"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={"BNRA Methodology whitepaper, version 2023"}
                    />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/learning/quantitative-categories"
                  >
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <ChevronRightIcon />
                    </ListItemIcon>
                    <ListItemText primary={"BNRA 2018 - 2023"} />
                  </ListItemButton>
                </List>
              </Item>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
