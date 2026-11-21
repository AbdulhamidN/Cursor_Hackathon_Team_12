import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Runs before every web test file: start each test with an empty page and no stubs.
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
