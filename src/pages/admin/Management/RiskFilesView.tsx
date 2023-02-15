import { useEffect, useState } from "react";
import { SelectableContact, SelectableRiskFile } from "./Selectables";
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
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import RiskFileListItem from "./RiskFileListItem";
import ContactFilterField from "./ContactFilterField";

const SPECIAL_FILTERS = {
  MY_RISK_FILES: false,
  EXPERTS_ONLY: false,
  REGISTERED_ONLY: false,
  REMINDER: false,
  DONE_1: false,
  DONE_2: false,
  DONE_3: false,
};

export default function RiskFilesView({
  riskFiles,
  allSelected,
  sendInvitationEmails,
  reloadData,
  selectRiskFile,
  selectAll,
}: {
  riskFiles: SelectableRiskFile[];
  allSelected: boolean;
  sendInvitationEmails: (contacts: SelectableContact[]) => Promise<void>;
  reloadData: () => Promise<void>;
  selectRiskFile: (rf: SelectableRiskFile) => void;
  selectAll: (reset?: boolean) => void;
}) {
  const { user } = useLoggedInUser();

  const [isLoading, setIsLoading] = useState(false);
  const [filteredRiskFiles, setFilteredRiskFiles] = useState<SelectableRiskFile[]>(riskFiles);
  const [filter, setFilter] = useState<string | null>(null);
  const [specialFilters, setSpecialFilters] = useState({
    ...SPECIAL_FILTERS,
    ...JSON.parse(localStorage.getItem("BNRA_RiskFile_Filters") || "{}"),
  });

  const applyFilters = () => {
    if (!riskFiles) return setFilteredRiskFiles(riskFiles);

    let runningFilter = [...riskFiles];

    if (filter) {
      runningFilter = runningFilter.filter(
        (r) =>
          r.cr4de_title.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
          r.participants.some(
            (p) =>
              p.cr4de_contact.emailaddress1.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
              (p.cr4de_contact.firstname &&
                p.cr4de_contact.firstname.toLowerCase().indexOf(filter.toLowerCase()) >= 0) ||
              (p.cr4de_contact.lastname && p.cr4de_contact.lastname.toLowerCase().indexOf(filter.toLowerCase()) >= 0)
          )
      );
    }

    if (specialFilters.MY_RISK_FILES) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.some((p) => p.cr4de_contact.emailaddress1 === user?.emailaddress1)
      );
    }

    if (specialFilters.EXPERTS_ONLY) {
      runningFilter = runningFilter.map((rf) => ({
        ...rf,
        participants: rf.participants.filter((p) => p.cr4de_role === "expert"),
      }));
    }

    if (specialFilters.REGISTERED_ONLY) {
      runningFilter = runningFilter.map((rf) => ({
        ...rf,
        participants: rf.participants.filter(
          (p) => p.cr4de_contact.msdyn_portaltermsagreementdate !== null || p.cr4de_contact.admin
        ),
      }));
    }

    setFilteredRiskFiles(runningFilter);
  };

  useEffect(() => {
    localStorage.setItem("BNRA_RiskFile_Filters", JSON.stringify(specialFilters));
  }, [specialFilters]);

  useEffect(() => {
    applyFilters();
  }, [filter, specialFilters, riskFiles]);

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
        // secondaryAction={
        //   isLoading ? (
        //     <CircularProgress size={20} />
        //   ) : (
        //     <Tooltip title="Actions for all selected contacts">
        //       <IconButton
        //         aria-label="more"
        //         id="long-button"
        //         aria-controls={menuOpen ? "long-menu" : undefined}
        //         aria-expanded={menuOpen ? "true" : undefined}
        //         aria-haspopup="true"
        //         onClick={handleOpenMenu}
        //         sx={{ alignSelf: "flex-start" }}
        //       >
        //         <MoreVertIcon />
        //       </IconButton>
        //     </Tooltip>
        //   )
        // }
      >
        <Tooltip title="Select all">
          <ListItemIcon sx={{ alignSelf: "flex-start" }}>
            <Checkbox edge="start" checked={allSelected} tabIndex={-1} disableRipple onClick={() => selectAll()} />
          </ListItemIcon>
        </Tooltip>
        <Stack direction="column" sx={{ width: "100%", mr: 4 }}>
          <ContactFilterField filter={filter || ""} setFilter={setFilter} />
          <Grid container sx={{ mt: 1 }} rowGap={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.MY_RISK_FILES} />}
                label="Show my risk files only"
                onClick={() => toggleSpecialFilter("MY_RISK_FILES")}
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
          </Grid>
        </Stack>
      </ListItem>
      <Virtuoso
        useWindowScroll
        data={filteredRiskFiles}
        itemContent={(index, riskFile) => <RiskFileListItem riskFile={riskFile} selectRiskFile={selectRiskFile} />}
      />

      {/* <Menu
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
        <MenuItem onClick={() => sendInvitationEmails(filteredContacts.filter((c) => c.selected))}>
          Send Invitations Emails
        </MenuItem>
      </Menu> */}
    </>
  );
}
