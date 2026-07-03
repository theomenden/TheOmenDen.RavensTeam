import { useEffect, useRef, useState } from 'react';
import { getTeam } from '../twitch/helix';
import { logger } from '../logger';
import type { MembersState, TeamId, TeamMember, TwitchAuth } from '../twitch/types';

// Membership changes rarely, so a team's members are cached across tab switches — reopening a
// tab is instant and costs no request. Module-scoped so it survives TeamSection unmount/remount.
const membersCache = new Map<TeamId, readonly TeamMember[]>();

/**
 * Lazily loads a single team's members (names/ids only — avatars and live status are fetched
 * per visible row by {@link useAvatars}/{@link useLiveStatus}). Only the active tab mounts a
 * consumer, so a team is fetched the first time it's opened and cached thereafter.
 *
 * @param auth - current Twitch auth, or `null` before authorization completes.
 * @param teamId - the team to load, or `null` when nothing is active.
 */
export const useTeamMembers = (auth: TwitchAuth | null, teamId: TeamId | null): MembersState => {
  const [state, setState] = useState<MembersState>(() => {
    const cached = teamId ? membersCache.get(teamId) : undefined;
    return cached ? { status: 'ready', members: cached } : { status: 'loading' };
  });

  const authRef = useRef(auth);
  authRef.current = auth;

  useEffect(() => {
    if (teamId === null) return;

    const cached = membersCache.get(teamId);
    if (cached) {
      setState({ status: 'ready', members: cached });
      return;
    }

    let cancelled = false;
    setState({ status: 'loading' });

    const load = async (): Promise<void> => {
      const current = authRef.current;
      if (!current) return;
      const team = await getTeam(current, teamId);
      const members = team?.members ?? [];
      membersCache.set(teamId, members);
      if (!cancelled) setState({ status: 'ready', members });
    };

    load().catch((error: unknown) => {
      if (cancelled) return;
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('team members load failed', err);
      setState({ status: 'error', error: err });
    });

    return () => {
      cancelled = true;
    };
  }, [teamId]);

  return state;
};
