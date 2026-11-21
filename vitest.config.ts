import { defineConfig } from 'vitest/config';

// One test runner for the whole repository: `npm test`.
// Run a single project with `npx vitest run --project node` (or `web`).
export default defineConfig({
  test: {
    projects: [
      {
        // API, shared packages and the cross-module tests in /tests.
        test: {
          name: 'node',
          environment: 'node',
          include: [
            'apps/api/src/**/*.test.ts',
            'packages/*/src/**/*.test.ts',
            'tests/**/*.test.ts',
          ],
        },
      },
      {
        // React components, rendered in a simulated browser.
        extends: './apps/web/vite.config.ts',
        test: {
          name: 'web',
          root: './apps/web',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['src/test-setup.ts'],
        },
      },
    ],
  },
});
