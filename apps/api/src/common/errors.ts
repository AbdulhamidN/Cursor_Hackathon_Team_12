import { ERROR_CODES, type ErrorCode } from '@ecb/contracts';

/**
 * An error with a known HTTP status. Throw it from any route handler or
 * service; the error handler converts it into the standard error response.
 *
 *   throw AppError.notFound('Listing not found');
 */
export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(400, ERROR_CODES.BAD_REQUEST, message, details);
  }

  static unauthenticated(message = 'Authentication required'): AppError {
    return new AppError(401, ERROR_CODES.UNAUTHENTICATED, message);
  }

  static forbidden(message = 'You do not have permission to do this'): AppError {
    return new AppError(403, ERROR_CODES.FORBIDDEN, message);
  }

  static notFound(message = 'Resource not found'): AppError {
    return new AppError(404, ERROR_CODES.NOT_FOUND, message);
  }

  static conflict(message: string, details?: unknown): AppError {
    return new AppError(409, ERROR_CODES.CONFLICT, message, details);
  }
}
