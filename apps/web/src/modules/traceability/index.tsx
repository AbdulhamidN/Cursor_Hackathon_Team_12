import { ModuleLanding } from '../../shared/components/ModuleLanding';
import type { WebModule } from '../../shared/module';

/**
 * Module 4 - Coffee Traceability & Value Chain.
 *
 * Public entry of the module: the only file other modules may import from.
 * Top-level path reserved for this module: /traceability.
 */
export const traceabilityModule: WebModule = {
  id: 'traceability',
  navLabel: 'Traceability',
  homePath: '/traceability',
  routes: [{ path: 'traceability', element: <ModuleLanding moduleId="traceability" /> }],
};
