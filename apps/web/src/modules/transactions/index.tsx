import { ModuleLanding } from '../../shared/components/ModuleLanding';
import type { WebModule } from '../../shared/module';

/**
 * Module 3 - Transactions, Payments & Trust.
 *
 * Public entry of the module: the only file other modules may import from.
 * Top-level paths reserved for this module: /orders, /checkout.
 */
export const transactionsModule: WebModule = {
  id: 'transactions',
  navLabel: 'Orders',
  homePath: '/orders',
  routes: [{ path: 'orders', element: <ModuleLanding moduleId="transactions" /> }],
};
