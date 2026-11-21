import { API_PREFIX, type ApiResponse, type ApiSuccess, type ErrorCode } from '@ecb/contracts';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}${API_PREFIX}`;

/** Thrown for every failed API call. `code` matches `error.code` of the API response. */
export class ApiError extends Error {
  constructor(
    /** HTTP status, or 0 when the API could not be reached at all. */
    readonly status: number,
    readonly code: ErrorCode | 'NETWORK_ERROR',
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Sent as JSON. */
  body?: unknown;
  /** Appended to the URL as a query string. Undefined values are skipped. */
  query?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query: ApiRequestOptions['query']): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) params.set(key, String(value));
  }
  const queryString = params.toString();
  return `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Calls the API and returns the whole success envelope, including pagination
 * `meta`. `path` is relative to the API prefix, e.g. `/listings`.
 */
export async function apiRequestWithMeta<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiSuccess<T>> {
  const hasBody = options.body !== undefined;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch (error) {
    // Let callers recognise a cancelled request.
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw new ApiError(0, 'NETWORK_ERROR', 'The API could not be reached');
  }

  let payload: ApiResponse<T>;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    // Not JSON: the answer came from a proxy or gateway because the API itself is down.
    throw new ApiError(response.status, 'NETWORK_ERROR', 'The API is not responding');
  }

  if (!payload.success) {
    const { code, message, details } = payload.error;
    throw new ApiError(response.status, code, message, details);
  }
  return payload;
}

/** Calls the API and returns `data` of the success envelope. */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { data } = await apiRequestWithMeta<T>(path, options);
  return data;
}
