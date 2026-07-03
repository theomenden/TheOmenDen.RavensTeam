import { Link, Text, makeStyles, motionTokens, tokens } from '@fluentui/react-components';
import { MemberList } from './MemberList';
import { RosterSkeleton } from './RosterSkeleton';
import { useTeamMembers } from '../data/useTeamMembers';
import type { TeamHeader, TwitchAuth } from '../twitch/types';

const useStyles = makeStyles({
  section: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    marginBottom: tokens.spacingVerticalL,
  },
  banner: {
    width: '100%',
    height: 'auto',
    borderRadius: tokens.borderRadiusMedium,
    display: 'block',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: `${motionTokens.durationFast}ms`,
    transitionTimingFunction: motionTokens.curveEasyEase,
    ':hover': { transform: 'scale(1.02)', boxShadow: tokens.shadow8 },
    '@media (prefers-reduced-motion: reduce)': {
      transitionDuration: '1ms',
      ':hover': { transform: 'none' },
    },
  },
});

/** Props for {@link TeamSection}. */
export interface TeamSectionProps {
  readonly auth: TwitchAuth | null;
  readonly header: TeamHeader;
}

/**
 * One team: a clickable banner/title linking to the team page, then its member list. Members are
 * loaded lazily here (via {@link useTeamMembers}) since only the active tab mounts a section.
 */
export const TeamSection = ({ auth, header }: TeamSectionProps) => {
  const styles = useStyles();
  const members = useTeamMembers(auth, header.id);
  const teamUrl = `https://twitch.tv/team/${header.name}`;
  return (
    <section className={styles.section}>
      <Link href={teamUrl} target="_blank" rel="noopener noreferrer" appearance="subtle">
        {header.bannerUrl ? (
          <img className={styles.banner} src={header.bannerUrl} alt={`${header.displayName} team`} />
        ) : (
          <Text as="h2" weight="semibold" size={400}>
            {header.displayName}
          </Text>
        )}
      </Link>
      {members.status === 'loading' && <RosterSkeleton />}
      {members.status === 'error' && (
        <Text role="alert">Couldn't load this team's members right now.</Text>
      )}
      {members.status === 'ready' && <MemberList auth={auth} members={members.members} />}
    </section>
  );
};
