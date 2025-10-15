import { DVCascadeSnapshot } from "../../types/dataverse/DVCascadeSnapshot";
import { DVRiskSnapshot } from "../../types/dataverse/DVRiskSnapshot";
import { ReactNode, useState } from "react";
import RiskDataAccordion from "./RiskDataAccordion";
import {
  Alert,
  Box,
  CircularProgress,
  Link,
  SnackbarContent,
  Stack,
  Typography,
} from "@mui/material";
import CascadeSankey from "./CascadeSankey";
import CascadeMatrix from "./CascadeMatrix";
import HTMLEditor from "../../components/HTMLEditor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CPMatrixCauseRow,
  DVRiskCascade,
  parseCPMatrix,
  serializeCPMatrix,
} from "../../types/dataverse/DVRiskCascade";
import useAPI, { DataTable } from "../../hooks/useAPI";
import LeftBorderSection from "../../components/LeftBorderSection";
import { useOutletContext } from "react-router-dom";
import { Environment } from "../../types/global";
import { SCENARIOS } from "../../functions/scenarios";
import { RISK_TYPE } from "../../types/dataverse/Riskfile";
import {
  mScale3FromPDaily,
  mScale7FromPDaily,
} from "../../functions/indicators/motivation";
import {
  cpScale5FromPAbs,
  cpScale7FromPAbs,
} from "../../functions/indicators/cp";
import { serializeChangeLogDiff } from "../../types/dataverse/DVChangeLog";
import { RiskFilePageContext } from "../BaseRiskFilePage";

export type VISUALS = "SANKEY" | "MATRIX";

export function CascadeSection({
  cause,
  effect,
  cascade,
  subtitle = null,
  visuals,
  disabled = false,
  disabledMessage,
  isAttackOtherCause,
}: {
  cause: DVRiskSnapshot;
  effect: DVRiskSnapshot;
  cascade: DVCascadeSnapshot<unknown, unknown, unknown>;
  subtitle?: ReactNode;
  visuals: VISUALS;
  disabled?: boolean;
  disabledMessage?: string;
  isAttackOtherCause?: boolean;
}) {
  const api = useAPI();
  const queryClient = useQueryClient();
  const { user, environment, showDiff, publicCascades } =
    useOutletContext<RiskFilePageContext>();

  const [quali, setQuali] = useState<string>(cascade.cr4de_quali || "");
  const [cpMatrix, setCPMatrix] = useState<CPMatrixCauseRow>(
    parseCPMatrix(serializeCPMatrix(cascade.cr4de_quanti_cp))
  );
  const [runningUpdateCount, setRunningUpdateCount] = useState(0);

  const mutation = useMutation({
    mutationFn: async (
      newC: Partial<DVRiskCascade> & { cr4de_bnrariskcascadeid: string }
    ) => api.updateCascade(newC.cr4de_bnrariskcascadeid, newC),
    onMutate: () => setRunningUpdateCount((c) => c + 1),
    onSettled: () => setRunningUpdateCount((c) => Math.max(0, c - 1)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [DataTable.RISK_CASCADE],
      });
    },
  });

  const publicCascade = publicCascades?.all.find(
    (c) => c._cr4de_risk_cascade_value === cascade._cr4de_risk_cascade_value
  );

  const handleChange = async (
    causeScenario: SCENARIOS,
    effectScenario: SCENARIOS,
    newCPAbs: number
  ) => {
    if (!user?.roles.analist) return;

    const isActorCause = cause.cr4de_risk_type === RISK_TYPE.MANMADE;

    const updatedCPMatrix = parseCPMatrix(
      serializeCPMatrix(cpMatrix || cascade.cr4de_quanti_cp)
    );
    updatedCPMatrix[causeScenario][effectScenario] = {
      abs: newCPAbs,
      scale5: isActorCause
        ? Math.round(10 * mScale3FromPDaily(newCPAbs)) / 10
        : Math.round(10 * cpScale5FromPAbs(newCPAbs)) / 10,
      scale7: isActorCause
        ? Math.round(10 * mScale7FromPDaily(newCPAbs)) / 10
        : Math.round(10 * cpScale7FromPAbs(newCPAbs)) / 10,
    };
    setCPMatrix(updatedCPMatrix);

    api.createChangeLog({
      "cr4de_changed_by@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
      cr4de_changed_by_email: user?.emailaddress1,
      cr4de_changed_object_type: "CASCADE",
      cr4de_changed_object_id: cascade._cr4de_risk_cascade_value,
      cr4de_change_short: `${causeScenario} ${cause.cr4de_title} causes ${effectScenario} ${effect.cr4de_title}: CP${cascade.cr4de_quanti_cp[causeScenario][effectScenario].scale7} -> CP${updatedCPMatrix[causeScenario][effectScenario].scale7}`,
      cr4de_diff: serializeChangeLogDiff([
        {
          property: `cr4de_quanti_input.${causeScenario}.${effectScenario}.abs`,
          originalValue:
            cascade.cr4de_quanti_cp[causeScenario][effectScenario].abs,
          newValue: updatedCPMatrix[causeScenario][effectScenario].abs,
        },
        {
          property: `cr4de_quanti_input.${causeScenario}.${effectScenario}.scale5`,
          originalValue:
            cascade.cr4de_quanti_cp[causeScenario][effectScenario].scale5,
          newValue: updatedCPMatrix[causeScenario][effectScenario].scale5,
        },
        {
          property: `cr4de_quanti_input.${causeScenario}.${effectScenario}.scale7`,
          originalValue:
            cascade.cr4de_quanti_cp[causeScenario][effectScenario].scale7,
          newValue: updatedCPMatrix[causeScenario][effectScenario].scale7,
        },
      ]),
    });

    mutation.mutate({
      cr4de_bnrariskcascadeid: cascade._cr4de_risk_cascade_value,
      cr4de_quanti_input: serializeCPMatrix(updatedCPMatrix),
    });
  };

  return (
    <RiskDataAccordion
      title={
        <Stack direction="row" alignItems="center">
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
            {isAttackOtherCause ? "increases the probability of" : "causes"}{" "}
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
        {disabledMessage && (
          <Alert
            severity="info"
            sx={{
              my: 2,
              width: 1000,
              maxWidth: "calc(100% - 32px)",
              mx: "auto",
            }}
          >
            {disabledMessage}
          </Alert>
        )}
        {visuals === "SANKEY" ? (
          <CascadeSankey
            cause={cause}
            effect={effect}
            cascade={cascade}
            onChange={
              environment === Environment.DYNAMIC && !disabled
                ? handleChange
                : undefined
            }
          />
        ) : (
          <CascadeMatrix
            cause={cause}
            effect={effect}
            cascade={cascade}
            compareCascade={
              environment === Environment.DYNAMIC && showDiff
                ? publicCascade
                : undefined
            }
            onChange={
              environment === Environment.DYNAMIC && !disabled
                ? handleChange
                : undefined
            }
          />
        )}

        <Box sx={{ pt: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, ml: 2 }}>
            Consolidated Qualitative Input:
          </Typography>
          <LeftBorderSection sx={{ py: 1, mb: 2 }}>
            <HTMLEditor
              initialHTML={quali}
              originalHTML={
                publicCascade ? publicCascade.cr4de_quali || "" : undefined
              }
              editableRole="analist"
              isEditable={environment === Environment.DYNAMIC}
              onSave={async (newQuali: string) => {
                setQuali(newQuali);

                api.createChangeLog({
                  "cr4de_changed_by@odata.bind": `https://bnra.powerappsportals.com/_api/contacts(${user?.contactid})`,
                  cr4de_changed_by_email: user?.emailaddress1,
                  cr4de_changed_object_type: "CASCADE",
                  cr4de_changed_object_id: cascade._cr4de_risk_cascade_value,
                  cr4de_change_short: `Quali description of ${cause.cr4de_title} -> ${effect.cr4de_title}`,
                  cr4de_diff: serializeChangeLogDiff([
                    {
                      property: `cr4de_quali`,
                      originalValue: cascade.cr4de_quali,
                      newValue: newQuali,
                    },
                  ]),
                });

                mutation.mutate({
                  cr4de_bnrariskcascadeid: cascade._cr4de_risk_cascade_value,
                  cr4de_quali: newQuali,
                });
              }}
            />
          </LeftBorderSection>
        </Box>
      </Stack>
      {runningUpdateCount > 0 && (
        <SnackbarContent
          message="Updating CP values"
          action={<CircularProgress size={18} sx={{ mr: 2 }} />}
          sx={{
            maxWidth: 200,
            position: "fixed",
            left: "auto",
            right: 20,
            bottom: 80,
            zIndex: 10000,
          }}
        />
      )}
    </RiskDataAccordion>
  );
}
