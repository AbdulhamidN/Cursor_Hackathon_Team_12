import type { HealthData } from '@ecb/contracts';
import type { ModuleId } from '@ecb/shared';
import { Router } from 'express';
import { sendSuccess } from '../common/http';
import { getDatabaseStatus } from '../config/database';
import { env } from '../config/env';

/**
 * Health check. It always answers 200 while the process is alive; `status`
 * is `degraded` when MongoDB is not connected.
 */
export function createHealthRouter(mountedModules: ModuleId[]): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    const database = getDatabaseStatus();
    const data: HealthData = {
      status: database === 'connected' ? 'ok' : 'degraded',
      service: 'ecb-api',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      database,
      gemini: env.GEMINI_API_KEY ? 'configured' : 'not_configured',
      modules: mountedModules,
    };
    sendSuccess(res, data);
  });

  return router;
}
