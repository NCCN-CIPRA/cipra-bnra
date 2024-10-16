export interface UserRoles {
  verified: boolean;
  beReader: boolean;
  expert: boolean;
  internal: boolean;
  analist: boolean;
  admin: boolean;
}

export function getAuthRoles(roleString: string) {
  const admin = roleString.indexOf("Beheerders") >= 0;
  const analist = admin || roleString.indexOf("Analisten") >= 0;
  const internal = analist || roleString.indexOf("Intern NCCN") >= 0;
  const expert = analist || roleString.indexOf("Experten") >= 0;
  const beReader =
    internal ||
    expert ||
    roleString.indexOf("Rapport Lezer") >= 0 ||
    roleString.indexOf("Geverifieerde gebruikers") >= 0;
  const verified = beReader || roleString.indexOf("Geverifieerde gebruikers") >= 0;

  return {
    verified,
    beReader,
    expert,
    internal,
    analist,
    admin,
  } as UserRoles;
}
