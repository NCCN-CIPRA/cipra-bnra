import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Typography,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Box,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVContact } from "../../types/dataverse/DVContact";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { useState } from "react";
import { GridCloseIcon } from "@mui/x-data-grid";

export default function ExpertsTab() {
  const api = useAPI();
  const queryClient = useQueryClient();
  const { riskSummary } = useOutletContext<RiskFilePageContext>();
  const [openAddParticipantDialog, setOpenAddParticipantDialog] =
    useState(false);
  const [searchContact, setSearchContact] = useState("");
  const [selectedParticipant, setSelectedParticipant] =
    useState<null | DVContact>(null);
  const [selectedParticipantOrg, setSelectedParticipantOrg] =
    useState<string>("");
  const [removingParticipant, setRemovingParticipant] =
    useState<DVParticipation<DVContact> | null>(null);

  const { data: participants } = useQuery({
    queryKey: [DataTable.PARTICIPATION, riskSummary._cr4de_risk_file_value],
    queryFn: () =>
      api.getParticipants<DVParticipation<DVContact>>(
        `$filter=_cr4de_risk_file_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_contact`
      ),
  });

  const { data: contacts } = useQuery({
    queryKey: [DataTable.CONTACT],
    queryFn: () => api.getContacts(),
    enabled: openAddParticipantDialog,
  });

  const { mutate: createParticipant, isPending: isCreatingParticipant } =
    useMutation({
      mutationFn: async (newParticipant: Partial<DVParticipation>) =>
        api.createParticipant(newParticipant),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            DataTable.PARTICIPATION,
            riskSummary._cr4de_risk_file_value,
          ],
        });
      },
    });

  const { mutate: removeParticipant } = useMutation({
    mutationFn: async ({ id }: { id: string }) => api.deleteParticipant(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [DataTable.PARTICIPATION, riskSummary._cr4de_risk_file_value],
      });
      setRemovingParticipant(null);
    },
  });

  const { mutate: updateContact, isPending: isUpdatingContact } = useMutation({
    mutationFn: async ({ id, org }: { id: string; org: string }) =>
      api.updateContact(id, { adx_organizationname: org }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [DataTable.CONTACT],
      });
    },
  });

  const handleCreateParticipant = () => {
    if (!selectedParticipant) return;

    if (
      !participants?.some(
        (p) => p._cr4de_contact_value === selectedParticipant.contactid
      )
    ) {
      createParticipant({
        "cr4de_contact@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${selectedParticipant.contactid})`,
        "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskSummary._cr4de_risk_file_value})`,
        cr4de_role: "expert",
      });
    }

    if (
      selectedParticipantOrg !== "" &&
      selectedParticipantOrg !== selectedParticipant.adx_organizationname
    ) {
      updateContact({
        id: selectedParticipant.contactid,
        org: selectedParticipantOrg,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setOpenAddParticipantDialog(false);
    setSearchContact("");
    setSelectedParticipant(null);
    setSelectedParticipantOrg("");
  };

  const handleRemoveParticipant = (p: DVParticipation<DVContact>) => {
    if (
      window.confirm(
        `Are you sure you wish to remove this participant: ${p.cr4de_contact.emailaddress1}`
      )
    ) {
      setRemovingParticipant(p);
      removeParticipant({ id: p.cr4de_bnraparticipationid });
    }
  };

  return (
    <Container>
      <Paper>
        <Toolbar disableGutters sx={{ px: 2, borderBottom: "1px solid #eee" }}>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Risk File Experts
          </Typography>
          <Button
            variant="outlined"
            sx={{ whiteSpace: "nowrap" }}
            loading={isCreatingParticipant || isUpdatingContact}
            onClick={() => setOpenAddParticipantDialog(true)}
          >
            Add Expert
          </Button>
        </Toolbar>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {participants &&
                participants
                  .filter((p) => p.cr4de_role === "expert")
                  .map((p) => (
                    <TableRow
                      sx={{ opacity: removingParticipant === p ? 0.3 : 1 }}
                    >
                      <TableCell>
                        {p.cr4de_contact.firstname} {p.cr4de_contact.lastname}
                      </TableCell>
                      <TableCell>{p.cr4de_contact.emailaddress1}</TableCell>
                      <TableCell sx={{ width: 0 }}>
                        {removingParticipant === p ? (
                          <CircularProgress size={15} />
                        ) : (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveParticipant(p)}
                          >
                            <GridCloseIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={openAddParticipantDialog} onClose={handleClose}>
        <DialogTitle sx={{ width: 500 }}>Add Participant</DialogTitle>
        <DialogContent>
          {selectedParticipant === null ? (
            <>
              <TextField
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
                autoFocus
                required
                margin="dense"
                label="Search Name / Email"
                fullWidth
                variant="standard"
                autoComplete="off"
              />
              <Box sx={{ mt: 1, ml: -1 }}>
                {contacts &&
                  searchContact !== "" &&
                  contacts
                    .filter(
                      (c) =>
                        c.emailaddress1
                          .toLowerCase()
                          .indexOf(searchContact.toLowerCase()) >= 0 ||
                        (c.firstname &&
                          c.firstname
                            .toLowerCase()
                            .indexOf(searchContact.toLowerCase()) >= 0) ||
                        (c.lastname &&
                          c.lastname
                            .toLowerCase()
                            .indexOf(searchContact.toLowerCase()) >= 0) ||
                        (c.adx_organizationname &&
                          c.adx_organizationname
                            .toLowerCase()
                            .indexOf(searchContact.toLowerCase()) >= 0)
                    )
                    .map((c) => (
                      <Button
                        fullWidth
                        sx={{ justifyContent: "flex-start" }}
                        onClick={() => setSelectedParticipant(c)}
                      >
                        {c.emailaddress1}
                        {participants?.some(
                          (p) => p._cr4de_contact_value === c.contactid
                        )
                          ? " (already added)"
                          : ` (${c.firstname} ${c.lastname}})`}
                      </Button>
                    ))}
              </Box>
            </>
          ) : (
            <>
              <Stack direction="row" alignItems="center">
                <Typography variant="subtitle2" sx={{ flex: 1 }}>
                  {selectedParticipant.emailaddress1}
                </Typography>
                <IconButton>
                  <GridCloseIcon />
                </IconButton>
              </Stack>

              <TextField
                value={
                  selectedParticipantOrg ||
                  selectedParticipant.adx_organizationname
                }
                onChange={(e) => setSelectedParticipantOrg(e.target.value)}
                autoFocus
                required
                margin="dense"
                label="Update contact organization"
                fullWidth
                variant="standard"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={handleCreateParticipant}>
            Add Participant
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
