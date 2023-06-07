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
  open,
  setOpen,
}: {
  step2A: DVDirectAnalysis;
  causes: DVRiskCascade<DVRiskFile>[];
  climateChange: DVRiskCascade<DVRiskFile> | null;
  catalysingEffects: DVRiskCascade<DVRiskFile>[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  return (
    // <Slide appear={open}>
    <Drawer open={open} variant="permanent" anchor="right" id="quicknav-drawer" className={open ? "open" : "closed"}>
      <Toolbar />
      <Stack direction="row" sx={{ position: "fixed", top: 72, marginLeft: 1, alignItems: "center" }} spacing={2}>
        <IconButton onClick={() => setOpen(!open)} sx={{}} id="quicknav-drawer-button">
          {open ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
        </IconButton>
        <Typography variant="h6">
          <Trans i18nKey="2B.quicknav.title">Quick Navigation</Trans>
        </Typography>
      </Stack>
      {causes && (
        <Box sx={{ pl: 2.5, mt: 8, overflow: "hidden", transition: "opacity .3s ease", opacity: open ? 1 : 0 }}>
          <Typography variant="subtitle2">
            <Trans i18nKey="2B.sidebar.causes">Potential Causes</Trans>
          </Typography>
          <List dense sx={{}}>
            {causes.map((c, i) => (
              <ListItem key={c.cr4de_bnrariskcascadeid} disablePadding>
                <ListItemButton
                  sx={{ pointerEvents: open ? "auto" : "none" }}
                  onClick={() => {
                    navigate(`/step2B/${step2A.cr4de_bnradirectanalysisid}?step=${STEPS.CAUSES}&index=${i}`);
                    setOpen(false);
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
        <Box sx={{ pl: 2.5, mt: 4, overflow: "hidden", transition: "opacity .3s ease", opacity: open ? 1 : 0 }}>
          <Typography variant="subtitle2">
            <Trans i18nKey="2B.sidebar.catalysingEffects">Catalysing Effects</Trans>
          </Typography>
          <List dense sx={{}}>
            {climateChange && (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(`/step2B/${step2A.cr4de_bnradirectanalysisid}?step=${STEPS.CLIMATE_CHANGE}`);
                    setOpen(false);
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
                    navigate(
                      `/step2B/${step2A.cr4de_bnradirectanalysisid}?step=${STEPS.CATALYSING_EFFECTS}&index=${i}`
                    );
                    setOpen(false);
                  }}
                >
                  <ListItemText primary={c.cr4de_cause_hazard.cr4de_title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      <Typography
        variant="h6"
        sx={{
          position: "absolute",
          top: 48,
          left: 7,
          transform: "rotate(-90deg) translateX(-100%)",
          marginTop: "50px !important",
          marginLeft: "20px !important",
          transformOrigin: "left",
          opacity: open ? 0 : 1,
          transition: "opacity .3s ease",
          cursor: "pointer",
          zIndex: open ? -1 : 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <Trans i18nKey="2B.quicknav.title">Quick Navigation</Trans>
      </Typography>
    </Drawer>
    // </Slide>
  );
}
