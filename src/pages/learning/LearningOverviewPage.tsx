import {
  Box,
  Container,
  Button,
  Link,
  Stack,
  Typography,
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { Trans } from "react-i18next";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";

export default function LearningOverviewPage({}) {
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Learning Platform", url: "" },
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
            <img src="https://bnra.powerappsportals.com/logo_text.png" style={{ width: 300, marginBottom: 20 }} />
            <Typography variant="subtitle1" paragraph>
              <Trans i18nKey="learning.title">Information Portal</Trans>
            </Typography>
          </Stack>
        </Container>
      </Box>
      <Box sx={{ bgcolor: "#fafafa", width: "100%", pt: 4, pb: 8 }}>
        <Container>
          <Box sx={{ py: 4, textAlign: "justify" }}>
            <Typography variant="subtitle2" paragraph>
              Welkom op het BNRA informatieportaal
            </Typography>
            <Typography variant="body1" paragraph>
              Hier vindt je alle achtergrondinformatie en gebruikshandleidingen voor je deelname aan de Belgische
              Nationale Risico Beoordeling 2023 - 2026 (BNRA). Deze website wordt aangeboden door het Nationaal
              Crisiscentrum (NCCN) van de FOD Binnenlandse Zaken. Vragen, suggesties of opmerkingen kunt u sturen naar
              het mailadres onder de contactgegevens.
            </Typography>
          </Box>

          <Stack direction="row" justifyContent="space-evenly">
            <List
              sx={{ width: 400, bgcolor: "background.paper" }}
              component={Paper}
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Methodology
                </ListSubheader>
              }
            >
              <ListItemButton>
                <ListItemText primary="Sent mail" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Drafts" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Inbox" />
              </ListItemButton>
            </List>

            <List
              sx={{ width: 400, bgcolor: "background.paper" }}
              component={Paper}
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Tool Manuals
                </ListSubheader>
              }
            >
              <ListItemButton>
                <ListItemText primary="Sent mail" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Drafts" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText primary="Inbox" />
              </ListItemButton>
            </List>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
