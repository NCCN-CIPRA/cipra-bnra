import { Box, Typography } from "@mui/material";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { useMutation } from "@tanstack/react-query";
import HTMLEditor from "../../../components/HTMLEditor";

export default function CBSection({
  riskFile,
}: {
  riskFile: DVRiskSnapshot<unknown, unknown>;
}) {
  const api = useAPI();

  const updateRiskFile = useMutation({
    mutationFn: (newHTML: string) =>
      api.updateRiskFile(riskFile._cr4de_risk_file_value, {
        cr4de_mrs_cb: newHTML || undefined,
      }),
  });

  return (
    <Box
      className="cb-impact"
      sx={{
        borderLeft: "solid 8px #eee",
        px: 2,
        py: 1,
        mt: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h6">Cross-border Impact</Typography>

      <HTMLEditor
        initialHTML={riskFile.cr4de_quali_cb_mrs || ""}
        onSave={updateRiskFile}
        queryKeyToInvalidate={[
          DataTable.RISK_FILE,
          riskFile._cr4de_risk_file_value,
        ]}
      />
    </Box>
  );
}
