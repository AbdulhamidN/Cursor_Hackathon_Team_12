import type { ModuleId } from '@ecb/shared';
import type { RouteObject } from 'react-router';

/** What each feature module exposes to the app shell from its `index.tsx`. */
export interface WebModule {
  id: ModuleId;
  /** Text of the module's link in the main navigation. */
  navLabel: string;
  /** Path of the module's entry page, the target of its navigation link. */
  homePath: string;
  /** The module's routes, rendered inside the shared app layout. */
  routes: RouteObject[];
}
