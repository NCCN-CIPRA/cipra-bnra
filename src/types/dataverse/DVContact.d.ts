export interface DVContact<ParticipationsType = undefined, InvitationType = undefined> {
  contactid: string;

  emailaddress1: string;
  firstname?: string;
  lastname?: string;

  msdyn_portaltermsagreementdate?: Date;

  admin: boolean?;

  invitations?: InvitationType;
  participations: ParticipationsType;
}
