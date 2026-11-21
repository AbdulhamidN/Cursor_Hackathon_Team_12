import { API_PREFIX, HEALTH_PATH } from '@ecb/contracts';
import type { ModuleId } from '@ecb/shared';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './common/middleware/error-handler';
import { requestLogger } from './common/middleware/request-logger';
import { scopeToPrefixes } from './common/middleware/route-scope';
import { env } from './config/env';
import { createHealthRouter } from './health/health.router';
import { apiModules } from './modules';

/** Builds the Express app without starting a server, so tests can call it directly. */
export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()) }));
  app.use(express.json());
  if (env.NODE_ENV !== 'test') app.use(requestLogger);

  const api = express.Router();
  api.use(HEALTH_PATH, createHealthRouter(Object.keys(apiModules) as ModuleId[]));
  for (const { router, prefixes } of Object.values(apiModules)) {
    api.use(scopeToPrefixes(prefixes, router));
  }
  app.use(API_PREFIX, api);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
