# Module 4: Coffee Traceability & Value Chain

Folder name: `traceability`

## Scope

Farm records, harvest records, GPS, coffee lot IDs, QR traceability, cooperatives, aggregation, exporter workflows and certificates.

Not in this module: cooperative and exporter _accounts_ (Module 1), listings (Module 2), delivery of an order to its buyer (Module 3).

## Owned paths

```text
apps/api/src/modules/traceability/**
apps/web/src/modules/traceability/**
packages/contracts/src/modules/traceability.ts
packages/validation/src/modules/traceability.ts     (create when first needed)
docs/modules/module-4-traceability.md
```

## Reserved routes

| Kind                 | Reserved                                                                     | Defined in                                          |
| -------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| API, under `/api/v1` | `/farms`, `/harvests`, `/lots`, `/cooperatives`, `/exports`, `/certificates` | `TRACEABILITY_API` in `@ecb/contracts/traceability` |
| Web                  | `/traceability`                                                              | `apps/web/src/modules/traceability/index.tsx`       |

## Data owned

Farms, harvests, coffee lots, cooperative membership and aggregation, export records, certificates. See [database-design.md](../database-design.md).

Store GPS locations as GeoJSON Points, `{ type: 'Point', coordinates: [longitude, latitude] }`, with a `2dsphere` index. Note the order: longitude first.

## What other modules need from this module

- Module 2 needs a way to link a listing to a coffee lot and to show a lot's summary. Export it as a function from `apps/api/src/modules/traceability/index.ts`.

## What this module needs from others

- Module 1: `requireAuth` and `requireRole`, and the accounts behind farmers, cooperatives and exporters.

Until these exist, code against the agreed signatures. See the [integration guide](../integration-guide.md).

## Open decisions

- The format of a coffee lot ID, and how it stays unique.
- What a QR code contains, and what the page it opens shows without signing in. A public page needs a route that does not use `requireAuth`.
- How aggregation records which farmer lots went into a cooperative lot.
- Which certificates are supported and how certificate files are stored.

## Endpoints

None yet. List each endpoint here as it is added.
