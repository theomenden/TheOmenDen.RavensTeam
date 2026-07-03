import { Activity, useState } from 'react';
import { Link, Tab, TabList, Text, makeStyles, motionTokens, tokens } from '@fluentui/react-components';
import type { SelectTabData, SelectTabEvent } from '@fluentui/react-components';
import { RosterSkeleton } from './RosterSkeleton';
import { TeamSection } from './TeamSection';
import { useTeams } from '../data/useTeams';
import type { TeamId, TwitchAuth } from '../twitch/types';

const useStyles = makeStyles({
  // Flex column that fills the panel: pinned header on top, scrolling roster below.
  // Fade + slide-up the roster in once, when loading resolves to teams.
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
  // Sticky header: brand identity block + tabs. Never shrinks, so it stays put while the roster
  // scrolls beneath it (the GitHub / Pokémon-extension pattern).
  header: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalS,
  },
  // Brand-tinted identity card, like the broadcaster's original "Raven's Team / <team>" banner.
  brandBlock: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
    backgroundColor: tokens.colorBrandBackground2,
    borderRadius: tokens.borderRadiusMedium,
    paddingBlock: tokens.spacingVerticalM,
    paddingInline: tokens.spacingHorizontalM,
  },
  brandLabel: {
    color: tokens.colorBrandForeground1,
  },
  // Team title wraps to as many lines as it needs — no truncation.
  title: {
    overflowWrap: 'break-word',
  },
  banner: {
    display: 'block',
    width: '100%',
    height: 'auto',
    borderRadius: tokens.borderRadiusMedium,
  },
  // Tabs wrap onto new rows instead of scrolling/truncating, so every team name reads in full.
  tabStrip: {
    flexWrap: 'wrap',
    rowGap: tokens.spacingVerticalXXS,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
  // Cap each tab at the strip width so a long single name wraps inside the tab (the tab is a
  // grid with flexShrink:0, so without this it sizes to max-content and overflows/clips).
  tab: {
    maxWidth: '100%',
  },
  tabLabel: {
    whiteSpace: 'normal',
    overflowWrap: 'break-word',
    textAlign: 'left',
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
      const activeUrl = `https://twitch.tv/team/${active.name}`;
      return (
        <div className={styles.root}>
          <div className={styles.header}>
            {/* Branded identity card for the active team — rendered from the cheap team-header
                data, so it shows instantly without waiting for the member fetch. */}
            <div className={styles.brandBlock}>
              <Text className={styles.brandLabel} size={200} weight="semibold">
                Raven's Team
              </Text>
              <Link href={activeUrl} target="_blank" rel="noopener noreferrer" appearance="subtle">
                {active.bannerUrl ? (
                  <img
                    className={styles.banner}
                    src={active.bannerUrl}
                    alt={`${active.displayName} team`}
                  />
                ) : (
                  <Text className={styles.title} as="h2" weight="bold" size={600}>
                    {active.displayName}
                  </Text>
                )}
              </Link>
            </div>
            {teams.teams.length > 1 && (
              <TabList
                className={styles.tabStrip}
                selectedValue={active.id}
                onTabSelect={onTabSelect}
                size="small"
              >
                {teams.teams.map((team) => (
                  <Tab key={team.id} value={team.id} className={styles.tab}>
                    <span className={styles.tabLabel}>{team.displayName}</span>
                  </Tab>
                ))}
              </TabList>
            )}
          </div>
          {/*
            Every team stays mounted; Activity shows the active one and hides the rest.
            Hidden tabs keep their state (loaded members, avatars, scroll position) but their
            effects are torn down — so only the visible team polls live status, and a team that
            has never been shown never runs its fetch effects (laziness preserved).
          */}
          <div className={styles.body}>
            {teams.teams.map((team) => (
              <Activity key={team.id} mode={team.id === active.id ? 'visible' : 'hidden'} name={team.name}>
                <TeamSection auth={auth} header={team} />
              </Activity>
            ))}
          </div>
        </div>
      );
    }
  }
};
