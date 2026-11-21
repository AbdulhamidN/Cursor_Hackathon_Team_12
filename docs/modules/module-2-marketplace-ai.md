# Module 2: Coffee Marketplace & AI Intelligence

Folder name: `marketplace`

## Scope

Coffee listings, farmer information on listings, buyer search, AI coffee identification, quality estimation, pricing assistance and recommendations.

Not in this module: orders and payments (Module 3), the farmer's account (Module 1), farm and lot records (Module 4).

## Owned paths

```text
apps/api/src/modules/marketplace/**
apps/web/src/modules/marketplace/**
packages/contracts/src/modules/marketplace.ts
packages/validation/src/modules/marketplace.ts     (create when first needed)
docs/modules/module-2-marketplace-ai.md
```

## Reserved routes

| Kind                 | Reserved           | Defined in                                        |
| -------------------- | ------------------ | ------------------------------------------------- |
| API, under `/api/v1` | `/listings`, `/ai` | `MARKETPLACE_API` in `@ecb/contracts/marketplace` |
| Web                  | `/marketplace`     | `apps/web/src/modules/marketplace/index.tsx`      |

## Data owned

Coffee listings and any AI results the module chooses to save. See [database-design.md](../database-design.md).

## Gemini rules

- Gemini is called from the API only. The web app calls this module's `/api/v1/ai` endpoints.
- The key is `env.GEMINI_API_KEY` from `apps/api/src/config/env.ts`. It is optional in the schema, so handle the case where it is missing with a clear error.
- Never send the key to the browser, log it, or give it a `VITE_` prefix. Importing a Gemini SDK in `apps/web` is a lint error.
- Install the SDK in the API only: `npm install @google/genai --workspace @ecb/api`.
- `GET /api/v1/health` shows `"gemini": "configured"` once the key is loaded.

## What other modules need from this module

- Module 3 needs a listing's price and available quantity at checkout, and a way to reduce the quantity when an order is placed. Export these as functions from `apps/api/src/modules/marketplace/index.ts`.

## What this module needs from others

- Module 1: `requireAuth` and `requireRole`, and a seller's public details to show on a listing.
- Module 4: a way to link a listing to a traceable coffee lot.
- Module 3: a seller's rating summary to show on a listing.

Until these exist, code against the agreed signatures. See the [integration guide](../integration-guide.md).

## Open decisions

- Which Gemini model to use.
- How coffee images reach the API for identification (upload size limit, where files are stored). The JSON body limit is the Express default of 100 kB, so image upload needs its own handling.
- Units for price and weight. Agree with Module 3; see the conventions in [database-design.md](../database-design.md).

## Endpoints

None yet. List each endpoint here as it is added.
