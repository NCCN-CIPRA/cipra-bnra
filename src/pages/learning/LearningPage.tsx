import ReactPlayer from "react-player";
import { Box, CircularProgress, Container, IconButton, Stack } from "@mui/material";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useParams } from "react-router-dom";
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
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
  const { i18n } = useTranslation();
  const params = useParams() as RouteParams;
  const api = useAPI();
  const [open, setOpen] = React.useState(true);

  const [dirty, setDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<string | null>(null);

  const { data: page, reloadData: reloadPage } = useRecord<DVPage>({
    table: DataTable.PAGE,
    id: params.page_name,
  });

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

  if (!page)
    return (
      <Box style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
              px: 2.5,
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
        <List>
          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {index}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Stack direction="column">
        <Box sx={{ position: "fixed", top: 72, right: 12 }}>
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
            mt: -2,
            width: "100%",
            bgcolor: "black",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ReactPlayer url="https://www.youtube.com/watch?v=ysz5S6PUM-U" width={712} height={400} />
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
    </>
  );
}
