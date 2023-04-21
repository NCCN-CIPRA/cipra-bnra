import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Tooltip, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { useTranslation } from "react-i18next";

export default function LearningSideBar({
  open,
  width,
  pageName,
  handleDrawerToggle,
}: {
  open: boolean;
  width: number;
  pageName: string;
  handleDrawerToggle: () => void;
}) {
  const { t } = useTranslation();

  const generalPages = [
    {
      title: t("learning.general.introduction", "General Introduction"),
      id: "general-introduction",
      inset: 1,
      letter: "G",
    },
    { title: t("learning.general.riskCatalogue", "Risk Catalogue"), id: "risk-catalogue", inset: 1, letter: "C" },
    {
      title: t("learning.general.impact", "Kwantitatieve Schalen"),
      id: "quantitative-categories",
      inset: 1,
      letter: "Q",
    },
  ];
  const methoPages = [
    { title: t("learning.methodology.introduction", "Introduction"), id: "methodology-introduction", inset: 1 },
    { title: t("learning.methodology.riskCatalogue", "Risk Catalogue"), id: "methodology-risk-catalogue", inset: 1 },
    {
      title: t("learning.methodology.scenarios", "Intensity Scenarios and Parameters"),
      id: "methodology-scenarios",
      inset: 1,
      letter: "M",
    },
    {
      title: t("learning.methodology.riskCascades", "Risk Cascades"),
      id: "methodology-risk-cascades",
      inset: 1,
      letter: "C",
    },
    {
      title: t("learning.methodology.impactProbability", "Probability and Impact"),
      id: "methodology-impact-probability",
    },
    {
      title: t("learning.methodology.additionalElements", "Additional Elements"),
      id: "methodology-additional-elements",
    },
    { title: t("learning.methodology.useCases", "Use Cases"), id: "methodology-use-cases" },
    { title: t("learning.methodology.actors", "Malicious Actors"), id: "methodology-actors" },
    { title: t("learning.methodology.emerging", "Emerging Risks"), id: "methodology-emerging" },
  ];
  const toolPages = [
    { title: t("learning.tools.validation", "Risk File Validation"), id: "tools-validation" },
    { title: t("learning.tools.analysisA", "Risk Analysis A"), id: "tools-analysisA", letter: "A" },
    {
      title: t("learning.tools.analysisAStandard", "Standard Risks"),
      id: "tools-analysisA-standard",
      letter: "AS",
      inset: true,
    },
    {
      title: t("learning.tools.analysisAManMade", "Malicious Actors"),
      id: "tools-analysisA-manmade",
      letter: "AM",
      inset: true,
    },
    { title: t("learning.tools.analysisB", "Risk Analysis B"), id: "tools-analysisB", letter: "B", disabled: true },
    { title: t("learning.tools.consensus", "Consensus"), id: "tools-consensus", disabled: true },
  ];

  const openedMixin = (theme: Theme): CSSObject => ({
    width,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  });

  const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
    width,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  }));

  return (
    <Drawer variant="permanent" open={open} anchor="right">
      <ListItem disablePadding sx={{ display: "block", marginTop: "64px" }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: open ? 1 : 2.5,
          }}
          onClick={handleDrawerToggle}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            {open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
      <Divider />
      <List dense>
        {open && (
          <ListItem>
            <ListItemText
              primary={t("learning.general.title", "General Information")}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItem>
        )}
        {generalPages.map(({ title, id, letter, inset }, index) => (
          <ListItem key={id} disablePadding sx={{ display: "block", whiteSpace: "normal" }}>
            {open ? (
              <ListItemButton component={Link} to={`/learning/${id}`}>
                <ListItemText
                  secondary={title}
                  sx={{ opacity: open ? 1 : 0, ml: inset ? 4 : 2 }}
                  secondaryTypographyProps={pageName === id ? { fontWeight: "bold", color: "primary" } : {}}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={title}>
                <ListItemButton
                  sx={{
                    // minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  component={Link}
                  to={`/learning/${id}`}
                >
                  <Avatar
                    sx={{
                      bgcolor: pageName === id ? "rgb(0, 164, 154)" : undefined,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {letter || title[0]}
                  </Avatar>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
      <Divider />
      <List dense>
        {open && (
          <ListItem>
            <ListItemText
              primary={t("learning.methodology.title", "Methodology")}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItem>
        )}
        {methoPages.map(({ title, id, letter, inset }, index) => (
          <ListItem key={id} disablePadding sx={{ display: "block", whiteSpace: "normal" }}>
            {open ? (
              <ListItemButton component={Link} to={`/learning/${id}`}>
                <ListItemText
                  secondary={title}
                  sx={{ opacity: open ? 1 : 0, ml: inset ? 4 : 2 }}
                  secondaryTypographyProps={pageName === id ? { fontWeight: "bold", color: "primary" } : {}}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={title}>
                <ListItemButton
                  sx={{
                    // minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  component={Link}
                  to={`/learning/${id}`}
                >
                  <Avatar
                    sx={{
                      bgcolor: pageName === id ? "rgb(0, 164, 154)" : undefined,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {letter || title[0]}
                  </Avatar>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
      <Divider />
      <List dense>
        {open && (
          <ListItem>
            <ListItemText
              primary={t("learning.tools.title", "Tool Manuals")}
              primaryTypographyProps={{ style: { fontWeight: "bold" } }}
            />
          </ListItem>
        )}
        {toolPages.map(({ title, id, letter, disabled, inset }, index) => (
          <ListItem key={id} disablePadding sx={{ display: "block", whiteSpace: "normal" }}>
            {open ? (
              <ListItemButton component={Link} to={`/learning/${id}`} disabled={disabled}>
                <ListItemText
                  secondary={title}
                  sx={{ opacity: open ? 1 : 0, ml: inset ? 4 : 2 }}
                  secondaryTypographyProps={pageName === id ? { fontWeight: "bold", color: "primary" } : {}}
                />
              </ListItemButton>
            ) : (
              <Tooltip title={title}>
                <ListItemButton
                  sx={{
                    // minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  component={Link}
                  to={`/learning/${id}`}
                >
                  <Avatar
                    sx={{
                      bgcolor: pageName === id ? "rgb(0, 164, 154)" : undefined,
                      width: 32,
                      height: 32,
                    }}
                  >
                    {letter || title[0]}
                  </Avatar>
                </ListItemButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
