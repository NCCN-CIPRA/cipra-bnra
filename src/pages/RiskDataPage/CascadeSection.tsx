import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { ReactNode, useState } from "react";
import RiskDataAccordion from "./RiskDataAccordion";
import { Box, Link, Stack, Typography } from "@mui/material";
import CascadeSankey from "./CascadeSankey";
import CascadeMatrix from "./CascadeMatrix";
import HTMLEditor from "../../components/HTMLEditor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import useAPI, { DataTable } from "../../hooks/useAPI";
import LeftBorderSection from "../../components/LeftBorderSection";

export type VISUALS = "SANKEY" | "MATRIX";

export function CascadeSection({
  cause,
  effect,
  cascade,
  subtitle = null,
  visuals,
  disabled = false,
}: {
  cause: DVRiskSnapshot;
  effect: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, unknown, unknown>;
  subtitle?: ReactNode;
  visuals: VISUALS;
  disabled?: boolean;
}) {
  const api = useAPI();
  const queryClient = useQueryClient();
  console.log(cascade);
  const [quali, setQuali] = useState<string | null>(cascade.cr4de_quali || "");
  const mutation = useMutation({
    mutationFn: async (
      newC: Partial<DVRiskCascade> & { cr4de_bnrariskcascadeid: string }
    ) => api.updateCascade(newC.cr4de_bnrariskcascadeid, newC),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [DataTable.RISK_CASCADE],
      });
    },
  });

  return (
    <RiskDataAccordion
      disabled={disabled}
      title={
        <Stack direction="row">
          <Typography
            sx={{
              flex: 1,
              textDecoration: cascade.cr4de_removed ? "line-through" : "none",
            }}
          >
            <Link
              href={`/risks/${cause._cr4de_risk_file_value}/description`}
              target="_blank"
            >
              {cause.cr4de_title}
            </Link>{" "}
            causes{" "}
            <Link
              href={`/risks/${effect._cr4de_risk_file_value}/description`}
              target="_blank"
            >
              {effect.cr4de_title}
            </Link>
          </Typography>
          {subtitle}
        </Stack>
      }
    >
      <Stack direction="column" sx={{ width: "100%" }}>
        {visuals === "SANKEY" ? (
          <CascadeSankey cause={cause} effect={effect} cascade={cascade} />
        ) : (
          <CascadeMatrix cause={cause} effect={effect} cascade={cascade} />
        )}

        <Box sx={{ pt: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, ml: 2 }}>
            Consolidated Qualitative Input:
          </Typography>
          <LeftBorderSection sx={{ py: 1, mb: 2 }}>
            <HTMLEditor
              initialHTML={quali || ""}
              editableRole="analist"
              onSave={async (newQuali: string | null) => {
                setQuali(newQuali);
                mutation.mutate({
                  cr4de_bnrariskcascadeid: cascade._cr4de_risk_cascade_value,
                  cr4de_quali: newQuali,
                });
              }}
            />
          </LeftBorderSection>
        </Box>
      </Stack>
    </RiskDataAccordion>
  );
}
