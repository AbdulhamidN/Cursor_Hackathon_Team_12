import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * Folder names of the four feature modules. They are identical in
 * `apps/api/src/modules` and `apps/web/src/modules`.
 * Keep in sync with MODULE_IDS in `packages/shared/src/modules.ts`.
 */
const MODULE_IDS = ['users', 'marketplace', 'transactions', 'traceability'];

/** Server-only packages that must never be bundled into the browser. */
const SERVER_ONLY_PACKAGES = [
  {
    group: ['@google/genai', '@google/generative-ai'],
    message: 'Gemini is called from the API only. Call an /api/v1/ai endpoint instead.',
  },
  {
    group: ['mongoose', 'express', '@ecb/api', '@ecb/api/*'],
    message: 'Server-only code cannot be imported into the web app.',
  },
];

/** A module may use another module only through that module's public index file. */
function crossModulePattern(moduleId) {
  const others = MODULE_IDS.filter((id) => id !== moduleId).join('|');
  return {
    regex: `^(\\.\\./)+(${others})/.+`,
    message:
      "Import other modules only through their public entry (e.g. '../users'), never their internal files. See docs/integration-guide.md.",
  };
}

/** Code shared by every module must not depend on a specific module. */
const sharedCodePattern = {
  regex: `(^|/)modules/(${MODULE_IDS.join('|')})(/|$)`,
  message: 'Shared code must not import from a feature module.',
};

function restrictedImports(patterns) {
  return { 'no-restricted-imports': ['error', { patterns }] };
}

export default defineConfig([
  globalIgnores(['**/node_modules/', '**/dist/', '**/build/', '**/coverage/']),

  js.configs.recommended,
  tseslint.configs.recommended,

  {
    rules: {
      eqeqeq: ['error', 'always'],
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Node.js code: API, shared packages, tests and tooling files.
  {
    files: ['apps/api/**', 'packages/**', 'tests/**', '*.{js,ts}', 'apps/web/vite.config.ts'],
    languageOptions: { globals: globals.node },
  },

  // Browser code: the web app.
  {
    files: ['apps/web/src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: { globals: globals.browser },
    rules: restrictedImports(SERVER_ONLY_PACKAGES),
  },

  // Module boundaries. ESLint keeps only the last matching `no-restricted-imports`
  // entry per file, so every entry below lists the complete set of patterns.
  ...MODULE_IDS.map((moduleId) => ({
    files: [`apps/api/src/modules/${moduleId}/**/*.ts`],
    rules: restrictedImports([crossModulePattern(moduleId)]),
  })),
  ...MODULE_IDS.map((moduleId) => ({
    files: [`apps/web/src/modules/${moduleId}/**/*.{ts,tsx}`],
    rules: restrictedImports([...SERVER_ONLY_PACKAGES, crossModulePattern(moduleId)]),
  })),
  {
    files: ['apps/api/src/common/**/*.ts', 'apps/api/src/config/**/*.ts'],
    rules: restrictedImports([sharedCodePattern]),
  },
  {
    files: ['apps/web/src/shared/**/*.{ts,tsx}'],
    rules: restrictedImports([...SERVER_ONLY_PACKAGES, sharedCodePattern]),
  },
  {
    files: ['packages/**/*.ts'],
    rules: restrictedImports([
      {
        group: ['@ecb/api', '@ecb/api/*', '@ecb/web', '@ecb/web/*'],
        message: 'Packages must not depend on apps.',
      },
    ]),
  },

  // Must stay last: turns off stylistic rules that Prettier owns.
  prettier,
]);
