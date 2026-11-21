import { Router } from 'express';

/**
 * Module 1 - User & Platform Management.
 *
 * Public entry of the module: the only file other modules may import from.
 * The router only receives requests under the route prefixes reserved in
 * `@ecb/contracts/users` (USERS_API). A route outside them is never reached,
 * so reserve a new prefix there first.
 */
export const usersRouter = Router();
