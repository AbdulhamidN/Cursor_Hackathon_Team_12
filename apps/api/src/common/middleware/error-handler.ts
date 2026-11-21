import { ERROR_CODES, type ApiFailure, type ValidationIssue } from '@ecb/contracts';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../../config/env';
import { AppError } from '../errors';

/** Errors raised by Express body parsing carry an HTTP status (malformed JSON, body too large). */
function isClientHttpError(error: unknown): error is Error & { status: number } {
  if (!(error instanceof Error) || !('status' in error)) return false;
  const { status } = error;
  return typeof status === 'number' && status >= 400 && status < 500;
}

function toFailure(error: unknown): { status: number; body: ApiFailure } {
  if (error instanceof AppError) {
    return {
      status: error.status,
      body: {
        success: false,
        error: { code: error.code, message: error.message, details: error.details },
      },
    };
  }

  if (error instanceof ZodError) {
    const details: ValidationIssue[] = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
    return {
      status: 400,
      body: {
        success: false,
        error: { code: ERROR_CODES.VALIDATION_ERROR, message: 'Invalid request data', details },
      },
    };
  }

  if (isClientHttpError(error)) {
    return {
      status: error.status,
      body: { success: false, error: { code: ERROR_CODES.BAD_REQUEST, message: error.message } },
    };
  }

  // Unknown failure: log it in full, but do not leak internals outside development.
  console.error(error);
  const message =
    env.NODE_ENV === 'development' && error instanceof Error
      ? error.message
      : 'Something went wrong';
  return {
    status: 500,
    body: { success: false, error: { code: ERROR_CODES.INTERNAL_ERROR, message } },
  };
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(AppError.notFound(`Route not found: ${req.method} ${req.path}`));
};

// Express recognises an error handler by its four parameters, so `_next` must stay.
export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const { status, body } = toFailure(error);
  res.status(status).json(body);
};
