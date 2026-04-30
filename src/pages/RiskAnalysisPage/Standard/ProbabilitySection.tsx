import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { useMutation } from "@tanstack/react-query";
import { RiskFileQuantiResults } from "../../../types/dataverse/DVRiskFile";
import { SCENARIOS } from "../../../functions/scenarios";

export default function ProbabilitySection({
  riskFile,
  results,
}: {
  riskFile: DVRiskSnapshot<unknown, unknown>;
  results: RiskFileQuantiResults | null;
}) {
  const api = useAPI();

  const updateRiskFile = useMutation({
    mutationFn: (newHTML: string) =>
      api.updateRiskFile(riskFile._cr4de_risk_file_value, {
        cr4de_mrs_probability: newHTML || undefined,
      }),
  });

  const scenario = riskFile.cr4de_mrs || SCENARIOS.CONSIDERABLE;
  const sums =
    results?.[scenario].probabilityStatistics?.relativeContributions.reduce(
      (acc, c) => ({
        ...acc,
        [c.id || ""]: (acc[c.id || ""] || 0) + c.contributionMean,
      }),
      {} as Record<string, number>,
    ) || {};

  const causeProbabilities = Object.keys(sums).reduce(
    (acc, k) => ({
      ...acc,
      [k]: `This cause explains ${Math.round(1000 * sums[k]) / 10}% of the total probability`,
    }),
    {} as Record<string, string>,
  );

  return (
    <HTMLEditor
      initialHTML={riskFile.cr4de_quali_p_mrs || ""}
      onSave={updateRiskFile}
      queryKeyToInvalidate={[
        DataTable.RISK_FILE,
        riskFile._cr4de_risk_file_value,
      ]}
      riskLabels={results ? causeProbabilities : undefined}
    />
  );
}
