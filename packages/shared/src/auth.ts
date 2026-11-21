import type { UserRole } from './roles';

/**
 * The authenticated caller of a request.
 *
 * This is the contract between Module 1 (which authenticates the request and
 * sets `req.user` in the API) and every other module (which reads it).
 * Changing it affects all four modules, so agree on changes as a team first.
 */
export interface AuthUser {
  /** The user's id (MongoDB ObjectId as a 24-character hex string). */
  id: string;
  role: UserRole;
}
