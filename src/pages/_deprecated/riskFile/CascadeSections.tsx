import React, { MutableRefObject, useMemo } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Stack, Box, Typography, Paper, Divider } from "@mui/material";
import { DVRiskFile } from "../../types/dataverse/DVRiskFile";
import { SmallRisk } from "../../types/dataverse/DVSmallRisk";
import { DVRiskCascade } from "../../types/dataverse/DVRiskCascade";
import TransferList from "../../components/TransferList";
import Attachments from "../../components/Attachments";
import FeedbackList from "./ValidationList";
import useAPI from "../../hooks/useAPI";
import { DVValidation } from "../../types/dataverse/DVValidation";
import { DVAttachment } from "../../types/dataverse/DVAttachment";
import { DVContact } from "../../types/dataverse/DVContact";

function CascadeSections({
  riskFile,
  otherHazards,
  causes,
  effects,
  catalysing,

  validations,
  attachments,
  feedbackRefs,

  setIsSaving,

  getAllCauses,
  getEffects,
  getAttachments,
  getValidations,
}: {
  riskFile: DVRiskFile | null;
  otherHazards: SmallRisk[] | null;
  causes: DVRiskCascade<SmallRisk>[] | null;
  effects: DVRiskCascade<undefined, SmallRisk>[] | null;
  catalysing: DVRiskCascade<SmallRisk>[] | null;

  validations: DVValidation<undefined, DVContact>[] | null;
  attachments: DVAttachment[] | null;
  feedbackRefs: MutableRefObject<Partial<DVValidation<unknown, unknown>>[]>;

  setIsSaving: (isSaving: boolean) => void;

  getAllCauses: ({ query }: { query: string }) => Promise<unknown>;
  getEffects: ({ query }: { query: string }) => Promise<unknown>;
  getAttachments: ({ query }: { query: string }) => Promise<unknown>;
  getValidations: () => Promise<unknown>;
}) {
  const api = useAPI();

  // Calculate transfer list data (causes, effects, catalysing effect) and memorize for efficiency
  const causesChoises = useMemo<SmallRisk[]>(
    () =>
      otherHazards && causes
        ? otherHazards
            .filter(
              (rf) =>
                rf.cr4de_risk_type !== "Emerging Risk" &&
                !causes.find((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid)
            )
            .sort((a, b) => {
              return a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id);
            })
        : [],
    [causes, otherHazards]
  );
  const causesChosen = useMemo(
    () =>
      causes
        ? causes
            .map((c) => ({
              ...c.cr4de_cause_hazard,
              cascadeId: c.cr4de_bnrariskcascadeid,
              reason: c.cr4de_reason,
            }))
            .sort((a, b) => a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id))
        : [],
    [causes]
  );

  const effectsChoices = useMemo<SmallRisk[]>(
    () =>
      otherHazards && effects
        ? otherHazards
            .filter(
              (rf) =>
                rf.cr4de_risk_type === "Standard Risk" &&
                !effects.find((c) => c._cr4de_effect_hazard_value === rf.cr4de_riskfilesid)
            )
            .sort((a, b) => a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id))
        : [],
    [effects, otherHazards]
  );
  const effectsChosen = useMemo(
    () =>
      effects
        ? effects
            .map((c) => ({
              ...c.cr4de_effect_hazard,
              cascadeId: c.cr4de_bnrariskcascadeid,
              reason: c.cr4de_reason,
            }))
            .sort((a, b) => a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id))
        : [],
    [effects]
  );

  const catalyserChoices = useMemo<SmallRisk[]>(
    () =>
      otherHazards && catalysing
        ? otherHazards
            .filter(
              (rf) =>
                rf.cr4de_risk_type === "Emerging Risk" &&
                !catalysing.find((c) => c._cr4de_cause_hazard_value === rf.cr4de_riskfilesid)
            )
            .sort((a, b) => a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id))
        : [],
    [catalysing, otherHazards]
  );
  const catalyserChosen = useMemo(
    () =>
      catalysing
        ? catalysing
            .map((c) => ({
              ...c.cr4de_cause_hazard,
              cascadeId: c.cr4de_bnrariskcascadeid,
              reason: c.cr4de_reason,
            }))
            .sort((a, b) => a.cr4de_hazard_id.localeCompare(b.cr4de_hazard_id))
        : [],
    [catalysing]
  );

  return (
    <>
      {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
        <Paper>
          <Box p={2} my={8}>
            <Stack direction="row">
              <Typography variant="h6" mb={1} color="primary">
                5. Causing Hazards
              </Typography>
            </Stack>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                This section identifies other hazards in the BNRA hazard catalogue that may cause the current hazard. A
                short reason should be provided for each non-trivial causal relation.
              </Typography>
              <Typography variant="caption" paragraph>
                On the left are the hazards that were identified by NCCN analist as being a potential cause. On the
                right are all the other hazards in the hazard catalogue. The definition of a hazard selected in the
                windows below can be found beneath the comment box.
              </Typography>
            </Box>

            {causes !== null && otherHazards !== null && (
              <TransferList
                choices={causesChoises}
                chosen={causesChosen}
                choicesLabel="Non-causing hazards"
                chosenLabel="Causing hazards"
                chosenSubheader={`${causes.length} causes identified`}
                onAddChosen={async (chosen) => {
                  setIsSaving(true);
                  await api.createCascade({
                    "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${chosen.cr4de_riskfilesid})`,
                    "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
                  });
                  await getAllCauses({
                    query: `$filter=_cr4de_effect_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
                onRemoveChosen={async (chosen) => {
                  setIsSaving(true);
                  await api.deleteCascade(chosen.cascadeId);
                  await getAllCauses({
                    query: `$filter=_cr4de_effect_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
                onChangeReason={async (chosen, newReason) => {
                  setIsSaving(true);
                  await api.updateCascade(chosen.cascadeId, {
                    cr4de_reason: newReason,
                  });
                  await getAllCauses({
                    query: `$filter=_cr4de_effect_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
              />
            )}

            <Attachments
              attachments={attachments}
              riskFile={riskFile}
              field="causes"
              onUpdate={() =>
                getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
              }
            >
              <Box sx={{ mx: 0, my: 4 }}>
                <FeedbackList
                  validations={validations}
                  field="causes"
                  feedbackRefs={feedbackRefs}
                  reloadValidations={getValidations}
                />
              </Box>
            </Attachments>
          </Box>
        </Paper>
      )}

      {riskFile && riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
        <Paper>
          <Box p={2} my={8}>
            <Typography variant="h6" mb={1} color="primary">
              3. Malicious Actions
            </Typography>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                This section tries to identify potential malicious actions in the BNRA hazard catalogue that may be
                taken by the actors described by this hazard. A short reason should be provided for each non-evident
                action.
              </Typography>
              <Typography variant="caption" paragraph>
                On the left are the hazards that were identified by NCCN analist as being a potential malicious actions.
                On the right are all the other malicious actions in the hazard catalogue. The definition of a hazard
                selected in the windows below can be found beneath the comment box.
              </Typography>
            </Box>

            {effects !== null && otherHazards !== null && (
              <TransferList
                choices={effectsChoices}
                chosen={effectsChosen}
                choicesLabel="Non-potential action hazards"
                chosenLabel="Potential action hazards"
                chosenSubheader={`${effects.length} potential actions identified`}
                onAddChosen={async (chosen) => {
                  setIsSaving(true);
                  await api.createCascade({
                    "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
                    "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${chosen.cr4de_riskfilesid})`,
                  });
                  await getEffects({
                    query: `$filter=_cr4de_cause_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
                onRemoveChosen={async (chosen) => {
                  setIsSaving(true);
                  await api.deleteCascade(chosen.cascadeId);
                  await getEffects({
                    query: `$filter=_cr4de_cause_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
                onChangeReason={async (chosen, newReason) => {
                  setIsSaving(true);
                  await api.updateCascade(chosen.cascadeId, {
                    cr4de_reason: newReason,
                  });
                  await getEffects({
                    query: `$filter=_cr4de_cause_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
              />
            )}

            <Attachments
              attachments={attachments}
              riskFile={riskFile}
              field="effects"
              onUpdate={() =>
                getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
              }
            >
              <Box sx={{ mx: 0, my: 4 }}>
                <FeedbackList
                  validations={validations}
                  field="effects"
                  feedbackRefs={feedbackRefs}
                  reloadValidations={getValidations}
                />
              </Box>
            </Attachments>
          </Box>
        </Paper>
      )}

      {riskFile && riskFile.cr4de_risk_type === "Standard Risk" && (
        <Paper>
          <Box p={2} my={8}>
            <Typography variant="h6" mb={1} color="primary">
              6. Effect Hazards
            </Typography>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                This section identifies other hazards in the BNRA hazard catalogue that may be a direct consequence of
                the current hazard. A short reason should be provided for each non-trivial causal relation.
              </Typography>
              <Typography variant="caption" paragraph>
                On the left are the hazards that were identified by NCCN analist as being a potential effect. On the
                right are all the other hazards in the hazard catalogue. The definition of a hazard selected in the
                windows below can be found beneath the comment box.
              </Typography>
            </Box>

            {effects !== null && otherHazards !== null && (
              <TransferList
                choices={effectsChoices}
                chosen={effectsChosen}
                choicesLabel="Non-effect hazards"
                chosenLabel="Effect hazards"
                chosenSubheader={`${effects.length} effects identified`}
                onAddChosen={async (chosen) => {
                  setIsSaving(true);
                  await api.createCascade({
                    "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
                    "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${chosen.cr4de_riskfilesid})`,
                  });
                  await getEffects({
                    query: `$filter=_cr4de_cause_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
                onRemoveChosen={async (chosen) => {
                  setIsSaving(true);
                  await api.deleteCascade(chosen.cascadeId);
                  await getEffects({
                    query: `$filter=_cr4de_cause_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
                onChangeReason={async (chosen, newReason) => {
                  setIsSaving(true);
                  await api.updateCascade(chosen.cascadeId, {
                    cr4de_reason: newReason,
                  });
                  await getEffects({
                    query: `$filter=_cr4de_cause_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
              />
            )}

            <Attachments
              attachments={attachments}
              riskFile={riskFile}
              field="effects"
              onUpdate={() =>
                getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
              }
            >
              <Box sx={{ mx: 0, my: 4 }}>
                <FeedbackList
                  validations={validations}
                  field="effects"
                  feedbackRefs={feedbackRefs}
                  reloadValidations={getValidations}
                />
              </Box>
            </Attachments>
          </Box>
        </Paper>
      )}

      {riskFile && riskFile.cr4de_risk_type === "Emerging Risk" && (
        <Paper>
          <Box p={2} my={8}>
            <Typography variant="h6" mb={1} color="primary">
              3. Catalysing effects
            </Typography>
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                This section tries to identify other hazards in the BNRA hazard catalogue that may be catalysed by the
                current emerging risk (this means in the future it may affect the probability and/or impact of the other
                hazard). A short reason may be provided for each non-trivial causal relation.
              </Typography>
              <Typography variant="caption" paragraph>
                On the left are the hazards that may experience a catalysing effect. On the right are all the other
                risks in the hazard catalogue. The definition of a hazard selected in the windows below can be found
                beneath the comment box.
              </Typography>
            </Box>

            {effects !== null && otherHazards !== null && (
              <TransferList
                choices={effectsChoices}
                chosen={effectsChosen}
                choicesLabel="Non-effect hazards"
                chosenLabel="Effect hazards"
                chosenSubheader={`${effects.length} effects identified`}
                onAddChosen={async (chosen) => {
                  setIsSaving(true);
                  await api.createCascade({
                    "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
                    "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${chosen.cr4de_riskfilesid})`,
                  });
                  await getEffects({
                    query: `$filter=_cr4de_cause_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
                onRemoveChosen={async (chosen) => {
                  setIsSaving(true);
                  await api.deleteCascade(chosen.cascadeId);
                  await getEffects({
                    query: `$filter=_cr4de_cause_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
                onChangeReason={async (chosen, newReason) => {
                  setIsSaving(true);
                  await api.updateCascade(chosen.cascadeId, {
                    cr4de_reason: newReason,
                  });
                  await getEffects({
                    query: `$filter=_cr4de_cause_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_effect_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
              />
            )}

            <Attachments
              attachments={attachments}
              riskFile={riskFile}
              field="effects"
              onUpdate={() =>
                getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
              }
            >
              <Box sx={{ mx: 0, my: 4 }}>
                <FeedbackList
                  validations={validations}
                  field="effects"
                  feedbackRefs={feedbackRefs}
                  reloadValidations={getValidations}
                />
              </Box>
            </Attachments>
          </Box>
        </Paper>
      )}

      {riskFile && riskFile.cr4de_risk_type !== "Emerging Risk" && (
        <Paper>
          <Box p={2} my={8}>
            {riskFile.cr4de_risk_type === "Standard Risk" && (
              <Typography variant="h6" mb={1} color="primary">
                7. Catalysing Effects
              </Typography>
            )}
            {riskFile.cr4de_risk_type === "Malicious Man-made Risk" && (
              <Typography variant="h6" mb={1} color="primary">
                4. Catalysing Effects
              </Typography>
            )}
            <Divider />

            <Box mt={1}>
              <Typography variant="caption" paragraph>
                This section tries to identifies the emerging risks in the BNRA hazard catalogue that may catalyse the
                current hazard (this means in the future it may have an effect on the probability and/or impact of this
                hazard). A short reason may be provided for each non-trivial causal relation.
              </Typography>
              <Typography variant="caption" paragraph>
                On the left are the hazards that were identified by NCCN analists as having a potential catalysing
                effect. On the right are all the other emerging risks in the hazard catalogue. The definition of a
                hazard selected in the windows below can be found beneath the comment box.
              </Typography>
            </Box>

            {catalysing !== null && otherHazards !== null && (
              <TransferList
                choices={catalyserChoices}
                chosen={catalyserChosen}
                choicesLabel="Non-catalysing hazards"
                chosenLabel="Catalysing hazards"
                chosenSubheader={`${catalysing.length} catalysing effects identified`}
                onAddChosen={async (chosen) => {
                  setIsSaving(true);
                  await api.createCascade({
                    "cr4de_cause_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${chosen.cr4de_riskfilesid})`,
                    "cr4de_effect_hazard@odata.bind": `https://bnra.powerappsportals.com/_api/cr4de_riskfileses(${riskFile.cr4de_riskfilesid})`,
                  });
                  await getAllCauses({
                    query: `$filter=_cr4de_effect_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
                onRemoveChosen={async (chosen) => {
                  setIsSaving(true);
                  await api.deleteCascade(chosen.cascadeId);
                  await getAllCauses({
                    query: `$filter=_cr4de_effect_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
                onChangeReason={async (chosen, newReason) => {
                  setIsSaving(true);
                  await api.updateCascade(chosen.cascadeId, {
                    cr4de_reason: newReason,
                  });
                  await getAllCauses({
                    query: `$filter=_cr4de_effect_hazard_value eq ${riskFile?.cr4de_riskfilesid}&$expand=cr4de_cause_hazard($select=cr4de_riskfilesid,cr4de_title,cr4de_hazard_id,cr4de_risk_type,cr4de_definition)`,
                  });
                  setIsSaving(false);
                }}
              />
            )}

            <Attachments
              attachments={attachments}
              riskFile={riskFile}
              field="catalysing_effects"
              onUpdate={() =>
                getAttachments({ query: `$filter=_cr4de_risk_file_value eq ${riskFile.cr4de_riskfilesid}` })
              }
            >
              <Box sx={{ mx: 0, my: 4 }}>
                <FeedbackList
                  validations={validations}
                  field="catalysing_effects"
                  feedbackRefs={feedbackRefs}
                  reloadValidations={getValidations}
                />
              </Box>
            </Attachments>
          </Box>
        </Paper>
      )}
    </>
  );
}

export default React.memo(CascadeSections);
