/**
 * Module 3 - Transactions, Payments & Trust: API contracts.
 *
 * Route prefixes reserved for this module, relative to API_PREFIX.
 * Add this module's request/response DTO types to this file.
 */
export const TRANSACTIONS_API = {
  orders: '/orders',
  payments: '/payments',
  deliveries: '/deliveries',
  payouts: '/payouts',
  reviews: '/reviews',
  disputes: '/disputes',
} as const;
