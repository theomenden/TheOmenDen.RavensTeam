import { useEffect, useRef, useState } from 'react';
import { getUserAvatars, HELIX_BATCH_LIMIT } from '../twitch/helix';
import { batch } from './merge';
import { logger } from '../logger';
import { asUserId, type TwitchAuth, type UserId } from '../twitch/types';

/**
 * Fetches avatar URLs for the given ids (typically just the rows visible in the viewport) and
 * accumulates them into a growing map. Ids already requested are never refetched — avatars are
 * immutable — so scrolling only ever fetches newly-seen rows. The Helix rate-limit guard in
 * `helix.ts` throttles the batched requests.
 *
 * @param auth - current Twitch auth, or `null` before authorization completes.
 * @param ids - user ids to ensure avatars for; caller passes the current visible window.
 * @returns cumulative id → avatar URL map (empty until the first fetch resolves).
 */
export const useAvatars = (
  auth: TwitchAuth | null,
  ids: readonly UserId[],
): ReadonlyMap<UserId, string> => {
  const [avatars, setAvatars] = useState<ReadonlyMap<UserId, string>>(new Map());
  const requested = useRef<Set<UserId>>(new Set());

  const authRef = useRef(auth);
  authRef.current = auth;

  // Stable primitive key so the effect reacts to real changes, not array-identity churn.
  const idsKey = ids.join(',');

  useEffect(() => {
    if (idsKey === '') return;
    const current = authRef.current;
    if (!current) return;

    const missing = idsKey
      .split(',')
      .map(asUserId)
      .filter((id) => !requested.current.has(id));
    if (missing.length === 0) return;
    missing.forEach((id) => requested.current.add(id));

    let cancelled = false;
    const load = async (): Promise<void> => {
      const chunks = batch(missing, HELIX_BATCH_LIMIT);
      const maps = await Promise.all(chunks.map((chunk) => getUserAvatars(current, chunk)));
      if (cancelled) return;
      setAvatars((prev) => {
        const next = new Map(prev);
        for (const map of maps) for (const [id, url] of map) next.set(id, url);
        return next;
      });
    };

    load().catch((error: unknown) => {
      // Cosmetic data — log and let those ids retry on a later pass.
      missing.forEach((id) => requested.current.delete(id));
      logger.warn('avatar load failed', error);
    });

    return () => {
      cancelled = true;
    };
  }, [idsKey]);

  return avatars;
};
