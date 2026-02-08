import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI from "../../../hooks/useAPI";

export default function ProbabilitySection({
  riskFile,
}: {
  riskFile: DVRiskSnapshot<unknown, unknown>;
}) {
  const api = useAPI();

  return (
    <HTMLEditor
      initialHTML={riskFile.cr4de_quali_p_mrs || ""}
      onSave={(newHTML) =>
        api.updateRiskFile(riskFile._cr4de_risk_file_value, {
          cr4de_mrs_probability: newHTML || undefined,
        })
      }
    />
  );
}
