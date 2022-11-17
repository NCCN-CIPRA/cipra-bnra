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

type RouteParams = {
  page_name: string;
};

export default function LearningPage({}) {
  const { i18n } = useTranslation();
  const params = useParams() as RouteParams;
  const api = useAPI();

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

  useBreadcrumbs(null);

  if (!page)
    return (
      <Box style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress color="primary" />
      </Box>
    );

  return (
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
  );
}
