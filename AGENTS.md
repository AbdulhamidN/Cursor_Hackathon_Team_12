# AGENTS.md

Rules for everyone who changes this repository, human or AI coding agent.

## Project

Ethiopian Coffee Buy is a monorepo with one React web app (`apps/web`) and one Express API (`apps/api`), divided into four feature modules built by four developers in parallel. Stack: TypeScript, React, Vite, Tailwind CSS, React Router, Express, MongoDB with Mongoose, Zod, Vitest, npm workspaces.

Read first: [docs/architecture.md](docs/architecture.md), [docs/api-contracts.md](docs/api-contracts.md), [docs/integration-guide.md](docs/integration-guide.md).

## Commands

Run from the repository root, in PowerShell.

```powershell
npm install          # install everything
npm run dev          # API on :4000 and web on :5173
npm run check        # format check + lint + typecheck + tests; must pass before every push
npm run format       # fix formatting
npm test             # tests only
npm install <pkg> --workspace @ecb/api    # add a dependency to one workspace
```

## Module ownership

| Module | Folder name    | Covers                                                                     |
| ------ | -------------- | -------------------------------------------------------------------------- |
| 1      | `users`        | Authentication, roles, profiles, permissions, verification, administration |
| 2      | `marketplace`  | Listings, search, AI identification, quality, pricing, recommendations     |
| 3      | `transactions` | Orders, payments, delivery, payouts, reviews, disputes                     |
| 4      | `traceability` | Farms, harvests, lots, QR, cooperatives, exports, certificates             |

A module owns exactly these paths:

```text
apps/api/src/modules/<module>/**
apps/web/src/modules/<module>/**
packages/contracts/src/modules/<module>.ts
packages/validation/src/modules/<module>.ts
docs/modules/module-N-*.md
```

**Before editing, identify which module the task belongs to and stay inside that module's paths.** If you are an AI agent and the task does not say which module you are working on, ask.

## Shared-file restrictions

Every file outside the owned paths above is shared. This includes root configuration, `packages/config`, `packages/shared`, the cross-cutting files of `packages/contracts` and `packages/validation`, `apps/api/src/{app.ts,server.ts,config,common,health,types,modules/index.ts}`, `apps/web/src/{main.tsx,index.css,app,shared}`, `.github`, and the top-level docs.

- Do not change a shared file as part of feature work.
- If a shared change is truly needed, stop and say so. It goes in its own small pull request on a `shared/<topic>` branch after the team has been told.
- Routine exceptions that need only a heads-up: adding a dependency to a workspace, and adding an environment variable (to `.env.example` and `apps/api/src/config/env.ts` together).
- Never edit another module's files. Ask its owner for what you need.

## Module boundaries

- Import another module only through its public entry: `import { requireAuth } from '../users'`. Importing its internal files is a lint error.
- A module's `index.ts` (API) or `index.tsx` (web) exports only what other modules may use. Never export Mongoose models.
- Refer to another module's data by id. Do not query its collections or use `populate` across modules.
- Shared code (`common`, `config`, `shared`) never imports from a module.
- Add API routes only under the prefixes reserved in your `@ecb/contracts/<module>` file. Routes outside them are never reached.

## Coding conventions

- TypeScript strict mode. No `any`; use `unknown` and narrow it. No `@ts-ignore`.
- Named exports only. No default exports, except where a tool requires one (config files).
- Use `import type` for type-only imports.
- Relative imports inside an app; `@ecb/*` imports for packages. There are no path aliases.
- File names: `PascalCase.tsx` for React components, `kebab-case.ts` for everything else, `*.test.ts(x)` next to the code under test.
- Prettier formats the code. Do not hand-format or disable lint rules to get around it.
- Do not create empty folders or placeholder files. Create a file when it has real content.
- Comments explain why, not what.

API:

- Send success with `sendSuccess(res, data)`. Signal failure by throwing `AppError` (`AppError.notFound(...)`). Never write the error JSON by hand.
- Validate every body, query and path parameter with a Zod schema from `@ecb/validation`. A thrown Zod error becomes a 400 response automatically.
- `async` route handlers need no try/catch wrapper; Express 5 forwards their errors.
- Read configuration from `env` in `apps/api/src/config/env.ts`, never from `process.env`.

Web:

- Function components and hooks only.
- Style with Tailwind utility classes. Use the design tokens in `apps/web/src/index.css`.
- Call the API only through `apiRequest` in `apps/web/src/shared/api/client.ts`, with types from `@ecb/contracts`.
- Add pages by adding routes to your module's `index.tsx`.

## API conventions

Full details: [docs/api-contracts.md](docs/api-contracts.md).

- All routes are under `/api/v1`. Resources are plural, kebab-case nouns.
- Every response uses the envelope: `{ success: true, data, meta? }` or `{ success: false, error: { code, message, details? } }`.
- Error codes come from `ERROR_CODES` in `@ecb/contracts`.
- List endpoints accept `?page=&limit=` and return `meta`.
- Ids are strings named `id`. Dates are ISO 8601 UTC strings. JSON fields are camelCase.
- Request and response types live in `@ecb/contracts/<module>`; request schemas in `@ecb/validation/<module>`.

## Secrets

- Secrets live only in the root `.env`, which is git-ignored. Never commit it, print it, or copy its values into code, docs, tests or chat.
- The Gemini API key is used by the API only. Never import a Gemini SDK into `apps/web`, and never create a `VITE_` variable that holds a secret.

## Git collaboration

- Never commit directly to `main`. Never force-push `main`.
- Branches: `m1/<topic>`, `m2/<topic>`, `m3/<topic>`, `m4/<topic>`, `shared/<topic>`.
- Commits: Conventional Commits with the module as scope, for example `feat(transactions): add order cancellation`.
- Merge `main` into your branch often. Run `npm run check` before pushing.
- Small pull requests, reviewed by one other developer, with CI passing.
- On a `package-lock.json` conflict, accept the version from `main` and run `npm install`.
- AI agents: do not commit, push, or open pull requests unless the user asks.
