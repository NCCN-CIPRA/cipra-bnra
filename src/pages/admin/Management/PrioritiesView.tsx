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
  Box,
} from "@mui/material";
import { Virtuoso } from "react-virtuoso";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import RiskFileListItem from "./RiskFileListItem";
import ContactFilterField from "./ContactFilterField";
import PrioritiesListItem from "./PrioritiesListItem";
import useRecords from "../../../hooks/useRecords";
import { DataTable } from "../../../hooks/useAPI";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVRiskCascade } from "../../../types/dataverse/DVRiskCascade";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

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

const getSize = (rf: RiskFile) => {
  let size = 0;
  if (rf.cr4de_risk_type === "Standard Risk") size += 18;
  else if (rf.cr4de_risk_type === "Malicious Man-made Risk") {
    size += 3;
    size += 3 * rf.effectsList.length;
  } else {
    size += rf.effectsList.length;
  }
  size += 3 * rf.causesList.length;

  return size;
};

export default function PrioritiesView({ baseRiskFiles }: { baseRiskFiles: SelectableRiskFile[] }) {
  const { user } = useLoggedInUser();

  const [isLoading, setIsLoading] = useState(false);
  const [riskFiles, setRiskFiles] = useState<RiskFile[] | null>(null);
  const [filteredRiskFiles, setFilteredRiskFiles] = useState<RiskFile[] | null>(null);
  const [filter, setFilter] = useState<string | null>(null);
  const [specialFilters, setSpecialFilters] = useState({
    ...SPECIAL_FILTERS,
    ...JSON.parse(localStorage.getItem("BNRA_RiskFile_Filters") || "{}"),
  });

  const { data: cascades } = useRecords({
    table: DataTable.RISK_CASCADE,
    query: "$select=_cr4de_cause_hazard_value,_cr4de_effect_hazard_value",
    onComplete: async (results: DVRiskCascade[]) => {
      const rfDict: { [key: string]: RiskFile } = baseRiskFiles.reduce(
        (acc, el) => ({
          ...acc,
          [el.cr4de_riskfilesid]: {
            ...el,
            causesList: [],
            effectsList: [],
          },
        }),
        {}
      );

      for (let cascade of results) {
        if (rfDict[cascade._cr4de_cause_hazard_value] && rfDict[cascade._cr4de_effect_hazard_value]) {
          rfDict[cascade._cr4de_cause_hazard_value].effectsList.push(rfDict[cascade._cr4de_effect_hazard_value]);
          rfDict[cascade._cr4de_effect_hazard_value].causesList.push(rfDict[cascade._cr4de_cause_hazard_value]);
        }
      }

      setRiskFiles(
        Object.values(rfDict).map((rf) => ({
          ...rf,
          id: rf.cr4de_riskfilesid,
          causes: rf.causesList.length,
          effects: rf.effectsList.length,
          size: getSize(rf),
          causesList: [],
          effectsList: [],
        }))
      );
    },
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
        rf.participants.some((p) => p.cr4de_contact.emailaddress1 === user?.emailaddress1 && p.cr4de_role === "analist")
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
