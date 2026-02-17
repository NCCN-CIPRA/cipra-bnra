import { Box, Typography } from "@mui/material";
import { DVCascadeSnapshot } from "../../../types/dataverse/DVCascadeSnapshot";
import { DVRiskSummary } from "../../../types/dataverse/DVRiskSummary";
import { SmallRisk } from "../../../types/dataverse/DVSmallRisk";
import useAPI, { DataTable } from "../../../hooks/useAPI";
import { useMutation } from "@tanstack/react-query";
import HTMLEditor from "../../../components/HTMLEditor";

function CatalyzingEffect({
  cascade,
}: {
  cascade: DVCascadeSnapshot<unknown, DVRiskSummary, SmallRisk>;
}) {
  const api = useAPI();

  const updateCascade = useMutation({
    mutationFn: (newHTML: string) =>
      api.updateCascade(cascade._cr4de_risk_cascade_value, {
        cr4de_description: newHTML || undefined,
      }),
  });
  return (
    <Box
      sx={{
        borderLeft: "solid 8px #eee",
        mt: 2,
        px: 2,
        py: 1,
        backgroundColor: "white",
      }}
    >
      <a
        href={`/risks/${cascade.cr4de_effect_risk.cr4de_riskfilesid}/evolution`}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          {cascade.cr4de_effect_risk.cr4de_title}
        </Typography>
      </a>
      <HTMLEditor
        initialHTML={cascade.cr4de_description || ""}
        onSave={updateCascade}
        queryKeyToInvalidate={[
          DataTable.RISK_CASCADE,
          "emerging",
          cascade._cr4de_cause_risk_value,
        ]}
      />
    </Box>
  );
}

export default function CatalyzingSection({
  cascades,
}: {
  cascades: DVCascadeSnapshot<unknown, DVRiskSummary, SmallRisk>[];
}) {
  return (
    <>
      {cascades.map((c) => {
        return (
          <CatalyzingEffect key={c._cr4de_risk_cascade_value} cascade={c} />
        );
      })}
    </>
  );
}
