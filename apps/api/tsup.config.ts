import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  // The @ecb/* workspace packages ship TypeScript source, so they are bundled
  // into the output. Third-party dependencies stay external.
  noExternal: [/^@ecb\//],
});
