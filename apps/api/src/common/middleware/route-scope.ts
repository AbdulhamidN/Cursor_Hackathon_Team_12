import type { RequestHandler, Router } from 'express';

/**
 * Lets a module's router handle only the requests under that module's
 * reserved route prefixes. Everything else skips the router entirely, so a
 * module cannot serve another module's routes, and middleware that a module
 * adds with `router.use(...)` never runs for another module's requests.
 */
export function scopeToPrefixes(prefixes: readonly string[], router: Router): RequestHandler {
  return (req, res, next) => {
    const inScope = prefixes.some(
      (prefix) => req.path === prefix || req.path.startsWith(`${prefix}/`),
    );
    if (inScope) {
      router(req, res, next);
    } else {
      next();
    }
  };
}
