import { Box } from "@mui/material";
import getImpactColor from "../../../functions/getImpactColor";
import { DVRiskSnapshot } from "../../../types/dataverse/DVRiskSnapshot";
import HTMLEditor from "../../../components/HTMLEditor";
import useAPI from "../../../hooks/useAPI";

export default function MMImpactSection({
  riskFile,
}: {
  riskFile: DVRiskSnapshot;
}) {
  const api = useAPI();

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
        onSave={(newHTML) =>
          api.updateRiskFile(riskFile._cr4de_risk_file_value, {
            cr4de_mrs_mm_impact: newHTML || undefined,
          })
        }
      />
    </Box>
  );
}
