import { List, Container, Box, Paper, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import useAPI from "../../../hooks/useAPI";
import { DVInvitation } from "../../../types/dataverse/DVInvitation";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { SelectableContact, SelectableRiskFile } from "./Selectables";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ContactsView from "./ContactsView";
import RiskFilesView from "./RiskFilesView";
import usePageTitle from "../../../hooks/usePageTitle";
import useBreadcrumbs from "../../../hooks/useBreadcrumbs";
import GraphView from "./GraphView";
import { DVValidation } from "../../../types/dataverse/DVValidation";
import PrioritiesView from "./PrioritiesView";
import { DVDirectAnalysis } from "../../../types/dataverse/DVDirectAnalysis";

export default function ProcessManagementPage() {
  const api = useAPI();

  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("riskFiles");
  const [contacts, setContacts] = useState<SelectableContact[] | null>(null);
  const [riskFiles, setRiskFiles] = useState<SelectableRiskFile[] | null>(null);
  const [participations, setParticipations] = useState<
    | DVParticipation<
        SelectableContact,
        DVRiskFile,
        DVValidation,
        DVDirectAnalysis
      >[]
    | null
  >(null);
  const [allSelected, setAllSelected] = useState(false);

  const reloadData = async () => {
    setIsLoading(true);

    const [rawContacts, invitations, participations] = await Promise.all([
      api.getContacts(),
      api.getInvitations(),
      api.getParticipants<
        DVParticipation<undefined, DVRiskFile, DVValidation, DVDirectAnalysis>
      >("$expand=cr4de_risk_file,cr4de_validation,cr4de_direct_analysis"),
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
      (
        acc: {
          [key: string]: DVParticipation<
            undefined,
            DVRiskFile,
            DVValidation,
            DVDirectAnalysis
          >[];
        },
        p
      ) => {
        if (!acc[p._cr4de_contact_value]) acc[p._cr4de_contact_value] = [];

        acc[p._cr4de_contact_value].push(p);

        return acc;
      },
      {}
    );
    const participationsRFDict = participations.reduce(
      (
        acc: {
          [key: string]: DVParticipation<
            undefined,
            DVRiskFile,
            DVValidation,
            DVDirectAnalysis
          >[];
        },
        p
      ) => {
        if (!p._cr4de_risk_file_value) return acc;

        if (!acc[p._cr4de_risk_file_value]) acc[p._cr4de_risk_file_value] = [];

        acc[p._cr4de_risk_file_value].push(p);

        return acc;
      },
      {}
    );

    const selectableContacts: SelectableContact[] = rawContacts.map((c) => ({
      ...c,
      selected: false,
      invitations: invitationsDict[c.contactid],
      participations: participationsDict[c.contactid] || [],
    }));

    const selectableContactsDict = selectableContacts.reduce(
      (acc: { [key: string]: SelectableContact }, el) => {
        return { ...acc, [el.contactid]: el };
      },
      {}
    );

    const selectableRiskFiles: SelectableRiskFile[] = Object.keys(
      participationsRFDict
    ).map((rfId) => ({
      ...participationsRFDict[rfId][0].cr4de_risk_file,
      selected: false,
      participants: participationsRFDict[rfId].map((p) => ({
        ...p,
        cr4de_contact: selectableContactsDict[p._cr4de_contact_value],
      })),
    }));

    setContacts(selectableContacts);
    setRiskFiles(selectableRiskFiles);
    setParticipations(
      participations.map((p) => ({
        ...p,
        cr4de_contact: selectableContactsDict[p._cr4de_contact_value],
      }))
    );
  };

  const sendInvitationEmails = async (contact: SelectableContact[]) => {
    if (
      window.confirm(
        `Are you sure you wish to send an invitation email to ${
          contact.length
        } expert${contact.length > 1 ? "s" : ""}?`
      )
    ) {
      await api.sendInvitationEmail(contact.map((c) => c.contactid));

      await reloadData();
    }
  };

  const selectAll = (reset?: boolean) => {
    if (allSelected || reset) {
      setAllSelected(false);
      if (currentTab === "contacts") {
        setContacts(
          contacts?.map((e) => ({
            ...e,
            selected: false,
          })) || null
        );
      } else {
        setRiskFiles(
          riskFiles?.map((e) => ({
            ...e,
            selected: false,
          })) || null
        );
      }
    } else {
      setAllSelected(true);
      if (currentTab === "contacts") {
        setContacts(
          contacts?.map((e) => ({
            ...e,
            selected: true,
          })) || null
        );
      } else {
        setRiskFiles(
          riskFiles?.map((e) => ({
            ...e,
            selected: true,
          })) || null
        );
      }
    }
  };

  const selectContact = (selectedContact: SelectableContact) => {
    setAllSelected(false);

    if (!contacts) return;

    setContacts(
      contacts.map((c) => {
        if (c.contactid !== selectedContact.contactid) return c;

        return {
          ...c,
          selected: !c.selected,
        };
      })
    );
  };

  const selectRiskFile = (selectedRiskFile: SelectableRiskFile) => {
    setAllSelected(false);
    if (!riskFiles) return;

    setRiskFiles(
      riskFiles.map((rf) => {
        if (rf.cr4de_riskfilesid !== selectedRiskFile.cr4de_riskfilesid)
          return rf;

        return {
          ...rf,
          selected: !rf.selected,
        };
      })
    );
  };

  const changeTab = (e: unknown, value: string) => {
    selectAll(true);

    setCurrentTab(value);
  };

  useEffect(() => {
    if ((!contacts || !riskFiles) && !isLoading) reloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  usePageTitle("BNRA 2023 - 2026 Process Management");
  useBreadcrumbs([
    { name: "BNRA 2023 - 2026", url: "/" },
    { name: "Process Management", url: "/admin/process" },
  ]);

  // const expertsCSV = useMemo(() => {
  //   if (!riskFiles) return null;

  //   return riskFiles
  //     .map((rf) => {
  //       let s = `${rf.cr4de_hazard_id},${rf.cr4de_title}\n`;

  //       s += rf.participants
  //         .filter((p) => p.cr4de_contact.emailaddress1.indexOf("nccn.fgov.be") < 0)
  //         .map(
  //           (p) =>
  //             `,${p.cr4de_contact.firstname} ${p.cr4de_contact.lastname}, ${p.cr4de_contact.emailaddress1}, ${
  //               p.cr4de_validation_finished ? "-" : "Validation Finished"
  //             }, ${p.cr4de_direct_analysis_finished ? "-" : "Step 2A Finished"}, ${
  //               p.cr4de_cascade_analysis_finished ? "-" : "Step 2B Finished"
  //             }`
  //         )
  //         .join("\n");

  //       return s;
  //     })
  //     .join("\n");
  // }, [riskFiles]);

  // console.log(expertsCSV);

  return (
    <Container sx={{ mb: 8, mt: 4 }}>
      <Box sx={{ width: "100%" }} component={Paper}>
        <TabContext value={currentTab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={changeTab} aria-label="lab API tabs example">
              <Tab label="Group By Contact" value="contacts" />
              <Tab label="Group By Risk File" value="riskFiles" />
              <Tab label="Lovely Graphs" value="graphs" />
              <Tab label="Consensus Meeting Priorities" value="priorities" />
            </TabList>
          </Box>
          <TabPanel value="contacts">
            <List dense>
              {contacts ? (
                <ContactsView
                  contacts={contacts}
                  allSelected={allSelected}
                  sendInvitationEmails={sendInvitationEmails}
                  reloadData={reloadData}
                  selectContact={selectContact}
                  selectAll={selectAll}
                />
              ) : (
                <Box sx={{ m: 4, textAlign: "center" }}>
                  <CircularProgress />
                </Box>
              )}
            </List>
          </TabPanel>
          <TabPanel value="riskFiles">
            <List dense>
              {riskFiles ? (
                <RiskFilesView
                  riskFiles={riskFiles}
                  allSelected={allSelected}
                  sendInvitationEmails={sendInvitationEmails}
                  reloadData={reloadData}
                  selectRiskFile={selectRiskFile}
                  selectAll={selectAll}
                />
              ) : (
                <Box sx={{ m: 4, textAlign: "center" }}>
                  <CircularProgress />
                </Box>
              )}
            </List>
          </TabPanel>
          <TabPanel value="graphs">
            <List dense>
              {participations ? (
                <GraphView participations={participations} />
              ) : (
                <Box sx={{ m: 4, textAlign: "center" }}>
                  <CircularProgress />
                </Box>
              )}
            </List>
          </TabPanel>
          <TabPanel value="priorities">
            <List dense>
              {riskFiles ? (
                <PrioritiesView />
              ) : (
                <Box sx={{ m: 4, textAlign: "center" }}>
                  <CircularProgress />
                </Box>
              )}
            </List>
          </TabPanel>
        </TabContext>
      </Box>
    </Container>
  );
}
