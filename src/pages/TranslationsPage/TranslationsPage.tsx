import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import { DVTranslation } from "../../types/dataverse/DVTranslation";
import Delete from "@mui/icons-material/Delete";
import TranslationDialog from "../../components/TranslationDialog";

const TranslationsTable = React.memo(
  ({
    translations,
    setEditTranslation,
    onRemove,
  }: {
    translations: DVTranslation[] | null;
    setEditTranslation: (t: DVTranslation) => void;
    onRemove: (t: DVTranslation) => Promise<void>;
  }) => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width={0}>Created On</TableCell>
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
              <TableRow
                key={t.cr4de_bnratranslationid}
                onClick={() => {
                  setEditTranslation(t);
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  {t.createdon.slice(0, 10)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {t.cr4de_name}
                </TableCell>
                <TableCell
                  sx={{
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                    },
                  }}
                >
                  {t.cr4de_en}
                </TableCell>
                <TableCell
                  sx={{
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                    },
                  }}
                >
                  {t.cr4de_nl}
                </TableCell>
                <TableCell
                  sx={{
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                    },
                  }}
                >
                  {t.cr4de_fr}
                </TableCell>
                <TableCell
                  sx={{
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                    },
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

export default function TranslationsPage() {
  const api = useAPI();

  const [editTranslation, setEditTranslation] = useState<DVTranslation | null>(
    null
  );
  const [filter, setFilter] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { data: translations, reloadData } = useRecords<DVTranslation>({
    table: DataTable.TRANSLATIONS,
    query: "$orderby=createdon desc",
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

  const handleCloseEditDialog = () => {
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

        <Card sx={{ my: 4 }}>
          <CardActions>
            <Button onClick={() => setFilter(!filter)}>
              {filter ? "Show All" : "Show Incomplete"}
            </Button>
          </CardActions>
        </Card>

        <TranslationsTable
          translations={
            translations && filter
              ? translations.filter(
                  (t) =>
                    t.cr4de_nl === null ||
                    t.cr4de_fr === null ||
                    t.cr4de_en === null
                )
              : translations
          }
          setEditTranslation={setEditTranslation}
          onRemove={handleRemove}
        />

        {editTranslation && (
          <TranslationDialog
            open={editTranslation !== null}
            translation={editTranslation}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            onClose={handleCloseEditDialog}
            reloadData={reloadData}
          />
        )}
      </Box>
    </>
  );
}
