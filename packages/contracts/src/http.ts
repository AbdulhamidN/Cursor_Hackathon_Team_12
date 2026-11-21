/** Every REST endpoint is served under this prefix. */
export const API_PREFIX = '/api/v1';

/** Machine-readable error codes returned in `error.code`. */
export const ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/** Included in `meta` by every paginated list endpoint. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorBody {
  code: ErrorCode;
  message: string;
  /** Extra information, e.g. the list of invalid fields for VALIDATION_ERROR. */
  details?: unknown;
}

export interface ApiFailure {
  success: false;
  error: ApiErrorBody;
}

/** The envelope of every JSON response of the API. */
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/** One entry of `error.details` for VALIDATION_ERROR. */
export interface ValidationIssue {
  /** Dot-separated path of the invalid field, e.g. `address.city`. */
  path: string;
  message: string;
}
