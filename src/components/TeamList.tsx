import { Activity, useState } from 'react';
import { Tab, TabList, Text, makeStyles, motionTokens, tokens } from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent } from '@fluentui/react-components';
import { RosterSkeleton } from './RosterSkeleton';
import { TeamSection } from './TeamSection';
import { useTeams } from '../data/useTeams';
import type { TeamId, TwitchAuth } from '../twitch/types';

const useStyles = makeStyles({
  // Fade + slide-up the roster in once, when loading resolves to teams.
  reveal: {
    animationName: {
      from: { opacity: 0, transform: 'translateY(8px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animationDuration: `${motionTokens.durationGentle}ms`,
    animationTimingFunction: motionTokens.curveDecelerateMid,
    animationFillMode: 'both',
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none' },
  },
  tabs: {
    marginBottom: tokens.spacingVerticalS,
  },
});

/** Props for {@link TeamList}. */
export interface TeamListProps {
  readonly auth: TwitchAuth | null;
}

/**
 * Top-level roster: loads the broadcaster's team headers and renders one tab per team. Only the
 * active tab's {@link TeamSection} is mounted, so a team's members, avatars, and live status load
 * lazily the first time its tab is opened. Covers loading, error, and empty states.
 */
export const TeamList = ({ auth }: TeamListProps) => {
  const styles = useStyles();
  const teams = useTeams(auth);
  const [selected, setSelected] = useState<TeamId | null>(null);

  switch (teams.status) {
    case 'loading':
      return <RosterSkeleton />;
    case 'error':
      // role="alert" ⇒ announced assertively when it replaces the loading skeleton (WCAG 4.1.3).
      return <Text role="alert">Couldn't load teams right now. Please try again later.</Text>;
    case 'ready': {
      // Default to the first team until the viewer picks a tab; no teams ⇒ empty state.
      const active = teams.teams.find((t) => t.id === selected) ?? teams.teams[0];
      if (!active) {
        return <Text role="status">This channel isn't on any teams yet.</Text>;
      }
      const onTabSelect = (_: SelectTabEvent, data: SelectTabData): void =>
        setSelected(data.value as TeamId);
      return (
        <div className={styles.reveal}>
          {teams.teams.length > 1 && (
            <TabList
              className={styles.tabs}
              selectedValue={active.id}
              onTabSelect={onTabSelect}
              size="small"
            >
              {teams.teams.map((team) => (
                <Tab key={team.id} value={team.id}>
                  {team.displayName}
                </Tab>
              ))}
            </TabList>
          )}
          {/*
            Every team stays mounted; Activity shows the active one and hides the rest.
            Hidden tabs keep their state (loaded members, avatars, scroll position) but their
            effects are torn down — so only the visible team polls live status, and a team that
            has never been shown never runs its fetch effects (laziness preserved).
          */}
          {teams.teams.map((team) => (
            <Activity key={team.id} mode={team.id === active.id ? 'visible' : 'hidden'} name={team.name}>
              <TeamSection auth={auth} header={team} />
            </Activity>
          ))}
        </div>
      );
    }
  }
};
