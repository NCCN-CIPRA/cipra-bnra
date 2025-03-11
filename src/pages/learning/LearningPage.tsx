import {
  Box,
  CircularProgress,
  Container,
  IconButton,
  Stack,
} from "@mui/material";
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
import { styled } from "@mui/material/styles";
import usePageTitle from "../../hooks/usePageTitle";
import LearningSideBar from "../../components/LearningSideBar";

type RouteParams = {
  page_name: string;
};

const drawerWidth = 320;

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

export default function LearningPage() {
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
  usePageTitle(
    t(
      "learning.methodology.general.title",
      "BNRA 2023 - 2026 Informatieplatform: Algemene Inleiding"
    )
  );

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
      <LearningSideBar
        open={open}
        width={drawerWidth}
        pageName={params.page_name}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Main open={open}>
        <Stack direction="column">
          <Box sx={{ position: "fixed", top: 72, right: open ? 250 : 80 }}>
            <IconButton
              onClick={() => setIsEditing(!isEditing)}
              disabled={isSaving || dirty}
              sx={{ "&:hover": { backgroundColor: "rgba(185,185,185,0.2)" } }}
            >
              {!isEditing && !isSaving && (
                <EditIcon style={{ color: "#999" }} />
              )}
              {isEditing && !isSaving && (
                <VisibilityIcon style={{ color: "#999" }} />
              )}
              {isSaving && (
                <CircularProgress style={{ color: "#999" }} size={20} />
              )}
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
                  page[`cr4de_video_${i18n.languages[0]}` as keyof DVPage] ||
                  page.cr4de_video_nl ||
                  ""
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
                initialValue={
                  page[`cr4de_content_${i18n.languages[0]}` as keyof DVPage]
                }
                height="1000px"
                onSave={handleAutoSave}
                setUpdatedValue={handleSetFieldUpdate}
              />
            ) : (
              <Box
                dangerouslySetInnerHTML={{
                  __html:
                    page[
                      `cr4de_content_${i18n.languages[0]}` as keyof DVPage
                    ] || "",
                }}
              />
            )}
          </Container>
        </Stack>
      </Main>
    </>
  );
}
