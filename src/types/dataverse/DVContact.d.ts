export enum PORTAL_LANGUAGE {
  NL = "ac9a883c-922a-47ba-8b45-601a4e00fbea",
  EN = "97a882f0-e026-45ca-b39d-48be56aae76b",
  FR = "b57b751e-3f93-4585-8e5b-1e3dd2916c0a",
  DE = "7120ce8b-903d-45e8-aba9-3feb735803ca",
}

export interface DVContact<
  ParticipationsType = unknown,
  InvitationType = unknown
> {
  contactid: string;

  emailaddress1: string;
  firstname?: string;
  lastname?: string;
  adx_organizationname?: string;
  _ownerid_value?: string;
  adx_preferredlanguageid?: string;

  createdon: string;

  msdyn_portaltermsagreementdate?: string | null;
  cr4de_permissions: string;

  admin: boolean?;

  invitations?: InvitationType;
  participations: ParticipationsType;
}
