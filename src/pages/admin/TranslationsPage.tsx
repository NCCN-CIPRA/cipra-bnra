import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import { DVTranslation } from "../../types/dataverse/DVTranslation";
import { Stack } from "@mui/system";
import { LoadingButton } from "@mui/lab";
import Delete from "@mui/icons-material/Delete";

const TranslationsTable = React.memo(
  ({
    translations,
    setEditTranslation,
    setNewTranslation,
    setEditLanguage,
    onRemove,
  }: {
    translations: DVTranslation[] | null;
    setEditTranslation: (t: DVTranslation) => void;
    setNewTranslation: (t: string | null) => void;
    setEditLanguage: (l: string) => void;
    onRemove: (t: DVTranslation) => Promise<void>;
  }) => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width={0}>Text name</TableCell>
            <TableCell>English</TableCell>
            <TableCell>Nederlands</TableCell>
            <TableCell>Français</TableCell>
            <TableCell>Deutsch</TableCell>
            <TableCell width={0}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {translations &&
            translations.map((t) => (
              <TableRow key={t.cr4de_name}>
                <TableCell component="th" scope="row">
                  {t.cr4de_name}
                </TableCell>
                <TableCell
                  sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)", cursor: "pointer" } }}
                  onClick={(event) => {
                    setEditTranslation(t);
                    setNewTranslation(t.cr4de_en);
                    setEditLanguage("en");
                  }}
                >
                  {t.cr4de_en}
                </TableCell>
                <TableCell
                  sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)", cursor: "pointer" } }}
                  onClick={(event) => {
                    setEditTranslation(t);
                    setNewTranslation(t.cr4de_nl);
                    setEditLanguage("nl");
                  }}
                >
                  {t.cr4de_nl}
                </TableCell>
                <TableCell
                  sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)", cursor: "pointer" } }}
                  onClick={(event) => {
                    setEditTranslation(t);
                    setNewTranslation(t.cr4de_fr);
                    setEditLanguage("fr");
                  }}
                >
                  {t.cr4de_fr}
                </TableCell>
                <TableCell
                  sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)", cursor: "pointer" } }}
                  onClick={(event) => {
                    setEditTranslation(t);
                    setNewTranslation(t.cr4de_de);
                    setEditLanguage("de");
                  }}
                >
                  {t.cr4de_de}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => onRemove(t)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
);

export default function TranslationsPage() {
  const api = useAPI();

  const [isLoading, setIsLoading] = useState(false);

  const [editTranslation, setEditTranslation] = useState<DVTranslation | null>(null);
  const [editLanguage, setEditLanguage] = useState<string>("en");

  const [newTranslation, setNewTranslation] = useState<string | null>(null);

  const { data: translations, reloadData } = useRecords<DVTranslation>({
    table: DataTable.TRANSLATIONS,
    query: "$orderby=cr4de_name",
  });

  const handleCloseEditDialog = () => setEditTranslation(null);

  const handleSaveTranslation = async () => {
    if (!editTranslation) return;

    setIsLoading(true);

    await api.updateTranslation(editTranslation?.cr4de_bnratranslationid, {
      [`cr4de_${editLanguage}`]: newTranslation,
    });

    await reloadData();

    setIsLoading(false);
    setEditTranslation(null);
  };

  const handleRemove = async (t: DVTranslation) => {
    if (window.confirm("Are you sure you wish to delete this translation?")) {
      setIsLoading(true);

      await api.deleteTranslation(t.cr4de_bnratranslationid);

      await reloadData();

      setIsLoading(false);
    }
  };

  return (
    <>
      <Container sx={{ mb: 8 }}>
        <Box mt={5}>
          <Typography variant="body1" my={2}></Typography>
        </Box>

        <TranslationsTable
          translations={translations}
          setEditTranslation={setEditTranslation}
          setNewTranslation={setNewTranslation}
          setEditLanguage={setEditLanguage}
          onRemove={handleRemove}
        />
      </Container>

      <Dialog open={editTranslation !== null} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Translations</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" paragraph>
              {editTranslation?.cr4de_name}
            </Typography>
            <Stack direction="column" spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}></Stack>
              <TextField
                multiline
                rows={3}
                value={newTranslation}
                onChange={(e) => setNewTranslation(e.target.value)}
              />
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <LoadingButton loading={isLoading} variant="text" onClick={handleSaveTranslation}>
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
