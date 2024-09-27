import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Skeleton,
  Tooltip,
  Stack,
  Button,
} from "@mui/material";
import { IntensityParameter, unwrap, wrap } from "../../../functions/intensityParameters";
import { SCENARIO_PARAMS, SCENARIOS, unwrap as unwrapScenarios } from "../../../functions/scenarios";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Section } from "../HelpSiderBar";
import { useTranslation } from "react-i18next";

const ibsx = {
  transition: "opacity .3s ease",
  ml: 1,
};

export default function ScenarioSection({
  riskFile,
  helpOpen,
  setHelpFocus,
}: {
  riskFile: DVRiskFile;
  helpOpen: boolean;
  setHelpFocus: (v: Section) => void;
}) {
  const { t } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState(riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE);

  const parameters = useMemo(() => unwrap(riskFile.cr4de_intensity_parameters), [riskFile]);
  const scenarios = useMemo(
    () =>
      unwrapScenarios(
        parameters,
        riskFile.cr4de_scenario_considerable,
        riskFile.cr4de_scenario_major,
        riskFile.cr4de_scenario_extreme
      ),
    [parameters, riskFile]
  );

  return (
    <>
      <Typography variant="h5">
        {t("riskFile.intensityParameters.title", "Intensity Parameters")} & {t("riskFile.scenarios.title", "Scenarios")}
        {helpOpen && (
          <IconButton size="small" sx={ibsx} onClick={() => setHelpFocus(Section.IMPACT_BREAKDOWN)}>
            <HelpOutlineIcon fontSize="inherit" />
          </IconButton>
        )}
      </Typography>

      <Box
        sx={{
          borderLeft: `solid 8px ${SCENARIO_PARAMS[selectedScenario].color}`,
          px: 2,
          py: 1,
          mt: 2,
          backgroundColor: "white",
        }}
      >
        <Stack direction="row" justifyContent="flex-start" spacing={2} sx={{ mt: 1, mb: 4 }}>
          <Button
            variant="outlined"
            sx={{
              color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
              fontWeight: selectedScenario === SCENARIOS.CONSIDERABLE ? "bold" : "normal",
              opacity: selectedScenario === SCENARIOS.CONSIDERABLE ? 1 : 0.15,
              borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
              borderRadius: "50%",
              backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color}20`,
              width: 48,
              minWidth: 48,
              height: 48,
              "&:hover": {
                opacity: 1,
                backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color}20`,
                borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
              },
            }}
            onClick={() => setSelectedScenario(SCENARIOS.CONSIDERABLE)}
          >
            C
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
              fontWeight: selectedScenario === SCENARIOS.MAJOR ? "bold" : "normal",
              opacity: selectedScenario === SCENARIOS.MAJOR ? 1 : 0.35,
              borderColor: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
              borderRadius: "50%",
              backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}20`,
              width: 48,
              minWidth: 48,
              height: 48,
              "&:hover": {
                opacity: 1,
                backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.MAJOR].color}20`,
                borderColor: SCENARIO_PARAMS[SCENARIOS.MAJOR].color,
              },
            }}
            onClick={() => setSelectedScenario(SCENARIOS.MAJOR)}
          >
            M
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
              fontWeight: selectedScenario === SCENARIOS.EXTREME ? "bold" : "normal",
              opacity: selectedScenario === SCENARIOS.EXTREME ? 1 : 0.1,
              borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
              borderRadius: "50%",
              backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.EXTREME].color}20`,
              width: 48,
              minWidth: 48,
              height: 48,
              "&:hover": {
                opacity: 1,
                backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.EXTREME].color}20`,
                borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
              },
            }}
            onClick={() => setSelectedScenario(SCENARIOS.EXTREME)}
          >
            E
          </Button>
        </Stack>
        <Stack>
          {scenarios[selectedScenario].map((p) => {
            return (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2">
                  {p.name}{" "}
                  <Tooltip title={<Box dangerouslySetInnerHTML={{ __html: p.description || "" }} />}>
                    <HelpOutlineIcon fontSize="small" />
                  </Tooltip>
                </Typography>
                {/* <Box dangerouslySetInnerHTML={{ __html: p.description || "" }} /> */}
                <Box dangerouslySetInnerHTML={{ __html: p.value || "" }} />
              </Box>
            );
          })}
        </Stack>
      </Box>
    </>
  );
}
