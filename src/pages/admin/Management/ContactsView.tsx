import { useEffect, useState } from "react";
import {
  Stack,
  ListItem,
  ListItemIcon,
  Checkbox,
  Grid,
  FormControlLabel,
  MenuItem,
  Menu,
  Tooltip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Virtuoso } from "react-virtuoso";
import ContactFilterField from "./ContactFilterField";
import ContactListItem from "./ContactListItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { SelectableContact } from "./Selectables";
import dayDifference from "../../../functions/days";
import { useOutletContext } from "react-router-dom";
import { AuthPageContext } from "../../AuthPage";

const SPECIAL_FILTERS = {
  MY_RISK_FILES: false,
  MY_RISK_FILES_BACKUP: false,
  EXPERTS_ONLY: false,
  REGISTERED_ONLY: false,
  UNINVITED_ONLY: false,
  REMINDER: false,
  DONE_2A: false,
  DONE_2B: false,
};

export default function ContactsView({
  contacts,
  allSelected,
  sendInvitationEmails,
  reloadData,
  selectContact,
  selectAll,
}: {
  contacts: SelectableContact[];
  allSelected: boolean;
  sendInvitationEmails: (c: SelectableContact[]) => Promise<void>;
  reloadData: () => Promise<void>;
  selectContact: (c: SelectableContact) => void;
  selectAll: () => void;
}) {
  const { user } = useOutletContext<AuthPageContext>();

  const [isLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [filteredContacts, setFilteredContacts] =
    useState<SelectableContact[]>(contacts);
  const [filter, setFilter] = useState<string | null>(null);
  const [specialFilters, setSpecialFilters] = useState<typeof SPECIAL_FILTERS>({
    ...SPECIAL_FILTERS,
    ...JSON.parse(localStorage.getItem("BNRA_Contact_Filters") || "{}"),
  });

  const menuOpen = Boolean(menuAnchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const applyFilters = () => {
    if (!contacts) return setFilteredContacts(contacts);

    let runningFilter = [...contacts];

    if (filter) {
      runningFilter = runningFilter.filter(
        (e) =>
          e.emailaddress1.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
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
      );
    }

    if (specialFilters.MY_RISK_FILES) {
      const me = contacts.find((c) => c.emailaddress1 === user?.emailaddress1);
      const myRiskFiles = me?.participations.filter(
        (p) => p.cr4de_role === "analist"
      );

      runningFilter = runningFilter
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
        }));
    }

    if (specialFilters.MY_RISK_FILES_BACKUP) {
      const me = contacts.find((c) => c.emailaddress1 === user?.emailaddress1);
      const myRiskFiles = me?.participations.filter(
        (p) => p.cr4de_role === "analist_2"
      );

      runningFilter = runningFilter
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
        }));
    }

    if (specialFilters.EXPERTS_ONLY) {
      runningFilter = runningFilter
        .map((c) => ({
          ...c,
          participations: c.participations.filter(
            (p) => p.cr4de_role === "expert"
          ),
        }))
        .filter(
          (c) =>
            c.participations.length > 0 &&
            c.emailaddress1.indexOf("nccn.fgov.be") < 0
        );
    }

    if (specialFilters.REGISTERED_ONLY) {
      runningFilter = runningFilter.filter(
        (c) => c.msdyn_portaltermsagreementdate !== null || c.admin
      );
    }

    if (specialFilters.REMINDER) {
      const today = new Date();

      runningFilter = runningFilter.filter((c) =>
        // c.msdyn_portaltermsagreementdate === null &&
        c.invitations?.some(
          (i) =>
            i.cr4de_laatstverzonden !== null &&
            dayDifference(new Date(i.cr4de_laatstverzonden), today) > 2
        )
      );
    }

    if (specialFilters.UNINVITED_ONLY) {
      runningFilter = runningFilter.filter(
        (c) => !c.invitations || c.invitations.length <= 0
      );
    }

    if (specialFilters.DONE_2A) {
      runningFilter = runningFilter
        .map((c) => ({
          ...c,
          participations: c.participations.filter(
            (p) => p.cr4de_direct_analysis_finished
          ),
        }))
        .filter((c) => c.participations.length > 0);
    }

    if (specialFilters.DONE_2B) {
      runningFilter = runningFilter
        .map((c) => ({
          ...c,
          participations: c.participations.filter(
            (p) => p.cr4de_cascade_analysis_finished
          ),
        }))
        .filter((c) => c.participations.length > 0);
    }

    setFilteredContacts(runningFilter);
  };

  useEffect(() => {
    localStorage.setItem(
      "BNRA_Contact_Filters",
      JSON.stringify(specialFilters)
    );
  }, [specialFilters]);

  useEffect(() => {
    applyFilters();
  }, [filter, specialFilters, contacts]);

  const toggleSpecialFilter = (filterName: keyof typeof SPECIAL_FILTERS) => {
    setSpecialFilters({
      ...specialFilters,
      [filterName]: !specialFilters[filterName],
    });
  };

  return (
    <>
      <ListItem
        sx={{ mb: 2 }}
        secondaryAction={
          isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Tooltip title="Actions for all selected contacts">
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={menuOpen ? "long-menu" : undefined}
                aria-expanded={menuOpen ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleOpenMenu}
                sx={{ alignSelf: "flex-start" }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          )
        }
      >
        <Tooltip title="Select all">
          <ListItemIcon sx={{ alignSelf: "flex-start" }}>
            <Checkbox
              edge="start"
              checked={allSelected}
              tabIndex={-1}
              disableRipple
              onClick={() => selectAll()}
            />
          </ListItemIcon>
        </Tooltip>
        <Stack direction="column" sx={{ width: "100%", mr: 4 }}>
          <ContactFilterField
            filter={filter || ""}
            setFilter={setFilter}
            count={filteredContacts.length}
          />
          <Grid container sx={{ mt: 1 }} rowGap={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.MY_RISK_FILES} />}
                label="Show my risk files only (author)"
                onClick={() => toggleSpecialFilter("MY_RISK_FILES")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Checkbox checked={specialFilters.MY_RISK_FILES_BACKUP} />
                }
                label="Show my risk files only (backup)"
                onClick={() => toggleSpecialFilter("MY_RISK_FILES_BACKUP")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.EXPERTS_ONLY} />}
                label="Hide CIPRA analists"
                onClick={() => toggleSpecialFilter("EXPERTS_ONLY")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.REGISTERED_ONLY} />}
                label="Hide unregistered contacts"
                onClick={() => toggleSpecialFilter("REGISTERED_ONLY")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.REMINDER} />}
                label="Show only problematic risk files"
                onClick={() => toggleSpecialFilter("REMINDER")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.UNINVITED_ONLY} />}
                label="Show only uninvited contacts"
                onClick={() => toggleSpecialFilter("UNINVITED_ONLY")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.DONE_2A} />}
                label="Show only step2A finished"
                onClick={() => toggleSpecialFilter("DONE_2A")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.DONE_2B} />}
                label="Show only step 2B finished"
                onClick={() => toggleSpecialFilter("DONE_2B")}
              />
            </Grid>
          </Grid>
        </Stack>
      </ListItem>
      <Virtuoso
        useWindowScroll
        data={filteredContacts}
        itemContent={(index, contact) => (
          <ContactListItem
            index={index}
            contact={contact}
            sendInvitation={sendInvitationEmails}
            reloadData={reloadData}
            selectContact={selectContact}
          />
        )}
      />

      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
          },
        }}
      >
        <MenuItem
          onClick={() =>
            sendInvitationEmails(filteredContacts.filter((c) => c.selected))
          }
        >
          Send Invitations Emails
        </MenuItem>
      </Menu>
    </>
  );
}
