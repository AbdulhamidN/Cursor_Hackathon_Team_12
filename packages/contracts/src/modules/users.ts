/**
 * Module 1 - User & Platform Management: API contracts.
 *
 * Route prefixes reserved for this module, relative to API_PREFIX.
 * Add this module's request/response DTO types to this file.
 */
export const USERS_API = {
  auth: '/auth',
  users: '/users',
  admin: '/admin',
} as const;
