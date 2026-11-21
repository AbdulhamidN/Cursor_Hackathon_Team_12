import type { AuthUser } from '@ecb/shared';

declare module 'express-serve-static-core' {
  interface Request {
    /**
     * The authenticated caller. Set by the authentication middleware owned by
     * Module 1; undefined on routes that do not require authentication.
     */
    user?: AuthUser;
  }
}
