/** The five account roles of the platform. Stored and sent over the API in this lowercase form. */
export const USER_ROLES = ['farmer', 'buyer', 'admin', 'exporter', 'cooperative'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  farmer: 'Farmer',
  buyer: 'Buyer',
  admin: 'Admin',
  exporter: 'Exporter',
  cooperative: 'Cooperative',
};

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value);
}
