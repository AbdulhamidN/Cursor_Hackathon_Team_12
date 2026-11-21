import type { ApiSuccess, HealthData } from '@ecb/contracts';
import { MODULES } from '@ecb/shared';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { routes } from './routes';

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
}

function stubHealthResponse() {
  const body: ApiSuccess<HealthData> = {
    success: true,
    data: {
      status: 'ok',
      service: 'ecb-api',
      environment: 'test',
      timestamp: new Date().toISOString(),
      uptimeSeconds: 1,
      database: 'connected',
      gemini: 'not_configured',
      modules: ['users', 'marketplace', 'transactions', 'traceability'],
    },
  };
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json(body)),
  );
}

describe('web app shell', () => {
  it('shows the API status and a link to every module on the home page', async () => {
    stubHealthResponse();
    renderAt('/');

    expect(await screen.findByText('API online. Database connected.')).toBeDefined();
    for (const label of ['Account', 'Marketplace', 'Orders', 'Traceability']) {
      expect(screen.getByRole('link', { name: label })).toBeDefined();
    }
  });

  it.each([
    ['/account', MODULES.users.name],
    ['/marketplace', MODULES.marketplace.name],
    ['/orders', MODULES.transactions.name],
    ['/traceability', MODULES.traceability.name],
  ])('renders the module mounted at %s', (path, moduleName) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1, name: moduleName })).toBeDefined();
  });

  it('shows the not-found page for an unknown path', () => {
    renderAt('/no-such-page');
    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeDefined();
  });
});
