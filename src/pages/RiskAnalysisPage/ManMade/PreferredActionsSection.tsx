import { Box } from "@mui/material";
import getImpactColor from "../../../functions/getImpactColor";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { useMutation } from "@tanstack/react-query";

export default function PreferredActionsSection({
  riskFile,
}: {
  riskFile: DVRiskSnapshot;
}) {
  const api = useAPI();

  const updateRiskFile = useMutation({
    mutationFn: (newHTML: string) =>
      api.updateRiskFile(riskFile._cr4de_risk_file_value, {
        cr4de_mrs_actions: newHTML || undefined,
      }),
  });

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
      />
    </Box>
  );
}
