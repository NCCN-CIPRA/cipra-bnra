import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import useAPI, { DataTable } from "../../hooks/useAPI";
import useRecords from "../../hooks/useRecords";
import NCCNLoader from "../../components/NCCNLoader";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { DVContact } from "../../types/dataverse/DVContact";
import { useEffect } from "react";

export default function UserManagementPage() {
  const api = useAPI();

  const { data: users, loading } = useRecords<DVContact>({
    table: DataTable.CONTACT,
  });

  useEffect(() => {
    api.getContactRoles().then(console.log);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  usePageTitle("User Management");
  useBreadcrumbs([
    { name: "BNRA", url: "/" },
    { name: "User Management", url: "/admin/users" },
  ]);

  if (!users)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  return (
    <Container sx={{ mb: 8 }}>
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 200 }}>Name</TableCell>
              <TableCell sx={{ width: 200, px: 4 }}>Email</TableCell>
              <TableCell sx={{ width: "100%", px: 4 }}>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.contactid}>
                <TableCell>
                  {u.firstname} {u.lastname}
                </TableCell>
                <TableCell>{u.emailaddress1}</TableCell>
                <TableCell>{Object.keys(u)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
