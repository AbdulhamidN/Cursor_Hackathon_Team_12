# API contracts

Every endpoint of the API follows the conventions in this document. The shared types and constants are in `packages/contracts`.

## Base URL

All endpoints are under `/api/v1` (`API_PREFIX`).

- Development: `http://localhost:4000/api/v1`
- From the web app: use the client in `apps/web/src/shared/api/client.ts`, which adds the prefix. Pass paths such as `/listings`.

## Response envelope

Every JSON response has the same outer shape (`ApiResponse<T>`).

Success:

```json
{
  "success": true,
  "data": { "id": "665f1c2e9b1d8a0012345678" }
}
```

Success for a paginated list:

```json
{
  "success": true,
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 }
}
```

Failure:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [{ "path": "email", "message": "Invalid email address" }]
  }
}
```

In the API, send a success with `sendSuccess(res, data)` and signal a failure by throwing. Never build the error JSON by hand.

```ts
import { objectIdSchema } from '@ecb/validation';
import { AppError } from '../../common/errors';
import { sendSuccess } from '../../common/http';

router.get('/listings/:id', async (req, res) => {
  const id = objectIdSchema.parse(req.params.id); // a Zod failure becomes a 400 response
  const listing = await findListing(id);
  if (!listing) throw AppError.notFound('Listing not found');
  sendSuccess(res, listing);
});
```

## Status and error codes

| HTTP status | `error.code`       | When                                               |
| ----------- | ------------------ | -------------------------------------------------- |
| 200         |                    | Successful read, update or action                  |
| 201         |                    | A resource was created                             |
| 400         | `VALIDATION_ERROR` | Body, query or path parameters failed validation   |
| 400         | `BAD_REQUEST`      | The request is malformed, for example invalid JSON |
| 401         | `UNAUTHENTICATED`  | The caller is not signed in                        |
| 403         | `FORBIDDEN`        | The caller is signed in but not allowed to do this |
| 404         | `NOT_FOUND`        | The resource or route does not exist               |
| 409         | `CONFLICT`         | The request conflicts with the current state       |
| 500         | `INTERNAL_ERROR`   | Unexpected server error                            |

The codes are defined in `ERROR_CODES` (`packages/contracts/src/http.ts`). Adding a code is a shared-file change.

## URL and naming conventions

- Resources are plural nouns in kebab-case: `/listings`, `/coffee-lots`.
- Use HTTP methods for the action: `GET` reads, `POST` creates, `PATCH` updates part of a resource, `DELETE` removes.
- An action that is not a plain create, read, update or delete is a `POST` to a sub-path: `POST /orders/:id/cancel`.
- JSON field names are camelCase. Ids are strings named `id`. Dates are ISO 8601 strings in UTC.
- List endpoints accept `?page=1&limit=20` (`paginationQuerySchema`, maximum limit 100) and return `meta`.
- Filters are query parameters: `GET /listings?region=sidama`.

## Validation

Request bodies, query strings and path parameters are validated with Zod schemas from `@ecb/validation`. The same schema validates the web form, so both sides agree by construction.

- Shared schemas: `objectIdSchema`, `userRoleSchema`, `paginationQuerySchema` in `@ecb/validation`.
- Module schemas: `packages/validation/src/modules/<module>.ts`, imported as `@ecb/validation/<module>`. The module owner creates this file when first needed.

## Authentication

Module 1 defines how users sign in. The contract the other modules rely on is fixed:

- Protected routes answer `401 UNAUTHENTICATED` without a valid sign-in and `403 FORBIDDEN` when the role is not allowed.
- On a protected route, `req.user` is an `AuthUser`: `{ id: string, role: UserRole }`.
- Proposed default, to be confirmed by Module 1: the web app sends `Authorization: Bearer <token>`.

See the [integration guide](integration-guide.md#authentication-and-roles) for the middleware every module uses.

## Route ownership

Each module reserves its route prefixes in `packages/contracts/src/modules/<module>.ts`. A module's router only receives requests under its own prefixes.

| Prefix under `/api/v1`                                                       | Owner                   | Constant           |
| ---------------------------------------------------------------------------- | ----------------------- | ------------------ |
| `/health`                                                                    | Foundation              | `HEALTH_PATH`      |
| `/auth`, `/users`, `/admin`                                                  | Module 1 `users`        | `USERS_API`        |
| `/listings`, `/ai`                                                           | Module 2 `marketplace`  | `MARKETPLACE_API`  |
| `/orders`, `/payments`, `/deliveries`, `/payouts`, `/reviews`, `/disputes`   | Module 3 `transactions` | `TRANSACTIONS_API` |
| `/farms`, `/harvests`, `/lots`, `/cooperatives`, `/exports`, `/certificates` | Module 4 `traceability` | `TRACEABILITY_API` |

These prefixes are a starting point derived from the module descriptions. An owner may rename, remove or add prefixes in their own contracts file. A test fails if two modules reserve the same prefix.

## Implemented endpoints

### `GET /api/v1/health`

Reports whether the API is running. No authentication.

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "ecb-api",
    "environment": "development",
    "timestamp": "2026-11-21T12:52:04.657Z",
    "uptimeSeconds": 10,
    "database": "connected",
    "gemini": "not_configured",
    "modules": ["users", "marketplace", "transactions", "traceability"]
  }
}
```

- `status` is `ok` when MongoDB is connected and `degraded` when it is not. The HTTP status is 200 in both cases.
- `gemini` is `configured` when the server has a `GEMINI_API_KEY`.

No other endpoint exists yet. Each module owner documents their endpoints in their module guide as they add them.

## Adding an endpoint

1. Add the request and response types to `packages/contracts/src/modules/<module>.ts`.
2. Add the Zod schema for the request to `packages/validation/src/modules/<module>.ts`.
3. Implement the route in `apps/api/src/modules/<module>/` and attach it to the module's router under a reserved prefix.
4. Call it from `apps/web/src/modules/<module>/` using `apiRequest` and the types from step 1.
5. List the endpoint in `docs/modules/module-N-*.md`.
