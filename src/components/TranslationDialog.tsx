import { useState } from "react";
import useAPI from "../hooks/useAPI";
import { DVTranslation } from "../types/dataverse/DVTranslation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function TranslationDialog({
  open,
  translation,
  isLoading,
  setIsLoading,
  onClose,
  reloadData,
}: {
  open: boolean;
  translation: Partial<DVTranslation>;
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
  onClose: () => void;
  reloadData: () => Promise<unknown>;
}) {
  const api = useAPI();
  const [newTranslation, setNewTranslation] = useState(translation);

  const handleSaveTranslation = async () => {
    setIsLoading(true);

    onClose();

    if (newTranslation.cr4de_bnratranslationid) {
      await api.updateTranslation(newTranslation.cr4de_bnratranslationid, {
        cr4de_en: newTranslation.cr4de_en,
        cr4de_nl: newTranslation.cr4de_nl,
        cr4de_fr: newTranslation.cr4de_fr,
        cr4de_de: newTranslation.cr4de_de,
      });
    } else {
      await api.createTranslation({
        cr4de_name: newTranslation.cr4de_name,
        cr4de_en: newTranslation.cr4de_en,
        cr4de_nl: newTranslation.cr4de_nl,
        cr4de_fr: newTranslation.cr4de_fr,
        cr4de_de: newTranslation.cr4de_de,
      });
    }

    await reloadData();
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Translations</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography variant="body1" paragraph>
            {newTranslation.cr4de_name}
          </Typography>
          <Typography variant="h6">EN: </Typography>
          <Stack direction="column" spacing={3} sx={{ pb: 4 }}>
            <TextField
              multiline
              rows={3}
              value={newTranslation.cr4de_en}
              onChange={(e) =>
                setNewTranslation({
                  ...newTranslation,
                  cr4de_en: e.target.value,
                })
              }
            />
          </Stack>
          <Typography variant="h6">NL: </Typography>
          <Stack direction="column" spacing={3} sx={{ pb: 4 }}>
            <TextField
              multiline
              rows={3}
              value={newTranslation.cr4de_nl}
              onChange={(e) =>
                setNewTranslation({
                  ...newTranslation,
                  cr4de_nl: e.target.value,
                })
              }
            />
          </Stack>
          <Typography variant="h6">FR: </Typography>
          <Stack direction="column" spacing={3} sx={{ pb: 4 }}>
            <TextField
              multiline
              rows={3}
              value={newTranslation.cr4de_fr}
              onChange={(e) =>
                setNewTranslation({
                  ...newTranslation,
                  cr4de_fr: e.target.value,
                })
              }
            />
          </Stack>
          <Typography variant="h6">DE: </Typography>
          <Stack direction="column" spacing={3} sx={{ pb: 4 }}>
            <TextField
              multiline
              rows={3}
              value={newTranslation.cr4de_de}
              onChange={(e) =>
                setNewTranslation({
                  ...newTranslation,
                  cr4de_de: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancel</Button>
        <Button
          loading={isLoading}
          variant="text"
          onClick={() => handleSaveTranslation()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
