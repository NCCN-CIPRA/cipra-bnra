import { Box, Typography } from "@mui/material";
import getImpactColor from "../../../functions/getImpactColor";
import { IMPACT_CATEGORY } from "../../../functions/Impact";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { useMutation } from "@tanstack/react-query";
import { RiskFileQuantiResults } from "../../../types/dataverse/DVRiskFile";
import { SCENARIOS } from "../../../functions/scenarios";
import { addImpact } from "../../../functions/simulation/math";
import {
  AggregatedImpacts,
  noAggregatedImpacts,
} from "../../../types/simulation";

export default function ImpactSection({
  riskFile,
  impactName,
  results,
}: {
  riskFile: DVRiskSnapshot<unknown, unknown>;
  impactName: "human" | "societal" | "environmental" | "financial";
  results: RiskFileQuantiResults | null;
}) {
  const api = useAPI();

  const impactLetter = impactName[0] as "h" | "s" | "e" | "f";
  const impactLetterUC = impactLetter.toUpperCase() as IMPACT_CATEGORY;

  const updateRiskFile = useMutation({
    mutationFn: (newHTML: string) =>
      api.updateRiskFile(riskFile._cr4de_risk_file_value, {
        [`cr4de_mrs_impact_${impactLetter}`]: newHTML || undefined,
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
      [k]: `This effect explains ${Math.round(1000 * sums[k][impactLetter]) / 10}% of the ${impactName} impact and ${
        Math.round(
          (1000 *
            sums[k][impactLetter] *
            (results?.[scenario].impactStatistics?.sampleMean[impactLetter] ??
              0)) /
            (results?.[scenario].impactStatistics?.sampleMean.all || 1),
        ) / 10
      }% of the total impact.`,
    }),
    {} as Record<string, string>,
  );

  return (
    <Box
      sx={{
        borderLeft: "solid 8px " + getImpactColor(impactLetterUC),
        px: 2,
        py: 2,
        mt: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h6">
        {impactLetter.toUpperCase()}
        {impactName.slice(1)} Impact
      </Typography>
      {results && (
        <Typography
          className="risk-link-label"
          variant="caption"
          sx={{ mb: 2 }}
        >
          The {impactName} impact represents an estimated{" "}
          <b>
            {Math.round(
              (1000 *
                (results[scenario].impactStatistics?.sampleMean[impactLetter] ??
                  0)) /
                (results[scenario].impactStatistics?.sampleMean.all ?? 1),
            ) / 10}
            %
          </b>{" "}
          of the total impact.
        </Typography>
      )}
      <HTMLEditor
        initialHTML={riskFile[`cr4de_quali_${impactLetter}_mrs`] || ""}
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
