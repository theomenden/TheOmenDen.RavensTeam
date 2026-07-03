import { useMemo } from 'react';
import { Text } from '@fluentui/react-components';
import { RosterSkeleton } from './RosterSkeleton';
import { TeamSection } from './TeamSection';
import { useRoster } from '../data/useRoster';
import { useLiveStatus } from '../data/useLiveStatus';
import type { TwitchAuth, UserId } from '../twitch/types';

/** Props for {@link TeamList}. */
export interface TeamListProps {
  readonly auth: TwitchAuth | null;
}

/**
 * Top-level roster: loads the broadcaster's teams, polls live status across every member,
 * and renders a {@link TeamSection} per team. Covers loading, error, and empty states.
 */
export const TeamList = ({ auth }: TeamListProps) => {
  const roster = useRoster(auth);

  const allIds = useMemo<readonly UserId[]>(() => {
    if (roster.status !== 'ready') return [];
    const ids = roster.teams.flatMap((t) => t.members.map((m) => m.userId));
    return [...new Set(ids)];
  }, [roster]);

  const liveIds = useLiveStatus(auth, allIds);

  switch (roster.status) {
    case 'loading':
      return <RosterSkeleton />;
    case 'error':
      // role="alert" ⇒ announced assertively when it replaces the loading skeleton (WCAG 4.1.3).
      return <Text role="alert">Couldn't load teams right now. Please try again later.</Text>;
    case 'ready':
      return roster.teams.length === 0 ? (
        <Text role="status">This channel isn't on any teams yet.</Text>
      ) : (
        <>
          {roster.teams.map((team) => (
            <TeamSection key={team.id} team={team} liveIds={liveIds} />
          ))}
        </>
      );
  }
};
