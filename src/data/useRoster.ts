import { useEffect, useRef, useState } from 'react';
import { getChannelTeams, getTeam, getUserAvatars, HELIX_BATCH_LIMIT } from '../twitch/helix';
import { logger } from '../logger';
import { batch } from './merge';
import type { RosterState, Team, TeamMember, TwitchAuth, UserId } from '../twitch/types';

/** Fetches avatars for every member, batching ids to Helix's per-request limit. */
const loadAvatars = async (
  auth: TwitchAuth,
  members: readonly TeamMember[],
): Promise<ReadonlyMap<UserId, string>> => {
  const chunks = batch(
    members.map((m) => m.userId),
    HELIX_BATCH_LIMIT,
  );
  const maps = await Promise.all(chunks.map((chunk) => getUserAvatars(auth, chunk)));
  return new Map(maps.flatMap((m) => [...m]));
};

/**
 * Loads the broadcaster's teams and members (with avatars) once per channel. Teams and
 * membership change rarely, so this does not poll — {@link useLiveStatus} handles the
 * frequently-changing live state. Re-runs only when the channel changes; token refreshes
 * are picked up via a ref without refetching.
 *
 * @param auth - current Twitch auth, or `null` before authorization completes.
 */
export const useRoster = (auth: TwitchAuth | null): RosterState => {
  const [state, setState] = useState<RosterState>({ status: 'loading' });

  const authRef = useRef(auth);
  authRef.current = auth;

  const channelId = auth?.channelId ?? null;

  useEffect(() => {
    if (channelId === null) return;
    let cancelled = false;
    setState({ status: 'loading' });

    const load = async (): Promise<void> => {
      const current = authRef.current;
      if (!current) return;
      const channelTeams = await getChannelTeams(current, current.channelId);
      const teams = await Promise.all(
        channelTeams.map(async (ct): Promise<Team | null> => {
          const team = await getTeam(current, ct.id);
          if (!team) return null;
          const avatars = await loadAvatars(current, team.members);
          const members: readonly TeamMember[] = team.members.map((m) => ({
            ...m,
            avatarUrl: avatars.get(m.userId) ?? null,
          }));
          return { ...team, members };
        }),
      );
      if (!cancelled) {
        setState({ status: 'ready', teams: teams.filter((t): t is Team => t !== null) });
      }
    };

    load().catch((error: unknown) => {
      if (cancelled) return;
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('roster load failed', err);
      setState({ status: 'error', error: err });
    });

    return () => {
      cancelled = true;
    };
  }, [channelId]);

  return state;
};
