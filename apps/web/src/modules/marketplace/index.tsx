import { ModuleLanding } from '../../shared/components/ModuleLanding';
import type { WebModule } from '../../shared/module';

/**
 * Module 2 - Coffee Marketplace & AI Intelligence.
 *
 * Public entry of the module: the only file other modules may import from.
 * Top-level path reserved for this module: /marketplace.
 */
export const marketplaceModule: WebModule = {
  id: 'marketplace',
  navLabel: 'Marketplace',
  homePath: '/marketplace',
  routes: [{ path: 'marketplace', element: <ModuleLanding moduleId="marketplace" /> }],
};
