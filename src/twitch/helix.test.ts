import { describe, expect, it } from 'vitest';
import { retryDelayMs } from './helix';

const resWith = (headers: Record<string, string>): Response =>
  ({ headers: new Headers(headers) }) as Response;

describe('retryDelayMs', () => {
  it('honors Retry-After seconds', () => {
    expect(retryDelayMs(resWith({ 'retry-after': '2' }), 0)).toBe(2000);
  });

  it('caps an absurd Retry-After at 10s', () => {
    expect(retryDelayMs(resWith({ 'retry-after': '9999' }), 0)).toBe(10_000);
  });

  it('grows the fallback backoff with the attempt when no rate-limit headers', () => {
    const d0 = retryDelayMs(resWith({}), 0);
    const d3 = retryDelayMs(resWith({}), 3);
    expect(d0).toBeGreaterThanOrEqual(500);
    expect(d0).toBeLessThan(750); // 500 base + <250ms jitter
    expect(d3).toBeGreaterThanOrEqual(4000); // 500 * 2^3
  });
});
