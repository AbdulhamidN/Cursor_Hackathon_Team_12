import express, { Router } from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { scopeToPrefixes } from './route-scope';

function buildApp() {
  // A module that guards all of its routes and also tries to serve a route it does not own.
  const moduleRouter = Router();
  moduleRouter.use((_req, res, next) => {
    res.setHeader('X-Module-Guard', 'ran');
    next();
  });
  moduleRouter.get('/orders/:id', (_req, res) => res.json({ handledBy: 'module' }));
  moduleRouter.get('/listings', (_req, res) => res.json({ handledBy: 'module' }));

  const app = express();
  app.use(scopeToPrefixes(['/orders'], moduleRouter));
  app.get('/listings', (_req, res) => res.json({ handledBy: 'owner' }));
  app.get('/orders-archive', (_req, res) => res.json({ handledBy: 'owner' }));
  return app;
}

describe('scopeToPrefixes', () => {
  it('lets the module handle requests under its own prefix', async () => {
    const response = await request(buildApp()).get('/orders/42');

    expect(response.body).toEqual({ handledBy: 'module' });
    expect(response.headers['x-module-guard']).toBe('ran');
  });

  it('keeps the module and its middleware away from other prefixes', async () => {
    const response = await request(buildApp()).get('/listings');

    expect(response.body).toEqual({ handledBy: 'owner' });
    expect(response.headers['x-module-guard']).toBeUndefined();
  });

  it('does not treat a longer path segment as the same prefix', async () => {
    const response = await request(buildApp()).get('/orders-archive');

    expect(response.body).toEqual({ handledBy: 'owner' });
  });
});
