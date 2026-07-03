import { useEffect, useRef, useState } from 'react';
import { getChannelTeams } from '../twitch/helix';
import { logger } from '../logger';
import { asTeamId, type TeamHeader, type TeamsState, type TwitchAuth } from '../twitch/types';

/**
 * Loads the broadcaster's team *headers* (id + branding, no members) — enough to render the
 * tabs. Members, avatars, and live status are loaded lazily per active tab, so this stays a
 * single cheap request no matter how large the teams are. Re-runs only when the channel changes.
 *
 * @param auth - current Twitch auth, or `null` before authorization completes.
 */
export const useTeams = (auth: TwitchAuth | null): TeamsState => {
  const [state, setState] = useState<TeamsState>({ status: 'loading' });

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
      const raw = await getChannelTeams(current, current.channelId);
      const teams: readonly TeamHeader[] = raw.map((t) => ({
        id: asTeamId(t.id),
        name: t.team_name,
        displayName: t.team_display_name,
        bannerUrl: t.banner,
      }));
      if (!cancelled) setState({ status: 'ready', teams });
    };

    load().catch((error: unknown) => {
      if (cancelled) return;
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error('teams load failed', err);
      setState({ status: 'error', error: err });
    });

    return () => {
      cancelled = true;
    };
  }, [channelId]);

  return state;
};
