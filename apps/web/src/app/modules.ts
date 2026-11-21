import { marketplaceModule } from '../modules/marketplace';
import { traceabilityModule } from '../modules/traceability';
import { transactionsModule } from '../modules/transactions';
import { usersModule } from '../modules/users';
import type { WebModule } from '../shared/module';

/**
 * The module registry of the web app. This is a shared file: module owners
 * add routes inside their own module folder and never need to edit it.
 */
export const webModules: WebModule[] = [
  usersModule,
  marketplaceModule,
  transactionsModule,
  traceabilityModule,
];
