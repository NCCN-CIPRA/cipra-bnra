import { Box } from "@mui/material";
import getImpactColor from "../../../functions/getImpactColor";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { useMutation } from "@tanstack/react-query";

export default function MMImpactSection({
  riskFile,
}: {
  riskFile: DVRiskSnapshot;
}) {
  const api = useAPI();

  const updateRiskFile = useMutation({
    mutationFn: (newHTML: string) =>
      api.updateRiskFile(riskFile._cr4de_risk_file_value, {
        cr4de_mrs_mm_impact: newHTML || undefined,
      }),
  });

  return (
    <Box
      sx={{
        borderLeft: "solid 8px " + getImpactColor("S"),
        px: 2,
        py: 1,
        mt: 2,
        backgroundColor: "white",
      }}
    >
      <HTMLEditor
        initialHTML={riskFile.cr4de_quali_mm_mrs || ""}
        onSave={updateRiskFile}
        queryKeyToInvalidate={[
          DataTable.RISK_FILE,
          riskFile._cr4de_risk_file_value,
        ]}
      />
    </Box>
  );
}
