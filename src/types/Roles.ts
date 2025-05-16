export enum ROLE {
  GLOBAL_ADMIN = "Global Admin",
  ANALIST = "CIPRA Analist",
  READER = "Reader",
  APPROVED = "Approved",
  APPROVE = "Awaiting Approval",
}

export const ROLE_RECORDS = {
  [ROLE.GLOBAL_ADMIN]:
    "https://orge78f67f6.crm4.dynamics.com/api/data/v9.1.0/adx_webroles(79fd05ac-3a3b-ed11-9db1-000d3adf7089)",
  [ROLE.ANALIST]:
    "https://orge78f67f6.crm4.dynamics.com/api/data/v9.1.0/adx_webroles(13c08270-ea44-ef11-a316-7c1e5235d9fe)",
  [ROLE.READER]: "READER",
  [ROLE.APPROVED]: "APPROVE",
  [ROLE.APPROVE]: null,
  // [ROLE.READER]:
  //   "https://orge78f67f6.crm4.dynamics.com/api/data/v9.1.0/adx_webroles(f3433963-142e-ef11-840a-000d3ab66aef)",

  // "adx_name": "Experten",
  // "adx_webroleid": "https://orge78f67f6.crm4.dynamics.com/api/data/v9.1.0/adx_webroles(f4ee1f58-b045-ef11-a316-000d3ab81949)",

  // "adx_name": "Anonieme Gebruikers",
  // "adx_webroleid": "https://orge78f67f6.crm4.dynamics.com/api/data/v9.1.0/adx_webroles(f579dcd2-803f-ed11-9db0-000d3adf7089)",

  // "adx_name": "Geverifieerde gebruikers",
  // "adx_webroleid": "https://orge78f67f6.crm4.dynamics.com/api/data/v9.1.0/adx_webroles(7afd05ac-3a3b-ed11-9db1-000d3adf7089)",

  // "adx_name": "Intern NCCN",
  // "adx_webroleid": "https://orge78f67f6.crm4.dynamics.com/api/data/v9.1.0/adx_webroles(c5841d35-e944-ef11-a316-7c1e5235d9fe)",
};

export const ROLES_REVERSE = (Object.keys(ROLE_RECORDS) as Array<ROLE>).reduce(
  (acc, r) => {
    if (ROLE_RECORDS[r] === null) return acc;

    return { ...acc, [ROLE_RECORDS[r]]: r };
  },
  {} as { [key: string]: ROLE }
);
