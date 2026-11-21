import { MARKETPLACE_API } from '@ecb/contracts/marketplace';
import { TRACEABILITY_API } from '@ecb/contracts/traceability';
import { TRANSACTIONS_API } from '@ecb/contracts/transactions';
import { USERS_API } from '@ecb/contracts/users';
import type { ModuleId } from '@ecb/shared';
import type { Router } from 'express';
import { marketplaceRouter } from './marketplace';
import { traceabilityRouter } from './traceability';
import { transactionsRouter } from './transactions';
import { usersRouter } from './users';

export interface ApiModule {
  router: Router;
  /** The route prefixes (relative to API_PREFIX) this module's router is allowed to serve. */
  prefixes: readonly string[];
}

/**
 * The module registry, mounted by `app.ts`. This is a shared file: module
 * owners add routes inside their own module folder and reserve new prefixes
 * in their own `@ecb/contracts/<module>` file, so they never need to edit it.
 */
export const apiModules: Record<ModuleId, ApiModule> = {
  users: { router: usersRouter, prefixes: Object.values(USERS_API) },
  marketplace: { router: marketplaceRouter, prefixes: Object.values(MARKETPLACE_API) },
  transactions: { router: transactionsRouter, prefixes: Object.values(TRANSACTIONS_API) },
  traceability: { router: traceabilityRouter, prefixes: Object.values(TRACEABILITY_API) },
};
