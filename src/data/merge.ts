import type { MemberView, TeamMember, UserId } from '../twitch/types';

/**
 * Splits `items` into chunks of at most `size`, preserving order. Used to respect Helix's
 * {@link HELIX_BATCH_LIMIT}-id ceiling on `users`/`streams` requests.
 *
 * @param items - source list; not mutated.
 * @param size - maximum chunk length; must be a positive integer.
 * @returns chunks covering every item; an empty input yields an empty array.
 * @throws Error when `size` is less than 1.
 */
export const batch = <T>(items: readonly T[], size: number): T[][] => {
  if (size < 1) throw new Error(`batch size must be >= 1, got ${size}`);
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

/**
 * Joins the (rarely-changing) roster with the (polled) live set, tagging each member with
 * `isLive`. Pure: returns a new array and never mutates its inputs. Memoize the call so the
 * virtualized list only recomputes when members or the live set actually change.
 */
export const mergeLiveStatus = (
  members: readonly TeamMember[],
  liveIds: ReadonlySet<UserId>,
): readonly MemberView[] => members.map((m) => ({ ...m, isLive: liveIds.has(m.userId) }));
