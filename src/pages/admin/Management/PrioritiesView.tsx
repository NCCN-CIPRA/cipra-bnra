import { useEffect, useState } from "react";
import { SelectableRiskFile } from "./Selectables";
import { CircularProgress, Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useOutletContext } from "react-router-dom";
import { AuthPageContext } from "../../AuthPage";

const SPECIAL_FILTERS = {
  MY_RISK_FILES: false,
  MY_RISK_FILES_BACKUP: false,
  DONE: false,
  SHOW_TEST: false,
};

interface RiskFile extends SelectableRiskFile {
  causesList: RiskFile[];
  causes: number;
  effectsList: RiskFile[];
  effects: number;
}

const columns: GridColDef[] = [
  { field: "cr4de_hazard_id", headerName: "ID", width: 90 },
  { field: "cr4de_title", headerName: "Title", width: 300 },
  {
    field: "causes",
    headerName: "# Causes",
    width: 90,
    align: "right",
  },
  {
    field: "size",
    headerName: "Size",
    width: 90,
    align: "right",
  },
];

export default function PrioritiesView() {
  const { user } = useOutletContext<AuthPageContext>();

  const [riskFiles] = useState<RiskFile[] | null>(null);
  const [filteredRiskFiles, setFilteredRiskFiles] = useState<RiskFile[] | null>(
    null
  );
  const [filter] = useState<string | null>(null);
  const [specialFilters] = useState({
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
              p.cr4de_contact.emailaddress1
                .toLowerCase()
                .indexOf(filter.toLowerCase()) >= 0 ||
              (p.cr4de_contact.firstname &&
                p.cr4de_contact.firstname
                  .toLowerCase()
                  .indexOf(filter.toLowerCase()) >= 0) ||
              (p.cr4de_contact.lastname &&
                p.cr4de_contact.lastname
                  .toLowerCase()
                  .indexOf(filter.toLowerCase()) >= 0)
          )
      );
    }

    if (specialFilters.MY_RISK_FILES && !specialFilters.MY_RISK_FILES_BACKUP) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.some(
          (p) =>
            p.cr4de_contact.emailaddress1 === user?.emailaddress1 &&
            p.cr4de_role === "analist"
        )
      );
    }

    if (specialFilters.MY_RISK_FILES_BACKUP && !specialFilters.MY_RISK_FILES) {
      runningFilter = runningFilter.filter((rf) =>
        rf.participants.some(
          (p) =>
            p.cr4de_contact.emailaddress1 === user?.emailaddress1 &&
            p.cr4de_role === "analist_2"
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

    if (!specialFilters.SHOW_TEST) {
      runningFilter = runningFilter.filter(
        (rf) => rf.cr4de_title.indexOf("Test") < 0
      );
    }

    setFilteredRiskFiles(runningFilter);
  };

  useEffect(() => {
    localStorage.setItem(
      "BNRA_RiskFile_Filters",
      JSON.stringify(specialFilters)
    );
  }, [specialFilters]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, specialFilters, riskFiles]);

  if (!filteredRiskFiles)
    return (
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={filteredRiskFiles}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 59,
            },
          },
        }}
        pageSizeOptions={[59]}
        // checkboxSelection
        autoHeight
        disableRowSelectionOnClick
      />
    </Box>
  );
}
