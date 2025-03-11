import { useNavigate, useOutletContext } from "react-router-dom";
import {
  Box,
  Paper,
  TableContainer,
  TableHead,
  Table,
  TableCell,
  TableBody,
  TableRow,
  Button,
  LinearProgress,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  InputAdornment,
  Input,
  Typography,
} from "@mui/material";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { RiskPageContext } from "../BaseRisksPage";
import NCCNLoader from "../../components/NCCNLoader";
import { useTranslation } from "react-i18next";
import { SCENARIO_PARAMS } from "../../functions/scenarios";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { CategoryIcon } from "../../functions/getCategoryColor";
import BNRASpeedDial from "../../components/BNRASpeedDial";
import HazardCatalogueTutorial from "./HazardCatalogueTutorial";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

function SearchBar({ onSearch }: { onSearch: (v: string) => void }) {
  const [committedSearch, setCommittedSearch] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search !== committedSearch) {
      const t = setTimeout(() => {
        setCommittedSearch(search);
        onSearch(search);
      }, 500);

      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <FormControl sx={{ m: 0 }} variant="standard" fullWidth id="search-bar">
      <InputLabel htmlFor="outlined-adornment">
        Search Risk Catalogue
      </InputLabel>
      <Input
        id="outlined-adornment"
        type="text"
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        }
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </FormControl>
  );
}

export default function HazardCataloguePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, hazardCatalogue } = useOutletContext<RiskPageContext>();

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<null | string>(null);
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("ASC");

  usePageTitle(t("sideDrawer.hazardCatalogue", "Hazard Catalogue"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("sideDrawer.hazardCatalogue", "Hazard Catalogue"), url: "" },
  ]);

  return (
    <>
      <Box sx={{ mb: 0, mx: 8 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ px: 2, pt: 1 }}>
            <Box>
              <SearchBar onSearch={setSearch} />
            </Box>
          </CardContent>
        </Card>
        <TableContainer
          component={Paper}
          sx={{ width: "100%", maxHeight: "calc(100vh - 260px)" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableHeader
                  name={t("hazardCatalogue.id", "ID")}
                  sort={sortField === "cr4de_hazard_id" ? sortDir : null}
                  onSort={(v) => {
                    if (v === null) setSortField(null);
                    else {
                      setSortField("cr4de_hazard_id");
                      setSortDir(v);
                    }
                  }}
                />
                <TableHeader
                  name={t("hazardCatalogue.name", "Name")}
                  width="100%"
                  sort={sortField === "cr4de_title" ? sortDir : null}
                  onSort={(v) => {
                    if (v === null) setSortField(null);
                    else {
                      setSortField("cr4de_title");
                      setSortDir(v);
                    }
                  }}
                />
                <TableHeader
                  name={t("hazardCatalogue.category", "Category")}
                  sort={sortField === "cr4de_risk_category" ? sortDir : null}
                  onSort={(v) => {
                    if (v === null) setSortField(null);
                    else {
                      setSortField("cr4de_risk_category");
                      setSortDir(v);
                    }
                  }}
                />
                {user &&
                  user.participations &&
                  user.participations.length > 0 && (
                    <TableHeader
                      name={t("hazardCatalogue.participated", "Participated")}
                      sort={sortField === "participated" ? sortDir : null}
                      onSort={(v) => {
                        if (v === null) setSortField(null);
                        else {
                          setSortField("participated");
                          setSortDir(v);
                        }
                      }}
                    />
                  )}
                <TableHeader
                  name={t("hazardCatalogue.mrs", "Most Relevant Scenario")}
                  sort={sortField === "cr4de_mrs" ? sortDir : null}
                  onSort={(v) => {
                    if (v === null) setSortField(null);
                    else {
                      setSortField("cr4de_mrs");
                      setSortDir(v);
                    }
                  }}
                />
                <TableHeader
                  name={t("learning.probability.2.text.title", "Probability")}
                  minWidth="200px"
                  sort={sortField === "tp" ? sortDir : null}
                  onSort={(v) => {
                    if (v === null) setSortField(null);
                    else {
                      setSortField("tp");
                      setSortDir(v);
                    }
                  }}
                />
                <TableHeader
                  name={t("hazardCatalogue.impact", "Impact")}
                  minWidth="200px"
                  sort={sortField === "ti" ? sortDir : null}
                  onSort={(v) => {
                    if (v === null) setSortField(null);
                    else {
                      setSortField("ti");
                      setSortDir(v);
                    }
                  }}
                />
              </TableRow>
            </TableHead>
            <TableBody>
              {hazardCatalogue === null && (
                <TableRow>
                  <TableCell
                    colSpan={100}
                    sx={{ textAlign: "center", border: "none", pt: 10 }}
                  >
                    <NCCNLoader />
                  </TableCell>
                </TableRow>
              )}
              {hazardCatalogue !== null &&
                hazardCatalogue
                  .filter(
                    (h) =>
                      search === "" ||
                      t(`risk.${h.cr4de_hazard_id}.name`, h.cr4de_title)
                        .toLowerCase()
                        .indexOf(search.toLowerCase()) >= 0 ||
                      t(h.cr4de_risk_category)
                        .toLowerCase()
                        .indexOf(search.toLowerCase()) >= 0 ||
                      (h.cr4de_mrs ? t(h.cr4de_mrs) : "")
                        .toLowerCase()
                        .indexOf(search.toLowerCase()) >= 0
                  )
                  .map((h) => ({
                    ...h,
                    tp:
                      h.results && h.cr4de_mrs
                        ? h.results[h.cr4de_mrs].TP
                        : null,
                    ti:
                      h.results && h.cr4de_mrs
                        ? h.results[h.cr4de_mrs].TI
                        : null,
                    participated:
                      user &&
                      user.participations &&
                      user.participations.find(
                        (p) => p._cr4de_risk_file_value === h.cr4de_riskfilesid
                      )
                        ? -1
                        : 0,
                  }))
                  .sort((a, b) => {
                    if (!sortField) return 0;

                    if (a[sortField as keyof SmallRisk] === null) {
                      if (sortDir === "ASC") return -1;
                      return 1;
                    }

                    if (b[sortField as keyof SmallRisk] === null) {
                      if (sortDir === "ASC") return 1;
                      return -1;
                    }

                    // Determine if the array contains numbers or strings
                    const isNumeric =
                      typeof a[sortField as keyof SmallRisk] === "number";

                    // Sort the array using appropriate comparison
                    if (isNumeric) {
                      if (sortDir === "ASC")
                        return (
                          (a[
                            sortField as keyof SmallRisk
                          ] as unknown as number) -
                          (b[sortField as keyof SmallRisk] as unknown as number)
                        );
                      return (
                        (b[sortField as keyof SmallRisk] as unknown as number) -
                        (a[sortField as keyof SmallRisk] as unknown as number)
                      );
                    } else {
                      if (sortDir === "ASC")
                        return (
                          a[sortField as keyof SmallRisk] as string
                        ).localeCompare(
                          b[sortField as keyof SmallRisk] as string
                        );
                      return (
                        b[sortField as keyof SmallRisk] as string
                      ).localeCompare(
                        a[sortField as keyof SmallRisk] as string
                      );
                    }
                  })
                  .map((h) => (
                    <TableRow
                      key={h.cr4de_riskfilesid}
                      hover
                      onClick={() => navigate(`/risks/${h.cr4de_riskfilesid}`)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell sx={{ pr: 4 }}>{h.cr4de_hazard_id}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {t(`risk.${h.cr4de_hazard_id}.name`, h.cr4de_title)}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", px: 2 }}>
                        <Box sx={{ width: 30, height: 30, ml: 1.5 }}>
                          <CategoryIcon category={h.cr4de_risk_category} />
                        </Box>
                      </TableCell>

                      {user &&
                        user.participations &&
                        user.participations.length > 0 && (
                          <TableCell sx={{ whiteSpace: "nowrap", px: 2 }}>
                            {h.participated !== 0 && (
                              <Box sx={{ width: 30, height: 30, ml: 2.5 }}>
                                <TaskAltIcon color="primary" />
                              </Box>
                            )}
                          </TableCell>
                        )}
                      {/* <TableCell sx={{ whiteSpace: "nowrap", px: 2 }}></TableCell> */}
                      <TableCell
                        sx={{ whiteSpace: "nowrap", px: 2, textAlign: "left" }}
                      >
                        {h.cr4de_mrs ? (
                          <Button
                            variant="outlined"
                            sx={{
                              color: SCENARIO_PARAMS[h.cr4de_mrs].color,
                              borderColor: SCENARIO_PARAMS[h.cr4de_mrs].color,
                              borderRadius: "50%",
                              backgroundColor: `${
                                SCENARIO_PARAMS[h.cr4de_mrs].color
                              }20`,
                              width: 30,
                              minWidth: 30,
                              height: 30,
                              pointerEvents: "none",
                              ml: 7,
                            }}
                          >
                            {h.cr4de_mrs[0].toUpperCase()}
                          </Button>
                        ) : (
                          <Typography
                            sx={{
                              borderRadius: "50%",
                              width: 30,
                              minWidth: 30,
                              height: 30,
                              pointerEvents: "none",
                              ml: 8.5,
                            }}
                          >
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ whiteSpace: "nowrap", px: 2, textAlign: "left" }}
                      >
                        {h.results && h.cr4de_mrs ? (
                          <LinearProgress
                            variant="determinate"
                            value={h.results[h.cr4de_mrs].TP * 20}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ whiteSpace: "nowrap", px: 2, textAlign: "left" }}
                      >
                        {h.results && h.cr4de_mrs ? (
                          <LinearProgress
                            variant="determinate"
                            value={h.results[h.cr4de_mrs].TI * 20}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        <BNRASpeedDial HelpComponent={HazardCatalogueTutorial} />
      </Box>
    </>
  );
}
