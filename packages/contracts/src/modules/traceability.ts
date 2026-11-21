/**
 * Module 4 - Coffee Traceability & Value Chain: API contracts.
 *
 * Route prefixes reserved for this module, relative to API_PREFIX.
 * Add this module's request/response DTO types to this file.
 */
export const TRACEABILITY_API = {
  farms: '/farms',
  harvests: '/harvests',
  lots: '/lots',
  cooperatives: '/cooperatives',
  exports: '/exports',
  certificates: '/certificates',
} as const;
