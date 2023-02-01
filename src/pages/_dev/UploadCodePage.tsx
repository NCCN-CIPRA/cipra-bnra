import { useState, useRef } from "react";
import { Container, Typography, Paper, Button, Stack } from "@mui/material";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRecords from "../../hooks/useRecords";
import useAPI, { DataTable } from "../../hooks/useAPI";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function UploadCodePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const api = useAPI();

  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isUploadingFinished, setIsUploadingFinished] = useState(false);

  usePageTitle("BNRA 2023 - 2026 Result Calculator");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Code Updater", url: "/__dev/code" },
  ]);

  const handlePickFile = () => {
    if (!inputRef.current) return;

    inputRef.current.click();
  };

  const handleSaveAttachment = async () => {
    if (!inputRef.current) return;

    const file = inputRef.current.files && inputRef.current.files[0];

    setIsUploadingFile(true);

    await api.createAttachment(
      {
        cr4de_name: "main.js",
      },
      file
    );

    // await api.updateAttachment("f6e8d236-b196-ed11-aad1-000d3adf7089", file);

    setIsUploadingFile(false);
    setIsUploadingFinished(true);
  };

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h3" sx={{ mt: 0, display: "block" }}>
            Update Code
          </Typography>

          <input ref={inputRef} type="file" style={{ display: "none" }} onInput={handleSaveAttachment} />

          <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={handlePickFile}>
            Upload File
          </Button>
        </Paper>
      </Container>
    </>
  );
}
