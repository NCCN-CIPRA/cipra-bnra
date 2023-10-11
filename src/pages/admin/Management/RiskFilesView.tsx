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
  MY_RISK_FILES_BACKUP: false,
  EXPERTS_ONLY: false,
  REGISTERED_ONLY: false,
  DONE_1: false,
  NOT_DONE_1: false,
  NONE_2A: false,
  ONE_2A: false,
  DONE_2A: false,
  NONE_2B: false,
  ONE_2B: false,
  DONE_2B: false,
  PROBLEMATIC: false,
  SHOW_TEST: false,
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

    if (specialFilters.MY_RISK_FILES && !specialFilters.MY_RISK_FILES_BACKUP) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.some((p) => {
          console.log(p);
          return p.cr4de_contact.emailaddress1 === user?.emailaddress1 && p.cr4de_role === "analist";
        })
      );
    }

    if (specialFilters.MY_RISK_FILES_BACKUP && !specialFilters.MY_RISK_FILES) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.some(
          (p) => p.cr4de_contact.emailaddress1 === user?.emailaddress1 && p.cr4de_role === "analist_2"
        )
      );
    }

    if (specialFilters.MY_RISK_FILES && specialFilters.MY_RISK_FILES_BACKUP) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.some(
          (p) =>
            p.cr4de_contact.emailaddress1 === user?.emailaddress1 &&
            (p.cr4de_role === "analist" || p.cr4de_role === "analist_2")
        )
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

    if (specialFilters.DONE_1) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.some((p) => p.cr4de_role === "expert" && p.cr4de_validation_finished)
      );
    }

    if (specialFilters.NONE_2A) {
      runningFilter = runningFilter.filter(
        (rf) => !rf.participants.some((p) => p.cr4de_role === "expert" && p.cr4de_direct_analysis_finished)
      );
    }

    if (specialFilters.ONE_2A) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.some((p) => p.cr4de_role === "expert" && p.cr4de_direct_analysis_finished)
      );
    }

    if (specialFilters.DONE_2A) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.every((p) => p.cr4de_role !== "expert" || p.cr4de_direct_analysis_finished)
      );
    }

    if (specialFilters.NONE_2B) {
      runningFilter = runningFilter.filter(
        (rf) => !rf.participants.some((p) => p.cr4de_role === "expert" && p.cr4de_cascade_analysis_finished)
      );
    }

    if (specialFilters.ONE_2B) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.some((p) => p.cr4de_role === "expert" && p.cr4de_cascade_analysis_finished)
      );
    }

    if (specialFilters.DONE_2B) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.every((p) => p.cr4de_role !== "expert" || p.cr4de_cascade_analysis_finished)
      );
    }

    if (specialFilters.PROBLEMATIC) {
      runningFilter = runningFilter.filter(
        (rf) => rf.participants.filter((p) => p.cr4de_role === "expert" && p.cr4de_validation_finished).length < 2
      );
    }

    if (!specialFilters.SHOW_TEST) {
      runningFilter = runningFilter.filter((rf) => rf.cr4de_title.indexOf("Test") < 0);
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
          <ContactFilterField filter={filter || ""} setFilter={setFilter} count={filteredRiskFiles.length} />
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
                control={<Checkbox checked={specialFilters.MY_RISK_FILES_BACKUP} />}
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
                control={<Checkbox checked={specialFilters.PROBLEMATIC} />}
                label="Show only problematic risk files"
                onClick={() => toggleSpecialFilter("PROBLEMATIC")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.DONE_1} />}
                label="Show only risk files ready for validation processing"
                onClick={() => toggleSpecialFilter("DONE_1")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.NONE_2A} />}
                label="Step 2A not started"
                onClick={() => toggleSpecialFilter("NONE_2A")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.ONE_2A} />}
                label="Step 2A started (at least 1)"
                onClick={() => toggleSpecialFilter("ONE_2A")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.DONE_2A} />}
                label="Step 2A finished"
                onClick={() => toggleSpecialFilter("DONE_2A")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.NONE_2B} />}
                label="Step 2B not started"
                onClick={() => toggleSpecialFilter("NONE_2B")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.ONE_2B} />}
                label="Step 2B started (at least 1)"
                onClick={() => toggleSpecialFilter("ONE_2B")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.DONE_2B} />}
                label="Step 2B finished"
                onClick={() => toggleSpecialFilter("DONE_2B")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={<Checkbox checked={specialFilters.SHOW_TEST} />}
                label="Show test risks"
                onClick={() => toggleSpecialFilter("SHOW_TEST")}
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
