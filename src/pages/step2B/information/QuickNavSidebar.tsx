import {
  Box,
  CircularProgress,
  Typography,
  Drawer as MuiDrawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Theme,
  CSSObject,
  styled,
  Stack,
} from "@mui/material";
import { Trans } from "react-i18next";
import openInNewTab from "../../../functions/openInNewTab";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";
import { useNavigate } from "react-router-dom";
import { STEPS } from "../Steps";

const drawerWidth = 400;

export enum OPEN_STATE {
  CLOSED,
  QUICKNAV,
  CAUSES,
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  height: "calc(100% - 50px)",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(6)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
  height: "calc(100% - 50px)",
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  position: "relative",
  zIndex: 1000,
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function QuickNavSidebar({
  step2A,
  causes,
  climateChange,
  catalysingEffects,
  hasCauses,
  open,
  setOpen,
  onTransitionTo,
}: {
  step2A: DVDirectAnalysis;
  causes: DVRiskCascade<DVRiskFile>[];
  climateChange: DVRiskCascade<DVRiskFile> | null;
  catalysingEffects: DVRiskCascade<DVRiskFile>[];
  hasCauses: boolean;
  open: OPEN_STATE;
  setOpen: (open: OPEN_STATE) => void;
  onTransitionTo: (newStep: STEPS, newIndex: number) => void;
}) {
  return (
    // <Slide appear={open}>
    <Drawer
      open={open !== OPEN_STATE.CLOSED}
      variant="permanent"
      anchor="right"
      id="quicknav-drawer"
      className={open ? "open" : "closed"}
    >
      <Toolbar />
      <Stack direction="row" sx={{ position: "fixed", top: 72, marginLeft: 1, alignItems: "center" }} spacing={2}>
        <IconButton
          onClick={() => setOpen(open === OPEN_STATE.CLOSED ? OPEN_STATE.QUICKNAV : OPEN_STATE.CLOSED)}
          sx={{}}
          id="quicknav-drawer-button"
        >
          {open !== OPEN_STATE.CLOSED ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
        </IconButton>
        {open === OPEN_STATE.QUICKNAV && (
          <Typography variant="h6">
            <Trans i18nKey="2B.quicknav.title">Quick Navigation</Trans>
          </Typography>
        )}
        {open === OPEN_STATE.CAUSES && (
          <Typography variant="h6">
            <Trans i18nKey="2B.sidebar.causes">Quick Navigation</Trans>
          </Typography>
        )}
      </Stack>
      {open === OPEN_STATE.QUICKNAV && (
        <>
          {causes && (
            <Box
              sx={{
                pl: 2.5,
                mt: 8,
                overflow: "hidden",
                transition: "opacity .3s ease",
                opacity: open ? 1 : 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="subtitle2">
                <Trans i18nKey="2B.sidebar.causes">Potential Causes</Trans>
              </Typography>
              <List dense sx={{ overflowY: "scroll" }}>
                {causes.map((c, i) => (
                  <ListItem key={c.cr4de_bnrariskcascadeid} disablePadding>
                    <ListItemButton
                      sx={{ pointerEvents: open ? "auto" : "none" }}
                      onClick={() => {
                        onTransitionTo(STEPS.CAUSES, i);
                        setOpen(OPEN_STATE.CLOSED);
                      }}
                    >
                      <ListItemText primary={c.cr4de_cause_hazard.cr4de_title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {(climateChange || catalysingEffects) && (
            <Box
              sx={{
                pl: 2.5,
                mt: 4,
                overflow: "hidden",
                transition: "opacity .3s ease",
                opacity: open ? 1 : 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="subtitle2">
                <Trans i18nKey="2B.sidebar.catalysingEffects">Catalysing Effects</Trans>
              </Typography>
              <List dense sx={{ overflowY: "scroll" }}>
                {climateChange && (
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        onTransitionTo(STEPS.CLIMATE_CHANGE, 0);
                        setOpen(OPEN_STATE.CLOSED);
                      }}
                    >
                      <ListItemText primary={climateChange.cr4de_cause_hazard.cr4de_title} />
                    </ListItemButton>
                  </ListItem>
                )}
                {catalysingEffects.map((c, i) => (
                  <ListItem key={c.cr4de_bnrariskcascadeid} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        onTransitionTo(STEPS.CATALYSING_EFFECTS, i);
                        setOpen(OPEN_STATE.CLOSED);
                      }}
                    >
                      <ListItemText primary={c.cr4de_cause_hazard.cr4de_title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </>
      )}
      {open === OPEN_STATE.CAUSES && (
        <Box sx={{ pl: 2.5, mt: 6, overflow: "hidden", transition: "opacity .3s ease", opacity: open ? 1 : 0 }}>
          {causes && (
            <List>
              {causes.map((c) => (
                <ListItem key={c.cr4de_bnrariskcascadeid} disablePadding>
                  <ListItemButton
                    onClick={() => openInNewTab(`/learning/risk/${c.cr4de_cause_hazard.cr4de_riskfilesid}`)}
                  >
                    <ListItemText primary={c.cr4de_cause_hazard.cr4de_title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}
      <Stack
        direction="row"
        spacing={6}
        sx={{
          position: "absolute",
          top: 48,
          left: 7,
          transform: "rotate(-90deg) translateX(-100%)",
          marginTop: "50px !important",
          marginLeft: "20px !important",
          transformOrigin: "left",
          opacity: open !== OPEN_STATE.CLOSED ? 0 : 1,
          transition: "opacity .3s ease",
          cursor: "pointer",
          zIndex: open !== OPEN_STATE.CLOSED ? -1 : 1000,
        }}
      >
        {hasCauses && (
          <Typography variant="h6" onClick={() => setOpen(OPEN_STATE.CAUSES)}>
            <Trans i18nKey="2B.quicknav.causes">Potential Causes</Trans>
          </Typography>
        )}
        <Typography variant="h6" onClick={() => setOpen(OPEN_STATE.QUICKNAV)}>
          <Trans i18nKey="2B.quicknav.title">Quick Navigation</Trans>
        </Typography>
      </Stack>
    </Drawer>
    // </Slide>
  );
}
