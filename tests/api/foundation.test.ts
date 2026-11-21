import { createApp } from '@ecb/api/app';
import {
  API_PREFIX,
  HEALTH_PATH,
  type ApiFailure,
  type ApiSuccess,
  type HealthData,
} from '@ecb/contracts';
import { MODULE_IDS } from '@ecb/shared';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

// These tests run the Express app in-process. They do not need MongoDB.
const app = createApp();

describe('API foundation', () => {
  it('answers the health check with the standard success envelope', async () => {
    const response = await request(app).get(`${API_PREFIX}${HEALTH_PATH}`);
    const body = response.body as ApiSuccess<HealthData>;

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.service).toBe('ecb-api');
    // No database connection is opened in this test.
    expect(body.data.database).toBe('disconnected');
    expect(body.data.status).toBe('degraded');
    expect(Number.isNaN(Date.parse(body.data.timestamp))).toBe(false);
  });

  it('mounts all four feature modules', async () => {
    const response = await request(app).get(`${API_PREFIX}${HEALTH_PATH}`);
    const body = response.body as ApiSuccess<HealthData>;

    expect([...body.data.modules].sort()).toEqual([...MODULE_IDS].sort());
  });

  it('answers an unknown route with the standard error envelope', async () => {
    const response = await request(app).get(`${API_PREFIX}/no-such-route`);
    const body = response.body as ApiFailure;

    expect(response.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('rejects malformed JSON with a 400 error envelope', async () => {
    const response = await request(app)
      .post(`${API_PREFIX}/no-such-route`)
      .set('Content-Type', 'application/json')
      .send('{ not json');
    const body = response.body as ApiFailure;

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('BAD_REQUEST');
  });
});
