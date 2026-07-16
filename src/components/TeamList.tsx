import { Activity, useState } from 'react';
import { Text, makeStyles, motionTokens } from '@fluentui/react-components';
import { PanelHeader } from './PanelHeader';
import { RosterSkeleton } from './RosterSkeleton';
import { TeamSection } from './TeamSection';
import { useTeams } from '../data/useTeams';
import { useFollowedChannels } from '../data/useFollowedChannels';
import type { TeamId, TwitchAuth } from '../twitch/types';

const useStyles = makeStyles({
  // Flex column that fills the panel: the always-on header pins on top, the body fills the rest.
  // Fade + slide-up the whole panel in once on mount.
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    animationName: {
      from: { opacity: 0, transform: 'translateY(8px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animationDuration: `${motionTokens.durationGentle}ms`,
    animationTimingFunction: motionTokens.curveDecelerateMid,
    animationFillMode: 'both',
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none' },
  },
  // The one scroll owner from here down is MemberList; this just gives it a bounded height to fill.
  body: {
    flex: 1,
    minHeight: 0,
  },
});

/** Props for {@link TeamList}. */
export interface TeamListProps {
  readonly auth: TwitchAuth | null;
}

/**
 * Top-level roster. Always renders the {@link PanelHeader} (brand bar + team dropdown), then a body
 * that reflects the team-headers fetch: loading, error, empty, an unpicked-yet prompt, or the
 * active team's {@link TeamSection}. Selection starts empty — the viewer picks a team from the
 * dropdown. Every team stays mounted once a selection is made, so a team's members, avatars, and
 * live status load lazily the first time its tab is shown.
 */
export const TeamList = ({ auth }: TeamListProps) => {
  const styles = useStyles();
  const teams = useTeams(auth);
  // Registered once here (the single ancestor of every team) so the global onFollow callback isn't
  // clobbered by the always-mounted per-team lists below.
  const followed = useFollowedChannels();
  const [selected, setSelected] = useState<readonly TeamId[]>([]);
  // Active team's member count, lifted from the visible TeamSection into the header.
  const [memberCount, setMemberCount] = useState<number | null>(null);

  const teamHeaders = teams.status === 'ready' ? teams.teams : [];
  // Auto-open the first team until the viewer picks another; the header dropdown reflects whichever
  // team is active. Derived (not seeded into state) so there's no effect to keep in sync.
  const active = teamHeaders.find((team) => team.id === selected[0]) ?? teamHeaders[0];
  const activeSelection = active ? [active.id] : [];

  return (
    // Layout-only wrapper, so it stays a div: it exists to stack the header and body, and keeping
    // it neutral is what leaves PanelHeader's <header> a top-level banner landmark rather than a
    // header nested inside <main> (which demotes it to a plain section header).
    <div className={styles.root}>
      <PanelHeader
        teams={teamHeaders}
        selected={activeSelection}
        onSelect={setSelected}
        memberCount={memberCount}
      />
      <main className={styles.body}>
        {teams.status === 'loading' && <RosterSkeleton />}
        {/* role="alert" ⇒ announced assertively when it replaces the loading skeleton (WCAG 4.1.3). */}
        {teams.status === 'error' && (
          <Text role="alert">Couldn't load teams right now. Please try again later.</Text>
        )}
        {teams.status === 'ready' && teamHeaders.length === 0 && (
          <Text role="status">This channel isn't on any teams yet.</Text>
        )}
        {/*
          Every team stays mounted; Activity shows the active one and hides the rest. Hidden tabs
          keep their state (loaded members, avatars, scroll position) but their effects are torn
          down — so only the visible team polls live status, and a team that has never been shown
          never runs its fetch effects (laziness preserved).
        */}
        {teams.status === 'ready' &&
          active &&
          teamHeaders.map((team) => (
            <Activity
              key={team.id}
              mode={team.id === active.id ? 'visible' : 'hidden'}
              name={team.name}
            >
              <TeamSection
                auth={auth}
                header={team}
                followed={followed}
                onCountChange={setMemberCount}
              />
            </Activity>
          ))}
      </main>
    </div>
  );
};
