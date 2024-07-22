export const DB_NAME = "TODO";

/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
export const UserRolesEnum = {
  USER: "USER",
  ADMIN: "ADMIN",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const UserGenderEnum = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
};

export const AvailableUserGender = Object.values(UserGenderEnum);
