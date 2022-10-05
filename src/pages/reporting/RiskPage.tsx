import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import {
  CssBaseline,
  Container,
  Typography,
  Paper,
  Button,
  Skeleton,
  Select,
  MenuItem,
  FormControl,
  Stack,
  Box,
  Breadcrumbs,
  Link,
  Grid,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TitleBar from "../../components/TitleBar";
import { getAbsoluteImpact, getImpactScale } from "../../functions/Impact";
import { getAbsoluteProbability, getProbabilityScale } from "../../functions/Probability";
import ImpactDistributionPieChart from "../../components/ImpactDistributionPieChart";
import ImpactOriginPieChart from "../../components/ImpactOriginPieChart";
import ProbabilityOriginPieChart from "../../components/ProbabilityOriginPieChart";
import ImpactSankey from "../../components/ImpactSankey";
import ProbabilitySankey from "../../components/ProbabilitySankey";

const impactFields = [
  ["Direct Ha", "cr4de_di_quanti_ha", "di_Ha"],
  ["Indirect Ha", null, "ii_Ha"],
  ["Total Ha", null, "ti_Ha"],
  null,
  ["Direct Hb", "cr4de_di_quanti_hb", "di_Hb"],
  ["Indirect Hb", null, "ii_Hb"],
  ["Total Hb", null, "ti_Hb"],
  null,
  ["Direct Hc", "cr4de_di_quanti_hc", "di_Hc"],
  ["Indirect Hc", null, "ii_Hc"],
  ["Total Hc", null, "ti_Hc"],
  null,
  ["Direct Sa", "cr4de_di_quanti_sa", "di_Sa"],
  ["Indirect Sa", null, "ii_Sa"],
  ["Total Sa", null, "ti_Sa"],
  null,
  ["Direct Sb", "cr4de_di_quanti_sb", "di_Sb"],
  ["Indirect Sb", null, "ii_Sb"],
  ["Total Sb", null, "ti_Sb"],
  null,
  ["Direct Sc", "cr4de_di_quanti_sc", "di_Sc"],
  ["Indirect Sc", null, "ii_Sc"],
  ["Total Sc", null, "ti_Sc"],
  null,
  ["Direct Sd", "cr4de_di_quanti_sd", "di_Sd"],
  ["Indirect Sd", null, "ii_Sd"],
  ["Total Sd", null, "ti_Sd"],
  null,
  ["Direct Ea", "cr4de_di_quanti_ea", "di_Ea"],
  ["Indirect Ea", null, "ii_Ea"],
  ["Total Ea", null, "ti_Ea"],
  null,
  ["Direct Fa", "cr4de_di_quanti_fa", "di_Fa"],
  ["Indirect Fa", null, "ii_Fa"],
  ["Total Fa", null, "ti_Fa"],
  null,
  ["Direct Fb", "cr4de_di_quanti_fb", "di_Fb"],
  ["Indirect Fb", null, "ii_Fb"],
  ["Total Fb", null, "ti_Fb"],
];
const curFormat = new Intl.NumberFormat("nl-BE", {
  style: "currency",
  currency: "EUR",
});

export default function RiskPage() {
  const params = useParams();

  const [riskFile, setRiskFile] = useState<any | null>(null);

  useEffect(() => {
    const getRiskFile = async function () {
      try {
        const response = await fetch(`https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${params.risk_id})`, {
          method: "GET",
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJzdWIiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhQGEuY29tIiwicGhvbmVfbnVtYmVyIjoiIiwiZ2l2ZW5fbmFtZSI6ImEiLCJmYW1pbHlfbmFtZSI6ImEiLCJlbWFpbCI6ImFAYS5jb20iLCJscF9zZGVzIjpbeyJ0eXBlIjoiY3RtcmluZm8iLCJpbmZvIjp7ImNzdGF0dXMiOm51bGwsImN0eXBlIjoiY29udGFjdCIsImN1c3RvbWVySWQiOiJhYmVkMjhkZC02MTNmLWVkMTEtOWRiMC0wMDBkM2FkZjcwODkiLCJiYWxhbmNlIjpudWxsLCJzb2NpYWxJZCI6bnVsbCwiaW1laSI6IiIsInVzZXJOYW1lIjoiYUBhLmNvbSIsImNvbXBhbnlTaXplIjpudWxsLCJhY2NvdW50TmFtZSI6bnVsbCwicm9sZSI6bnVsbCwibGFzdFBheW1lbnREYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9LCJyZWdpc3RyYXRpb25EYXRlIjp7ImRheSI6MCwibW9udGgiOjAsInllYXIiOjB9fX1dLCJhdWQiOiIiLCJhcHBpZCI6IiIsInNjcCI6IjYzNTVhOTMxLTBhMGUtNGE0Ni1iNTE2LThlNTU4OTZjY2E0OSIsImlhdCI6MTY2NDQzMjMxOCwibmJmIjoxNjY0NDMyMzE5LCJleHAiOjE2NjQ0MzMyMTksImlzcyI6ImJucmEucG93ZXJhcHBzcG9ydGFscy5jb20ifQ.DSkyEOprtyUJ6juSh5fp1wRUTuH29GQpvLKpGS-rAJfOO98ZQmhzCkdj4zbq3BEH_XJDEJ2wIlvuNscu1HhfV55A37im1Lt0R-Im3rikctYX4mcVRlCCQJ00NA_KUJs5EPigqBZjo7FY9o1xjVuhXo1mOTs3Ozo18inuX0i5mWcuwEQ4oUPxS__NC4ARKTKfGJ4SHcxC3cdQfCLsCfi--AKfYZh5It4YXnuLnttNkRcFDD08lFBBlVKMOprwCcXJNCvzXEbJx9l9silBz_xWYUjed2PIY0ob_ErUiAj6uvMfJDtRu9cgj0pj2EEXyugYFASI2SU9lpz5_yzgFr5c_w",
            __RequestVerificationToken: localStorage.getItem("antiforgerytoken") || "",
            "Content-Type": "application/json",
          },
        });

        const responseJson = await response.json();

        setRiskFile({
          ...responseJson,
          calculated: JSON.parse(responseJson.cr4de_calculated) || {},
        });
      } catch (e) {
        console.log(e);
      }
    };

    getRiskFile();
  }, []);

  return (
    <>
      <Box m={2} ml="76px">
        <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" to="/" component={RouterLink}>
            BNRA 2023 - 2026
          </Link>
          <Link underline="hover" color="inherit" to="/reporting" component={RouterLink}>
            Risk Ranking
          </Link>
          {riskFile ? (
            <Typography color="text.primary">{riskFile.cr4de_title}</Typography>
          ) : (
            <Skeleton variant="text" width="200px" />
          )}
        </Breadcrumbs>
      </Box>

      <Container sx={{ mt: 4, pb: 8 }}>
        <Stack direction="row" sx={{ mb: 8 }}>
          <Box sx={{ width: "calc(50% - 150px)", height: 600 }}>
            <ProbabilitySankey riskFile={riskFile} />
          </Box>
          <Stack direction="column" sx={{ width: 300, p: "50px" }}>
            <Box
              sx={{
                width: 200,
                height: 200,
              }}
            >
              <ProbabilityOriginPieChart riskFile={riskFile} />
            </Box>
            <Box
              sx={{
                width: 200,
                height: 200,
              }}
            >
              <ImpactOriginPieChart riskFile={riskFile} />
            </Box>
            <Box
              sx={{
                width: 200,
                height: 200,
              }}
            >
              <ImpactDistributionPieChart riskFile={riskFile} />
            </Box>
          </Stack>
          <Box sx={{ width: "calc(50% - 150px)", height: 600, mb: 8 }}>
            <ImpactSankey riskFile={riskFile} />
          </Box>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: "left", whiteSpace: "nowrap" }}></TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Considerable</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Major</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>Extreme</TableCell>
                <TableCell sx={{ whiteSpace: "nowrap", textAlign: "right" }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riskFile ? (
                <>
                  <TableRow key={riskFile.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Typography variant="body1">Direct P</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">{riskFile.cr4de_dp_quanti_c}</Typography>
                      <Typography variant="caption">
                        {Math.round(getAbsoluteProbability(riskFile.cr4de_dp_quanti_c) * 10000) / 100}%
                      </Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">{riskFile.cr4de_dp_quanti_m}</Typography>
                      <Typography variant="caption">
                        {Math.round(getAbsoluteProbability(riskFile.cr4de_dp_quanti_m) * 10000) / 100}%
                      </Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">{riskFile.cr4de_dp_quanti_e}</Typography>
                      <Typography variant="caption">
                        {Math.round(getAbsoluteProbability(riskFile.cr4de_dp_quanti_e) * 10000) / 100}%
                      </Typography>
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ textAlign: "right" }}>
                      {Math.round(riskFile.calculated.dp * 10000) / 100}%
                    </TableCell>
                  </TableRow>
                  <TableRow key={riskFile.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Typography variant="body1">Indirect P</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">
                        {getProbabilityScale(
                          riskFile.calculated.ip_c,
                          riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
                        )}
                      </Typography>
                      <Typography variant="caption">{Math.round(riskFile.calculated.ip_c * 10000) / 100}%</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">
                        {getProbabilityScale(
                          riskFile.calculated.ip_m,
                          riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
                        )}
                      </Typography>
                      <Typography variant="caption">{Math.round(riskFile.calculated.ip_m * 10000) / 100}%</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">
                        {getProbabilityScale(
                          riskFile.calculated.ip_e,
                          riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
                        )}
                      </Typography>
                      <Typography variant="caption">{Math.round(riskFile.calculated.ip_e * 10000) / 100}%</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ textAlign: "right" }}>
                      {Math.round(riskFile.calculated.ip * 10000) / 100}%
                    </TableCell>
                  </TableRow>
                  <TableRow key={riskFile.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Typography variant="body1">Total P</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">
                        {getProbabilityScale(
                          riskFile.calculated.tp_c,
                          riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
                        )}
                      </Typography>
                      <Typography variant="caption">{Math.round(riskFile.calculated.tp_c * 10000) / 100}%</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">
                        {getProbabilityScale(
                          riskFile.calculated.tp_m,
                          riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
                        )}
                      </Typography>
                      <Typography variant="caption">{Math.round(riskFile.calculated.tp_m * 10000) / 100}%</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant="body1">
                        {getProbabilityScale(
                          riskFile.calculated.tp_e,
                          riskFile.cr4de_risk_type === "Standard Risk" ? "DP" : "M"
                        )}
                      </Typography>
                      <Typography variant="caption">{Math.round(riskFile.calculated.tp_e * 10000) / 100}%</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ textAlign: "right" }}>
                      {Math.round(riskFile.calculated.tp * 10000) / 100}%
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ backgroundColor: "#eee" }}>
                    <TableCell colSpan={100}> </TableCell>
                  </TableRow>
                  {impactFields.map((f) =>
                    f === null ? (
                      <TableRow sx={{ backgroundColor: "#eee" }}>
                        <TableCell colSpan={100}> </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow
                        key={riskFile.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Typography variant="body1">{f[0]}</Typography>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {f[1] ? (
                            <>
                              <Typography variant="body1">{riskFile[`${f[1]}_c`]}</Typography>
                              <Typography variant="caption">
                                {curFormat.format(getAbsoluteImpact(riskFile[`${f[1]}_c`]))}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography variant="body1">
                                {getImpactScale(riskFile.calculated[`${f[2]}_c`], f[2]?.split("_")[1] || "")}
                              </Typography>
                              <Typography variant="caption">
                                {curFormat.format(riskFile.calculated[`${f[2]}_c`])}
                              </Typography>
                            </>
                          )}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {f[1] ? (
                            <>
                              <Typography variant="body1">{riskFile[`${f[1]}_m`]}</Typography>
                              <Typography variant="caption">
                                {curFormat.format(getAbsoluteImpact(riskFile[`${f[1]}_m`]))}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography variant="body1">
                                {getImpactScale(riskFile.calculated[`${f[2]}_m`], f[2]?.split("_")[1] || "")}
                              </Typography>
                              <Typography variant="caption">
                                {curFormat.format(riskFile.calculated[`${f[2]}_m`])}
                              </Typography>
                            </>
                          )}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {f[1] ? (
                            <>
                              <Typography variant="body1">{riskFile[`${f[1]}_e`]}</Typography>
                              <Typography variant="caption">
                                {curFormat.format(getAbsoluteImpact(riskFile[`${f[1]}_e`]))}
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography variant="body1">
                                {getImpactScale(riskFile.calculated[`${f[2]}_e`], f[2]?.split("_")[1] || "")}
                              </Typography>
                              <Typography variant="caption">
                                {curFormat.format(riskFile.calculated[`${f[2]}_e`])}
                              </Typography>
                            </>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {f[2] && (
                            <>
                              <Typography variant="body2">{curFormat.format(riskFile.calculated[f[2]])}</Typography>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </>
              ) : (
                [1, 2, 3].map((i) => (
                  <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>
                      <Skeleton variant="rectangular" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" />
                    </TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
