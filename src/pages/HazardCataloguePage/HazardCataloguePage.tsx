import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  Paper,
  TableContainer,
  TableHead,
  Table,
  TableCell,
  TableBody,
  CircularProgress,
  TableRow,
} from "@mui/material";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { RiskPageContext } from "../BaseRisksPage";
import NCCNLoader from "../../components/NCCNLoader";
import RiskMatrixAccordion from "./RiskMatrixAccordion";
import { AuthPageContext } from "../AuthPage";

export default function HazardCataloguePage() {
  const navigate = useNavigate();
  const { user, hazardCatalogue } = useOutletContext<RiskPageContext>();

  usePageTitle("Hazard Catalogue");
  useBreadcrumbs([
    { name: "BNRA", url: "/" },
    { name: "Hazard Catalogue", url: "/hazards" },
  ]);

  return (
    <>
      <Box sx={{ mb: 8, mx: 8 }}>
        <RiskMatrixAccordion />
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ pr: 4 }}>ID</TableCell>
                <TableCell sx={{ width: "100%" }}>Name</TableCell>
                <TableCell sx={{ px: 4 }}>Category</TableCell>
                <TableCell sx={{ px: 4 }}>Labels</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {hazardCatalogue === null && (
                <TableRow>
                  <TableCell colSpan={100} sx={{ textAlign: "center", border: "none", pt: 10 }}>
                    <NCCNLoader />
                  </TableCell>
                </TableRow>
              )}
              {hazardCatalogue !== null &&
                hazardCatalogue.map((h) => (
                  <TableRow key={h.cr4de_riskfilesid} hover onClick={() => navigate(`/risks/${h.cr4de_riskfilesid}`)}>
                    <TableCell sx={{ pr: 4 }}>{h.cr4de_hazard_id}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{h.cr4de_title}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap", px: 4 }}>{h.cr4de_risk_category}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap", px: 4 }}></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
