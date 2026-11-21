import { HEALTH_PATH } from '@ecb/contracts';
import { MARKETPLACE_API } from '@ecb/contracts/marketplace';
import { TRACEABILITY_API } from '@ecb/contracts/traceability';
import { TRANSACTIONS_API } from '@ecb/contracts/transactions';
import { USERS_API } from '@ecb/contracts/users';
import { describe, expect, it } from 'vitest';

// All module routers are mounted at the same API prefix, so two modules
// claiming the same route prefix would silently shadow each other.
describe('API route ownership', () => {
  it('reserves every route prefix for exactly one module', () => {
    const prefixes = [
      HEALTH_PATH,
      ...Object.values(USERS_API),
      ...Object.values(MARKETPLACE_API),
      ...Object.values(TRANSACTIONS_API),
      ...Object.values(TRACEABILITY_API),
    ];

    const duplicates = prefixes.filter((prefix, index) => prefixes.indexOf(prefix) !== index);

    expect(duplicates).toEqual([]);
  });
});
