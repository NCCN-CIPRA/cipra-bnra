import { Stack } from "@mui/material";
import ParticipationGraph from "./ParticipationGraph";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";
import {
  DVValidation,
  ValidationEditableFields,
  VALIDATION_EDITABLE_FIELDS,
} from "../../../types/dataverse/DVValidation";
import { SelectableContact } from "./Selectables";
import RiskFileGraph from "./RiskFileGraph";
import ExpertGraph from "./ExpertGraph";
import { useEffect, useState } from "react";

export default function GraphView({
  participations,
}: {
  participations: DVParticipation<SelectableContact, DVRiskFile, DVValidation>[];
}) {
  const [expertParticipants, setExpertParticipants] = useState<
    DVParticipation<SelectableContact, DVRiskFile, DVValidation>[] | null
  >(null);

  useEffect(() => {
    const analists: { [key: string]: boolean } = {};
    participations.forEach((p) => {
      if (p.cr4de_role === "analist" || p.cr4de_role === "analist_2") {
        analists[p._cr4de_contact_value] = true;
      }
    });

    setExpertParticipants(participations.filter((p) => !analists[p._cr4de_contact_value]));
  }, [participations]);

  if (!expertParticipants) return null;

  return (
    <Stack spacing={8} alignItems="center">
      <RiskFileGraph participations={expertParticipants} />
      <ExpertGraph participations={expertParticipants} />
      <ParticipationGraph participations={expertParticipants} />
    </Stack>
  );
}
