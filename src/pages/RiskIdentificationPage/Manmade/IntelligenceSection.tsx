import { Box, Button, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import { DVAttachment } from "../../../types/dataverse/DVAttachment";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import { unwrap } from "../../../functions/intensityParameters";
import {
  SCENARIO_PARAMS,
  SCENARIO_SUFFIX,
  SCENARIOS,
  unwrap as unwrapScenarios,
} from "../../../functions/scenarios";
import { useTranslation } from "react-i18next";

export default function IntelligenceSection({
  riskFile,
}: {
  riskFile: DVRiskFile;
  MRSSuffix: SCENARIO_SUFFIX;
  mode: "view" | "edit";
  attachments?: DVAttachment[] | null;
  updateAttachments?: null | (() => Promise<unknown>);
  isEditingOther: boolean;
  setIsEditing: (isEditing: boolean) => void;
  reloadRiskFile: () => Promise<unknown>;
  allRisks: SmallRisk[] | null;
}) {
  const { t } = useTranslation();
  const [selectedScenario, setSelectedScenario] = useState(
    riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE
  );

  const parameters = useMemo(
    () => unwrap(riskFile.cr4de_intensity_parameters),
    [riskFile]
  );
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
        {t("riskFile.capabilities.title", "Actor Capabilities")}
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
        <Stack
          id="scenario-buttons"
          direction="row"
          justifyContent="flex-start"
          spacing={2}
          sx={{ mt: 1, mb: 4 }}
        >
          <Button
            variant="outlined"
            sx={{
              color: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
              fontWeight:
                selectedScenario === SCENARIOS.CONSIDERABLE ? "bold" : "normal",
              opacity: selectedScenario === SCENARIOS.CONSIDERABLE ? 1 : 0.15,
              borderColor: SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color,
              borderRadius: "50%",
              backgroundColor: `${
                SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
              }20`,
              width: 48,
              minWidth: 48,
              height: 48,
              "&:hover": {
                opacity: 1,
                backgroundColor: `${
                  SCENARIO_PARAMS[SCENARIOS.CONSIDERABLE].color
                }20`,
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
              fontWeight:
                selectedScenario === SCENARIOS.MAJOR ? "bold" : "normal",
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
              fontWeight:
                selectedScenario === SCENARIOS.EXTREME ? "bold" : "normal",
              opacity: selectedScenario === SCENARIOS.EXTREME ? 1 : 0.1,
              borderColor: SCENARIO_PARAMS[SCENARIOS.EXTREME].color,
              borderRadius: "50%",
              backgroundColor: `${SCENARIO_PARAMS[SCENARIOS.EXTREME].color}20`,
              width: 48,
              minWidth: 48,
              height: 48,
              "&:hover": {
                opacity: 1,
                backgroundColor: `${
                  SCENARIO_PARAMS[SCENARIOS.EXTREME].color
                }20`,
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
              <Box
                key={`${riskFile.cr4de_riskfilesid}-${p.name}`}
                sx={{ mb: 4 }}
              >
                <Box dangerouslySetInnerHTML={{ __html: p.value || "" }} />
              </Box>
            );
          })}
        </Stack>
      </Box>
    </>
  );
}
