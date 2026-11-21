# Module 1: User & Platform Management

Folder name: `users`

## Scope

Authentication, the five user roles (Farmer, Buyer, Admin, Exporter, Cooperative), profiles, permissions, verification and administration.

Not in this module: farm records (Module 4), payment verification (Module 3).

## Owned paths

```text
apps/api/src/modules/users/**
apps/web/src/modules/users/**
packages/contracts/src/modules/users.ts
packages/validation/src/modules/users.ts     (create when first needed)
docs/modules/module-1-user-management.md
```

## Reserved routes

| Kind                 | Reserved                      | Defined in                             |
| -------------------- | ----------------------------- | -------------------------------------- |
| API, under `/api/v1` | `/auth`, `/users`, `/admin`   | `USERS_API` in `@ecb/contracts/users`  |
| Web                  | `/account`, `/auth`, `/admin` | `apps/web/src/modules/users/index.tsx` |

## Data owned

User accounts, roles, profiles and verification status. See [database-design.md](../database-design.md).

## What other modules need from this module

Every other module depends on this one for authentication, so deliver these first. The exact contract is in the [integration guide](../integration-guide.md#authentication-and-roles).

1. `requireAuth` and `requireRole(...roles)` middleware, exported from `apps/api/src/modules/users/index.ts`.
2. A way for the web app to read the signed-in user, exported from `apps/web/src/modules/users/index.tsx`.
3. Sign-in credentials attached to every request in `apps/web/src/shared/api/client.ts` (a shared-file change).
4. A function to look up a user's public details by id, for listings (Module 2) and traceability (Module 4).

## What this module needs from others

Nothing to start.

## Already provided by the foundation

- `USER_ROLES`, `UserRole`, `USER_ROLE_LABELS`, `isUserRole` and `AuthUser` in `@ecb/shared`
- `userRoleSchema` in `@ecb/validation`
- `req.user` typed on the Express request
- `AppError.unauthenticated()` and `AppError.forbidden()`

## Open decisions

- How users sign in and how the session is kept (for example, a signed token in the `Authorization` header). Any secret this needs goes into `.env.example` and `apps/api/src/config/env.ts`.
- What "verification" requires for each role, and who performs it.
- Which permissions each role has beyond its role name.

## Endpoints

None yet. List each endpoint here as it is added.
