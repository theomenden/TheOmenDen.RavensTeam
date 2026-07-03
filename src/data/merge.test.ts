import { describe, expect, it } from 'vitest';
import { batch, mergeLiveStatus } from './merge';
import { asUserId, type TeamMember, type UserId } from '../twitch/types';

const member = (id: string, login: string): TeamMember => ({
  userId: asUserId(id),
  login,
  displayName: login,
  avatarUrl: null,
});

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

describe('mergeLiveStatus', () => {
  it('flags only members present in the live set', () => {
    const members = [member('1', 'alice'), member('2', 'bob'), member('3', 'cara')];
    const live = new Set<UserId>([asUserId('1'), asUserId('3')]);
    expect(mergeLiveStatus(members, live).map((m) => m.isLive)).toEqual([true, false, true]);
  });

  it('does not mutate the input members', () => {
    const members = [member('1', 'alice')];
    mergeLiveStatus(members, new Set());
    expect(members[0]).not.toHaveProperty('isLive');
  });
});
