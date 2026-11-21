import { ModuleLanding } from '../../shared/components/ModuleLanding';
import type { WebModule } from '../../shared/module';

/**
 * Module 1 - User & Platform Management.
 *
 * Public entry of the module: the only file other modules may import from.
 * Top-level paths reserved for this module: /account, /auth, /admin.
 */
export const usersModule: WebModule = {
  id: 'users',
  navLabel: 'Account',
  homePath: '/account',
  routes: [{ path: 'account', element: <ModuleLanding moduleId="users" /> }],
};
