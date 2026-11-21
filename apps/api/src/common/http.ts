import type { ApiSuccess, PaginationMeta } from '@ecb/contracts';
import type { Response } from 'express';

interface SuccessOptions {
  /** HTTP status code. Defaults to 200; use 201 after creating a resource. */
  status?: number;
  /** Pagination details for list endpoints. */
  meta?: PaginationMeta;
}

/** Sends the standard success envelope. Use it for every successful JSON response. */
export function sendSuccess<T>(res: Response, data: T, options: SuccessOptions = {}): void {
  const body: ApiSuccess<T> = { success: true, data };
  if (options.meta) body.meta = options.meta;
  res.status(options.status ?? 200).json(body);
}
