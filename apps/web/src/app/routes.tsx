import type { RouteObject } from 'react-router';
import { AppLayout } from './AppLayout';
import { HomePage } from './HomePage';
import { webModules } from './modules';
import { NotFoundPage } from './NotFoundPage';

/** The route tree: the shared layout with every module's routes inside it. */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      ...webModules.flatMap((module) => module.routes),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
