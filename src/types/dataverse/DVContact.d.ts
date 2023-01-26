export interface DVContact<ParticipationsType = undefined, InvitationType = undefined> {
  contactid: string;

  emailaddress1: string;
  firstname: string;
  lastname: string;

  admin: boolean?;

  invitation?: InvitationType;
  participations: ParticipationsType;
}
