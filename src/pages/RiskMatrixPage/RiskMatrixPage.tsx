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
  Card,
  CardContent,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import usePageTitle from "../../hooks/usePageTitle";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { RiskPageContext } from "../BaseRisksPage";
import NCCNLoader from "../../components/NCCNLoader";
import { AuthPageContext } from "../AuthPage";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import RiskMatrix from "../../components/charts/RiskMatrix";
import { SCENARIOS } from "../../functions/scenarios";
import { CATEGORY_NAMES, RISK_CATEGORY } from "../../types/dataverse/DVRiskFile";
import { IMPACT_CATEGORY } from "../../functions/Impact";

export default function RiskMatrixPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hazardCatalogue } = useOutletContext<RiskPageContext>();

  const [scenario, setScenario] = useState<"All" | "MRS" | SCENARIOS>("MRS");
  const [category, setCategory] = useState<"All" | RISK_CATEGORY>("All");
  const [impact, setImpact] = useState<"All" | IMPACT_CATEGORY>("All");

  const [labels, setLabels] = useState(false);
  const [es, setES] = useState(false);
  // const [scales, setScales] = useState<"absolute" | "classes">("classes");
  // const [nonKeyRisks, setNonKeyRisks] = useState<"show" | "fade" | "hide">("show");
  const [categoryDisplay, setCategoryDisplay] = useState<"shapes" | "colors" | "both" | "none">("shapes");
  const [scenarioDisplay, setScenarioDisplay] = useState<"colors" | "shapes" | "none">("colors");

  usePageTitle(t("sideDrawer.riskMatrix", "Risk Matrix"));
  useBreadcrumbs([
    { name: t("bnra.shortName"), url: "/" },
    { name: t("sideDrawer.riskMatrix", "Risk Matrix"), url: "" },
  ]);

  return (
    <Card sx={{ my: 4, mx: 9 }}>
      <CardContent sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <Box sx={{ flex: 1, aspectRatio: "1", maxHeight: "calc(100vh - 220px)", my: 4, pl: 2, mt: -4, pr: 2 }}>
          <RiskMatrix
            riskFiles={hazardCatalogue}
            setSelectedNodeId={(id) => {
              if (id) navigate(`/risks/${id}`);
            }}
            labels={labels}
            categoryDisplay={categoryDisplay}
            scenarioDisplay={scenarioDisplay}
            scenario={scenario}
            category={category}
            impact={impact}
            onlyES={es}
          />
        </Box>
        <Box sx={{ width: 350, height: "100%" }}>
          <Stack direction="column" sx={{ pb: 4, mt: 2, height: "100%" }} spacing={4}>
            <FormGroup sx={{}}>
              <FormControl sx={{ flex: 1 }} fullWidth>
                <InputLabel>{t("riskMatrix.show_scenarios", "Show Scenarios")}</InputLabel>
                <Select
                  value={scenario}
                  label={t("riskMatrix.show_scenarios", "Show Scenarios")}
                  onChange={(e) => setScenario(e.target.value as any)}
                >
                  <MenuItem value={"All"}>{t("All", "All")}</MenuItem>
                  <MenuItem value={"MRS"}>{t("Most Relevant Scenario")}</MenuItem>
                  <MenuItem value={SCENARIOS.CONSIDERABLE}>{t("considerable", "Considerable")}</MenuItem>
                  <MenuItem value={SCENARIOS.MAJOR}>{t("major", "Major")}</MenuItem>
                  <MenuItem value={SCENARIOS.EXTREME}>{t("extreme", "Extreme")}</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ flex: 1, mt: 2 }} fullWidth>
                <InputLabel>{t("riskMatrix.show_category", "Show Category")}</InputLabel>
                <Select
                  value={category}
                  label={t("riskMatrix.show_category", "Show Category")}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <MenuItem value="All">{t("All", "All")}</MenuItem>
                  <MenuItem value={RISK_CATEGORY.CYBER}>
                    {t(RISK_CATEGORY.CYBER, CATEGORY_NAMES[RISK_CATEGORY.CYBER])}
                  </MenuItem>
                  <MenuItem value={RISK_CATEGORY.ECOTECH}>
                    {t(RISK_CATEGORY.ECOTECH, CATEGORY_NAMES[RISK_CATEGORY.ECOTECH])}
                  </MenuItem>
                  <MenuItem value={RISK_CATEGORY.HEALTH}>
                    {t(RISK_CATEGORY.HEALTH, CATEGORY_NAMES[RISK_CATEGORY.HEALTH])}
                  </MenuItem>
                  <MenuItem value={RISK_CATEGORY.MANMADE}>
                    {t(RISK_CATEGORY.MANMADE, CATEGORY_NAMES[RISK_CATEGORY.MANMADE])}
                  </MenuItem>
                  <MenuItem value={RISK_CATEGORY.NATURE}>
                    {t(RISK_CATEGORY.NATURE, CATEGORY_NAMES[RISK_CATEGORY.NATURE])}
                  </MenuItem>
                  <MenuItem value={RISK_CATEGORY.TRANSVERSAL}>
                    {t(RISK_CATEGORY.TRANSVERSAL, CATEGORY_NAMES[RISK_CATEGORY.TRANSVERSAL])}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ flex: 1, mt: 2 }} fullWidth>
                <InputLabel>{t("riskMatrix.show_impact", "Show Impact")}</InputLabel>
                <Select
                  value={impact}
                  label={t("riskMatrix.show_impact", "Show Impact")}
                  onChange={(e) => setImpact(e.target.value as any)}
                >
                  <MenuItem value="All">{t("All", "All")}</MenuItem>
                  {["h", "s", "e", "f"].map((i) => (
                    <MenuItem value={i.toUpperCase()}>{t(`learning.impact.${i}.title`)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Checkbox checked={es} onChange={(e) => setES(e.target.checked)} />}
                label={t("riskMatrix.executive_summary", "Show only executive summary")}
              />
              <FormControlLabel
                control={<Checkbox checked={labels} onChange={(e) => setLabels(e.target.checked)} />}
                label={t("riskMatrix.show_labels", "Show labels")}
              />
              <FormControl sx={{ flex: 1, mt: 2 }} fullWidth>
                <InputLabel>{t("riskMatrix.categories", "Categories display")}</InputLabel>
                <Select
                  value={categoryDisplay}
                  label={t("riskMatrix.categories", "Categories display")}
                  onChange={(e) => setCategoryDisplay(e.target.value as any)}
                >
                  <MenuItem value={"shapes"}>{t("riskMatrix.shapes", "Shapes")}</MenuItem>
                  <MenuItem value={"colors"}>{t("riskMatrix.colors", "Colors")}</MenuItem>
                  <MenuItem value={"both"}>{t("riskMatrix.shapesandcolors", "Shapes & Colors")}</MenuItem>
                  <MenuItem value={"none"}>{t("riskMatrix.none", "None")}</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ flex: 1, mt: 2 }} fullWidth>
                <InputLabel>{t("riskMatrix.scenarios", "Scenarios display")}</InputLabel>
                <Select
                  value={scenarioDisplay}
                  label={t("riskMatrix.scenarios", "Scenarios display")}
                  onChange={(e) => setScenarioDisplay(e.target.value as any)}
                >
                  <MenuItem value={"colors"}>{t("riskMatrix.colors", "Colors")}</MenuItem>
                  <MenuItem value={"none"}>{t("riskMatrix.none", "None")}</MenuItem>
                </Select>
              </FormControl>
            </FormGroup>
            {/* <Stack direction="column" sx={{ flex: 1 }} spacing={3}>
                <Stack direction="column" spacing={5}>
                  <FormControl sx={{ flex: 1 }} fullWidth>
                    <InputLabel>Scale Display</InputLabel>
                    <Select value={scales} label="Scale Display" onChange={(e) => setScales(e.target.value as any)}>
                      <MenuItem value={"classes"}>Classes</MenuItem>
                      <MenuItem value={"absolute"}>Absolute</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ flex: 1 }} fullWidth>
                    <InputLabel>Non-key Risks</InputLabel>
                    <Select
                      value={nonKeyRisks}
                      label="Non-key Risks"
                      onChange={(e) => setNonKeyRisks(e.target.value as any)}
                    >
                      <MenuItem value={"show"}>Show</MenuItem>
                      <MenuItem value={"fade"}>Fade</MenuItem>
                      <MenuItem value={"hide"}>Hide</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack direction="column" spacing={5}>
                  
                </Stack>
                <Stack direction="row" spacing={5}>
                  <FormControl sx={{ flex: 1 }} fullWidth>
                    <InputLabel>Font Size</InputLabel>
                    <Input type="number" />
                  </FormControl>
                </Stack>
              </Stack> */}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
