import { USER_ROLES } from '@ecb/shared';
import { z } from 'zod';

/** A MongoDB ObjectId in its 24-character hex string form. Use for every id in params and bodies. */
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id');

export const userRoleSchema = z.enum(USER_ROLES);

/** Query string of every paginated list endpoint: `?page=1&limit=20`. */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
