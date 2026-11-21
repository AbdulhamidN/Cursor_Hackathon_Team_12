# Module 3: Transactions, Payments & Trust

Folder name: `transactions`

## Scope

Orders, checkout, payments, payment verification, delivery, farmer payouts, ratings, reviews, disputes and buyer protection.

Not in this module: listings and their prices (Module 2), user verification (Module 1), export workflows (Module 4).

## Owned paths

```text
apps/api/src/modules/transactions/**
apps/web/src/modules/transactions/**
packages/contracts/src/modules/transactions.ts
packages/validation/src/modules/transactions.ts     (create when first needed)
docs/modules/module-3-transactions.md
```

## Reserved routes

| Kind                 | Reserved                                                                   | Defined in                                          |
| -------------------- | -------------------------------------------------------------------------- | --------------------------------------------------- |
| API, under `/api/v1` | `/orders`, `/payments`, `/deliveries`, `/payouts`, `/reviews`, `/disputes` | `TRANSACTIONS_API` in `@ecb/contracts/transactions` |
| Web                  | `/orders`, `/checkout`                                                     | `apps/web/src/modules/transactions/index.tsx`       |

## Data owned

Orders, payments, deliveries, payouts, ratings and reviews, disputes. See [database-design.md](../database-design.md).

## Consistency of money-related writes

Changing several documents atomically needs a MongoDB transaction, and transactions only work on a replica set. MongoDB Atlas is one; a default local install and the provided Docker Compose file are not. Choose one of:

- design each money-related change as an update to a single document, or
- use transactions and have the team develop against Atlas.

Record the choice here. Details are in [database-design.md](../database-design.md#choice-of-database).

## What other modules need from this module

- Module 2 needs a seller's rating summary to show on listings. Export it as a function from `apps/api/src/modules/transactions/index.ts`.

## What this module needs from others

- Module 1: `requireAuth` and `requireRole`, and the buyer and farmer accounts behind an order.
- Module 2: a listing's price and available quantity at checkout, and a way to reduce the quantity when an order is placed.

Until these exist, code against the agreed signatures. See the [integration guide](../integration-guide.md).

## Open decisions

- Which payment provider to use, and how a payment is verified. Provider keys are server-side secrets: add them to `.env.example` and `apps/api/src/config/env.ts`, never to the web app.
- How and when farmers are paid out.
- What buyer protection covers and how a dispute is resolved, including the admin's part in it.
- How money is stored. Agree with Module 2; see the conventions in [database-design.md](../database-design.md).

## Endpoints

None yet. List each endpoint here as it is added.
