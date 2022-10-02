import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CssBaseline,
  Container,
  Paper,
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  Divider,
  Box,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TitleBar from "../../components/TitleBar";
import RiskMatrix from "../../components/RiskMatrix";

export default function RankingPage() {
  const navigate = useNavigate();

  const [riskFiles, setRiskFiles] = useState<any[] | null>(null);
  const [impactField, setImpactField] = useState("ti");

  useEffect(() => {
    const getRiskFiles = async function () {
      try {
        const response = await fetch(
          `https://bnra.powerappsportals.com/_api/cr4de_riskfileses`,
          {
            method: "GET",
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
              __RequestVerificationToken:
                localStorage.getItem("antiforgerytoken") || "",
              "Content-Type": "application/json",
            },
          }
        );

        const responseJson = await response.json();

        const ranking = responseJson.value.map((r: any) => ({
          ...r,
          calculated: JSON.parse(r.cr4de_calculated) || {},
        }));
        ranking.sort(
          (a: any, b: any) =>
            (b.calculated[impactField] || 0) - (a.calculated[impactField] || 0)
        );

        setRiskFiles(ranking);
      } catch (e) {
        console.log(e);
      }
    };

    getRiskFiles();
  }, []);

  return (
    <>
      <Container sx={{ mt: 4, pb: 8 }}>
        <Box mb={4} sx={{ width: "100%", height: "600px" }}>
          <RiskMatrix riskFiles={riskFiles} />
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ width: 50, textAlign: "center", whiteSpace: "nowrap" }}
                >
                  #
                </TableCell>
                <TableCell>Hazard Name</TableCell>
                <TableCell sx={{ width: 0, whiteSpace: "nowrap" }}>
                  <FormControl sx={{ m: 0, width: 150 }} size="small">
                    <Select
                      value={impactField}
                      onChange={(e) => {
                        if (!riskFiles) return;

                        setImpactField(e.target.value);

                        const sorted = riskFiles
                          .slice(0)
                          .sort(
                            (a: any, b: any) =>
                              (b.calculated[e.target.value] || 0) -
                              (a.calculated[e.target.value] || 0)
                          );

                        setRiskFiles(sorted);
                      }}
                    >
                      <MenuItem value={"ti"}>Total Impact</MenuItem>
                      <MenuItem value={"tp"}>Total Probability</MenuItem>
                      <Divider />
                      <MenuItem value={"dp"}>Direct Probability</MenuItem>
                      <MenuItem value={"ip"}>Indirect Probability</MenuItem>
                      <Divider />
                      <MenuItem value={"ti_Ha"}>Total Ha</MenuItem>
                      <MenuItem value={"ti_Hb"}>Total Hb</MenuItem>
                      <MenuItem value={"ti_Hc"}>Total Hc</MenuItem>
                      <MenuItem value={"ti_Sa"}>Total Sa</MenuItem>
                      <MenuItem value={"ti_Sb"}>Total Sb</MenuItem>
                      <MenuItem value={"ti_Sc"}>Total Sc</MenuItem>
                      <MenuItem value={"ti_Sd"}>Total Sd</MenuItem>
                      <MenuItem value={"ti_Ea"}>Total Ea</MenuItem>
                      <MenuItem value={"ti_Fa"}>Total Fa</MenuItem>
                      <MenuItem value={"ti_Fb"}>Total Fb</MenuItem>
                      <Divider />
                      <MenuItem value={"di_Ha"}>Direct Ha</MenuItem>
                      <MenuItem value={"di_Hb"}>Direct Hb</MenuItem>
                      <MenuItem value={"di_Hc"}>Direct Hc</MenuItem>
                      <MenuItem value={"di_Sa"}>Direct Sa</MenuItem>
                      <MenuItem value={"di_Sb"}>Direct Sb</MenuItem>
                      <MenuItem value={"di_Sc"}>Direct Sc</MenuItem>
                      <MenuItem value={"di_Sd"}>Direct Sd</MenuItem>
                      <MenuItem value={"di_Ea"}>Direct Ea</MenuItem>
                      <MenuItem value={"di_Fa"}>Direct Fa</MenuItem>
                      <MenuItem value={"di_Fb"}>Direct Fb</MenuItem>
                      <Divider />
                      <MenuItem value={"ii_Ha"}>Indirect Ha</MenuItem>
                      <MenuItem value={"ii_Hb"}>Indirect Hb</MenuItem>
                      <MenuItem value={"ii_Hc"}>Indirect Hc</MenuItem>
                      <MenuItem value={"ii_Sa"}>Indirect Sa</MenuItem>
                      <MenuItem value={"ii_Sb"}>Indirect Sb</MenuItem>
                      <MenuItem value={"ii_Sc"}>Indirect Sc</MenuItem>
                      <MenuItem value={"ii_Sd"}>Indirect Sd</MenuItem>
                      <MenuItem value={"ii_Ea"}>Indirect Ea</MenuItem>
                      <MenuItem value={"ii_Fa"}>Indirect Fa</MenuItem>
                      <MenuItem value={"ii_Fb"}>Indirect Fb</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riskFiles
                ? riskFiles.map((riskFile, i) => (
                    <TableRow
                      key={riskFile.cr4de_hazard_id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate(`/reporting/${riskFile.cr4de_riskfilesid}`)
                      }
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          width: 50,
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {i + 1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {riskFile.cr4de_title}
                      </TableCell>
                      <TableCell align="right">
                        {Math.round(100 * riskFile.calculated[impactField]) /
                          100}
                      </TableCell>
                    </TableRow>
                  ))
                : [1, 2, 3].map((i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Skeleton variant="rectangular" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="rectangular" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="rectangular" />
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
