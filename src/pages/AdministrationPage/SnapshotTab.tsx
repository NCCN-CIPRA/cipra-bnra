import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { useState } from "react";
import {
  snapshotFromRiskCascade,
  snapshotFromRiskfile,
  summaryFromRiskfileNew,
} from "../../functions/snapshot";
import {
  DVCascadeSnapshot,
  SerializedCauseSnapshotResults,
  SerializedCPMatrix,
  SerializedEffectSnapshotResults,
} from "../../types/dataverse/DVCascadeSnapshot";
import {
  DVRiskFile,
  parseRiskFileQuantiResults,
  RiskFileQuantiResults,
  SerializedRiskFileQuantiInput,
  SerializedRiskFileQuantiResults,
  serializeRiskFileQuantiResults,
} from "../../types/dataverse/DVRiskFile";
import {
  RISK_TYPE,
  SerializedRiskQualis,
} from "../../types/dataverse/Riskfile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import {
  DVRiskSnapshot,
  SerializedRiskSnapshotResults,
} from "../../types/dataverse/DVRiskSnapshot";
import {
  CauseRisksSummary,
  DVRiskSummary,
  EffectRisksSummary,
} from "../../types/dataverse/DVRiskSummary";

type SRiskFile = DVRiskFile<
  unknown,
  SerializedRiskFileQuantiInput,
  SerializedRiskQualis,
  RiskFileQuantiResults
>;

function getFields<T>(from: T, fields: (keyof T)[]): Partial<T> {
  const filtered: Partial<T> = {};

  for (const field of fields) {
    filtered[field] = from[field];
  }

  return filtered;
}

export default function SnapshotTab() {
  const api = useAPI();
  const { riskSummaryMap, snapshotMap } = useOutletContext<BasePageContext>();

  const [selectedRFs, setSelectedRFs] = useState<SRiskFile[] | null>(null);

  const { data: rfs } = useQuery<
    DVRiskFile<
      unknown,
      SerializedRiskFileQuantiInput,
      SerializedRiskQualis,
      SerializedRiskFileQuantiResults
    >[],
    Error,
    SRiskFile[]
  >({
    queryKey: [DataTable.RISK_FILE],
    queryFn: () => api.getRiskFiles(),
    select: (data) =>
      data
        .filter((rf) => !rf.cr4de_hazard_id.startsWith("X"))
        .map((data) => ({
          ...data,
          cr4de_quanti_results: parseRiskFileQuantiResults(
            data.cr4de_quanti_results,
          ),
        })),
  });

  const { data: cs } = useQuery({
    queryKey: [DataTable.RISK_CASCADE],
    queryFn: () => api.getRiskCascades(),
  });

  const { data: cSnapshots } = useQuery({
    queryKey: [DataTable.CASCADE_SNAPSHOT],
    queryFn: () => api.getCascadeSnapshots("$select=_cr4de_risk_cascade_value"),
  });

  const updateSummary = useMutation({
    mutationFn: async ({
      id,
      updatedFields,
    }: {
      id: string;
      updatedFields: Partial<DVRiskSummary>;
    }) => api.updateRiskSummary(id, updatedFields),
  });

  const updateSnapshot = useMutation({
    mutationFn: async ({
      id,
      updatedFields,
    }: {
      id: string;
      updatedFields: Partial<
        DVRiskSnapshot<
          unknown,
          SerializedRiskSnapshotResults,
          SerializedRiskQualis
        >
      >;
    }) => api.updateRiskSnapshot(id, updatedFields),
  });

  const updateCascadeSnapshot = useMutation({
    mutationFn: async ({
      id,
      updatedFields,
    }: {
      id: string;
      updatedFields: Partial<
        Partial<
          DVCascadeSnapshot<
            unknown,
            unknown,
            unknown,
            SerializedCauseSnapshotResults,
            SerializedEffectSnapshotResults,
            SerializedCPMatrix
          >
        >
      >;
    }) => api.updateCascadeSnapshot(id, updatedFields),
  });

  const handleUpdateSnapshots = async () => {
    if (!rfs || !cs || !selectedRFs) return;

    for (const riskFile of selectedRFs) {
      const riskSummary = getFields(summaryFromRiskfileNew(riskFile), [
        "cr4de_causing_risks",
        "cr4de_effect_risks",
        "cr4de_historical_events",
        "cr4de_horizon_analysis",
        "cr4de_intensity_parameters",
        "cr4de_key_risk",
        "cr4de_label_cb",
        "cr4de_label_cc",
        "cr4de_label_hilp",
        "cr4de_label_impact",
        "cr4de_mrs",
        "cr4de_mrs_p",
        "cr4de_mrs_i",
        "cr4de_mrs_h",
        "cr4de_mrs_s",
        "cr4de_mrs_e",
        "cr4de_mrs_f",
        "cr4de_scenario_considerable",
        "cr4de_scenario_major",
        "cr4de_scenario_extreme",
        "cr4de_summary_en",
        "cr4de_summary_nl",
        "cr4de_summary_fr",
        "cr4de_summary_de",
        "cr4de_title",
      ]);
      const riskSnapshot = getFields(snapshotFromRiskfile(riskFile), [
        "cr4de_definition",
        "cr4de_historical_events",
        "cr4de_horizon_analysis",
        "cr4de_intensity_parameters",
        "cr4de_mrs",
        "cr4de_quali",
        "cr4de_quali_actions_mrs",
        "cr4de_quali_cb_mrs",
        "cr4de_quali_cc_mrs",
        "cr4de_quali_disclaimer_mrs",
        "cr4de_quali_e_mrs",
        "cr4de_quali_f_mrs",
        "cr4de_quali_h_mrs",
        "cr4de_quali_mm_mrs",
        "cr4de_quali_p_mrs",
        "cr4de_quali_s_mrs",
        "cr4de_quali_scenario_mrs",
        "cr4de_quanti",
        "cr4de_quanti_results",
        "cr4de_scenarios",
        "cr4de_title",
      ]);

      await updateSummary.mutate({
        id: riskSummaryMap[riskFile.cr4de_riskfilesid],
        updatedFields: {
          ...riskSummary,
          cr4de_causing_risks: riskSummary.cr4de_causing_risks
            ? JSON.stringify(
                riskSummary.cr4de_causing_risks as CauseRisksSummary[],
              )
            : null,
          cr4de_effect_risks: riskSummary.cr4de_effect_risks
            ? JSON.stringify(
                riskSummary.cr4de_effect_risks as EffectRisksSummary[],
              )
            : null,
          cr4de_last_snapshot: new Date() as unknown as string, // Will be parsed by dataverse
        },
      });
      await updateSnapshot.mutate({
        id: snapshotMap[riskFile.cr4de_riskfilesid],
        updatedFields: {
          ...riskSnapshot,
          cr4de_quanti_results: riskSnapshot.cr4de_quanti_results
            ? serializeRiskFileQuantiResults(riskSnapshot.cr4de_quanti_results)
            : null,
        },
      });

      for (const cascade of cs) {
        if (
          cascade._cr4de_cause_hazard_value === riskFile.cr4de_riskfilesid ||
          cascade._cr4de_effect_hazard_value === riskFile.cr4de_riskfilesid
        ) {
          const cascadeSnapshot = snapshotFromRiskCascade(cascade);
          const snapshotId = cSnapshots?.find(
            (c) =>
              c._cr4de_risk_cascade_value === cascade.cr4de_bnrariskcascadeid,
          )?.cr4de_bnrariskcascadesnapshotid;

          if (snapshotId) {
            await updateCascadeSnapshot.mutate({
              id: snapshotId,
              updatedFields: getFields(cascadeSnapshot, [
                "cr4de_quali",
                "cr4de_quali_cause",
                "cr4de_quanti_cause",
                "cr4de_quanti_effect",
                "cr4de_quanti_cp",
              ]),
            });
          }
        }
      }
    }
  };

  return (
    <Container sx={{ mb: 18 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{}}>
          <Stack direction="column" columnGap={5}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Select the risk files below that should be migrated from the
              dynamic environment (only visible to CIPRA) to the static
              environment (visible to all users of the platform).
            </Typography>
            <Typography variant="body1">
              This will migrate the <i>Risk Summary</i>, <i>Risk Analysis</i>,{" "}
              <i>Risk Evolution</i> and <i>Raw Data</i> pages.
            </Typography>
            <FormGroup sx={{ flex: 1, mt: 4 }}>
              <FormControl sx={{ maxWidth: "100%" }}>
                <InputLabel id="rf-label">Riskfiles to snapshot</InputLabel>
                <Select<string[]>
                  labelId="rf-label"
                  variant="outlined"
                  label="Riskfiles to migrate"
                  multiple
                  value={selectedRFs?.map((rf) => rf.cr4de_riskfilesid) || []}
                  onChange={(e) =>
                    setSelectedRFs(
                      Array.isArray(e.target.value)
                        ? e.target.value
                            .map((id) =>
                              rfs?.find((rf) => rf.cr4de_riskfilesid === id),
                            )
                            .filter((rf) => rf !== undefined)
                        : [],
                    )
                  }
                >
                  <MenuItem value={""}>All</MenuItem>
                  {rfs
                    ?.filter((rf) => rf.cr4de_risk_type !== RISK_TYPE.EMERGING)
                    .sort((a, b) =>
                      a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id),
                    )
                    .map((rf) => (
                      <MenuItem value={rf.cr4de_riskfilesid}>
                        {rf.cr4de_hazard_id} {rf.cr4de_title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </FormGroup>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button color="warning" onClick={handleUpdateSnapshots}>
            Migrate snapshots
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
