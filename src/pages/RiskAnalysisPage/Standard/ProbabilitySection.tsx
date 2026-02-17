import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { useMutation } from "@tanstack/react-query";

export default function ProbabilitySection({
  riskFile,
}: {
  riskFile: DVRiskSnapshot<unknown, unknown>;
}) {
  const api = useAPI();

  const updateRiskFile = useMutation({
    mutationFn: (newHTML: string) =>
      api.updateRiskFile(riskFile._cr4de_risk_file_value, {
        cr4de_mrs_probability: newHTML || undefined,
      }),
  });

  return (
    <HTMLEditor
      initialHTML={riskFile.cr4de_quali_p_mrs || ""}
      onSave={updateRiskFile}
      queryKeyToInvalidate={[
        DataTable.RISK_FILE,
        riskFile._cr4de_risk_file_value,
      ]}
    />
  );
}
