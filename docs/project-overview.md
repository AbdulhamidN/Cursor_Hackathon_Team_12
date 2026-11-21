# Project overview

## What we are building

Ethiopian Coffee Buy is a web platform where buyers purchase Ethiopian coffee directly from the people who produce and handle it, with proof of where each coffee came from.

It serves five kinds of users:

| Role        | What they do on the platform                                |
| ----------- | ----------------------------------------------------------- |
| Farmer      | Records farms and harvests, lists coffee, receives payouts  |
| Buyer       | Searches and buys coffee, pays, rates and reviews           |
| Cooperative | Aggregates coffee from member farmers                       |
| Exporter    | Runs export workflows and manages certificates              |
| Admin       | Verifies users, administers the platform, resolves problems |

The role values used in code are `farmer`, `buyer`, `admin`, `exporter` and `cooperative` (`USER_ROLES` in `packages/shared`).

## The four modules

The product is one web app and one API. The work is split into four modules so that four developers can build in parallel.

| Module | Name                                 | Covers                                                                                                                               |
| ------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1      | User & Platform Management           | Authentication, the five roles, profiles, permissions, verification, administration                                                  |
| 2      | Coffee Marketplace & AI Intelligence | Coffee listings, farmer information, buyer search, AI coffee identification, quality estimation, pricing assistance, recommendations |
| 3      | Transactions, Payments & Trust       | Orders, checkout, payments, payment verification, delivery, farmer payouts, ratings, reviews, disputes, buyer protection             |
| 4      | Coffee Traceability & Value Chain    | Farm records, harvest records, GPS, coffee lot IDs, QR traceability, cooperatives, aggregation, exporter workflows, certificates     |

Each module has its own guide in [docs/modules](modules).

## What exists today

The repository contains the foundation only. No business feature is implemented yet.

- A runnable API with a health check, a standard response format, error handling and a database connection.
- A runnable web app with the layout, navigation, an API client and one entry page per module.
- Four empty, wired-in module folders in the API and in the web app.
- Shared packages for roles, API contracts and validation.
- Lint rules that enforce the module boundaries, tests, and a CI workflow.

## Decisions still open

These were not specified, so the foundation does not choose them. The owning module decides and records the decision in its module guide.

| Decision                                                                  | Owner    |
| ------------------------------------------------------------------------- | -------- |
| How users sign in and how sessions are kept                               | Module 1 |
| Which Gemini model to use, and how images are uploaded for identification | Module 2 |
| Which payment provider to use, and how payouts are sent                   | Module 3 |
| QR code format and what a public trace page shows                         | Module 4 |
| Where the apps are hosted                                                 | Team     |
