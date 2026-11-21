import type { ModuleId } from '@ecb/shared';

/** GET {API_PREFIX}{HEALTH_PATH} */
export const HEALTH_PATH = '/health';

export type DatabaseStatus = 'connected' | 'connecting' | 'disconnected';

/** `data` of the health-check response. */
export interface HealthData {
  /** `ok` when the API and the database are reachable, `degraded` when the database is not. */
  status: 'ok' | 'degraded';
  service: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
  database: DatabaseStatus;
  /** Whether the server has a Gemini API key. The key itself is never returned. */
  gemini: 'configured' | 'not_configured';
  /** Feature modules mounted in this API instance. */
  modules: ModuleId[];
}
