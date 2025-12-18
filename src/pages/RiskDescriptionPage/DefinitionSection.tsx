import { DVRiskSummary } from "../../types/dataverse/DVRiskSummary";
import LeftBorderSection from "../../components/LeftBorderSection";
import { useState } from "react";
import HTMLEditor from "../../components/HTMLEditor";
import { useOutletContext } from "react-router-dom";
import { RiskFilePageContext } from "../BaseRiskFilePage";
import { Environment } from "../../types/global";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { serializeChangeLogDiff } from "../../types/dataverse/DVChangeLog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";

export default function DefinitionSection({
  riskSummary,
}: {
  riskSummary: DVRiskSummary;
}) {
  const api = useAPI();
  const queryClient = useQueryClient();
  const { user, environment } = useOutletContext<RiskFilePageContext>();

  const [def, setDef] = useState<string>(riskSummary.cr4de_definition || "");
  console.log(riskSummary);
  const mutation = useMutation({
    mutationFn: async (
      newFields: Partial<DVRiskFile> & { cr4de_riskfilesid: string }
    ) => api.updateRiskFile(newFields.cr4de_riskfilesid, newFields),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [DataTable.RISK_FILE],
      });
    },
  });

  return (
    <LeftBorderSection sx={{ py: 1, mb: 2, ml: 0 }}>
      <HTMLEditor
        initialHTML={def}
        originalHTML={riskSummary.cr4de_definition || ""}
        editableRole="analist"
        isEditable={environment === Environment.DYNAMIC}
        onSave={async (newDef: string) => {
          if (
            riskSummary.cr4de_risk_file instanceof Object &&
            "cr4de_riskfilesid" in riskSummary.cr4de_risk_file
          ) {
            setDef(newDef);

            api.createChangeLog({
              "cr4de_changed_by@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
              cr4de_changed_by_email: user?.emailaddress1,
              cr4de_changed_object_type: "RISK_FILE",
              cr4de_changed_object_id: riskSummary._cr4de_risk_file_value,
              cr4de_change_short: `Changed definition`,
              cr4de_diff: serializeChangeLogDiff([
                {
                  property: `cr4de_definition`,
                  originalValue: riskSummary.cr4de_definition,
                  newValue: newDef,
                },
              ]),
            });

            mutation.mutate({
              cr4de_riskfilesid: riskSummary.cr4de_risk_file
                .cr4de_riskfilesid as string,
              cr4de_definition: newDef,
            });
          }
        }}
      />
    </LeftBorderSection>
  );
}
