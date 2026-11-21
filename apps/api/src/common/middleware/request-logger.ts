import type { RequestHandler } from 'express';

/** Logs one line per finished request: `GET /api/v1/health 200 3ms`. */
export const requestLogger: RequestHandler = (req, res, next) => {
  const startedAt = performance.now();
  res.on('finish', () => {
    const durationMs = Math.round(performance.now() - startedAt);
    console.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });
  next();
};
