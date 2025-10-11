import { useOutletContext } from "react-router-dom";
import { RISK_TYPE } from "../../types/dataverse/DVRiskFile";
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
  const {
    user,
    riskSnapshot: riskFile,
    riskSummary,
    cascades,
  } = useOutletContext<RiskFilePageContext>();
  const [viewType, setViewType] = useSavedState<VISUALS>(
    `risk-data-page-cascades-${riskFile?._cr4de_risk_file_value}`,
    "MATRIX",
    false
  );
  const [showPercentage, setShowPercentage] = useSavedState<PERC_CONTRIB>(
    `risk-data-page-percentage-${riskFile?._cr4de_risk_file_value}`,
    "average"
  );
  const [showConsequences, setShowConsequences] = useSavedState<boolean>(
    `risk-data-page-consequences-${riskFile?._cr4de_risk_file_value}`,
    true
  );
  const [sortAttacks, setSortAttacks] = useSavedState<SORT_ATTACKS>(
    `risk-data-page-sortimpact-${riskFile?._cr4de_risk_file_value}`,
    "impact"
  );

  if (!riskFile || !cascades)
    return (
      <Box sx={{ width: "100%", mt: 20, textAlign: "center" }}>
        <NCCNLoader />
      </Box>
    );

  const isAttackRisk = cascades.causes.some(
    (c) => c.cr4de_cause_risk.cr4de_risk_type === RISK_TYPE.MANMADE
  );

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
            causes={cascades.causes}
            effects={cascades.effects}
            catalyzingEffects={cascades.catalyzingEffects}
            climateChange={cascades.climateChange}
            viewType={viewType}
            percentages={showPercentage}
            showConsequences={showConsequences}
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.STANDARD && isAttackRisk && (
          <Attack
            riskFile={riskFile}
            causes={cascades.causes}
            effects={cascades.effects}
            catalyzingEffects={cascades.catalyzingEffects}
            climateChange={cascades.climateChange}
            viewType={viewType}
            percentages={showPercentage}
            showConsequences={showConsequences}
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.MANMADE && (
          <ManMade
            riskFile={riskFile}
            effects={cascades.effects}
            catalyzingEffects={cascades.catalyzingEffects}
            climateChange={cascades.climateChange}
            viewType={viewType}
            percentages={showPercentage}
            sortAttacks={sortAttacks}
          />
        )}
        {riskFile.cr4de_risk_type === RISK_TYPE.EMERGING && (
          <Emerging riskFile={riskFile} effects={cascades.effects} />
        )}
      </Box>
    </Stack>
  );
}
