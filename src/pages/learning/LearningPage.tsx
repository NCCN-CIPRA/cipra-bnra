import ReactPlayer from "react-player";
import { Avatar, Box, CircularProgress, Container, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { Link, useParams } from "react-router-dom";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useRecord from "../../hooks/useRecord";
import { DVPage } from "../../types/dataverse/DVPage";
import TextInputBox from "../../components/TextInputBox";
import { useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import usePageTitle from "../../hooks/usePageTitle";
import { motion } from "framer-motion";

type RouteParams = {
  page_name: string;
};

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
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

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: `calc(${theme.spacing(7)} + 1px)`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: `${drawerWidth}px`,
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
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

export default function LearningPage({}) {
  const { i18n, t } = useTranslation();
  const params = useParams() as RouteParams;
  const api = useAPI();
  const [open, setOpen] = React.useState(true);

  const [dirty, setDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<string | null>(null);

  const {
    data: page,
    reloadData: reloadPage,
    loading,
  } = useRecord<DVPage>({
    table: DataTable.PAGE,
    id: params.page_name,
  });

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
    { title: t("learning.tools.analysisA", "Risk Analysis A"), id: "tools-analysisA", letter: "A", disabled: true },
    { title: t("learning.tools.analysisB", "Risk Analysis B"), id: "tools-analysisB", letter: "B", disabled: true },
    { title: t("learning.tools.consensus", "Consensus"), id: "tools-consensus", disabled: true },
  ];

  const handleAutoSave = async (content: string | null) => {
    if (!page) return;

    setIsSaving(true);

    await api.updatePage(page.cr4de_bnrapageid, {
      [`cr4de_content_${i18n.languages[0]}` as keyof DVPage]: content,
    });
    await reloadPage();

    setIsSaving(false);
    setDirty(false);
  };

  const handleSetFieldUpdate = async (content: string | null | undefined) => {
    if (content === undefined) {
      contentRef.current = null;
    } else {
      contentRef.current = content;
    }

    setDirty(contentRef.current !== null);
  };

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  useBreadcrumbs(null);
  usePageTitle(t("learning.methodology.general.title", "BNRA 2023 - 2026 Informatieplatform: Algemene Inleiding"));

  if (!page)
    return (
      <Box
        style={{
          width: "50%",
          margin: "auto",
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );

  return (
    <>
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
                  <ListItemText secondary={title} sx={{ opacity: open ? 1 : 0, ml: 2 }} />
                </ListItemButton>
              ) : (
                <Tooltip title={title}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    component={Link}
                    to={`/learning/${id}`}
                  >
                    <Avatar
                      sx={{
                        bgcolor: params.page_name === id ? "rgb(0, 164, 154)" : undefined,
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
                  <ListItemText secondary={title} sx={{ opacity: open ? 1 : 0, ml: 2 }} />
                </ListItemButton>
              ) : (
                <Tooltip title={title}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    component={Link}
                    to={`/learning/${id}`}
                  >
                    <Avatar
                      sx={{
                        bgcolor: params.page_name === id ? "rgb(0, 164, 154)" : undefined,
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
          {toolPages.map(({ title, id, letter, disabled }, index) => (
            <ListItem key={id} disablePadding sx={{ display: "block", whiteSpace: "normal" }}>
              {open ? (
                <ListItemButton component={Link} to={`/learning/${id}`} disabled={disabled}>
                  <ListItemText secondary={title} sx={{ opacity: open ? 1 : 0, ml: 2 }} />
                </ListItemButton>
              ) : (
                <Tooltip title={title}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                    component={Link}
                    to={`/learning/${id}`}
                  >
                    <Avatar>{letter || title[0]}</Avatar>
                  </ListItemButton>
                </Tooltip>
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <Stack direction="column">
          <Box sx={{ position: "fixed", top: 72, right: open ? 250 : 80 }}>
            <IconButton
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSaving || dirty}
              sx={{ "&:hover": { backgroundColor: "rgba(185,185,185,0.2)" } }}
            >
              {!isEditing && !isSaving && <EditIcon style={{ color: "#999" }} />}
              {isEditing && !isSaving && <VisibilityIcon style={{ color: "#999" }} />}
              {isSaving && <CircularProgress style={{ color: "#999" }} size={20} />}
            </IconButton>
          </Box>
          <Box
            className="player-wrapper"
            sx={{
              mt: 0,
              width: "100%",
              bgcolor: "black",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  width: 854,
                  height: 480,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            ) : (
              <iframe
                width="854"
                height="480"
                src={`https://www.youtube.com/embed/${
                  page[`cr4de_video_${i18n.languages[0]}` as keyof DVPage] || page.cr4de_video_nl || ""
                }`}
                title={page.cr4de_bnrapageid}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            )}
          </Box>
          <Container sx={{ mt: 4, mb: 8 }}>
            {isEditing ? (
              <TextInputBox
                initialValue={page[`cr4de_content_${i18n.languages[0]}` as keyof DVPage]}
                height="1000px"
                onSave={handleAutoSave}
                setUpdatedValue={handleSetFieldUpdate}
              />
            ) : (
              <Box
                dangerouslySetInnerHTML={{
                  __html: page[`cr4de_content_${i18n.languages[0]}` as keyof DVPage] || "",
                }}
              />
            )}
          </Container>
        </Stack>
      </Main>
    </>
  );
}
