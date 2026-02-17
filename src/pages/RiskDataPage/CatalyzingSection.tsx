import { useState } from "react";
import { Box, Link, Stack, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { BasePageContext } from "../BasePage";
import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import RiskDataAccordion from "./RiskDataAccordion";
import { Environment } from "../../types/global";
import HTMLEditor from "../../components/HTMLEditor";
import useAPI, { DataTable } from "../../hooks/useAPI";
import { serializeChangeLogDiff } from "../../types/dataverse/DVChangeLog";
import { useMutation } from "@tanstack/react-query";

export function CatalyzingSection({
  riskFile,
  cascade,
}: {
  riskFile: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, DVRiskSnapshot>;
}) {
  const api = useAPI();
  const { user, environment } = useOutletContext<BasePageContext>();

  const [quali, setQuali] = useState<string>(cascade.cr4de_quali || "");

  const mutation = useMutation({
    mutationFn: async (newQuali: string) => {
      setQuali(newQuali);

      api.createChangeLog({
        "cr4de_changed_by@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
        cr4de_changed_by_email: user?.emailaddress1,
        cr4de_changed_object_type: "CASCADE",
        cr4de_changed_object_id: cascade._cr4de_risk_cascade_value,
        cr4de_change_short: `Quali description of catalyzing risk ${cascade.cr4de_cause_risk.cr4de_title}`,
        cr4de_diff: serializeChangeLogDiff([
          {
            property: `cr4de_quali`,
            originalValue: cascade.cr4de_quali,
            newValue: newQuali,
          },
        ]),
      });

      api.updateCascade(cascade._cr4de_risk_cascade_value, {
        cr4de_quali: newQuali,
      });
    },
  });

  // const handleSave = async () => {
  //   setSaving(true);
  //   await api.updateCascade(cascade.cr4de_bnrariskcascadeid, {
  //     cr4de_quali: quali,
  //     cr4de_discussion_required: DiscussionRequired.RESOLVED,
  //   });
  //   await reloadCascades();
  //   setSaving(false);
  //   setOpen(false);
  // };

  return (
    <RiskDataAccordion
      title={
        <>
          <Link
            href={`/learning/risk/${cascade.cr4de_cause_risk._cr4de_risk_file_value}`}
            target="_blank"
          >
            {cascade.cr4de_cause_risk.cr4de_title}
          </Link>
        </>
      }
    >
      <Stack direction="row" sx={{ width: "100%", justifyContent: "stretch" }}>
        <Box sx={{ p: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Final Consensus Results:
          </Typography>
          <HTMLEditor
            initialHTML={quali}
            isEditable={environment === Environment.DYNAMIC}
            onSave={mutation}
            queryKeyToInvalidate={[
              DataTable.RISK_CASCADE,
              riskFile._cr4de_risk_file_value,
            ]}
          />
        </Box>
      </Stack>
    </RiskDataAccordion>
  );
}
