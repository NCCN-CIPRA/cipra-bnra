import {
  Box,
  CircularProgress,
  Container,
  InputAdornment,
  Menu,
  MenuItem,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import NCCNLoader from "../../components/NCCNLoader";
import { DVContact } from "../../types/dataverse/DVContact";
import { useRef, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DVParticipation } from "../../types/dataverse/DVParticipation";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  DataGrid,
  GridColDef,
  gridFilteredSortedRowIdsSelector,
  gridRowSelectionIdsSelector,
  gridVisibleColumnFieldsSelector,
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  QuickFilterTrigger,
  Toolbar,
  ToolbarButton,
  useGridApiContext,
} from "@mui/x-data-grid";
import useLazyRecords from "../../hooks/useLazyRecords";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as xlsx from "xlsx";
import { saveAs } from "file-saver";
import { ROLE, ROLE_RECORDS, ROLES_REVERSE } from "../../types/Roles";
import KeyIcon from "@mui/icons-material/Key";
import { LoggedInUser } from "../../hooks/useLoggedInUser";

const dateFormatter = new Intl.DateTimeFormat("nl-BE", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
});

const columns: GridColDef<DVContact<DVParticipation[]>>[] = [
  { field: "contactid", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    valueGetter: (_value, row) =>
      `${row.firstname || ""} ${row.lastname || ""}`,
  },
  {
    field: "emailaddress1",
    headerName: "E-mail",
    width: 300,
  },
  {
    field: "adx_organizationname",
    headerName: "Organisation",
    width: 300,
  },
  {
    field: "cr4de_permissions",
    headerName: "Permissions",
    width: 300,
    valueGetter: (_value, row) => {
      if (
        new Date(row.createdon as string) < new Date(2025, 5, 10) ||
        row.emailaddress1.indexOf("nccn.fgov.be") >= 0
      ) {
        return ROLE.READER;
      }
      if (!row.cr4de_permissions) return ROLE.APPROVE;

      const role = ROLES_REVERSE[row.cr4de_permissions];

      if (role === ROLE.READER && row.msdyn_portaltermsagreementdate === null) {
        return ROLE.APPROVED;
      }

      return role;
    },
  },
  {
    field: "participations",
    headerName: "Risk File Participations",
    width: 300,
    valueGetter: (_value, row) => {
      if (row.participations.length <= 0) return null;

      return row.participations
        .map((p) => p._cr4de_risk_file_value)
        .concat(", ");
    },
  },
  {
    field: "createdon",
    headerName: "Created On",
    type: "dateTime",
    width: 200,
    valueFormatter: (v) => dateFormatter.format(v),
    valueGetter: (_value, row) => new Date(row.createdon),
  },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  // },
];

type OwnerState = {
  expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
  display: "grid",
  alignItems: "center",
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: "1 / 1",
    width: "min-content",
    height: "min-content",
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? "none" : "auto",
    transition: theme.transitions.create(["opacity"]),
  })
);

const StyledTextField = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: "1 / 1",
  overflowX: "clip",
  width: ownerState.expanded ? 260 : "var(--trigger-width)",
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(["width", "opacity"]),
}));

function ExportExcel() {
  const apiRef = useGridApiContext();

  return (
    <Tooltip title="Download as Excel">
      <ToolbarButton
        onClick={() => {
          const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
          const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

          // Format the data. Here we only keep the value
          const gridData = filteredSortedRowIds.map((id) => {
            const row: Record<string, unknown> = {};
            visibleColumnsField.forEach((field) => {
              if (field === "__check__") return;
              row[field] = apiRef.current.getCellParams(id, field).value;
            });
            return row;
          });

          const workbook = xlsx.utils.book_new();

          const PSheet = xlsx.utils.json_to_sheet(gridData);
          xlsx.utils.book_append_sheet(workbook, PSheet, `BNRA Users`);

          const excelBuffer = xlsx.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
          });

          saveAs(blob, "BNRA_users.xlsx");
        }}
      >
        <FileDownloadIcon />
      </ToolbarButton>
    </Tooltip>
  );
}

function createCustomToolbar(
  loggedInUser: LoggedInUser,
  updateUsers: () => Promise<unknown>
) {
  return function CustomToolbar() {
    const api = useAPI();
    const apiRef = useGridApiContext();
    const [permissionsMenuOpen, setPermissionsMenuOpen] = useState(false);
    const permissionsMenuTriggerRef = useRef<HTMLButtonElement>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const grantPermissions = async (permissions: ROLE) => {
      setIsUpdating(true);
      const selectedRows = gridRowSelectionIdsSelector(apiRef);

      for (const selectedId of selectedRows) {
        if (
          selectedId[1].msdyn_portaltermsagreementdate !== null &&
          permissions === ROLE.APPROVED
        ) {
          continue;
        }

        await api.updateContact(selectedId[0] as string, {
          "ownerid@odata.bind":
            "/systemusers(412a1781-de11-ea11-a816-000d3aba9502)",
          cr4de_permissions: ROLE_RECORDS[permissions],
        });
        updateUsers();
      }
      setIsUpdating(false);
    };

    return (
      <Toolbar>
        <Tooltip title="Refresh Contacts">
          <ToolbarButton onClick={() => updateUsers()}>
            <RefreshIcon />
          </ToolbarButton>
        </Tooltip>

        <ExportExcel />

        <Tooltip title="Assign Permissions">
          <ToolbarButton
            ref={permissionsMenuTriggerRef}
            id="export-menu-trigger"
            aria-controls="export-menu"
            aria-haspopup="true"
            aria-expanded={permissionsMenuOpen ? "true" : undefined}
            onClick={() => setPermissionsMenuOpen(true)}
          >
            {isUpdating ? <CircularProgress size={20} /> : <KeyIcon />}
          </ToolbarButton>
        </Tooltip>

        <Menu
          id="export-menu"
          anchorEl={permissionsMenuTriggerRef.current}
          open={permissionsMenuOpen}
          onClose={() => setPermissionsMenuOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            list: {
              "aria-labelledby": "export-menu-trigger",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              grantPermissions(ROLE.APPROVED);
              setPermissionsMenuOpen(false);
            }}
          >
            Allow Access
          </MenuItem>
          <MenuItem
            onClick={() => {
              grantPermissions(ROLE.READER);
              setPermissionsMenuOpen(false);
            }}
          >
            Assign Role: Reader
          </MenuItem>
          {loggedInUser.roles.analist && (
            <MenuItem
              onClick={() => {
                grantPermissions(ROLE.ANALIST);
                setPermissionsMenuOpen(false);
              }}
            >
              Assign Role: CIPRA Analist
            </MenuItem>
          )}
          {loggedInUser.roles.analist && (
            <MenuItem
              onClick={() => {
                grantPermissions(ROLE.GLOBAL_ADMIN);
                setPermissionsMenuOpen(false);
              }}
            >
              Assign Role: Global Admin
            </MenuItem>
          )}
        </Menu>

        <StyledQuickFilter>
          <QuickFilterTrigger
            render={(triggerProps, state) => (
              <Tooltip title="Search" enterDelay={0}>
                <StyledToolbarButton
                  {...triggerProps}
                  ownerState={{ expanded: state.expanded }}
                  color="default"
                  aria-disabled={state.expanded}
                >
                  <SearchIcon fontSize="small" />
                </StyledToolbarButton>
              </Tooltip>
            )}
          />
          <QuickFilterControl
            render={({ ref, ...controlProps }, state) => (
              <StyledTextField
                {...controlProps}
                ownerState={{ expanded: state.expanded }}
                inputRef={ref}
                aria-label="Search"
                placeholder="Search..."
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: state.value ? (
                      <InputAdornment position="end">
                        <QuickFilterClear
                          edge="end"
                          size="small"
                          aria-label="Clear search"
                          // material={{ sx: { mr: -0.75 } }}
                        >
                          <CancelIcon fontSize="small" />
                        </QuickFilterClear>
                      </InputAdornment>
                    ) : null,
                    ...controlProps.slotProps?.input,
                  },
                  ...controlProps.slotProps,
                }}
              />
            )}
          />
        </StyledQuickFilter>
      </Toolbar>
    );
  };
}

export default function UserListTab({ user }: { user: LoggedInUser }) {
  const [users, setUsers] = useState<DVContact<DVParticipation[]>[] | null>(
    null
  );

  const { reloadData: updateUsers } = useRecords<DVContact>({
    table: DataTable.CONTACT,
    query:
      "$select=contactid,emailaddress1,firstname,lastname,adx_organizationname,createdon,cr4de_permissions,_ownerid_value,msdyn_portaltermsagreementdate",
    onComplete: async (d) => {
      setUsers(
        d.map((c) => ({
          ...c,
          participations: [] as DVParticipation[],
        }))
      );
      getParticipations();
    },
  });

  const { getData: getParticipations } = useLazyRecords<DVParticipation>({
    table: DataTable.PARTICIPATION,
    // query: "$select=emailaddress1,firstname,lastname,",
    onComplete: async (d) =>
      setUsers((prevUsers) =>
        prevUsers!.map((u) => ({
          ...u,
          participations: d.filter(
            (p) => p._cr4de_contact_value === u.contactid
          ),
        }))
      ),
  });

  if (!users)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  return (
    <Container sx={{ mb: 18 }}>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(d) => d.contactid}
        initialState={{
          columns: {
            columnVisibilityModel: {
              contactid: false,
            },
          },
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          sorting: {
            sortModel: [{ field: "createdon", sort: "desc" }],
          },
        }}
        pageSizeOptions={[10, 20, 50, 500]}
        checkboxSelection
        disableRowSelectionOnClick
        showToolbar={true}
        slots={{ toolbar: createCustomToolbar(user, updateUsers) }}
      />
    </Container>
  );
}
