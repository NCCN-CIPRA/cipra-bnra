import { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import { DVParticipation } from "../types/dataverse/DVParticipation";
import { DVContact } from "../types/dataverse/DVContact";
import useAPI from "../hooks/useAPI";
import { DVRiskFile, RISK_TYPE } from "../types/dataverse/DVRiskFile";
import DoneIcon from "@mui/icons-material/Done";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const roles = {
  analist: "Author",
  analist_2: "Co-author (backup)",
  expert: "Topical Expert",
};

const showDoneIcon = (
  doneField: boolean | null,
  roleField: string,
  available: boolean = true
) => {
  if (roleField === "analist" || roleField === "analist_2" || !available) {
    return <Typography variant="subtitle1">-</Typography>;
  }

  if (doneField) {
    return <DoneIcon color="success" sx={{ fontSize: 16 }} />;
  }

  return (
    <HourglassEmptyIcon color="warning" sx={{ opacity: 0.5, fontSize: 16 }} />
  );
};

export default function ParticipationTable({
  riskFile,
  participants,
  reloadParticipants,
}: {
  riskFile: DVRiskFile;
  participants: DVParticipation<DVContact>[];
  reloadParticipants: () => Promise<unknown>;
}) {
  const api = useAPI();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("expert");

  const handleCloseDialog = () => setDialogOpen(false);

  const handleAddParticipant = async () => {
    setIsLoading(true);

    const existingContact = await api.getContacts(
      `$filter=contains(emailaddress1,'${email}')`
    );

    let contactId;

    if (existingContact.length <= 0) {
      const newContact = await api.createContact({
        emailaddress1: email,
      });
      contactId = newContact.id;
    } else {
      contactId = existingContact[0].contactid;
    }

    await api.createParticipant({
      "cr4de_contact@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${contactId})`,
      "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
      cr4de_role: role,
    });

    await reloadParticipants();

    setDialogOpen(false);
    setEmail("");
    setRole("expert");

    setIsLoading(false);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "100%" }}>Email</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>Role</TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }} align="right">
                Validation
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }} align="right">
                Direct Analysis
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }} align="right">
                Cascade Analysis
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!participants && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center" }}>
                  <CircularProgress size={20} />
                </TableCell>
              </TableRow>
            )}
            {participants &&
              participants.length > 0 &&
              participants.map((p) => (
                <TableRow key={p.cr4de_bnraparticipationid}>
                  <TableCell component="th" scope="row">
                    {p.cr4de_contact.emailaddress1}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {roles[p.cr4de_role as keyof typeof roles]}
                  </TableCell>
                  <TableCell align="center">
                    {showDoneIcon(p.cr4de_validation_finished, p.cr4de_role)}
                  </TableCell>
                  <TableCell align="center">
                    {showDoneIcon(
                      p.cr4de_direct_analysis_finished,
                      p.cr4de_role,
                      riskFile.cr4de_risk_type !== RISK_TYPE.EMERGING
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {showDoneIcon(
                      p.cr4de_cascade_analysis_finished,
                      p.cr4de_role
                    )}
                  </TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              ))}
            {participants && participants.length <= 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  No participants defined, add some!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} size="small" sx={{ textAlign: "right" }}>
                <Button onClick={() => setDialogOpen(true)}>
                  Add Participant
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add participant</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={4} sx={{ width: 300 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email"
              fullWidth
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="analist">Author</MenuItem>
                <MenuItem value="analist_2">Co-author (back-up)</MenuItem>
                <MenuItem value="expert">Topical Expert</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button loading={isLoading} onClick={handleAddParticipant}>
            Add participant
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
