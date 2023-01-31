import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Container,
  IconButton,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import { LoadingButton } from "@mui/lab";
import { DVContact } from "../../types/dataverse/DVContact";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";

interface SelectableExpert extends DVContact<DVParticipation<DVContact, DVRiskFile>[]> {
  selected: boolean;
}

const ParticipationStepper = ({ participation }: { participation: DVParticipation<DVContact, DVRiskFile> }) => {
  let activeStep = 0;

  // if (participation.cr4de_contact.registered) activeStep++;
  if (participation.cr4de_validation_finished) activeStep++;

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ width: "550px" }}>
      <Step completed={activeStep > 0}>
        <Tooltip
          title={
            activeStep > 0
              ? "The expert has registered their account"
              : "The expert has not yet registered their account"
          }
        >
          <StepLabel icon={"0"}></StepLabel>
        </Tooltip>
      </Step>
      <Step completed={activeStep > 1}>
        <Tooltip
          title={
            activeStep > 1
              ? "The expert has validated this risk file"
              : "The expert has not yet validated this risk file"
          }
        >
          <StepLabel icon={1}></StepLabel>
        </Tooltip>
      </Step>
      {participation.cr4de_risk_file.cr4de_risk_type === "Standard Risk" ? (
        <>
          <Step completed={activeStep > 2}>
            <Tooltip
              title={activeStep > 2 ? "The expert has finished step 2A" : "The expert has not yet finished step 2A"}
            >
              <StepLabel icon={"2A"}></StepLabel>
            </Tooltip>
          </Step>
          <Step completed={activeStep > 3}>
            <Tooltip
              title={activeStep > 3 ? "The expert has finished step 2B" : "The expert has not yet finished step 2B"}
            >
              <StepLabel icon={"2B"}></StepLabel>
            </Tooltip>
          </Step>
        </>
      ) : (
        <>
          <Step completed={activeStep > 2}>
            <Tooltip
              title={activeStep > 2 ? "The expert has finished step 2" : "The expert has not yet finished step 2"}
            >
              <StepLabel icon={"2"}></StepLabel>
            </Tooltip>
          </Step>
          <Step completed={activeStep > 3} disabled>
            <StepLabel icon={"/"}></StepLabel>
          </Step>
        </>
      )}
      <Step completed={activeStep > 4}>
        <Tooltip
          title={
            activeStep > 4
              ? "The expert has participated in the consensus meeting"
              : "The expert has not yet participated in the consensus meeting"
          }
        >
          <StepLabel icon={"3"}></StepLabel>
        </Tooltip>
      </Step>
    </Stepper>
  );
};

const ExpertsTable = ({
  experts,
  setExperts,
  filter,
  setFilter,
  onInvite,
}: {
  experts: SelectableExpert[];
  setExperts: (newExperts: SelectableExpert[]) => void;
  filter: string;
  setFilter: (filter: string) => void;
  onInvite: (t: SelectableExpert[]) => Promise<void>;
}) => {
  const [allSelected, setAllSelected] = useState(false);

  const selectAll = () => {
    if (allSelected) {
      setAllSelected(false);
      setExperts(
        experts?.map((e) => ({
          ...e,
          selected: false,
        }))
      );
    } else {
      setAllSelected(true);
      setExperts(
        experts?.map((e) => ({
          ...e,
          selected: true,
        }))
      );
    }
  };

  const selectExpert = (selectedExpert: SelectableExpert) => {
    setAllSelected(false);
    setExperts(
      experts.map((e) => {
        if (e.contactid !== selectedExpert.contactid) return e;

        return {
          ...e,
          selected: !e.selected,
        };
      })
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox checked={allSelected} onChange={selectAll} />
            </TableCell>
            <TableCell width="100%">
              <TextField
                id="standard-basic"
                placeholder="Filter expert name or risk file"
                variant="standard"
                fullWidth
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </TableCell>
            <TableCell sx={{ textAlign: "right" }}>
              <Tooltip title="Send an invitation email to all selected expert so they can register on the BNRA application">
                <IconButton onClick={() => onInvite(experts.filter((e) => e.selected))}>
                  <ContactMailIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {experts &&
            experts.map((e) => (
              <>
                <TableRow key={e.emailaddress1}>
                  <TableCell>
                    <Checkbox checked={e.selected} onChange={() => selectExpert(e)} />
                  </TableCell>
                  <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                    {e.firstname} {e.lastname}
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Tooltip title="Send an invitation email to this expert so they can register on the BNRA application">
                      <IconButton onClick={() => onInvite([e])}>
                        <ContactMailIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                {e.participations.map((p) => {
                  if (p.cr4de_role === "expert") {
                    return (
                      <TableRow key={p.cr4de_risk_file.cr4de_riskfilesid}>
                        <TableCell></TableCell>
                        <TableCell component="td" scope="row" sx={{ p: 1, pl: 4 }}>
                          {p.cr4de_risk_file.cr4de_title}
                        </TableCell>
                        <TableCell sx={{ textAlign: "right" }}>
                          <ParticipationStepper participation={p} />
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    return (
                      <TableRow key={p.cr4de_risk_file.cr4de_riskfilesid}>
                        <TableCell></TableCell>
                        <TableCell component="td" scope="row" sx={{ p: 1, pl: 4 }}>
                          {p.cr4de_risk_file.cr4de_title}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Typography variant="body1">{p.cr4de_role === "analist" ? "Author" : "Co-Author"}</Typography>
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}
                <TableRow>
                  <TableCell
                    colSpan={100}
                    component="td"
                    scope="row"
                    sx={{ p: 1, backgroundColor: "#eee" }}
                  ></TableCell>
                </TableRow>
              </>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ParticipantInput = ({
  experts,
  onFinishUpload,
}: {
  experts: SelectableExpert[];
  onFinishUpload: () => Promise<void>;
}) => {
  const api = useAPI();

  const [isLoading, setIsLoading] = useState(false);
  const [expertsCSV, setExpertsCSV] = useState("");

  const handleUploadExperts = async () => {
    setIsLoading(true);

    const delimiter = expertsCSV.indexOf(";") >= 0 ? ";" : ",";

    const contacts = await api.getContacts("$select=emailaddress1");
    const missingContacts = [];

    const expertData: { [email: string]: any } = expertsCSV
      .split("\n")
      .map((l) => {
        const [email, hazardId, role] = l.split(delimiter);

        return { email, hazardId, role };
      })
      .reduce((acc: any, e) => {
        if (!acc[e.email]) {
          acc[e.email] = {};
        }

        const existingContact = contacts?.find((c) => c.emailaddress1 === e.email);
        const existingParticipation = experts?.find((expert) => expert.emailaddress1 === e.email);

        if (!existingContact) {
          missingContacts.push(e);

          return acc;
        } else {
          acc[e.email].contact = existingContact;
        }

        if (existingParticipation?.participations.some((p) => p.cr4de_risk_file.cr4de_hazard_id === e.hazardId)) {
          return acc;
        }

        if (!acc[e.email].participations) {
          acc[e.email].participations = [];
        }

        acc[e.email].participations.push(e.hazardId);

        return acc;
      }, {});

    for (let expert of Object.values(expertData)) {
      for (let hazardId of expert.participations) {
        const riskFile = await api.getRiskFiles(`$filter=cr4de_hazard_id eq '${hazardId}'`);

        if (riskFile?.length > 0) {
          await api.createParticipant({
            "cr4de_contact@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${expert.contact.contactid})`,
            cr4de_role: expert.role,
            "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile[0].cr4de_riskfilesid})`,
          });
        }
      }
    }

    await onFinishUpload();

    setIsLoading(false);
  };

  return (
    <Accordion sx={{ mb: 4 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography>Load Participation Data</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Paste CSV participation data below to load in the following format:
        </Typography>
        <pre style={{ marginLeft: 16 }}>
          <Typography variant="caption" paragraph sx={{ m: 0 }}>
            [Email],[Risk File Hazard ID],[expert|analist|analist_2]
          </Typography>
          <Typography variant="caption" paragraph sx={{ m: 0 }}>
            [Email],[Risk File Hazard ID],[expert|analist|analist_2]
          </Typography>
          <Typography variant="caption">...</Typography>
        </pre>
        <TextField
          multiline
          fullWidth
          minRows={5}
          maxRows={5}
          value={expertsCSV}
          onChange={(e) => setExpertsCSV(e.target.value)}
        />
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <LoadingButton onClick={handleUploadExperts} loading={false}>
            Upload
          </LoadingButton>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default function ExpertManagementPage() {
  const api = useAPI();

  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [experts, setExperts] = useState<SelectableExpert[] | null>(null);
  const [filteredExperts, setFilteredExperts] = useState<SelectableExpert[] | null>(null);

  // Get all participation records from O365 dataverse
  const { reloadData } = useRecords<SelectableExpert>({
    table: DataTable.PARTICIPATION,
    query: `$expand=cr4de_contact,cr4de_risk_file`,
    transformResult: (participations: DVParticipation<DVContact, DVRiskFile>[]) => {
      const contacts: { [id: string]: SelectableExpert } = {};

      participations.forEach((p) => {
        if (!contacts[p._cr4de_contact_value]) {
          contacts[p._cr4de_contact_value] = {
            ...p.cr4de_contact,
            participations: [],
            selected: false,
          };
        }

        contacts[p._cr4de_contact_value].participations!.push(p);
      });

      return Object.values(contacts);
    },
    onComplete: async (data) => {
      setExperts(data);
      setFilteredExperts(data);
    },
  });

  const handleInvites = async (experts: SelectableExpert[]) => {
    if (
      window.confirm(
        `Are you sure you wish to send an invitation email to ${experts.length} expert${experts.length > 1 ? "s" : ""}?`
      )
    ) {
      await api.sendInvitationEmail(experts.map((e) => e.contactid));

      await reloadData();
    }
  };

  const handleUpdateFilter = (newFilter: string) => {
    setFilter(newFilter);

    if (!newFilter || !experts) setFilteredExperts(experts);
    else {
      setFilteredExperts(
        experts.filter(
          (e) =>
            e.emailaddress1.toLowerCase().indexOf(newFilter.toLowerCase()) >= 0 ||
            e.firstname.toLowerCase().indexOf(newFilter.toLowerCase()) >= 0 ||
            e.lastname.toLowerCase().indexOf(newFilter.toLowerCase()) >= 0 ||
            e.participations.some(
              (p) => p.cr4de_risk_file.cr4de_title.toLowerCase().indexOf(newFilter.toLowerCase()) >= 0
            )
        )
      );
    }
  };

  return (
    <>
      <Container sx={{ mb: 8 }}>
        <Box mt={5}>
          <Typography variant="body1" my={2}></Typography>
        </Box>

        {experts && <ParticipantInput experts={experts} onFinishUpload={() => reloadData()} />}

        {filteredExperts && (
          <ExpertsTable
            experts={filteredExperts}
            setExperts={setFilteredExperts}
            filter={filter || ""}
            setFilter={handleUpdateFilter}
            onInvite={handleInvites}
          />
        )}
      </Container>
    </>
  );
}
