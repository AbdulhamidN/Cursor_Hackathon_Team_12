# Integration guide

How four developers build four modules in one codebase without blocking or breaking each other.

## What each developer owns

A module owner may freely change these paths, and only these:

```text
apps/api/src/modules/<module>/**
apps/web/src/modules/<module>/**
packages/contracts/src/modules/<module>.ts
packages/validation/src/modules/<module>.ts
docs/modules/module-N-*.md
```

| Module | `<module>`     |
| ------ | -------------- |
| 1      | `users`        |
| 2      | `marketplace`  |
| 3      | `transactions` |
| 4      | `traceability` |

## Shared files

Everything else is shared. A change to a shared file can break all four modules, so it follows a stricter process.

Shared files:

- Root files: `package.json`, `package-lock.json`, `eslint.config.js`, `vitest.config.ts`, `.env.example`, `.prettierrc.json`
- `packages/config/**`, `packages/shared/**`
- `packages/contracts/src/index.ts`, `http.ts`, `health.ts`
- `packages/validation/src/index.ts`, `common.ts`
- `apps/api/src/app.ts`, `server.ts`, `config/**`, `common/**`, `health/**`, `types/**`, `modules/index.ts`
- `apps/web/src/main.tsx`, `index.css`, `app/**`, `shared/**`
- `.github/**`, `AGENTS.md`, `.cursor/rules/**`, and `docs/*.md` outside `docs/modules/`

Process for a shared-file change:

1. Tell the team first, in the team chat, what you need and why.
2. Make the change in its own small pull request on a `shared/<topic>` branch. Do not mix it with feature work.
3. Get it merged quickly. Everyone else then merges `main` into their branch.

Two shared changes are routine and need only a heads-up, not a discussion:

- **Adding a dependency** with `npm install <package> --workspace @ecb/api` (or `@ecb/web`).
- **Adding an environment variable**: add it to `.env.example` and to the schema in `apps/api/src/config/env.ts` in the same pull request.

## Structure inside a module

Recommended, not enforced. Create files as you need them; do not create empty folders.

API module:

```text
apps/api/src/modules/<module>/
  index.ts                  public entry: the router and functions other modules may call
  <resource>.routes.ts      route definitions, attached to the module router
  <resource>.service.ts     business logic
  <resource>.model.ts       Mongoose model (private to the module)
  <resource>.test.ts        tests next to the code
```

Web module:

```text
apps/web/src/modules/<module>/
  index.tsx                 public entry: the WebModule (navigation label, entry path, routes)
  pages/                    one component per route
  components/               components used only by this module
  api.ts                    API calls, using shared/api/client and @ecb/contracts types
```

## Using another module

### In the API

Import only from the other module's `index.ts`:

```ts
// apps/api/src/modules/transactions/order.service.ts
import { requireAuth } from '../users'; // allowed: public entry
import { User } from '../users/user.model'; // lint error: private file
```

The providing module decides what to export from its `index.ts`. Export functions and middleware, never Mongoose models. Keep the exported functions small and stable, because other modules depend on them.

### In the web app

- Move between modules with links and navigation (`<Link to="/orders/123">`), not by importing another module's pages.
- If two modules need the same component or hook, move it to `apps/web/src/shared/` (a shared-file change).
- Anything a module offers to others, such as a hook for the signed-in user, is exported from its `index.tsx`.

### Asking another module for something

When you need a function another module does not export yet:

1. Ask the owner, stating the input and output you need.
2. Agree on the function signature. Write the request and response types in `@ecb/contracts` if they cross the API.
3. Until it exists, code against the agreed signature and use a stand-in in your tests. Do not reach into the other module's files.

## Authentication and roles

This is the one dependency every module has, so it is the first thing Module 1 delivers.

**Fixed contract (already in the code):**

- `AuthUser` in `@ecb/shared`: `{ id: string, role: UserRole }`
- `req.user?: AuthUser` on the Express request (`apps/api/src/types/express.d.ts`)

**Module 1 delivers, exported from `apps/api/src/modules/users/index.ts`:**

| Export                  | Behaviour                                                                          |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `requireAuth`           | Middleware. Sets `req.user`, or throws `AppError.unauthenticated()`                |
| `requireRole(...roles)` | Middleware used after `requireAuth`. Throws `AppError.forbidden()` for other roles |

Usage in any module:

```ts
import { requireAuth, requireRole } from '../users';

router.post('/listings', requireAuth, requireRole('farmer', 'cooperative'), createListing);
```

**Module 1 also delivers in the web app:**

- A way for other modules to read the signed-in user, exported from `apps/web/src/modules/users/index.tsx`.
- A change to `apps/web/src/shared/api/client.ts` so every request carries the sign-in credentials (a shared-file change).

Until these exist, Modules 2 to 4 write their handlers against `req.user` and set it with a stand-in middleware in their tests.

## Where the modules meet

These are the known points where one module needs another. Treat each as a small agreement between two owners.

| Need                                                                    | Needed by | Provided by |
| ----------------------------------------------------------------------- | --------- | ----------- |
| Who is calling and what role they have                                  | 2, 3, 4   | 1           |
| Name and verification status of a farmer or seller to show on a listing | 2         | 1           |
| Price and available quantity of a listing at checkout                   | 3         | 2           |
| Reducing a listing's available quantity when it is ordered              | 3         | 2           |
| Linking a listing to a traceable coffee lot                             | 2         | 4           |
| Rating summary of a seller to show on a listing                         | 2         | 3           |
| The accounts behind cooperatives and exporters                          | 4         | 1           |

## Adding to the app without touching shared files

- **A new API route:** attach it to your module's router. If it needs a new prefix, add the prefix to your own `packages/contracts/src/modules/<module>.ts`. A route outside your reserved prefixes is never reached.
- **A new page:** add a route to the `routes` array in your module's `index.tsx`. It is rendered inside the shared layout automatically.
- **New request or response types:** add them to your own contracts file and import them as `@ecb/contracts/<module>`.
- **New validation schemas:** add them to your own validation file and import them as `@ecb/validation/<module>`.

Reserved top-level web paths:

| Module | Paths                         |
| ------ | ----------------------------- |
| 1      | `/account`, `/auth`, `/admin` |
| 2      | `/marketplace`                |
| 3      | `/orders`, `/checkout`        |
| 4      | `/traceability`               |

## Git workflow

- `main` always runs. Nobody commits to it directly.
- Branch names: `m1/<topic>`, `m2/<topic>`, `m3/<topic>`, `m4/<topic>`, or `shared/<topic>`.
- Commit messages follow Conventional Commits with the module as scope: `feat(marketplace): add listing search`.
- Merge `main` into your branch at least twice a day. Small, frequent merges keep conflicts small.
- Before pushing: `npm run check`.
- Open small pull requests. One other developer reviews. CI must pass.
- `package-lock.json` conflict: accept the version from `main`, then run `npm install`.
- Never commit `.env`, and never force-push `main`.

## Before you merge

- [ ] `npm run check` passes
- [ ] Only files you own are changed, or the shared change was announced
- [ ] New endpoints use the response envelope and are listed in your module guide
- [ ] Anything other modules use is exported from your module's `index` file
- [ ] New environment variables are in `.env.example` and `env.ts`
