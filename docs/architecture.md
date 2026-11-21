# Architecture

## Summary

The system is a **modular monolith**: one React app and one Express API, each divided into the same four feature modules. Modules are separated by folder and by lint rules, not by deployment. This gives four developers independent workspaces without the cost of running four applications.

```text
Browser
  |
  |  React app (apps/web)             shared layout, router, API client
  |    modules: users | marketplace | transactions | traceability
  |
  |  HTTPS, JSON, /api/v1/...
  v
Express API (apps/api)                shared middleware, errors, config
     modules: users | marketplace | transactions | traceability
  |                          |
  v                          v
MongoDB (Mongoose)        Gemini API (server-side only)
```

## Workspaces

| Workspace             | Package name      | Purpose                                                             |
| --------------------- | ----------------- | ------------------------------------------------------------------- |
| `apps/api`            | `@ecb/api`        | REST API                                                            |
| `apps/web`            | `@ecb/web`        | Web client                                                          |
| `packages/shared`     | `@ecb/shared`     | Domain constants and types with no dependencies: roles, module list |
| `packages/contracts`  | `@ecb/contracts`  | API route paths, the response envelope, request and response types  |
| `packages/validation` | `@ecb/validation` | Zod schemas used by web forms and by API request validation         |
| `packages/config`     | `@ecb/config`     | Shared TypeScript bases and the ESLint configuration                |

Dependencies point one way only:

```text
apps/web, apps/api  ->  contracts, validation  ->  shared
```

Packages never import from apps. Packages must run in both the browser and Node.js, so they use no DOM and no Node.js APIs.

### Packages have no build step

The `@ecb/*` packages export their TypeScript source directly (`"exports": "./src/index.ts"`). Vite compiles them for the web app, `tsx` runs them for the API in development, and `tsup` bundles them into the API for production. A change in a package is picked up immediately by both apps, with nothing to rebuild.

## Module boundaries

A module is a folder with the same name in four places:

```text
apps/api/src/modules/<module>/          API routes, logic and Mongoose models
apps/web/src/modules/<module>/          pages, components and API calls
packages/contracts/src/modules/<module>.ts    route prefixes and request/response types
packages/validation/src/modules/<module>.ts   Zod schemas
```

The module folder names are `users`, `marketplace`, `transactions` and `traceability`.

Three rules keep the modules independent:

1. **One public entry per module.** `index.ts` (API) or `index.tsx` (web) is the only file another module may import. Everything else in the folder is private.
2. **Shared code does not know the modules.** `apps/api/src/common`, `apps/api/src/config` and `apps/web/src/shared` never import from a module.
3. **Each module serves only its own routes.** Every module reserves its API route prefixes in `@ecb/contracts/<module>`.

All three are enforced, not just documented:

| Rule                                                        | Enforced by                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| No imports of another module's private files                | ESLint `no-restricted-imports` (`packages/config/eslint.js`)         |
| Shared code does not import modules                         | ESLint, same file                                                    |
| No Gemini SDK, Mongoose or Express in the web app           | ESLint, same file                                                    |
| A module only receives requests under its reserved prefixes | `scopeToPrefixes` in `apps/api/src/common/middleware/route-scope.ts` |
| No two modules reserve the same prefix                      | `tests/contracts/route-ownership.test.ts`                            |

### Module registries

Each app has exactly one file that lists the modules. Module owners do not need to edit them.

- API: `apps/api/src/modules/index.ts` pairs each module's router with its reserved prefixes. `app.ts` mounts them under `/api/v1`.
- Web: `apps/web/src/app/modules.ts` lists each module's `WebModule` (navigation label, entry path, routes). `routes.tsx` places all module routes inside the shared layout.

## API structure

```text
apps/api/src/
  server.ts            starts the HTTP server and connects to MongoDB
  app.ts               builds the Express app (used by server.ts and by tests)
  config/env.ts        validated environment variables
  config/database.ts   Mongoose connection
  common/              AppError, sendSuccess, error handler, request logger
  health/              health-check endpoint
  modules/             the four feature modules and their registry
  types/express.d.ts   adds `req.user` to the Express request type
```

Request flow: `helmet` and `cors` -> JSON body parser -> request logger -> health route or module router -> not-found handler -> error handler.

Route handlers throw; they do not format error responses. `AppError` and Zod validation errors are converted into the standard error envelope by the error handler. Express 5 forwards errors from `async` handlers automatically, so no wrapper is needed.

## Web structure

```text
apps/web/src/
  main.tsx             creates the router and renders the app
  index.css            Tailwind import and design tokens
  app/                 layout, home page, route tree, module registry
  shared/              API client, shared components, the WebModule type
  modules/             the four feature modules
```

In development the Vite dev server proxies `/api` to the API, so the browser calls the API on the same origin and CORS is not involved.

## Configuration and secrets

- One `.env` file in the repository root, created from `.env.example`. It is git-ignored.
- The API reads it through `apps/api/src/config/env.ts`, which validates every variable at startup. Code never reads `process.env` directly.
- Vite exposes only variables prefixed with `VITE_` to the browser. Secrets never get that prefix.

## Gemini integration

The Gemini API key exists only on the server (`GEMINI_API_KEY`). The web app calls endpoints under `/api/v1/ai`, owned by Module 2, and the API calls Gemini. Importing a Gemini SDK into `apps/web` is a lint error. The health check reports whether a key is configured, never the key.

## Testing

One Vitest configuration at the root runs two projects:

| Project | Environment | Files                                                                            |
| ------- | ----------- | -------------------------------------------------------------------------------- |
| `node`  | Node.js     | `apps/api/src/**/*.test.ts`, `packages/*/src/**/*.test.ts`, `tests/**/*.test.ts` |
| `web`   | jsdom       | `apps/web/src/**/*.test.tsx`                                                     |

Put a test next to the code it tests. Use the root `tests/` folder only for tests that cross module or app boundaries. API tests call `createApp()` in-process with `supertest` and need no running server.

## Key decisions

| Decision                              | Reason                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------- |
| Modular monolith, not four services   | One install, one run command and one deployment, while keeping module ownership clear       |
| Packages export source, no build step | Removes a whole class of "stale build" problems during a hackathon                          |
| Route prefixes reserved in contracts  | Makes API ownership explicit and testable, and prevents route collisions between developers |
| Lint-enforced boundaries              | Boundary violations fail `npm run check` and CI instead of being found at merge time        |
| No path aliases                       | One less thing to keep in sync across TypeScript, Vite and Vitest                           |
| TypeScript pinned to 6.0              | `typescript-eslint` does not support TypeScript 7 yet                                       |
| Zod for validation                    | One schema validates the web form and the API request, and produces the TypeScript type     |
