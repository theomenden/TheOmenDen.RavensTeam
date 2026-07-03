import { describe, expect, it } from 'vitest';
import { batch } from './merge';

describe('batch', () => {
  it('splits into chunks no larger than the limit and covers every item', () => {
    const ids = Array.from({ length: 250 }, (_, i) => String(i));
    const chunks = batch(ids, 100);
    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toHaveLength(100);
    expect(chunks[2]).toHaveLength(50);
    expect(chunks.flat()).toEqual(ids);
  });

  it('returns an empty array for empty input', () => {
    expect(batch([], 100)).toEqual([]);
  });

  it('rejects a non-positive size', () => {
    expect(() => batch([1, 2], 0)).toThrow();
  });
});
