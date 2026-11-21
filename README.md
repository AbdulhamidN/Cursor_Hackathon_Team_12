# Ethiopian Coffee Buy

A platform for buying traceable Ethiopian coffee directly from farmers, cooperatives and exporters. It combines a coffee marketplace with AI assistance, payments with buyer protection, and farm-to-export traceability.

This repository is a monorepo: one web app and one API, split into four feature modules that four developers build in parallel.

| Module | Name                                 | Folder name    | Guide                                                                   |
| ------ | ------------------------------------ | -------------- | ----------------------------------------------------------------------- |
| 1      | User & Platform Management           | `users`        | [module-1-user-management.md](docs/modules/module-1-user-management.md) |
| 2      | Coffee Marketplace & AI Intelligence | `marketplace`  | [module-2-marketplace-ai.md](docs/modules/module-2-marketplace-ai.md)   |
| 3      | Transactions, Payments & Trust       | `transactions` | [module-3-transactions.md](docs/modules/module-3-transactions.md)       |
| 4      | Coffee Traceability & Value Chain    | `traceability` | [module-4-traceability.md](docs/modules/module-4-traceability.md)       |

## Tech stack

- **Web:** React 19, Vite, TypeScript, Tailwind CSS 4, React Router
- **API:** Node.js, Express 5, TypeScript, REST
- **Database:** MongoDB with Mongoose
- **AI:** Gemini API, called from the API only
- **Tooling:** npm workspaces, ESLint, Prettier, Vitest

## Prerequisites

- **Node.js 24** (22.22.2 or newer also works) and npm 10+. Check with `node --version`.
- **MongoDB**, one of:
  - MongoDB Community Server running as a Windows service (default port 27017), or
  - Docker Desktop: `docker compose -f infrastructure/docker-compose.yml up -d`, or
  - a MongoDB Atlas connection string placed in `.env`.
- **Git**

## Setup (PowerShell)

```powershell
git clone https://github.com/AbdulhamidN/Cursor_Hackathon_Team_12.git
cd Cursor_Hackathon_Team_12

npm install
Copy-Item .env.example .env
npm run dev
```

`npm run dev` starts both apps:

- Web: <http://localhost:5173>
- API: <http://localhost:4000/api/v1/health>

The API needs a few seconds longer than the web app to start. The home page shows "API offline" until then and updates by itself.

## Verify the setup

```powershell
# API health check: "status" should be "ok" and "database" should be "connected"
Invoke-RestMethod http://localhost:4000/api/v1/health | ConvertTo-Json -Depth 5

# The same request through the web dev server, which proves the web-to-API proxy works
Invoke-RestMethod http://localhost:5173/api/v1/health | ConvertTo-Json -Depth 5

# Formatting, lint, type check and tests
npm run check
```

Then open <http://localhost:5173>. The home page should show "API online. Database connected." and one card per module.

If `status` is `degraded` and `database` is `disconnected`, MongoDB is not reachable: start it, check `MONGODB_URI` in `.env`, then restart the API.

## Commands

Run all of them from the repository root.

| Command              | What it does                                              |
| -------------------- | --------------------------------------------------------- |
| `npm run dev`        | Start the API and the web app with live reload            |
| `npm run dev:api`    | Start only the API                                        |
| `npm run dev:web`    | Start only the web app                                    |
| `npm run check`      | Format check, lint, type check and tests. Run before push |
| `npm test`           | Run all tests once                                        |
| `npm run test:watch` | Re-run tests on every change                              |
| `npm run lint`       | Lint, including the module-boundary rules                 |
| `npm run typecheck`  | Type-check every workspace                                |
| `npm run format`     | Format every file with Prettier                           |
| `npm run build`      | Build the API and the web app for production              |
| `npm start`          | Run the built API (after `npm run build`)                 |

Add a dependency to one workspace, never to the root by accident:

```powershell
npm install <package> --workspace @ecb/api
npm install <package> --workspace @ecb/web
```

## Repository layout

```text
apps/
  api/                 Express API
    src/modules/<module>/    one folder per feature module
    src/common/              shared API helpers (errors, responses, middleware)
    src/config/              environment and database connection
  web/                 React app
    src/modules/<module>/    one folder per feature module
    src/shared/              shared UI and the API client
    src/app/                 app shell: layout, routes, module registry
packages/
  shared/              roles, module list and other domain constants
  contracts/           API route paths and request/response types
  validation/          Zod schemas used by both the web forms and the API
  config/              shared TypeScript and ESLint configuration
docs/                  architecture, conventions and one guide per module
infrastructure/        local MongoDB (Docker Compose)
tests/                 tests that cross module or app boundaries
```

## Documentation

- [Project overview](docs/project-overview.md)
- [Architecture](docs/architecture.md)
- [Database design](docs/database-design.md)
- [API contracts](docs/api-contracts.md)
- [Integration guide](docs/integration-guide.md): how the four modules work together
- [AGENTS.md](AGENTS.md): rules for developers and AI coding agents

## Troubleshooting

- **`npm` cannot be loaded because running scripts is disabled:** run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, then open a new PowerShell window.
- **Port 4000 or 5173 is already in use:** stop the other process, or change `API_PORT` in `.env`. The web dev server always uses 5173.
- **`package-lock.json` merge conflict:** accept the version from `main`, then run `npm install` again.
