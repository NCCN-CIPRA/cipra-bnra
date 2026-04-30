import { Box } from "@mui/material";
import getImpactColor from "../../../functions/getImpactColor";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { useMutation } from "@tanstack/react-query";
import { SCENARIOS } from "../../../functions/scenarios";
import { RiskFileQuantiResults } from "../../../types/dataverse/DVRiskFile";
import { addImpact } from "../../../functions/simulation/math";
import {
  AggregatedImpacts,
  noAggregatedImpacts,
} from "../../../types/simulation";

export default function PreferredActionsSection({
  riskFile,
  results,
}: {
  riskFile: DVRiskSnapshot;
  results: RiskFileQuantiResults | null;
}) {
  const api = useAPI();

  const updateRiskFile = useMutation({
    mutationFn: (newHTML: string) =>
      api.updateRiskFile(riskFile._cr4de_risk_file_value, {
        cr4de_mrs_actions: newHTML || undefined,
      }),
  });

  const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;
  const sums =
    results?.[scenario].impactStatistics?.relativeContributions.reduce(
      (acc, c) => ({
        ...acc,
        [c.id || ""]: addImpact(
          acc[c.id || ""] || noAggregatedImpacts,
          c.contributionMean,
        ),
      }),
      {} as Record<string, AggregatedImpacts>,
    ) || {};

  const impactContributions = Object.keys(sums).reduce(
    (acc, k) => ({
      ...acc,
      [k]: `Actions of this type are expected to be responsible for ${Math.round(1000 * sums[k].all) / 10}% of the impact caused by actors of this group in the next 3 years.`,
    }),
    {} as Record<string, string>,
  );

  return (
    <Box
      sx={{
        borderLeft: "solid 8px " + getImpactColor("H"),
        px: 2,
        py: 1,
        mt: 2,
        backgroundColor: "white",
      }}
    >
      <HTMLEditor
        initialHTML={riskFile.cr4de_quali_actions_mrs || ""}
        onSave={updateRiskFile}
        queryKeyToInvalidate={[
          DataTable.RISK_FILE,
          riskFile._cr4de_risk_file_value,
        ]}
        riskLabels={results ? impactContributions : undefined}
      />
    </Box>
  );
}
