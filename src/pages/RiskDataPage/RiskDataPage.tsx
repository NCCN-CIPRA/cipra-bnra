import { useOutletContext } from "react-router-dom";
import { DVRiskFile, RISK_TYPE } from "../../types/dataverse/DVRiskFile";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import Standard from "./Standard";
import ManMade from "./ManMade";
import Emerging from "./Emerging";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import NCCNLoader from "../../components/NCCNLoader";
import RiskFileTitle from "../../components/RiskFileTitle";
import Attack from "./Attack";
import { VISUALS } from "./CascadeSection";
import useSavedState from "../../hooks/useSavedState";
import RiskDataAccordion from "./RiskDataAccordion";
import { isMaliciousAction } from "../../functions/riskfiles";
import { useQuery } from "@tanstack/react-query";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { Environment } from "../../types/global";
import {
  snapshotFromRiskCascade,
  snapshotFromRiskfile,
} from "../../functions/snapshot";
import { parseRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { parseCascadeSnapshot } from "../../types/dataverse/DVRiskCascade";

export type PERC_CONTRIB =
  | "considerable"
  | "major"
  | "extreme"
  | "mrs"
  | "average"
  | "none";

export type SORT_ATTACKS = "impact" | "preference";

export type SORT_ENV = "environment" | "public" | "dynamic";

export default function RiskDataPage() {
  const api = useAPI();

  const {
    user,
    environment,
    riskSnapshot: riskFile,
    riskSummary,
  } = useOutletContext<RiskFilePageContext>();
  const [viewType, setViewType] = useSavedState<VISUALS>(
    `risk-data-page-cascades-${riskFile?._cr4de_risk_file_value}`,
    "MATRIX",
    false,
  );
  const [showPercentage, setShowPercentage] = useSavedState<PERC_CONTRIB>(
    `risk-data-page-percentage-${riskFile?._cr4de_risk_file_value}`,
    "average",
  );
  const [showConsequences, setShowConsequences] = useSavedState<boolean>(
    `risk-data-page-consequences-${riskFile?._cr4de_risk_file_value}`,
    true,
  );
  const [sortAttacks, setSortAttacks] = useSavedState<SORT_ATTACKS>(
    `risk-data-page-sortimpact-${riskFile?._cr4de_risk_file_value}`,
    "impact",
  );

  const { data: dynamicCauses } = useQuery({
    queryKey: [
      DataTable.RISK_CASCADE,
      "causes",
      riskSummary._cr4de_risk_file_value,
    ],
    queryFn: () =>
      api.getRiskCascades(
        `$filter=_cr4de_effect_hazard_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_cause_hazard`,
      ),
    enabled: Boolean(
      user &&
        user.roles.analist &&
        environment === Environment.DYNAMIC &&
        riskFile,
    ),
    select: (data) =>
      data.map((d) => ({
        ...parseCascadeSnapshot(snapshotFromRiskCascade(riskFile!, d)),
        cr4de_cause_risk: parseRiskSnapshot(
          snapshotFromRiskfile(d.cr4de_cause_hazard as DVRiskFile),
        ),
      })),
  });
  const { data: dynamicEffects } = useQuery({
    queryKey: [
      DataTable.RISK_CASCADE,
      "effects",
      riskSummary._cr4de_risk_file_value,
    ],
    queryFn: () =>
      api.getRiskCascades(
        `$filter=_cr4de_cause_hazard_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_effect_hazard`,
      ),
    enabled: Boolean(
      user &&
        user.roles.analist &&
        environment === Environment.DYNAMIC &&
        riskFile,
    ),
    select: (data) =>
      data.map((d) => ({
        ...parseCascadeSnapshot(snapshotFromRiskCascade(riskFile!, d)),
        cr4de_effect_risk: parseRiskSnapshot(
          snapshotFromRiskfile(d.cr4de_effect_hazard as DVRiskFile),
        ),
      })),
  });

  const { data: publicCauses } = useQuery({
    queryKey: [
      DataTable.CASCADE_SNAPSHOT,
      "causes",
      riskSummary._cr4de_risk_file_value,
    ],
    queryFn: () =>
      api.getCascadeSnapshots(
        `$filter=_cr4de_effect_risk_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_cause_risk`,
      ),
    enabled: Boolean(
      user &&
        user.roles.verified &&
        environment === Environment.PUBLIC &&
        riskFile,
    ),
    select: (data) =>
      data.map((d) => ({
        ...parseCascadeSnapshot(d),
        cr4de_cause_risk: parseRiskSnapshot(
          snapshotFromRiskfile(d.cr4de_cause_risk as DVRiskFile),
        ),
      })),
  });
  const { data: publicEffects } = useQuery({
    queryKey: [
      DataTable.CASCADE_SNAPSHOT,
      "effects",
      riskSummary._cr4de_risk_file_value,
    ],
    queryFn: () =>
      api.getCascadeSnapshots(
        `$filter=_cr4de_cause_risk_value eq ${riskSummary._cr4de_risk_file_value}&$expand=cr4de_effect_risk`,
      ),
    enabled: Boolean(
      user &&
        user.roles.verified &&
        environment === Environment.PUBLIC &&
        riskFile,
    ),
    select: (data) =>
      data.map((d) => ({
        ...parseCascadeSnapshot(d),
        cr4de_effect_risk: parseRiskSnapshot(
          snapshotFromRiskfile(d.cr4de_effect_risk as DVRiskFile),
        ),
      })),
  });

  const causes = (
    environment === Environment.PUBLIC ? publicCauses : dynamicCauses
  )?.filter((c) => c.cr4de_cause_risk.cr4de_risk_type !== RISK_TYPE.EMERGING);
  const catalyzingEffects = (
    environment === Environment.PUBLIC ? publicCauses : dynamicCauses
  )?.filter(
    (c) =>
      c.cr4de_cause_risk.cr4de_risk_type === RISK_TYPE.EMERGING &&
      c.cr4de_cause_risk.cr4de_title.indexOf("Climate") < 0,
  );
  const climateChange = (
    environment === Environment.PUBLIC ? publicCauses : dynamicCauses
  )?.find((c) => c.cr4de_cause_risk.cr4de_title.indexOf("Climate") >= 0);
  const effects = (
    environment === Environment.PUBLIC ? publicEffects : dynamicEffects
  )?.filter((c) => c.cr4de_effect_risk.cr4de_risk_type !== RISK_TYPE.EMERGING);

  if (
    !riskFile ||
    causes === undefined ||
    effects === undefined ||
    catalyzingEffects === undefined
  )
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  const isAttackRisk = isMaliciousAction(riskFile._cr4de_risk_file_value);

  return (
    <Stack direction="column" sx={{ width: "100%" }}>
      <Container sx={{ mt: 2 }}>
        <RiskFileTitle riskFile={riskSummary} />
      </Container>
      {user?.roles.analist &&
        riskFile.cr4de_risk_type !== RISK_TYPE.EMERGING && (
          <Container sx={{ mt: -6, mb: 2 }}>
            <RiskDataAccordion title="Page Display Configuration">
              <Stack direction="column" gap={2} sx={{ p: 4, pt: 1 }}>
                {/* Toggle View Type */}
                <FormControl fullWidth margin="normal">
                  <Stack direction="row" justifyContent="flex-start">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1">Matrix View</Typography>
                      <Switch
                        checked={viewType === "SANKEY"}
                        onChange={(e) =>
                          setViewType(e.target.checked ? "SANKEY" : "MATRIX")
                        }
                      />
                      <Typography variant="subtitle1">Sankey View</Typography>
                    </Stack>
                  </Stack>
                </FormControl>

                {/* Show Percentage Contribution */}
                <FormControl component="fieldset" fullWidth margin="normal">
                  <InputLabel id="percentage-label">
                    Show Percentage Contribution
                  </InputLabel>
                  <Select<PERC_CONTRIB>
                    labelId="percentage-label"
                    value={showPercentage}
                    label="Show Percentage Contribution"
                    onChange={(e) => setShowPercentage(e.target.value)}
                  >
                    <MenuItem value="considerable">
                      Considerable Scenario
                    </MenuItem>
                    <MenuItem value="major">Major Scenario</MenuItem>
                    <MenuItem value="extreme">Extreme Scenario</MenuItem>
                    <MenuItem value="mrs">Most Relevant Scenario</MenuItem>
                    <MenuItem value="average">
                      Average of All Scenarios
                    </MenuItem>
                    <MenuItem value="none">Don't Show</MenuItem>
                  </Select>
                </FormControl>

                {/* Show/Hide Potential Consequences */}
                {riskFile.cr4de_risk_type !== RISK_TYPE.MANMADE && (
                  <FormControl fullWidth margin="normal">
                    <Stack direction="row" justifyContent="flex-start">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Switch
                          checked={showConsequences}
                          onChange={(e) =>
                            setShowConsequences(e.target.checked)
                          }
                        />
                        <Typography variant="subtitle1">
                          Show Potential Consequences
                        </Typography>
                      </Stack>
                    </Stack>
                  </FormControl>
                )}

                {/* Sort Options */}
                {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
                  <FormControl fullWidth margin="dense">
                    <InputLabel id="sort-impact-label">
                      Sort By Impact / Preference
                    </InputLabel>
                    <Select<SORT_ATTACKS>
                      labelId="sort-impact-label"
                      value={sortAttacks}
                      label="Sort By Impact / Preference"
                      onChange={(e) => setSortAttacks(e.target.value)}
                    >
                      <MenuItem value="impact">Expected Impact</MenuItem>
                      <MenuItem value="preference">
                        Relative Preferences
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Stack>
            </RiskDataAccordion>
          </Container>
        )}
      <Box sx={{ mt: 2, mb: 16 }}>
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && !isAttackRisk && (
          <Standard
            riskFile={riskFile}
            causes={causes}
            effects={effects}
            catalyzingEffects={catalyzingEffects}
            climateChange={climateChange || null}
            publicCauses={publicCauses?.filter(
              (c) => c.cr4de_cause_risk.cr4de_risk_type !== RISK_TYPE.EMERGING,
            )}
            publicEffects={publicEffects}
            viewType={viewType}
            percentages={showPercentage}
            showConsequences={showConsequences}
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && isAttackRisk && (
          <Attack
            riskFile={riskFile}
            causes={causes}
            effects={effects}
            catalyzingEffects={catalyzingEffects}
            climateChange={climateChange || null}
            publicCauses={publicCauses?.filter(
              (c) => c.cr4de_cause_risk.cr4de_risk_type !== RISK_TYPE.EMERGING,
            )}
            publicEffects={publicEffects}
            viewType={viewType}
            percentages={showPercentage}
            showConsequences={showConsequences}
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
          <ManMade
            riskFile={riskFile}
            effects={effects}
            catalyzingEffects={catalyzingEffects}
            climateChange={climateChange || null}
            // publicCauses={publicCauses?.filter(
            //   (c) => c.cr4de_cause_risk.cr4de_risk_type !== RISK_TYPE.EMERGING,
            // )}
            publicEffects={publicEffects}
            viewType={viewType}
            percentages={showPercentage}
            sortAttacks={sortAttacks}
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && (
          <Emerging riskFile={riskFile} effects={effects} />
        )}
      </Box>
    </Stack>
  );
}
