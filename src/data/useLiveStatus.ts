import { useEffect, useRef, useState } from 'react';
import { getLiveUserIds, HELIX_BATCH_LIMIT } from '../twitch/helix';
import { logger } from '../logger';
import { asUserId, type TwitchAuth, type UserId } from '../twitch/types';
import { batch } from './merge';

/** Refresh cadence. Stream state is near-real-time; 45s is responsive yet polite to Helix. */
const POLL_INTERVAL_MS = 45_000;

/**
 * Polls Helix for which of `userIds` are currently live, refreshing on an interval and
 * whenever the id set changes. Returns the set of live ids (empty until the first poll).
 *
 * @param auth - current Twitch auth, or `null` before authorization completes.
 * @param userIds - all member ids across every team; caller dedupes.
 */
export const useLiveStatus = (
  auth: TwitchAuth | null,
  userIds: readonly UserId[],
): ReadonlySet<UserId> => {
  const [liveIds, setLiveIds] = useState<ReadonlySet<UserId>>(new Set());

  const authRef = useRef(auth);
  authRef.current = auth;

  // Stable primitive key so the effect ignores array-identity churn but reacts to real changes.
  const idsKey = [...userIds].sort().join(',');

  useEffect(() => {
    if (idsKey === '') return;
    let cancelled = false;
    const ids = idsKey.split(',').map(asUserId);

    const poll = async (): Promise<void> => {
      const current = authRef.current;
      if (!current) return;
      const chunks = batch(ids, HELIX_BATCH_LIMIT);
      const sets = await Promise.all(chunks.map((chunk) => getLiveUserIds(current, chunk)));
      if (!cancelled) setLiveIds(new Set(sets.flatMap((s) => [...s])));
    };

    const run = (): void => {
      poll().catch((error: unknown) => logger.warn('live-status poll failed', error));
    };

    run();
    const timer: ReturnType<typeof setInterval> = setInterval(run, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [idsKey]);

  return liveIds;
};
