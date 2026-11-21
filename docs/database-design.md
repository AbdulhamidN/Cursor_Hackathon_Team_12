# Database design

## Choice of database

The project uses **MongoDB with Mongoose**, in one database shared by all four modules.

No separate requirements document existed when the foundation was built, so the choice was checked against the four module descriptions:

| Requirement                                                | Fit                                                         |
| ---------------------------------------------------------- | ----------------------------------------------------------- |
| Listings, farm and harvest records with varying attributes | Good. Documents handle optional and nested fields naturally |
| GPS locations for farms                                    | Good. MongoDB has built-in geospatial indexes and queries   |
| Buyer search over listings                                 | Good for filters and text search at hackathon scale         |
| Orders, payments and payouts that must stay consistent     | Works, with one condition described below                   |

**The condition:** changing several documents atomically (for example, marking an order paid and recording the payment) needs a multi-document transaction, and MongoDB transactions require a replica set. MongoDB Atlas is always a replica set. A default local install and the provided Docker Compose file run a standalone server, where transactions fail. Module 3 should therefore either design money-related writes as single-document updates, or the team should use Atlas for shared development. This is an open decision for Module 3.

## No models exist yet

The foundation defines no collections and no Mongoose models. Each module owner designs the models for their own data and documents them in their module guide.

## Data ownership

Every collection belongs to exactly one module. Only the owning module reads or writes it.

| Module           | Owns the data for                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| 1 `users`        | User accounts, roles, profiles, verification status                                                |
| 2 `marketplace`  | Coffee listings, saved AI results (identification, quality, pricing)                               |
| 3 `transactions` | Orders, payments, deliveries, payouts, ratings and reviews, disputes                               |
| 4 `traceability` | Farms, harvests, coffee lots, cooperative membership and aggregation, export records, certificates |

Some concepts appear in two module descriptions. The proposed split, to confirm as a team:

- **Farmer information:** Module 1 owns the account and profile. Module 4 owns farm records. Module 2 shows this information on listings but does not keep its own master copy.
- **Cooperatives:** Module 1 owns the cooperative's _account_ (a user with the `cooperative` role). Module 4 owns what the cooperative _does_: membership and aggregation.
- **Verification:** Module 1 verifies users. Module 3 verifies payments. Module 4 handles certificates.

## Rules

1. **Models live inside the owning module**, in `apps/api/src/modules/<module>/`. A model is private: it is never exported from the module's `index.ts`.
2. **Reference other modules' data by id only.** Store the other document's id (for example `farmerId`). Do not use Mongoose `populate` or `ref` across modules.
3. **Read other modules' data through their public entry.** If Module 3 needs a listing's price, it calls a function that Module 2 exports from `apps/api/src/modules/marketplace/index.ts`. It does not import Module 2's model or query its collection.
4. **Copy what must not change.** When a record must keep a value as it was at a point in time (for example, the price on an order), store a copy of that value instead of looking it up later.

## Conventions

| Topic            | Convention                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| Model names      | Singular PascalCase (`CoffeeLot`). Mongoose creates the plural, lowercase collection name                            |
| Field names      | camelCase                                                                                                            |
| Ids              | MongoDB `ObjectId`. Sent over the API as a 24-character string named `id`, never `_id`                               |
| References       | `<thing>Id`, for example `buyerId`, `listingId`, `lotId`                                                             |
| Timestamps       | Enable `timestamps: true` on every schema (`createdAt`, `updatedAt`)                                                 |
| Dates in the API | ISO 8601 strings in UTC                                                                                              |
| Enumerations     | Lowercase strings with underscores (`pending_payment`), defined once as a `const` array and reused in the Zod schema |
| GPS locations    | GeoJSON Point: `{ type: 'Point', coordinates: [longitude, latitude] }`, with a `2dsphere` index                      |
| Deleting         | Prefer a status field over deleting records that other modules may reference                                         |

Two conventions to confirm as a team before Modules 2 and 3 store prices:

- **Money:** store amounts as whole numbers in the smallest currency unit, together with a currency code, to avoid rounding errors.
- **Weight:** store one unit everywhere (for example kilograms) and convert only for display.

## Connection

- The connection string is `MONGODB_URI` in `.env`. The default is `mongodb://127.0.0.1:27017/ethiopian_coffee_buy`.
- `apps/api/src/config/database.ts` opens the single shared connection at startup. Modules use it implicitly through `mongoose.model(...)` and never open their own connection.
- If MongoDB is unreachable in development, the API still starts and the health check reports `"database": "disconnected"`. In production the API exits.
