import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// globals:false means RTL's auto-cleanup isn't registered — do it explicitly.
afterEach(cleanup);
