import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Grid,
  Divider,
  Snackbar,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Tooltip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Collapse,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Trans } from "react-i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import useAPI from "../../../hooks/useAPI";

export default function Attachments({
  reset,
  getAttachments,
  consolidateAttachment,
  deleteAttachment,
}: {
  reset: boolean;
  getAttachments: () => Promise<DVAttachment<unknown, DVAttachment>[]>;
  consolidateAttachment: ((attachment: DVAttachment) => Promise<void>) | null;
  deleteAttachment: ((attachment: DVAttachment) => Promise<void>) | null;
}) {
  const api = useAPI();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [attachments, setAttachments] = useState<DVAttachment<unknown, DVAttachment>[] | null>(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isConsolidating, setIsConsolidating] = useState(false);

  useEffect(() => {
    if (reset) {
      setAttachments(null);
      setExpanded(false);
      setIsLoading(false);
    }
  }, [reset]);

  return (
    <Box mt={1} sx={{ backgroundColor: consolidateAttachment !== null ? "#efefef77" : "#fff" }}>
      <Stack direction="row" sx={{ mt: 2, alignItems: "center", pl: 2 }}>
        <Typography variant="subtitle2">Attachments</Typography>
        <Box sx={{ flex: 1 }} />
        <Tooltip title={expanded ? "Hide Attachments" : "Show Attachments"}>
          <IconButton
            onClick={async () => {
              setExpanded(!expanded);
              if (attachments === null && !isLoading) {
                setIsLoading(true);
                setAttachments(await getAttachments());
                setIsLoading(false);
              }
            }}
            className="attachment-expand-button"
          >
            <ExpandMoreIcon
              sx={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: theme.transitions.create("transform", {
                  duration: theme.transitions.duration.shortest,
                }),
              }}
            />
          </IconButton>
        </Tooltip>
      </Stack>

      <Collapse in={expanded && !reset} timeout="auto" unmountOnExit sx={{ px: 2 }}>
        <Table size="small" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Trans i18nKey="source.list.fileName">Source filename</Trans>
              </TableCell>
              <TableCell sx={{ width: 0, whiteSpace: "nowrap" }}>
                <Trans i18nKey="source.list.type">Source Type</Trans>
              </TableCell>
              <TableCell align="right" sx={{ width: 0 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attachments &&
              attachments.length > 0 &&
              attachments
                .map((a) =>
                  a.cr4de_referencedSource ? { a: a.cr4de_referencedSource, parent: a } : { a: a, parent: a }
                )
                .map((a) => (
                  <TableRow key={a.a.cr4de_name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      <Link
                        sx={{ "&:hover": { cursor: "pointer" } }}
                        onClick={async () => {
                          if (a) {
                            setIsDownloading(true);
                          }
                          await api.serveAttachmentFile(a.a);
                          setIsDownloading(false);
                        }}
                      >
                        {a.a.cr4de_name}
                      </Link>
                    </TableCell>
                    <TableCell>{a.a.cr4de_url ? "Link" : "File"}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap", textAlign: "right" }}>
                      {consolidateAttachment !== null && (
                        <>
                          {isConsolidating ? (
                            <CircularProgress size={16} />
                          ) : (
                            <Tooltip title="Add this source to the consolidated risk file">
                              <IconButton
                                onClick={async () => {
                                  setIsConsolidating(true);
                                  await consolidateAttachment(a.a);
                                  setIsConsolidating(false);
                                }}
                              >
                                <MoveUpIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                      {deleteAttachment && (
                        <>
                          {isConsolidating ? (
                            <CircularProgress size={16} />
                          ) : (
                            <Tooltip title="Remove this source from the consolidated risk file (this does not remove the original source from the expert input)">
                              <IconButton
                                onClick={async () => {
                                  setIsConsolidating(true);
                                  await deleteAttachment(a.parent);
                                  setIsConsolidating(false);
                                }}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            {attachments && attachments.length <= 0 && (
              <TableRow>
                <TableCell sx={{ textAlign: "center" }} colSpan={3}>
                  <Trans i18nKey="source.list.noSources">No sources attached</Trans>
                </TableCell>
              </TableRow>
            )}
            {attachments === null && (
              <Box sx={{ textAlign: "center", m: 2 }}>
                <CircularProgress size={24} sx={{}} />
              </Box>
            )}
          </TableBody>
        </Table>
      </Collapse>
    </Box>
  );
}
