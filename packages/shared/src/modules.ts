/**
 * The four feature modules. Each id is also the folder name of the module in
 * `apps/api/src/modules`, `apps/web/src/modules`, `packages/contracts/src/modules`
 * and `packages/validation/src/modules`.
 */
export const MODULE_IDS = ['users', 'marketplace', 'transactions', 'traceability'] as const;

export type ModuleId = (typeof MODULE_IDS)[number];

export interface ModuleInfo {
  id: ModuleId;
  /** Module number used in the docs and in team communication (1-4). */
  number: number;
  name: string;
  summary: string;
}

export const MODULES: Record<ModuleId, ModuleInfo> = {
  users: {
    id: 'users',
    number: 1,
    name: 'User & Platform Management',
    summary: 'Authentication, roles, profiles, permissions, verification and administration.',
  },
  marketplace: {
    id: 'marketplace',
    number: 2,
    name: 'Coffee Marketplace & AI Intelligence',
    summary:
      'Coffee listings, buyer search, AI coffee identification, quality estimation, pricing assistance and recommendations.',
  },
  transactions: {
    id: 'transactions',
    number: 3,
    name: 'Transactions, Payments & Trust',
    summary:
      'Orders, checkout, payments, delivery, farmer payouts, ratings, reviews, disputes and buyer protection.',
  },
  traceability: {
    id: 'traceability',
    number: 4,
    name: 'Coffee Traceability & Value Chain',
    summary:
      'Farm and harvest records, GPS, coffee lot IDs, QR traceability, cooperatives, aggregation, exporter workflows and certificates.',
  },
};
