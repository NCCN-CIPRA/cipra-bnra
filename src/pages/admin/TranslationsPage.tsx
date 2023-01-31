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
    setEditLanguage,
    onRemove,
  }: {
    translations: DVTranslation[] | null;
    setEditTranslation: (t: DVTranslation) => void;
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
            <TableCell width={50}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {translations &&
            translations.map((t) => (
              <TableRow key={t.cr4de_bnratranslationid}>
                <TableCell component="th" scope="row">
                  {t.cr4de_name}
                </TableCell>
                <TableCell
                  sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)", cursor: "pointer" } }}
                  onClick={(event) => {
                    setEditTranslation(t);
                    setEditLanguage("en");
                  }}
                >
                  {t.cr4de_en}
                </TableCell>
                <TableCell
                  sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)", cursor: "pointer" } }}
                  onClick={(event) => {
                    setEditTranslation(t);
                    setEditLanguage("nl");
                  }}
                >
                  {t.cr4de_nl}
                </TableCell>
                <TableCell
                  sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)", cursor: "pointer" } }}
                  onClick={(event) => {
                    setEditTranslation(t);
                    setEditLanguage("fr");
                  }}
                >
                  {t.cr4de_fr}
                </TableCell>
                <TableCell
                  sx={{ "&:hover": { bgcolor: "rgba(0, 0, 0, 0.1)", cursor: "pointer" } }}
                  onClick={(event) => {
                    setEditTranslation(t);
                    setEditLanguage("de");
                  }}
                >
                  {t.cr4de_de}
                </TableCell>
                <TableCell sx={{ width: 30 }}>
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

function TranslationDialog({
  open,
  loading,
  name,
  translation,
  handleCloseEditDialog,
}: {
  open: boolean;
  loading: boolean;
  name: string;
  translation: string;
  handleCloseEditDialog: (newValue?: string) => void;
}) {
  const [newTranslation, setNewTranslation] = useState<string>(translation);

  return (
    <Dialog open={open} onClose={() => handleCloseEditDialog(newTranslation)}>
      <DialogTitle>Edit Translations</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1" paragraph>
            {name}
          </Typography>
          <Stack direction="column" spacing={3}>
            <Stack direction="row" alignItems="center" spacing={1}></Stack>
            <TextField multiline rows={3} value={newTranslation} onChange={(e) => setNewTranslation(e.target.value)} />
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCloseEditDialog()}>Cancel</Button>
        <LoadingButton loading={loading} variant="text" onClick={() => handleCloseEditDialog(newTranslation)}>
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default function TranslationsPage() {
  const api = useAPI();

  const [isLoading, setIsLoading] = useState(false);

  const [editTranslation, setEditTranslation] = useState<DVTranslation | null>(null);
  const [editLanguage, setEditLanguage] = useState<string>("en");

  const { data: translations, reloadData } = useRecords<DVTranslation>({
    table: DataTable.TRANSLATIONS,
    query: "$orderby=cr4de_name",
    // REMOVE DOUBLES
    // onComplete: async (data) => {
    //   const col: { [key: string]: DVTranslation[] } = {};

    //   data.forEach((t) => {
    //     if (!col[t.cr4de_name]) col[t.cr4de_name] = [];

    //     col[t.cr4de_name].push(t);
    //   });

    //   const doubles = Object.values(col).filter((c) => c.length > 1);
    //   console.log(doubles.length);
    //   console.log(doubles);
    //   for (let i = 0; i < doubles.length; i++) {
    //     for (let j = 1; j < doubles[i].length; j++) {
    //       console.log(doubles[i][j].cr4de_name);
    //       await api.deleteTranslation(doubles[i][j].cr4de_bnratranslationid);
    //       await new Promise((r) => setTimeout(r, 500));
    //     }
    //   }
    // },
  });

  const handleCloseEditDialog = (newTranslation?: string) => {
    setEditTranslation(null);

    if (newTranslation) handleSaveTranslation(newTranslation);
  };

  const handleSaveTranslation = async (newTranslation: string) => {
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
      <Box mx={10}>
        <Box mt={5}>
          <Typography variant="body1" my={2}></Typography>
        </Box>

        <TranslationsTable
          translations={translations}
          setEditTranslation={setEditTranslation}
          setEditLanguage={setEditLanguage}
          onRemove={handleRemove}
        />

        {editTranslation && (
          <TranslationDialog
            open={editTranslation !== null}
            loading={isLoading}
            name={editTranslation?.cr4de_name}
            translation={editTranslation[`cr4de_${editLanguage}` as keyof DVTranslation] || ""}
            handleCloseEditDialog={handleCloseEditDialog}
          />
        )}
      </Box>
    </>
  );
}
