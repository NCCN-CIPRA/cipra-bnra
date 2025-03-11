import React, { useEffect, useState } from "react";
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
import useAPI from "../../hooks/useAPI";
import { LoadingButton } from "@mui/lab";
import { DVContact } from "../../types/dataverse/DVContact";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import Delete from "@mui/icons-material/Delete";
import { DVInvitation } from "../../types/dataverse/DVInvitation";
import { useDifferentDebounce as useDebounce } from "../../hooks/useDebounce";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useOutletContext } from "react-router-dom";
import { AuthPageContext } from "../AuthPage";

interface SelectableContact
  extends DVContact<DVParticipation<undefined, DVRiskFile>[], DVInvitation[]> {
  selected: boolean;
}

const SPECIAL_FILTERS = {
  MY_RISK_FILES: "%%_MY_RISK_FILES_%%",
  EXPERTS_ONLY: "%%_EXPERTS_ONLY_%%",
  REGISTERED_ONLY: "%%_REGISTERED_ONLY_%%",
  UNREGISTERED_ONLY: "%%_UNREGISTERED_ONLY_%%",
  REMINDER: "%%_REMINDER_%%",
};

const dayDifference = (d1: Date, d2: Date) => {
  const difference = d2.getTime() - d1.getTime();

  return Math.ceil(difference / (1000 * 3600 * 24));
};

const ParticipationStepper = ({
  contact,
  participation,
}: {
  contact: SelectableContact;
  participation: DVParticipation<undefined, DVRiskFile>;
}) => {
  let activeStep = 0;

  if (contact.msdyn_portaltermsagreementdate !== null) activeStep++;
  if (participation.cr4de_validation_finished) activeStep++;

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ width: "550px" }}>
      <Step completed={activeStep > 0}>
        <Tooltip
          title={
            activeStep > 0
              ? `The expert has registered their account on ${contact.msdyn_portaltermsagreementdate}`
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
              title={
                activeStep > 2
                  ? "The expert has finished step 2A"
                  : "The expert has not yet finished step 2A"
              }
            >
              <StepLabel icon={"2A"}></StepLabel>
            </Tooltip>
          </Step>
          <Step completed={activeStep > 3}>
            <Tooltip
              title={
                activeStep > 3
                  ? "The expert has finished step 2B"
                  : "The expert has not yet finished step 2B"
              }
            >
              <StepLabel icon={"2B"}></StepLabel>
            </Tooltip>
          </Step>
        </>
      ) : (
        <>
          <Step completed={activeStep > 2}>
            <Tooltip
              title={
                activeStep > 2
                  ? "The expert has finished step 2"
                  : "The expert has not yet finished step 2"
              }
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

const ExpertFilter = ({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: (f: string) => void;
}) => {
  const [displayFilter, debouncedFilter, setDebouncedFilter] = useDebounce(
    filter,
    1000
  );

  useEffect(() => {
    setFilter(debouncedFilter);
  }, [debouncedFilter]);

  return (
    <TextField
      id="standard-basic"
      placeholder="Filter expert name or risk file"
      variant="standard"
      fullWidth
      value={displayFilter}
      onChange={(e) => setDebouncedFilter(e.target.value)}
    />
  );
};

const ExpertsTable = ({
  experts,
  setExperts,
  filter,
  specialFilter,
  setFilter,
  setSpecialFilter,
  onInvite,
  onRemove,
}: {
  experts: SelectableContact[];
  setExperts: (newExperts: SelectableContact[]) => void;
  filter: string;
  specialFilter: string | null;
  setFilter: (filter: string) => void;
  setSpecialFilter: (filter: string | null) => void;
  onInvite: (t: SelectableContact[]) => Promise<void>;
  onRemove: (participationId: string) => Promise<void>;
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

  const selectExpert = (selectedExpert: SelectableContact) => {
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
            <TableCell sx={{ minWidth: "300px" }}>
              <ExpertFilter filter={filter} setFilter={setFilter} />
            </TableCell>
            <TableCell width="100%">
              <Tooltip title="Show only experts for your risk files">
                <IconButton
                  color={
                    specialFilter === SPECIAL_FILTERS.MY_RISK_FILES
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    specialFilter === SPECIAL_FILTERS.MY_RISK_FILES
                      ? setSpecialFilter(null)
                      : setSpecialFilter(SPECIAL_FILTERS.MY_RISK_FILES)
                  }
                >
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Show only experts">
                <IconButton
                  color={
                    specialFilter === SPECIAL_FILTERS.EXPERTS_ONLY
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    specialFilter === SPECIAL_FILTERS.EXPERTS_ONLY
                      ? setSpecialFilter(null)
                      : setSpecialFilter(SPECIAL_FILTERS.EXPERTS_ONLY)
                  }
                >
                  <AcUnitIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Show only registered experts">
                <IconButton
                  color={
                    specialFilter === SPECIAL_FILTERS.REGISTERED_ONLY
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    specialFilter === SPECIAL_FILTERS.REGISTERED_ONLY
                      ? setSpecialFilter(null)
                      : setSpecialFilter(SPECIAL_FILTERS.REGISTERED_ONLY)
                  }
                >
                  <HowToRegIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Show only NOT registered experts">
                <IconButton
                  color={
                    specialFilter === SPECIAL_FILTERS.UNREGISTERED_ONLY
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    specialFilter === SPECIAL_FILTERS.UNREGISTERED_ONLY
                      ? setSpecialFilter(null)
                      : setSpecialFilter(SPECIAL_FILTERS.UNREGISTERED_ONLY)
                  }
                >
                  <PersonSearchIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Show experts in need of a reminder">
                <IconButton
                  color={
                    specialFilter === SPECIAL_FILTERS.REMINDER
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() =>
                    specialFilter === SPECIAL_FILTERS.REMINDER
                      ? setSpecialFilter(null)
                      : setSpecialFilter(SPECIAL_FILTERS.REMINDER)
                  }
                >
                  <WarningAmberIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell sx={{ textAlign: "right" }}>
              <Tooltip title="Send an invitation email to all selected expert so they can register on the BNRA application">
                <IconButton
                  onClick={() => onInvite(experts.filter((e) => e.selected))}
                >
                  <ContactMailIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={100}
              component="td"
              scope="row"
              sx={{ p: 1, backgroundColor: "#eee" }}
            ></TableCell>
          </TableRow>
          {experts &&
            experts.map((e) => (
              <React.Fragment key={e.emailaddress1}>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={e.selected}
                      onChange={() => selectExpert(e)}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ fontWeight: "bold" }}
                    colSpan={2}
                  >
                    {e.firstname} {e.lastname} ({e.emailaddress1})
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <Tooltip title="Send an invitation email to this expert so they can register on the BNRA application">
                      <IconButton onClick={() => onInvite([e])}>
                        <ContactMailIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                {e.participations
                  .sort((a, b) =>
                    a.cr4de_risk_file.cr4de_hazard_id.localeCompare(
                      b.cr4de_risk_file.cr4de_hazard_id
                    )
                  )
                  .map((p) => {
                    if (p.cr4de_role === "expert") {
                      return (
                        <TableRow
                          key={`${e.emailaddress1}_${p.cr4de_risk_file.cr4de_riskfilesid}_${p.cr4de_role}`}
                        >
                          <TableCell></TableCell>
                          <TableCell
                            component="td"
                            scope="row"
                            sx={{ p: 1, pl: 4 }}
                          >
                            {p.cr4de_risk_file.cr4de_hazard_id}{" "}
                            {p.cr4de_risk_file.cr4de_title}
                          </TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            <ParticipationStepper
                              contact={e}
                              participation={p}
                            />
                          </TableCell>
                          <TableCell sx={{ width: 30 }}>
                            <IconButton
                              onClick={() =>
                                onRemove(p.cr4de_bnraparticipationid)
                              }
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    } else {
                      return (
                        <TableRow
                          key={`${e.emailaddress1}_${p.cr4de_risk_file.cr4de_riskfilesid}_${p.cr4de_role}`}
                        >
                          <TableCell></TableCell>
                          <TableCell
                            component="td"
                            scope="row"
                            sx={{ p: 1, pl: 4 }}
                          >
                            {p.cr4de_risk_file.cr4de_hazard_id}{" "}
                            {p.cr4de_risk_file.cr4de_title}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            <Typography variant="body1">
                              {p.cr4de_role === "analist"
                                ? "Author"
                                : "Co-Author"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ width: 30 }}>
                            <IconButton
                              onClick={() =>
                                onRemove(p.cr4de_bnraparticipationid)
                              }
                            >
                              <Delete />
                            </IconButton>
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
              </React.Fragment>
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
  experts: SelectableContact[];
  onFinishUpload: () => Promise<void>;
}) => {
  const api = useAPI();

  const [isLoading, setIsLoading] = useState(false);
  const [expertsCSV, setExpertsCSV] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any[] | null>(null);

  const handleUploadExperts = async () => {
    setIsLoading(true);

    const delimiter = expertsCSV.indexOf(";") >= 0 ? ";" : ",";

    const contacts = await api.getContacts("$select=emailaddress1");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const missingContacts: any[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const expertData: { [email: string]: any } = expertsCSV
      .split("\n")
      .map((l) => {
        const [email, hazardId, role] = l.split(delimiter);

        return { email, hazardId, role };
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((acc: any, e) => {
        if (!acc[e.email]) {
          acc[e.email] = {};
        }

        if (!acc[e.email].participations) {
          acc[e.email].participations = [];
        }

        const existingContact = contacts?.find(
          (c) => c.emailaddress1 === e.email.toLowerCase()
        );
        const existingParticipation = experts?.find(
          (expert) => expert.emailaddress1 === e.email.toLowerCase()
        );

        if (!existingContact) {
          missingContacts.push(e);

          return acc;
        } else {
          acc[e.email].contact = existingContact;
        }

        if (
          existingParticipation?.participations.some(
            (p) => p.cr4de_risk_file.cr4de_hazard_id === e.hazardId
          )
        ) {
          return acc;
        }

        acc[e.email].participations.push({
          hazardId: e.hazardId,
          role: e.role,
        });

        return acc;
      }, {});

    for (const expert of Object.values(expertData)) {
      for (const p of expert.participations) {
        const riskFile = await api.getRiskFiles(
          `$filter=cr4de_hazard_id eq '${p.hazardId}'`
        );

        if (riskFile?.length > 0) {
          await api.createParticipant({
            "cr4de_contact@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${expert.contact.contactid})`,
            cr4de_role: p.role,
            "cr4de_risk_file@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile[0].cr4de_riskfilesid})`,
          });
        }
      }
    }

    await onFinishUpload();

    if (missingContacts.length > 0) {
      setErrors(missingContacts);
    } else {
      setErrors(null);
    }

    setIsLoading(false);
  };

  // const handleFixExperts = async () => {
  //   const contacts = await api.getContacts(
  //     "$select=emailaddress1&$filter=_ownerid_value ne '412a1781-de11-ea11-a816-000d3aba9502'"
  //   );

  //   for (let expert of contacts) {
  //     // const existingParticipation = experts?.find(
  //     //   (e) => e.emailaddress1.toLowerCase() === expert.emailaddress1.toLowerCase()
  //     // );

  //     // if (existingParticipation) {
  //     // await api.deleteContact(expert.contactid);

  //     console.log(expert.emailaddress1);
  //     // }
  //   }
  // };

  return (
    <Accordion sx={{ mb: 4 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
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
        {errors && (
          <Box sx={{ mb: 2, ml: 2 }}>
            <Typography variant="caption" color="error" paragraph>
              Could not find contact data for:
            </Typography>

            {errors.map((c) => (
              <Typography
                key={c.email}
                variant="caption"
                color="error"
                paragraph
                sx={{ m: 0 }}
              >
                {c.email}
              </Typography>
            ))}
          </Box>
        )}
        <TextField
          multiline
          fullWidth
          minRows={5}
          maxRows={5}
          value={expertsCSV}
          onChange={(e) => setExpertsCSV(e.target.value)}
        />
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <LoadingButton onClick={handleUploadExperts} loading={isLoading}>
            Upload
          </LoadingButton>
          {/* <LoadingButton color="warning" onClick={handleFixExperts} loading={isLoading}>
            Fix Unassigned Contacts
          </LoadingButton> */}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default function ExpertManagementPage() {
  const api = useAPI();
  const { user } = useOutletContext<AuthPageContext>();

  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [specialFilter, setSpecialFilter] = useState<string | null>(null);
  const [contacts, setContacts] = useState<SelectableContact[] | null>(null);
  const [filteredContacts, setFilteredContacts] = useState<
    SelectableContact[] | null
  >(null);

  const reloadData = async () => {
    setIsLoading(true);

    const [rawContacts, invitations, participations] = await Promise.all([
      api.getContacts(),
      api.getInvitations(),
      api.getParticipants<DVParticipation<undefined, DVRiskFile>>(
        "$expand=cr4de_risk_file($select=cr4de_hazard_id,cr4de_title)"
      ),
    ]);

    const invitationsDict = invitations.reduce(
      (acc: { [key: string]: DVInvitation[] }, i) => {
        if (!acc[i._adx_invitecontact_value])
          acc[i._adx_invitecontact_value] = [];

        acc[i._adx_invitecontact_value].push(i);

        return acc;
      },
      {}
    );
    const participationsDict = participations.reduce(
      (acc: { [key: string]: DVParticipation<undefined, DVRiskFile>[] }, p) => {
        if (!acc[p._cr4de_contact_value]) acc[p._cr4de_contact_value] = [];

        acc[p._cr4de_contact_value].push(p);

        return acc;
      },
      {}
    );

    const selectableContacts = rawContacts.map((c) => ({
      ...c,
      selected: false,
      invitations: invitationsDict[c.contactid],
      participations: participationsDict[c.contactid] || [],
    }));

    setContacts(selectableContacts);
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Get all participation records from O365 dataverse
  // const { reloadData } = useRecords<SelectableExpert>({
  //   table: DataTable.PARTICIPATION,
  //   query: `$expand=cr4de_contact($select=emailaddress1,firstname,lastname,msdyn_portaltermsagreementdate),cr4de_risk_file($select=cr4de_hazard_id,cr4de_title)`,
  //   transformResult: (participations: DVParticipation<DVContact, DVRiskFile>[]) => {
  //     const contacts: { [id: string]: SelectableExpert } = {};

  //     participations.forEach((p) => {
  //       if (!contacts[p._cr4de_contact_value]) {
  //         contacts[p._cr4de_contact_value] = {
  //           ...p.cr4de_contact,
  //           participations: [],
  //           selected: false,
  //         };
  //       }

  //       contacts[p._cr4de_contact_value].participations!.push(p);
  //     });

  //     return Object.values(contacts);
  //   },
  //   onComplete: async (data) => {
  //     setExperts(data);
  //     setFilteredExperts(data);
  //   },
  // });

  const handleInvites = async (experts: SelectableContact[]) => {
    if (
      window.confirm(
        `Are you sure you wish to send an invitation email to ${
          experts.length
        } expert${experts.length > 1 ? "s" : ""}?`
      )
    ) {
      await api.sendInvitationEmail(experts.map((e) => e.contactid));

      await reloadData();
    }
  };

  const applyFilters = () => {
    if (!contacts) setFilteredContacts(contacts);
    else if (!filter && !specialFilter) setFilteredContacts(contacts);
    else {
      const normalFilteredContacts = filter
        ? contacts.filter(
            (e) =>
              e.emailaddress1.toLowerCase().indexOf(filter.toLowerCase()) >=
                0 ||
              (e.firstname &&
                e.firstname.toLowerCase().indexOf(filter.toLowerCase()) >= 0) ||
              (e.lastname &&
                e.lastname.toLowerCase().indexOf(filter.toLowerCase()) >= 0) ||
              e.participations.some(
                (p) =>
                  p.cr4de_risk_file.cr4de_title
                    .toLowerCase()
                    .indexOf(filter.toLowerCase()) >= 0
              )
          )
        : contacts;

      switch (specialFilter) {
        case SPECIAL_FILTERS.MY_RISK_FILES: {
          const me = contacts.find(
            (c) => c.emailaddress1 === user?.emailaddress1
          );
          const myRiskFiles = me?.participations.filter(
            (p) => p.cr4de_role !== "expert"
          );

          setFilteredContacts(
            normalFilteredContacts
              .filter((c) =>
                c.participations.some((p) =>
                  myRiskFiles?.some(
                    (rf) =>
                      p.cr4de_role === "expert" &&
                      rf._cr4de_risk_file_value === p._cr4de_risk_file_value
                  )
                )
              )
              .map((c) => ({
                ...c,
                participations: c.participations.filter((p) =>
                  myRiskFiles?.some(
                    (rf) =>
                      p.cr4de_role === "expert" &&
                      rf._cr4de_risk_file_value === p._cr4de_risk_file_value
                  )
                ),
              }))
          );

          break;
        }
        case SPECIAL_FILTERS.EXPERTS_ONLY:
          setFilteredContacts(
            normalFilteredContacts
              .filter((c) =>
                c.participations.some((p) => p.cr4de_role === "expert")
              )
              .map((c) => ({
                ...c,
                participations: c.participations.filter(
                  (p) => p.cr4de_role === "expert"
                ),
              }))
          );
          break;
        case SPECIAL_FILTERS.REGISTERED_ONLY:
          setFilteredContacts(
            normalFilteredContacts
              .filter(
                (c) =>
                  c.msdyn_portaltermsagreementdate !== null &&
                  c.participations.some((p) => p.cr4de_role === "expert")
              )
              .map((c) => ({
                ...c,
                participations: c.participations.filter(
                  (p) => p.cr4de_role === "expert"
                ),
              }))
          );
          break;
        case SPECIAL_FILTERS.UNREGISTERED_ONLY:
          setFilteredContacts(
            normalFilteredContacts
              .filter(
                (c) =>
                  c.msdyn_portaltermsagreementdate === null &&
                  c.participations.some((p) => p.cr4de_role === "expert")
              )
              .map((c) => ({
                ...c,
                participations: c.participations.filter(
                  (p) => p.cr4de_role === "expert"
                ),
              }))
          );
          break;
        case SPECIAL_FILTERS.REMINDER: {
          const today = new Date();

          setFilteredContacts(
            normalFilteredContacts.filter((c) =>
              // c.msdyn_portaltermsagreementdate === null &&
              c.invitations?.some(
                (i) =>
                  i.cr4de_laatstverzonden !== null &&
                  dayDifference(new Date(i.cr4de_laatstverzonden), today) > 2
              )
            )
          );
          break;
        }
        default:
          setFilteredContacts(normalFilteredContacts);
      }
    }
  };

  useEffect(() => {
    applyFilters();

    setIsLoading(false);
  }, [contacts, filter, specialFilter]);

  const handleRemove = async (participationId: string) => {
    if (window.confirm("Are you sure you wish to delete this participation?")) {
      await api.deleteParticipant(participationId);

      await reloadData();
    }
  };

  return (
    <>
      <Container sx={{ mb: 8 }}>
        <Box mt={5}>
          <Typography variant="body1" my={2}></Typography>
        </Box>

        {isLoading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="primary" />
          </Backdrop>
        )}

        {contacts && (
          <ParticipantInput
            experts={contacts}
            onFinishUpload={() => reloadData()}
          />
        )}

        {filteredContacts && (
          <ExpertsTable
            experts={filteredContacts}
            setExperts={setFilteredContacts}
            filter={filter || ""}
            specialFilter={specialFilter}
            setFilter={setFilter}
            setSpecialFilter={setSpecialFilter}
            onInvite={handleInvites}
            onRemove={handleRemove}
          />
        )}
      </Container>
    </>
  );
}
