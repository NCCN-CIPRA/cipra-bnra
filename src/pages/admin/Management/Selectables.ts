import { DVContact } from "../../../types/dataverse/DVContact";
import { DVInvitation } from "../../../types/dataverse/DVInvitation";
import { DVParticipation } from "../../../types/dataverse/DVParticipation";
import { DVRiskFile } from "../../../types/dataverse/DVRiskFile";

export interface SelectableContact extends DVContact<DVParticipation<undefined, DVRiskFile>[], DVInvitation[]> {
  selected: boolean;
}

export interface SelectableRiskFile extends DVRiskFile {
  selected: boolean;
  participants: DVParticipation<SelectableContact, DVRiskFile>[];
}
